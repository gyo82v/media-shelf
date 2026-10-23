"use client";

import { getMediaBySlug } from "@/firebase/media";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import type { MediaItemType } from "@/types";
import BackButton from "@/components/ui/BackButton";
import MediaItemCard from "@/components/MediaItemCard";
import TvShowSeasonsSection from "@/components/TvShowSeasonsSection";
import {
    tvShowProfileConfigs,
    type TvShowReviewProfileKey,
} from "@/config/tvShowProfile";

export default function MediaItemPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [mediaItem, setMediaItem] = useState<MediaItemType | null>(null);
    const { profile } = useAuth();

    const tvShowReviewProfile: TvShowReviewProfileKey | "" =
    mediaItem?.type === "tvShow" &&
    mediaItem.reviewProfile &&
    Object.prototype.hasOwnProperty.call(
        tvShowProfileConfigs,
        mediaItem.reviewProfile
    )
        ? (mediaItem.reviewProfile as TvShowReviewProfileKey)
        : "";

    useEffect(() => {
        if (!profile?.uid) return;

        const loadMedia = async () => {
            const { slug } = await params;
            const item = await getMediaBySlug(profile.uid, slug);

            setMediaItem(item);
        };

        loadMedia();
    }, [profile?.uid, params]);

    return (
    <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
        <BackButton />

        <MediaItemCard mediaItem={mediaItem} />

        {mediaItem?.type === "tvShow" && (
            <TvShowSeasonsSection
                key={mediaItem.id}
                mediaId={mediaItem.id}
                reviewProfile={tvShowReviewProfile}
            />
        )}
    </main>
);
}


/*

"use client";

import { getMediaBySlug } from "@/firebase/media";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import type { MediaItemType } from "@/types";
import BackButton from "@/components/ui/BackButton";
import MediaItemCard from "@/components/MediaItemCard";
import TvShowSeasonsSection from "@/components/TvShowSeasonsSection";

export default function MediaItemPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [mediaItem, setMediaItem] = useState<MediaItemType | null>(null);
    const { profile } = useAuth();

    useEffect(() => {
        if (!profile?.uid) return;

        const loadMedia = async () => {
            const { slug } = await params;
            const item = await getMediaBySlug(profile.uid, slug);

            setMediaItem(item);
        };

        loadMedia();
    }, [profile?.uid, params]);

    return (
        <main className="mx-auto w-full max-w-6xl p-4 md:p-6">
            <BackButton />
            <MediaItemCard mediaItem={mediaItem} />
        </main>
    );
}




*/