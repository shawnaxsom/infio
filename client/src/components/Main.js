require('normalize.css');
require('styles/App.css');

import React, { Component, PropTypes } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import * as ArticleActions from '../actions/articles'

import ArticleListComponent from 'components/articles/ArticleListComponent';
import ArticleSearchComponent from 'components/articles/ArticleSearchComponent';

let yeomanImage = require('../images/yeoman.png');

class AppComponent extends React.Component {
  render() {

    const { articles, actions } = this.props

    return (
      <div className="index">
        <ArticleSearchComponent searchTerms={articles.searchTerms} onSearchChanged={actions.onSearchChanged} />
        <ArticleListComponent articles={articles.articles} loadArticlesAsync={actions.loadArticlesAsync} />
      </div>
    );
  }
}

AppComponent.defaultProps = {
};

AppComponent.propTypes = {
  articles: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
}

function mapStateToProps(state) {
  return {
    articles: state.articles
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(ArticleActions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppComponent)
