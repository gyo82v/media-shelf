"use client"

import { getMediaByStatus } from "@/firebase/media"
import { useAuth } from "@/providers/AuthProvider"
import { useEffect, useState } from "react"
import MediaItem from "./MediaItem"
import MediaReviewedItem from "./MediaReviewedItem"
import type { MediaItemType } from "@/types"

type Props = {
    title: string,
    description: string,
    status: MediaItemType["status"]
}

export default function MediaListPage({title, description, status}:Props){
    const {profile} = useAuth()
    const [mediaList, setMediaList] = useState<MediaItemType[]>([])

    useEffect(() => {
        if(!profile?.uid) return

        const loadMedia = async () => {
            const items = await getMediaByStatus(profile?.uid, status)
            setMediaList(items)
        }
        loadMedia()
    }, [profile?.uid, status])

    return(
        <div className="flex flex-col mt-10 p-4 ">
            <div className="mb-10">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-lg font-semibold">{description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {status === "completed" ? (
                    mediaList.map(i => <MediaReviewedItem key={i.id} item={i} />)
                ) : (
                    mediaList.map(i => <MediaItem key={i.id} item={i} />)
                )}
            </div>
        </div>
    )
}