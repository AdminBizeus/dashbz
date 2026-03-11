import { listConnections } from 'utils/api/connection'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  current: null,
  loading: false,
  error: ''
}

const LOADING_GET_CONNECTIONS = 'LOADING_GET_CONNECTIONS'
const SUCCESS_GET_CONNECTIONS = 'SUCCESS_GET_CONNECTIONS'
const ERROR_GET_CONNECTIONS = 'ERROR_GET_CONNECTIONS'

export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOADING_GET_CONNECTIONS:
      return loadingReducer(state)
    case ERROR_GET_CONNECTIONS:
      return errorReducer(state, action.payload)
    case SUCCESS_GET_CONNECTIONS:
      return successReducer(state, { list: action.payload })
    default:
      return state
  }
}

export const getConnections = (params = {}, extra = {}) => {
  return {
    types: [LOADING_GET_CONNECTIONS, SUCCESS_GET_CONNECTIONS, ERROR_GET_CONNECTIONS],
    promise: () => listConnections(params),
    ...extra
  }
}
