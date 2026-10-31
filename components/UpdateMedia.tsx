import { useState } from "react"

import { useAuth } from "@/providers/AuthProvider"
import { updateMedia } from "@/firebase/media"
import { createSlug } from "@/lib/createSlug"
import { formatType } from "@/lib/media"

import type { MediaItemType, UpdateMediaData } from "@/types"

import Button from "./ui/Button"
import Formfield from "./ui/form/FormField"
import FormTextArea from "./ui/form/FormTextArea"
import FormSelect from "./ui/form/FormSelect"
import { SmallDivider } from "./ui/Dividers"

type Props = {
    mediaItem: MediaItemType,
    setShowModal: (value: boolean) => void,
    onUpdated: (slug: string) => void
}

export default function UpdateMedia({
    mediaItem,
    setShowModal,
    onUpdated
}: Props) {

    const { profile } = useAuth()

    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!profile?.uid) {
            setError("No user profile found.")
            return
        }

        const formData = new FormData(e.currentTarget)

        const name = formData.get("title")?.toString().trim() ?? ""
        const genre = formData.get("genre")?.toString().trim() ?? ""
        const status = formData.get("status")?.toString() as MediaItemType["status"]
        const country = formData.get("country")?.toString().trim() ?? ""
        const yearString = formData.get("year")?.toString().trim() ?? ""
        const description = formData.get("description")?.toString() ?? ""
        const notes = formData.get("notes")?.toString() ?? ""

        const year = yearString ? Number(yearString) : null

        if (year !== null && !Number.isFinite(year)) {
            setError("Please enter a valid year.")
            return
        }

        const updatedData: UpdateMediaData = {
            name,
            genre,
            status,
            country,
            year,
            description,
            notes
        }

        setIsSaving(true)
        setError(null)

        try {

            await updateMedia(profile.uid, mediaItem.id, updatedData)

            const newSlug = `${createSlug(name)}-${mediaItem.type}`

            onUpdated(newSlug)
            setShowModal(false)

        } catch (err) {

            console.error("Failed to update media:", err)
            setError("Unable to update media. Please try again.")

        } finally {
            setIsSaving(false)
        }
    }

    return (
        <form
            className="flex flex-col gap-3"
            onSubmit={handleSubmit}
        >

            {/* Main information */}
            <div className="flex flex-col gap-3">

                <Formfield
                    name="title"
                    label="Title"
                    defaultValue={mediaItem.name}
                />

                <Formfield
                    name="genre"
                    label="Genre"
                    defaultValue={mediaItem.genre}
                />

                {/* Media type is read-only */}
                <div className="flex flex-col gap-1 w-full">
                    <label className="ml-2 text-lg">
                        Type:
                    </label>

                    <p className="rounded-lg border border-neutral-200 bg-neutral-100 px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                        {formatType(mediaItem.type)}
                    </p>
                </div>

                <FormSelect
                    name="status"
                    label="Status"
                    defaultValue={mediaItem.status}
                    options={[
                        { value: "wishList", label: "Wishlist" },
                        { value: "inProgress", label: "In Progress" },
                        { value: "completed", label: "Completed" }
                    ]}
                />

            </div>

            <SmallDivider className="my-7" />

            {/* Optional information */}
            <div className="flex flex-col gap-3">

                <p className="font-extralight uppercase">
                    Optional information
                </p>

                <Formfield
                    name="country"
                    label="Country"
                    required={false}
                    defaultValue={mediaItem.country ?? ""}
                />

                <Formfield
                    name="year"
                    label="Year"
                    required={false}
                    type="number"
                    defaultValue={mediaItem.year ?? ""}
                />

                <FormTextArea
                    name="description"
                    label="Description"
                    placeholder="Enter a brief description..."
                    defaultValue={mediaItem.description ?? ""}
                />

                <FormTextArea
                    name="notes"
                    label="Notes"
                    placeholder="Add any additional notes..."
                    defaultValue={mediaItem.notes ?? ""}
                />

            </div>

            <SmallDivider className="my-7" />

            {error && (
                <p role="alert" className="text-sm text-red-500">
                    {error}
                </p>
            )}

            {/* Actions */}
            <div className="flex w-full items-center justify-center gap-3">

                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    disabled={isSaving}
                    onClick={() => setShowModal(false)}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save changes"}
                </Button>

            </div>

        </form>
    )
}