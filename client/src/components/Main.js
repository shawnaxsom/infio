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
  constructor(props) {
    super(props);
    this.state = {
      showTerms: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props
    let articleActions = bindActionCreators(ArticleActions, dispatch);
    let termActions = bindActionCreators(TermActions, dispatch);

    dispatch(termActions.loadTerms);
    dispatch(articleActions.loadArticlesAsync);
  }

  toggleShowTerms() {
    let { showTerms } = this.state;
    this.setState({
      showTerms: !showTerms
    });
  }

  render() {
    const { articles, terms, dispatch } = this.props

    let articleActions = bindActionCreators(ArticleActions, dispatch);
    let termActions = bindActionCreators(TermActions, dispatch);
    let termsComponent = null;
    let toggleShowTermsText = "Show Terms";
    if (this.state.showTerms) {
      termsComponent = (
        <TermsComponent terms={terms.terms} loadTerms={termActions.loadTerms} 
            addTerm={termActions.addTerm} deleteTerm={termActions.deleteTerm} 
            loadArticles={articleActions.loadArticlesAsync} 
            filterArticles={articleActions.filterArticlesAsync}
            dispatch={this.props.dispatch} />
      );
      toggleShowTermsText = "Hide Terms";
    }

    return (
      <div className="index">
        <button onClick={this.toggleShowTerms.bind(this)}>{toggleShowTermsText}</button>
        {termsComponent}
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
