please help me with this component:

"use client"

import type {MediaItemType} from "@/types"
import Image from "next/image"
import Link from "next/link"

export default function MediaItem({ item }: { item: MediaItemType }) {
    return (
        <article>
            <Link href={`/media/${item.slug}`} className="flex gap-4 p-4">
                <div>
                    <Image
                        src=""
                        alt={item.name}
                        width={100}
                        height={150}
                    />
                </div>
                <div>
                    <h3>{item.name}</h3>
                    <p>{item.type}</p>
                    <p>{item.genre}</p>
                    <p>Added: {item.createdAt.toDate().toDateString()}</p>
                </div>
            </Link>  
        </article>
    )
}

i dont remeber how images works in Next.js
i have four images in the public folder:
book.png;
game.png;
movie.png;
tvshow.png.

each MediaItem should rendre the image base on the item.type field:
type === "movie" => movie.png;
type === "book" => book.png;
type === "game" => game.png;
type === "tvShow" => tvshow.png;



