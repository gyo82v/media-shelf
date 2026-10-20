
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Button from "@/components/ui/Button";
import ReviewFields from "@/components/review/ReviewFields";
import ReviewProgress from "@/components/review/ReviewProgress";
import ReviewScorePreview from "@/components/review/ReviewScorePreview";
import StarRatingInput from "@/components/review/StarRatingInput";

import { reviewProfileConfigs } from "@/config/reviewProfiles";
import { calculateReviewScore } from "@/lib/scoring";

import type {
    ReviewCalculation,
    ReviewCriteria,
    ReviewCriterion,
    ReviewModifiers,
    ReviewModifier,
    ReviewProfile,
} from "@/types";

type Props = {
    reviewProfile: ReviewProfile;
    starRating: number | null;
    criteria?: ReviewCriteria;
    modifiers?: ReviewModifiers;
    saving: boolean;
    onSubmit: (data: {
        starRating: number;
        criteria: ReviewCriteria;
        modifiers: ReviewModifiers;
    }) => Promise<void>;
    onCancel: () => void;
};

const modifierNames: ReviewModifier[] = [
    "monetization",
    "bugs",
    "grind",
    "priceValue",
    "originality",
];

export default function ReviewEditorForm({
    reviewProfile,
    criteria = {},
    modifiers = {},
    saving,
    starRating,
    onSubmit,
    onCancel,
}: Props) {
    const formRef = useRef<HTMLFormElement | null>(null);

    const [completedCriteria, setCompletedCriteria] = useState(0);

    const [scorePreview, setScorePreview] =
        useState<ReviewCalculation | null>(null);

    const [error, setError] = useState("");

    const activeCriteria = useMemo(() => {
        const config = reviewProfileConfigs[reviewProfile];

        if (!config) return [];

        return (
            Object.entries(config.criteriaWeights) as [
                ReviewCriterion,
                number
            ][]
        )
            .filter(([, weight]) => weight > 0)
            .map(([criterion]) => criterion);
    }, [reviewProfile]);

    const updateReviewPreview = useCallback(
        (form: HTMLFormElement | null) => {
            if (!form) {
                setCompletedCriteria(0);
                setScorePreview(null);
                return;
            }

            const formData = new FormData(form);
            const nextCriteria: ReviewCriteria = {};

            for (const criterion of activeCriteria) {
                const raw = formData.get(criterion);

                if (typeof raw !== "string" || raw === "") {
                    continue;
                }

                const grade = Number(raw);

                if (
                    Number.isInteger(grade) &&
                    grade >= 0 &&
                    grade <= 10
                ) {
                    nextCriteria[criterion] = grade;
                }
            }

            setCompletedCriteria(
                Object.keys(nextCriteria).length
            );

            const nextModifiers: ReviewModifiers = {};

            for (const modifier of modifierNames) {
                const raw = formData.get(modifier);

                if (typeof raw !== "string" || raw === "") {
                    setScorePreview(null);
                    return;
                }

                const grade = Number(raw);

                if (
                    !Number.isInteger(grade) ||
                    grade < 0 ||
                    grade > 5
                ) {
                    setScorePreview(null);
                    return;
                }

                nextModifiers[modifier] = grade;
            }

            try {
                const result = calculateReviewScore(
                    reviewProfile,
                    nextCriteria,
                    nextModifiers
                );

                setScorePreview(result);
            } catch {
                setScorePreview(null);
            }
        },
        [activeCriteria, reviewProfile]
    );

    // Initialize the preview when the uncontrolled inputs mount,
    // including when editing a previously saved review.
    useEffect(() => {
        updateReviewPreview(formRef.current);
    }, [updateReviewPreview]);

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);
        const starRatingRaw = formData.get("starRating");
        const nextCriteria: ReviewCriteria = {};
        const nextModifiers: ReviewModifiers = {};

        if (typeof starRatingRaw !== "string" || starRatingRaw === "") {
            throw new Error("Please select your overall star rating.");
        }

        const starRating = Number(starRatingRaw);
        
        if (
          !Number.isFinite(starRating) ||
          starRating < 0 ||
          starRating > 10 ||
          !Number.isInteger(starRating * 2)
        ) { throw new Error("The overall rating must be between 0 and 10 in 0.5 increments.")}

        try {
            for (const criterion of activeCriteria) {
                const raw = formData.get(criterion);

                if (typeof raw !== "string" || raw === "") {
                    throw new Error(
                        `Please grade ${criterion}.`
                    );
                }

                nextCriteria[criterion] = Number(raw);
            }

            for (const modifier of modifierNames) {
                const raw = formData.get(modifier);

                if (typeof raw !== "string" || raw === "") {
                    throw new Error(
                        `Please complete ${modifier}.`
                    );
                }

                nextModifiers[modifier] = Number(raw);
            }

            // Validate all grades and ensure the review is complete.
            const result = calculateReviewScore(
                reviewProfile,
                nextCriteria,
                nextModifiers
            );

            if (!result) {
                throw new Error(
                    "Please complete all review grades."
                );
            }

             await onSubmit({starRating, criteria: nextCriteria, modifiers: nextModifiers});
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to submit the review."
            );
        }
    };

    return (
        <form
            ref={formRef}
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            onChange={(e) =>
                updateReviewPreview(e.currentTarget)
            }
        >
            <StarRatingInput
                name="starRating"
                defaultValue={starRating}
                disabled={saving}
            />
            <ReviewProgress
                completedCriteria={completedCriteria}
                totalCriteria={activeCriteria.length}
            />

            <ReviewFields
                key={reviewProfile}
                reviewProfile={reviewProfile}
                criteria={criteria}
                modifiers={modifiers}
            />

            <ReviewScorePreview
                calculation={scorePreview}
            />

            {error && (
                <p role="alert" className="text-sm text-red-600">
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Review"}
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    disabled={saving}
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
