import {
  listSupportInbox,
  listSupportInboxMessages,
  replySupportMessage,
  replySupportMessageMedia,
  readSupportInbox,
  updateSupportStatus
} from 'utils/api/support'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  messages: [],
  current: null,
  loading: false,
  loadingMessages: false,
  sending: false,
  error: ''
}

const LOADING_GET_INBOX = 'LOADING_GET_INBOX'
const SUCCESS_GET_INBOX = 'SUCCESS_GET_INBOX'
const ERROR_GET_INBOX = 'ERROR_GET_INBOX'

const LOADING_GET_INBOX_MESSAGES = 'LOADING_GET_INBOX_MESSAGES'
const SUCCESS_GET_INBOX_MESSAGES = 'SUCCESS_GET_INBOX_MESSAGES'
const ERROR_GET_INBOX_MESSAGES = 'ERROR_GET_INBOX_MESSAGES'

const LOADING_REPLY_SUPPORT = 'LOADING_REPLY_SUPPORT'
const SUCCESS_REPLY_SUPPORT = 'SUCCESS_REPLY_SUPPORT'
const ERROR_REPLY_SUPPORT = 'ERROR_REPLY_SUPPORT'

const LOADING_SUPPORT_STATUS = 'LOADING_SUPPORT_STATUS'
const SUCCESS_SUPPORT_STATUS = 'SUCCESS_SUPPORT_STATUS'
const ERROR_SUPPORT_STATUS = 'ERROR_SUPPORT_STATUS'

const SELECT_SUPPORT_CHAT = 'SELECT_SUPPORT_CHAT'
const SUPPORT_INBOX_EVENT = 'SUPPORT_INBOX_EVENT'
const READ_SUPPORT_CHAT_LOCAL = 'READ_SUPPORT_CHAT_LOCAL'

// sube (o inserta) un chat al tope de la lista, como bandeja ordenada por actividad
const upsertChat = (list, chat) => {
  if (!chat || !chat._id) return list
  const rest = list.filter(item => item._id !== chat._id)
  return [chat, ...rest]
}

export default function reducer (state = initialData, action) {
  switch (action.type) {
    // INBOX
    case LOADING_GET_INBOX:
      return loadingReducer(state)
    case ERROR_GET_INBOX:
      return errorReducer(state, action.payload)
    case SUCCESS_GET_INBOX:
      return successReducer(state, { list: action.payload })

    // MENSAJES DE UN CHAT
    case LOADING_GET_INBOX_MESSAGES:
      return { ...state, loadingMessages: true }
    case ERROR_GET_INBOX_MESSAGES:
      return { ...state, loadingMessages: false, error: action.payload }
    case SUCCESS_GET_INBOX_MESSAGES:
      return { ...state, loadingMessages: false, messages: action.payload }

    // RESPONDER
    case LOADING_REPLY_SUPPORT:
      return { ...state, sending: true }
    case ERROR_REPLY_SUPPORT:
      return { ...state, sending: false, error: action.payload }
    case SUCCESS_REPLY_SUPPORT:
      return {
        ...state,
        sending: false,
        messages: state.messages.some(m => m._id === action.payload._id)
          ? state.messages
          : [...state.messages, action.payload]
      }

    // ESTADO (abierto / resuelto)
    case LOADING_SUPPORT_STATUS:
      return state
    case ERROR_SUPPORT_STATUS:
      return { ...state, error: action.payload }
    case SUCCESS_SUPPORT_STATUS:
      return {
        ...state,
        list: state.list.map(chat =>
          chat._id === action.payload._id ? { ...chat, status: action.payload.status } : chat
        )
      }

    // SELECCIÓN
    case SELECT_SUPPORT_CHAT:
      return { ...state, current: action.payload, messages: [] }

    // TIEMPO REAL (evento socket 'support-inbox': mensaje nuevo + chat actualizado)
    case SUPPORT_INBOX_EVENT: {
      const { message, chat } = action.payload
      const isCurrent = state.current && message &&
        (message.supportChat === state.current)

      return {
        ...state,
        list: upsertChat(state.list, chat),
        messages: isCurrent && !state.messages.some(m => m._id === message._id)
          ? [...state.messages, message]
          : state.messages
      }
    }

    case READ_SUPPORT_CHAT_LOCAL:
      return {
        ...state,
        list: state.list.map(chat =>
          chat._id === action.payload ? { ...chat, countAgent: 0 } : chat
        )
      }

    default:
      return state
  }
}

// actions
export const getSupportInbox = (params = {}, extra = {}) => {
  return {
    types: [LOADING_GET_INBOX, SUCCESS_GET_INBOX, ERROR_GET_INBOX],
    promise: () => listSupportInbox(params),
    ...extra
  }
}

export const getSupportMessages = (id, params = {}, extra = {}) => {
  return {
    types: [LOADING_GET_INBOX_MESSAGES, SUCCESS_GET_INBOX_MESSAGES, ERROR_GET_INBOX_MESSAGES],
    promise: () => listSupportInboxMessages(id, params),
    ...extra
  }
}

export const sendSupportReply = (data, extra = {}) => {
  return {
    types: [LOADING_REPLY_SUPPORT, SUCCESS_REPLY_SUPPORT, ERROR_REPLY_SUPPORT],
    promise: () => replySupportMessage(data),
    ...extra
  }
}

export const sendSupportReplyMedia = (formData, extra = {}) => {
  return {
    types: [LOADING_REPLY_SUPPORT, SUCCESS_REPLY_SUPPORT, ERROR_REPLY_SUPPORT],
    promise: () => replySupportMessageMedia(formData),
    ...extra
  }
}

export const changeSupportStatus = (id, status, extra = {}) => {
  return {
    types: [LOADING_SUPPORT_STATUS, SUCCESS_SUPPORT_STATUS, ERROR_SUPPORT_STATUS],
    promise: () => updateSupportStatus(id, { status }),
    ...extra
  }
}

export const selectSupportChat = id => {
  return { type: SELECT_SUPPORT_CHAT, payload: id }
}

export const supportInboxEvent = data => {
  return { type: SUPPORT_INBOX_EVENT, payload: data }
}

// marca leído en local y en la API (best-effort)
export const readSupportChat = id => async dispatch => {
  dispatch({ type: READ_SUPPORT_CHAT_LOCAL, payload: id })
  try {
    await readSupportInbox(id)
  } catch (error) {
    // silencioso
  }
}
