"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { getMediaByStatus } from "@/firebase/media"
import type { MediaItemType } from "@/types"
import MediaItem from "@/components/MediaItem"

export default function WishlistPage() {
    const { profile } = useAuth()
    const [wishList, setWishList] = useState<MediaItemType[]>([])

    useEffect(() => {
        if (!profile?.uid) return

        const loadWishlist = async () => {
            const items = await getMediaByStatus(profile.uid, "wishList")
            setWishList(items)
        }

        loadWishlist()
    }, [profile?.uid])

    return (
        <div className="flex flex-col gap-4 mt-10 p-4">
            <h1 className="text-xl font-bold">Wishlist</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {wishList.map(i => <MediaItem key={i.id} item={i} />)}
            </div>
        </div>
    )}