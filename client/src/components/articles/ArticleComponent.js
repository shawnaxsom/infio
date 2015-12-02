'use strict';

import React from 'react';

require('styles/articles/Article.sass');

class ArticleComponent extends React.Component {
  render() {
    return (
      <div className="article-component">
        Please edit src/components/articles//ArticleComponent.js to update this component!
      </div>
    );
  }
}

ArticleComponent.displayName = 'ArticlesArticleComponent';

// Uncomment properties you need
// ArticleComponent.propTypes = {};
// ArticleComponent.defaultProps = {};

export default ArticleComponent;
