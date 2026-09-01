import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';
import FoodViewLogo from '../../components/FoodViewLogo';
import Loading from '../../components/Loading';
import api from '../../utils/api'

const FoodPartnerRegister = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Show / Hide password
    const [showPassword, setShowPassword] = useState(false);

    // =====================================================
    // REGISTER FOOD PARTNER
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const businessName =
            e.target.businessName.value;

        const contactName =
            e.target.contactName.value;

        const phone =
            e.target.phone.value;

        const email =
            e.target.email.value;

        const address =
            e.target.address.value;

        const password =
            e.target.password.value;

        try {

            // Show loading screen
            setLoading(true);

            const response = await api.post(
                '/api/auth/foodpartner/register',
                {
                    name: businessName,
                    contactName,
                    phone,
                    email,
                    address,
                    password
                },
                {
                    withCredentials: true
                }
            );

            console.log(
                'Food partner registration:',
                response.data
            );

            // Registration successful
            navigate('/createfood');

        } catch (error) {

            console.error(
                'Food partner registration error:',
                error
            );

            // Hide loading screen
            setLoading(false);

        }

    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <Loading
                message="Creating your partner account..."
            />

        );

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="auth-page-wrapper">

            <div
                className="auth-card"
                role="region"
                aria-labelledby="partner-register-title"
            >

                <FoodViewLogo />

                {/* HEADER */}

                <header>

                    <h1
                        id="partner-register-title"
                        className="auth-title"
                    >
                        Partner sign up
                    </h1>

                    <p className="auth-subtitle">
                        Grow your business with our platform.
                    </p>

                </header>

                {/* ACCOUNT TYPE SWITCH */}

                <nav className="auth-alt-action auth-switch-nav">

                    <strong className="auth-switch-label">
                        Switch:
                    </strong>

                    {' '}

                    <Link to="/user/register">
                        User
                    </Link>

                    {' • '}

                    <Link to="/foodpartner/register">
                        Food partner
                    </Link>

                </nav>

                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

                    {/* BUSINESS NAME */}

                    <div className="field-group">

                        <label htmlFor="businessName">
                            Business Name
                        </label>

                        <input
                            id="businessName"
                            name="businessName"
                            placeholder="Tasty Bites"
                            autoComplete="organization"
                        />

                    </div>

                    {/* CONTACT + PHONE */}

                    <div className="two-col">

                        <div className="field-group">

                            <label htmlFor="contactName">
                                Contact Name
                            </label>

                            <input
                                id="contactName"
                                name="contactName"
                                placeholder="Jane Doe"
                                autoComplete="name"
                            />

                        </div>

                        <div className="field-group">

                            <label htmlFor="phone">
                                Phone
                            </label>

                            <input
                                id="phone"
                                name="phone"
                                placeholder="+1 555 123 4567"
                                autoComplete="tel"
                            />

                        </div>

                    </div>

                    {/* EMAIL */}

                    <div className="field-group">

                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="business@example.com"
                            autoComplete="email"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="field-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="password-input-wrapper">

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                placeholder="Create password"
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        prev => !prev
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword
                                    ? 'Hide'
                                    : 'Show'}
                            </button>

                        </div>

                    </div>

                    {/* ADDRESS */}

                    <div className="field-group">

                        <label htmlFor="address">
                            Address
                        </label>

                        <input
                            id="address"
                            name="address"
                            placeholder="123 Market Street"
                            autoComplete="street-address"
                        />

                        <p className="small-note">
                            Full address helps customers find you faster.
                        </p>

                    </div>

                    {/* SUBMIT */}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        Create Partner Account
                    </button>

                </form>

                {/* LOGIN LINK */}

                <div className="auth-alt-action">

                    Already a partner?{' '}

                    <Link to="/foodpartner/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default FoodPartnerRegister;