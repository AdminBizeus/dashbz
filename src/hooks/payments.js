import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getPayments } from '../redux/payment'
import { useReduxState } from './redux'

export const usePayments = (params = {}) => {
  const dispatch = useDispatch()
  const state = useReduxState('payment')

  useEffect(() => {
    dispatch(getPayments(params))
  }, [])

  const refresh = () => dispatch(getPayments(params))

  return {
    payments: state.list || [],
    loading: state.loading,
    error: state.error,
    refresh
  }
}
