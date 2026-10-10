import { reviewProfileConfigs } from "@/config/reviewProfiles";

import type {
    ReviewCalculation,
    ReviewCriterion,
    ReviewCriteria,
    ReviewModifier,
    ReviewModifiers,
    ReviewProfile,
} from "@/types";


const modifierDirections: Record<ReviewModifier, 1 | -1> = {
    monetization: -1,
    bugs: -1,
    grind: -1,
    priceValue: 1,
    originality: 1,
};


const roundToOneDecimal = (value: number): number => {
    return Math.round((value + Number.EPSILON) * 10) / 10;
};


function validateGrade(
    label: string,
    grade: unknown,
    max: number
): asserts grade is number {
    if (
        typeof grade !== "number" ||
        !Number.isInteger(grade) ||
        grade < 0 ||
        grade > max
    ) {
        throw new Error(
            `${label} must be a whole number between 0 and ${max}.`
        );
    }
}


export function calculateReviewScore(
    profile: ReviewProfile,
    criteria: ReviewCriteria,
    modifiers: ReviewModifiers
): ReviewCalculation | null {

    const config = reviewProfileConfigs[profile];

    if (!config) {
        throw new Error(
            `No scoring configuration exists for "${profile}".`
        );
    }

    const configuredCriteria = Object.entries(
        config.criteriaWeights
    ) as [ReviewCriterion, number][];

    // Validate the configured weights.
    for (const [criterion, weight] of configuredCriteria) {
        if (!Number.isInteger(weight) || weight < 0) {
            throw new Error(
                `Invalid weight for criterion "${criterion}".`
            );
        }
    }

    const totalWeight = configuredCriteria.reduce(
        (total, [, weight]) => total + weight,
        0
    );

    if (totalWeight !== 100) {
        throw new Error(
            `The "${profile}" profile weights must total 100. ` +
            `Current total: ${totalWeight}.`
        );
    }

    // Only criteria with a weight greater than zero are active.
    const activeCriteria = configuredCriteria.filter(
        ([, weight]) => weight > 0
    );

    // Validate any grades that have already been entered.
    for (const [criterion] of activeCriteria) {
        const grade = criteria[criterion];

        if (grade !== undefined) {
            validateGrade(`Criterion "${criterion}"`, grade, 10);
        }
    }

    for (const modifier of Object.keys(
        modifierDirections
    ) as ReviewModifier[]) {
        const grade = modifiers[modifier];

        if (grade !== undefined) {
            validateGrade(`Modifier "${modifier}"`, grade, 5);
        }
    }

    // Do not calculate a score while any required grade is missing.
    const missingCriteria = activeCriteria.some(
        ([criterion]) => criteria[criterion] === undefined
    );

    const missingModifiers = (
        Object.keys(modifierDirections) as ReviewModifier[]
    ).some((modifier) => modifiers[modifier] === undefined);

    if (missingCriteria || missingModifiers) {
        return null;
    }

    // Calculate weighted criterion points.
    const criterionPoints: Partial<
        Record<ReviewCriterion, number>
    > = {};

    let baseScoreRaw = 0;

    for (const [criterion, weight] of activeCriteria) {
        const grade = criteria[criterion]!;

        const points = (grade / 10) * weight;

        criterionPoints[criterion] = roundToOneDecimal(points);

        // Add the unrounded points to avoid cumulative rounding errors.
        baseScoreRaw += points;
    }

    const baseScore = roundToOneDecimal(baseScoreRaw);

    // Apply positive and negative modifiers.
    const modifierPoints = {} as Record<ReviewModifier, number>;

    for (const modifier of Object.keys(
        modifierDirections
    ) as ReviewModifier[]) {
        const grade = modifiers[modifier]!;

        modifierPoints[modifier] =
            grade * modifierDirections[modifier];
    }

    const modifierAdjustment = Object.values(modifierPoints).reduce(
        (total, points) => total + points,
        0
    );

    const totalScore = roundToOneDecimal(
        baseScore + modifierAdjustment
    );

    return {
        criterionPoints,
        modifierPoints,
        modifierAdjustment,
        baseScore,
        totalScore,
    };
}
