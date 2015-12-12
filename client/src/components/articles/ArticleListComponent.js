'use strict';

import React from 'react';
import ArticleComponent from './ArticleComponent'

require('styles/articles/ArticleList.sass');

class ArticleListComponent extends React.Component {
  render() {
    let articles = []; 
    var articleStyle = {
      background: '#FAF8F5',
      width: 'auto',
      height: 'auto',
      padding: '15px',
      overflow: 'hidden',
      borderRadius: '.3em'
    }

    var articleContainerStyle = {
      color: '#978C7F',
      margin: '15px',
      padding: '1px',
      overflow: 'hidden',
      borderRadius: '.2em'
    }

    // TODO - Make this a toggle button prop
    let displayInBlocks = true; 
    if (displayInBlocks) {
      Object.assign(articleContainerStyle, {
        display: 'inline-flex',
        height: '300px',
        width: '300px'
      });
    }

    for (let article of this.props.articles) {
      let createMarkup = () => { return {__html: article["description"].toString()}; };
      articles.push((
        <div style={articleStyle}>
          <p>Score: {article["score"]}</p>
          <a href={article["link"]}>
            {article["title"]}
          </a>
          <div dangerouslySetInnerHTML={createMarkup()}>
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
