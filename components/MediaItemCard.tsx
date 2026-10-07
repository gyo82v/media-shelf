"use client";

import type { MediaItemType } from "@/types";
import Image from "next/image";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import {formatStatus, formatType} from "@/lib/media";
import {formatDate} from "@/lib/formatDate";

import { imageMap } from "@/data/imageMap";
import StarRating from "@/components/StarRating";

type Props = {
    mediaItem: MediaItemType | null;
};

export default function MediaItemCard({ mediaItem }: Props) {

    const handleUpdate = () => {
        console.log("Update item:", mediaItem?.id);
    };

    const handleDelete = () => {
        console.log("Delete item:", mediaItem?.id);
    };

    if (!mediaItem) {
        return (
            <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Media item not found.
                </p>
            </article>
        );
    }

    return (
        <article className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

            <div className="md:grid md:grid-cols-[320px_1fr]">

                {/* Image */}
                <div className="relative aspect-[3/2] w-full bg-neutral-100 md:aspect-auto md:min-h-full dark:bg-neutral-800">
                    <Image
                        src={imageMap[mediaItem.type]}
                        alt={mediaItem.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 767px) 100vw, 320px"
                    />
                </div>

                {/* Main content */}
                <div className="flex flex-col p-5 md:p-7">

                    {/* Title + badges */}
                    <div className="mb-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">

                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                {formatType(mediaItem.type)}
                            </span>

                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                                {formatStatus(mediaItem.status)}
                            </span>

                        </div>

                        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900 md:text-3xl dark:text-white">
                            {mediaItem.name}
                        </h1>
                    </div>

                    {/* Metadata */}
                    <div className="grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Genre
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {mediaItem.genre || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Review Profile
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {mediaItem.reviewProfile || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Country
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {mediaItem.country || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Release Year
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {mediaItem.year || "Not specified"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Added
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {formatDate(mediaItem.createdAt)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                                Completed
                            </p>
                            <p className="mt-1 text-sm text-neutral-900 dark:text-neutral-200">
                                {formatDate(mediaItem.finishedAt)}
                            </p>
                        </div>

                    </div>

                    {/* Description */}
                    <div className="mt-7 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
                            Description
                        </h2>

                        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                            {mediaItem.description ||
                                "No description has been added yet."}
                        </p>
                    </div>

                    {/* Notes */}
                    <div className="mt-6">
                        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
                            Notes
                        </h2>

                        <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-400">
                            {mediaItem.notes ||
                                "No notes have been added yet."}
                        </p>
                    </div>

                    {/* Personal rating */}
                    <div className="mt-6 border-t border-neutral-200 pt-6 dark:border-neutral-800">
                        <h2 className="mb-2 text-sm font-semibold text-neutral-900 dark:text-white">
                            Rating
                        </h2>
                        {mediaItem.starRating !== undefined &&
                        mediaItem.starRating !== null ? (
                            <div className="flex items-center gap-3">
                                <StarRating rating={mediaItem.starRating} />

                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    {mediaItem.starRating}/10
                                </span>
                            </div>
                        ) : (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                Not rated yet
                            </p>
                        )}
                    </div>

                    {/* Review total score */}
                    <div className="mt-6 ">
                        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                            Review Score
                        </h2>

                        {mediaItem.reviewScore?.totalScore !== undefined &&
                        mediaItem.reviewScore?.totalScore !== null ? (
                            <div className="mt-2 flex items-center gap-3">
                              
                                <StarRating
                                    rating={mediaItem.reviewScore.totalScore}
                                />

                                <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                                    {mediaItem.reviewScore.totalScore}/10
                                </span>
                            </div>
                        ) : (
                            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                                No review yet
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex flex-col gap-3 border-t border-neutral-200 pt-6 sm:flex-row dark:border-neutral-800">

                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            <FiEdit2 size={16} />
                            Update
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                        >
                            <FiTrash2 size={16} />
                            Delete
                        </button>

                    </div>

                </div>
            </div>

            {/* Detailed review */}
            <details className="border-t border-neutral-200 dark:border-neutral-800">
                <summary className="cursor-pointer px-5 py-4 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 md:px-7 dark:text-white dark:hover:bg-neutral-800/50">
                    Review
                </summary>

                <div className="border-t border-neutral-200 px-5 py-5 dark:border-neutral-800 md:px-7">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        No detailed review has been added yet.
                    </p>
                </div>
            </details>

        </article>
    );
}
