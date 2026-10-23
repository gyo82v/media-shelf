"use client";

import { useState } from "react";

import StarRating from "@/components/StarRating";
import StarRatingInput from "@/components/review/StarRatingInput";
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

    const [editingEpisodeId, setEditingEpisodeId] =
        useState<string | null>(null);

    const [showAddEpisodes, setShowAddEpisodes] = useState(false);
    const [showSeasonReview, setShowSeasonReview] = useState(false);

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const editingEpisode = episodes.find(
        (episode) => episode.id === editingEpisodeId
    );

    const handleToggleSeason = async () => {
        if (expanded) {
            setExpanded(false);
            setEditingEpisodeId(null);
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
                season.episodeCount + count
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

    const handleSaveEpisodeRating = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!editingEpisode) {
            setError("Please select an episode.");
            return;
        }

        const formData = new FormData(e.currentTarget);
        const rawRating = formData.get("starRating");

        if (typeof rawRating !== "string" || rawRating === "") {
            setError("Please select an episode rating.");
            return;
        }

        const starRating = Number(rawRating);

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

        setSaving(true);

        try {
            await saveTvShowEpisodeRating(
                uid,
                mediaId,
                season.id,
                editingEpisode.id,
                starRating
            );

            setEpisodes((current) =>
                current.map((episode) =>
                    episode.id === editingEpisode.id
                        ? { ...episode, starRating }
                        : episode
                )
            );

            setEditingEpisodeId(null);
        } catch (err) {
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
            throw new Error("Please complete all review criteria.");
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
                                    setEditingEpisodeId(null);
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
                                    setEditingEpisodeId(null);
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
                            reviewing seasons. Episode ratings are
                            available without it.
                        </p>
                    )}

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

                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {episodes.map((episode) => (
                            <button
                                key={episode.id}
                                type="button"
                                disabled={saving}
                                onClick={() => {
                                    setEditingEpisodeId(episode.id);
                                    setShowSeasonReview(false);
                                    setShowAddEpisodes(false);
                                    setError("");
                                }}
                                className={`flex min-h-20 flex-col items-start justify-between gap-2 rounded-lg border p-3 text-left transition ${
                                    editingEpisodeId === episode.id
                                        ? "border-neutral-500 bg-neutral-100 dark:bg-neutral-800"
                                        : "border-neutral-200 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
                                }`}
                            >
                                <span className="text-sm font-medium text-neutral-900 dark:text-white">
                                    Episode {episode.number}
                                </span>

                                {episode.starRating !== null ? (
                                    <span className="flex items-center gap-2">
                                        <StarRating rating={episode.starRating} />
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {episode.starRating}/10
                                        </span>
                                    </span>
                                ) : (
                                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                        Not rated
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {episodes.length === 0 && (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            No episodes yet. Add episodes to this season
                            when you&apos;re ready.
                        </p>
                    )}

                    {editingEpisode && (
                        <form
                            key={editingEpisode.id}
                            className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
                            onSubmit={handleSaveEpisodeRating}
                        >
                            <div>
                                <h4 className="font-semibold text-neutral-900 dark:text-white">
                                    Episode {editingEpisode.number}
                                </h4>

                                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                    Choose a rating from 0 to 10.
                                </p>
                            </div>

                            <StarRatingInput
                                name="starRating"
                                defaultValue={editingEpisode.starRating}
                                disabled={saving}
                            />

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-300"
                                >
                                    {saving ? "Saving..." : "Save rating"}
                                </button>

                                <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => setEditingEpisodeId(null)}
                                    className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {error && (
                        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </article>
    );
}