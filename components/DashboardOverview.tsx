import type { DashboardStats } from "@/types"

type Props = {
    stats: DashboardStats
}

const statusItems = [
    { key: "inProgress", label: "In Progress" },
    { key: "wishList", label: "Wishlist" },
    { key: "completed", label: "Completed" }
] as const

const mediaTypes = [
    { key: "movies", label: "Movies" },
    { key: "tvShows", label: "TV Shows" },
    { key: "games", label: "Games" },
    { key: "books", label: "Books" }
] as const

export default function DashboardOverview({ stats }: Props) {

    return (
        <div className="flex flex-col gap-6">

            {/* Status summary */}
            <div className="grid grid-cols-3 gap-3">
                {statusItems.map((status) => (
                    <div
                        key={status.key}
                        className="flex flex-col gap-1 rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {status.label}
                        </p>
                        <p className="text-2xl font-bold">
                            {stats[status.key].total}
                        </p>
                    </div>
                ))}
            </div>

            {/* Collection breakdown */}
            <section className="flex flex-col gap-3">

                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold">
                        Collection breakdown
                    </h2>

                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {stats.total} {stats.total === 1 ? "item" : "items"} total
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {statusItems.map((status) => (
                        <div
                            key={status.key}
                            className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <h3 className="font-semibold">
                                {status.label}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {mediaTypes.map((mediaType) => (
                                    <div key={mediaType.key} className="flex flex-col gap-1">
                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                            {mediaType.label}
                                        </p>

                                        <p className="text-xl font-semibold">
                                            {stats[status.key][mediaType.key]}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </section>

        </div>
    )
}