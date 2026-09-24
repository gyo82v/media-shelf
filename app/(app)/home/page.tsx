"use client"

import {useAuth} from "@/providers/AuthProvider";

export default function HomePage() {
    const {profile} = useAuth();
    return(
        <div>
            <h1>{profile?.displayName} dashboard</h1>
            <div>
                <button>
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