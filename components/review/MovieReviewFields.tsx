import GradeSelector from "./GradeSelector";

import { movieReviewCriteria } from "@/config/movieReviewCriteria";
import { movieProfileConfigs } from "@/config/movieProfile";

import type { MovieCriterionKey } from "@/config/movieReviewCriteria";
import type { MovieReviewProfileKey, MovieProfileConfig } from "@/config/movieProfile";

type Props = {
    reviewProfile: MovieReviewProfileKey;
    criteria?: Partial<Record<MovieCriterionKey, number>>;
    disabled?: boolean;
};

export default function MovieReviewFields({
    reviewProfile,
    criteria = {},
    disabled = false,
}: Props) {
    const config: MovieProfileConfig = movieProfileConfigs[reviewProfile]

    const activeCriteria = (
        Object.keys(config.criteriaWeights) as MovieCriterionKey[]
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
                    Each criterion contributes to your movie score.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {activeCriteria.map((criterion) => {
                    const criterionInfo =
                        movieReviewCriteria[criterion];

                    const description =
                        config.criteriaDescriptions?.[criterion] ??
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