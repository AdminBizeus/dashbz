import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import { initStore } from '../redux'
import Head from 'next/head'

import { GlobalStyle } from '../styles/GlobalStyle'

import { getCookie } from 'utils/functions/session'

import { Admin } from '../layouts/private/admin'
import LoginPage from './login'

import 'antd/dist/antd.min.css'

const MyApp = ({ Component, pageProps, store }) => {
  const admin = Admin()
  const ComponentToRender = admin ? Component : LoginPage

  return (
    <Provider store={store}>
      <Head>
        <title>Dashboard Bizeus</title>
        <link rel='shortcut icon' href='/static/img/favicon.png' />
      </Head>
      <ComponentToRender {...pageProps} />
      <GlobalStyle />
    </Provider>
  )
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const jwt = getCookie('jwt', ctx.req)
  const currentUser = getCookie('user', ctx.req)

  if (jwt) {
    ctx.jwt = jwt
  }
  if (currentUser) {
    ctx.currentUser = JSON.parse(decodeURI(currentUser).replace(/\%2C/g, ','))
  }
  const pageProps = Component.getInitialProps
    ? await Component.getInitialProps(ctx)
    : {}
  return { pageProps }
}

export default withRedux(initStore)(MyApp)
