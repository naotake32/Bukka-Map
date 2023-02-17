import React from "react";
import { useEffect, useState } from "react";
import { Room } from "@mui/icons-material";
import Map, {Marker, Popup} from 'react-map-gl';
import "../src/App.css";
import axios from "axios";
import {format} from "timeago.js";

function App() {
  const [showPopup, setShowPopup] = React.useState(true);
  const [pins, setPins] = useState([]);

  useEffect(()=>{
    const getPins = async ()=> {
      try{
        const res = await axios.get("");
        setPins(res.data);
      }catch(err){
        console.log(err);
      }
    }
    getPins();
  },[])
  return (
    <>

      <Map
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX}
      >
    {/* show icon */}
    {pins.map((pin)=>{
    <Marker longitude={-100} latitude={40} anchor="bottom" >
          <Room />
      <Room
        style={{
           fontSize: 7 * viewport.zoom,
           color:
             currentUsername === pin.username ? "tomato" : "slateblue",
           cursor: "pointer",
         }}
         onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
      />
    </Marker>

    {/* show popup */}

    {showPopup && (
      <Popup longitude={pin.long} latitude={pin.lat}
        anchor="bottom"
        onClose={() => setShowPopup(false)}>
        <div className='card'>
          <label>Product Name</label>
          <h4 className="product">{pin.product}</h4>
          <label>Price</label>
          <p>{pin.price}$</p>
          <label>Description</label>
          <p className="desc">this was a good deal!</p>
          <span className="username">Posted by <b>{pin.username}</b></span>
          <span className="date">{format(pin.createdAt)}</span>
        </div>
      </Popup>)}
    })}
    </Map>


    </>
  );
}

export default App
