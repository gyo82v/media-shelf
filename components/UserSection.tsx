"use client"
import type {UserProfile} from "@/types"
import {useAuth} from "@/providers/AuthProvider";
import {useRouter} from "next/navigation";

export default function UserSection({profile}: {profile: UserProfile}){
    console.log("UserSection profile:", profile)
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
        <section>
            <p>{profile.displayName}</p>
            <div>
                <button onClick={handleSignOut}>
                    sign out
                </button>
            </div>
        </section>
    )

}