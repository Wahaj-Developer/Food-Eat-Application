import React, {useEffect,useMemo,useRef,useState} from 'react'
import DemoAlert from '../../components/DemoAlert'
import '../../styles/create-food.css'

import api from '../../utils/api'

import FoodViewLogo from '../../components/FoodViewLogo'
import ReelViewer from '../../components/ReelViewer'


const CreateFood = () => {

    // =========================================
    // PROFILE
    // =========================================

    const [profile, setProfile] =
        useState(null)

    const [profileError, setProfileError] =
        useState('')

    const [videos, setVideos] =
        useState([])

    const [selectedVideoIndex, setSelectedVideoIndex] =
        useState(null)


    // =========================================
    // DELETE
    // =========================================

    const [isDeleting, setIsDeleting] =
        useState(false)

    const [deleteError, setDeleteError] =
        useState('')

    const [pendingDelete, setPendingDelete] =
        useState(null)


    // =========================================
    // CREATE FOOD FORM
    // =========================================

    const [showCreateForm, setShowCreateForm] =
        useState(false)

    const [name, setName] =
        useState('')

    const [description, setDescription] =
        useState('')

    const [videoFile, setVideoFile] =
        useState(null)

    const [videoURL, setVideoURL] =
        useState('')

    const [fileError, setFileError] =
        useState('')

    const [formError, setFormError] =
        useState('')

    const [successMessage, setSuccessMessage] =
        useState('')

    const [isUploading, setIsUploading] =
        useState(false)

    const fileInputRef =
        useRef(null)


    // =========================================
    // GET MY PROFILE
    // =========================================

    const getProfile = async () => {

        try {

            const response =
                await api.get(
                    '/api/foodpartner/profile',
                    {
                        withCredentials: true
                    }
                )


            const foodPartner =
                response.data.foodPartner


            setProfile(foodPartner)

            setVideos(
                foodPartner?.foodItems || []
            )

            setProfileError('')

        } catch (error) {

            console.error(
                'Error fetching profile:',
                error
            )


            /*
             * Show the real reason on screen
             * instead of failing silently and
             * falling back to placeholder text.
             */

            setProfileError(
                error.response?.data?.message ||
                (error.response
                    ? `Failed to load profile (status ${error.response.status})`
                    : 'Unable to connect to the server.')
            )

        }

    }


    useEffect(() => {

        getProfile()

    }, [])


    // =========================================
    // TOTAL LIKES
    // =========================================

    const totalLikes =
        useMemo(() => {

            return videos.reduce(
                (total, video) => {

                    return total +
                        (video.likeCount ?? 0)

                },
                0
            )

        }, [videos])


    // =========================================
    // VIDEO PREVIEW URL
    // =========================================

    useEffect(() => {

        if (!videoFile) {

            setVideoURL('')

            return

        }


        const url =
            URL.createObjectURL(videoFile)


        setVideoURL(url)


        return () => {

            URL.revokeObjectURL(url)

        }

    }, [videoFile])


    // =========================================
    // FILE CHANGE
    // =========================================

    const onFileChange = (e) => {

        const file =
            e.target.files?.[0]


        if (!file) {

            setVideoFile(null)
            setFileError('')

            return

        }


        if (!file.type.startsWith('video/')) {

            setFileError(
                'Please select a valid video file.'
            )

            return

        }


        setFileError('')
        setFormError('')
        setSuccessMessage('')

        setVideoFile(file)

    }


    // =========================================
    // DRAG & DROP
    // =========================================

    const onDrop = (e) => {

        e.preventDefault()
        e.stopPropagation()


        const file =
            e.dataTransfer?.files?.[0]


        if (!file) return


        if (!file.type.startsWith('video/')) {

            setFileError(
                'Please drop a valid video file.'
            )

            return

        }


        setFileError('')
        setFormError('')
        setSuccessMessage('')

        setVideoFile(file)

    }


    const onDragOver = (e) => {

        e.preventDefault()

    }


    // =========================================
    // OPEN FILE DIALOG
    // =========================================

    const openFileDialog = () => {

        fileInputRef.current?.click()

    }


    // =========================================
    // REMOVE UPLOAD FILE
    // =========================================

    const removeVideo = () => {

        setVideoFile(null)

        setVideoURL('')

        setFileError('')


        if (fileInputRef.current) {

            fileInputRef.current.value = ''

        }

    }


    // =========================================
    // OPEN CREATE FORM
    // =========================================

    const openCreateForm = () => {

        setShowCreateForm(true)

        setFormError('')

        setSuccessMessage('')

    }


    // =========================================
    // CLOSE CREATE FORM
    // =========================================

    const closeCreateForm = () => {

        if (isUploading) return

        setShowCreateForm(false)

        setName('')
        setDescription('')
        setVideoFile(null)
        setVideoURL('')
        setFileError('')
        setFormError('')
        setSuccessMessage('')


        if (fileInputRef.current) {

            fileInputRef.current.value = ''

        }

    }


    // =========================================
    // CREATE FOOD
    // =========================================

    const onSubmit = async (e) => {

        e.preventDefault()


        if (!name.trim()) {

            setFormError(
                'Please enter a food name.'
            )

            return

        }


        if (!videoFile) {

            setFormError(
                'Please select a video.'
            )

            return

        }


        try {

            setIsUploading(true)

            setFormError('')
            setSuccessMessage('')


            const credentialsResponse =
                await api.get(
                    '/api/food/upload-credentials',
                    {
                        withCredentials: true
                    }
                )


            const {
                token,
                expire,
                signature,
                publicKey
            } = credentialsResponse.data.credentials


            const uploadData =
                new FormData()


            uploadData.append(
                'file',
                videoFile
            )

            uploadData.append(
                'fileName',
                videoFile.name
            )

            uploadData.append(
                'publicKey',
                publicKey
            )

            uploadData.append(
                'signature',
                signature
            )

            uploadData.append(
                'expire',
                expire
            )

            uploadData.append(
                'token',
                token
            )


            const imagekitResponse =
                await fetch(
                    'https://upload.imagekit.io/api/v1/files/upload',
                    {
                        method: 'POST',
                        body: uploadData
                    }
                )


            const imagekitResult =
                await imagekitResponse.json()


            if (!imagekitResponse.ok) {

                throw new Error(
                    imagekitResult.message ||
                    'Video upload failed'
                )

            }


            await api.post(
                '/api/food',
                {
                    name: name.trim(),
                    description: description.trim(),
                    videoUrl: imagekitResult.url,
                    fileId: imagekitResult.fileId
                },
                {
                    withCredentials: true
                }
            )


            setSuccessMessage(
                'Food video uploaded successfully.'
            )


            await getProfile()


            setName('')
            setDescription('')
            setVideoFile(null)
            setVideoURL('')


            if (fileInputRef.current) {

                fileInputRef.current.value = ''

            }


            setTimeout(() => {

                setShowCreateForm(false)

                setSuccessMessage('')

            }, 2500)


        } catch (error) {

            console.error(
                'Create food error:',
                error
            )


            setFormError(
                error.response?.data?.message ||
                'Failed to upload food video.'
            )

        } finally {

            setIsUploading(false)

        }

    }


    // =========================================
    // REQUEST DELETE
    // =========================================
    //
    // Opens the themed confirm modal instead of
    // the browser's plain window.confirm() popup.

    const requestDelete = (food) => {

        if (!food?._id) {

            return

        }

        setDeleteError('')

        setPendingDelete(food)

    }


    // =========================================
    // CANCEL DELETE
    // =========================================

    const cancelDelete = () => {

        if (isDeleting) return

        setPendingDelete(null)

    }


    // =========================================
    // CONFIRM DELETE
    // =========================================

    const confirmDelete = async () => {

        const food = pendingDelete

        if (!food?._id) {

            return

        }


        try {

            setIsDeleting(true)
            setDeleteError('')


            await api.delete(
                `/api/food/${food._id}`,
                {
                    withCredentials: true
                }
            )


            /*
             * Remove deleted video from
             * local state immediately.
             */

            setVideos((previousVideos) =>
                previousVideos.filter(
                    (video) =>
                        video._id !== food._id
                )
            )


            /*
             * Close the ReelViewer and
             * the confirm modal.
             */

            setSelectedVideoIndex(null)

            setPendingDelete(null)


            /*
             * Refresh profile so
             * posts and likes are updated.
             */

            await getProfile()


        } catch (error) {

            console.error(
                'Delete food error:',
                error
            )


            setDeleteError(
                error.response?.data?.message ||
                'Failed to delete food video.'
            )

        } finally {

            setIsDeleting(false)

        }

    }


    // =========================================
    // CLOSE REEL VIEWER
    // =========================================

    const closeViewer = () => {

        if (isDeleting) return

        setSelectedVideoIndex(null)

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <main className="create-food-page">
        <DemoAlert />
{/* =====================================
    SUCCESS TOAST
===================================== */}

{successMessage && (

    <div
        className="upload-success-toast"
        role="status"
        aria-live="polite"
    >

        <span className="upload-success-icon">
            ✓
        </span>

        <span className="upload-success-message">
            {successMessage}
        </span>

    </div>

)}
            {/* =====================================
                NAVBAR
            ===================================== */}

            <nav className="create-food-navbar">

                <div className="create-food-brand">

                    <FoodViewLogo />

                </div>


                <button
                    type="button"
                    className="create-food-nav-button"
                    onClick={openCreateForm}
                    aria-label="Create food video"
                >

                    <span className="create-food-nav-plus">
                        +
                    </span>

                    <span className="create-food-nav-text">
                        Create
                    </span>

                </button>

            </nav>


            {/* =====================================
                PROFILE LOAD ERROR
            ===================================== */}

            {profileError && (

                <div
                    className="form-error"
                    role="alert"
                >

                    {profileError}

                </div>

            )}


            {/* =====================================
                PROFILE HEADER
            ===================================== */}

            <section className="create-profile-card">

                <div className="create-profile-info">

                    <h1 className="create-profile-business">

                        {profile?.name ||
                            'Business Name'}

                    </h1>


                    <p className="create-profile-address">

                        <span className="location-pin">
                            📍
                        </span>

                        {profile?.address ||
                            'Address not available'}

                    </p>


                    <div className="create-profile-contact">

                        <div className="create-contact-item">

                            <span className="create-contact-label">
                                Contact Person
                            </span>

                            <span className="create-contact-value">

                                {profile?.contactName ||
                                    'Not available'}

                            </span>

                        </div>


                        <div className="create-contact-item">

                            <span className="create-contact-label">
                                Phone
                            </span>

                            <span className="create-contact-value">

                                {profile?.phone ||
                                    'Not available'}

                            </span>

                        </div>

                    </div>

                </div>


                <div className="create-profile-brand">

                    <FoodViewLogo />

                    <p className="create-profile-brand-text">

                        Share your food.
                        <br />
                        Get discovered.

                    </p>

                </div>

            </section>


            {/* =====================================
                STATS
            ===================================== */}

            <section className="partner-stats">

                <div className="partner-stat">

                    <span className="partner-stat-label">
                        POSTS
                    </span>

                    <strong className="partner-stat-value">

                        {videos.length}

                    </strong>

                </div>


                <div className="partner-stat">

                    <span className="partner-stat-label">
                        LIKES
                    </span>

                    <strong className="partner-stat-value">

                        {totalLikes}

                    </strong>

                </div>

            </section>


            {/* =====================================
                DELETE ERROR
            ===================================== */}

            {deleteError && (

                <div
                    className="form-error"
                    role="alert"
                >

                    {deleteError}

                </div>

            )}


            {/* =====================================
                VIDEO SECTION
            ===================================== */}

            <section className="partner-video-section">

                <div className="partner-video-heading">

                    <div>

                        <span className="section-kicker">
                            YOUR CONTENT
                        </span>

                        <h2>
                            Food Videos
                        </h2>

                    </div>


                    <span className="post-count">

                        {videos.length}
                        {' '}
                        {videos.length === 1
                            ? 'post'
                            : 'posts'}

                    </span>

                </div>


                {videos.length === 0 ? (

                    <div className="partner-empty-state">

                        <div className="empty-icon">
                            +
                        </div>


                        <h3>
                            Start sharing your food
                        </h3>


                        <p>
                            Upload your first food video
                            and let people discover it.
                        </p>


                        <button
                            type="button"
                            className="empty-create-button"
                            onClick={openCreateForm}
                        >

                            Create your first video

                        </button>

                    </div>

                ) : (

                    <div className="partner-video-grid">

                        {videos.map(
                            (video, index) => (

                                <button
                                    key={video._id}
                                    type="button"
                                    className="partner-video-item"
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
                                        preload="metadata"
                                        className="partner-video"
                                    />


                                    <div className="video-overlay">

                                        <span className="video-name">

                                            {video.name ||
                                                'Food'}

                                        </span>


                                        <span className="video-likes">

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
                CREATE FOOD MODAL
            ===================================== */}

            {showCreateForm && (

                <div
                    className="create-food-modal-backdrop"
                    onMouseDown={(e) => {

                        if (
                            e.target ===
                            e.currentTarget
                        ) {

                            closeCreateForm()

                        }

                    }}
                >

                    <section
                        className="create-food-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="create-food-title"
                    >

                        <div className="create-food-modal-header">

                            <div>

                                <span className="section-kicker">
                                    NEW POST
                                </span>

                                <h2 id="create-food-title">
                                    Create Food
                                </h2>

                                <p>
                                    Share a short food video
                                    with your audience.
                                </p>

                            </div>


                            <button
                                type="button"
                                className="modal-close-button"
                                onClick={closeCreateForm}
                                disabled={isUploading}
                                aria-label="Close"
                            >

                                ×

                            </button>

                        </div>


                        <form
                            className="create-food-form"
                            onSubmit={onSubmit}
                        >

                            <div className="field-group">

                                <label htmlFor="foodVideo">
                                    Food Video
                                </label>


                                <input
                                    id="foodVideo"
                                    ref={fileInputRef}
                                    className="file-input-hidden"
                                    type="file"
                                    accept="video/*"
                                    onChange={onFileChange}
                                />


                                <div
                                    className="file-dropzone"
                                    role="button"
                                    tabIndex={0}
                                    onClick={openFileDialog}
                                    onKeyDown={(e) => {

                                        if (
                                            e.key === 'Enter' ||
                                            e.key === ' '
                                        ) {

                                            e.preventDefault()

                                            openFileDialog()

                                        }

                                    }}
                                    onDrop={onDrop}
                                    onDragOver={onDragOver}
                                >

                                    <div className="file-dropzone-inner">

                                        <div className="upload-icon">
                                            ↑
                                        </div>

                                        <strong>
                                            Choose a video
                                        </strong>

                                        <span>
                                            or drag and drop here
                                        </span>

                                        <small>
                                            MP4, WebM, MOV · Up to ~100MB
                                        </small>

                                    </div>

                                </div>


                                {fileError && (

                                    <p
                                        className="error-text"
                                        role="alert"
                                    >
                                        {fileError}
                                    </p>

                                )}


                                {videoFile && (

                                    <div className="file-chip">

                                        <span className="file-chip-name">

                                            {videoFile.name}

                                        </span>


                                        <span className="file-chip-size">

                                            {(
                                                videoFile.size /
                                                1024 /
                                                1024
                                            ).toFixed(1)}
                                            {' '}MB

                                        </span>


                                        <button
                                            type="button"
                                            className="file-remove"
                                            onClick={removeVideo}
                                        >
                                            Remove
                                        </button>

                                    </div>

                                )}

                            </div>


                            {videoURL && (

                                <div className="video-upload-preview">

                                    <video
                                        src={videoURL}
                                        controls
                                        playsInline
                                        preload="metadata"
                                    />

                                </div>

                            )}


                            <div className="field-group">

                                <label htmlFor="foodName">
                                    Food Name
                                </label>


                                <input
                                    id="foodName"
                                    type="text"
                                    placeholder="e.g. Spicy Chicken Burger"
                                    value={name}
                                    onChange={(e) => {

                                        setName(e.target.value)
                                        setFormError('')

                                    }}
                                    required
                                />

                            </div>


                            <div className="field-group">

                                <label htmlFor="foodDescription">
                                    Description
                                </label>


                                <textarea
                                    id="foodDescription"
                                    rows={4}
                                    placeholder="Tell people about this food..."
                                    value={description}
                                    onChange={(e) => {

                                        setDescription(
                                            e.target.value
                                        )

                                        setFormError('')

                                    }}
                                />

                            </div>


                            {formError && (

                                <p
                                    className="form-error"
                                    role="alert"
                                >

                                    {formError}

                                </p>

                            )}




                            <div className="modal-actions">

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={closeCreateForm}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="publish-button"
                                    disabled={
                                        isUploading ||
                                        !name.trim() ||
                                        !videoFile
                                    }
                                >

                                    {isUploading
                                        ? 'Publishing...'
                                        : 'Publish Food'}

                                </button>

                            </div>

                        </form>

                    </section>

                </div>

            )}


            {/* =====================================
                REEL VIEWER
            ===================================== */}

            {selectedVideoIndex !== null && (

                <ReelViewer
                    videos={videos}
                    startIndex={selectedVideoIndex}
                    onClose={closeViewer}
                    onDelete={requestDelete}
                    isDeleting={isDeleting}
                />

            )}


            {/* =====================================
                THEMED DELETE CONFIRM MODAL
            ===================================== */}

            {pendingDelete && (

                <div
                    className="confirm-modal-backdrop"
                    onMouseDown={(e) => {

                        if (
                            e.target === e.currentTarget &&
                            !isDeleting
                        ) {

                            cancelDelete()

                        }

                    }}
                >

                    <section
                        className="confirm-modal"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="confirm-delete-title"
                    >

                        <div className="confirm-modal-icon">
                            🗑
                        </div>


                        <h2 id="confirm-delete-title">
                            Delete "
                            {pendingDelete.name ||
                                'this food video'}
                            "?
                        </h2>


                        <p>
                            This action cannot be undone.
                            The video will be permanently
                            removed.
                        </p>


                        <div className="confirm-modal-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={cancelDelete}
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                className="confirm-delete-button"
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >

                                {isDeleting
                                    ? 'Deleting...'
                                    : 'Delete'}

                            </button>

                        </div>

                    </section>

                </div>

            )}

        </main>

    )

}


export default CreateFood
