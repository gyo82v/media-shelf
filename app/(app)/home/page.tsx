"use client"

import {useAuth} from "@/providers/AuthProvider";
import {useState} from "react";
import WishListForm from "@/components/modals/WishListForm";

export default function HomePage() {
    const {profile} = useAuth();
    const [showModal, setShowModal] = useState(false);

    const handleAddToWishList = () => {
        setShowModal(true);
    }


    return(
        <div>
            <h1>{profile?.displayName} dashboard</h1>
            <div>
                <button onClick={handleAddToWishList}>
                    Add to wishlist
                </button>
                <button>
                    Add review
                </button>
                <button>
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
            {showModal && <WishListForm setShowModal={setShowModal} />}
        </div>
    )
}