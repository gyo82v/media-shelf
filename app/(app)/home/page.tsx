"use client"

import {useAuth} from "@/providers/AuthProvider";
import {useState} from "react";
import { SmallDivider } from "@/components/ui/Dividers";
import AddMediaModal from "@/components/modals/AddMediaModal";
import AddMediaAndReviewModal from "@/components/modals/AddMediaAndReviewModal";
import Button from "@/components/ui/Button";

export default function HomePage() {
    const {profile} = useAuth();
    const [showWishListModal, setShowWishListModal] = useState(false);
    const [showInProgressModal, setShowInProgressModal] = useState(false)
    const [showAddReviewModal, setShowAddReviewModal] = useState(false)

    return(
        <div className="flex flex-col gap-4 mt-10 p-4">
            <h1 className="text-xl font-bold mb-4">{profile?.displayName} dashboard</h1>
            <div className="flex gap-6 ">
                <Button onClick={() => setShowWishListModal(true)}>
                    Add to wishlist
                </Button>
                <Button onClick={() => setShowInProgressModal(true)}>
                    Add to in progress
                </Button>
                <Button onClick={() => setShowAddReviewModal(true)}>
                    Add review
                </Button>
            </div>
            <SmallDivider />
            <div className={`flex justify-center  `}>
                <div className=" w-full">
                    <h2 className="text-lg font-semibold">In Progress:</h2>
                    <p>Movies:</p>
                    <p>TV Shows:</p>
                    <p>Games:</p>
                    <p>Books:</p>
                </div>
                <div className=" w-full">
                    <h2 className="text-lg font-semibold">Wishlist:</h2>
                    <p>Movies:</p>
                    <p>TV Shows:</p>
                    <p>Games:</p>
                    <p>Books:</p>
                </div>
                <div className=" w-full">
                    <h2 className="text-lg font-semibold">Completed:</h2>
                    <p>Movies:</p>
                    <p>TV Shows:</p>
                    <p>Games:</p>
                    <p>Books:</p>
                </div>
            </div>
            <SmallDivider />
            <div >
                <h2 className="text-lg font-semibold">Average rating</h2>
                <p>Movies:</p>
                <p>TV Shows:</p>
                <p>Games:</p>
                <p>Books:</p>
            </div>
            {
              showWishListModal ? <AddMediaModal status="wishList" setShowModal={setShowWishListModal} /> :
              showInProgressModal ? <AddMediaModal status="inProgress" setShowModal={setShowInProgressModal} /> :
              showAddReviewModal ? <AddMediaAndReviewModal setShowModal={setShowAddReviewModal} /> :
              null
            }
        </div>
    )
}