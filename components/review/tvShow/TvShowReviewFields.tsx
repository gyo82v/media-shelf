import GradeSelector from "../GradeSelector";

import { tvShowCriteria } from "@/config/tvShowCriteria";
import {
    tvShowProfileConfigs,
    type TvShowProfileConfig,
    type TvShowReviewProfileKey,
} from "@/config/tvShowProfile";

import type { TvShowCriterionKey } from "@/config/tvShowCriteria";

type Props = {
    reviewProfile: TvShowReviewProfileKey;
    criteria?: Partial<Record<TvShowCriterionKey, number>>;
    disabled?: boolean;
};

export default function TvShowReviewFields({
    reviewProfile,
    criteria = {},
    disabled = false,
}: Props) {
    const config: TvShowProfileConfig =
        tvShowProfileConfigs[reviewProfile];

    const activeCriteria = (
        Object.keys(config.criteriaWeights) as TvShowCriterionKey[]
    ).filter(
        (criterion) => config.criteriaWeights[criterion] > 0
    );

    return (
        <section className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    Review Criteria
                </h3>

                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Grade each criterion from 0 to 10.
                    Each criterion contributes to your TV show score.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {activeCriteria.map((criterion) => {
                    const criterionInfo =
                        tvShowCriteria[criterion];

                    const description =
                        config.criteriaDescription?.[criterion] ??
                        criterionInfo.description;

                    return (
                        <GradeSelector
                            key={criterion}
                            name={criterion}
                            label={criterionInfo.label}
                            description={description}
                            max={10}
                            defaultValue={criteria[criterion] ?? null}
                            required
                            minLabel="Very poor"
                            middleLabel="Average"
                            maxLabel="Excellent"
                            disabled={disabled}
                        />
                    );
                })}
            </div>
        </section>
    );
}