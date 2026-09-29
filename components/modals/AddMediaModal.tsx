import Modal from "./Modal"
import AddMediaForm from "./AddMediaForm"

type Props = {
    status: "inProgress" | "wishList"
    setShowModal: (value:boolean) => void
}

export default function AddMediaModal({status, setShowModal}:Props){
    return(
        <Modal>
            <h2>Add to {status}</h2>
            <AddMediaForm status={status} setShowModal={setShowModal} />
        </Modal>
    )
}