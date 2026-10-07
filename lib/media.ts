import type { MediaItemType } from "@/types";

export function formatType(type: MediaItemType["type"]){
    switch (type) {
        case "movie":
            return "Movie";
        case "book":
            return "Book";
        case "game":
            return "Game";
        case "tvShow":
            return "TV Show";
        default:
            return "N/A";
    }
}

export function formatStatus(status: MediaItemType["status"]){
    switch (status) {
        case "completed":
            return "Completed";
        case "inProgress":
            return "In Progress";
        case "wishList":
            return "Wishlist";
        default:
            return "N/A";
    }
}