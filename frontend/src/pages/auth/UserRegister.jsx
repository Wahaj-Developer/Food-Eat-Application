import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/auth-shared.css';
import FoodViewLogo from '../../components/FoodViewLogo';
import Loading from '../../components/Loading';
import api from '../../utils/api'

const UserRegister = () => {

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // Show / Hide password
    const [showPassword, setShowPassword] = useState(false);

    // =====================================================
    // REGISTER USER
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        const firstName =
            e.target.firstName.value;

        const lastName =
            e.target.lastName.value;

        const email =
            e.target.email.value;

        const password =
            e.target.password.value;

        try {

            // Show loading screen
            setLoading(true);

            const response = await api.post(
                '/api/auth/user/register',
                {
                    fullName:
                        firstName + ' ' + lastName,

                    email,

                    password,
                },
                {
                    withCredentials: true,
                }
            );

            console.log(response.data);

            // Registration completed
            // Redirect to Home
            navigate('/');

        } catch (error) {

            console.error(
                'Registration error:',
                error
            );

            // Remove loading screen
            setLoading(false);

        }

    };

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (
            <Loading
                message="Creating your account..."
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
                aria-labelledby="user-register-title"
            >

                <FoodViewLogo />

                {/* HEADER */}

                <header>

                    <h1
                        id="user-register-title"
                        className="auth-title"
                    >
                        Create your account
                    </h1>

                    <p className="auth-subtitle">
                        Join to explore and enjoy delicious meals.
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

                    {/* FIRST + LAST NAME */}

                    <div className="two-col">

                        <div className="field-group">

                            <label htmlFor="firstName">
                                First Name
                            </label>

                            <input
                                id="firstName"
                                name="firstName"
                                placeholder="Jane"
                                autoComplete="given-name"
                            />

                        </div>

                        <div className="field-group">

                            <label htmlFor="lastName">
                                Last Name
                            </label>

                            <input
                                id="lastName"
                                name="lastName"
                                placeholder="Doe"
                                autoComplete="family-name"
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
                            placeholder="you@example.com"
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
                                placeholder="••••••••"
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

                    {/* SUBMIT */}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        Sign Up
                    </button>

                </form>

                {/* LOGIN LINK */}

                <div className="auth-alt-action">

                    Already have an account?

                    {' '}

                    <Link to="/user/login">
                        Sign in
                    </Link>

                </div>

            </div>

        </div>

    );

};

export default UserRegister;