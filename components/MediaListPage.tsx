
"use client"

import { getMediaByStatus } from "@/firebase/media"
import { useAuth } from "@/providers/AuthProvider"
import { useEffect, useMemo, useState } from "react"

import MediaItem from "./MediaItem"
import MediaReviewedItem from "./MediaReviewedItem"
import MediaListControls, { type MediaSortOption } from "./MediaListControls"

import type { MediaItemType } from "@/types"

type Props = {
    title: string
    description: string
    status: MediaItemType["status"]
}

export default function MediaListPage({ title, description, status }: Props) {
    const { profile } = useAuth()

    const [mediaList, setMediaList] = useState<MediaItemType[]>([])

    // Search, filter and sorting state
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedTypes, setSelectedTypes] = useState<MediaItemType["type"][]>([])
    const [sortBy, setSortBy] = useState<MediaSortOption>("recentlyAdded")

    useEffect(() => {
        if (!profile?.uid) return

        const loadMedia = async () => {
            const items = await getMediaByStatus(profile.uid, status)
            setMediaList(items)
        }

        loadMedia()
    }, [profile?.uid, status])

    // Toggle selected media types
    const toggleType = (type: MediaItemType["type"]) => {
        setSelectedTypes(current =>
            current.includes(type)
                ? current.filter(t => t !== type)
                : [...current, type]
        )
    }

    // Search, filter and sort media
    const displayedMediaList = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase()

        const filtered = mediaList.filter(item => {
            const matchesSearch = item.name
                .toLowerCase()
                .includes(normalizedSearch)

            const matchesType =
                selectedTypes.length === 0 ||
                selectedTypes.includes(item.type)

            return matchesSearch && matchesType
        })

        return filtered.sort((a, b) => {
            switch (sortBy) {
                case "recentlyAdded":
                    return b.createdAt.toMillis() - a.createdAt.toMillis()

                case "recentlyUpdated":
                    return b.updatedAt.toMillis() - a.updatedAt.toMillis()

                case "nameAsc":
                    return a.name.localeCompare(b.name, undefined, {
                        sensitivity: "base",
                    })

                case "nameDesc":
                    return b.name.localeCompare(a.name, undefined, {
                        sensitivity: "base",
                    })
            }
        })
    }, [mediaList, searchTerm, selectedTypes, sortBy])

    
return (
    <main className="mx-auto mt-8 w-full max-w-7xl px-4 pb-12 sm:mt-10 sm:px-6 lg:px-8">

        {/* Page heading */}
        <header className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-3xl">
                {title}
            </h1>

            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 sm:text-base">
                {description}
            </p>
        </header>

        {/* Search and filters */}
        <MediaListControls
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            selectedTypes={selectedTypes}
            onToggleType={toggleType}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onClearFilters={() => {
                setSearchTerm("")
                setSelectedTypes([])
            }}
        />

        {/* Results information */}
        <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Showing{" "}
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {displayedMediaList.length}
                </span>
                {" "}of {mediaList.length} items
            </p>
        </div>

        {/* Media grid */}
        {displayedMediaList.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {status === "completed" ? (
                    displayedMediaList.map(item => (
                        <MediaReviewedItem key={item.id} item={item} />
                    ))
                ) : (
                    displayedMediaList.map(item => (
                        <MediaItem key={item.id} item={item} />
                    ))
                )}
            </div>
        ) : (
            /* Empty states */
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 px-6 py-16 text-center dark:border-neutral-700">

                <h2 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                    {mediaList.length === 0
                        ? "Your list is empty"
                        : "No matching media found"}
                </h2>

                <p className="mt-2 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
                    {mediaList.length === 0
                        ? "Media items you add to this list will appear here."
                        : "Try changing your search or adjusting your selected filters."}
                </p>

                {mediaList.length > 0 && (
                    <button
                        type="button"
                        onClick={() => {
                            setSearchTerm("")
                            setSelectedTypes([])
                        }}
                        className="mt-5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                    >
                        Clear search and filters
                    </button>
                )}

            </div>
        )}

    </main>
)

}



/*

"use client"

import { getMediaByStatus } from "@/firebase/media"
import { useAuth } from "@/providers/AuthProvider"
import { useEffect, useState } from "react"
import MediaItem from "./MediaItem"
import MediaReviewedItem from "./MediaReviewedItem"
import type { MediaItemType } from "@/types"

type Props = {
    title: string,
    description: string,
    status: MediaItemType["status"]
}

export default function MediaListPage({title, description, status}:Props){
    const {profile} = useAuth()
    const [mediaList, setMediaList] = useState<MediaItemType[]>([])

    useEffect(() => {
        if(!profile?.uid) return

        const loadMedia = async () => {
            const items = await getMediaByStatus(profile?.uid, status)
            setMediaList(items)
        }
        loadMedia()
    }, [profile?.uid, status])

    return(
        <div className="flex flex-col mt-10 p-4 ">
            <div className="mb-10">
                <h1 className="text-xl font-bold">{title}</h1>
                <p className="text-lg font-semibold">{description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {status === "completed" ? (
                    mediaList.map(i => <MediaReviewedItem key={i.id} item={i} />)
                ) : (
                    mediaList.map(i => <MediaItem key={i.id} item={i} />)
                )}
            </div>
        </div>
    )
}




*/