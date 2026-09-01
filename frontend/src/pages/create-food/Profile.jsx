import React, { useEffect, useState } from 'react'

import '../../styles/profile.css'

import { NavLink, useParams } from 'react-router-dom'

import api from '../../utils/api'

import FoodViewLogo from '../../components/FoodViewLogo'
import ReelViewer from '../../components/ReelViewer'
import Loading from '../../components/Loading'


const Profile = () => {

    const { id } = useParams()

    const [profile, setProfile] = useState(null)

    const [videos, setVideos] = useState([])

    const [selectedVideoIndex, setSelectedVideoIndex] =
        useState(null)
    const [loading, setLoading] = useState(true)


    // =========================================
    // GET PROFILE
    // =========================================

   useEffect(() => {

    setLoading(true)

    api
        .get(
            `/api/foodpartner/${id}`,
            {
                withCredentials: true
            }
        )
        .then((response) => {

            console.log(
                'Food Partner:',
                response.data
            )

            const foodPartner =
                response.data.foodPartner

            setProfile(foodPartner)

            setVideos(
                foodPartner?.foodItems || []
            )

        })
        .catch((error) => {

            console.error(
                'Error fetching food partner:',
                error
            )

        })
        .finally(() => {

            setLoading(false)

        })

}, [id])


    // =========================================
    // TOTAL LIKES
    // =========================================

    const totalLikes = videos.reduce(
        (total, video) => {

            return total + (
                video.likeCount ?? 0
            )

        },
        0
    )


    // =========================================
    // LIKE VIDEO
    // =========================================

    const handleLike = async (item) => {

        try {

            const response = await api.post(
                '/api/food/like',
                {
                    foodId: item._id
                },
                {
                    withCredentials: true
                }
            )


            const liked =
                response.data.liked


            setVideos((previousVideos) =>

                previousVideos.map((video) => {

                    if (video._id !== item._id) {

                        return video

                    }


                    return {

                        ...video,

                        isLiked: liked,

                        likeCount:
                            liked
                                ? (video.likeCount ?? 0) + 1
                                : Math.max(
                                    0,
                                    (video.likeCount ?? 0) - 1
                                )

                    }

                })

            )

        } catch (error) {

            console.error(
                'Error liking video:',
                error
            )

        }

    }


    // =========================================
    // SAVE VIDEO
    // =========================================

    const handleSave = async (item) => {

        try {

            const response = await api.post(
                '/api/food/save',
                {
                    foodId: item._id
                },
                {
                    withCredentials: true
                }
            )


            const saved =
                response.data.saved


            setVideos((previousVideos) =>

                previousVideos.map((video) => {

                    if (video._id !== item._id) {

                        return video

                    }


                    return {

                        ...video,

                        isSaved: saved,

                        savesCount:
                            saved
                                ? (video.savesCount ?? 0) + 1
                                : Math.max(
                                    0,
                                    (video.savesCount ?? 0) - 1
                                )

                    }

                })

            )

        } catch (error) {

            console.error(
                'Error saving video:',
                error
            )

        }

    }


    // =========================================
    // CLOSE REEL VIEWER
    // =========================================

    const closeViewer = () => {

        setSelectedVideoIndex(null)

    }

    if (loading) {

    return (
        <Loading
            message="Loading profile..."
        />
    )

}

   
    // =========================================
    // RENDER
    // =========================================

    return (

        <main className="profile-page">


            {/* =====================================
                NAVBAR
            ===================================== */}

           <nav className="profile-navbar">

    {/* LOGO */}

    <div className="profile-brand">

        <FoodViewLogo />

    </div>


    {/* NAVIGATION */}

    <div className="profile-nav-links">

        {/* HOME */}

        <NavLink
            to="/"
            end
            className={({ isActive }) =>
                `profile-nav-item ${
                    isActive ? 'is-active' : ''
                }`
            }
            aria-label="Home"
        >

            <svg
                width="21"
                height="21"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M3 10.5 12 3l9 7.5" />
                <path d="M5 10v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V10" />
            </svg>

        </NavLink>


        {/* SAVED */}

        <NavLink
            to="/saved"
            className={({ isActive }) =>
                `profile-nav-item ${
                    isActive ? 'is-active' : ''
                }`
            }
            aria-label="Saved"
        >

            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
            >
                <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
            </svg>

        </NavLink>

    </div>

</nav>

            {/* =====================================
                PROFILE CARD
            ===================================== */}

            <section className="profile-card">


                {/* =================================
                    LEFT SIDE
                ================================= */}

                <div className="profile-info">


                    {/* BUSINESS NAME */}

                    <h1 className="profile-business">

                        {profile?.name ||
                            'Business Name'}

                    </h1>


                    {/* ADDRESS */}

                    <p className="profile-address">

                        <span className="location-pin">
                            📍
                        </span>

                        <span>

                            {profile?.address ||
                                'Address not available'}

                        </span>

                    </p>


                    {/* CONTACT INFORMATION */}

                    <div className="profile-contact">


                        {/* CONTACT PERSON */}

                        <div className="profile-contact-item">

                            <span className="profile-contact-label">

                                CONTACT PERSON

                            </span>

                            <span className="profile-contact-value">

                                {profile?.contactName ||
                                    'Not available'}

                            </span>

                        </div>


                        {/* PHONE */}

                        <div className="profile-contact-item">

                            <span className="profile-contact-label">

                                PHONE

                            </span>

                            <span className="profile-contact-value">

                                {profile?.phone ||
                                    'Not available'}

                            </span>

                        </div>


                    </div>

                </div>


                {/* =================================
                    RIGHT SIDE — FOOD EAT BRANDING
                ================================= */}

                <div className="profile-brand-panel">

                    <FoodViewLogo />

                    <p className="profile-brand-text">

                        Discover great food.
                        <br />
                        Support local creators.

                    </p>

                </div>


            </section>


            {/* =====================================
                STATS
            ===================================== */}

            <section className="profile-stats">


                {/* POSTS */}

                <div className="profile-stat">

                    <span className="profile-stat-label">

                        POSTS

                    </span>

                    <strong className="profile-stat-value">

                        {videos.length}

                    </strong>

                </div>


                {/* LIKES */}

                <div className="profile-stat">

                    <span className="profile-stat-label">

                        LIKES

                    </span>

                    <strong className="profile-stat-value">

                        {totalLikes}

                    </strong>

                </div>


            </section>


            {/* =====================================
                VIDEO SECTION
            ===================================== */}

            <section className="profile-video-section">


                {/* SECTION HEADING */}

                <div className="profile-video-heading">

                    <div>

                        <span className="profile-section-kicker">

                            FOOD CONTENT

                        </span>

                        <h2>

                            Food Videos

                        </h2>

                    </div>


                    <span className="profile-post-count">

                        {videos.length}

                        {' '}

                        {videos.length === 1
                            ? 'post'
                            : 'posts'}

                    </span>

                </div>


                {/* =================================
                    EMPTY STATE
                ================================= */}

                {videos.length === 0 ? (

                    <div className="profile-empty-state">


                        <div className="profile-empty-icon">

                            +

                        </div>


                        <h3>

                            No food videos yet

                        </h3>


                        <p>

                            This food partner has not
                            uploaded any food videos yet.

                        </p>


                    </div>

                ) : (


                    /* =================================
                       VIDEO GRID
                    ================================= */

                    <div className="profile-video-grid">

                        {videos.map(
                            (video, index) => (

                                <button
                                    key={video._id}
                                    type="button"
                                    className="profile-video-item"
                                    onClick={() =>
                                        setSelectedVideoIndex(index)
                                    }
                                    aria-label={`Open ${
                                        video.name ||
                                        'food video'
                                    }`}
                                >

                                    <video
                                        src={video.video}
                                        muted
                                        playsInline
                                        loop
                                        preload="metadata"
                                        className="profile-video"
                                    />


                                    <div className="profile-video-overlay">

                                        <span className="profile-video-name">

                                            {video.name ||
                                                'Food'}

                                        </span>


                                        <span className="profile-video-likes">

                                            ♥
                                            {' '}

                                            {video.likeCount ??
                                                0}

                                        </span>

                                    </div>

                                </button>

                            )
                        )}

                    </div>

                )}


            </section>


            {/* =====================================
                REEL VIEWER
            ===================================== */}

            {selectedVideoIndex !== null && (

                <ReelViewer
                    videos={videos}
                    startIndex={selectedVideoIndex}
                    onClose={closeViewer}
                    onLike={handleLike}
                    onSave={handleSave}
                />

            )}


        </main>

    )

}


export default Profile