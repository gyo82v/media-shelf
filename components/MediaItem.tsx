"use client"

import type {MediaItemType} from "@/types"
import Image from "next/image"
import Link from "next/link"

export default function MediaItem({ item }: { item: MediaItemType }) {

    const imageMap = {
        "movie": "/movie.png",
        "book": "/book.png",
        "game": "/game.png",
        "tvShow": "/tvshow.png"
    }

    return (
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <Link
        href={`/media/${item.slug}`}
        className="group block transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
    >
        <div className="aspect-[3/2] w-full overflow-hidden">
            <Image
                src={imageMap[item.type]}
                alt={item.name}
                width={600}
                height={400}
                className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
            />
        </div>

        <div className="p-4">
            <h3 className="line-clamp-2 text-lg font-semibold">
                {item.name}
            </h3>

            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                <span>{item.type}</span>
                <span>•</span>
                <span>{item.genre}</span>
            </div>

            <p className="mt-4 text-xs text-gray-400">
                Added: {item.createdAt.toDate().toDateString()}
            </p>
        </div>
    </Link>
</article>
    )
}







/*
"use client"

import type {MediaItemType} from "@/types"
import Image from "next/image"
import Link from "next/link"

export default function MediaItem({ item }: { item: MediaItemType }) {

    const imageMap = {
        "movie": "/movie.png",
        "book": "/book.png",
        "game": "/game.png",
        "tvShow": "/tvshow.png"
    }

    return (
        <article>
            <Link href={`/media/${item.slug}`} className="flex gap-4 p-4">
                <Image
                    src={imageMap[item.type]}
                    alt={item.name}
                    width={100}
                    height={150}
                />
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






*/