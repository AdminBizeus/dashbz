import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getConnections } from '../redux/connection'
import { useReduxState } from './redux'

export const useConnections = (params = {}) => {
  const dispatch = useDispatch()
  const connectionState = useReduxState('connection')

  useEffect(() => {
    dispatch(getConnections(params))
  }, [])

  const refresh = () => {
    dispatch(getConnections(params))
  }

  return {
    connections: connectionState.list || [],
    loading: connectionState.loading,
    error: connectionState.error,
    refresh
  }
}
