"use client"

import {useAuth} from "@/providers/AuthProvider";
import {useState} from "react";
import AddMediaModal from "@/components/modals/AddMediaModal";

export default function HomePage() {
    const {profile} = useAuth();
    const [showWishListModal, setShowWishListModal] = useState(false);
    const [showInProgressModal, setShowInProgressModal] = useState(false)

    const handleAddMedia = (modal:string) => {
        if(modal === "wishList"){
            setShowWishListModal(true)
        }else{
            setShowInProgressModal(true)
        }
    }


    return(
        <div>
            <h1>{profile?.displayName} dashboard</h1>
            <div>
                <button onClick={() => handleAddMedia("wishList")}>
                    Add to wishlist
                </button>
                <button>
                    Add review
                </button>
                <button onClick={() => handleAddMedia("inProgress")}>
                    Add to in progress
                </button>
            </div>
            <div>
                <h2>In Progress:</h2>
            </div>
            <div>
                <h2>Wishlist:</h2>
                <p>Movies:</p>
                <p>TV Shows:</p>
                <p>Games:</p>
                <p>Books:</p>
            </div>
            <div>
                <h2>Completed:</h2>
                <p>Movies:</p>
                <p>TV Shows:</p>
                <p>Games:</p>
                <p>Books:</p>
            </div>
            <div>
                <h2>Average rating</h2>
                <p>Movies:</p>
                <p>TV Shows:</p>
                <p>Games:</p>
                <p>Books:</p>
            </div>
            {
              showWishListModal ? <AddMediaModal status="wishList" setShowModal={setShowWishListModal} /> :
              showInProgressModal ? <AddMediaModal status="inProgress" setShowModal={setShowInProgressModal} /> :
              null
            }
        </div>
    )
}