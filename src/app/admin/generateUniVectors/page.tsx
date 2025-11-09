"use client"

import {useEffect, useState } from "react";
import {motion, AnimatePresence} from "framer-motion";
import {toast } from "sonner";

export default function GenerateUniVectors()
{
  const[name, setName] = useState("");
  const[submitted, setSubmitted] = useState(false);
  const[vectorFinished,setVectorFinished] = useState(false);
  const[ timeLeft, setTimeLeft] = useState(0);
  const[timeElapsed, setTimeElapsed] = useState(0);
  const[estimatedTimeLeft, setEstimatedTimeLeft] = useState(30000);

  useEffect(() => {
    if (!submitted)
    {
      return;
    }

    const start = performance.now() //uses performance of API for better UI - real time feedback from API
    const timer = setInterval(() => {
      setTimeElapsed(performance.now() - start);
    }, 1000); //check every second

    fetch("/api/generate-university-vector", {method: 'POST', headers: {"Content-Type":"application/json"}})
      .then(async (res) => {
        const end = performance.now();
        const duration = end - start;
        const result = await res.json();

        if (!res.ok)
        {
          if (res.status === 404)
          {
            toast.error("No eligible unis found. Hence, no vectors created");
          }
          else
          {
            toast.error(`Error:  ${result.error || "Unknown error occurred!"}`);
          }
        }

        console.log(`Uni creation finished in ${duration.toFixed(1)}ms. You may exit the page.`);
        setEstimatedTimeLeft(duration); //continuously set time left dependant on performance
        setTimeElapsed(duration);
        clearInterval(timer);

        //Wait 2 secs for smootheness
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setVectorFinished(true);
      })
      .catch((error : any) => {
        console.warn("Uni creation error:", error);
        clearInterval(timer)
        setVectorFinished(true);
      });

      return () => clearInterval(timer); //stops component running after api call finished
  }, [submitted])  

  useEffect(() => {
    if (!submitted)
    {
      return;
    }
    setTimeLeft(Math.max(0, estimatedTimeLeft - timeElapsed))
  }, [timeElapsed, estimatedTimeLeft,submitted]);

  return (
    <div className="relative z-[1]">
      <div className = "flex items-center justify-center min-h-screen">
        <motion.div
          initial = {{opacity: 0, y:20}}
          animate={{opacity: 1, y:0}}
          transition={{duration: 0.6}}
          className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center"
          >
            {!submitted ? (
              <>
                <h1 className="text-l text-gray-800 font-semibold mb-4">Click to start generating uni vectors</h1>
                <button
                  onClick={() =>{setSubmitted(true)}}
                  className="text-white bg-blue-600 hover:bg-blue-700 transition-colors px-4 py-2 rounded-md">Start
                </button>
              </>
            ) : (
              <>
                <AnimatePresence> {/*allows exit animations*/}
                  <motion.h1
                    key="final-message"
                    initial={{ opacity: 0, scale :0.95}}
                    animate={{opacity:1, y: 0}}
                    exit={{ opacity: 0}}
                    transition={{duration : 0.5}}
                    className="text-xl text-gray-800 font-semibold mb-6"
                  >Creating uni vectors.
                  </motion.h1>
                </AnimatePresence>

                <>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: `0%`}}
                      animate={{width: `${Math.min((timeElapsed / estimatedTimeLeft) * 100, 100)}%`}} // complete bar to animate
                      transition={{duration : 0.5}}
                      className="h-full rounded-full bg-blue-500">
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0}}
                    animate={{opacity:1}}
                    transition={{delay : 0.8}}
                    className ="text-gray-500 text-sm mt-4"
                    >{vectorFinished ? "Uni creation finished! You may exit the page." : `Estimated time left: ~${Math.max(Math.ceil((estimatedTimeLeft - timeElapsed)/1000), 0)} seconds`} {/* converts to seconds and rounds up*/}
                  </motion.p>
                </>
              </>
            )}
          </motion.div>
      </div>
    </div>
  )
}