import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import { useUser } from '../contexts/UserContext';

export default function Login() {
    const router = useRouter();
    const { setUser } = useUser();

    const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const [loginMessage, setLoginMessage] = useState<string | null>(null);

    const handleLoginChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setLoginData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    const handleLoginSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        console.log("Attempting to log in with data:", loginData); 
    
        try {
            const response = await fetch(`${SERVER_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });
    
            const data = await response.json();
    
            console.log("Server response:", data); 
    
            if (response.status === 200) {
                setLoginMessage("Success! Logging you in...");
                if (response.ok) {
                    const userEmail = data.email;
                    const userName = data.username;
                 
                    localStorage.setItem('currentUser', JSON.stringify({ email: userEmail, username: userName }));
                 
                    setUser({ email: userEmail, username: userName }); 
                    console.log("User state updated with:", { email: userEmail, username: userName });
                }
                 
                setUser({
                    username: data.username,
                    email: data.email
                });
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                setLoginMessage(data.message);
            }
        } catch (error) {
            console.error("Error during login:", error); 
            setLoginMessage("Error during login. Please try again.");
        }
    }
    

    return (
        <AnimatePresence>
            <Header />
            <div className="min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#2C2C2C] font-inter overflow-hidden">
                <svg className="fixed z-[1] w-full h-full opacity-[35%]">
                    <rect width="100%" height="100%" filter="url(#noise)"></rect>
                </svg>
                <main className="flex flex-col justify-center h-[90%] static md:fixed w-screen overflow-hidden grid-rows-[1fr_repeat(3,auto)_1fr] z-[100] pt-[30px] pb-[320px] px-4 md:px-20 md:py-0">

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.15,
                            duration: 0.95,
                            ease: [0.165, 0.84, 0.44, 1],
                        }}
                        className="relative md:ml-[-10px] md:mb-[37px] leading-snug font-extrabold text-[4vw] md:text-[50px] font-inter text-[#25D0AB] leading-[0.9] tracking-[-2px] z-[100]"
                    >
                        Welcome Back to Scoop!
                    </motion.h1>

                    <form onSubmit={handleLoginSubmit}>
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.15,
                                duration: 0.95,
                                ease: [0.165, 0.84, 0.44, 1],
                            }}
                            className="flex flex-col space-y-4 z-20 mx-0 mb-0 mt-8 md:mt-0 md:mb-[35px] max-w-2xl"
                        >
                            <input
                                type="email"
                                name="email"
                                value={loginData.email}
                                onChange={handleLoginChange}
                                placeholder="Email"
                                className="p-2 rounded bg-[#2C2C2C] text-[#25D0AB] border-[#25D0AB]"
                            />
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={handleLoginChange}
                                placeholder="Password"
                                className="p-2 rounded bg-[#2C2C2C] text-[#25D0AB] border-[#25D0AB]"
                            />
                            {loginMessage && (
                                <div className="text-center my-2 text-white">
                                    {loginMessage}
                                </div>
                            )}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                delay: 0.55,
                                duration: 0.55,
                                ease: [0.075, 0.82, 0.965, 1],
                            }}
                        >
                            <div className="flex items-center">
                                <button
                                    className="group rounded-full px-4 py-2 text-[13px] font-semibold transition-all flex items-center justify-center bg-[#01453D] text-[#25D0AB] active:scale-95 scale-100 duration-75 mr-4" 
                                    style={{
                                        boxShadow: "0 1px 1px #01453D, 0 1px 3px #01453D",
                                    }}
                                >
                                    Login
                                </button>

                                <div className="flex items-center">
                                    <p className="mr-2">Don't have an account?</p>

                                    <Link href="/register" className="text-[#25D0AB] hover:underline">
                                        Register
                                    </Link>
                                </div>
                            </div>


                        </motion.div>
                    </form>


                </main>
                <div className="fixed top-0 right-0 w-[80%] md:w-1/2 h-screen bg-[#01453D]/20" style={{
                    clipPath: "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)",
                }}>
                </div>
            </div>
        </AnimatePresence>
    )
}
