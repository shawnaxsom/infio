'use strict';

import React from 'react';
import ArticleComponent from './ArticleComponent'

require('styles/articles/ArticleList.sass');

class ArticleListComponent extends React.Component {
  componentDidMount() {
    const { loadArticlesAsync } = this.props;
    loadArticlesAsync();
  }

  render() {
    let articles = []; 
    var articleStyle = {
      background: '#FFFCFA',
      width: 'auto',
      height: 'auto',
      padding: '15px',
      overflow: 'hidden',
      fontSize: '.85em',
      borderRadius: '.3em'
    }

    var articleContainerStyle = {
      color: '#D7CCBF',
      display: 'inline-flex',
      width: '300px',
      height: '300px',
      margin: '15px',
      padding: '1px',
      overflow: 'hidden',
      borderRadius: '.2em'
    }

    for (let article of this.props.articles) {
      let createMarkup = () => { return {__html: article["description"].toString()}; };
      articles.push((
        <div>
          <a href={article["link"]}>
            {article["title"]}
          </a>
          <div style={articleStyle} dangerouslySetInnerHTML={createMarkup()}>
          </div>
        </div>
      ));
    }

    return (
      <div className="articlelist-component">
        {articles.map(function(article) {
          return (
            <div style={articleContainerStyle}>{article}</div>
          )
        })}
      </div>
    );
  }
}

ArticleListComponent.displayName = 'ArticlesArticleListComponent';

// Uncomment properties you need
// ArticleListComponent.propTypes = {};
// ArticleListComponent.defaultProps = {};

export default ArticleListComponent;
