import { LOAD_TERMS, SAVE_TERMS, ADD_TERM, DELETE_TERM } from '../constants/ActionTypes'

function loadTerms() {
  let terms = {};
  terms = JSON.parse(localStorage.getItem("terms"));

  if (!terms) {
    terms = [{
      name: "javascript",
      weight: 10
    }]

    localStorage.setItem("terms", JSON.stringify(terms));
  }

  return terms;
}

const initialState = {
  terms: [ ]
}

export default function terms(state = initialState, action) {
  switch (action.type) {
    case LOAD_TERMS:
      let terms = loadTerms();

      return Object.assign({}, state, {
        terms: terms,
      })

    case ADD_TERM:
      let stateAfterAdd = Object.assign({}, state, {
        terms: [
          ...state.terms,
          { 
            name: action.name, 
            weight: action.weight 
          }
        ]
      });

      localStorage.setItem("terms", JSON.stringify(stateAfterAdd.terms));

      return stateAfterAdd;

    case SAVE_TERMS:
      localStorage.setItem("terms", JSON.stringify(action.terms));

      return Object.assign({}, state, {
        terms: action.terms
      })

    case DELETE_TERM:
      let index = state.terms.indexOf(action.term);

      let stateAfterDelete = Object.assign({}, state, {
        terms: [
          ...state.terms.slice(0, index),
          ...state.terms.slice(index+1),
        ]
      });

      localStorage.setItem("terms", JSON.stringify(stateAfterDelete.terms));

      return stateAfterDelete;
    default:
      return state;
  }
}
