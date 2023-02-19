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
  const [pins, setPins] = useState([]);
  const [newPlace, setNewPlace] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [currentPlaceId, setCurrentPlaceId] = useState(null);

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

  const handleMarkerClick = (id)=>{
    console.log(id);
    setCurrentPlaceId(id)
    setShowPopup(true);
  }

  const handleAddClick = ()=> {
    console.log("hello");
    // const [long, lat] = e.lngLat.toArray();
    // setNewPlace([
    //   lat,
    //   long
    // ])
  }

  const noticeClick = () => {
    console.log("hello");
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
      onClick={noticeClick}
      >
      {/* show icon */}
      {pins.map((pin)=>(
      <>
      <Marker
              longitude={-100}
              latitude={40}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(pin._id, pin.lat, pin.long);
              }}
      >
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
    {console.log(pin._id === currentPlaceId)}
    {pin._id === currentPlaceId && showPopup && (
      <Popup
        longitude={pin.long}
        latitude={pin.lat}
        anchor="bottom"
        onClose={() => setShowPopup(false)}
        //closeOnClick={false}
>
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
      </Popup>)
    }
      </>
    ))}
    {newPlace &&
    <Popup
        longitude={newPlace.long}
        latitude={newPlace.lat}
        closeButton={true}
        closeOnClick={false}
        anchor="bottom"
        onClose={() => setShowPopup(false)}
    >
      </Popup>
     }
    </Map>


    </>
  );
}

export default App
