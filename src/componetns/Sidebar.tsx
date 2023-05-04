import React from "react";
import {format} from "timeago.js";
import "./Sidebar.css";

type SidebarProps = {
  pins: Array<Pin>;
};

const Sidebar: React.FC<SidebarProps> = ({ pins }) => {
  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Recent Posts</h2>
      <ul className="post-list">
        {pins.map((pin) => (
          <li key={pin._id} className="post-item">
            <h3>{pin.product}</h3>
            <p>{pin.price}$</p>
            <span>Posted by {pin.username}</span>
            <span>{format(pin.createdAt)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;