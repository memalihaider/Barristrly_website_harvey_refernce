"use client";

import React from "react";
import { motion } from "framer-motion";

export type TestimonialItem = {
  text: string;
  image: string;
  name: string;
  role: string;
};

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-10 rounded-3xl border border-[#e5e3dc] bg-[#faf9f6]/95 shadow-lg shadow-black/5 max-w-xs w-full hover:border-primary/20 transition-all duration-300 select-none" 
                  key={i}
                >
                  <div className="text-gray-700 leading-relaxed text-sm">“{text}”</div>
                  <div className="flex items-center gap-2 mt-5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/20"
                    />
                    <div className="flex flex-col">
                      <div className="font-semibold text-ink text-sm tracking-tight leading-5">{name}</div>
                      <div className="text-xs leading-5 opacity-60 tracking-tight text-ink/75">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};
