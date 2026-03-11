import { session } from 'utils'

export const Admin = () => {
  const jwt = session.getCookie('jwt')
  const userSession = session.getCookie('user')
  const user = userSession ? JSON.parse(userSession) : null

  if (user && jwt) {
    // Verificar que el usuario tenga rol de Admin
    const isAdmin = user.rol 
    return isAdmin
  }

  return false
}
