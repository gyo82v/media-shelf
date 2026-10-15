
import GradeSelector from "./GradeSelector";

import { reviewProfileConfigs } from "@/config/reviewProfiles";

import type {
    ReviewProfile,
    ReviewCriterion,
    ReviewCriteria,
    ReviewModifier,
    ReviewModifiers,
} from "@/types";


type Props = {
    reviewProfile: ReviewProfile | "";
    criteria?: ReviewCriteria;
    modifiers?: ReviewModifiers;
    disabled?: boolean;
};


const criterionLabels: Record<ReviewCriterion, string> = {
    gameplay: "Gameplay",
    storyline: "Storyline",
    ending: "Ending",
    characters: "Characters",
    audio: "Audio",
    performance: "Performance",
    replayability: "Replayability",
    longevity: "Longevity",
    graphics: "Graphics",
    artStyle: "Art Style",
    worldDesign: "World Design",
    ai: "AI",
    atmosphere: "Atmosphere",
    progression: "Progression",
    controls: "Controls",
    difficultyBalance: "Difficulty & Balance",
    online: "Online & Social Experience",
    strategicDepth: "Strategic Depth",
    resourceManagement: "Resources Managment",
    runVariety: "Run Variety",
    sportMechanics: "Sport Mechanics",
    rosterVariety: "Roster Variety"
};


type ModifierConfig = {
    label: string;
    minLabel: string;
    middleLabel: string;
    maxLabel: string;
};


const modifierConfigs: Record<ReviewModifier, ModifierConfig> = {
    monetization: {
        label: "Monetization",
        minLabel: "No issue",
        middleLabel: "Moderate",
        maxLabel: "Severe",
    },
    bugs: {
        label: "Bugs",
        minLabel: "No issues",
        middleLabel: "Some issues",
        maxLabel: "Severe",
    },
    grind: {
        label: "Grind",
        minLabel: "No grind",
        middleLabel: "Noticeable",
        maxLabel: "Excessive",
    },
    priceValue: {
        label: "Price Value",
        minLabel: "No bonus",
        middleLabel: "Good value",
        maxLabel: "Exceptional",
    },
    originality: {
        label: "Originality",
        minLabel: "No bonus",
        middleLabel: "Distinctive",
        maxLabel: "Highly original",
    },
};


export default function ReviewFields({
    reviewProfile,
    criteria = {},
    modifiers = {},
    disabled = false,
}: Props) {

    if (!reviewProfile) {
        return (
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Select a review profile to see the review criteria.
            </p>
        );
    }

    const config = reviewProfileConfigs[reviewProfile];

    if (!config) {
        return (
            <p className="text-sm text-slate-500 dark:text-slate-400">
                No review configuration is available for this profile yet.
            </p>
        );
    }

    const activeCriteria = (
        Object.keys(config.criteriaWeights) as ReviewCriterion[]
    ).filter(
        (criterion) => (config.criteriaWeights[criterion] ?? 0) > 0
    );

    return (
        <div className="flex flex-col gap-8">

            {/* Normal criteria */}
            <section className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Review Criteria
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Grade each criterion from 0 to 10.
                        Each criterion contributes to your base score.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {activeCriteria.map((criterion) => (
                        <GradeSelector
                            key={criterion}
                            name={criterion}
                            label={criterionLabels[criterion]}
                            max={10}
                            defaultValue={criteria[criterion] ?? null}
                            required
                            minLabel="Very poor"
                            middleLabel="Average"
                            maxLabel="Excellent"
                            disabled={disabled}
                        />
                    ))}
                </div>
            </section>

            {/* Modifiers */}
            <section className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                        Bonuses & Penalties
                    </h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Modifiers are applied after the base score.
                        All modifiers start at 0.
                    </p>
                </div>

                <div className="flex flex-col gap-6">
                    {(Object.keys(
                        modifierConfigs
                    ) as ReviewModifier[]).map((modifier) => {
                        const item = modifierConfigs[modifier];

                        return (
                            <GradeSelector
                                key={modifier}
                                name={modifier}
                                label={item.label}
                                max={5}
                                defaultValue={modifiers[modifier] ?? 0}
                                required
                                minLabel={item.minLabel}
                                middleLabel={item.middleLabel}
                                maxLabel={item.maxLabel}
                                disabled={disabled}
                            />
                        );
                    })}
                </div>
            </section>

        </div>
    );
}
