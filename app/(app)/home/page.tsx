"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/providers/AuthProvider"
import { getDashboardStats } from "@/firebase/media"
import Button from "@/components/ui/Button"
import ReviewModal from "@/components/modals/ReviewModal";
import AddMediaModal from "@/components/modals/AddMediaModal";

import type { DashboardStats } from "@/types"

import DashboardOverview from "@/components/DashboardOverview"

// Keep your existing imports for:
// Button, AddMediaModal and ReviewModal

export default function HomePage() {

    const { profile } = useAuth()

    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [refreshKey, setRefreshKey] = useState(0)

    const [showAddMediaModal, setShowAddMediaModal] = useState(false)
    const [showReviewModal, setShowReviewModal] = useState(false)
    const [selectedMediaId, setSelectedMediaId] = useState<string | null>(null)

    // Fetch dashboard statistics
    useEffect(() => {

        if (!profile?.uid) return

        let isActive = true

        const fetchStats = async () => {

            setIsLoading(true)
            setError(null)

            try {
                const data = await getDashboardStats(profile.uid)

                if (isActive) {
                    setStats(data)
                }

            } catch (error) {

                console.error("Error fetching dashboard statistics:", error)

                if (isActive) {
                    setError("Unable to load your dashboard. Please try again.")
                    setStats(null)
                }

            } finally {

                if (isActive) {
                    setIsLoading(false)
                }
            }
        }

        fetchStats()

        return () => {
            isActive = false
        }

    }, [profile?.uid, refreshKey])

    // Handle adding new media
    const handleAddAndReview = (mediaId: string) => {
        setSelectedMediaId(mediaId)
        setShowReviewModal(true)

        // Refresh dashboard statistics
        setRefreshKey(prev => prev + 1)
    }

    return (
        <main className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-6 p-4">

            {/* Header */}
            <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">

                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-bold">
                        Welcome back{profile?.displayName ? `, ${profile.displayName}` : ""}!
                    </h1>

                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Here&apos;s an overview of your media collection.
                    </p>
                </div>

                <Button onClick={() => setShowAddMediaModal(true)}>
                    Add Media
                </Button>

            </header>

            {/* Dashboard statistics */}
            {isLoading ? (

                <p className="py-10 text-center text-sm text-neutral-500">
                    Loading your collection...
                </p>

            ) : error ? (

                <p role="alert" className="py-10 text-center text-sm text-red-500">
                    {error}
                </p>

            ) : stats ? (

                <DashboardOverview stats={stats} />

            ) : null}

            {/* Modals */}
            {showAddMediaModal && (
                <AddMediaModal
                    setShowModal={setShowAddMediaModal}
                    onAddAndReview={handleAddAndReview}
                />
            )}

            {showReviewModal && selectedMediaId && (
                <ReviewModal
                    mediaId={selectedMediaId}
                    setShowModal={setShowReviewModal}
                />
            )}

        </main>
    )
}

