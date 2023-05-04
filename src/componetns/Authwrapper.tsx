import React from "react";
import "./AuthWrapper.css";
import Login from "./Login";
import Register from "./Register";

type AuthWrapperProps = {
  showRegister: boolean;
  setShowRegister: (show: boolean) => void;
  showLogin: boolean;
  setShowLogin: (show: boolean) => void;
  setCurrentUser: (user: string | null) => void;
  myStorage: Storage;
};

const AuthWrapper: React.FC<AuthWrapperProps> = ({
  showRegister,
  setShowRegister,
  showLogin,
  setShowLogin,
  setCurrentUser,
  myStorage,
}) => {
  return (
    <div className="auth-wrapper">
      {showRegister && (
        <Register setShowRegister={setShowRegister} />
      )}
      {showLogin && (
        <Login
          setShowLogin={setShowLogin}
          setCurrentUser={setCurrentUser}
          myStorage={myStorage}
        />
      )}
    </div>
  );
};

export default AuthWrapper;