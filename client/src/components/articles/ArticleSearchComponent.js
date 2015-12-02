'use strict';

import React from 'react';
import { Input } from 'react-bootstrap';

require('styles/articles/ArticleSearch.sass');

class ArticleSearchComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      value: ''
    };

    // http://www.newmediacampaigns.com/blog/refactoring-react-components-to-es6-classes
    this.handleChange = this.handleChange.bind(this);
  }

  validationState() {
    let length = this.state.value.length;
    if (length > 10) return 'success';
    else if (length > 5) return 'warning';
    else if (length > 0) return 'error';
  }

  handleChange(event) {
    // This could also be done using ReactLink:
    // http://facebook.github.io/react/docs/two-way-binding-helpers.html
    this.props.onSearchChanged(event.target.value);
//     this.setState({
//       value: this.refs.input.getValue()
//     });
  }

  render() {
    return (
      <Input
        type="text"
        value={this.props.searchTerms}
        placeholder="Search articles..."
        label="Search"
        hasFeedback
        ref="input"
        groupClassName="group-class"
        labelClassName="label-class"
        onChange={this.handleChange} />
    );
  }
};

ArticleSearchComponent.displayName = 'ArticlesArticleSearchComponent';

export default ArticleSearchComponent;
