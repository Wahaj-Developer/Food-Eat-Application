import React, {useEffect,useLayoutEffect,useRef,useState} from 'react'
import { Link } from 'react-router-dom'
import FoodViewLogo from './FoodViewLogo'

const ReelFeed = ({
    items = [],
    onLike,
    onSave,
    emptyMessage = 'No videos yet.'
}) => {

    const videoRefs = useRef(new Map())

    const feedRef =
        useRef(null)

    const scrollEndTimer =
        useRef(null)


    // =========================================
    // MUTE / UNMUTE
    // =========================================
    //
    // Videos start muted so autoplay is allowed
    // by the browser. The user can tap the sound
    // button to turn audio on for every video.

    const [isMuted, setIsMuted] =
        useState(true)


    const toggleMute = () => {

        setIsMuted((previous) => !previous)

    }


    // =========================================
    // LOOPING SETUP
    // =========================================
    //
    // To make the feed feel endless (like
    // Instagram/TikTok Reels) we place a clone
    // of the LAST item before the first, and a
    // clone of the FIRST item after the last.
    //
    // Real order:     [A, B, C]
    // Rendered order:  [C*, A, B, C, A*]
    //                   ^clone         ^clone
    //
    // We start scrolled to the real "A" (index 1).
    // When scrolling lands on a clone, we instantly
    // snap to the matching real item with no
    // animation - since the clone looks identical,
    // the jump is invisible.

    const canLoop =
        items.length > 1

    const loopItems =
        canLoop
            ? [
                {
                    ...items[items.length - 1],
                    _loopKey: 'clone-start'
                },
                ...items.map((item) => ({
                    ...item,
                    _loopKey: item._id
                })),
                {
                    ...items[0],
                    _loopKey: 'clone-end'
                }
            ]
            : items.map((item) => ({
                ...item,
                _loopKey: item._id
            }))


    // =========================================
    // START ON THE REAL FIRST ITEM
    // =========================================

    useLayoutEffect(() => {

        if (!canLoop) return

        const container =
            feedRef.current

        if (!container) return


        const itemHeight =
            container.clientHeight


        container.scrollTop =
            itemHeight

    }, [items.length, canLoop])


    // =========================================
    // WRAP AROUND ON SCROLL END
    // =========================================

    const handleFeedScroll = () => {

        if (!canLoop) return

        const container =
            feedRef.current

        if (!container) return


        if (scrollEndTimer.current) {

            clearTimeout(
                scrollEndTimer.current
            )

        }


        /*
         * Wait until scrolling has settled
         * (snap has finished) before checking
         * whether we landed on a clone.
         */

        scrollEndTimer.current = setTimeout(() => {

            const itemHeight =
                container.clientHeight

            const index =
                Math.round(
                    container.scrollTop /
                    itemHeight
                )


            if (index === 0) {

                // Landed on the start clone (of the last item)
                // -> silently snap to the real last item.

                container.scrollTop =
                    items.length * itemHeight

            } else if (
                index ===
                loopItems.length - 1
            ) {

                // Landed on the end clone (of the first item)
                // -> silently snap to the real first item.

                container.scrollTop =
                    itemHeight

            }

        }, 120)

    }


    // =========================================
    // AUTOPLAY / PAUSE VIDEOS
    // =========================================

    useEffect(() => {

        const observer = new IntersectionObserver(
            (entries) => {

                entries.forEach((entry) => {

                    const video = entry.target

                    if (!(video instanceof HTMLVideoElement)) {
                        return
                    }

                    if (
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.6
                    ) {

                        video
                            .play()
                            .catch(() => {
                                // Ignore autoplay errors
                            })

                    } else {

                        video.pause()

                    }

                })

            },
            {
                threshold: [
                    0,
                    0.25,
                    0.6,
                    0.9,
                    1
                ]
            }
        )

        videoRefs.current.forEach((video) => {
            observer.observe(video)
        })

        return () => {
            observer.disconnect()
        }

    }, [loopItems.length])


    // =========================================
    // VIDEO REF
    // =========================================
    //
    // Keyed by position (not item._id), since
    // clones share the same _id as their
    // original and both need independent refs.

    const setVideoRef = (position) => (element) => {

        if (!element) {
            videoRefs.current.delete(position)
            return
        }

        element.muted = isMuted

        videoRefs.current.set(position, element)
    }


    // =========================================
    // APPLY MUTE STATE TO ALL VIDEOS
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

    const handleLike = async (item) => {

        if (!onLike) {
            return
        }

        await onLike(item)
    }


    // =========================================
    // SAVE
    // =========================================

    const handleSave = async (item) => {

        if (!onSave) {
            return
        }

        await onSave(item)
    }


    // =========================================
    // RENDER
    // =========================================

    return (

        <div className="reels-page">

            {/* =====================================
                BRAND OVERLAY
            ===================================== */}

            <div className="reels-top-bar">

                <div
                    className="reels-top-bar-gradient"
                    aria-hidden="true"
                />

                <div className="reels-top-bar-content reels-logo-wrap">

                    <FoodViewLogo />

                </div>

            </div>


            <div
                ref={feedRef}
                className="reels-feed"
                role="list"
                onScroll={handleFeedScroll}
            >

                {/* EMPTY STATE */}

                {items.length === 0 && (

                    <div className="empty-state">

                        <p>
                            {emptyMessage}
                        </p>

                    </div>

                )}


                {/* REELS */}

                {loopItems.map((item, position) => (

                    <section
                        key={`reel-${position}-${item._loopKey}`}
                        className="reel"
                        role="listitem"
                    >

                        {/* VIDEO */}

                        <video
                            ref={setVideoRef(position)}
                            className="reel-video"
                            src={item.video}
                            playsInline
                            loop
                            preload="metadata"
                        />


                        {/* OVERLAY */}

                        <div className="reel-overlay">

                            <div
                                className="reel-overlay-gradient"
                                aria-hidden="true"
                            />


                            {/* RIGHT ACTIONS */}

                            <div className="reel-actions">


                                {/* SOUND */}

                                <div className="reel-action-group">

                                    <button
                                        type="button"
                                        onClick={toggleMute}
                                        className="reel-action"
                                        aria-label={
                                            isMuted
                                                ? 'Unmute'
                                                : 'Mute'
                                        }
                                    >

                                        {isMuted ? (

                                            <svg
                                                width="22"
                                                height="22"
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
                                                width="22"
                                                height="22"
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

                                <div className="reel-action-group">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleLike(item)
                                        }
                                        className={`reel-action ${
                                            item.isLiked
                                                ? 'liked'
                                                : ''
                                        }`}
                                        aria-label={
                                            item.isLiked
                                                ? 'Unlike'
                                                : 'Like'
                                        }
                                    >

                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill={
                                                item.isLiked
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


                                    <div className="reel-action__count">

                                        {item.likeCount ?? 0}

                                    </div>

                                </div>


                                {/* SAVE */}

                                <div className="reel-action-group">

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleSave(item)
                                        }
                                        className={`reel-action ${
                                            item.isSaved
                                                ? 'saved'
                                                : ''
                                        }`}
                                        aria-label={
                                            item.isSaved
                                                ? 'Unsave'
                                                : 'Save'
                                        }
                                    >

                                        <svg
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            fill={
                                                item.isSaved
                                                    ? 'currentColor'
                                                    : 'none'
                                            }
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >

                                            <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />

                                        </svg>

                                    </button>


                                    <div className="reel-action__count">

                                        {item.savesCount ?? 0}

                                    </div>

                                </div>

                            </div>
                            {/* END reel-actions */}


                            {/* BOTTOM CONTENT */}

                            <div className="reel-content">

                                <h3>
                                    {item.name}
                                </h3>


                                <p
                                    className="reel-description"
                                    title={item.description}
                                >
                                    {item.description}
                                </p>


                                {item.foodPartner && (

                                    <Link
                                        to={`/foodpartner/${item.foodPartner}`}
                                        className="reel-btn"
                                    >
                                        <svg
                                            width="15"
                                            height="15"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            aria-hidden="true"
                                        >
                                            <path d="M3 9l1.5-5h15L21 9" />
                                            <path d="M3 9a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0" />
                                            <path d="M5 9v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9" />
                                            <path d="M9 20v-6h6v6" />
                                        </svg>
                                        View Store
                                    </Link>

                                )}

                            </div>

                        </div>
                        {/* END reel-overlay */}

                    </section>

                ))}

            </div>

        </div>

    )
}

export default ReelFeed
