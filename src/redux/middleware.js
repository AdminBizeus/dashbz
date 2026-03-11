const actionMiddleware = ({ dispatch, getState }) => next => async action => {
  if (typeof action === 'function') {
    return action(dispatch, getState)
  }

  const { promise, types, ...rest } = action
  if (!promise) {
    next(action)
    rest && rest.onSuccess && rest.onSuccess(rest.payload)
    return rest.payload
  }

  const [REQUEST, SUCCESS, FAILURE] = types
  next({ ...rest, type: REQUEST })

  try {
    const query = await promise()
    let success = false
    if (Array.isArray(query)) {
      success = true
    } else {
      success = query.success
    }

    if (success) {
      next({ ...rest, payload: query, type: SUCCESS })
      rest && rest.onSuccess && rest.onSuccess(query)
    } else {
      next({
        ...rest,
        payload: query.message || 'Error del servidor',
        type: FAILURE
      })
      rest && rest.onError && rest.onError(query)
    }

    return query
  } catch (error) {
    rest && rest.onError && rest.onError(error)
    return {
      success: false,
      message: 'Error en el servidor.',
      error
    }
  }
}

export default actionMiddleware
