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

// TODO - these are case sensitive at the moment
let termWeightings = {
  "trump": 1,
  "amazon": 3,
  "google": 6,
  "programming": 6,
  "javascript": 9,
  "python": 9,
  "netflix": 7,
  "hulu": 7,
  "playstation": -5,
  "xbox": -5,
  "smartphone": -12,
  "nasa": -5,
  "obama": -9,
  "indy": 10,
  "indianapolis": 10,
  "fishers": 10,
  "carmel": 10,
  "westfield": 10
}

function scoreTerms(terms) {
  let termScores = {}

  for (let term of terms) {
    if (!(term in termScores)) {
      termScores[term] = 0;
    }

    if (term.toLowerCase() in termWeightings) {
      termScores[term] += termWeightings[term.toLowerCase()];
    } else {
      termScores[term] += 1;
    }
  }

  return termScores;
}

function calculateArticleScore(termScores) {
  return (article) => {
    let terms = article.title[0].split(" ");
    article.score = terms.reduce((prev, curr, i, array) => {
      if (i === 1) {
        return termScores[prev] + termScores[curr]
      } else {
        return prev + termScores[curr]
      }
    });
    return article;
  }
}

function sortByScores(articleA, articleB) {
  if (articleA.score < articleB.score) {
    return 1;
  } else if (articleA.score > articleB.score) {
    return -1;
  } else {
    return 0;
  }
}                                   

function uniqueArticles() {
  let articleTitles = [];
  return article => {
      console.log("Article Titles:");
      console.log(articleTitles);
      if (articleTitles.indexOf(article.title[0].toString()) >= 0) {
        return false;
      } else {
        articleTitles.push(article.title[0].toString());
        return true;
      }
    }
}

function loadAllFeeds(feeds, dispatch) {
  let promises = [];

  for (let feed of feeds) {
    promises.push(loadFeed(feed));
  }

  Promise.all(promises).then((results) => {
    let articles = results.map((result) => result.item).reduce((prev, result) => prev.concat(result))

    let termsPerArticle = articles.map(article => article.title[0].split(" "))
    let terms = termsPerArticle.reduce((prev, article) => prev.concat(article))
    let termScores = scoreTerms(terms);

    articles = articles.map(calculateArticleScore(termScores));
    articles = articles.sort(sortByScores);
    articles = articles.filter(uniqueArticles());

    dispatch(articles);
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
    let feeds = [ 
      'http://techmeme.com/feed.xml', 
      'http://www.engadget.com/rss-full.xml',
      'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      'http://www.wthr.com/category/60340/business-news?clienttype=rss',
      'http://www.wthr.com/category/23903/local-news?clienttype=rss',
      'http://www.ibj.com/rss/69',
      'http://www.ibj.com/rss/35',
      'http://www.ibj.com/rss/112',
      'http://www.ibj.com/rss/9',
      'http://www.ibj.com/rss/28',
      'http://www.ibj.com/rss/22'
    ]

    loadAllFeeds(feeds, dispatchLoadArticles);

    return null;
  }
}
