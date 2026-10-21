import {
    bookProfileConfigs,
    type BookReviewProfileKey,
} from "@/config/bookProfile";

import {
    bookCriteria,
    type BookCriterionKey,
} from "@/config/bookCriteria";

type BookReviewScoreResult = {
    criteria: Record<string, number>;
    modifiers: Record<string, number>;
    baseScore: number | null;
    totalScore: number | null;
};

export function calculateBookReviewScore(
    profile: BookReviewProfileKey,
    criteria: Partial<Record<BookCriterionKey, number>>,
): BookReviewScoreResult {
    const { criteriaWeights } = bookProfileConfigs[profile];

    let weightedPoints = 0;
    let completedWeight = 0;

    const gradedCriteria: Record<string, number> = {};

    for (
        const key of Object.keys(bookCriteria) as BookCriterionKey[]
    ) {
        const weight = criteriaWeights[key];

        // Ignore criteria that are not used by this profile.
        if (weight <= 0) continue;

        const grade = criteria[key];

        // An unanswered criterion is allowed during the live preview.
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