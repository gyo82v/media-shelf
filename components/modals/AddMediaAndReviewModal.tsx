import Modal from "./Modal"
import AddMediaAndReviewForm from "./AddMediaAndReviewForm"

type Props = {
    setShowModal: (value:boolean) => void
}

export default function AddMediaAndReviewModal({setShowModal}:Props){

    return(
        <Modal>
            <h2 className="text-lg font-bold">Add media and review</h2>
            <AddMediaAndReviewForm setShowModal={setShowModal} />
        </Modal>
    )
}