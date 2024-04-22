import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { useRef, useState } from "react";
import "./login.css";

// 型を定義する
interface LoginProps {
  setShowLogin: (show: boolean) => void;
  setCurrentUser: (user: string) => void;
  myStorage: Storage;
}

export default function Login({ setShowLogin, setCurrentUser, myStorage }: LoginProps) {
  const [error, setError] = useState(false);
  // HTMLInputElementの型を指定
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
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
          minLength={8}
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