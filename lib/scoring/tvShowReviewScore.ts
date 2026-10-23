import {
    tvShowProfileConfigs,
    type TvShowReviewProfileKey,
} from "@/config/tvShowProfile";

import {
    tvShowCriteria,
    type TvShowCriterionKey,
} from "@/config/tvShowCriteria";

import type { ReviewScore } from "@/types";

export type TvShowReviewCriteria = Partial<
    Record<TvShowCriterionKey, number>
>;

export function calculateTvShowReviewScore(
    profile: TvShowReviewProfileKey,
    criteria: TvShowReviewCriteria,
): ReviewScore {
    const { criteriaWeights } = tvShowProfileConfigs[profile];

    let weightedPoints = 0;
    let completedWeight = 0;

    const gradedCriteria: Record<string, number> = {};

    for (
        const key of Object.keys(tvShowCriteria) as TvShowCriterionKey[]
    ) {
        const weight = criteriaWeights[key];

        // Ignore criteria that are not used by this profile.
        if (weight <= 0) continue;

        const grade = criteria[key];

        // Allow incomplete criteria during the live preview.
        if (grade === undefined) continue;

        if (
            typeof grade !== "number" ||
            !Number.isFinite(grade) ||
            !Number.isInteger(grade) ||
            grade < 0 ||
            grade > 10
        ) {
            throw new RangeError(
                `Grade for "${key}" must be an integer between 0 and 10.`,
            );
        }

        gradedCriteria[key] = grade;

        weightedPoints += (grade / 10) * weight;
        completedWeight += weight;
    }

    const score =
        completedWeight === 0
            ? null
            : Math.round(
                  (weightedPoints / completedWeight) * 1000,
              ) / 10;

    return {
        criteria: gradedCriteria,
        modifiers: {},
        baseScore: score,
        totalScore: score,
    };
}