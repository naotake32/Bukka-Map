import React from "react";
import { useEffect, useState } from "react";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import Map, {Marker, Popup,MapboxEvent} from 'react-map-gl';
import { MapLayerMouseEvent } from 'mapbox-gl';
import logoImg from "./assets/Bukka-logo-lateral.png";
import { ViewState } from 'react-map-gl'
import "../src/App.css";
import axios, { AxiosError } from "axios";
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
  const [price, setPrice] = useState<number | string>("");
  const [storeName, setStoreName] = useState("");
  const [viewport, setViewport] = useState({
    latitude: 49.2827,
    longitude: -123.1207,
    zoom: 10,
  });
  const minimumZoom = 13; // このズームレベル以上でないと投稿できないように設定
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
  const [tempPinLocation, setTempPinLocation] = useState<Geoloc | null>(null); // 仮のピンの位置を管理

  useEffect(() => {
    const getPins = async () => {
      try {
        console.log("Fetching pins from the server...");
        const res = await axios.get("/api/pins");
        console.log("Pins fetched successfully:", res.data);
        setPins(res.data);
        setFilteredPins(res.data); // 初期ロードで全てのピンを表示
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          // AxiosErrorの場合、errはAxiosError型であると確定する
          const axiosError = err as AxiosError;
          console.error("Failed to fetch pins:", axiosError.message);
          if (axiosError.response) {
            console.error("Error response:", axiosError.response.data);
            console.error("Status code:", axiosError.response.status);
          }
        } else {
          // それ以外のエラー
          console.error("An unexpected error occurred:", err);
        }
      }
    };
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
    setTempPinLocation(null); // 仮のピンの位置をリセット
    console.log(viewport);
  }
  //ダブルクリックを認識出来ているかを確認するデバッグ用関数
  const handleAddClick = (e: MapLayerMouseEvent) => {
    console.log("double clicked");
  };
