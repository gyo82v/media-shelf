
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/components/modals/Modal";
import Button from "@/components/ui/Button";
import ReviewSetupForm from "@/components/review/ReviewSetupForm";
import ReviewEditorForm from "@/components/review/ReviewEditorForm";
import MovieReviewSetupForm from "@/components/review/MovieReviewSetupForm";
import MovieReviewEditorForm from "@/components/review/MovieReviewEditorForm";

import { useAuth } from "@/providers/AuthProvider";
import { getMediaById, saveMediaReview } from "@/firebase/media";

import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { movieProfileConfigs } from "@/config/movieProfile";
import type { MovieReviewProfileKey } from "@/config/movieProfile";
import type { MovieCriterionKey } from "@/config/movieReviewCriteria";

import { calculateReviewScore } from "@/lib/scoring";
import { calculateMovieReviewScore } from "@/lib/movieReviewScore";

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

                const production: GameProduction | "" =
                    item.production === "indie" ||
                    item.production === "studio"
                        ? item.production
                        : "";

                setSelectedGameProfile(usableGameProfile);
                setSelectedMovieProfile(usableMovieProfile);
                setSelectedProduction(production);

                const gameReady =
                    item.type === "game" &&
                    usableGameProfile !== "" &&
                    production !== "";

                const movieReady =
                    item.type === "movie" &&
                    usableMovieProfile !== "";

                setStep(
                    gameReady || movieReady ? "review" : "setup"
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

    const closeModal = () => setShowModal(false);

    const isSupportedType =
        media?.type === "game" || media?.type === "movie";

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
                    ) : (
                        <MovieReviewSetupForm
                            initialReviewProfile={selectedMovieProfile}
                            onContinue={handleStartMovieReview}
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
                ) : (
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
                )}
            </div>
        </Modal>
    );
}


