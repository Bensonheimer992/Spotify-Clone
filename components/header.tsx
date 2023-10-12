"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx"
import { HiHome } from "react-icons/hi"
import { BiSearch } from "react-icons/bi"
import Button from "./button";
import useAuthModal from "@/hooks/useauthmodal";
import AuthModal from "./authmodal";

import { FaUserAlt } from "react-icons/fa";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from "react-hot-toast";
import { useUser } from "@/hooks/useuser";
import usePlayer from "@/hooks/useplayer";

interface HeaderProps {
    children: React.ReactNode;
    className?: string;
  }

const Header: React.FC<HeaderProps> = ({
    children,
    className,
}) => {
    const authModal = useAuthModal();
    const router = useRouter();
    const player = usePlayer();

    const supabaseClient = useSupabaseClient();
    const { user } = useUser();

    const handleLogout = async () => {
        const { error } = await supabaseClient.auth.signOut();
        player.reset();
        router.refresh();
    
        if (error) {
          toast.error(error.message);
        } else {
            toast.success("Logged out!")
        }
    }
    
    const onClick = () => {

    }

    return ( 
        <div
         className={twMerge(`
          h-fit 
          bg-gradient-to-b 
          from-emerald-800 
          p-6
          `,
          className
        )}>
            <div className="w-full mb-4 flex items-center justify-between">
                <div className="hidden md:flex gap-x-2 items-center">
                    <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretLeft className="text-white" size={35}/>
                    </button>
                    <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition">
                        <RxCaretRight className="text-white" size={35}/>
                    </button>
                </div>
                <div className="flex md:hidden gap-x-2 items-center">
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition" onClick={() => router.push(`/`)}>
                        <HiHome className="text-black" size={20} />
                    </button>
                    <button className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition" onClick={() => router.push(`/search`)}>
                        <BiSearch className="text-black" size={20} />
                    </button>
                </div>
                <div className="flex justify-between items-center gap-x-4">
                    {user ? (
                        <div className="flex gap-x-4 items-center">
                            <Button onClick={handleLogout} className="bg-white px-6 py-2">
                                Logout
                            </Button>
                            <Button onClick={() => router.push(`/account`)} className="bg-white">
                                <FaUserAlt />
                            </Button>
                        </div>
                    ): (
                        <>
                            <div>
                                <Button className="bg-transparent text-neutral-300 font-medium" onClick={authModal.onOpen}>
                                    Sign Up
                                </Button> 
                            </div>
                            <div>
                                <Button className="bg-white px-6 py-2" onClick={authModal.onOpen}>
                                    Login
                                </Button> 
                            </div>
                        </>
                    )}
                </div>
            </div>
            {children}
        </div>
     );
}

 
export default Header;