"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/components/modals/Modal";
import Button from "@/components/ui/Button";

import ReviewSetupForm from "@/components/review/ReviewSetupForm";
import ReviewEditorForm from "@/components/review/ReviewEditorForm";

import MovieReviewSetupForm from "@/components/review/MovieReviewSetupForm";
import MovieReviewEditorForm from "@/components/review/MovieReviewEditorForm";

import BookReviewSetupForm from "@/components/review/BookReviewSetupForm";
import BookReviewEditorForm from "@/components/review/BookReviewEditorForm";

import TvShowReviewSetupForm from "@/components/review/tvShow/TvShowReviewSetupForm";
import TvShowReviewEditorForm from "@/components/review/tvShow/TvShowReviewEditorForm";

import { useAuth } from "@/providers/AuthProvider";
import {
    getMediaById,
    saveMediaReview,
    saveTvShowReviewProfile,
} from "@/firebase/media";

import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { movieProfileConfigs } from "@/config/movieProfile";
import { bookProfileConfigs } from "@/config/bookProfile";
import { tvShowProfileConfigs } from "@/config/tvShowProfile";

import type { MovieReviewProfileKey } from "@/config/movieProfile";
import type { MovieCriterionKey } from "@/config/movieReviewCriteria";

import type { BookReviewProfileKey } from "@/config/bookProfile";
import type { BookCriterionKey } from "@/config/bookCriteria";

import type { TvShowReviewProfileKey } from "@/config/tvShowProfile";
import type { TvShowReviewCriteria } from "@/lib/scoring/tvShowReviewScore";

import { calculateReviewScore } from "@/lib/scoring";
import { calculateMovieReviewScore } from "@/lib/movieReviewScore";
import { calculateBookReviewScore } from "@/lib/bookReviewScore";
import {
    calculateTvShowReviewScore,
} from "@/lib/scoring/tvShowReviewScore";

import type {
    GameProduction,
    ReviewCriteria,
    ReviewModifiers,
    ReviewProfile,
    ReviewScore,
    MediaItemType,
} from "@/types";

type Props = {
    mediaId: string;
    setShowModal: (value: boolean) => void;
};

type Step = "setup" | "review";

type MovieCriteria = Partial<Record<MovieCriterionKey, number>>;
type BookCriteria = Partial<Record<BookCriterionKey, number>>;

