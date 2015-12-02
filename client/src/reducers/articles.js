import { SEARCH_ARTICLES, LOAD_ARTICLES } from '../constants/ActionTypes'
import { xmlToJson } from './xmlConverter'



const initialState = {
  searchTerms: "",
  articles: []
}

export default function articles(state = initialState, action) {
  switch (action.type) {
    case LOAD_ARTICLES:
      if (action.body) {
        articles = []
        for (let x = 0; x < action.body.item.length; x++) {
          articles.push({
            title: action.body.item[x].title,
            description: action.body.item[x].description
          });
        }
        return Object.assign({}, state, {
          articles: articles,
          all_articles: articles
        })
      } else {
        return state;
      }

    case SEARCH_ARTICLES:
      let re = new RegExp(action.searchTerms, 'g');
      let articles = state.all_articles.filter(function(val) {
        return re.test(val.title) || re.test(val.description);
      });
      return Object.assign({}, state, {
        searchTerms: action.searchTerms,
        articles: articles
      })

    default:
      return state
  }
}
