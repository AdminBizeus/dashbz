import { Fixed } from '../layouts'
import { Login } from '../views/auth/containers/login'
import Head from 'next/head'
import { useEffect } from 'react'

import Router from 'next/router'
import { session } from 'utils'

const LoginPage = () => {
  useEffect(() => {
    session.removeCookie('jwt')
    session.removeCookie('user')
    Router.push('/login')
  }, [])
  return (
    <Fixed>
      <Head>
        <title>Login - Dashboard Bizeus</title>
      </Head>
      <Login />
    </Fixed>
  )
}

export default LoginPage
