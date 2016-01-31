import * as types from '../constants/ActionTypes';

let nlp = require("nlp_compromise");

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

    let foundTerms = termWeights.terms.filter(t => t.name.toLowerCase() === term.toLowerCase());

    if (foundTerms && foundTerms.length > 0) {
      if (!(term in termScores)) {
        termScores[term] = 0;
      }

      termScores[term] += parseInt(foundTerms[0].weight);
    } else {
//      if (!(term in termScores)) {
//        termScores[term] = 0;
//      } else {
//        termScores[term] += (term.length/2); // TODO - are results better with or without this?
//      }
      if (!(term in termScores)) {
        termScores[term] = 0;
      }
    }
  }

  return termScores;
}

const tagValues = {
  "VB" : 2,
  "VBD" : 1,
  "VBN" : 1,
  "VBP" : 3,
  "VBZ" : 2,
  "VBF" : 4,
  "CP" : 0,
  "VBG" : 4,
  "JJ" : 3,
  "JJR" : 5,
  "JJS" : 6,
  "RB" : 3,
  "RBR" : 4,
  "RBS" : 7,
  "NN" : 1,
  "NNP" : 4,
  "NNPA" : 6,
  "NNAB" : 1,
  "NNPS" : 5,
  "NNS" : 3,
  "NNO" : 3,
  "NG" : 2,
  "PRP" : 0,
  "PP" : 0,
  "FW" : 2,
  "IN" : 0,
  "MD" : 0,
  "CC" : 0,
  "DT" : 0,
  "UH" : 0,
  "EX" : 0,
  "CD" : 3,
  "DA" : 3,
  "NU" : 4
}

function calculateArticlePhraseScore(article) {
  let phraseScoreForArticle = 0;
  let title = article.title[0];

  // Number of entities, e.g. well-known proper nouns
  let entityScore = nlp.spot(title).length;

  // Scoring based on types of words used
  let allTags = nlp.pos(title).tags();
  let tagScore = allTags.reduce((p, tagsForSubphrase) => {
    let myTagScore = tagsForSubphrase.reduce((p2, myTag) => {
      let mySingleTagScore = (myTag in tagValues ? tagValues[myTag] : 0);
      return p2 + mySingleTagScore;
    }, 0);
    
    return p + myTagScore;
  }, 0)

  phraseScoreForArticle = (entityScore * 5) + tagScore;

  return phraseScoreForArticle;
}

function calculateArticleTermsScore(article, termScores) {
    let termsInArticle = article.title[0].split(" ");
    let termsScoreForArticle = termsInArticle.reduce((prev, curr, i, array) => {
      if (i === 1) {
        return termScores[prev] + termScores[curr]
      } else {
        return prev + termScores[curr]
      }
    });
    return termsScoreForArticle;
}

function calculateArticleScore(termScores) {
  return (article) => {
    let termsScoreForArticle = calculateArticleTermsScore(article, termScores);
    let phraseScoreForArticle = calculateArticlePhraseScore(article);

    let now = new Date();
    let pubDate = new Date(article.pubDate);
    let ageInHours = (((now - pubDate) / 1000 ) / 60) / 60;

    article.score = Math.round(termsScoreForArticle 
        + (phraseScoreForArticle * 2)
        - (ageInHours * 4));
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

export function loadArticlesFromFeeds(feeds, termWeights, dispatch) {
    let articles = feeds.map((feed) => feed.item).reduce((prev, result) => prev.concat(result)).filter(article => article !== undefined);

    let termsPerArticle = articles.map(article => article.title[0].split(" "))
    let terms = termsPerArticle.reduce((prev, article) => prev.concat(article))
    let termScores = scoreTerms(terms, termWeights);

    articles = articles.map(calculateArticleScore(termScores));
    articles = articles.sort(sortByScores);
    articles = articles.filter(uniqueArticles());
    articles = articles.slice(0, Math.min(39, articles.length-1));
    //articles = articles.filter(a => a.score > 0);

    dispatch(articles);
}

function loadAllFeeds(feeds, termWeights, dispatch) {
  loadFeeds(feeds).then((feeds) => {
    cachedFeeds = feeds;
    loadArticlesFromFeeds(feeds, termWeights, dispatch);
  })
}

function loadFeeds(feeds) {
  return new Promise((resolve, reject) => {

    let url = 'https://shawnaxsom.com/api/articles';

    fetch(url, {
      method: 'post',
      body: JSON.stringify({ 
        rssUris: feeds
      }),
      headers: new Headers({
        'Content-Type': 'application/json;charset=UTF-8'
      })
    }).then((res) => {
      let json = res.json();
      console.log("Response body");
      console.log(json);
      resolve(json);
    }).catch((err) => {
      console.log(err);
    });

  });
}

export function filterArticlesAsync(dispatcher, getState) {
  return dispatch => {
    let terms = getState().terms;
    let dispatchLoadArticles = (results) => dispatch(loadArticles(results));

    loadArticlesFromFeeds(cachedFeeds, terms, dispatchLoadArticles);
  }
}

export function loadArticlesAsync(dispatcher, getState) {
  return dispatch => {
    //dispatch(loadArticlesOptimistic())

    let dispatchLoadArticles = (results) => dispatch(loadArticles(results));
    let feeds = [ 
      'http://techmeme.com/feed.xml', 
      'http://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
      'http://www.wthr.com/category/60340/business-news?clienttype=rss',
      'http://www.wthr.com/category/23903/local-news?clienttype=rss',
      'http://www.ibj.com/rss/112',
      'http://www.ibj.com/rss/9',
      'http://www.ibj.com/rss/22',
      'http://scotch.io/feed',
      'http://feeds.arstechnica.com/arstechnica/index/',
      'http://www.smashingmagazine.com/feed/',
      'http://www.engadget.com/rss-full.xml',
      'http://onethingwell.org/rss',
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
