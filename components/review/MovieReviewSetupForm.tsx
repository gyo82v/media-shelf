"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import FormSelect from "@/components/ui/form/FormSelect";

import {
    movieProfileConfigs,
    type MovieReviewProfileKey,
} from "@/config/movieProfile";

type Props = {
    initialReviewProfile: MovieReviewProfileKey | "";
    onContinue: (profile: MovieReviewProfileKey) => void;
    onCancel: () => void;
};

const availableProfiles = Object.keys(
    movieProfileConfigs
) as MovieReviewProfileKey[];

export default function MovieReviewSetupForm({
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
                profileValue as MovieReviewProfileKey
            )
        ) {
            setError(
                "Please select an available review profile."
            );
            return;
        }

        onContinue(
            profileValue as MovieReviewProfileKey
        );
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the scoring profile for this movie.
            </p>

            {initialReviewProfile ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                        Review Profile
                    </p>

                    <p>
                        {
                            movieProfileConfigs[
                                initialReviewProfile
                            ].label
                        }
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
                            label: movieProfileConfigs[
                                profile
                            ].label,
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