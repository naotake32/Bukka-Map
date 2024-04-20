import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    return (
        <div className="landing-container">
            <h1>Welcome to Our App!</h1>
            <p>Discover the best places and shop your favorite products.</p>
            <div>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
            </div>
        </div>
    );
}

export default LandingPage;