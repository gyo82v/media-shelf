
"use client"

import { useState } from "react"
import type { MediaItemType } from "@/types"

export type MediaSortOption =
    | "recentlyAdded"
    | "recentlyUpdated"
    | "nameAsc"
    | "nameDesc"

type Props = {
    searchTerm: string
    onSearchChange: (value: string) => void

    selectedTypes: MediaItemType["type"][]
    onToggleType: (type: MediaItemType["type"]) => void

    sortBy: MediaSortOption
    onSortChange: (value: MediaSortOption) => void

    onClearFilters: () => void
}

const mediaTypes: {
    value: MediaItemType["type"]
    label: string
}[] = [
    { value: "movie", label: "Movies" },
    { value: "book", label: "Books" },
    { value: "tvShow", label: "TV Shows" },
    { value: "game", label: "Games" },
]

export default function MediaListControls({
    searchTerm,
    onSearchChange,
    selectedTypes,
    onToggleType,
    sortBy,
    onSortChange,
    onClearFilters,
}: Props) {
    const [filtersOpen, setFiltersOpen] = useState(false)

    const hasActiveFilters =
        searchTerm.trim().length > 0 || selectedTypes.length > 0

    return (
        <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-950 sm:p-5">

            <div className="grid grid-cols-2 gap-3 md:grid-cols-[minmax(0,1fr)_220px]">

                {/* Search */}
                <div className="col-span-2 md:col-span-1">
                    <label
                        htmlFor="media-search"
                        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Search your collection
                    </label>

                    <input
                        id="media-search"
                        type="search"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-4 py-3 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-neutral-800"
                    />
                </div>

                {/* Mobile filters button */}
                <button
                    type="button"
                    onClick={() => setFiltersOpen(prev => !prev)}
                    aria-expanded={filtersOpen}
                    aria-controls="media-type-filters"
                    className="col-start-1 row-start-2 flex items-center justify-between rounded-xl border border-neutral-300 px-3 py-3 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900 md:hidden"
                >
                    <span>
                        Filters
                        {selectedTypes.length > 0 && (
                            <span className="ml-1 text-neutral-500 dark:text-neutral-400">
                                ({selectedTypes.length})
                            </span>
                        )}
                    </span>

                    <span aria-hidden="true">
                        {filtersOpen ? "−" : "+"}
                    </span>
                </button>

                {/* Sorting */}
                <div className="col-start-2 row-start-2 md:col-start-2 md:row-start-1">
                    <label
                        htmlFor="media-sort"
                        className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
                    >
                        Sort by
                    </label>

                    <select
                        id="media-sort"
                        value={sortBy}
                        onChange={(e) =>
                            onSortChange(e.target.value as MediaSortOption)
                        }
                        className="w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-neutral-800"
                    >
                        <option value="recentlyAdded">Recently added</option>
                        <option value="recentlyUpdated">Recently updated</option>
                        <option value="nameAsc">Name: A – Z</option>
                        <option value="nameDesc">Name: Z – A</option>
                    </select>
                </div>

                {/* Type filters */}
                <div
                    id="media-type-filters"
                    className={`col-span-2 row-start-3 border-t border-neutral-200 pt-4 dark:border-neutral-800 md:row-start-2 ${
                        filtersOpen ? "block" : "hidden"
                    } md:block`}
                >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Filter by type
                        </h3>

                        {hasActiveFilters && (
                            <button
                                type="button"
                                onClick={onClearFilters}
                                className="text-xs font-medium text-neutral-500 transition hover:text-neutral-900 dark:hover:text-neutral-200"
                            >
                                Clear search & filters
                            </button>
                        )}
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                        {mediaTypes.map(type => {
                            const isSelected = selectedTypes.includes(type.value)

                            return (
                                <label
                                    key={type.value}
                                    className={`cursor-pointer rounded-full border px-4 py-2 text-sm font-medium transition focus-within:ring-2 focus-within:ring-neutral-400 focus-within:ring-offset-2 dark:focus-within:ring-offset-neutral-950 ${
                                        isSelected
                                            ? "border-neutral-900 bg-neutral-900 text-white dark:border-neutral-100 dark:bg-neutral-100 dark:text-neutral-900"
                                            : "border-neutral-300 text-neutral-600 hover:border-neutral-500 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
                                    }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => onToggleType(type.value)}
                                        className="sr-only"
                                    />

                                    {type.label}
                                </label>
                            )
                        })}
                    </div>
                </div>

            </div>
        </section>
    )
}

