import React from "react";
import { useEffect, useState } from "react";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Map, {Marker, Popup,MapboxEvent} from 'react-map-gl';
import { MapLayerMouseEvent } from 'mapbox-gl';
import { ViewState } from 'react-map-gl'
import "../src/App.css";
import axios from "axios";
import {format} from "timeago.js";
import { BrowserRouter } from 'react-router-dom';
import LandingPage from "./componetns/LandingPage";// 追加
import Sidebar from "./componetns/Sidebar";// 追加
import SearchBar from "./componetns/SearchBar"; // 追加
import { point } from '@turf/helpers';
import distance from '@turf/distance';


type Pin = {
  _id: string;
  username: string;
  product: string;
  storeName: string;
  currency: string; 
  price: number;
  isSale: boolean; // 追加
  tags: string[]; 
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
  const [currency, setCurrency] = useState("$");
  const [price, setPrice] = useState("");
  const [storeName, setStoreName] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    zoom: 10,
  });
  const minimumZoom = 15; // このズームレベル以上でないと投稿できないように設定
  const [currentPlaceId, setCurrentPlaceId] = useState<string | null>(null);
  const [isSale, setIsSale] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentTag, setCurrentTag] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [filteredPins, setFilteredPins] = useState<Pin[]>([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [searchTag, setSearchTag] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  useEffect(()=>{
    const getPins = async ()=> {
      try{
        const res = await axios.get("/api/pins");
        setPins(res.data);
        setFilteredPins(res.data); // 初期ロードで全てのピンを表示
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
  //ダブルクリックを認識出来ているかを確認するデバッグ用関数
  const handleAddClick = (e: MapLayerMouseEvent) => {
    console.log("double clicked");
  };
  //Function to add new tags
  const handleAddTag = () => {
    if (!tags.includes(currentTag) && currentTag !== "") {
      setTags([...tags, currentTag]);
      setCurrentTag(""); // 入力フィールドをリセット
    }
  };
  //Function to remove tags
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  //pinを追加する処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 空白チェック
    if (!product || !price || !desc) {
      setErrorMessage("All fields must be filled out.");
      return; // 送信を阻止
    }
  
    const formattedPrice = `${currency}${price}`; // 価格情報に通貨記号を追加

    const newPin = {
      username: currentUser,
      product,
      storeName, 
      desc,
      currency,
      price,
      isSale,
      tags,
      lat: newPlace?.lat,
      long: newPlace?.long,
    };

    try {
      const res = await axios.post("/api/pins", newPin);
      const updatedPins = [...pins, res.data];
      setPins([...pins, res.data]);
          // ここでfilteredPinsも更新します。
      setFilteredPins(updatedPins);
      setNewPlace(undefined);
      setErrorMessage(""); // エラーメッセージをクリア
      setTags([]); // タグの配列をリセット
      setCurrentTag(""); // タグ入力フィールドもリセット
    } catch (err) {
      console.log(err);
    }
  };

  const noticeClick = (e: MapLayerMouseEvent) => {
    const {lng, lat} = e.lngLat;
    const currentZoom = e.target.getZoom();
    if (currentZoom < minimumZoom) {
      console.log(currentZoom, minimumZoom);
      alert("Please zoom in further to post.");
      return;
    }
    console.log(lng, lat);
    setNewPlace({long: lng, lat: lat});
  };
 //デバッグ用に新しいnewPlaceの値をチェックする関数
  useEffect(() => {
    console.log(newPlace);
  }, [newPlace]);

  const handleLogout = () => {
    setCurrentUser(null);
    myStorage.removeItem("user");
  };

  const mapStyleMobile: React.CSSProperties = {
    width: '100%',
    height: '85%',
    position: 'absolute', // 'absolute' など具体的な値にする
    top: '15%',
    right: '0',
  };
  
  const mapStyleDesktop: React.CSSProperties = {
    width: '80%',
    height: '85%',
    position: 'absolute',
    bottom: '0',
    right: '0',
  };

  // Markerのスタイル設定部分を動的に変更します
  const highlightStyle = { color: "gold", transform: "scale(1.2)" };
  const normalStyle = { color: "tomato", cursor: "pointer" };


  const handleSidebarSelect = (id: string) => {
    setCurrentPlaceId(id);
    setShowPopup(false); // ポップアップを表示しない
  }
  
  const handleSearch = () => {
    console.log("Searching from:", viewport.longitude, viewport.latitude);
  
    const center = point([viewport.longitude, viewport.latitude]);
    console.log("Center point:", center);
  
    const result = pins.filter(pin => {
      const pinPoint = point([pin.long, pin.lat]);
      const distanceToCenter = distance(center, pinPoint, {units: 'kilometers'});
      console.log(`Distance to center for pin ${pin._id}:`, distanceToCenter);
  
      return distanceToCenter <= 50 &&
        pin.product.toLowerCase().includes(searchProduct.toLowerCase()) &&
        (searchTag === "" || pin.tags.includes(searchTag));
    });
  
    console.log("Filtered pins:", result.length);
    setFilteredPins(result);
  };
  
  //検索結果、検索ワードのクリア
  const clearSearch = () => {
    setSearchProduct("");
    setSearchTag("");
    setFilteredPins(pins);
  };
  
  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);

  
  useEffect(() => {
    console.log("Viewport changed:", viewport);
  }, [viewport]);

  return (
    <>
      <BrowserRouter>
      <section>
      <div className="title-search">
          <img src="./src/assets/Bukka-logo-lateral.png" width="200px" alt="logo-icon"/>
        <SearchBar
          setSearchProduct={setSearchProduct}
          setSearchTag={setSearchTag}
          handleSearch={handleSearch}
          clearSearch={clearSearch}
        />
      </div>
      <Map
        initialViewState={{
          latitude: 49.2827,
          longitude: -123.1207,
          zoom: 10,
        }}
        style={isMobile ? mapStyleMobile : mapStyleDesktop}
        mapStyle="mapbox://styles/mapbox/streets-v9"
        mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX}
        onDblClick = {handleAddClick}
        onClick={noticeClick}
        doubleClickZoom={false}
        onMoveEnd={(evt) => setViewport(evt.viewState)}
      >
      {/* show icon */}
      {filteredPins.map((pin) => (
      <>
      <Marker
              key={pin._id}  // 各Markerに一意のkeyを割り当て
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
        fontSize: 3.5 * viewport.zoom,
        ...(pin._id === currentPlaceId ? highlightStyle : normalStyle),
      }}
          onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
      />
    </Marker>

    {/* show popup */}
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
          <label>Store Name</label>
          <h4 className="storeName">{pin.storeName}</h4> 
          <label>Price</label>
          <p style={{ color: pin.isSale ? "red" : "black" }}>
            {pin.price}$
            {pin.isSale && <span style={{ color: "red" }}>(SALE)</span>}
          </p>
          <label>Description</label>
          <p className="desc">{pin.desc}</p>
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
        onClose={() => {
          setNewPlace(undefined); // newPlaceをundefinedにリセット.これをしないとバツ印を押した後にフォームが表示されなくなる
          setShowPopup(false); // ポップアップ表示を制御
          setErrorMessage(""); // エラーメッセージをリセット
          setTags([]); // タグの配列の中身を空にする
        }}
    >
         <div>
                <form onSubmit={handleSubmit}>
                  <label>Product Name</label>
                  <input
                    placeholder="Enter the product name"
                    autoFocus
                    onChange={(e) => setProduct(e.target.value)}
                  />
                  <label>Sale</label>
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                  />
                  <label>Price</label>
                  <input
                    placeholder="Enter a price"
                    autoFocus
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="$">$ (USD)</option>
                    <option value="¥">¥ (JPY)</option>
                  </select>
                  <label>Store Name</label>
                  <input
                    placeholder="Enter store name"
                    autoFocus
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <label>Tags</label>
                  <div>
                    <input
                      value={currentTag}
                      placeholder="Enter a tag and add"
                      onChange={(e) => setCurrentTag(e.target.value)}
                    />
                    <button type="button" onClick={handleAddTag}>Add Tag</button>
                  </div>
                  <div>
                    {tags.map((tag, index) => (
                      <div key={index}>
                        <span>{tag}</span>
                        <button type="button" onClick={() => handleRemoveTag(index)}>Remove</button>
                      </div>
                    ))}
                  </div>
                  <label>Description</label>
                  <textarea
                    placeholder="Explain about this product."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  {errorMessage && <div className="error-message">{errorMessage}</div>} 
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
  </Popup>
     }
    </Map>


    <div className={`sidebar-wrapper ${sidebarVisible ? "visible" : ""}`} onClick={toggleSidebar}>
    <Sidebar pins={filteredPins} onPostClick={handleSidebarSelect} />
          </div>
          <button className={`toggle-button ${sidebarVisible ? "visible" : ""}`} onClick={toggleSidebar}>
          {sidebarVisible ? '▼' : '▲'}
          </button>
    </section>
    </BrowserRouter>
    </>
  );
}

export default App
