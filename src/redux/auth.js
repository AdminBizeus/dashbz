import { login } from 'utils/api/auth'
import { session, reducers } from 'utils'

const { loadingReducer, errorReducer, successReducer } = reducers

// constantes
const initialData = {
  loading: false,
  user: null,
  error: null
}

const LOGIN_USER = 'LOGIN_USER'
const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS'
const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR'

const LOGOUT_USER = 'LOGOUT_USER'
const SET_AUTH_USER = 'SET_AUTH_USER'

// reducer
export default function reducer (state = initialData, action) {
  switch (action.type) {
    case LOGIN_USER:
      return loadingReducer(state)
    case LOGIN_USER_ERROR:
      return errorReducer(state, action.payload)
    case LOGIN_USER_SUCCESS:
      return successReducer(state, action.payload)
    case LOGOUT_USER:
      return successReducer(state, action.payload)
    case SET_AUTH_USER:
      return successReducer(state, action.payload)
    default:
      return state
  }
}

// actions (thunks)
export const loginUser = (username, password, extra = {}) => {
  return {
    types: [LOGIN_USER, LOGIN_USER_SUCCESS, LOGIN_USER_ERROR],
    promise: () => login(username, password),
    ...extra
  }
}

export const logoutUser = (extra = {}) => {
  return {
    type: LOGOUT_USER,
    payload: { user: null, jwt: '' },
    ...extra
  }
}

export const getAuthUser = () => dispatch => {
  const jwt = session.getCookie('jwt')
  const user = session.getCookie('user')
  if (jwt && user) {
    dispatch({
      type: SET_AUTH_USER,
      payload: {
        user: JSON.parse(user),
        jwt
      }
    })
  }
}
