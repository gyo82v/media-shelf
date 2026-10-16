
type Props = {
    name: string;
    label: string;
    max: 5 | 10;
    defaultValue?: number | null;
    minLabel?: string;
    middleLabel?: string;
    maxLabel?: string;
    required?: boolean;
    disabled?: boolean;
    description?: string;
};

export default function GradeSelector({
    name,
    label,
    max,
    defaultValue = null,
    minLabel,
    middleLabel,
    maxLabel,
    required = false,
    disabled = false,
    description
}: Props) {
    const grades = Array.from(
        { length: max + 1 },
        (_, index) => index
    );

    const gridClassName =
        max === 10
            ? "grid grid-cols-6 gap-1.5 sm:grid-cols-11"
            : "grid grid-cols-6 gap-1.5";

    return (
        <fieldset
            disabled={disabled}
            className="flex min-w-0 flex-col gap-2"
        >
            <legend className="mb-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                {label}
            </legend>
            {description && (
               <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                 {description}
               </p>
            )}

            <div className={gridClassName}>
                {grades.map((grade) => (
                    <label
                        key={grade}
                        className={
                            disabled
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                        }
                    >
                        <input
                            type="radio"
                            name={name}
                            value={grade}
                            defaultChecked={defaultValue === grade}
                            required={required}
                            className="peer sr-only"
                        />

                        <span
                            className="
                                flex min-h-10 w-full items-center justify-center
                                rounded-md border border-slate-300
                                bg-white text-sm font-medium text-slate-700
                                transition-colors
                                hover:border-teal-500 hover:bg-teal-50
                                peer-checked:border-teal-600
                                peer-checked:bg-teal-600
                                peer-checked:text-white
                                peer-focus-visible:outline-2
                                peer-focus-visible:outline-offset-2
                                peer-focus-visible:outline-teal-600
                                peer-disabled:cursor-not-allowed
                                peer-disabled:opacity-50
                                dark:border-slate-700
                                dark:bg-slate-900 dark:text-slate-200
                                dark:hover:bg-slate-800
                                dark:peer-checked:border-teal-500
                                dark:peer-checked:bg-teal-600
                                dark:peer-checked:text-white
                            "
                        >
                            {grade}
                        </span>
                    </label>
                ))}
            </div>

            {(minLabel || middleLabel || maxLabel) && (
                <div className="grid grid-cols-3 gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{minLabel ?? ""}</span>

                    <span className="text-center">
                        {middleLabel ?? ""}
                    </span>

                    <span className="text-right">
                        {maxLabel ?? ""}
                    </span>
                </div>
            )}
        </fieldset>
    );
}

