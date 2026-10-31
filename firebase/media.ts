import { collection, getDocs, query, where, doc, getDoc, updateDoc, serverTimestamp, addDoc, deleteField, orderBy, runTransaction, deleteDoc, writeBatch } from "firebase/firestore"
import { db } from "./firebase"
import type { MediaItemType, ReviewScore, GameProduction, MediaReviewProfile, TvShowEpisode, TvShowSeason, TvShowSeriesStatus, UpdateMediaData} from "@/types"
import type { TvShowReviewProfileKey } from "@/config/tvShowProfile";
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
    reviewProfile: MediaReviewProfile;
    production?: GameProduction;
    reviewScore: ReviewScore;
    starRating: number;
    markCompleted?: boolean;
};

export async function saveMediaReview(
    uid: string,
    mediaId: string,
    data: SaveMediaReviewInput
): Promise<void> {
    const mediaRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId
    );

    await updateDoc(mediaRef, {
        reviewProfile: data.reviewProfile,
        ...(data.production
            ? { production: data.production }
            : {}),
        starRating: data.starRating,
        reviewScore: data.reviewScore,
        updatedAt: serverTimestamp(),
        ...(data.markCompleted === false
            ? {}
            : { status: "completed" }),
    });
}

export async function saveTvShowReviewProfile(
    uid: string,
    mediaId: string,
    reviewProfile: TvShowReviewProfileKey
): Promise<void> {
    const mediaRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId
    );

    const snapshot = await getDoc(mediaRef);

    if (
        !snapshot.exists() ||
        snapshot.data().type !== "tvShow"
    ) {
        throw new Error("TV show not found.");
    }

    await updateDoc(mediaRef, {
        reviewProfile,
        updatedAt: serverTimestamp(),
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
        seriesStatus?: TvShowSeriesStatus;
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

        ...(media.type === "tvShow" && media.seriesStatus
        ? { seriesStatus: media.seriesStatus }: {}),

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

const MAX_EPISODES_PER_OPERATION = 100;

function getSeasonId(seasonNumber: number) {
    return `season-${String(seasonNumber).padStart(2, "0")}`;
}

function getEpisodeId(episodeNumber: number) {
    return `episode-${String(episodeNumber).padStart(2, "0")}`;
}

////////////validation function//////////////
function validatePositiveInteger(value: number, label: string) {
    if (!Number.isInteger(value) || value < 1) {
        throw new RangeError(
            `${label} must be a positive whole number.`
        );
    }
}

function validateEpisodeCount(count: number, allowZero = false) {
    const minimum = allowZero ? 0 : 1;

    if (
        !Number.isInteger(count) ||
        count < minimum ||
        count > MAX_EPISODES_PER_OPERATION
    ) {
        throw new RangeError(
            `Episode count must be between ${minimum} and ${MAX_EPISODES_PER_OPERATION}.`
        );
    }
}

function validateStarRating(rating: number) {
    if (
        !Number.isFinite(rating) ||
        rating < 0 ||
        rating > 10 ||
        !Number.isInteger(rating * 2)
    ) {
        throw new RangeError(
            "The rating must be between 0 and 10 in 0.5 increments."
        );
    }
}

///Retrieve all seasons

export async function getTvShowSeasons(
    uid: string,
    mediaId: string
): Promise<TvShowSeason[]> {
    const seasonsRef = collection(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons"
    );

    const q = query(seasonsRef, orderBy("number", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((seasonDoc) => {
        const data = seasonDoc.data();

        return {
            id: seasonDoc.id,
            number: data.number,
            episodeCount: data.episodeCount ?? 0,
            starRating: data.starRating ?? null,
            ...(data.reviewScore
                ? { reviewScore: data.reviewScore as ReviewScore }
                : {}),
        };
    });
}

///Create a season and its initial episodes;

export async function createTvShowSeason(
    uid: string,
    mediaId: string,
    seasonNumber: number,
    episodeCount: number
): Promise<TvShowSeason> {
    validatePositiveInteger(seasonNumber, "Season number");
    validateEpisodeCount(episodeCount, true);

    const mediaRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId
    );

    const seasonId = getSeasonId(seasonNumber);

    const seasonRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId
    );

    await runTransaction(db, async (transaction) => {
        const [mediaSnapshot, seasonSnapshot] = await Promise.all([
            transaction.get(mediaRef),
            transaction.get(seasonRef),
        ]);

        if (!mediaSnapshot.exists()) {
            throw new Error("TV show not found.");
        }

        if (mediaSnapshot.data().type !== "tvShow") {
            throw new Error("This media item is not a TV show.");
        }

        if (seasonSnapshot.exists()) {
            throw new Error(
                `Season ${seasonNumber} already exists.`
            );
        }

        transaction.set(seasonRef, {
            number: seasonNumber,
            episodeCount,
            starRating: null,
        });

        for (
            let episodeNumber = 1;
            episodeNumber <= episodeCount;
            episodeNumber++
        ) {
            const episodeRef = doc(
                db,
                "users",
                uid,
                "media",
                mediaId,
                "seasons",
                seasonId,
                "episodes",
                getEpisodeId(episodeNumber)
            );

            transaction.set(episodeRef, {
                number: episodeNumber,
                starRating: null,
            });
        }
    });

    return {
        id: seasonId,
        number: seasonNumber,
        episodeCount,
        starRating: null,
    };
}

///Retireve a season episodes;

export async function getTvShowEpisodes(
    uid: string,
    mediaId: string,
    seasonId: string
): Promise<TvShowEpisode[]> {
    const seasonRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId
    );

    const seasonSnapshot = await getDoc(seasonRef);

    if (!seasonSnapshot.exists()) {
        throw new Error("Season not found.");
    }

    const episodesRef = collection(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId,
        "episodes"
    );

    const q = query(episodesRef, orderBy("number", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((episodeDoc) => {
        const data = episodeDoc.data();

        return {
            id: episodeDoc.id,
            number: data.number,
            starRating: data.starRating ?? null,
        };
    });
}

///add extra episodes to an existing season


export async function addTvShowEpisodes(
    uid: string,
    mediaId: string,
    seasonId: string,
    additionalEpisodeCount: number
): Promise<void> {
    validateEpisodeCount(additionalEpisodeCount);

    const mediaRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId
    );

    const seasonRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId
    );

    await runTransaction(db, async (transaction) => {
        const [mediaSnapshot, seasonSnapshot] = await Promise.all([
            transaction.get(mediaRef),
            transaction.get(seasonRef),
        ]);

        if (!mediaSnapshot.exists() ||
            mediaSnapshot.data().type !== "tvShow") {
            throw new Error("TV show not found.");
        }

        if (!seasonSnapshot.exists()) {
            throw new Error("Season not found.");
        }

        const currentCount =
            seasonSnapshot.data().episodeCount ?? 0;

        if (
            !Number.isInteger(currentCount) ||
            currentCount < 0
        ) {
            throw new Error(
                "The stored episode count is invalid."
            );
        }

        const nextCount = currentCount + additionalEpisodeCount;

        for (
            let episodeNumber = currentCount + 1;
            episodeNumber <= nextCount;
            episodeNumber++
        ) {
            const episodeRef = doc(
                db,
                "users",
                uid,
                "media",
                mediaId,
                "seasons",
                seasonId,
                "episodes",
                getEpisodeId(episodeNumber)
            );

            transaction.set(episodeRef, {
                number: episodeNumber,
                starRating: null,
            });
        }

        transaction.update(seasonRef, {
            episodeCount: nextCount,
        });
    });
}

///Save a season detailed review;

export async function saveTvShowSeasonReview(
    uid: string,
    mediaId: string,
    seasonId: string,
    data: {
        starRating: number;
        reviewScore: ReviewScore;
    }
): Promise<void> {
    validateStarRating(data.starRating);

    const seasonRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId
    );

    await updateDoc(seasonRef, {
        starRating: data.starRating,
        reviewScore: data.reviewScore,
    });
}

