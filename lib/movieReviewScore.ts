import {
    movieProfileConfigs,
    type MovieReviewProfileKey,
} from "@/config/movieProfile"

import {
    movieReviewCriteria,
    type MovieCriterionKey,
} from "@/config/movieReviewCriteria"

type MovieReviewScoreResult = {
    criteria: Record<string, number>
    modifiers: Record<string, number>
    baseScore: number | null
    totalScore: number | null
}

export function calculateMovieReviewScore(
    profile: MovieReviewProfileKey,
    criteria: Partial<Record<MovieCriterionKey, number>>,
): MovieReviewScoreResult {
    const { criteriaWeights } = movieProfileConfigs[profile]

    let weightedPoints = 0
    let completedWeight = 0

    const gradedCriteria: Record<string, number> = {}

    for (
        const key of Object.keys(movieReviewCriteria) as MovieCriterionKey[]
    ) {
        const grade = criteria[key]

        if (typeof grade !== "number" || !Number.isFinite(grade)) {
            continue
        }

        if (grade < 0 || grade > 10) {
            throw new RangeError(
                `Grade for "${key}" must be between 0 and 10.`,
            )
        }

        gradedCriteria[key] = grade

        weightedPoints += (grade / 10) * criteriaWeights[key]
        completedWeight += criteriaWeights[key]
    }

    const score =
        completedWeight === 0
            ? null
            : Math.round(
                  (weightedPoints / completedWeight) * 1000,
              ) / 10

    return {
        criteria: gradedCriteria,
        modifiers: {},
        baseScore: score,
        totalScore: score,
    }
}