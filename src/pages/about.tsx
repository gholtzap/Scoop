import { AnimatePresence, motion } from "framer-motion";
import React from 'react';
import Image from 'next/image';
import Header from '../components/Header';

import DefaultHeadshot from '../../public/headshots/default_headshot.jpg'
import GavinHeadshot from '../../public/headshots/gavin_headshot.png'
import AbdullahHeadshot from '../../public/headshots/abdullah_headshot.png'

export default function About() {

    const teamMembers = [
        {
            name: 'Abdullah Abdullah',
            school: 'University of Waterloo',
            major: 'Computer Engineering',
            graduationDate: 'April 2025',
            image: AbdullahHeadshot,
            website: 'https://github.com/Abdullah9340'
        },
        {
            name: 'Gavin Holtzapple',
            school: 'Arizona State University',
            major: 'Computer Science',
            graduationDate: 'May 2025',
            image: GavinHeadshot,
            website: 'https://gholtzap.github.io/'
        },
        {
            name: 'Jason Lee',
            school: 'University of Texas at Austin',
            major: 'Computer Science',
            graduationDate: 'May 2025',
            image: DefaultHeadshot,
            website: 'https://github.com/jasonlee02'

        },
        {
            name: 'Matthew Pham',
            school: 'University of Texas at Dallas',
            major: 'Software Engineering',
            graduationDate: 'May 2025',
            image: DefaultHeadshot,
            website: 'https://github.com/matthewpham135'

        },
    ];

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
                        About Us
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.25,
                            duration: 0.95,
                            ease: [0.165, 0.84, 0.44, 1],
                        }}
                        className="text-[18px] leading-[26px] text-[#25D0AB] mb-8"
                    >
                        Our team is passionate about making a difference in the world. We participated in Robinhood's
                        Social Good hackathon with the aim of creating a platform that not only informs but also
                        connects communities during health crises. We believe in the power of information,
                        collaboration, and community-driven solutions.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            delay: 0.35,
                            duration: 0.95,
                            ease: [0.165, 0.84, 0.44, 1],
                        }}
                        className="flex flex-wrap gap-4 justify-center"
                    >
                        {teamMembers.map(member => (
                            <div key={member.name} className="flex flex-col items-center space-y-4">
                                <div className="w-32 h-32 rounded-full overflow-hidden">
                                    <Image src={member.image} alt={member.name} width={128} height={128} className="w-full h-full object-cover" />

                                </div>
                                <h2 className="text-[#95F3D9] text-3xl">
                                    {member.website ? (
                                        <a
                                            href={member.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:text-[#25D0AB] transition duration-200"
                                        >
                                            {member.name}
                                        </a>
                                    ) : (
                                        member.name
                                    )}
                                </h2>
                                <p className="text-[#25D0AB] text-2xl">{member.school}</p>
                                <p className="text-[#25D0AB]">Studying {member.major}</p>
                                <p className="text-[#25D0AB]">Graduating {member.graduationDate}</p>
                            </div>
                        ))}
                    </motion.div>
                </main>

                <div className="fixed top-0 right-0 w-[80%] md:w-1/2 h-screen bg-[#01453D]/20" style={{
                    clipPath: "polygon(100px 0,100% 0,calc(100% + 225px) 100%, 480px 100%)",
                }}>
                </div>
            </div>
        </AnimatePresence>
    )
}
