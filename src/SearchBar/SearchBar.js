import React, { useState } from 'react';
import './SearchBar.css';


export const SearchBar = (props) => {
  const [term, setTerm] = useState('');

  const handleTermChange = (e) => {
    setTerm(e.target.value);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    props.onSearch(term);
  }

  return (
    <div className="SearchBar">
      <form className="SearchForm" onSubmit={handleSubmit}>
        <label>Search Songs Here:</label>
        <input
          type="text"
          value={term}
          id="SearchBarInput"
          placeholder="Enter A Song, Album, or Artist"
          onChange={handleTermChange}
        />
        <button
          className="SearchButton"
          type="submit"
          value="Submit"
        > SEARCH
        </button>
      </form>
    </div>
  );
}

export default SearchBar;