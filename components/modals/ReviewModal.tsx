
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/components/modals/Modal";
import Button from "@/components/ui/Button";
import ReviewSetupForm from "@/components/review/ReviewSetupForm";
import ReviewEditorForm from "@/components/review/ReviewEditorForm";

import { useAuth } from "@/providers/AuthProvider";
import {getMediaById, saveMediaReview} from "@/firebase/media";

import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { calculateReviewScore } from "@/lib/scoring";

import type {
    GameProduction,
    ReviewCriteria,
    ReviewModifiers,
    ReviewProfile,
    ReviewScore,
    MediaItemType
} from "@/types";

type Props = {
    mediaId: string;
    setShowModal: (value: boolean) => void;
};

type Step = "setup" | "review";

export default function ReviewModal({mediaId, setShowModal}: Props) {
    const { profile } = useAuth();
    const uid = profile?.uid;

    const [media, setMedia] = useState<MediaItemType | null>(null);

    const [step, setStep] = useState<Step>("setup");

    const [selectedReviewProfile, setSelectedReviewProfile] = useState<ReviewProfile | "">("");

    const [selectedProduction, setSelectedProduction] = useState<GameProduction | "">("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const availableProfiles = Object.keys(reviewProfileConfigs) as ReviewProfile[];

    useEffect(() => {
        let cancelled = false;

        async function loadMedia() {
            setLoading(true);
            setError("");

            try {
                if (!uid) throw new Error("No user profile found.")

                const item = await getMediaById(uid, mediaId);

                if (!item) throw new Error("Media item not found.")

                if (cancelled) return;

                setMedia(item);

                let usableProfile: ReviewProfile | "" = "";

                if (
                    item.reviewProfile &&
                    reviewProfileConfigs[item.reviewProfile as ReviewProfile]
                ) {
                    usableProfile = item.reviewProfile as ReviewProfile;
                }

                const production: GameProduction | "" =
                    item.production === "indie" ||
                    item.production === "studio"
                        ? item.production
                        : "";

                setSelectedReviewProfile(usableProfile);
                setSelectedProduction(production);

                setStep(
                    item.type === "game" &&
                    usableProfile !== "" &&
                    production !== ""
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
                if (!cancelled) setLoading(false)
            }
        }

        void loadMedia();

        return () => {
            cancelled = true;
        };
    }, [mediaId, uid]);

    const handleStartReview = (
        reviewProfile: ReviewProfile,
        production: GameProduction
    ) => {
        setSelectedReviewProfile(reviewProfile);
        setSelectedProduction(production);
        setError("");
        setStep("review");
    };

    const handleSaveReview = async (criteria: ReviewCriteria,modifiers: ReviewModifiers): Promise<void> => {
        if (!uid || !media) throw new Error("Unable to save the review.")

        if(media.type !== "game" || !selectedReviewProfile || !selectedProduction) {
            throw new Error("Please complete the review setup.");
        }

        // Calculate again before saving, so the persisted score
        // comes from the shared scoring engine.
        const result = calculateReviewScore(selectedReviewProfile, criteria, modifiers);

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
                reviewProfile: selectedReviewProfile,
                production: selectedProduction,
                reviewScore,
            });

            setShowModal(false);
        } finally {
            setSaving(false);
        }
    };

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
                        onClick={() => setShowModal(false)}
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
                ) : media.type !== "game" ? (
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
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </Button>
                    </div>
                ) : step === "setup" ? (
                    <ReviewSetupForm
                        initialReviewProfile={selectedReviewProfile}
                        initialProduction={selectedProduction}
                        availableProfiles={availableProfiles}
                        onContinue={handleStartReview}
                        onCancel={() => setShowModal(false)}
                    />
                ) : (
                    <>
                        <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                            <p>
                                Profile:{" "}
                                <strong>{selectedReviewProfile}</strong>
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

                        {selectedReviewProfile && (
                            <ReviewEditorForm
                                key={`${mediaId}-${selectedReviewProfile}`}
                                reviewProfile={selectedReviewProfile}
                                criteria={media.reviewScore?.criteria}
                                modifiers={media.reviewScore?.modifiers}
                                saving={saving}
                                onSubmit={handleSaveReview}
                                onCancel={() => setShowModal(false)}
                            />
                        )}
                    </>
                )}
            </div>
        </Modal>
    );
}


