import React from "react";
import Map, {Marker, Popup} from 'react-map-gl';
import "../src/App.css";

function App() {
  const [showPopup, setShowPopup] = React.useState(true);
  return (
    <>
      <Map
      initialViewState={{
        longitude: -122.4,
        latitude: 37.8,
        zoom: 14
      }}
      style={{width: 600, height: 400}}
      mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX}
      >
    {/* show icon */}
    <Marker longitude={-100} latitude={40} anchor="bottom" >
      <img src="./pin.png" />
    </Marker>

    {/* show popup */}

    {showPopup && (
      <Popup longitude={-100} latitude={40}
        anchor="bottom"
        onClose={() => setShowPopup(false)}>
        <div className='card'>
          <label>Product Name</label>
          <h4 className="product">Apple</h4>
          <label>Price</label>
          <p>2.5$</p>
          <label>Description</label>
          <p className="desc">this was a good deal!</p>
          <span className="username">Posted by <b>Naoki</b></span>
          <span className="date">3 hours ago</span>
        </div>
      </Popup>)}
    </Map>


    </>
  );
}

export default App
