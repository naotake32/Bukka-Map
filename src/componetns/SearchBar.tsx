import React, { useState } from "react";
import { useLanguage } from '../Contexts/LanguageContext';

type SearchBarProps = {
  setSearchProduct: (productName: string) => void;
  setSearchTag: (tag: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
};

const translations = {
  en: {
    searchProducts: "Search products...",
    searchTags: "Search by tags...",
    search: "Search",
    clear: "Clear"
  },
  jp: {
    searchProducts: "商品検索...",
    searchTags: "タグで検索...",
    search: "検索",
    clear: "クリア"
  }
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearchProduct, setSearchTag, handleSearch, clearSearch }) => {
  const [productName, setProductName] = useState("");
  const [tag, setTag] = useState("");
  const { language } = useLanguage();
  const { searchProducts, searchTags, search, clear } = translations[language];

  const handleClear = () => {
    setProductName("");
    setTag("");
    clearSearch();
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={productName}
        onChange={(e) => {
          setProductName(e.target.value);
          setSearchProduct(e.target.value);
        }}
        placeholder={searchProducts}
        className="search-bar"
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => {
          setTag(e.target.value);
          setSearchTag(e.target.value);
        }}
        placeholder={searchTags}
        className="search-bar"
      />
      <button onClick={handleSearch}>{search}</button>
      <button onClick={handleClear}>{clear}</button>
    </div>
  );
};

export default SearchBar;