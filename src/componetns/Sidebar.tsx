import React from "react";
import {format} from "timeago.js";
import "./Sidebar.css";

type Pin = {
  _id: string;
  username: string;
  product: string;
  storeName: string;  
  currency: string;
  price: number;
  isSale: boolean;
  tags: string[]; 
  desc: string;
  lat: number;
  long: number;
  createdAt: number;
}

type SidebarProps = {
  pins: Pin[];
  onPostClick: (id: string) => void;
  highlightedPin: string | null; // ハイライトされているピンのIDを受け取る
};

const Sidebar: React.FC<SidebarProps> = ({ pins, onPostClick, highlightedPin }) => {
  // Dateオブジェクトに変換してからタイムスタンプでソート
  const sortedPins = pins.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Posts</h2>
      <ul className="post-list">
        {sortedPins.map((pin) => (
          <li key={pin._id} 
          className={`post-item ${pin._id === highlightedPin ? 'highlighted' : ''}`}
              onClick={() => onPostClick(pin._id)}
              onMouseEnter={() => onPostClick(pin._id)}
              onMouseLeave={() => onPostClick(pin._id)}>
            <h3>{pin.product}</h3>
            <p className="store-name">Store: {pin.storeName}</p>
            <p style={{ color: pin.isSale ? "red" : "black" }}>
              {pin.currency}{pin.price}
              {pin.isSale && <span style={{ color: "red" }}>(SALE)</span>}
            </p>
            <div>Tags: {pin.tags.join(", ")}</div>
            <span>Posted by {pin.username}</span>
            <span>{format(pin.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;