import "./register.css"
import { useState, useRef } from "react";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";

export default function Register({setShowRegister}) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("called");
        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        try{
            const res = await axios.post("/api/users/register", newUser);
            console.log(newUser);
            setSuccess(true);
        }catch(err){
            console.log(err);
            setError(true);
        }

    }
  
    return (
        <div className="registerContainer">
            <div className="logo"><ShoppingBasketIcon/>Bukka Map</div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="username" ref={usernameRef}/>
                <input type="email" placeholder="email" ref={emailRef}/>
                <input
                    type="password"
                    minlength="8"
                    placeholder="password"
                    ref={passwordRef}
        />
                <button className="registerBtn" type="submit">Register</button>
                {success && (
          <span className="success">Successfull. You can login now!</span>
        )}
                 {error && <span className="failure">Something went wrong!</span>}
            </form>
      <CancelIcon
        className="registerCancel"
        onClick={() => setShowRegister(false)}
      />
        </div>
    )
}