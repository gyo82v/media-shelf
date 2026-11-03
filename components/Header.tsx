"use client"

import Navbar from "./Navbar";
import {useAuth} from "@/providers/AuthProvider";
import UserSection from "./UserSection";
import { FiLayers } from "react-icons/fi";

export default function Header(){
    const {user, profile} = useAuth();
    return(
        <header className="flex justify-between items-center p-4 border-b border-gray-300">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center size-9 rounded-lg bg-teal-700 text-white">
                <FiLayers size={21} />
              </div>
              <div className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                Media <span className="font-medium text-slate-500 dark:text-slate-400">Shelf</span>
              </div>
            </div>
            {user && <Navbar navItems={["home", "media","in-progress","wishlist"]}/>}
            {user && profile && <UserSection profile={profile} />}
        </header>
    )
}