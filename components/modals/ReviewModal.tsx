
"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";

import Modal from "@/components/modals/Modal";
import Button from "@/components/ui/Button";
import FormSelect from "@/components/ui/form/FormSelect";
import ReviewFields from "@/components/review/ReviewFields";

import {useAuth} from "@/providers/AuthProvider"
import {
    getMediaById,
    saveMediaReview,
} from "@/firebase/media";
import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { calculateReviewScore } from "@/lib/scoring";

import type { MediaItemType } from "@/types";
import type {
    ReviewProfile,
    ReviewCriterion,
    ReviewCriteria,
    ReviewModifier,
    ReviewModifiers,
    GameProduction,
    ReviewScore,
} from "@/types";


type Props = {
    mediaId: string;
    setShowModal: (value: boolean) => void;
};

type Step = "setup" | "review";

const modifierNames: ReviewModifier[] = [
    "monetization",
    "bugs",
    "grind",
    "priceValue",
    "originality",
];


export default function ReviewModal({
    mediaId,
    setShowModal,
}: Props) {
    const { profile } = useAuth();
    const uid = profile?.uid;

    const [media, setMedia] = useState<MediaItemType | null>(null);
    const [step, setStep] = useState<Step>("setup");

    const [selectedReviewProfile, setSelectedReviewProfile] =
        useState<ReviewProfile | "">("");

    const [selectedProduction, setSelectedProduction] =
        useState<GameProduction | "">("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");


    const availableProfiles = Object.keys(
        reviewProfileConfigs
    ) as ReviewProfile[];


    useEffect(() => {
        let cancelled = false;

        async function loadMedia() {
            if (!uid) {
                setError("No user profile found.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const item = await getMediaById(uid, mediaId);

                if (!item) {
                    throw new Error("Media item not found.");
                }

                if (cancelled) return;

                setMedia(item);

                const savedProfile = item.reviewProfile as
                    ReviewProfile | "";

                const usableProfile =
                    savedProfile &&
                    reviewProfileConfigs[savedProfile]
                        ? savedProfile
                        : "";

                const production = item.production ?? "";

                setSelectedReviewProfile(usableProfile);
                setSelectedProduction(production);

                // Skip setup when the game already has
                // a configured profile and production type.
                if (
                    item.type === "game" &&
                    usableProfile &&
                    production
                ) {
                    setStep("review");
                } else {
                    setStep("setup");
                }
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


    const handleStartReview = (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!media || media.type !== "game") {
            setError("This review type is not available yet.");
            return;
        }

        const formData = new FormData(e.currentTarget);

        const profileValue =
            formData.get("reviewProfile")?.toString() ?? "";

        const productionValue =
            formData.get("production")?.toString() ?? "";

        if (
            !availableProfiles.includes(
                profileValue as ReviewProfile
            )
        ) {
            setError("Please select a valid review profile.");
            return;
        }

        if (
            productionValue !== "indie" &&
            productionValue !== "studio"
        ) {
            setError("Please select a production type.");
            return;
        }

        setSelectedReviewProfile(
            profileValue as ReviewProfile
        );

        setSelectedProduction(
            productionValue as GameProduction
        );

        setStep("review");
    };


    const handleSaveReview = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        if (!uid || !media) {
            setError("Unable to save the review.");
            return;
        }

        if (
            media.type !== "game" ||
            !selectedReviewProfile ||
            !selectedProduction
        ) {
            setError("Please complete the review setup.");
            return;
        }

        const config =
            reviewProfileConfigs[selectedReviewProfile];

        if (!config) {
            setError("No scoring configuration exists for this profile.");
            return;
        }

        const formData = new FormData(e.currentTarget);

        try {
            const criteria: ReviewCriteria = {};

            const activeCriteria = (
                Object.keys(
                    config.criteriaWeights
                ) as ReviewCriterion[]
            ).filter(
                (criterion) =>
                    (config.criteriaWeights[criterion] ?? 0) > 0
            );

            for (const criterion of activeCriteria) {
                const raw = formData.get(criterion);

                if (typeof raw !== "string" || raw === "") {
                    throw new Error(
                        `Please grade ${criterion}.`
                    );
                }

                criteria[criterion] = Number(raw);
            }

            const modifiers: ReviewModifiers = {};

            for (const modifier of modifierNames) {
                const raw = formData.get(modifier);

                if (typeof raw !== "string" || raw === "") {
                    throw new Error(
                        `Please complete ${modifier}.`
                    );
                }

                modifiers[modifier] = Number(raw);
            }

            const result = calculateReviewScore(
                selectedReviewProfile,
                criteria,
                modifiers
            );

            if (!result) {
                throw new Error(
                    "Please complete all review grades."
                );
            }

            const reviewScore: ReviewScore = {
                criteria,
                modifiers,
                baseScore: result.baseScore,
                totalScore: result.totalScore,
            };

            setSaving(true);

            await saveMediaReview(uid, mediaId, {
                reviewProfile: selectedReviewProfile,
                production: selectedProduction,
                reviewScore,
            });

            setShowModal(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to save the review."
            );
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
                ) : !media ? (
                    <p role="alert" className="text-red-600">
                        {error || "Media could not be loaded."}
                    </p>
                ) : media.type !== "game" ? (
                    <div className="flex flex-col gap-4">
                        <p>
                            Review scoring for this media type
                            has not been configured yet.
                        </p>

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your media item is safe in your library.
                            Its review form will be available once
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
                    <form
                        className="flex flex-col gap-4"
                        onSubmit={handleStartReview}
                    >
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Choose the scoring profile and production
                            type for this game.
                        </p>

                        {selectedReviewProfile ? (
                            <div>
                                <p className="text-sm font-medium">
                                    Review Profile
                                </p>

                                <p>
                                    {selectedReviewProfile}
                                </p>

                                <input
                                    type="hidden"
                                    name="reviewProfile"
                                    value={selectedReviewProfile}
                                />
                            </div>
                        ) : (
                            <FormSelect
                                name="reviewProfile"
                                label="Review Profile"
                                placeholder="Select review profile"
                                options={availableProfiles.map(
                                    (item) => ({
                                        value: item,
                                        label: item,
                                    })
                                )}
                            />
                        )}

                        {selectedProduction ? (
                            <div>
                                <p className="text-sm font-medium">
                                    Production
                                </p>

                                <p>
                                    {selectedProduction === "indie"
                                        ? "Indie"
                                        : "Studio"}
                                </p>

                                <input
                                    type="hidden"
                                    name="production"
                                    value={selectedProduction}
                                />
                            </div>
                        ) : (
                            <FormSelect
                                name="production"
                                label="Production"
                                placeholder="Select production type"
                                options={[
                                    {
                                        value: "indie",
                                        label: "Indie",
                                    },
                                    {
                                        value: "studio",
                                        label: "Studio",
                                    },
                                ]}
                            />
                        )}

                        {error && (
                            <p role="alert" className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <Button type="submit">
                                Continue
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form
                        className="flex flex-col gap-5"
                        onSubmit={handleSaveReview}
                    >
                        <div className="rounded-md bg-slate-100 p-3 text-sm dark:bg-slate-800">
                            <p>
                                Profile: <strong>
                                    {selectedReviewProfile}
                                </strong>
                            </p>

                            <p>
                                Production: <strong>
                                    {selectedProduction === "indie"
                                        ? "Indie"
                                        : "Studio"}
                                </strong>
                            </p>
                        </div>

                        <ReviewFields
                            key={`${mediaId}-${selectedReviewProfile}`}
                            reviewProfile={selectedReviewProfile}
                            criteria={media.reviewScore?.criteria}
                            modifiers={media.reviewScore?.modifiers}
                        />

                        {error && (
                            <p role="alert" className="text-sm text-red-600">
                                {error}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <Button
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Review"}
                            </Button>

                            <Button
                                type="button"
                                variant="secondary"
                                disabled={saving}
                                onClick={() => setShowModal(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
}
