import { loginUser } from 'redux-path/auth'
import { LoginForm } from '../components/form'
import { useLogin } from 'hooks-path'

import { LoginContainer, LoginLogo, LoginTitle } from '../styles/login.styd'
import { useReduxState } from 'hooks-path/redux'

export const Login = () => {
  const authState = useReduxState('auth')

  const handleLogin = useLogin(loginUser, '/')

  return (
    <LoginContainer>
      <LoginLogo src='/static/img/bizeus.png' alt='Bizeus Logo' />
      <LoginTitle>Dashboard Bizeus</LoginTitle>
      <LoginForm {...authState} handleLogin={handleLogin} />
    </LoginContainer>
  )
}
