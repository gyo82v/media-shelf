"use client"

import Navbar from "./Navbar";
import {useAuth} from "@/providers/AuthProvider";
import UserSection from "./UserSection";

export default function Header(){
    const {user, profile} = useAuth();
    return(
        <header className="flex justify-between items-center p-4 border-b border-gray-300">
            <div className="text-2xl font-bold">
                Media Shelf
            </div>
            {user && profile && <UserSection profile={profile} />}
            {user && <Navbar navItems={["home", "media", "wishlist"]}/>}
        </header>
    )
}