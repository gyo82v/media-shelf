"use client";

import { useState } from "react";

import StarRatingInput from "./review/StarRatingInput";
import TvShowReviewEditorForm from "@/components/review/tvShow/TvShowReviewEditorForm";

import {
    addTvShowEpisodes,
    getTvShowEpisodes,
    saveTvShowEpisodeRating,
    saveTvShowSeasonReview,
} from "@/firebase/media";


import {
    calculateTvShowReviewScore,
    type TvShowReviewCriteria,
} from "@/lib/scoring/tvShowReviewScore";

import type {
    ReviewScore,
    TvShowEpisode,
    TvShowSeason,
} from "@/types";

import type { TvShowReviewProfileKey } from "@/config/tvShowProfile";

type Props = {
    uid: string;
    mediaId: string;
    season: TvShowSeason;
    reviewProfile: TvShowReviewProfileKey | "";
    onEpisodeCountChange: (
        seasonId: string,
        episodeCount: number
    ) => void;
    onSeasonReviewSaved: (
        seasonId: string,
        starRating: number,
        reviewScore: ReviewScore
    ) => void;
};

export default function TvShowSeasonCard({
    uid,
    mediaId,
    season,
    reviewProfile,
    onEpisodeCountChange,
    onSeasonReviewSaved,
}: Props) {
    const [expanded, setExpanded] = useState(false);
    const [episodes, setEpisodes] = useState<TvShowEpisode[]>([]);
    const [episodesLoading, setEpisodesLoading] = useState(false);

    const [showAddEpisodes, setShowAddEpisodes] = useState(false);
    const [showSeasonReview, setShowSeasonReview] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleToggleSeason = async () => {
        if (expanded) {
            setExpanded(false);
            setShowSeasonReview(false);
            setShowAddEpisodes(false);
            return;
        }

        setError("");
        setEpisodesLoading(true);

        try {
            const result = await getTvShowEpisodes(
                uid,
                mediaId,
                season.id
            );

            setEpisodes(result);
            setExpanded(true);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load episodes."
            );
        } finally {
            setEpisodesLoading(false);
        }
    };

    const handleAddEpisodes = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const count = Number(formData.get("episodeCount"));

        if (
            !Number.isInteger(count) ||
            count < 1 ||
            count > 100
        ) {
            setError(
                "Enter a number of additional episodes between 1 and 100."
            );
            return;
        }

        setSaving(true);

        try {
            await addTvShowEpisodes(
                uid,
                mediaId,
                season.id,
                count
            );

            const updatedEpisodes = await getTvShowEpisodes(
                uid,
                mediaId,
                season.id
            );

            setEpisodes(updatedEpisodes);

            onEpisodeCountChange(
                season.id,
                updatedEpisodes.length
            );

            form.reset();
            setShowAddEpisodes(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to add episodes."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleEpisodeRatingChange = async (
    episode: TvShowEpisode,
    starRating: number
) => {
    if (
        !Number.isFinite(starRating) ||
        starRating < 0 ||
        starRating > 10 ||
        !Number.isInteger(starRating * 2)
    ) {
        setError(
            "The rating must be between 0 and 10 in 0.5 increments."
        );
        return;
    }

    const previousRating = episode.starRating;

    setError("");
    setSaving(true);

    setEpisodes((current) =>
        current.map((item) =>
            item.id === episode.id
                ? { ...item, starRating }
                : item
        )
    );

    try {
        await saveTvShowEpisodeRating(
            uid,
            mediaId,
            season.id,
            episode.id,
            starRating
        );
    } catch (err) {
        setEpisodes((current) =>
            current.map((item) =>
                item.id === episode.id
                    ? {
                          ...item,
                          starRating: previousRating,
                      }
                    : item
            )
        );

        setError(
            err instanceof Error
                ? err.message
                : "Failed to save episode rating."
        );
    } finally {
        setSaving(false);
    }
};

    const handleSaveSeasonReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: TvShowReviewCriteria;
    }) => {
        if (!reviewProfile) {
            throw new Error(
                "Please select the TV show review profile first."
            );
        }

        const result = calculateTvShowReviewScore(
            reviewProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error(
                "Please complete all review criteria."
            );
        }

        setSaving(true);

        try {
            await saveTvShowSeasonReview(
                uid,
                mediaId,
                season.id,
                {
                    starRating,
                    reviewScore: result,
                }
            );

            onSeasonReviewSaved(
                season.id,
                starRating,
                result
            );

            setShowSeasonReview(false);
        } finally {
            setSaving(false);
        }
    };

    return (
        <article className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800">
            {/* Season summary */}
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="font-semibold text-neutral-900 dark:text-white">
                        Season {season.number}
                    </h3>

                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {season.episodeCount}{" "}
                        {season.episodeCount === 1
                            ? "episode"
                            : "episodes"}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Star rating
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {season.starRating !== null
                                ? `${season.starRating}/10`
                                : "Not rated"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                            Detailed score
                        </p>

                        <p className="mt-1 text-sm font-medium text-neutral-800 dark:text-neutral-200">
                            {season.reviewScore?.totalScore != null
                                ? `${season.reviewScore.totalScore.toFixed(1)}/100`
                                : "Not reviewed"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleToggleSeason}
                        disabled={episodesLoading || saving}
                        className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                        {episodesLoading
                            ? "Loading..."
                            : expanded
                                ? "Hide episodes"
                                : "Open season"}
                    </button>
                </div>
            </div>

            {/* Expanded season content */}
            {expanded && (
                <div className="flex flex-col gap-5 border-t border-neutral-200 p-4 dark:border-neutral-800">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h4 className="font-medium text-neutral-900 dark:text-white">
                            Episodes
                        </h4>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setShowAddEpisodes((current) => !current);
                                    setShowSeasonReview(false);
                                    setError("");
                                }}
                                className="rounded-lg border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                            >
                                {showAddEpisodes
                                    ? "Cancel"
                                    : "Add episodes"}
                            </button>

                            <button
                                type="button"
                                disabled={saving || !reviewProfile}
                                onClick={() => {
                                    setShowSeasonReview((current) => !current);
                                    setShowAddEpisodes(false);
                                    setError("");
                                }}
                                className="rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                            >
                                {showSeasonReview
                                    ? "Close review"
                                    : season.reviewScore
                                        ? "Edit season review"
                                        : "Review season"}
                            </button>
                        </div>
                    </div>

                    {!reviewProfile && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            Select the TV show review profile before
                            reviewing seasons. Episode ratings remain
                            available without it.
                        </p>
                    )}

                    {/* Add more episodes */}
                    {showAddEpisodes && (
                        <form
                            className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                            onSubmit={handleAddEpisodes}
                        >
                            <label
                                htmlFor={`additional-episodes-${season.id}`}
                                className="text-sm font-medium text-neutral-800 dark:text-neutral-200"
                            >
                                Number of episodes to add
                            </label>

                            <input
                                id={`additional-episodes-${season.id}`}
                                name="episodeCount"
                                type="number"
                                min="1"
                                max="100"
                                step="1"
                                required
                                disabled={saving}
                                defaultValue="1"
                                className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"
                            />

                            <button
                                type="submit"
                                disabled={saving}
                                className="self-start rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                            >
                                {saving ? "Adding..." : "Add episodes"}
                            </button>
                        </form>
                    )}

                    {/* Detailed season review */}
                    {showSeasonReview && reviewProfile && (
                        <div className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
                            <h4 className="mb-4 font-semibold text-neutral-900 dark:text-white">
                                Season {season.number} review
                            </h4>

                            <TvShowReviewEditorForm
                                key={`${mediaId}-${season.id}-${reviewProfile}`}
                                reviewProfile={reviewProfile}
                                starRating={season.starRating}
                                criteria={
                                    season.reviewScore?.criteria as
                                        | TvShowReviewCriteria
                                        | undefined
                                }
                                saving={saving}
                                onSubmit={handleSaveSeasonReview}
                                onCancel={() => setShowSeasonReview(false)}
                            />
                        </div>
                    )}

                    {/* Episodes with inline rating selectors */}
                   <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {episodes.map((episode) => (
        <div
            key={episode.id}
            className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
        >
            <span className="text-sm font-medium text-neutral-900 dark:text-white">
                Episode {episode.number}
            </span>

            <StarRatingInput
                name={`episode-rating-${season.id}-${episode.id}`}
                value={episode.starRating}
                onChange={(rating) => {
                    void handleEpisodeRatingChange(
                        episode,
                        rating
                    );
                }}
                label={`Episode ${episode.number} rating`}
                compact
                required={false}
                disabled={saving}
            />
        </div>
    ))}
</div>

                    {episodes.length === 0 && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            No episodes yet. Add episodes to this
                            season when you&apos;re ready.
                        </p>
                    )}

                    {/* Error message */}
                    {error && (
                        <p
                            role="alert"
                            className="text-sm text-red-600 dark:text-red-400"
                        >
                            {error}
                        </p>
                    )}
                </div>
            )}
        </article>
    );
}