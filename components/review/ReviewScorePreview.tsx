type Props = {
    score: number | null
    emptyMessage?: string
}

export default function ReviewScorePreview({
    score,
    emptyMessage = "Grade at least one criterion to preview your score.",
}: Props) {
    return (
        <section className="flex flex-col gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                Score Preview
            </h3>

            {score === null ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                    {emptyMessage}
                </p>
            ) : (
                <div className="flex items-center justify-between gap-3">
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                        Current score
                    </span>

                    <span className="text-2xl font-bold tabular-nums text-teal-700 dark:text-teal-400">
                        {score.toFixed(1)} / 100
                    </span>
                </div>
            )}
        </section>
    )
}