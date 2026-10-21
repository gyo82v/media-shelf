import type {ReviewCalculation, ReviewModifier,} from "@/types";

type Props = {calculation: ReviewCalculation | null;};

const modifierLabels: Record<ReviewModifier, string> = {
    monetization: "Monetization",
    bugs: "Bugs",
    grind: "Grind",
    priceValue: "Price Value",
    originality: "Originality",
};

const formatSigned = (value: number) =>
    value > 0 ? `+${value}` : String(value);

export default function GameReviewScorePreview({
    calculation,
}: Props) {
    return (
        <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                Score Preview
            </h3>

            {!calculation ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    Complete all criteria to calculate your score.
                </p>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Base score
                            </span>

                            <span className="font-semibold tabular-nums">
                                {calculation.baseScore.toFixed(1)} / 100
                            </span>
                        </div>

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Modifier adjustment
                            </span>

                            <span className="font-medium tabular-nums">
                                {formatSigned(
                                    calculation.modifierAdjustment
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                        <h4 className="text-sm font-medium">
                            Bonuses & Penalties
                        </h4>

                        {(Object.keys(
                            modifierLabels
                        ) as ReviewModifier[]).map((modifier) => {
                            const points =
                                calculation.modifierPoints[modifier];

                            const pointStyle =
                                points > 0
                                    ? "text-teal-700 dark:text-teal-400"
                                    : points < 0
                                        ? "text-red-600 dark:text-red-400"
                                        : "text-slate-500 dark:text-slate-400";

                            return (
                                <div
                                    key={modifier}
                                    className="flex items-center justify-between gap-3 text-sm"
                                >
                                    <span>
                                        {modifierLabels[modifier]}
                                    </span>

                                    <span
                                        className={`font-medium tabular-nums ${pointStyle}`}
                                    >
                                        {formatSigned(points)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-3 dark:border-slate-700">
                        <span className="font-semibold">
                            Final score
                        </span>

                        <span className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-400">
                            {calculation.totalScore.toFixed(1)}
                        </span>
                    </div>
                </>
            )}
        </section>
    );
}
