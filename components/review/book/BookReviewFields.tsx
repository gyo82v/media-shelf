import GradeSelector from "../GradeSelector";

import { bookCriteria } from "@/config/bookCriteria";
import {
    bookProfileConfigs,
    type BookProfileConfig,
    type BookReviewProfileKey,
} from "@/config/bookProfile";

import type { BookCriterionKey } from "@/config/bookCriteria";

type Props = {
    reviewProfile: BookReviewProfileKey;
    criteria?: Partial<Record<BookCriterionKey, number>>;
    disabled?: boolean;
};

export default function BookReviewFields({
    reviewProfile,
    criteria = {},
    disabled = false,
}: Props) {
    const config: BookProfileConfig =
        bookProfileConfigs[reviewProfile];

    const activeCriteria = (
        Object.keys(config.criteriaWeights) as BookCriterionKey[]
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
                    Each criterion contributes to your book score.
                </p>
            </div>

            <div className="flex flex-col gap-6">
                {activeCriteria.map((criterion) => {
                    const criterionInfo = bookCriteria[criterion];

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