import React, {useEffect,useRef,useState} from 'react'

import '../styles/reel-viewer.css'


const ReelViewer = ({
    videos = [],
    startIndex = 0,
    onClose,
    onLike,
    onSave,
    onDelete,
    isDeleting = false
}) => {

    const [currentIndex, setCurrentIndex] =
        useState(startIndex)

    const videoRefs =
        useRef(new Map())


    // =========================================
    // MUTE / UNMUTE
    // =========================================
    //
    // Starts muted so autoplay is allowed by the
    // browser. The user can tap the sound button
    // to turn audio on.

    const [isMuted, setIsMuted] =
        useState(true)


    const toggleMute = () => {

        setIsMuted((previous) => !previous)

    }


    // =========================================
    // CURRENT VIDEO
    // =========================================

    const currentVideo =
        videos[currentIndex]


    // =========================================
    // CLOSE ON ESCAPE
    // =========================================

    useEffect(() => {

        const handleKeyDown = (event) => {

            if (event.key === 'Escape') {

                if (!isDeleting) {

                    onClose()

                }

            }


            if (event.key === 'ArrowDown') {

                goToNext()

            }


            if (event.key === 'ArrowUp') {

                goToPrevious()

            }

        }


        document.addEventListener(
            'keydown',
            handleKeyDown
        )


        return () => {

            document.removeEventListener(
                'keydown',
                handleKeyDown
            )

        }

    }, [
        currentIndex,
        videos.length,
        isDeleting
    ])


    // =========================================
    // PREVIOUS VIDEO
    // =========================================

    const goToPrevious = () => {

        setCurrentIndex((previous) => {

            if (previous <= 0) {

                return 0

            }

            return previous - 1

        })

    }


    // =========================================
    // NEXT VIDEO
    // =========================================

    const goToNext = () => {

        setCurrentIndex((previous) => {

            if (
                previous >=
                videos.length - 1
            ) {

                return previous

            }

            return previous + 1

        })

    }


    // =========================================
    // PLAY CURRENT VIDEO
    // =========================================

    useEffect(() => {

        videoRefs.current.forEach(
            (video, index) => {

                if (
                    index === currentIndex
                ) {

                    video
                        ?.play()
                        .catch(() => {
                            // Ignore autoplay errors
                        })

                } else {

                    video?.pause()

                }

            }
        )

    }, [currentIndex])


    // =========================================
    // VIDEO REF
    // =========================================

    const setVideoRef =
        (index) =>
        (element) => {

            if (!element) {

                videoRefs.current.delete(
                    index
                )

                return

            }


            element.muted = isMuted


            videoRefs.current.set(
                index,
                element
            )

        }


    // =========================================
    // APPLY MUTE STATE TO CURRENT VIDEO
    // =========================================
    //
    // The muted property must be set imperatively
    // on the DOM element - React's `muted` attribute
    // only controls the initial value, not later
    // updates.

    useEffect(() => {

        videoRefs.current.forEach((video) => {

            video.muted = isMuted

        })

    }, [isMuted])


    // =========================================
    // LIKE
    // =========================================

    const handleLike = async () => {

        if (
            !currentVideo ||
            !onLike
        ) {

            return

        }


        await onLike(currentVideo)

    }


    // =========================================
    // SAVE
    // =========================================

    const handleSave = async () => {

        if (
            !currentVideo ||
            !onSave
        ) {

            return

        }


        await onSave(currentVideo)

    }


    // =========================================
    // DELETE
    // =========================================

    const handleDelete = async () => {

        if (
            !currentVideo ||
            !onDelete ||
            isDeleting
        ) {

            return

        }


        await onDelete(
            currentVideo
        )

    }


    // =========================================
    // EMPTY
    // =========================================

    if (!currentVideo) {

        return null

    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div
            className="reel-viewer"
            role="dialog"
            aria-modal="true"
        >


            {/* =================================
                BACKDROP
            ================================= */}

            <div
                className="reel-viewer-backdrop"
                onClick={() => {

                    if (!isDeleting) {

                        onClose()

                    }

                }}
            />


            {/* =================================
                CLOSE BUTTON
            ================================= */}

            <button
                type="button"
                className="reel-viewer-close"
                onClick={onClose}
                disabled={isDeleting}
                aria-label="Close video"
            >

                ✕

            </button>


            {/* =================================
                PREVIOUS BUTTON
            ================================= */}

            {currentIndex > 0 && (

                <button
                    type="button"
                    className="reel-viewer-navigation reel-viewer-prev"
                    onClick={goToPrevious}
                    disabled={isDeleting}
                    aria-label="Previous video"
                >

                    ↑

                </button>

            )}


            {/* =================================
                NEXT BUTTON
            ================================= */}

            {currentIndex <
                videos.length - 1 && (

                <button
                    type="button"
                    className="reel-viewer-navigation reel-viewer-next"
                    onClick={goToNext}
                    disabled={isDeleting}
                    aria-label="Next video"
                >

                    ↓

                </button>

            )}


            {/* =================================
                VIDEO
            ================================= */}

            <div className="reel-viewer-content">

                <video
                    ref={setVideoRef(
                        currentIndex
                    )}
                    className="reel-viewer-video"
                    src={currentVideo.video}
                    playsInline
                    loop
                    controls
                    autoPlay
                />


                <div className="reel-viewer-gradient" />


                {/* =================================
                    RIGHT ACTIONS
                ================================= */}

                <div className="reel-viewer-actions">


                    {/* SOUND */}

                    <div className="reel-viewer-action-group">

                        <button
                            type="button"
                            className="reel-viewer-action"
                            onClick={toggleMute}
                            aria-label={
                                isMuted
                                    ? 'Unmute'
                                    : 'Mute'
                            }
                        >

                            {isMuted ? (

                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >

                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <line x1="23" y1="9" x2="17" y2="15" />
                                    <line x1="17" y1="9" x2="23" y2="15" />

                                </svg>

                            ) : (

                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >

                                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                                    <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                                    <path d="M18.5 5.5a9 9 0 0 1 0 13" />

                                </svg>

                            )}

                        </button>

                    </div>


                    {/* LIKE */}

                    <div className="reel-viewer-action-group">

                        <button
                            type="button"
                            className={`reel-viewer-action ${
                                currentVideo.isLiked
                                    ? 'liked'
                                    : ''
                            }`}
                            onClick={handleLike}
                            disabled={isDeleting}
                            aria-label="Like"
                        >

                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={
                                    currentVideo.isLiked
                                        ? 'currentColor'
                                        : 'none'
                                }
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >

                                <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />

                            </svg>

                        </button>


                        <span>

                            {currentVideo.likeCount ?? 0}

                        </span>

                    </div>


                    {/* SAVE */}

                    <div className="reel-viewer-action-group">

                        <button
                            type="button"
                            className={`reel-viewer-action ${
                                currentVideo.isSaved
                                    ? 'saved'
                                    : ''
                            }`}
                            onClick={handleSave}
                            disabled={isDeleting}
                            aria-label="Save"
                        >

                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill={
                                    currentVideo.isSaved
                                        ? 'currentColor'
                                        : 'none'
                                }
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >

                               <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 0 1-1z" />

                            </svg>

                        </button>


                        <span>

                            {currentVideo.savesCount ?? 0}

                        </span>

                    </div>


                    {/* DELETE */}

                    {onDelete && (

                        <div className="reel-viewer-action-group">

                            <button
                                type="button"
                                className="reel-viewer-action reel-viewer-delete"
                                onClick={handleDelete}
                                disabled={isDeleting}
                                aria-label="Delete food video"
                                title="Delete food video"
                            >

                                {isDeleting
                                    ? '...'
                                    : '🗑'}

                            </button>


                            <span>

                                {isDeleting
                                    ? 'Deleting'
                                    : 'Delete'}

                            </span>

                        </div>

                    )}

                </div>


                {/* =================================
                    VIDEO INFORMATION
                ================================= */}

                <div className="reel-viewer-info">

                    <h2>
                        {currentVideo.name}
                    </h2>


                    <p>
                        {currentVideo.description}
                    </p>


                    <span className="reel-viewer-counter">

                        {currentIndex + 1}
                        {' / '}
                        {videos.length}

                    </span>

                </div>

            </div>

        </div>

    )

}


export default ReelViewer
