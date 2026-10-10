import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import {createSlug} from "@/lib/createSlug"

export async function addMedia(
    uid: string,
    media: {
        name: string;
        type: "movie" | "book" | "game" | "tvShow";
        status: "inProgress" | "wishList" | "completed";
        genre: string;
        reviewProfile: string;
        country?: string;
        year?: number | null
        description?: string;
        notes?: string;
        production?: "indie" | "studio"
    }
) {
   
    const mediaRef = collection(db, "users", uid, "media");
    const slug = `${createSlug(media.name)}-${media.type}`;

    const docRef = await addDoc(mediaRef, {
        name: media.name,
        type: media.type,
        status: media.status,
        slug: slug,

        genre: media.genre,
        reviewProfile: media.reviewProfile,

        country: media.country ?? "",
        year: media.year ?? "",
        description: media.description ?? "",
        notes: media.notes ?? "",
        production: media.production ?? "",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),

        startedAt: media.status === "inProgress"
            ? serverTimestamp()
            : null,

        finishedAt: null,

        image: "",

        starRating: null,

        reviewScore: {
            criteria: {},
        },
    });

    return docRef.id;
}