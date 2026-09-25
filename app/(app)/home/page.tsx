"use client"

import {useAuth} from "@/providers/AuthProvider";
import {useState} from "react";

export default function HomePage() {
    const {profile} = useAuth();
    const [showModale, setShowModale] = useState(false);

    const handleAddToWishList = () => {
        setShowModale(true);
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
        </div>
    )
}