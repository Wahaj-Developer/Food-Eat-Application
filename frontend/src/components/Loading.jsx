import React from 'react'
import '../styles/loading.css'
import FoodViewLogo from './FoodViewLogo'

const Loading = ({ message = 'Loading...' }) => {

    return (

        <div className="loading-page">

            <div className="loading-content">

                <div className="loading-logo">
                    <FoodViewLogo />
                </div>

                <div className="loading-spinner">
                    <span></span>
                </div>

                <p className="loading-message">
                    {message}
                </p>

            </div>

        </div>

    )
}

export default Loading