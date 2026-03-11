import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { getCompanies } from '../redux/company'
import { useReduxState } from './redux'

export const useCompanies = (params = {}) => {
  const dispatch = useDispatch()
  const companyState = useReduxState('company')

  useEffect(() => {
    dispatch(getCompanies(params))
  }, [])

  const refresh = () => {
    dispatch(getCompanies(params))
  }

  return {
    companies: companyState.list || [],
    loading: companyState.loading,
    error: companyState.error,
    refresh
  }
}
