import React, { createContext, useReducer } from 'react'
import { REMOVE_ALERT, SET_ALERT } from '../types'

export const AlertContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case SET_ALERT:
      return action.payload
    case REMOVE_ALERT:
      return null
    default:
      return state
  }
}

export const AlertState = props => {
  const initialState = null

  const [state, dispatch] = useReducer(reducer, initialState)

  // Set Alert
  const setAlert = (msg, type) => {
    dispatch({
      type: SET_ALERT,
      payload: { msg, type }
    })

    setTimeout(() => dispatch({ type: REMOVE_ALERT }), 5000)
  }

  return (
    <AlertContext.Provider
      value={{
        alert: state,
        setAlert
      }}
    >
      {props.children}
    </AlertContext.Provider>
  )
}