///Save an episode star rating;

export async function saveTvShowEpisodeRating(
    uid: string,
    mediaId: string,
    seasonId: string,
    episodeId: string,
    starRating: number
): Promise<void> {
    validateStarRating(starRating);

    const episodeRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId,
        "seasons",
        seasonId,
        "episodes",
        episodeId
    );

    await updateDoc(episodeRef, {
        starRating,
    });
}


///Update the tvShow status "ongoing" | "ended";

export async function updateTvShowSeriesStatus(
    uid: string,
    mediaId: string,
    seriesStatus: TvShowSeriesStatus | null
): Promise<void> {
    const media = await getMediaById(uid, mediaId);

    if (!media || media.type !== "tvShow") {
        throw new Error("TV show not found.");
    }

    const mediaRef = doc(
        db,
        "users",
        uid,
        "media",
        mediaId
    );

    await updateDoc(mediaRef, {
        seriesStatus:
            seriesStatus === null
                ? deleteField()
                : seriesStatus,
        updatedAt: serverTimestamp(),
    });
}

import type { DashboardStats } from "@/types"

export async function getDashboardStats(uid: string): Promise<DashboardStats> {

    const mediaRef = collection(db, "users", uid, "media")
    const snapshot = await getDocs(mediaRef)

    const stats: DashboardStats = {
        total: snapshot.size,
        inProgress: {
            total: 0,
            movies: 0,
            tvShows: 0,
            games: 0,
            books: 0
        },
        wishList: {
            total: 0,
            movies: 0,
            tvShows: 0,
            games: 0,
            books: 0
        },
        completed: {
            total: 0,
            movies: 0,
            tvShows: 0,
            games: 0,
            books: 0
        }
    }

    snapshot.forEach((doc) => {
        const media = doc.data() as MediaItemType

        const status = media.status
        const type = media.type

        if (!(status in stats)) return

        stats[status].total++

        switch (type) {
            case "movie":
                stats[status].movies++
                break
            case "tvShow":
                stats[status].tvShows++
                break
            case "game":
                stats[status].games++
                break
            case "book":
                stats[status].books++
                break
        }
    })

    return stats
}

