"use client"

import {Menu, X,User, EllipsisVertical} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {Button } from "./ui/button";
import {useEffect, useState, useRef} from "react";
import {getSupabase } from "@/lib/supabase/client";
import {logout } from "@/app/actions";
import profile from "../assets/logo.png"
import { CreateRecommendationButton } from "./CreateRecommendationButton";
import {useRole} from "@/hooks/user-current-role"

export const DesktopNavigationItems=
[
    {title: "Home", href:"/"},
    {title: "About", href:"/about"},
    {title: "Create", href:"true"},
    {title: "Profile", href:"/profile"},
]

export const MobileNavigationItems =
[
    {title: "Home", href:"/"},
    {title: "About", href:"/about"},
    {title: "Create", href:"true",},
    {title: "Edit Profile", href: "/editprofile/MyAccount"},
]

export default function GlassmorphNavbar()
{
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDotsMenuOpen, setIsDotsMenuOpen] = useState(false);
    
    const supabase = getSupabase();
    const dotsRef = useRef<HTMLDivElement>(null) //will now persist through all renders
    const role = useRole();
    const isAdmin = role === "admin";


    useEffect(() => {
        async function checkSession ()
        {
            const {data: session} = await supabase.auth.getUser() //get user is more secure (checks database for JWT)and returns the same
            setIsLoggedIn(!!session); //needs to convert to bool (session can be null or an object)
        };
        checkSession(); //needs to be a function as uses async

        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) =>{setIsLoggedIn(!!session)});
        
        return () => {listener?.subscription.unsubscribe()};

    }, [supabase]);

    //close dropdown when click off
    useEffect(() => {
        function handleClickOutside(event: MouseEvent)
        {
            if (dotsRef.current && !dotsRef.current.contains(event.target as Node))
            {
                setIsDotsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <nav className="fixed left-1/2 top-0 z-50 mt-7 w-11/12 max-w-7xl -translate-x-1/2 rounded-full bg-background/40 p-3 sm:p-2 backdrop-blur-lg shadow-lg">
            <div className="flex items-center justify-between w-full">

                {/* logo*/}
                <Link 
                    href="/">
                    <Image
                        src={profile}
                        alt="UniRecommender Logo"
                        width={50}
                        height={50}
                        className="rounded-full hover:bg-green-500"
                    />
                </Link>

                {/*desktop navbar*/}
                <div className="hidden md:flex items-center gap-4">
                    {isAdmin && (
                        <Link 
                            href="/admin">
                            <button
                                className= "rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                                >Admin
                            </button>
                        </Link>
                    )}


                    {DesktopNavigationItems.map((item, index) => (
                        item.href === "true" ? (<CreateRecommendationButton key={`create=${index}`} classNameInput="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-white text-gray-500" text="Create"/>) : 
                        (
                            <Link
                                key={item.href}
                                href={item.href}>
                                <Button
                                    variant="ghost"
                                    className="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-white text-gray-500"
                                    >{item.title}
                                </Button>
                            </Link>
                        )
                    ))}

                    {isLoggedIn ? 
                    (
                        <form action={logout}>
                            <button
                                type="submit"
                                className= "rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                                >Logout
                                </button>
                        </form>
                    ) : 
                    (
                        <Link 
                            href="/auth/signin">
                            <button
                                className= "rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                                >Login
                            </button>
                        </Link>
                    )}


                    {/*dropdown*/}
                    <div className="relative" ref={dotsRef}>
                        <button
                            onClick={() => setIsDotsMenuOpen((prev) => !prev)}
                            className="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                            > <EllipsisVertical size={22}/>
                        </button>

                        {isDotsMenuOpen && (
                            <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-background/80 backdrop-blur-md shadow-md border border-white/20 p-2">
                                <Link
                                    href="/editprofile/MyAccount"
                                    onClick={() => setIsDotsMenuOpen(false)}
                                    className= "block rounded-md px-3 py-2 text-sm text-center hover:bg-green-500 hover:text-white transitio-colors dark:text-gray-300 text-gray-400"
                                    >Edit Profile
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/*mobile - all in dropdown*/}
                <div className = "flex items-center md:hidden gap-3">
                    <Link
                        href="/profile">
                        <Button
                            variant="ghost"
                            className="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                            ><User size={22}/>
                        </Button>
                    </Link>

                    <button
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                        className="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                        >{isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                </div>
            </div>

            {/*dropdown*/}
            {isMenuOpen &&
            ( 
                <div className= "absolute top-full right-3 mt-3 w-40 rounded-2xl bg-background/80 backdrop-blur-md shadow-md border border-white/20 p-3 md:hidden">
                    <div className="flex flex-col gap-2 text-center">
                        {MobileNavigationItems.map((item) => (
                            item.href === "true" ? (<CreateRecommendationButton key={item.href} classNameInput="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500" text="Create" />) : 
                            (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-white dark:text-gray-300 text-gray-500"
                                    >{item.title}
                                </Link>
                            )
                        ))}

                        {isLoggedIn ? 
                            (
                                <form action={logout}>
                                    <button
                                        type="submit"
                                        onClick={() => setIsMenuOpen(false)}
                                        className= "rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-gray-300 dark:text-white text-gray-500"
                                        >Logout
                                    </button>
                                </form>
                            ) : 
                            (
                                <Link
                                    href="/auth/signin"
                                    onClick={() => setIsMenuOpen(false)}
                                    className= "rounded-full px-4 py-2 transition-colors hover:bg-green-500 hover:text-gray-300 dark:text-white text-gray-500"
                                    >Login
                                </Link>
                            )}
                        
                    </div>
                </div>
            )}
        </nav>
    )
}
