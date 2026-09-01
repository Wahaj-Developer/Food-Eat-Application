import React from 'react'

const FoodViewLogo = () => {
    return (
        <div className="food-view-logo" aria-label="Food Eat">

            <div className="food-view-logo-text">
                <span className="food-word">FOOD</span>
                <span className="eat-word">EAT</span>
            </div>

            <svg
                className="food-view-arrow"
                viewBox="0 0 220 55"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M18 10
                       C45 48, 125 55, 190 25
                       C198 21, 204 18, 210 13"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                />

                <path
                    d="M193 8
                       L211 13
                       L198 27"
                    stroke="currentColor"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

        </div>
    )
}

export default FoodViewLogo