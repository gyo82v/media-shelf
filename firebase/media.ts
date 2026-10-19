import { collection, getDocs, query, where, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore"
import { db } from "./firebase"
import type { MediaItemType, ReviewProfile, ReviewScore, GameProduction } from "@/types"

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
    reviewProfile: ReviewProfile;
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
    });
}