// Function to add new tags
const handleAddTag = () => {
  let tagErrors = [];

  if (currentTag === "") {
    tagErrors.push("Tag cannot be empty. (タグは空にできません。)");
  }

  if (tags.includes(currentTag)) {
    tagErrors.push("Tags must be unique. (タグは重複しないようにしてください。)");
  }

  if (tags.length >= 3) {
    tagErrors.push("You can only have up to 3 tags. (タグは3つまでしか入力できません。)");
  }

  if (!/^[a-zA-Z0-9ぁ-ゔァ-ヴー々〆〤一-龥]+$/.test(currentTag)) {
    tagErrors.push("Tags can only contain letters, numbers, hiragana, katakana, and kanji without spaces. (タグはスペース無しで、英数字、ひらがな、カタカナ、漢字のみで入力してください。)");
  }

  if (currentTag.length > 25) {
    tagErrors.push("Tags must be 25 characters or less. (タグは25文字以内で入力してください。)");
  }

  if (tagErrors.length > 0) {
    alert(tagErrors.join('\n'));
    return;
  }

  setTags([...tags, currentTag]);
  setCurrentTag(""); // 入力フィールドをリセット
};
  //Function to remove tags
  const handleRemoveTag = (index: number) => {
    setTags(tags.filter((_, idx) => idx !== index));
  };

  //pinを追加する処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let errors = [];

    // 空白チェック
    if (!product) {
        errors.push("Product name is required. (商品名は必須です。)");
    } else if (product.length > 30) {
        errors.push("Product name must be 30 characters or less. (商品名は30文字以内で入力してください。)");
    }

    if (!price) {
      errors.push("Price is required. (価格は必須です。)");
    } else if (typeof price === "number" && price < 0) {
      errors.push("Price must be a positive number. (価格は正の数でなければなりません。)");
    }

    if (tags.length > 3) {
        errors.push("You can only have up to 3 tags. (タグは3つまでしか入力できません。)");
    }

    if (!tags.every(tag => /^[a-zA-Z0-9ぁ-ゔァ-ヴー々〆〤一-龥]+$/.test(tag))) {
        errors.push("Tags can only contain letters, numbers, hiragana, katakana, and kanji. (タグは英数字、ひらがな、カタカナ、漢字のみで入力してください。)");
    }

    if (new Set(tags).size !== tags.length) {
        errors.push("Tags must be unique. (タグは重複しないようにしてください。)");
    }

    if (!tags.every(tag => tag.length <= 25)) {
        errors.push("Tags must be 25 characters or less. (タグは25文字以内で入力してください。)");
    }

    if (desc) {
        const halfWidth = desc.replace(/[^\x00-\x7F]/g, '').length; // 半角文字の数
        const fullWidth = desc.length - halfWidth; // 全角文字の数
        if (halfWidth > 200 || fullWidth > 100) {
            errors.push("Description must be 200 half-width characters or 100 full-width characters or less. (説明文は半角200文字以内または全角100文字以内で入力してください。)");
        }
    }

    if (errors.length > 0) {
        setErrorMessage(errors.join('\n'));
        alert(errors.join('\n'));
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
    setTempPinLocation({ long: lng, lat: lat });
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
    height: '88%',
    position: 'absolute', // 'absolute' など具体的な値にする
    top: '13%',
    right: '0',
  };
  
  const mapStyleDesktop: React.CSSProperties = {
    width: '100%',
    height: '85%',
    position: 'absolute',
    bottom: '0',
    right: '0',
  };

  // Markerのスタイル設定部分を動的に変更します
  const highlightStyle = { color: "gold", transform: "scale(1.2)" };
  const normalStyle = { color: "tomato", cursor: "pointer" };


  const handleSidebarSelect = (id: string) => {
    setSelectedPostId(id); // 選択された投稿IDを更新
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
          <img src={logoImg} width="200px" max-height="70px" alt="logo-icon"/>
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
          zoom: 7,
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
        onClose={() => {
          setShowPopup(false);
          setCurrentPlaceId(null);  // ハイライトを解除するために追加
        }}
        style={{
          maxWidth: 'none'  // maxWidthを300pxに設定
        }}
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
          <label>Tags</label>
      <ul className="post-detail-tags">
        {pin.tags.map((tag, index) => (
          <li className="post-detail-tag" key={index}>{tag}</li>
        ))}
      </ul>
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
          setTempPinLocation(null); // 仮のピンを削除
        }}
        style={{
          maxWidth: 'none'  // maxWidthを300pxに設定
        }}
    >
         <div>
                <form onSubmit={handleSubmit}>
                  <label>Product Name(Required)</label>
                  <input
                    placeholder="Enter the product name"
                    autoFocus
                    onChange={(e) => setProduct(e.target.value)}
                  />
                  <label>Sale(Optional)</label>
                  <input
                    type="checkbox"
                    checked={isSale}
                    onChange={(e) => setIsSale(e.target.checked)}
                  />
                  <label>Price(Required)</label>
                  <input
                    type="number"
                    placeholder="Enter a price"
                    value={price}
                    onChange={(e) => setPrice(parseFloat(e.target.value))}
                  />
                  <select className="currency-select" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="$">$</option>
                    <option value="¥">¥</option>
                  </select>
                  <label>Store Name(Optional)</label>
                  <input
                    placeholder="Enter store name"
                    autoFocus
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                  <label>Tags(Optional)</label>
                  <div>
                    <input
                      value={currentTag}
                      placeholder="Enter a tag and add"
                      onChange={(e) => setCurrentTag(e.target.value)}
                    />
                    <button type="button" onClick={handleAddTag}>Add Tag</button>
                  </div>
                  <div className="form-tags-wrapper">
                    {tags.map((tag, index) => (
                      <div className="form-each-tag" key={index}>
                          <span className="form-tag">{tag}</span>
                          <button className="form-tag-remove-button" type="button" onClick={() => handleRemoveTag(index)}>x</button>
                      </div>
                    ))}
                  </div>
                  <label>Description(Optional)</label>
                  <textarea
                    placeholder="Explain about this product."
                    onChange={(e) => setDesc(e.target.value)}
                  />
                  {/* {errorMessage && <div className="error-message">{errorMessage}</div>}  */}
                  <button type="submit" className="submitButton">
                    Add Pin
                  </button>
                </form>
              </div>
  </Popup>
     }
     {tempPinLocation && (
     <Marker
     longitude={tempPinLocation.long}
     latitude={tempPinLocation.lat}
     anchor="bottom"
     >
     <ShoppingBasketIcon
       style={{
         fontSize: '50px', // ここでアイコンのサイズを調整
         color: 'tomato', // ここでアイコンの色を設定
         opacity: 0.4 // 透明度を設定
       }}
     />
     </Marker>
     )}
    </Map>


    <div className={`sidebar-wrapper ${sidebarVisible ? "visible" : ""}`}>
      <Sidebar pins={filteredPins} onPostClick={handleSidebarSelect} highlightedPin={selectedPostId} />
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
