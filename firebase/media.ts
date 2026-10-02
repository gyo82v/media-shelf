import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import type { MediaItemType } from "@/types"

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