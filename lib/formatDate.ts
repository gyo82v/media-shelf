import type { MediaItemType } from "@/types";

export function formatDate(timestamp: MediaItemType["createdAt"] | null | undefined){
    if (!timestamp) return "Not available";

    return timestamp.toDate().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}