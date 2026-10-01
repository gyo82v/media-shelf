import Modal from "./Modal"
import AddMediaAndReviewForm from "./AddMediaAndReviewForm"
import { FiX } from "react-icons/fi";

type Props = {
    setShowModal: (value:boolean) => void
}

export default function AddMediaAndReviewModal({setShowModal}:Props){

    return(
        <Modal>
            <div>
                <h2 className="text-lg font-bold">Add media and review</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <FiX size={25} />
                </button>
            </div>
            <AddMediaAndReviewForm setShowModal={setShowModal} />
        </Modal>
    )
}