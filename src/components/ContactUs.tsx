"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { Github, Linkedin, Mail, Phone } from "lucide-react";

interface ContactLink {
  label: string;
  value: string;
  href: string;
  Icon: React.ComponentType<{ className?: string }>;
}
const contactLinks: ContactLink[] = [
  {
    label: "GitHub",
    value: "SuhasKanwar",
    href: "https://github.com/SuhasKanwar",
    Icon: Github,
  },
  {
    label: "LinkedIn",
    value: "Profile",
    href: "https://www.linkedin.com/in/suhas-kanwar-4a3a09291/",
    Icon: Linkedin,
  },
  {
    label: "Email",
    value: "suhas.kanwar@gmail.com",
    href: "mailto:suhas.kanwar@gmail.com",
    Icon: Mail,
  },
  {
    label: "Phone",
    value: "+91 9650164357",
    href: "tel:+919650164357",
    Icon: Phone,
  },
];

export default function ContactUs() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <motion.section
      id="contact"
      ref={sectionRef}
      className="w-[80vw] mx-auto mb-32"
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ duration: 0.75, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <motion.div
        className="relative rounded-3xl overflow-hidden"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={
          isInView ? { scale: 1, opacity: 1 } : { scale: 0.97, opacity: 0 }
        }
        transition={{ duration: 0.7, delay: 0.1 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(99,102,241,0.18),transparent_60%),radial-gradient(circle_at_80%_70%,rgba(236,72,153,0.16),transparent_65%)] pointer-events-none" />
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            padding: 1,
            background:
              "linear-gradient(140deg,rgba(255,255,255,0.16),rgba(255,255,255,0.04) 35%,rgba(99,102,241,0.32) 65%,rgba(168,85,247,0.25))",
            WebkitMask:
              "linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
        <div className="relative backdrop-blur-xl bg-black/55 border border-white/10 rounded-3xl p-10 md:p-14">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-5"
            >
              Contact
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="text-neutral-300 text-sm md:text-base leading-relaxed mb-12"
            >
              Reach out through any preferred channel below.
            </motion.p>
          </div>

          <motion.div
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.08, delayChildren: 0.3 },
              },
            }}
            className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto"
          >
            {contactLinks.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                variants={{
                  hidden: { opacity: 0, y: 26 },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.55, ease: [0.25, 0.4, 0.25, 1] },
                  },
                }}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-6 py-6 flex items-center gap-5 backdrop-blur-sm transition-colors hover:border-indigo-400/50"
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center border border-white/10 group-hover:from-indigo-500/40 group-hover:to-purple-500/40 transition">
                    <item.Icon className="w-6 h-6 text-indigo-200" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase tracking-wide text-neutral-400 font-semibold">
                    {item.label}
                  </span>
                  <span className="text-sm md:text-base font-medium text-white group-hover:text-indigo-200 transition break-all">
                    {item.value}
                  </span>
                </div>
                <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-500 bg-gradient-to-br from-indigo-500/10 via-transparent to-pink-500/10" />
              </motion.a>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.section>
  );
}