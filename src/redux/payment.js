import { listPayments } from 'utils/api/payment'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  loading: false,
  error: ''
}

const LOADING_GET_PAYMENTS = 'LOADING_GET_PAYMENTS'
const SUCCESS_GET_PAYMENTS = 'SUCCESS_GET_PAYMENTS'
const ERROR_GET_PAYMENTS   = 'ERROR_GET_PAYMENTS'

export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOADING_GET_PAYMENTS: return loadingReducer(state)
    case ERROR_GET_PAYMENTS:   return errorReducer(state, action.payload)
    case SUCCESS_GET_PAYMENTS: return successReducer(state, { list: action.payload })
    default: return state
  }
}

export const getPayments = (params = {}) => ({
  types: [LOADING_GET_PAYMENTS, SUCCESS_GET_PAYMENTS, ERROR_GET_PAYMENTS],
  promise: () => listPayments({ ...params, populate: ['company', 'subscription'] })
})
