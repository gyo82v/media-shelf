"use client"

import Navbar from "./Navbar";
import {useAuth} from "@/providers/AuthProvider";

export default function Header(){
    const {user} = useAuth();
    return(
        <header>
            <div>Media Shelf</div>
            {user && <Navbar navItems={["/home", "/media", "/wishlist"]}/>}
        </header>
    )
}