"use client"

import Navbar from "./Navbar";
import {useAuth} from "@/providers/AuthProvider";

export default function Header(){
    const {user} = useAuth();
    return(
        <header className="flex justify-between items-center p-4 border-b border-gray-300">
            <div className="text-2xl font-bold">
                Media Shelf
            </div>
            <Navbar navItems={["home", "media", "wishlist"]}/>
        </header>
    )
}