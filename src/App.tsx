import React from "react";
import { useEffect, useState } from "react";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Map, {Marker, Popup,MapboxEvent} from 'react-map-gl';
import "../src/App.css";
import axios from "axios";
import {format} from "timeago.js";
import Register from "./componetns/Register";
import Login from "./componetns/Login";
import Sidebar from "./componetns/Sidebar";// 追加
import AuthWrapper from "./componetns/Authwrapper"; // 追加
import SearchBar from "./componetns/SearchBar"; // 追加


type Pin = {
  _id: string;
  username: string;
  product: string;
  price: number;
  desc: string;
  lat: number;
  long: number;
  createdAt: number;
}
type Geoloc= {
  lat: number;
  long: number;
}

function App() {
  const myStorage = window.localStorage;
  const [currentUser,setCurrentUser] = useState(myStorage.getItem("user"));
  const [showPopup, setShowPopup] = React.useState(true);
  const [pins, setPins] = useState<Pin[]>([]);
  const [newPlace, setNewPlace] = useState<Geoloc>();
  const [product, setProduct] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 47.040182,
    longitude: 17.071727,
    zoom: 4,
  });
  const [currentPlaceId, setCurrentPlaceId] = useState(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isSale, setIsSale] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

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
    console.log('Mapbox Access Token:', import.meta.env.VITE_APP_MAPBOX);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  },[])

  const handleMarkerClick = (id: string, lat: number, long: number)=>{
    console.log(id);
    setCurrentPlaceId(id)
    setShowPopup(true);
    setViewport({...viewport, latitude: lat, longitude: long})
    console.log(viewport);
  }

  const handleAddClick = (e)=> {
    console.log("hellooooo");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPin = {
      username: currentUser,
      product,
      desc,
      price,
      lat: newPlace?.lat,
      long: newPlace?.long,
    };

    try {
      const res = await axios.post("/api//pins", newPin);
      setPins([...pins, res.data]);
      setNewPlace(null);
    } catch (err) {
      console.log(err);
    }
  };

  const noticeClick = (e: any) =>{
    console.log(e.lngLat.lng, e.lngLat.lat);
    setNewPlace({long : e.lngLat.lng,lat: e.lngLat.lat})
    console.log(newPlace);
  }

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  const mapStyleMobile = {
    width: '100%',
    height: '85%',
    position: 'absolute',
    top: '15%',
    right: '0',
  };
  
  const mapStyleDesktop = {
    width: '80%',
    height: '90%',
    position: 'absolute',
    bottom: '0',
    right: '0',
  };
  


  return (
    <>
      <div className="title-search">
        <h1 className="app-title">Bukka Map</h1>
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Map
        initialViewState={{
          latitude: 49.2827,
          longitude: -123.1207,
          zoom: 12,
        }}
        style={isMobile ? mapStyleMobile : mapStyleDesktop}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX}
        onDblClick = {handleAddClick}
        onClick={noticeClick}
        doubleClickZoom={false}
        transitionDuration="200"
      >
      {/* show icon */}
      {pins.map((pin)=>(
      <>
      <Marker
              latitude={pin.lat}
              longitude={pin.long}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                handleMarkerClick(pin._id, pin.lat, pin.long);
              }}
      >
      <ShoppingBasketIcon
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
          <p>sale{}</p>
          <label>Price</label>
          <p>{pin.price}$</p>
          <label>Description</label>
          <p className="desc">{pin.desc}</p>
          <span className="username">Posted by <b>{pin.username}</b></span>
          <span className="date">{format(pin.createdAt)}</span>
        </div>
      </Popup>)
    }
      </>
    ))}

    {/* adding a new pin */}
    {newPlace &&
    <Popup
        longitude={newPlace.long}
        latitude={newPlace.lat}
        closeButton={true}
        closeOnClick={false}
        anchor="bottom"
        onClose={() => setShowPopup(false)}
    >
         <div>
                <form onSubmit={handleSubmit}>
                  <label>Product Name</label>
                  <input
                    placeholder="Enter the product name"
                    autoFocus
                    onChange={(e) => setProduct(e.target.value)}
                  />
                  <label>Price</label>
                  <input
                    placeholder="Enter a price"
                    autoFocus
                    onChange={(e) => setPrice(e.target.value)}
                  />
                 
                  <label>Description</label>
                  <textarea
                    placeholder="Explain about this product."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
  </Popup>
     }
     {showRegister &&<Register setShowRegister={setShowRegister}/>}
     {showLogin && (
          <Login
            setShowLogin={setShowLogin}
            setCurrentUser={setCurrentUser}
            myStorage={myStorage}
          />
        )}
    </Map>


    <Sidebar pins={pins} searchTerm={searchTerm} /> 

    {/* {currentUser ? (
      <button className="button logout" onClick={handleLogout}>
        Log out
      </button>
    ) : (
      <div className="buttons">
        <button className="button login" 
                onClick={() => setShowLogin(true)}>
          Login
        </button>
        <button
              className="button register"
              onClick={() => setShowRegister(true)}>
          Register
        </button>
      </div>
    )} */}
    </>
  );
}

export default App
