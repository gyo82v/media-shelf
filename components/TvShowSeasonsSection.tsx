"use client";

import { useCallback, useEffect, useState } from "react";

import {
    createTvShowSeason,
    getTvShowSeasons,
    saveTvShowReviewProfile,
} from "@/firebase/media";

import { useAuth } from "@/providers/AuthProvider";

import type {
    ReviewScore,
    TvShowSeason,
} from "@/types";

import {
    tvShowProfileConfigs,
    type TvShowReviewProfileKey,
} from "@/config/tvShowProfile";

import TvShowReviewSetupForm from "@/components/review/tvShow/TvShowReviewSetupForm";
import TvShowSeasonCard from "./TvShowSeasonCard";

type Props = {
    mediaId: string;
    reviewProfile: TvShowReviewProfileKey | "";
};

export default function TvShowSeasonsSection({
    mediaId,
    reviewProfile,
}: Props) {
    const { profile } = useAuth();
    const uid = profile?.uid;

    const [seasons, setSeasons] = useState<TvShowSeason[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showSeasonForm, setShowSeasonForm] = useState(false);
    const [showProfileForm, setShowProfileForm] = useState(false);
    const [error, setError] = useState("");

    // A locally selected profile takes precedence while this component
    // is mounted. Otherwise, use the profile passed by the detail page.
    const [localReviewProfile, setLocalReviewProfile] =
        useState<TvShowReviewProfileKey | null>(null);

    const activeReviewProfile =
        localReviewProfile ?? reviewProfile;

    const fetchSeasons = useCallback(async () => {
        if (!uid) {
            throw new Error("No user profile found.");
        }

        return getTvShowSeasons(uid, mediaId);
    }, [uid, mediaId]);

    useEffect(() => {
        if (!uid) return;

        let cancelled = false;

        async function load() {
            try {
                const result = await fetchSeasons();

                if (!cancelled) {
                    setSeasons(result);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load seasons."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void load();

        return () => {
            cancelled = true;
        };
    }, [uid, fetchSeasons]);

    const handleSaveReviewProfile = async (
        selectedProfile: TvShowReviewProfileKey
    ) => {
        if (!uid) {
            throw new Error("No user profile found.");
        }

        setSaving(true);
        setError("");

        try {
            await saveTvShowReviewProfile(
                uid,
                mediaId,
                selectedProfile
            );

            setLocalReviewProfile(selectedProfile);
            setShowProfileForm(false);
        } finally {
            setSaving(false);
        }
    };

    const handleCreateSeason = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!uid) {
            setError("No user profile found.");
            return;
        }

        const form = e.currentTarget;
        const formData = new FormData(form);

        const seasonNumber = Number(
            formData.get("seasonNumber")
        );

        const episodeCount = Number(
            formData.get("episodeCount")
        );

        if (
            !Number.isInteger(seasonNumber) ||
            seasonNumber < 1
        ) {
            setError("Enter a valid season number.");
            return;
        }

        if (
            !Number.isInteger(episodeCount) ||
            episodeCount < 0 ||
            episodeCount > 100
        ) {
            setError(
                "The episode count must be between 0 and 100."
            );
            return;
        }

        setSaving(true);

        try {
            await createTvShowSeason(
                uid,
                mediaId,
                seasonNumber,
                episodeCount
            );

            const updatedSeasons = await fetchSeasons();
            setSeasons(updatedSeasons);

            form.reset();
            setShowSeasonForm(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create the season."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEpisodeCountChange = (
        seasonId: string,
        episodeCount: number
    ) => {
        setSeasons((current) =>
            current.map((season) =>
                season.id === seasonId
                    ? { ...season, episodeCount }
                    : season
            )
        );
    };

    const handleSeasonReviewSaved = (
        seasonId: string,
        starRating: number,
        reviewScore: ReviewScore
    ) => {
        setSeasons((current) =>
            current.map((season) =>
                season.id === seasonId
                    ? {
                          ...season,
                          starRating,
                          reviewScore,
                      }
                    : season
            )
        );
    };

    return (
        <section className="mt-6 flex flex-col gap-5 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm md:p-7 dark:border-neutral-800 dark:bg-neutral-900">
            {/* Section heading */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                        Seasons
                    </h2>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Manage seasons, their reviews and episode ratings.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        setShowSeasonForm((current) => !current);
                        setError("");
                    }}
                    disabled={saving}
                    className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                >
                    {showSeasonForm ? "Cancel" : "Add Season"}
                </button>
            </div>

            {/* TV show review profile */}
            <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h3 className="font-medium text-neutral-900 dark:text-white">
                            Review Profile
                        </h3>

                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {activeReviewProfile
                                ? `Selected: ${
                                      tvShowProfileConfigs[
                                          activeReviewProfile
                                      ].label
                                  }`
                                : "Choose a profile to enable detailed reviews for this show and its seasons."}
                        </p>
                    </div>

                    {!activeReviewProfile && (
                        <button
                            type="button"
                            onClick={() => {
                                setShowProfileForm((current) => !current);
                                setError("");
                            }}
                            disabled={saving}
                            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                        >
                            {showProfileForm
                                ? "Cancel"
                                : "Set review profile"}
                        </button>
                    )}
                </div>

                {!activeReviewProfile && showProfileForm && (
                    <TvShowReviewSetupForm
                        initialReviewProfile=""
                        onContinue={handleSaveReviewProfile}
                        onCancel={() => setShowProfileForm(false)}
                        saving={saving}
                    />
                )}

                {activeReviewProfile && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        This profile is used for the overall show review
                        and all detailed season reviews.
                    </p>
                )}
            </div>

            {/* Add season form */}
            {showSeasonForm && (
                <form
                    className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
                    onSubmit={handleCreateSeason}
                >
                    <h3 className="font-medium text-neutral-900 dark:text-white">
                        New Season
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="seasonNumber"
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Season number
                            </label>

                            <input
                                id="seasonNumber"
                                name="seasonNumber"
                                type="number"
                                min="1"
                                step="1"
                                required
                                disabled={saving}
                                placeholder="e.g. 1"
                                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="episodeCount"
                                className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                            >
                                Number of episodes
                            </label>

                            <input
                                id="episodeCount"
                                name="episodeCount"
                                type="number"
                                min="0"
                                max="100"
                                step="1"
                                required
                                disabled={saving}
                                defaultValue="8"
                                className="rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                            />
                        </div>
                    </div>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        Episode entries will be created automatically.
                        You can add more episodes later if needed.
                    </p>

                    <button
                        type="submit"
                        disabled={saving}
                        className="self-start rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                    >
                        {saving ? "Creating..." : "Create Season"}
                    </button>
                </form>
            )}

            {/* Errors from season loading or creation */}
            {error && (
                <p
                    role="alert"
                    className="text-sm text-red-600 dark:text-red-400"
                >
                    {error}
                </p>
            )}

            {/* Seasons list */}
            {loading ? (
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Loading seasons...
                </p>
            ) : seasons.length === 0 ? (
                <div className="rounded-xl border border-dashed border-neutral-300 p-6 text-center dark:border-neutral-700">
                    <p className="font-medium text-neutral-800 dark:text-neutral-200">
                        No seasons added yet
                    </p>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Add a season to start tracking its episodes and review.
                    </p>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {seasons.map((season) => (
                        <TvShowSeasonCard
                            key={season.id}
                            uid={uid!}
                            mediaId={mediaId}
                            season={season}
                            reviewProfile={activeReviewProfile}
                            onEpisodeCountChange={handleEpisodeCountChange}
                            onSeasonReviewSaved={handleSeasonReviewSaved}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}