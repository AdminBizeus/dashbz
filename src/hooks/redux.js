import { message } from 'antd'
import { useRouter } from 'next/router'
import { useSelector, useDispatch } from 'react-redux'

export const useReduxState = reducer => {
  const state = useSelector(state => state[reducer])
  return state
}

export const useReduxDispatch = action => {
  const dispatch = useDispatch()
  return () => {
    dispatch(action())
  }
}

export const useReduxFetch = action => {
  const dispatch = useDispatch()

  return params => {
    dispatch(action(params))
  }
}

export const useReduxRemove = (action, msg, redirect) => {
  const dispatch = useDispatch()
  const router = useRouter()
  return id => {
    const onSuccess = () => {
      message.success(msg || 'Eliminado exitosamente!')
    }

    const onError = error => {
      message.error(error.message || 'Ocurrio un error al eliminar!')
    }

    if (redirect) {
      router.push(redirect)
    }

    dispatch(action(id, { onSuccess, onError }))
  }
}

export const useReduxAdd = (action, msg) => {
  const dispatch = useDispatch()
  const router = useRouter()
  return (data, redirect, callback) => {
    const onSuccess = () => {
      message.success(msg || 'Creado exitosamente!')
      callback && callback()
      if (redirect) {
        router.push(redirect)
      }
    }

    const onError = error => {
      message.error(error.message || 'Ocurrio un error al crear!')
    }

    dispatch(action(data, { onSuccess, onError }))
  }
}

export const useReduxEdit = (action, msg) => {
  const dispatch = useDispatch()
  const router = useRouter()
  return (id, data, redirect, callback) => {
    const onSuccess = () => {
      message.success(msg || 'Editado exitosamente!')
      callback && callback()
      if (redirect) {
        router.push(redirect)
      }
    }

    const onError = error => {
      message.error(error.message || 'Ocurrio un error al editar!')
    }

    dispatch(action(id, data, { onSuccess, onError }))
  }
}
