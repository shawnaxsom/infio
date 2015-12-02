import * as types from '../constants/ActionTypes'
let request = require('superagent');

export function onSearchChanged(searchTerms) {
  return { type: types.SEARCH_ARTICLES, searchTerms: searchTerms }
}

export function loadArticlesOptimistic() {
  return { type: types.LOAD_ARTICLES }
}

export function loadArticles(body) {
  return { type: types.LOAD_ARTICLES, body: body }
}

export function loadArticlesAsync(delay = 100) {
  return dispatch => {
    dispatch(loadArticlesOptimistic())
    let url = 'http://shawnaxsom.com/api/articles';
    request
        .get(url)
        .end(function(err, res){
          if (res.ok) {
            dispatch(loadArticles(res.body));
            // return JSON.stringify(res.body);
          } else {
            alert('Oh no! error ' + res.text);
          }
        });

    return null;
  }
}
