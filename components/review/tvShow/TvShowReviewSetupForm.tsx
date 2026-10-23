"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import FormSelect from "@/components/ui/form/FormSelect";

import {
    tvShowProfileConfigs,
    type TvShowReviewProfileKey,
} from "@/config/tvShowProfile";

type Props = {
    initialReviewProfile: TvShowReviewProfileKey | "";
    onContinue: (
        profile: TvShowReviewProfileKey
    ) => Promise<void> | void;
    onCancel: () => void;
    saving?: boolean;
};

const availableProfiles = Object.keys(
    tvShowProfileConfigs
) as TvShowReviewProfileKey[];

export default function TvShowReviewSetupForm({
    initialReviewProfile,
    onContinue,
    onCancel,
    saving = false
}: Props) {
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);

    const profileValue =
        initialReviewProfile ||
        formData.get("reviewProfile")?.toString() ||
        "";

    if (
        !availableProfiles.includes(
            profileValue as TvShowReviewProfileKey
        )
    ) {
        setError("Please select an available review profile.");
        return;
    }

    try {
        await onContinue(
            profileValue as TvShowReviewProfileKey
        );
    } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : "Failed to save the review setup."
        );
    }
};

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the scoring profile for this TV show.
                The same profile will be used for its seasons.
            </p>

            {initialReviewProfile ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                        Review Profile
                    </p>

                    <p>
                        {tvShowProfileConfigs[
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
                            label: tvShowProfileConfigs[
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
                <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Continue"}
                </Button>

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                    disabled={saving}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}