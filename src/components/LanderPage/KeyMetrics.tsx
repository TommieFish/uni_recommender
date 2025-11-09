"use client"

import React from "react";
import {motion, useInView} from "framer-motion";

//id used to order, value is title, label is subtitle, description is paragraph text
const metrics =
[
    {
        id: 1,
        value:"120+",
        label : "universities available",
        description : "Enough choices that as long as you have some passing grades, you can find a university"
    },
    {
        id: 2,
        value: '15',
        label: 'Courses currently available',
    },
    {
        id : 3,
        value : '13',
        label : 'Questions to base recommendations off'
    },
    {
        id : 4,
        value: '15 Seconds',
        label : 'Average time taken to get a recommendation list',
    }
];

export function KeyMetrics()
{
    const ref = React.useRef<HTMLElement>(null); //persistance reference that survives re-renders
    const inView = useInView(ref, {once:true});

    return (
        <motion.section
            ref={ref}
            initial={{ opacity:0, y : 50}}
            animate={inView ? {opacity : 1, y:0} : {}}
            transition={{ duration: 0.6}}
            className="text-white dark:text-gray-200 container mx-auto px-4"
            >
            <motion.h2
                initial={{ opacity:0, y : 20}}
                animate={inView ? {opacity : 1, y:0} : {opacity:0, y: 20}}
                transition={{ duration: 0.6, delay : 0.2}}
                className = "text-white dark:text-gray-200 text-center font-bold text-6xl"
                >KEY METRICS
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" //1 -> 3 columns
                >{metrics.map((metric, index) => (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity:0, y : 20}}
                        animate={inView ? {opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                        transition={{ duration: 0.6, delay : 0.4 + (index * 0.1)}}
                        className="flex flex-col"
                    >
                        {/*Header */}
                        <motion.h3
                            initial={{scale : 0.5}}
                            animate={inView ? {scale : 1} : {scale : 0.5}}
                            transition={{ duration: 0.6, delay : 0.6 + (index * 0.1), type:"spring"}}
                            className= "text-purple-500 dark:text-purple-300 mb-2 font-bold text-5xl"
                            >{metric.value}
                            </motion.h3>

                        {/*subheading*/}
                        <motion.p
                            initial={{ opacity:0}}
                            animate={inView ? {opacity: 1} : { opacity: 0}}
                            transition={{ duration: 0.6, delay : 0.8 + (index * 0.1)}}
                            className="text-gray-400 dark:text-white font-semibold text-xl mb-2"
                        >{metric.label}
                        </motion.p>

                        
                        {/*paragraph*/}
                        {metric.description && (
                        <motion.p
                            initial={{ opacity:0}}
                            animate={inView ? {opacity: 1} : { opacity: 0}}
                            transition={{ duration: 0.6, delay : 1.0 + (index * 0.1)}}
                            className="text-gray-300 dark:text-gray-500"
                        >{metric.description}
                        </motion.p>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )

}