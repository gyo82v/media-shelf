"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import Button from "@/components/ui/Button";
import MovieReviewFields from "@/components/review/movie/MovieReviewFields";
import ReviewProgress from "@/components/review/ReviewProgress";
import ReviewScorePreview from "@/components/review/ReviewScorePreview";
import StarRatingInput from "@/components/review/StarRatingInput";

import { movieProfileConfigs } from "@/config/movieProfile";
import { movieReviewCriteria } from "@/config/movieReviewCriteria";
import type { MovieCriterionKey } from "@/config/movieReviewCriteria";
import type { MovieReviewProfileKey } from "@/config/movieProfile";

import { calculateMovieReviewScore } from "@/lib/movieReviewScore";

type MovieCriteria = Partial<Record<MovieCriterionKey, number>>;

type Props = {
    reviewProfile: MovieReviewProfileKey;
    starRating: number | null;
    criteria?: MovieCriteria;
    saving: boolean;
    onSubmit: (data: {
        starRating: number;
        criteria: MovieCriteria;
    }) => Promise<void>;
    onCancel: () => void;
};

export default function MovieReviewEditorForm({
    reviewProfile,
    starRating,
    criteria = {},
    saving,
    onSubmit,
    onCancel,
}: Props) {
    const formRef = useRef<HTMLFormElement | null>(null);

    const [completedCriteria, setCompletedCriteria] = useState(0);

    const [scorePreview, setScorePreview] =
        useState<ReturnType<typeof calculateMovieReviewScore> | null>(
            null
        );

    const [error, setError] = useState("");

    const activeCriteria = useMemo(() => {
        const config = movieProfileConfigs[reviewProfile];

        return (
            Object.keys(config.criteriaWeights) as MovieCriterionKey[]
        ).filter(
            (criterion) => config.criteriaWeights[criterion] > 0
        );
    }, [reviewProfile]);

    const updateReviewPreview = useCallback(
        (form: HTMLFormElement | null) => {
            if (!form) {
                setCompletedCriteria(0);
                setScorePreview(null);
                return;
            }

            const formData = new FormData(form);
            const nextCriteria: MovieCriteria = {};
            let hasInvalidGrade = false;

            for (const criterion of activeCriteria) {
                const raw = formData.get(criterion);

                if (typeof raw !== "string" || raw === "") {
                    continue;
                }

                const grade = Number(raw);

                if (
                    !Number.isInteger(grade) ||
                    grade < 0 ||
                    grade > 10
                ) {
                    hasInvalidGrade = true;
                    break;
                }

                nextCriteria[criterion] = grade;
            }

            setCompletedCriteria(Object.keys(nextCriteria).length);

            if (hasInvalidGrade) {
                setScorePreview(null);
                return;
            }

            try {
                const result = calculateMovieReviewScore(
                    reviewProfile,
                    nextCriteria
                );

                setScorePreview(result);
            } catch {
                setScorePreview(null);
            }
        },
        [activeCriteria, reviewProfile]
    );

    // Initialize the preview when creating or editing a review.
    useEffect(() => {
        updateReviewPreview(formRef.current);
    }, [updateReviewPreview]);

    const handleSubmit = async (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData(e.currentTarget);

            const starRatingRaw = formData.get("starRating");

            if (
                typeof starRatingRaw !== "string" ||
                starRatingRaw === ""
            ) {
                throw new Error(
                    "Please select your overall star rating."
                );
            }

            const starRating = Number(starRatingRaw);

            if (
                !Number.isFinite(starRating) ||
                starRating < 0 ||
                starRating > 10 ||
                !Number.isInteger(starRating * 2)
            ) {
                throw new Error(
                    "The overall rating must be between 0 and 10 in 0.5 increments."
                );
            }

            const nextCriteria: MovieCriteria = {};

            for (const criterion of activeCriteria) {
                const raw = formData.get(criterion);

                if (typeof raw !== "string" || raw === "") {
                    throw new Error(
                        `Please grade ${movieReviewCriteria[criterion].label}.`
                    );
                }

                const grade = Number(raw);

                if (
                    !Number.isInteger(grade) ||
                    grade < 0 ||
                    grade > 10
                ) {
                    throw new Error(
                        `The grade for ${movieReviewCriteria[criterion].label} must be between 0 and 10.`
                    );
                }

                nextCriteria[criterion] = grade;
            }

            const result = calculateMovieReviewScore(
                reviewProfile,
                nextCriteria
            );

            if (result.totalScore === null) {
                throw new Error(
                    "Please complete all review criteria."
                );
            }

            await onSubmit({
                starRating,
                criteria: nextCriteria,
            });
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

            <MovieReviewFields
                key={reviewProfile}
                reviewProfile={reviewProfile}
                criteria={criteria}
                disabled={saving}
            />

            <ReviewScorePreview
                score={scorePreview?.totalScore ?? null}
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