"use client"

import { getMediaBySlug } from "@/firebase/media";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";
import type { MediaItemType } from "@/types";

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

            console.log("item:", item);

            setMediaItem(item);
        };

        loadMedia();
    }, [profile?.uid, params]);

    return (
        <div>
            <h1>{mediaItem?.name || "Media Item"}</h1>
        </div>
    );
}