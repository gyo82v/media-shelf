"use client"
import type {UserProfile} from "@/types"
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";
import { FiLogOut } from "react-icons/fi"
import { transitions, hoverPrimary, activePress } from "@/styles";

export default function UserSection({profile}: {profile: UserProfile}){
    const {signOut} = useAuth();
    const router = useRouter()
    const handleSignOut = async () => {
        try{
            await signOut();
            router.replace("/sign-in")
        }catch(err){
            console.error("Sign out failed", err)
        }
    }
    return(
        <button
          className={`flex gap-2 items-center justify-center
                      border border-slate-700 rounded-xl p-2
                      ${transitions} ${hoverPrimary} ${activePress} `}
          onClick={handleSignOut}
        >
            {profile.displayName}
            <FiLogOut className="h-5 w-5" />
        </button>
    )
}