export default function ReviewModal({
    mediaId,
    setShowModal,
}: Props) {
    const { profile } = useAuth();
    const uid = profile?.uid;

    const [media, setMedia] = useState<MediaItemType | null>(null);
    const [step, setStep] = useState<Step>("setup");

    const [selectedGameProfile, setSelectedGameProfile] =
        useState<ReviewProfile | "">("");

    const [selectedMovieProfile, setSelectedMovieProfile] =
        useState<MovieReviewProfileKey | "">("");

    const [selectedBookProfile, setSelectedBookProfile] =
        useState<BookReviewProfileKey | "">("");

    const [selectedTvShowProfile, setSelectedTvShowProfile] =
        useState<TvShowReviewProfileKey | "">("");

    const [selectedProduction, setSelectedProduction] =
        useState<GameProduction | "">("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const availableGameProfiles = Object.keys(
        reviewProfileConfigs
    ) as ReviewProfile[];

    useEffect(() => {
        let cancelled = false;

        async function loadMedia() {
            setLoading(true);
            setError("");

            try {
                if (!uid) {
                    throw new Error("No user profile found.");
                }

                const item = await getMediaById(uid, mediaId);

                if (!item) {
                    throw new Error("Media item not found.");
                }

                if (cancelled) return;

                setMedia(item);

                let gameProfile: ReviewProfile | "" = "";
                let movieProfile: MovieReviewProfileKey | "" = "";
                let bookProfile: BookReviewProfileKey | "" = "";
                let tvShowProfile: TvShowReviewProfileKey | "" = "";

                if (
                    item.type === "game" &&
                    item.reviewProfile &&
                    reviewProfileConfigs[
                        item.reviewProfile as ReviewProfile
                    ]
                ) {
                    gameProfile = item.reviewProfile as ReviewProfile;
                }

                if (
                    item.type === "movie" &&
                    item.reviewProfile &&
                    movieProfileConfigs[
                        item.reviewProfile as MovieReviewProfileKey
                    ]
                ) {
                    movieProfile =
                        item.reviewProfile as MovieReviewProfileKey;
                }

                if (
                    item.type === "book" &&
                    item.reviewProfile &&
                    bookProfileConfigs[
                        item.reviewProfile as BookReviewProfileKey
                    ]
                ) {
                    bookProfile =
                        item.reviewProfile as BookReviewProfileKey;
                }

                if (
                    item.type === "tvShow" &&
                    item.reviewProfile &&
                    tvShowProfileConfigs[
                        item.reviewProfile as TvShowReviewProfileKey
                    ]
                ) {
                    tvShowProfile =
                        item.reviewProfile as TvShowReviewProfileKey;
                }

                const production: GameProduction | "" =
                    item.production === "indie" ||
                    item.production === "studio"
                        ? item.production
                        : "";

                setSelectedGameProfile(gameProfile);
                setSelectedMovieProfile(movieProfile);
                setSelectedBookProfile(bookProfile);
                setSelectedTvShowProfile(tvShowProfile);
                setSelectedProduction(production);

                const gameReady =
                    item.type === "game" &&
                    gameProfile !== "" &&
                    production !== "";

                const movieReady =
                    item.type === "movie" &&
                    movieProfile !== "";

                const bookReady =
                    item.type === "book" &&
                    bookProfile !== "";

                const tvShowReady =
                    item.type === "tvShow" &&
                    tvShowProfile !== "";

                setStep(
                    gameReady ||
                    movieReady ||
                    bookReady ||
                    tvShowReady
                        ? "review"
                        : "setup"
                );
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load media."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadMedia();

        return () => {
            cancelled = true;
        };
    }, [mediaId, uid]);

    const closeModal = () => setShowModal(false);

    const handleStartGameReview = (
        reviewProfile: ReviewProfile,
        production: GameProduction
    ) => {
        setSelectedGameProfile(reviewProfile);
        setSelectedProduction(production);
        setError("");
        setStep("review");
    };

    const handleStartMovieReview = (
        reviewProfile: MovieReviewProfileKey
    ) => {
        setSelectedMovieProfile(reviewProfile);
        setError("");
        setStep("review");
    };

    const handleStartBookReview = (
        reviewProfile: BookReviewProfileKey
    ) => {
        setSelectedBookProfile(reviewProfile);
        setError("");
        setStep("review");
    };

    const handleStartTvShowReview = async (
        reviewProfile: TvShowReviewProfileKey
    ) => {
        if (!uid || !media || media.type !== "tvShow") {
            throw new Error("Unable to save the review setup.");
        }

        setSaving(true);

        try {
            // Save the profile before opening the editor.
            // Season reviews can use this profile even if the
            // overall series review has not been completed.
            await saveTvShowReviewProfile(
                uid,
                mediaId,
                reviewProfile
            );

            setSelectedTvShowProfile(reviewProfile);

            setMedia((current) =>
                current
                    ? {
                          ...current,
                          reviewProfile,
                      }
                    : current
            );

            setError("");
            setStep("review");
        } finally {
            setSaving(false);
        }
    };

    const handleSaveGameReview = async ({
        starRating,
        criteria,
        modifiers,
    }: {
        starRating: number;
        criteria: ReviewCriteria;
        modifiers: ReviewModifiers;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "game" ||
            !selectedGameProfile ||
            !selectedProduction
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateReviewScore(
            selectedGameProfile,
            criteria,
            modifiers
        );

        if (!result) throw new Error("Please complete all review grades.")

        const reviewScore: ReviewScore = {
            criteria,
            modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedGameProfile,
                production: selectedProduction,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMovieReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: MovieCriteria;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "movie" ||
            !selectedMovieProfile
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateMovieReviewScore(
            selectedMovieProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error("Please complete all review grades.");
        }

        const reviewScore: ReviewScore = {
            criteria: result.criteria,
            modifiers: result.modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedMovieProfile,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBookReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: BookCriteria;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "book" ||
            !selectedBookProfile
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateBookReviewScore(
            selectedBookProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error("Please complete all review grades.");
        }

        const reviewScore: ReviewScore = {
            criteria: result.criteria,
            modifiers: result.modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedBookProfile,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTvShowReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: TvShowReviewCriteria;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "tvShow" ||
            !selectedTvShowProfile
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateTvShowReviewScore(
            selectedTvShowProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error("Please complete all review grades.");
        }

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedTvShowProfile,
                starRating,
                reviewScore: result,
                markCompleted: false,
            });

            setMedia((current) =>
                current
                    ? {
                          ...current,
                          reviewProfile: selectedTvShowProfile,
                          starRating,
                          reviewScore: result,
                      }
                    : current
            );

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const isSupportedType =
        media?.type === "game" ||
        media?.type === "movie" ||
        media?.type === "book" ||
        media?.type === "tvShow";

    return (
        <Modal>
            <div className="relative flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold">
                            {media
                                ? `Review: ${media.name}`
                                : "Add Review"}
                        </h2>

                        {media && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {media.type}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Close review"
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiX size={25} />
                    </button>
                </div>

                {loading ? (
                    <p>Loading media...</p>
                ) : error && !media ? (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                ) : !media ? (
                    <p role="alert" className="text-sm text-red-600">
                        Media could not be loaded.
                    </p>
                ) : !isSupportedType ? (
                    <div className="flex flex-col gap-4">
                        <p>
                            Review scoring for this media type
                            has not been configured yet.
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            The media item is safe in your library.
                            Its review form will be available when
                            its scoring profile is implemented.
                        </p>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                    </div>
                ) : step === "setup" ? (
                    media.type === "game" ? (
                        <ReviewSetupForm
                            initialReviewProfile={selectedGameProfile}
                            initialProduction={selectedProduction}
                            availableProfiles={availableGameProfiles}
                            onContinue={handleStartGameReview}
                            onCancel={closeModal}
                        />
                    ) : media.type === "movie" ? (
                        <MovieReviewSetupForm
                            initialReviewProfile={selectedMovieProfile}
                            onContinue={handleStartMovieReview}
                            onCancel={closeModal}
                        />
                    ) : media.type === "book" ? (
                        <BookReviewSetupForm
                            initialReviewProfile={selectedBookProfile}
                            onContinue={handleStartBookReview}
                            onCancel={closeModal}
                        />
                    ) : (
                        <TvShowReviewSetupForm
                            initialReviewProfile={selectedTvShowProfile}
                            onContinue={handleStartTvShowReview}
                            onCancel={closeModal}
                            saving={saving}
                        />
                    )
                ) : media.type === "game" ? (
                    selectedGameProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>{selectedGameProfile}</strong>
                                </p>

                                <p>
                                    Production:{" "}
                                    <strong>
                                        {selectedProduction === "indie"
                                            ? "Indie"
                                            : "Studio"}
                                    </strong>
                                </p>
                            </div>

                            <ReviewEditorForm
                                key={`${mediaId}-${selectedGameProfile}`}
                                reviewProfile={selectedGameProfile}
                                criteria={media.reviewScore?.criteria}
                                modifiers={media.reviewScore?.modifiers}
                                saving={saving}
                                onSubmit={handleSaveGameReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                ) : media.type === "movie" ? (
                    selectedMovieProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>
                                        {
                                            movieProfileConfigs[
                                                selectedMovieProfile
                                            ].label
                                        }
                                    </strong>
                                </p>
                            </div>

                            <MovieReviewEditorForm
                                key={`${mediaId}-${selectedMovieProfile}`}
                                reviewProfile={selectedMovieProfile}
                                criteria={media.reviewScore?.criteria}
                                saving={saving}
                                onSubmit={handleSaveMovieReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                ) : media.type === "book" ? (
                    selectedBookProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>
                                        {
                                            bookProfileConfigs[
                                                selectedBookProfile
                                            ].label
                                        }
                                    </strong>
                                </p>
                            </div>

                            <BookReviewEditorForm
                                key={`${mediaId}-${selectedBookProfile}`}
                                reviewProfile={selectedBookProfile}
                                criteria={media.reviewScore?.criteria}
                                saving={saving}
                                onSubmit={handleSaveBookReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                ) : (
                    selectedTvShowProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>
                                        {
                                            tvShowProfileConfigs[
                                                selectedTvShowProfile
                                            ].label
                                        }
                                    </strong>
                                </p>                           
                            </div>

                            <TvShowReviewEditorForm
                                key={`${mediaId}-${selectedTvShowProfile}`}
                                reviewProfile={selectedTvShowProfile}
                                criteria={media.reviewScore?.criteria}
                                saving={saving}
                                onSubmit={handleSaveTvShowReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                )}
            </div>
        </Modal>
    );
}

/*

"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/components/modals/Modal";
import Button from "@/components/ui/Button";

import ReviewSetupForm from "@/components/review/ReviewSetupForm";
import ReviewEditorForm from "@/components/review/ReviewEditorForm";

import MovieReviewSetupForm from "@/components/review/MovieReviewSetupForm";
import MovieReviewEditorForm from "@/components/review/MovieReviewEditorForm";

import BookReviewSetupForm from "@/components/review/BookReviewSetupForm";
import BookReviewEditorForm from "@/components/review/BookReviewEditorForm";

import { useAuth } from "@/providers/AuthProvider";
import { getMediaById, saveMediaReview } from "@/firebase/media";

import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { movieProfileConfigs } from "@/config/movieProfile";
import { bookProfileConfigs } from "@/config/bookProfile";

import type { MovieReviewProfileKey } from "@/config/movieProfile";
import type { MovieCriterionKey } from "@/config/movieReviewCriteria";
import type { BookReviewProfileKey } from "@/config/bookProfile";
import type { BookCriterionKey } from "@/config/bookCriteria";

import { calculateReviewScore } from "@/lib/scoring";
import { calculateMovieReviewScore } from "@/lib/movieReviewScore";
import { calculateBookReviewScore } from "@/lib/bookReviewScore";

import type {
    GameProduction,
    ReviewCriteria,
    ReviewModifiers,
    ReviewProfile,
    ReviewScore,
    MediaItemType,
} from "@/types";

type Props = {
    mediaId: string;
    setShowModal: (value: boolean) => void;
};

type Step = "setup" | "review";

type MovieCriteria = Partial<Record<MovieCriterionKey, number>>;
type BookCriteria = Partial<Record<BookCriterionKey, number>>;

export default function ReviewModal({
    mediaId,
    setShowModal,
}: Props) {
    const { profile } = useAuth();
    const uid = profile?.uid;

    const [media, setMedia] = useState<MediaItemType | null>(null);

    const [step, setStep] = useState<Step>("setup");

    const [selectedGameProfile, setSelectedGameProfile] =
        useState<ReviewProfile | "">("");

    const [selectedMovieProfile, setSelectedMovieProfile] =
        useState<MovieReviewProfileKey | "">("");

    const [selectedBookProfile, setSelectedBookProfile] =
        useState<BookReviewProfileKey | "">("");

    const [selectedProduction, setSelectedProduction] =
        useState<GameProduction | "">("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const availableGameProfiles = Object.keys(
        reviewProfileConfigs
    ) as ReviewProfile[];

    useEffect(() => {
        let cancelled = false;

        async function loadMedia() {
            setLoading(true);
            setError("");

            try {
                if (!uid) {
                    throw new Error("No user profile found.");
                }

                const item = await getMediaById(uid, mediaId);

                if (!item) {
                    throw new Error("Media item not found.");
                }

                if (cancelled) return;

                setMedia(item);

                let usableGameProfile: ReviewProfile | "" = "";
                let usableMovieProfile: MovieReviewProfileKey | "" = "";
                let usableBookProfile: BookReviewProfileKey | "" = "";

                if (
                    item.type === "game" &&
                    item.reviewProfile &&
                    reviewProfileConfigs[
                        item.reviewProfile as ReviewProfile
                    ]
                ) {
                    usableGameProfile =
                        item.reviewProfile as ReviewProfile;
                }

                if (
                    item.type === "movie" &&
                    item.reviewProfile &&
                    movieProfileConfigs[
                        item.reviewProfile as MovieReviewProfileKey
                    ]
                ) {
                    usableMovieProfile =
                        item.reviewProfile as MovieReviewProfileKey;
                }

                if (
                    item.type === "book" &&
                    item.reviewProfile &&
                    bookProfileConfigs[
                        item.reviewProfile as BookReviewProfileKey
                    ]
                ) {
                    usableBookProfile =
                        item.reviewProfile as BookReviewProfileKey;
                }

                const production: GameProduction | "" =
                    item.production === "indie" ||
                    item.production === "studio"
                        ? item.production
                        : "";

                setSelectedGameProfile(usableGameProfile);
                setSelectedMovieProfile(usableMovieProfile);
                setSelectedBookProfile(usableBookProfile);
                setSelectedProduction(production);

                const gameReady =
                    item.type === "game" &&
                    usableGameProfile !== "" &&
                    production !== "";

                const movieReady =
                    item.type === "movie" &&
                    usableMovieProfile !== "";

                const bookReady =
                    item.type === "book" &&
                    usableBookProfile !== "";

                setStep(
                    gameReady || movieReady || bookReady
                        ? "review"
                        : "setup"
                );
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Failed to load media."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void loadMedia();

        return () => {
            cancelled = true;
        };
    }, [mediaId, uid]);

    const handleStartGameReview = (
        reviewProfile: ReviewProfile,
        production: GameProduction
    ) => {
        setSelectedGameProfile(reviewProfile);
        setSelectedProduction(production);
        setError("");
        setStep("review");
    };

    const handleStartMovieReview = (
        reviewProfile: MovieReviewProfileKey
    ) => {
        setSelectedMovieProfile(reviewProfile);
        setError("");
        setStep("review");
    };

    const handleStartBookReview = (
        reviewProfile: BookReviewProfileKey
    ) => {
        setSelectedBookProfile(reviewProfile);
        setError("");
        setStep("review");
    };

    const handleSaveGameReview = async ({
        starRating,
        criteria,
        modifiers,
    }: {
        starRating: number;
        criteria: ReviewCriteria;
        modifiers: ReviewModifiers;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "game" ||
            !selectedGameProfile ||
            !selectedProduction
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateReviewScore(
            selectedGameProfile,
            criteria,
            modifiers
        );

        if (!result) {
            throw new Error("Please complete all review grades.");
        }

        const reviewScore: ReviewScore = {
            criteria,
            modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedGameProfile,
                production: selectedProduction,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveMovieReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: MovieCriteria;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "movie" ||
            !selectedMovieProfile
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateMovieReviewScore(
            selectedMovieProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error("Please complete all review grades.");
        }

        const reviewScore: ReviewScore = {
            criteria: result.criteria,
            modifiers: result.modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedMovieProfile,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBookReview = async ({
        starRating,
        criteria,
    }: {
        starRating: number;
        criteria: BookCriteria;
    }): Promise<void> => {
        if (!uid || !media) {
            throw new Error("Unable to save the review.");
        }

        if (
            media.type !== "book" ||
            !selectedBookProfile
        ) {
            throw new Error("Please complete the review setup.");
        }

        const result = calculateBookReviewScore(
            selectedBookProfile,
            criteria
        );

        if (result.totalScore === null) {
            throw new Error("Please complete all review grades.");
        }

        const reviewScore: ReviewScore = {
            criteria: result.criteria,
            modifiers: result.modifiers,
            baseScore: result.baseScore,
            totalScore: result.totalScore,
        };

        setSaving(true);

        try {
            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedBookProfile,
                starRating,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

    const closeModal = () => setShowModal(false);

    return (
        <Modal>
            <div className="relative flex flex-col gap-5">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-lg font-bold">
                            {media
                                ? `Review: ${media.name}`
                                : "Add Review"}
                        </h2>

                        {media && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {media.type}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        aria-label="Close review"
                        onClick={closeModal}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiX size={25} />
                    </button>
                </div>

                {loading ? (
                    <p>Loading media...</p>
                ) : error && !media ? (
                    <p role="alert" className="text-sm text-red-600">
                        {error}
                    </p>
                ) : !media ? (
                    <p role="alert" className="text-sm text-red-600">
                        Media could not be loaded.
                    </p>
                ) : (
                    media.type !== "game" &&
                    media.type !== "movie" &&
                    media.type !== "book"
                ) ? (
                    <div className="flex flex-col gap-4">
                        <p>
                            Review scoring for this media type
                            has not been configured yet.
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            The media item is safe in your library.
                            Its review form will be available when
                            its scoring profile is implemented.
                        </p>

                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeModal}
                        >
                            Close
                        </Button>
                    </div>
                ) : step === "setup" ? (
                    media.type === "game" ? (
                        <ReviewSetupForm
                            initialReviewProfile={selectedGameProfile}
                            initialProduction={selectedProduction}
                            availableProfiles={availableGameProfiles}
                            onContinue={handleStartGameReview}
                            onCancel={closeModal}
                        />
                    ) : media.type === "movie" ? (
                        <MovieReviewSetupForm
                            initialReviewProfile={selectedMovieProfile}
                            onContinue={handleStartMovieReview}
                            onCancel={closeModal}
                        />
                    ) : (
                        <BookReviewSetupForm
                            initialReviewProfile={selectedBookProfile}
                            onContinue={handleStartBookReview}
                            onCancel={closeModal}
                        />
                    )
                ) : media.type === "game" ? (
                    selectedGameProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>{selectedGameProfile}</strong>
                                </p>

                                <p>
                                    Production:{" "}
                                    <strong>
                                        {selectedProduction === "indie"
                                            ? "Indie"
                                            : "Studio"}
                                    </strong>
                                </p>
                            </div>

                            <ReviewEditorForm
                                key={`${mediaId}-${selectedGameProfile}`}
                                reviewProfile={selectedGameProfile}
                                criteria={media.reviewScore?.criteria}
                                modifiers={media.reviewScore?.modifiers}
                                saving={saving}
                                onSubmit={handleSaveGameReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                ) : media.type === "movie" ? (
                    selectedMovieProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>
                                        {
                                            movieProfileConfigs[
                                                selectedMovieProfile
                                            ].label
                                        }
                                    </strong>
                                </p>
                            </div>

                            <MovieReviewEditorForm
                                key={`${mediaId}-${selectedMovieProfile}`}
                                reviewProfile={selectedMovieProfile}
                                criteria={media.reviewScore?.criteria}
                                saving={saving}
                                onSubmit={handleSaveMovieReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                ) : (
                    selectedBookProfile && (
                        <>
                            <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                                <p>
                                    Profile:{" "}
                                    <strong>
                                        {
                                            bookProfileConfigs[
                                                selectedBookProfile
                                            ].label
                                        }
                                    </strong>
                                </p>
                            </div>

                            <BookReviewEditorForm
                                key={`${mediaId}-${selectedBookProfile}`}
                                reviewProfile={selectedBookProfile}
                                criteria={media.reviewScore?.criteria}
                                saving={saving}
                                onSubmit={handleSaveBookReview}
                                onCancel={closeModal}
                                starRating={media.starRating}
                            />
                        </>
                    )
                )}
            </div>
        </Modal>
    );
}






*/