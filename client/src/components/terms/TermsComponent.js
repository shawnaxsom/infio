'use strict';

import React from 'react';

class TermsComponent extends React.Component {
  componentDidMount() {
    const { loadTerms } = this.props;
    loadTerms();
  }

  addTerm(event) {
    this.props.addTerm(this.refs.newName.value, this.refs.newWeight.value);
  }

  reloadArticles() {
    this.props.dispatch(this.props.loadArticles);
  }

  render() {
    if (!this.props.terms) {
      return (
        <div></div>
      )
    }

    return (
      <div className="termlist-component">
        <div ref="foo">
          {this.props.terms.map((term) => {
            return (
                <div>
                  <label>{term.name}</label>: 
                  <input type="text" value={term.weight} />
                  <button onClick={this.props.deleteTerm.bind(this, term)}>X</button>
                </div>
            )
          })}
        </div>

        <div>
          New term: <input type="text" ref="newName" />: 
          <input type="text" ref="newWeight" />
          <button onClick={this.addTerm.bind(this)}>Add Term</button>
        </div>
        <div>
          <button onClick={this.reloadArticles.bind(this)}>Reload Articles</button>
        </div>
      </div>
    );
  }
}

TermsComponent.displayName = 'TermsTermsComponent';

export default TermsComponent;
