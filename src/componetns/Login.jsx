import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUser,myStorage }) {
  const [error, setError] = useState(false);
  const usernameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current.value,
      password: passwordRef.current.value,
    };
    try {
      const res = await axios.post("api/users/login", user);
      setCurrentUser(res.data.username);
      myStorage.setItem('user', res.data.username);
      setShowLogin(false)
    } catch (err) {
      setError(true);
      console.log(err,user);
    }
  };

  return (
    <div className="loginContainer">
      <div className="logo">
        <ShoppingBasketIcon className="logoIcon" />
        <span>Bukka-Map</span>
      </div>
      <form onSubmit={handleSubmit}>
        <input autoFocus placeholder="username" ref={usernameRef} />
        <input
          type="password"
          minlength="8"
          placeholder="password"
          ref={passwordRef}
        />
        <button className="loginBtn" type="submit">
          Login
        </button>
        {error && <span className="failure">Something went wrong!</span>}
      </form>
      <CancelIcon className="loginCancel" onClick={() => setShowLogin(false)} />
    </div>
  );
}