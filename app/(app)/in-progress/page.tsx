"use client"

import {useAuth} from "@/providers/AuthProvider"
import {getMediaByStatus} from "@/firebase/media"
import {useEffect, useState} from "react"
import type {MediaItemType} from "@/types"
import MediaItem from "@/components/MediaItem"


export default function InProgressPage(){
    const {profile} = useAuth()
    const [inProgressList, setInProgressList] = useState<MediaItemType[]>([])

    console.log("list: ", inProgressList)

    useEffect(() => {
        if(!profile?.uid) return

        const loadProgressList = async () => {
            const items = await getMediaByStatus(profile.uid, "inProgress")
            setInProgressList(items)
        }

        loadProgressList()
    }, [profile?.uid])


    return(
        <div className="flex flex-col gap-4 mt-10 p-4">
            <h1 className="text-xl font-bold">In progress media</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {inProgressList.map(i => (<MediaItem key={i.id} item={i} />))}
            </div>
        </div>
    )
}