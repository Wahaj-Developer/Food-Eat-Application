import React, { useState } from 'react'
import '../../styles/auth-shared.css'
import { Link, useNavigate } from 'react-router-dom'
import FoodViewLogo from '../../components/FoodViewLogo'
import Loading from '../../components/Loading'
import api from '../../utils/api'

const FoodPartnerLogin = () => {

    const navigate = useNavigate()

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    // Show / Hide password
    const [showPassword, setShowPassword] = useState(false)

    // =====================================================
    // LOGIN FOOD PARTNER
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')
        setLoading(true)

        const email =
            e.target.email.value.trim()

        const password =
            e.target.password.value

        try {

            const response = await api.post(
                '/api/auth/foodpartner/login',
                {
                    email,
                    password
                },
                {
                    withCredentials: true
                }
            )

            console.log(
                'Partner login response:',
                response.data
            )

            // LOGIN SUCCESSFUL
            navigate('/createfood')

        } catch (error) {

            console.error(
                'Partner login error:',
                error
            )

            // LOGIN FAILED
            if (error.response) {

                setError(
                    error.response.data?.message ||
                    'Invalid email or password'
                )

            } else {

                setError(
                    'Unable to connect to the server. Please try again.'
                )

            }

            setLoading(false)

        }

    }

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {

        return (

            <Loading
                message="Signing you in..."
            />

        )

    }

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="auth-page-wrapper">

            <div
                className="auth-card"
                role="region"
                aria-labelledby="partner-login-title"
            >

                <FoodViewLogo />

                {/* HEADER */}

                <header>

                    <h1
                        id="partner-login-title"
                        className="auth-title"
                    >
                        Welcome back
                    </h1>

                    <p className="auth-subtitle">
                        Sign in to manage your food business.
                    </p>

                </header>

                {/* ACCOUNT TYPE SWITCH */}

                <nav className="auth-alt-action auth-switch-nav">

                    <strong className="auth-switch-label">
                        Switch:
                    </strong>

                    {' '}

                    <Link to="/user/login">
                        User
                    </Link>

                    {' • '}

                    <Link to="/foodpartner/login">
                        Food partner
                    </Link>

                </nav>

                {/* FORM */}

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                    noValidate
                >

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
                            onChange={() =>
                                setError('')
                            }
                            className={
                                error
                                    ? 'input-error'
                                    : ''
                            }
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
                                autoComplete="current-password"
                                onChange={() =>
                                    setError('')
                                }
                                className={
                                    error
                                        ? 'input-error'
                                        : ''
                                }
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

                    {/* ERROR */}

                    {error && (

                        <div
                            className="auth-error"
                            role="alert"
                        >

                            <span className="auth-error-icon">
                                !
                            </span>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}

                    {/* SUBMIT */}

                    <button
                        className="auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        Sign In
                    </button>

                </form>

                {/* REGISTER LINK */}

                <div className="auth-alt-action">

                    New partner?{' '}

                    <Link to="/foodpartner/register">
                        Create an account
                    </Link>

                </div>

            </div>

        </div>

    )

}

export default FoodPartnerLogin