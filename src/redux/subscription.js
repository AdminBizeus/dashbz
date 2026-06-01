import { listSubscriptions, createManualSubscription, removeSubscription } from 'utils/api/subscription'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  current: null,
  loading: false,
  loadingCreate: false,
  error: ''
}

const LOADING_GET_SUBSCRIPTIONS = 'LOADING_GET_SUBSCRIPTIONS'
const SUCCESS_GET_SUBSCRIPTIONS = 'SUCCESS_GET_SUBSCRIPTIONS'
const ERROR_GET_SUBSCRIPTIONS   = 'ERROR_GET_SUBSCRIPTIONS'

const LOADING_CREATE_SUBSCRIPTION = 'LOADING_CREATE_SUBSCRIPTION'
const SUCCESS_CREATE_SUBSCRIPTION = 'SUCCESS_CREATE_SUBSCRIPTION'
const ERROR_CREATE_SUBSCRIPTION   = 'ERROR_CREATE_SUBSCRIPTION'

const LOADING_DELETE_SUBSCRIPTION = 'LOADING_DELETE_SUBSCRIPTION'
const SUCCESS_DELETE_SUBSCRIPTION = 'SUCCESS_DELETE_SUBSCRIPTION'
const ERROR_DELETE_SUBSCRIPTION   = 'ERROR_DELETE_SUBSCRIPTION'

export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOADING_GET_SUBSCRIPTIONS:
      return loadingReducer(state)
    case ERROR_GET_SUBSCRIPTIONS:
      return errorReducer(state, action.payload)
    case SUCCESS_GET_SUBSCRIPTIONS:
      return successReducer(state, { list: action.payload })

    case LOADING_CREATE_SUBSCRIPTION:
      return { ...state, loadingCreate: true, error: '' }
    case SUCCESS_CREATE_SUBSCRIPTION:
      return { ...state, loadingCreate: false }
    case ERROR_CREATE_SUBSCRIPTION:
      return { ...state, loadingCreate: false, error: action.payload }

    case LOADING_DELETE_SUBSCRIPTION:
      return { ...state, loadingDelete: true }
    case SUCCESS_DELETE_SUBSCRIPTION:
      return { ...state, loadingDelete: false }
    case ERROR_DELETE_SUBSCRIPTION:
      return { ...state, loadingDelete: false }

    default:
      return state
  }
}

export const getSubscriptions = (params = {}) => ({
  types: [LOADING_GET_SUBSCRIPTIONS, SUCCESS_GET_SUBSCRIPTIONS, ERROR_GET_SUBSCRIPTIONS],
  promise: () => listSubscriptions({ ...params, populate: ['company'] })
})

export const createManual = (data, callbacks = {}) => ({
  types: [LOADING_CREATE_SUBSCRIPTION, SUCCESS_CREATE_SUBSCRIPTION, ERROR_CREATE_SUBSCRIPTION],
  promise: () => createManualSubscription(data),
  ...callbacks
})

export const deleteManual = (id, callbacks = {}) => ({
  types: [LOADING_DELETE_SUBSCRIPTION, SUCCESS_DELETE_SUBSCRIPTION, ERROR_DELETE_SUBSCRIPTION],
  promise: () => removeSubscription(id),
  ...callbacks
})
