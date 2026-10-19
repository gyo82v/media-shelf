
"use client";

import { useState } from "react";

// Adjust this import to the location of your existing StarRating.tsx.
import StarRating from "@/components/StarRating";

type Props = {
    name?: string;
    defaultValue?: number | null;
    disabled?: boolean;
};

export default function StarRatingInput({
    name = "starRating",
    defaultValue = null,
    disabled = false,
}: Props) {
    const [rating, setRating] = useState<number | null>(
        defaultValue
    );

    return (
        <fieldset
            disabled={disabled}
            className="flex flex-col gap-3"
        >
            <legend className="font-semibold text-slate-800 dark:text-slate-100">
                Overall Rating
            </legend>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                Your personal rating of the game, independent
                of the detailed review score.
            </p>

            <div className="flex flex-wrap items-center gap-4">
                <div className="
                    relative inline-flex w-fit items-center
                    rounded-md
                    focus-within:outline-2
                    focus-within:outline-offset-4
                    focus-within:outline-teal-600
                ">
                    <StarRating rating={rating ?? 0} />

                    <input
                        type="range"
                        min={0}
                        max={10}
                        step={0.5}
                        value={rating ?? 0}
                        onChange={(e) =>
                            setRating(Number(e.currentTarget.value))
                        }
                        aria-label="Overall rating from 0 to 10"
                        aria-valuetext={
                            rating === null
                                ? "Not rated"
                                : `${rating} out of 10`
                        }
                        className="
                            absolute inset-0 z-10
                            h-full w-full cursor-pointer
                            opacity-0
                            disabled:cursor-not-allowed
                        "
                    />
                </div>

                <output className="min-w-20 text-lg font-semibold tabular-nums">
                    {rating === null
                        ? "Not rated"
                        : `${rating.toFixed(1)} / 10`}
                </output>
            </div>

            <input
                type="hidden"
                name={name}
                value={rating === null ? "" : String(rating)}
            />

            <div className="flex items-center gap-4 text-sm">
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setRating(0)}
                    className="text-slate-500 underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200"
                >
                    Rate 0 / 10
                </button>

                {rating !== null && (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => setRating(null)}
                        className="text-slate-500 underline underline-offset-2 hover:text-slate-800 dark:hover:text-slate-200"
                    >
                        Clear rating
                    </button>
                )}
            </div>
        </fieldset>
    );
}
