require('normalize.css');
require('styles/App.css');

import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ArticleActions from '../actions/articles'
import * as TermActions from '../actions/terms'

import TermsComponent from 'components/terms/TermsComponent';
import ArticleListComponent from 'components/articles/ArticleListComponent';
import ArticleSearchComponent from 'components/articles/ArticleSearchComponent';

let yeomanImage = require('../images/yeoman.png');


class AppComponent extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props
    let articleActions = bindActionCreators(ArticleActions, dispatch);
    let termActions = bindActionCreators(TermActions, dispatch);

    dispatch(termActions.loadTerms);
    dispatch(articleActions.loadArticlesAsync);
  }

  render() {
    const { articles, terms, dispatch } = this.props

    let articleActions = bindActionCreators(ArticleActions, dispatch);
    let termActions = bindActionCreators(TermActions, dispatch);

    return (
      <div className="index">
        <TermsComponent terms={terms.terms} loadTerms={termActions.loadTerms} 
            addTerm={termActions.addTerm} deleteTerm={termActions.deleteTerm} 
            loadArticles={articleActions.loadArticlesAsync} 
            dispatch={this.props.dispatch} />
        <ArticleSearchComponent searchTerms={articles.searchTerms} onSearchChanged={articleActions.onSearchChanged} />
        <ArticleListComponent articles={articles.articles} terms={terms.terms}  />
      </div>
    );
  }
}

function select(state) {
  return {
    articles: state.articles,
    terms: state.terms
  }
}

export default connect(select)(AppComponent)
