import React, { useState } from "react";

type SearchBarProps = {
  setSearchProduct: (productName: string) => void;
  setSearchTag: (tag: string) => void;
  handleSearch: () => void;
  clearSearch: () => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setSearchProduct, setSearchTag, handleSearch, clearSearch }) => {
  const [productName, setProductName] = useState("");
  const [tag, setTag] = useState("");

  const handleClear = () => {
    setProductName(""); // プロダクト名のステートをクリア
    setTag("");         // タグのステートをクリア
    clearSearch();      // 上位コンポーネントのクリア処理を呼び出し
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        value={productName}
        onChange={(e) => {
          setProductName(e.target.value); // ローカルステートを更新
          setSearchProduct(e.target.value); // 上位コンポーネントのステートを更新
        }}
        placeholder="Search products..."
        className="search-bar"
      />
      <input
        type="text"
        value={tag}
        onChange={(e) => {
          setTag(e.target.value); // ローカルステートを更新
          setSearchTag(e.target.value); // 上位コンポーネントのステートを更新
        }}
        placeholder="Search by tags..."
        className="search-bar"
      />
      <button onClick={handleSearch}>Search</button>
      <button onClick={handleClear}>Clear</button>
    </div>
  );
};

export default SearchBar;