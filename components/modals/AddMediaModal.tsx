import Modal from "./Modal"
import AddMediaForm from "./AddMediaForm"
import { FiX } from "react-icons/fi";

type Props = {
    status: "inProgress" | "wishList"
    setShowModal: (value:boolean) => void
}

export default function AddMediaModal({status, setShowModal}:Props){
    return(
        <Modal>
            <div>
                <h2 className="text-lg font-bold">Add to {status}</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                  <FiX size={25} />
                </button>

            </div>
            <AddMediaForm status={status} setShowModal={setShowModal} />
        </Modal>
    )
}