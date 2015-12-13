'use strict';

import React from 'react';

class TermsComponent extends React.Component {
  componentDidMount() {
    const { loadTerms } = this.props;
    loadTerms();
  }

  addTerm(event) {
    this.props.addTerm(this.refs.newName.value, this.refs.newWeight.value);
    this.reloadArticles();
  }

  addTermKeyDown(event) {
    if(event.keyCode == 13) {
      this.props.addTerm(this.refs.newName.value, this.refs.newWeight.value);
      this.refs.newName.value = "";
      this.refs.newName.getDOMNode().focus();
      this.reloadArticles();
    }
  }

  reloadArticles() {
    this.props.dispatch(this.props.filterArticles);
  }

  deleteTerm(term) {
    this.props.deleteTerm(term);
    this.reloadArticles();
  }

  render() {
    if (!this.props.terms) {
      return (
        <div></div>
      )
    }

    return (
      <div className="termlist-component">
        <div>
          {this.props.terms.map((term) => {
            return (
                <span>
                  <label>{term.name}</label> : 
                  <label>{term.weight}</label>
                  <button onClick={this.deleteTerm.bind(this, term)}>X</button>
                </span>
            )
          })}
        </div>

        <div>
          New term: <input type="text" ref="newName" 
              onKeyDown={this.addTermKeyDown.bind(this)} />: 
          <input type="text" ref="newWeight" 
              onKeyDown={this.addTermKeyDown.bind(this)} />
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
