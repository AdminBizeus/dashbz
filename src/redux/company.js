import { listCompanys } from 'utils/api/company'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  current: null,
  loading: false,
  error: ''
}

const LOADING_GET_COMPANIES = 'LOADING_GET_COMPANIES'
const SUCCESS_GET_COMPANIES = 'SUCCESS_GET_COMPANIES'
const ERROR_GET_COMPANIES = 'ERROR_GET_COMPANIES'

export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOADING_GET_COMPANIES:
      return loadingReducer(state)
    case ERROR_GET_COMPANIES:
      return errorReducer(state, action.payload)
    case SUCCESS_GET_COMPANIES:
      return successReducer(state, { list: action.payload })
    default:
      return state
  }
}

export const getCompanies = (params = {}, extra = {}) => {
  return {
    types: [LOADING_GET_COMPANIES, SUCCESS_GET_COMPANIES, ERROR_GET_COMPANIES],
    promise: () => listCompanys(params),
    ...extra
  }
}
