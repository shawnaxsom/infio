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

function loadAllFeeds(feeds, dispatch) {
  let promises = [];

  for (let feed of feeds) {
    promises.push(loadFeed(feed));
  }

  Promise.all(promises).then((results) => {
    dispatch(results);
  })
}

function loadFeed(feed) {
  return new Promise((resolve, reject) => {
    let url = 'http://shawnaxsom.com/api/articles';
    request
        .post(url)
        .send({ rssUri: feed })
        .set('accept', 'application/json')
        .end(function(err, res){
          if (res.ok) {
            resolve(res.body);
            // return JSON.stringify(res.body);
          } else {
            alert('Oh no! error ' + err);
          }
        });
  });
}

export function loadArticlesAsync(delay = 100) {
  return dispatch => {
    dispatch(loadArticlesOptimistic())

    let dispatchLoadArticles = (results) => dispatch(loadArticles(results));

    loadAllFeeds([ 'http://techmeme.com/feed.xml', 'http://www.engadget.com/rss-full.xml' ], dispatchLoadArticles);

    return null;
  }
}
