import * as types from '../constants/ActionTypes'

export function loadTerms() {
  return { type: types.LOAD_TERMS }
}

export function addTerm(name, weight) {
  return { type: types.ADD_TERM, name: name, weight: weight }
}

export function saveTerms(terms) {
  return { type: types.SAVE_TERMS, terms: terms }
}

export function deleteTerm(term) {
  return { type: types.DELETE_TERM, term: term }
}
