import React from "react";
import { useEffect, useState } from "react";
import { Room } from "@mui/icons-material";
import Map, {Marker, Popup} from 'react-map-gl';
import "../src/App.css";
import axios from "axios";
import {format} from "timeago.js";

function App() {
  const currentUser = "aaaa"
  const [showPopup, setShowPopup] = React.useState(true);
  const [pins, setPins] = useState([
    {
      
        "username": "aaaa",
        "product": "Apple",
        "desc": "It was a good deal!",
        "price": 2.5,
        "lat": 40,
        "long": -100,
        "_id": "63effb6ac82e4c908a5cc0b3",
        "createdAt": "2023-02-17T22:10:50.978Z",
        "updatedAt": "2023-02-17T22:10:50.978Z",
        "__v": 0
      
    }
  ]);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  // const [currentPlaceId, setCurrentPlaceId] = useState(null);

  useEffect(()=>{
    const getPins = async ()=> {
      try{
        const res = await axios.get("/api/pins");
        setPins(res.data);
      }catch(err){
        console.log(err);
      }
    }
    getPins();
  },[])

  // const handleMarkerClick = (id)=>{
  //   setCurrentPlaceId(id)
  // }

    const handleAddClick = (e) => {
      console.log(e);
    }
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
      onDblClick = {handleAddClick}
      >
    {/* show icon */}
    {pins.map((pin)=>(
      <>
    <Marker longitude={-100} latitude={40} anchor="bottom" >
          <Room />
      <Room
        style={{
           fontSize: 7 * viewport.zoom,
           color:
             currentUser === pin.username ? "tomato" : "slateblue",
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
      </>
    ))}
    </Map>


    </>
  );
}

export default App
