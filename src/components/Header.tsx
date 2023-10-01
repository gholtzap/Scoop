import React from 'react';
import Link from "next/link";
import { motion } from "framer-motion";

export default function Header() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                delay: 0.05,
                duration: 0.85,
                ease: [0.165, 0.84, 0.44, 1],
            }}
            className="fixed top-0 left-0 w-full bg-[#2C2C2C] z-[200] shadow-md py-10 px-4 md:px-20"

        >
            <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center space-x-2">
    <img src="./scoop_logo.svg" alt="Scoop Logo" />
    <span className="cursor-pointer font-extrabold text-[#25D0AB] text-4xl hover:text-[#95F3D9] transition duration-200">
        Scoop
    </span>
</Link>


                <div className="flex space-x-4">
                    <Link href="/dashboard">
                        <span className="cursor-pointer text-bold text-[#95F3D9] text-xl hover:text-[#25D0AB] transition duration-200">
                            Scoop
                        </span>
                    </Link>
                    <Link href="/about">
                        <span className="cursor-pointer text-[#95F3D9] text-xl hover:text-[#25D0AB] transition duration-200">
                            About
                        </span>
                    </Link>
                    <Link href="/register">
                        <span className="cursor-pointer text-[#95F3D9] text-xl hover:text-[#25D0AB] transition duration-200">
                            Register
                        </span>
                    </Link>
                    <Link href="/login">
                        <span className="cursor-pointer px-4 py-2 bg-[#25D0AB] text-xl text-[#2C2C2C] rounded hover:bg-[#95F3D9] transition duration-200">
                            Login
                        </span>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
