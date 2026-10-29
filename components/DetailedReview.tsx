import type { MediaItemType } from "@/types";

type Props = {
    item: MediaItemType | null;
};

function formatCriterionName(name: string) {
    return name
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (char) => char.toUpperCase())
        .replace(/^Ai$/, "AI");
}

export default function DetailedReview({ item }: Props) {
    const reviewScore = item?.reviewScore;
    const criteria = reviewScore?.criteria ?? {};
    const modifiers = reviewScore?.modifiers;

    return (
        <section className="space-y-6 border-t border-neutral-200 px-5 py-5 dark:border-neutral-800 md:px-7">
            <h2 className="font-semibold text-neutral-900 dark:text-white">
                Score details
            </h2>

            {/* Criteria */}
            <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                    Criteria
                </h3>

                <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {Object.entries(criteria).map(([criterion, score]) => (
                        <div
                            key={criterion}
                            className="flex items-center justify-between gap-2 rounded-lg bg-neutral-100/70 px-3 py-2 dark:bg-neutral-800/60"
                        >
                            <span className="text-sm text-neutral-600 dark:text-neutral-400">
                                {formatCriterionName(criterion)}
                            </span>

                            <span className="shrink-0 text-sm font-semibold tabular-nums text-neutral-900 dark:text-white">
                                {score}/10
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Game modifiers */}
            {item?.type === "game" && modifiers && (
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-300">
                        Modifiers
                    </h3>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2 rounded-lg border border-red-200/70 p-3 dark:border-red-900/50">
                            <p className="text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
                                Deductions
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Bugs: <span className="font-medium text-red-600 dark:text-red-400">−{modifiers.bugs}</span>
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Monetization: <span className="font-medium text-red-600 dark:text-red-400">−{modifiers.monetization}</span>
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Grind: <span className="font-medium text-red-600 dark:text-red-400">−{modifiers.grind}</span>
                            </p>
                        </div>

                        <div className="space-y-2 rounded-lg border border-emerald-200/70 p-3 dark:border-emerald-900/50">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                Bonuses
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Price value: <span className="font-medium text-emerald-600 dark:text-emerald-400">+{modifiers.priceValue}</span>
                            </p>

                            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                Originality: <span className="font-medium text-emerald-600 dark:text-emerald-400">+{modifiers.originality}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Final scores */}
            <div className="flex items-center justify-between gap-4 border-t border-neutral-200 pt-4 dark:border-neutral-800">
                <div className="space-y-1">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        Base score
                    </p>

                    <p className="text-lg font-semibold tabular-nums text-neutral-800 dark:text-neutral-200">
                        {reviewScore?.baseScore ?? "—"}
                    </p>
                </div>

                <div className="rounded-xl bg-neutral-100 px-5 py-3 text-right dark:bg-neutral-800">
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                        Final score
                    </p>

                    <p className="text-2xl font-bold tabular-nums text-neutral-900 dark:text-white">
                        {reviewScore?.totalScore ?? "—"}
                        <span className="ml-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                            /100
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}



/*

import type { MediaItemType } from "@/types";

type Props = {
    item: MediaItemType | null
}

export default function DetailedReview({item}:Props){
    console.log("detailed review item:", item)
    return(
        <section className={`border-t border-neutral-200 px-5 py-5 dark:border-neutral-800 md:px-7`}>
            <h2 className="font-semibold">Score details:</h2>
            <div>
                <p>Criteria:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-3">
                  {Object.entries(item?.reviewScore?.criteria ?? {}).map(([criterion, score]) => (
                    <div
                      key={criterion}
                      className="flex items-center justify-between gap-3"
                     >
                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          {criterion}
                        </span>

                        <span className="font-medium tabular-nums">
                          {score}/10
                        </span>
                    </div>
                  ))}
                </div>
            </div>
            {item?.type === "game" &&
              <div>
                <h3>Modifiers:</h3>
                <div className="flex gap-4">
                    <div>
                      <p>Bugs: -{item?.reviewScore?.modifiers.bugs}</p>
                      <p>Monetization: -{item?.reviewScore?.modifiers.monetization}</p>
                      <p>Grind: -{item?.reviewScore?.modifiers.grind}</p>
                    </div>
                    <div>
                      <p>Price value: +{item?.reviewScore?.modifiers?.priceValue}</p>
                      <p>Originality: +{item?.reviewScore?.modifiers?.originality}</p>
                    </div>
                </div>
              </div> 
            }
            <p>Base Score: {item?.reviewScore?.baseScore}</p>
            <p>Final Score: {item?.reviewScore?.totalScore}</p>
        </section>
    )
}





*/