type Props = {
    completedCriteria: number;
    totalCriteria: number;
};

export default function ReviewProgress({
    completedCriteria,
    totalCriteria,
}: Props) {
    const progress = totalCriteria > 0
        ? (completedCriteria / totalCriteria) * 100
        : 0;

    return (
        <section 
          className={`sticky top-0 z-20 flex flex-col gap-2 border-b border-slate-200
                    bg-white/95 py-3 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95`}
        >
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Review progress
                </p>

                <p className="text-sm text-slate-500 dark:text-slate-400 tabular-nums">
                    {completedCriteria} / {totalCriteria} criteria
                </p>
            </div>

            <div
                role="progressbar"
                aria-label="Review completion"
                aria-valuemin={0}
                aria-valuemax={totalCriteria}
                aria-valuenow={completedCriteria}
                className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
            >
                <div
                    className="h-full rounded-full bg-teal-600 transition-all duration-200"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </section>
    );
}