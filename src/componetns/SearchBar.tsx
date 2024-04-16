import React, { useState } from "react";

type SearchBarProps = {
  setSearchParams: (params: { productName: string; tag: string }) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearchParams }) => {
  const [productName, setProductName] = useState("");
  const [tag, setTag] = useState("");

  const handleProductNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProductName(e.target.value);
    setSearchParams({ productName: e.target.value, tag });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value);
    setSearchParams({ productName, tag: e.target.value });
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={productName}
        onChange={handleProductNameChange}
        placeholder="Search products..."
        className="search-bar"
      />
      <input
        type="text"
        value={tag}
        onChange={handleTagChange}
        placeholder="Search by tags..."
        className="search-bar"
      />
    </div>
  );
};

export default SearchBar;