import Modal from "./Modal"
import { FiX } from "react-icons/fi"

import UpdateMedia from "../UpdateMedia"
import type { MediaItemType } from "@/types"

type Props = {
    mediaItem: MediaItemType
    setShowModal: (value: boolean) => void
    onUpdated: (slug: string) => void
}

export default function UpdateMediaModal({
    mediaItem,
    setShowModal,
    onUpdated
}: Props) {

    return (
        <Modal>
            <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-bold">
                    Update Media
                </h2>

                <button
                    type="button"
                    aria-label="Close update media modal"
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 transition-colors hover:text-gray-800 dark:hover:text-gray-200"
                >
                    <FiX size={25} />
                </button>

            </div>

            <UpdateMedia
                mediaItem={mediaItem}
                setShowModal={setShowModal}
                onUpdated={onUpdated}
            />

        </Modal>
    )
}