import * as types from '../constants/ActionTypes'
import _ from 'lodash'
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

let ignoredTerms = [ "to", "for", "with", "on", "be", "in", "of", "in", "an", "a" ]

function scoreTerms(terms, termWeights) {
  let termScores = {}

  for (let term of terms) {
    if (ignoredTerms.indexOf(term) >= 0) {
      termScores[term] = 0;
      continue;
    }

    if (!(term in termScores)) {
      termScores[term] = 0;
    }

    let foundTerms = _.filter(termWeights.terms, 
      _.matches({ 'name': term.toLowerCase() }));

    if (foundTerms && foundTerms.length > 0) {
      termScores[term] += parseInt(foundTerms[0].weight);
    } else {
      // termScores[term] += 1; // TODO - are results better with or without this?
    }
  }

  return termScores;
}

function calculateArticleScore(termScores) {
  return (article) => {
    let terms = article.title[0].split(" ");
    let termsScore = terms.reduce((prev, curr, i, array) => {
      if (i === 1) {
        return termScores[prev] + termScores[curr]
      } else {
        return prev + termScores[curr]
      }
    });

    let now = new Date();
    let pubDate = new Date(article.pubDate);
    let ageInHours = (((now - pubDate) / 1000 ) / 60) / 60;

    article.score = Math.round(termsScore - (ageInHours));
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
    if (articleTitles.indexOf(article.title[0].toString()) >= 0) {
      return false;
    } else {
      articleTitles.push(article.title[0].toString());
      return true;
    }
  }
}

let cachedFeeds = [];

function loadAllFeeds(feeds, termWeights, dispatch) {
  let promises = [];

  for (let feed of feeds) {
    promises.push(loadFeed(feed));
  }

  Promise.all(promises).then((feeds) => {
    cachedFeeds = feeds; // TODO - remove, looking at memory allocation statistics.
    let articles = feeds.map((feed) => feed.item).reduce((prev, result) => prev.concat(result))

    let termsPerArticle = articles.map(article => article.title[0].split(" "))
    let terms = termsPerArticle.reduce((prev, article) => prev.concat(article))
    let termScores = scoreTerms(terms, termWeights);

    articles = articles.map(calculateArticleScore(termScores));
    articles = articles.sort(sortByScores);
    articles = articles.filter(uniqueArticles());
    articles = articles.slice(0, Math.min(120, articles.length-1));

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
            alert('Oh no! feed: ' + feed + ' error ' + err);
          }
        });
  });
}

export function loadArticlesAsync(dispatcher, getState) {
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
      'http://www.ibj.com/rss/22',
      'http://thehackernews.com/feeds/posts/default',
      'http://scotch.io/feed',
      'http://feeds.arstechnica.com/arstechnica/index/',
      'http://gigaom.com/feed/',
      'http://www.smashingmagazine.com/feed/',
      'http://www.engadget.com/rss-full.xml',
      'http://onethingwell.org/rss',
      'http://inconsolation.wordpress.com/feed/',
      'http://feeds.boingboing.net/boingboing/iBag'
    ]

    // These feeds are pretty large, removing for now
    //'http://www.readwriteweb.com/rss.xml',
    //'http://feeds2.feedburner.com/businessinsider',
    //'http://www.alistapart.com/rss.xml',
    //'http://feeds.gawker.com/lifehacker/vip',
    //'http://venturebeat.com/feed/',

    let terms = getState().terms;

    loadAllFeeds(feeds, terms, dispatchLoadArticles);

    return null;
  }
}
