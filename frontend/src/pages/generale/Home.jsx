import React, { useEffect, useState } from 'react'
import api from '../../utils/api'

import '../../styles/reels.css'

import ReelFeed from '../../components/ReelFeed'
import Loading from '../../components/Loading'
import DemoNotice from '../../components/DemoNotice'


const Home = () => {

    const [videos, setVideos] = useState([])

    const [loading, setLoading] = useState(true)


    // =========================================
    // GET FOOD VIDEOS
    // =========================================

    useEffect(() => {

        setLoading(true)

        api
            .get(
                '/api/food/',
                {
                    withCredentials: true
                }
            )
            .then((response) => {

                console.log(
                    'API Response:',
                    response.data
                )

                setVideos(
                    response.data.food || []
                )

            })
            .catch((error) => {

                console.error(
                    'Error fetching food videos:',
                    error
                )

            })
            .finally(() => {

                setLoading(false)

            })

    }, [])


    // =========================================
    // LIKE / UNLIKE
    // =========================================

    async function likeVideo(item) {

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

            console.log(
                'Like response:',
                response.data
            )


            setVideos((prevVideos) => {

                return prevVideos.map((video) => {

                    if (video._id !== item._id) {

                        return video

                    }


                    const isLiked =
                        response.data.liked


                    return {

                        ...video,

                        isLiked: isLiked,

                        likeCount:
                            isLiked
                                ? (video.likeCount || 0) + 1
                                : Math.max(
                                    (video.likeCount || 0) - 1,
                                    0
                                )

                    }

                })

            })

        } catch (error) {

            console.error(
                'Like/unlike error:',
                error
            )

        }

    }


    // =========================================
    // SAVE / UNSAVE
    // =========================================

    async function saveVideo(item) {

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

            console.log(
                'Save response:',
                response.data
            )


            setVideos((prevVideos) => {

                return prevVideos.map((video) => {

                    if (video._id !== item._id) {

                        return video

                    }


                    const isSaved =
                        response.data.saved


                    return {

                        ...video,

                        isSaved: isSaved,

                        savesCount:
                            isSaved
                                ? (video.savesCount || 0) + 1
                                : Math.max(
                                    (video.savesCount || 0) - 1,
                                    0
                                )

                    }

                })

            })

        } catch (error) {

            console.error(
                'Save/unsave error:',
                error
            )

        }

    }


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (
            <Loading
                message="Loading food..."
            />
        )

    }


    // =========================================
    // RENDER
    // =========================================

  return (

    <>

        <DemoNotice />

        <ReelFeed
            items={videos}
            onLike={likeVideo}
            onSave={saveVideo}
            emptyMessage="No videos available."
        />

    </>

)

}


export default Home