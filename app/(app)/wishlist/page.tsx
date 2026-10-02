"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { getMediaByStatus } from "@/firebase/media"
import type { MediaItemType } from "@/types"

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

            {wishList.map(item => (
                <div key={item.id}>
                    {item.name}
                </div>
            ))}
        </div>
    )
}