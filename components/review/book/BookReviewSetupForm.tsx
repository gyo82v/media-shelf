"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import FormSelect from "@/components/ui/form/FormSelect";

import {
    bookProfileConfigs,
    type BookReviewProfileKey,
} from "@/config/bookProfile";

type Props = {
    initialReviewProfile: BookReviewProfileKey | "";
    onContinue: (profile: BookReviewProfileKey) => void;
    onCancel: () => void;
};

const availableProfiles = Object.keys(
    bookProfileConfigs
) as BookReviewProfileKey[];

export default function BookReviewSetupForm({
    initialReviewProfile,
    onContinue,
    onCancel,
}: Props) {
    const [error, setError] = useState("");

    const handleSubmit = (
        e: React.SyntheticEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        const profileValue =
            initialReviewProfile ||
            formData.get("reviewProfile")?.toString() ||
            "";

        if (
            !availableProfiles.includes(
                profileValue as BookReviewProfileKey
            )
        ) {
            setError(
                "Please select an available review profile."
            );
            return;
        }

        onContinue(profileValue as BookReviewProfileKey);
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the scoring profile for this book.
            </p>

            {initialReviewProfile ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                        Review Profile
                    </p>

                    <p>
                        {bookProfileConfigs[
                            initialReviewProfile
                        ].label}
                    </p>

                    <input
                        type="hidden"
                        name="reviewProfile"
                        value={initialReviewProfile}
                    />
                </div>
            ) : (
                <FormSelect
                    name="reviewProfile"
                    label="Review Profile"
                    placeholder="Select review profile"
                    options={availableProfiles.map(
                        (profile) => ({
                            value: profile,
                            label: bookProfileConfigs[profile].label,
                        })
                    )}
                />
            )}

            {error && (
                <p
                    role="alert"
                    className="text-sm text-red-600"
                >
                    {error}
                </p>
            )}

            <div className="flex gap-3">
                <Button type="submit">
                    Continue
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}