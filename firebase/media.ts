import { collection, getDocs, query, where, doc, getDoc, updateDoc, serverTimestamp, addDoc } from "firebase/firestore"
import { db } from "./firebase"
import type { MediaItemType, ReviewProfile, ReviewScore, GameProduction } from "@/types"
import type { MovieReviewProfileKey } from "@/config/movieProfile"
import type { BookReviewProfileKey } from "@/config/bookProfile";
import {createSlug} from "@/lib/createSlug"

export async function getMediaByStatus(
    uid: string,
    status: MediaItemType["status"]
): Promise<MediaItemType[]> {

    const mediaRef = collection(db, "users", uid, "media")

    const q = query(
        mediaRef,
        where("status", "==", status)
    )

    const snap = await getDocs(q)

    return snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as MediaItemType[]
}

export async function getMediaBySlug(
    uid: string,
    slug: string
): Promise<MediaItemType | null> {

    const mediaRef = collection(db, "users", uid, "media");

    const q = query(
        mediaRef,
        where("slug", "==", slug)
    );

    const snap = await getDocs(q);

    if (snap.empty) {
        return null;
    }

    const doc = snap.docs[0];

    return {
        id: doc.id,
        ...doc.data(),
    } as MediaItemType;
}

export async function getMediaById(
    uid: string,
    mediaId: string
): Promise<MediaItemType | null> {
    const mediaRef = doc(db, "users", uid, "media", mediaId);
    const snapshot = await getDoc(mediaRef);

    if (!snapshot.exists()) {
        return null;
    }

    return {
        ...snapshot.data(),
        id: snapshot.id,
    } as MediaItemType;
}


type SaveMediaReviewInput = {
    reviewProfile: ReviewProfile | MovieReviewProfileKey | BookReviewProfileKey
    production?: GameProduction;
    reviewScore: ReviewScore;
    starRating: number;
};


export async function saveMediaReview(
    uid: string,
    mediaId: string,
    data: SaveMediaReviewInput
): Promise<void> {
    const mediaRef = doc(db, "users", uid, "media", mediaId);

    await updateDoc(mediaRef, {
        reviewProfile: data.reviewProfile,
        ...(data.production
            ? { production: data.production }
            : {}),
        starRating: data.starRating,
        reviewScore: data.reviewScore,
        updatedAt: serverTimestamp(),
        status: "completed"
    });
}

export async function addMedia(
    uid: string,
    media: {
        name: string;
        type: "movie" | "book" | "game" | "tvShow";
        status: "inProgress" | "wishList" | "completed";
        genre: string;
        reviewProfile?: string;
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
            modifiers: {},
            baseScore: null,
            totalScore: null
        },
    });

    return docRef.id;
}