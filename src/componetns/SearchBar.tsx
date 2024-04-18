import React, { useState } from "react";

type SearchBarProps = {
  setSearchProduct: (productName: string) => void;
  setSearchTag: (tag: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearchProduct, setSearchTag, handleSearch, clearSearch }) => {

  return (
    <div className="search-bar-container">
      <input
        type="text"
        onChange={(e) => setSearchProduct(e.target.value)}
        placeholder="Search products..."
        className="search-bar"
      />
      <input
        type="text"
        onChange={(e) => setSearchTag(e.target.value)}
        placeholder="Search by tags..."
        className="search-bar"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={clearSearch}>Clear</button>
    </div>
  );
};

export default SearchBar;