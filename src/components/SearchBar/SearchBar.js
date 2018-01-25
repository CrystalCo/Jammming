import React from 'react';
import './SearchBar.css';

export class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    //this.searchSpotify = this.searchSpotify.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
  }

  handleTermChange(e) {
    let searchTerm = e.target.value;
    this.props.searchSpotify(searchTerm);
  }

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist"
        onSearch={this.props.onSearch}
        onChange={this.handleTermChange} />
        <a>SEARCH</a>
      </div>
    )
  }
}
