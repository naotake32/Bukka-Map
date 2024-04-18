import React from "react";
import {format} from "timeago.js";
import "./Sidebar.css";

type Pin = {
  _id: string;
  username: string;
  product: string;
  price: number;
  tags: string[]; 
  desc: string;
  lat: number;
  long: number;
  createdAt: number;
}

type SidebarProps = {
  pins: Pin[];
};

const Sidebar: React.FC<SidebarProps> = ({ pins }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Filtered Posts</h2>
      <ul className="post-list">
        {pins.map((pin) => (
          <li key={pin._id} className="post-item">
            <h3>{pin.product}</h3>
            <p>{pin.price} $</p>
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