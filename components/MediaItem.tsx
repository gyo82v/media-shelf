"use client"

import type {MediaItemType} from "@/types"
import Link from "next/link"

export default function MediaItem({ item }: { item: MediaItemType }) {
    return (
        <article>
            <Link href={`/media/${item.id}`} className="flex gap-4 p-4">
                <div>
                    <p>image goes here</p>
                </div>
                <div>
                    <h3>{item.name}</h3>
                    <p>{item.type}</p>
                    <p>{item.status}</p>
                    <p>{item.genre}</p>
                    <p>Added: {item.createdAt.toDate().toDateString()}</p>
                </div>
            </Link>  
        </article>
    )
}