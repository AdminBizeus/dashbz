import { useDispatch } from 'react-redux'
import { useRouter } from 'next/router'

import { session } from 'utils'

export const useLogin = (action, route) => {
  const dispatch = useDispatch()
  const router = useRouter()

  const onSuccess = resp => {
    session.setCookie('jwt', resp.token)
    session.setCookie('user', JSON.stringify(resp.user))
    router.push(route)
  }

  return (username, password) => {
    dispatch(action(username, password, { onSuccess }))
  }
}

export const useLogout = (action, route) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const onSuccess = () => {
    session.removeCookie('jwt')
    session.removeCookie('user')
    router.push(route)
  }

  return () => {
    dispatch(action({ onSuccess }))
  }
}
