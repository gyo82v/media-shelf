import { addDoc, collection, serverTimestamp, doc } from "firebase/firestore";
import { db } from "./firebase";

export async function addMedia(
    uid: string,
    media: {
        name: string;
        type: "movie" | "book" | "game" | "tvShow";
        status: "inProgress" | "wishList";
        genre: string;
        reviewProfile: string;
        country?: string;
        year?: string;
        description?: string;
        notes?: string;
    }
) {
   
    const mediaRef = collection(db, "users", uid, "media");

    const docRef = await addDoc(mediaRef, {
        name: media.name,
        type: media.type,
        status: media.status,

        genre: media.genre,
        reviewProfile: media.reviewProfile,

        country: media.country ?? "",
        year: media.year ?? "",
        description: media.description ?? "",
        notes: media.notes ?? "",

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