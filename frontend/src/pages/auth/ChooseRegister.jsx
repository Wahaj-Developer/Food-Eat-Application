import React from 'react';
import { Link } from 'react-router-dom';
import FoodViewLogo from '../../components/FoodViewLogo'
import '../../styles/auth-shared.css';

const ChooseRegister = () => {
  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="choose-register-title">
         <FoodViewLogo />
        <header>
          <h1 id="choose-register-title" className="auth-title">Register</h1>
          <p className="auth-subtitle">Pick how you want to join the platform.</p>
        </header>

        <div className="choose-register-options">
          <Link to="/user/register" className="auth-submit">
            Register as normal user
          </Link>
          <Link to="/foodpartner/register" className="auth-submit auth-submit-alt">
            Register as food partner
          </Link>
        </div>

        <div className="auth-alt-action">
          Already have an account? <Link to="/user/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default ChooseRegister;