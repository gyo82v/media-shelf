import Modal from "./Modal"
import { FiX } from "react-icons/fi";
import AddMedia from "../AddMedia";

type Props = {
    setShowModal: (value: boolean) => void;
    onAddAndReview: (mediaId: string) => void;
};

export default function AddMediaModal({setShowModal, onAddAndReview}:Props){
    return(
        <Modal>
            <div>
                <h2 className="text-lg font-bold mb-4">Add Media</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={25} />
                </button>
            </div>
            <AddMedia setShowModal={setShowModal} onAddAndReview={onAddAndReview} />
        </Modal>
    )
}