import io from 'socket.io-client'
import { server } from 'config'
import { getCookie } from 'utils/functions/session'

// Mismo patrón que crmbz/src/lib/socket.js: conexión al socket de apibz con el
// JWT de la cookie. El staff de soporte queda unido al room 'support-agents'
// del lado del servidor (apibz/src/lib/io.js, según SUPPORT_AGENT_EMAILS).
const uri = server.env === 'development'
  ? server.localUrl
  : server.productionUrl

let socket = null

const defaultToken = getCookie('jwt')

// Conexión automática si ya hay sesión
if (defaultToken) {
  socket = io(uri, {
    withCredentials: true,
    query: {
      token: defaultToken
    }
  })
}

/**
 * Conecta el socket manualmente (post-login o si aún no existe)
 * @param {string} token
 * @returns {Socket|null}
 */
const connect = (token) => {
  if (socket && socket.connected) return socket

  const jwt = token || getCookie('jwt')
  if (!jwt) {
    console.warn('⚠️ No se encontró token para conectar socket')
    return null
  }

  socket = io(uri, {
    withCredentials: true,
    query: {
      token: jwt
    }
  })

  return socket
}

const disconnect = () => {
  if (socket) {
    socket.close()
    socket = null
  }
}

export { socket, connect, disconnect }
