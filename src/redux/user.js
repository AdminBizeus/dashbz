import { listUsers } from 'utils/api/users'
import { reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

const initialData = {
  list: [],
  current: null,
  loading: false,
  error: ''
}

const LOADING_GET_USERS = 'LOADING_GET_USERS'
const SUCCESS_GET_USERS = 'SUCCESS_GET_USERS'
const ERROR_GET_USERS = 'ERROR_GET_USERS'

export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOADING_GET_USERS:
      return loadingReducer(state)
    case ERROR_GET_USERS:
      return errorReducer(state, action.payload)
    case SUCCESS_GET_USERS:
      return successReducer(state, { list: action.payload })
    default:
      return state
  }
}

export const getUsers = (params = {}, extra = {}) => {
  return {
    types: [LOADING_GET_USERS, SUCCESS_GET_USERS, ERROR_GET_USERS],
    promise: () => listUsers(params),
    ...extra
  }
}
