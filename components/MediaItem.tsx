
"use client"

import type { MediaItemType } from "@/types"
import Image from "next/image"
import Link from "next/link"
import { imageMap } from "@/data/imageMap"

export default function MediaItem({ item }: { item: MediaItemType }) {
    const mediaType = item.type === "tvShow"
        ? "TV Show"
        : item.type.charAt(0).toUpperCase() + item.type.slice(1)

    const addedDate = item.createdAt.toDate()

    return (
        <article className="group h-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:ring-2 focus-within:ring-neutral-400 dark:border-neutral-800 dark:bg-neutral-900">

            <Link
                href={`/media/${item.slug}`}
                className="flex h-full flex-col outline-none"
            >
                {/* Image */}
                <div className="relative aspect-[3/2] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                        src={imageMap[item.type]}
                        alt=""
                        fill
                        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 25vw"
                        className="object-cover transition-transform duration-300 ease-out group-hover:scale-105"
                    />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4">

                    <h3 className="line-clamp-2 text-base font-semibold text-neutral-900 dark:text-neutral-100">
                        {item.name}
                    </h3>

                    {/* Metadata */}
                    <div className="mt-2 flex min-w-0 items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                        <span className="shrink-0">{mediaType}</span>
                        <span aria-hidden="true">•</span>
                        <span className="min-w-0 truncate">{item.genre}</span>
                    </div>

                    {/* Added date */}
                    <p className="mt-auto pt-4 text-xs text-neutral-400 dark:text-neutral-500">
                        Added{" "}
                        <time dateTime={addedDate.toISOString()}>
                            {addedDate.toLocaleDateString("en-GB", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                        </time>
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
import { imageMap } from "@/data/imageMap"

export default function MediaItem({ item }: { item: MediaItemType }) {
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
}*/







