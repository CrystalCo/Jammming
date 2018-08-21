import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  search(term) {
    this.props.onSearch(term);
  }

  handleTermChange(e) {
    this.search(e.target.value);
  }

  handleKeyPress(e) {
    let key = e.key;
    let term = e.target.value;
    if (key === 'enter' || key === 'Enter' || key === 'return') {
      return this.search(term);
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <input onKeyPress={this.handleKeyPress}
        onChange={this.handleTermChange}
        placeholder="Enter A Song, Album, or Artist" />
        <a>SEARCH</a>
      </div>
    )
  }
}

export default SearchBar;
