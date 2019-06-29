import axios from 'axios'
import React, { createContext, useReducer } from 'react'
import {
  CLEAR_USERS,
  GET_REPOS,
  GET_USER,
  SEARCH_USERS,
  SET_LOADING
} from '../types'

let githubClientId
let githubClientSecret

export const GithubContext = createContext()

const reducer = (state, action) => {
  switch (action.type) {
    case SEARCH_USERS:
      return {
        ...state,
        users: action.payload,
        loading: false
      }
    case GET_USER:
      return {
        ...state,
        user: action.payload,
        loading: false
      }
    case CLEAR_USERS:
      return {
        ...state,
        users: [],
        loading: false
      }
    case GET_REPOS: {
      return {
        ...state,
        repos: action.payload,
        loading: false
      }
    }
    case SET_LOADING:
      return {
        ...state,
        loading: true
      }
    default:
      return state
  }
}

if (process.env.NODE_ENV !== 'production') {
  githubClientId = process.env.REACT_APP_GITHUB_CLIENT_ID
  githubClientSecret = process.env.REACT_APP_GITHUB_CLIENT_SECRET
} else {
  githubClientId = process.env.GITHUB_CLIENT_ID
  githubClientSecret = process.env.GITHUB_CLIENT_SECRET
}

export const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  const searchUsers = async text => {
    setLoading()

    const res = await axios.get(
      `https://api.github.com/search/users?q=${text}&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    )

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    })
  }

  // Get User
  const getUser = async username => {
    setLoading()

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${githubClientId}&client_secret=${githubClientSecret}`
    )

    dispatch({
      type: GET_USER,
      payload: res.data
    })
  }

  // Get Repos
  const getUserRepos = async username => {
    setLoading()

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${githubClientId}&client_secret=${githubClientSecret}`
    )

    dispatch({
      type: GET_REPOS,
      payload: res.data
    })
  }

  const clearUsers = () => dispatch({ type: CLEAR_USERS })

  const setLoading = () => dispatch({ type: SET_LOADING })

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  )
}
