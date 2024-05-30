import React from "react";
import { format } from "timeago.js";
import { format as formatDate } from "date-fns";
import { ja, enUS } from "date-fns/locale";
import "./Sidebar.css";
import { useLanguage } from '../Contexts/LanguageContext';

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
};

type SidebarProps = {
  pins: Pin[];
  onPostClick: (id: string) => void;
  highlightedPin: string | null;
};

const translations = {
  en: {
    posts: "Recent Posts",
    store: "Store",
    sale: "(SALE)"
  },
  jp: {
    posts: "最近の投稿",
    store: "店舗",
    sale: "(セール)"
  }
};


const Sidebar: React.FC<SidebarProps> = ({ pins, onPostClick, highlightedPin }) => {
  const { language } = useLanguage();
  const { posts, store, sale } = translations[language];

  const sortedPins = pins.slice().sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">{posts}</h2>
      <ul className="post-list">
        {sortedPins.map((pin) => (
          <li key={pin._id}
            className={`post-item ${pin._id === highlightedPin ? 'highlighted' : ''}`}
            onClick={() => onPostClick(pin._id)}
            onMouseEnter={() => onPostClick(pin._id)}
            onMouseLeave={() => onPostClick(pin._id)}>
            <h3>{pin.product}</h3>
            <p className="store-name">{store}: {pin.storeName}</p>
            <p className="price-text" style={{ color: pin.isSale ? "red" : "black" }}>
              {pin.currency}{pin.price}
              {pin.isSale && <span style={{ color: "red" }}>{sale}</span>}
            </p>
            <ul className="tag-list">
              {pin.tags.map(tag => (
                <li key={tag} className="tag-item">{tag}</li>
              ))}
            </ul>
            {/* <span>Posted by {pin.username}</span> */}
            <span>{language === 'en' ? format(pin.createdAt) : formatDate(new Date(pin.createdAt), 'PPP', { locale: ja })}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
