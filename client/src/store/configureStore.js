import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

const loggerMiddleware = createLogger()

const initialState = {
    isLoading: false,
    err: null,
    fromSearch: false,
    movies: []
}

export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        )
    )
}

