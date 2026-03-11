import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getUsers } from '../redux/user'
import { useReduxState } from './redux'

export const useUsers = (params = {}) => {
  const dispatch = useDispatch()
  const userState = useReduxState('user')

  useEffect(() => {
    dispatch(getUsers(params))
  }, [])

  const refresh = () => {
    dispatch(getUsers(params))
  }

  return {
    users: userState.list || [],
    loading: userState.loading,
    error: userState.error,
    refresh
  }
}
