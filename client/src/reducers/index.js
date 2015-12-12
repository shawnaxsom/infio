import { combineReducers } from 'redux'
import articles from './articles'
import terms from './terms'

const rootReducer = combineReducers({
  articles,
  terms
})

export default rootReducer
