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
        <div>
            <h1>In progress media</h1>
            <div>
                {inProgressList.map(i => (<MediaItem key={i.id} item={i} />))}
            </div>
        </div>
    )
}