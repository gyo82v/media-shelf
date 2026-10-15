
"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import FormSelect from "@/components/ui/form/FormSelect";

import type {GameProduction, ReviewProfile} from "@/types";

type Props = {
    initialReviewProfile: ReviewProfile | "";
    initialProduction: GameProduction | "";
    availableProfiles: ReviewProfile[];
    onContinue: (
        profile: ReviewProfile,
        production: GameProduction
    ) => void;
    onCancel: () => void;
};

export default function ReviewSetupForm({
    initialReviewProfile,
    initialProduction,
    availableProfiles,
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

        const productionValue =
            initialProduction ||
            formData.get("production")?.toString() ||
            "";

        if (
            !availableProfiles.includes(
                profileValue as ReviewProfile
            )
        ) {
            setError(
                "Please select an available review profile."
            );
            return;
        }

        if (
            productionValue !== "indie" &&
            productionValue !== "studio"
        ) {
            setError("Please select a production type.");
            return;
        }

        onContinue(
            profileValue as ReviewProfile,
            productionValue as GameProduction
        );
    };

    return (
        <form
            className="flex flex-col gap-4"
            onSubmit={handleSubmit}
        >
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Choose the scoring profile and production type
                for this game.
            </p>

            {initialReviewProfile ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                        Review Profile
                    </p>
                    <p>{initialReviewProfile}</p>
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
                    options={availableProfiles.map((profile) => ({
                        value: profile,
                        label: profile,
                    }))}
                />
            )}

            {initialProduction ? (
                <div className="flex flex-col gap-1">
                    <p className="text-sm font-medium">
                        Production
                    </p>
                    <p>
                        {initialProduction === "indie"
                            ? "Indie"
                            : "Studio"}
                    </p>
                    <input
                        type="hidden"
                        name="production"
                        value={initialProduction}
                    />
                </div>
            ) : (
                <FormSelect
                    name="production"
                    label="Production"
                    placeholder="Select production type"
                    options={[
                        { value: "indie", label: "Indie" },
                        { value: "studio", label: "Studio" },
                    ]}
                />
            )}

            {error && (
                <p role="alert" className="text-sm text-red-600">
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
