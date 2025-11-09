"use client"

import {motion} from "framer-motion";

export function Contact()
{
    return (
        <section
            id ="Contact"
            className="text-white dark:text-gray-400 py-32 max-w-full sm:max-w-[640px] md:max-w-[768px] lg:max-w-[1024px] xl:max-w-[1200px] mx-auto px-4">
                <motion.div
                    initial={{ opacity:0, y :20}}
                    whileInView= {{ opacity : 1, y : 0}}
                    transition= {{duration : 1.2}}
                    viewport = {{once : true, amount : 0.5}}
                    className="grid gap-8 sm:gap-12 lg:gap-16 lg:grid-cols-2"
                    >
                    <div className = "space-y-12">
                        <motion.h2
                            initial={{ opacity:0, y :-20}}
                            whileInView= {{ opacity : 1, y : 0}}
                            transition= {{duration : 0.8, delay :0.4}}
                            className="text-4xl sm:text-5xl lg:text-6xl text-gray-300 font-bold">Get in <span className="text-gray-500">touch</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity:0, y :20}}
                            whileInView= {{ opacity : 1, y : 0}}
                            transition= {{duration : 0.8, delay : 0.4}}
                            className= "glass p-8 rounded-2xl space-y-8"
                            >
                                {/*phone */}
                                <div className= "space-y-2">
                                    <p className="text-gray-300 text-lg">Phone</p>
                                    <a
                                        //href="tel:+447858942113"
                                        className = "flex items-center gap-2 text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-400 hover:text-gray-500 transition"
                                        >Phone Currently Unavailable.<span className="text-gray-500">📞</span>
                                    </a>
                                </div>

                                {/* mail */}
                                <div className= "space-y-2">
                                    <p className="text-gray-300 text-lg">Email</p>
                                    <a
                                        href="mailto:support@unirecommender.uk"
                                        className = "flex items-center gap-2 text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-400 hover:text-gray-500 transition"
                                        >support@unirecommender.uk<span className="text-gray-500">📧</span>
                                    </a>
                                </div>
                        </motion.div>
                    </div>
                    <motion.div
                        initial={{ opacity:0, x :20}}
                        whileInView= {{ opacity : 1, x : 0}}
                        transition= {{duration : 0.8, delay : 0.8}}
                        className ="hidden lg:block w-full h-full min-h-[400px] rounded-2xl overflow-hidden">
                    </motion.div>
                </motion.div>
        </section>
    )
}