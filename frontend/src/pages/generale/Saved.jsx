import React, { useEffect, useState } from 'react'

import '../../styles/reels.css'
import '../../styles/saved.css'

import api from '../../utils/api'

import ReelFeed from '../../components/ReelFeed'
import Loading from '../../components/Loading'
import EmptySaved from '../../components/EmptySaved'


const Saved = () => {

    const [videos, setVideos] = useState([])

    const [loading, setLoading] = useState(true)


    // =========================================
    // GET SAVED VIDEOS
    // =========================================

    useEffect(() => {

        setLoading(true)

        api
            .get(
                '/api/food/save',
                {
                    withCredentials: true
                }
            )
            .then((response) => {

                console.log(
                    'Saved videos:',
                    response.data
                )

                const savedFoods =
                    response.data.savedFoods || []


                const foods = savedFoods
                    .filter((item) => item.food)
                    .map((item) => ({

                        _id: item.food._id,

                        name: item.food.name,

                        video: item.food.video,

                        description:
                            item.food.description,

                        likeCount:
                            item.food.likeCount ?? 0,

                        savesCount:
                            item.food.savesCount ?? 0,

                        commentsCount:
                            item.food.commentsCount ?? 0,

                        foodPartner:
                            item.food.foodPartner,

                        isSaved: true,

                        isLiked: false

                    }))


                setVideos(foods)

            })
            .catch((error) => {

                console.error(
                    'Error fetching saved videos:',
                    error
                )

            })
            .finally(() => {

                setLoading(false)

            })

    }, [])


    // =========================================
    // REMOVE SAVED VIDEO
    // =========================================

    const removeSaved = async (item) => {

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
                'Unsave response:',
                response.data
            )


            setVideos((prevVideos) =>
                prevVideos.filter(
                    (video) =>
                        video._id !== item._id
                )
            )

        } catch (error) {

            console.error(
                'Error removing saved video:',
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
                message="Loading saved videos..."
            />
        )

    }


    // =========================================
    // EMPTY STATE
    // =========================================

    if (videos.length === 0) {

        return (
            <EmptySaved />
        )

    }


    // =========================================
    // RENDER SAVED VIDEOS
    // =========================================

    return (

        <ReelFeed
            items={videos}
            onSave={removeSaved}
            emptyMessage="No saved videos yet."
        />

    )

}


export default Saved