"use client"

import type {MediaItemType} from "@/types"
import Image from "next/image"
import Link from "next/link"
import { imageMap } from "@/data/imageMap"
import StarRating from "./StarRating"

export default function MediaReviewedItem({ item }: { item: MediaItemType }) {
    console.log("media item: ", item)
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
                <div className="flex flex-col gap-4 p-4">
                    <div>
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
                    <div className="flex flex-col gap-1 ">
                        <StarRating rating={item?.starRating || 0} />
                        <p className="text-lg font-semibold">{item.reviewScore?.totalScore}</p>
                    </div>
                </div>
            </Link>
        </article>
    )
}