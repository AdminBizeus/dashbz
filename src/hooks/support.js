import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { socket, connect } from '../lib/socket'
import { useReduxState } from './redux'
import {
  getSupportInbox,
  getSupportMessages,
  sendSupportReply,
  sendSupportReplyMedia,
  changeSupportStatus,
  selectSupportChat,
  supportInboxEvent,
  readSupportChat
} from '../redux/support'

export const useSupportInbox = () => {
  const state = useReduxState('support')
  const dispatch = useDispatch()

  // ref para leer el chat abierto dentro del handler del socket sin re-suscribir
  const currentRef = useRef(state.current)
  useEffect(() => {
    currentRef.current = state.current
  }, [state.current])

  useEffect(() => {
    dispatch(getSupportInbox())

    const activeSocket = socket || connect()
    if (!activeSocket) return

    const handleSupportInbox = data => {
      if (data.action === 'create' && data.message) {
        dispatch(supportInboxEvent(data))
        // si el mensaje es del usuario y su chat está abierto en pantalla, marcarlo leído
        if (data.message.sender === 'user' && data.message.supportChat === currentRef.current) {
          dispatch(readSupportChat(currentRef.current))
        }
      }
    }

    activeSocket.on('support-inbox', handleSupportInbox)

    return () => {
      activeSocket.off('support-inbox', handleSupportInbox)
    }
  }, [])

  const openChat = chat => {
    dispatch(selectSupportChat(chat._id))
    dispatch(getSupportMessages(chat._id))
    dispatch(readSupportChat(chat._id))
  }

  const reply = text => {
    if (!state.current || !text) return
    dispatch(sendSupportReply({ supportChat: state.current, text }))
  }

  // adjunto del agente: mismo esquema que el widget de crmbz (file + data JSON)
  const replyMedia = file => {
    if (!state.current || !file) return
    const typeMsg = file.type.startsWith('image/') ? 'image'
      : file.type.startsWith('video/') ? 'video'
        : file.type.startsWith('audio/') ? 'audio' : 'document'
    const formData = new window.FormData()
    formData.append('file', file)
    formData.append('data', JSON.stringify({ supportChat: state.current, typeMsg }))
    dispatch(sendSupportReplyMedia(formData))
  }

  const setStatus = status => {
    if (!state.current) return
    dispatch(changeSupportStatus(state.current, status))
  }

  const currentChat = state.list.find(chat => chat._id === state.current) || null

  return { ...state, currentChat, openChat, reply, replyMedia, setStatus }
}
