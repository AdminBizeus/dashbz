import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getSubscriptions, createManual, deleteManual } from '../redux/subscription'
import { useReduxState } from './redux'

export const useSubscriptions = (params = {}) => {
  const dispatch = useDispatch()
  const state = useReduxState('subscription')

  useEffect(() => {
    dispatch(getSubscriptions(params))
  }, [])

  const refresh = () => dispatch(getSubscriptions(params))

  const createManualSubscription = (data, callbacks) =>
    dispatch(createManual(data, callbacks))

  const deleteSubscription = (id, callbacks) =>
    dispatch(deleteManual(id, callbacks))

  return {
    subscriptions: state.list || [],
    loading: state.loading,
    loadingCreate: state.loadingCreate,
    loadingDelete: state.loadingDelete,
    error: state.error,
    refresh,
    createManualSubscription,
    deleteSubscription
  }
}
