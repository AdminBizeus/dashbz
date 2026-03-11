import { logoutUser } from 'redux-path/auth'
import { Header } from 'components-path'
import { useLogout } from '../../hooks/auth'
import { useReduxState } from '../../hooks/redux'

export const NavBar = () => {
  const authState = useReduxState('auth')
  const handleLogout = useLogout(logoutUser, '/login')
  return <Header handleLogout={handleLogout} user={authState.user} />
}
