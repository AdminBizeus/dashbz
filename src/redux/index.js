import { createStore, applyMiddleware, combineReducers } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import createMiddleware from './middleware'

import auth, { getAuthUser } from './auth'
import user from './user'
import connection from './connection'
import company from './company'

const reducers = combineReducers({
  auth,
  user,
  connection,
  company
})

const middleware = [createMiddleware, thunk]

export const initStore = () => {
  const store = createStore(
    reducers,
    composeWithDevTools(applyMiddleware(...middleware))
  )
  getAuthUser()(store.dispatch)
  return store
}
