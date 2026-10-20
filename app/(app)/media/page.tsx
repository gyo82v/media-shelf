"use client"

import {useState, useEffect} from "react"
import { useAuth } from "@/providers/AuthProvider"
import { getMediaByStatus } from "@/firebase/media"
import MediaItem from "@/components/MediaItem"
import type { MediaItemType } from "@/types"


export default function MediaPage() {
    const {profile} = useAuth()
    const [mediaList, setMediaList] = useState<MediaItemType[]>([])

    useEffect(() => {
        if(!profile?.uid) return
        const loadMediaList = async () => {
            const items = await getMediaByStatus(profile.uid, "completed")
            setMediaList(items)
        }
        loadMediaList()
    }, [profile?.uid])

    return(
        <div className="flex flex-col gap-4 mt-10 p-4">
            <h1 className="text-xl font-bold">Media</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {mediaList.map(i => <MediaItem key={i.id} item={i} />)}
                </div>
        </div>
    )
   
}