export async function deleteMedia(
    uid: string,
    mediaId: string,
    mediaType: MediaItemType["type"]
): Promise<void> {

    const mediaRef = doc(db, "users", uid, "media", mediaId)

    // Movies, books and games
    if (mediaType !== "tvShow") {
        await deleteDoc(mediaRef)
        return
    }

    // TV Shows: retrieve all seasons
    const seasonsSnapshot = await getDocs(
        collection(mediaRef, "seasons")
    )

    const refsToDelete: Array<typeof mediaRef> = []

    // Retrieve episodes and collect all document references
    for (const seasonDoc of seasonsSnapshot.docs) {

        const episodesSnapshot = await getDocs(
            collection(seasonDoc.ref, "episodes")
        )

        // Add episode documents first
        for (const episodeDoc of episodesSnapshot.docs) {
            refsToDelete.push(episodeDoc.ref)
        }

        // Then add the season document
        refsToDelete.push(seasonDoc.ref)
    }

    // Delete the TV Show document last
    refsToDelete.push(mediaRef)

    // Delete in batches of maximum 500 documents
    for (let i = 0; i < refsToDelete.length; i += 500) {

        const batch = writeBatch(db)

        refsToDelete
            .slice(i, i + 500)
            .forEach(ref => batch.delete(ref))

        await batch.commit()
    }
}

export async function updateMedia(
    uid: string,
    mediaId: string,
    updatedData: UpdateMediaData
): Promise<void> {

    const mediaRef = doc(db, "users", uid, "media", mediaId)

    await runTransaction(db, async (transaction) => {

        const mediaSnapshot = await transaction.get(mediaRef)

        if (!mediaSnapshot.exists()) {
            throw new Error("Media item not found.")
        }

        const currentMedia = mediaSnapshot.data() as MediaItemType

        const hasStatusChanged = currentMedia.status !== updatedData.status
        const hasNameChanged = currentMedia.name !== updatedData.name

        const changes = {
            name: updatedData.name,
            genre: updatedData.genre,
            status: updatedData.status,

            country: updatedData.country,
            year: updatedData.year ?? "",
            description: updatedData.description,
            notes: updatedData.notes,

            updatedAt: serverTimestamp(),

            ...(hasNameChanged
                ? {
                    slug: `${createSlug(updatedData.name)}-${currentMedia.type}`
                }
                : {}),

            ...(hasStatusChanged
                ? updatedData.status === "wishList"
                    ? {
                        startedAt: null,
                        finishedAt: null
                    }
                    : updatedData.status === "inProgress"
                        ? {
                            startedAt: currentMedia.startedAt ?? serverTimestamp(),
                            finishedAt: null
                        }
                        : {
                            startedAt: currentMedia.startedAt ?? serverTimestamp(),
                            finishedAt: serverTimestamp()
                        }
                : {})
        }

        transaction.update(mediaRef, changes)
    })
}