"use client"
import type {UserProfile} from "@/types"
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";
import { FiLogOut } from "react-icons/fi"

export default function UserSection({ profile }: { profile: UserProfile }) {

    const { signOut } = useAuth()
    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut()
            router.replace("/sign-in")
        } catch (err) {
            console.error("Sign out failed", err)
        }
    }

    return (
        <button
            type="button"
            onClick={handleSignOut}
            aria-label={`Sign out ${profile.displayName}`}
            className="
                group flex items-center gap-3
                rounded-full border border-neutral-200
                bg-white py-1.5 pl-4 pr-2
                text-sm font-medium text-neutral-700
                transition-all duration-200
                hover:border-neutral-300 hover:bg-neutral-50
                active:scale-[0.98]
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-neutral-400 focus-visible:ring-offset-2
                dark:border-neutral-800 dark:bg-neutral-900
                dark:text-neutral-200
                dark:hover:border-neutral-700 dark:hover:bg-neutral-800
                dark:focus-visible:ring-offset-neutral-950
            "
        >
            <span className="max-w-32 truncate">
                {profile.displayName}
            </span>

            <span className="
                flex h-8 w-8 items-center justify-center
                rounded-full bg-neutral-100
                text-neutral-500 transition-colors duration-200
                group-hover:bg-neutral-200 group-hover:text-neutral-800
                dark:bg-neutral-800 dark:text-neutral-400
                dark:group-hover:bg-neutral-700 dark:group-hover:text-neutral-100
            ">
                <FiLogOut className="h-4 w-4" />
            </span>
        </button>
    )
}