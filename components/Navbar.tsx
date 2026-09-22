"use client"

import {usePathname} from "next/navigation";
import  Link  from "next/link";

export default function Navbar({navItems}: {navItems: string[]}) {
    const pathname = usePathname();

    return(
        <nav>
            <ul>
                {navItems.map(i => {
                    const isActive = pathname === i || pathname.startsWith(`${i}/`);
                    return(
                        <li 
                          key={i} 
                          className={`
                            ${isActive ? "text-red-500" : ""}`}
                        >
                            <Link href={i}>{i}</Link>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}