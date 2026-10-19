
"use client";

import { useEffect, useRef, useState } from "react";

// Adjust this import to match your existing StarRating component.
import StarRating from "@/components/StarRating";

type Props = {
    name?: string;
    defaultValue?: number | null;
    disabled?: boolean;
    required?: boolean;
};

const ratings = Array.from(
    { length: 21 },
    (_, index) => index / 2
);

function isValidRating(
    value: number | null | undefined
): value is number {
    return (
        typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 10 &&
        Number.isInteger(value * 2)
    );
}

function formatRating(value: number) {
    return `${value} / 10`;
}

export default function StarRatingInput({
    name = "starRating",
    defaultValue = null,
    disabled = false,
    required = true,
}: Props) {
    const initialRating = isValidRating(defaultValue)
        ? defaultValue
        : null;

    const [rating, setRating] = useState<number | null>(
        initialRating
    );

    const [isOpen, setIsOpen] = useState(false);

    const [activeIndex, setActiveIndex] = useState(
        initialRating === null
            ? 0
            : ratings.indexOf(initialRating)
    );

    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

    // Keep the initial selection in sync if a different saved rating
    // is loaded into this component.
    useEffect(() => {
        const nextRating = isValidRating(defaultValue)
            ? defaultValue
            : null;

        setRating(nextRating);
        setActiveIndex(
            nextRating === null ? 0 : ratings.indexOf(nextRating)
        );
    }, [defaultValue]);

    // Move keyboard focus to the active option when the dropdown opens
    // or the user navigates between options.
    useEffect(() => {
        if (isOpen) {
            optionRefs.current[activeIndex]?.focus();
        }
    }, [isOpen, activeIndex]);

    // Close when clicking outside the dropdown.
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "pointerdown",
            handlePointerDown
        );

        return () => {
            document.removeEventListener(
                "pointerdown",
                handlePointerDown
            );
        };
    }, [isOpen]);

    const openDropdown = (direction: "first" | "last" | "selected") => {
        const selectedIndex =
            rating === null ? 0 : ratings.indexOf(rating);

        if (direction === "first") {
            setActiveIndex(0);
        } else if (direction === "last") {
            setActiveIndex(ratings.length - 1);
        } else {
            setActiveIndex(
                selectedIndex >= 0 ? selectedIndex : 0
            );
        }

        setIsOpen(true);
    };

    const selectRating = (value: number) => {
        setRating(value);
        setActiveIndex(ratings.indexOf(value));
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        if (disabled) return;

        if (!isOpen) {
            if (event.key === "ArrowDown") {
                event.preventDefault();
                openDropdown("selected");
            } else if (event.key === "ArrowUp") {
                event.preventDefault();
                openDropdown("selected");
            } else if (event.key === "Home") {
                event.preventDefault();
                openDropdown("first");
            } else if (event.key === "End") {
                event.preventDefault();
                openDropdown("last");
            }
        } else if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
        }
    };

    const handleOptionKeyDown = (
        event: React.KeyboardEvent<HTMLButtonElement>
    ) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();

            setActiveIndex((current) =>
                (current + 1) % ratings.length
            );
        } else if (event.key === "ArrowUp") {
            event.preventDefault();

            setActiveIndex((current) =>
                (current - 1 + ratings.length) % ratings.length
            );
        } else if (event.key === "Home") {
            event.preventDefault();
            setActiveIndex(0);
        } else if (event.key === "End") {
            event.preventDefault();
            setActiveIndex(ratings.length - 1);
        } else if (event.key === "Escape") {
            event.preventDefault();
            setIsOpen(false);
            triggerRef.current?.focus();
        } else if (event.key === "Tab") {
            setIsOpen(false);
        }
    };

    return (
        <fieldset
            disabled={disabled}
            className="flex min-w-0 flex-col gap-3"
        >
            <legend className="font-semibold text-slate-800 dark:text-slate-100">
                Overall Rating{required ? " *" : ""}
            </legend>

            <p className="text-sm text-slate-500 dark:text-slate-400">
                Your personal rating, independent of the detailed review.
            </p>

            <div
                ref={containerRef}
                className="relative w-full max-w-sm"
            >
                <button
                    ref={triggerRef}
                    type="button"
                    disabled={disabled}
                    aria-label={
                        rating === null
                            ? "Select overall rating"
                            : `Overall rating ${rating} out of 10`
                    }
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                    aria-controls={`${name}-options`}
                    aria-required={required}
                    onClick={() => {
                        if (isOpen) {
                            setIsOpen(false);
                        } else {
                            openDropdown("selected");
                        }
                    }}
                    onKeyDown={handleTriggerKeyDown}
                    className="
                        flex min-h-14 w-full items-center justify-between
                        gap-3 rounded-lg border border-slate-300
                        bg-white px-3 py-2 text-left
                        transition-colors
                        hover:border-teal-600
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-teal-600
                        disabled:cursor-not-allowed disabled:opacity-50
                        dark:border-slate-700 dark:bg-slate-900
                        dark:hover:border-teal-500
                    "
                >
                    {rating === null ? (
                        <span className="text-sm text-slate-500 dark:text-slate-400">
                            Select rating
                        </span>
                    ) : (
                        <span className="flex min-w-0 items-center gap-3">
                            <span aria-hidden="true">
                                <StarRating rating={rating} />
                            </span>

                            <span className="whitespace-nowrap font-medium tabular-nums text-slate-800 dark:text-slate-100">
                                {formatRating(rating)}
                            </span>
                        </span>
                    )}

                    <svg
                        aria-hidden="true"
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`h-5 w-5 shrink-0 text-slate-500 transition-transform ${
                            isOpen ? "rotate-180" : ""
                        }`}
                    >
                        <path
                            d="m5 7.5 5 5 5-5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>

                {isOpen && (
                    <div
                        id={`${name}-options`}
                        role="listbox"
                        aria-label="Available ratings"
                        aria-activedescendant={`${name}-option-${activeIndex}`}
                        className="
                            absolute left-0 top-full z-50 mt-2
                            max-h-64 w-full overflow-y-auto
                            rounded-lg border border-slate-200
                            bg-white p-1 shadow-lg
                            dark:border-slate-700 dark:bg-slate-900
                        "
                    >
                        {ratings.map((value, index) => {
                            const selected = rating === value;
                            const active = activeIndex === index;

                            return (
                                <button
                                    key={value}
                                    ref={(element) => {
                                        optionRefs.current[index] = element;
                                    }}
                                    id={`${name}-option-${index}`}
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    tabIndex={-1}
                                    onClick={() => selectRating(value)}
                                    onKeyDown={handleOptionKeyDown}
                                    onMouseEnter={() =>
                                        setActiveIndex(index)
                                    }
                                    className={`
                                        flex min-h-10 w-full items-center
                                        justify-between gap-3 rounded-md
                                        px-3 py-2 text-left text-sm
                                        transition-colors
                                        ${
                                            active
                                                ? "bg-teal-50 text-teal-900 dark:bg-teal-950 dark:text-teal-100"
                                                : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                        }
                                        ${
                                            selected
                                                ? "font-semibold"
                                                : ""
                                        }
                                    `}
                                >
                                    <span>{formatRating(value)}</span>

                                    {selected && (
                                        <span
                                            aria-hidden="true"
                                            className="text-teal-700 dark:text-teal-400"
                                        >
                                            ✓
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* The selected value is still submitted through FormData. */}
            <input
                type="hidden"
                name={name}
                value={rating === null ? "" : String(rating)}
            />

            <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose from 0 to 10 in increments of 0.5.
            </p>
        </fieldset>
    );
}



