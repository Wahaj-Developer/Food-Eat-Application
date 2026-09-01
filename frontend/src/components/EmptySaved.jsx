import React from 'react'
import { Link } from 'react-router-dom'
import FoodViewLogo from './FoodViewLogo'


const EmptySaved = () => {

    return (

        <div className="saved-empty-page">

            {/* =========================================
                LOGO
            ========================================= */}

            <div className="saved-empty-logo">

                <FoodViewLogo />

            </div>


            {/* =========================================
                CONTENT
            ========================================= */}

            <main className="saved-empty-content">

                {/* BOOKMARK ICON */}

                <div
                    className="saved-empty-icon"
                    aria-hidden="true"
                >

                    <svg
                        width="34"
                        height="34"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >

                        <path
                            d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"
                        />

                    </svg>

                </div>


                <h1>
                    Nothing saved yet
                </h1>


                <p>
                    Discover delicious food and save your
                    favorite videos to find them here later.
                </p>


                <Link
                    to="/"
                    className="saved-empty-button"
                >
                    Explore Food
                </Link>

            </main>

        </div>

    )

}


export default EmptySaved