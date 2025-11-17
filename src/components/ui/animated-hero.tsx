// /components/ui/animated-hero.tsx

import { useEffect, useMemo, useState } from "react";

import { motion } from "framer-motion";



function Hero() {

  const [titleNumber, setTitleNumber] = useState(0);

  const titles = useMemo(

    () => ["CALL", "LEAD", "MESSAGE", "FOLLOW-UP"],

    []

  );



  useEffect(() => {

    const timeoutId = setTimeout(() => {

      if (titleNumber === titles.length - 1) {

        setTitleNumber(0);

      } else {

        setTitleNumber(titleNumber + 1);

      }

    }, 2000);

    return () => clearTimeout(timeoutId);

  }, [titleNumber, titles]);



  return (

    <div className="w-full">

      <div className="container mx-auto">

        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">

          <div className="flex gap-4 flex-col">

            <h1 className="text-3xl md:text-5xl lg:text-6xl max-w-2xl tracking-tighter text-center font-bold text-text-main flex items-center justify-center flex-wrap gap-2 -ml-4 md:-ml-8">

              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.2, ease: "easeOut" }}
              >
                NEVER
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.3, ease: "easeOut" }}
              >
                MISS
              </motion.span>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.625, delay: 0.4, ease: "easeOut" }}
              >
                A
              </motion.span>

              <span className="relative inline-flex items-center justify-start overflow-hidden min-w-[220px] md:min-w-[320px] h-[1.2em]">

                {titles.map((title, index) => (

                  <motion.span

                    key={index}

                    className="absolute text-3xl md:text-5xl lg:text-6xl font-bold text-blue-600 whitespace-nowrap"

                    initial={{ opacity: 0, y: "-100" }}

                    transition={{ type: "spring", stiffness: 50 }}

                    animate={

                      titleNumber === index

                        ? {

                            y: 0,

                            opacity: 1,

                          }

                        : {

                            y: titleNumber > index ? -150 : 150,

                            opacity: 0,

                          }

                    }

                  >

                    {title}

                  </motion.span>

                ))}

              </span>

            </h1>

          </div>

        </div>

      </div>

    </div>

  );

}



export { Hero };
