"use client"

import { useState, useEffect, useRef, ReactNode } from "react"
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion"
import { Shield, Trophy, ChevronDown, Facebook, Twitter, Linkedin, Code, Lock, Server, Sparkles } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import ParticleBackground from "@/components/particle-background"
import GlitchText from "@/components/glitch-text"
import CountdownTimer from "@/components/countdown-timer"
import HackerTerminal from "@/components/hacker-terminal"
import FloatingIcons from "@/components/floating-icons"
import TitanRevealSection from "@/components/titan-reveal-section"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Award ribbon component
const AwardRibbon = ({ text = "AWARD WINNING" }) => (
  <div className="absolute -top-3 -right-3 z-20 overflow-hidden w-32 h-32">
    <div className="absolute top-0 right-0 w-12 h-12 bg-red-600 rotate-45 transform origin-bottom-left"></div>
    <div className="absolute top-8 right-[-35px] bg-red-700 text-white text-xs font-bold py-1 px-10 rotate-45 shadow-lg">
      {text}
    </div>
  </div>
)

interface SectionTitleProps {
  children: ReactNode;
  className?: string;
}

// Animated section title component
const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8 }}
    className={`relative inline-block ${className}`}
  >
    <h2 className="text-3xl md:text-5xl font-bold relative z-10">{children}</h2>
    <motion.div
      className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-red-900/20 rounded-lg blur-xl"
      animate={{
        opacity: [0.5, 0.8, 0.5],
      }}
      transition={{
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
    <motion.div
      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent"
      animate={{
        opacity: [0.3, 1, 0.3],
        width: ["80%", "100%", "80%"],
        left: ["10%", "0%", "10%"],
      }}
      transition={{
        duration: 4,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
      }}
    />
  </motion.div>
)


interface AnimatedBackgroundSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

// Animated background section
const AnimatedBackgroundSection: React.FC<AnimatedBackgroundSectionProps> = ({ 
  children, 
  className = "", 
  id 
}) => {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })

  const brightness = useTransform(scrollYProgress, [0, 0.2, 0.5], [0.3, 0.8, 1])
  const y = useTransform(scrollYProgress, [0, 1], [0, -50])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1])

  return (
    <section id={id} ref={sectionRef} className={`relative py-20 overflow-hidden ${className}`}>
      <motion.div
        className="absolute inset-0 -z-10"
        style={{
          y,
          scale,
          filter: `brightness(${brightness})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black opacity-90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(139,0,0,0.2),transparent_70%)]" />
      </motion.div>
      {children}
    </section>
  )
}

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const mainRef = useRef(null)

  // Force scroll to top on initial load
  useEffect(() => {
    // Force scroll to top when component mounts
    window.scrollTo(0, 0)

    // Track scroll position for effects
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)

    // Simulate loading sequence
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 50)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [])

  // Scroll-triggered effects for back.png section
  const introSectionRef = useRef(null)
  const { scrollYProgress: introScrollProgress } = useScroll({
    target: introSectionRef,
    offset: ["start end", "end start"],
  })

  const backImageBrightness = useTransform(introScrollProgress, [0, 0.2, 0.4], [0.2, 0.9, 1.2])

  const backImageScale = useTransform(introScrollProgress, [0, 0.5, 1], [1, 1.05, 1.1])

  const backImageY = useTransform(introScrollProgress, [0, 1], [0, -50])

  // Scroll progress for main content
  const { scrollYProgress } = useScroll({ target: mainRef })
  const smoothProgress = useSpring(scrollYProgress, { damping: 20, stiffness: 100 })

  return (
    <main ref={mainRef} className="relative bg-black text-white overflow-hidden">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Floating Icons */}
      <FloatingIcons />

      {/* Progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900 z-50"
        style={{ scaleX: smoothProgress, transformOrigin: "0%" }}
      />

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center"
            exit={{
              opacity: 0,
              transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{
                opacity: 0,
                scale: 1.2,
                filter: "blur(10px)",
                transition: { duration: 0.5 },
              }}
              transition={{ duration: 0.5 }}
              className="relative w-32 h-32 mb-8"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="w-24 h-24 text-red-600" strokeWidth={1} />
              </div>
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 8,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <div className="w-full h-full rounded-full border-t-2 border-r-2 border-red-600 opacity-75"></div>
              </motion.div>
              <motion.div
                className="absolute inset-0"
                animate={{
                  rotate: -360,
                }}
                transition={{
                  duration: 12,
                  ease: "linear",
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                <div className="w-full h-full rounded-full border-b-2 border-l-2 border-red-400 opacity-50"></div>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "80%" }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-1 bg-gradient-to-r from-red-900 via-red-600 to-red-900 rounded-full mb-6 max-w-md"
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-red-600 text-xl"
            >
              <GlitchText text="INITIALIZING SECURITY BREACH PROTOCOL..." />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url('/titanInwall.png')`,
              filter: "brightness(0.5)",
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black"
            animate={{
              opacity: [0.9, 0.85, 0.9],
              background: [
                "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,1))",
                "linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,1))",
                "linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.6), rgba(0,0,0,1))",
              ],
            }}
            transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                "radial-gradient(circle at center, rgba(139,0,0,0.05) 0%, transparent 70%)",
                "radial-gradient(circle at center, rgba(139,0,0,0.15) 0%, transparent 70%)",
                "radial-gradient(circle at center, rgba(139,0,0,0.05) 0%, transparent 70%)",
              ],
            }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
          />
        </motion.div>

        <div className="container relative z-10 px-4 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="mb-6"
          >
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Logo with enhanced effects */}
              <div className="w-full h-full">
                <div className="relative right-[70px] h-56 w-56 inset-y-[-100px] flex items-center justify-center">
                  <motion.div
                    animate={{
                      filter: [
                        "drop-shadow(0 0 10px rgba(255,0,0,0.3))",
                        "drop-shadow(0 0 20px rgba(255,0,0,0.6))",
                        "drop-shadow(0 0 10px rgba(255,0,0,0.3))",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    className="relative w-full h-full"
                  >
                    <Image src="/logo.png" alt="Logo" fill className="opacity-60" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.0, duration: 0.8 }}
            className="relative"
          >
            <GlitchText
              text="ATTACK ON HAWIYAT"
              className="text-5xl md:text-7xl font-bold mb-4 tracking-wider"
              intensity={2}
            />
            <motion.p
              className="text-sm md:text-base text-gray-400 mb-2 tracking-widest"
              animate={{
                textShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 10px rgba(255,0,0,0.5)", "0 0 0px rgba(255,0,0,0)"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              アタック・オン・ハウィヤット
            </motion.p>

            
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.6, duration: 0.8 }}
            className=" bottom-10 left-0 right-0 flex justify-center"
          >
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                repeat: Number.POSITIVE_INFINITY,
              }}
            >
              <motion.div whileHover={{ scale: 1.2, color: "#ef4444" }} transition={{ duration: 0.2 }}>
                <ChevronDown className="w-10 h-10 text-red-600 cursor-pointer" />
              </motion.div>
            </motion.div>
          </motion.div>

              <Link
                href="http://estintal-estin-hack-talents-yq6jbn-df8f46-34-31-201-166.traefik.me/"
                >
  <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.3, duration: 0.8 }}
            className="mt-8"
          >
            <motion.div
              className="inline-block bg-gradient-to-r from-red-800 to-red-950 px-6 py-3 text-xl font-bold tracking-wider shadow-lg shadow-red-900/50 border border-red-700/30"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px 5px rgba(220,38,38,0.3)",
              }}
            >
              
              ESTIN TALENTS CTF
            </motion.div>
          </motion.div>

                </Link>

        
        
        </div>
      </section>

      {/* Introduction Section with enhanced back.png effects */}
      <section id="intro" ref={introSectionRef} className="relative py-20 bg-black">
        <div className="h-[100vh] w-full">
          <div className="container px-4 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto text-center mb-16"
            >
              <SectionTitle className="mb-10">THE CHALLENGE</SectionTitle>
              <p className="text-xl md:text-2xl leading-relaxed text-gray-300">
                Beyond these walls lies a world of <span className="text-red-600 font-bold">challenges</span>,{" "}
                <span className="text-red-600 font-bold">mysteries</span>, and{" "}
                <span className="text-red-600 font-bold">digital titans</span> waiting to be conquered. Organized by the{" "}
                <span className="text-red-600 font-bold">Rankiha Team</span>, the ESTIN Talents CTF is calling upon the
                bravest hackers to <span className="text-red-600 font-bold">unleash your hacking superpowers</span>. But
                let's be honest, you probably don't have what it takes.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="max-w-4xl mx-auto text-center mt-16"
            >
              <p className="text-xl md:text-2xl leading-relaxed text-gray-300">
                Our <span className="text-red-600 font-bold">Hawiyat Platform</span> isn't just another CTF environment.
                It's a digital fortress built from the ground up to challenge even the most elite hackers. We've
                engineered security measures that make Fort Knox look like a cardboard box. Think you can penetrate our
                defenses? <span className="text-red-600 font-bold">We're laughing already.</span>
              </p>
            </motion.div>
          </div>
        </div>

        <div className="relative h-[140vh] w-full overflow-hidden">
          <div className="absolute inset-0 z-0">
            <motion.div
              className="absolute inset-0"
              style={{
                y: backImageY,
                scale: backImageScale,
              }}
            >
              {/* Main background image with enhanced filter effects */}
              <div
                className="absolute h-full w-full inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/back.png')`,
                  filter: "brightness(0.6) contrast(1.3) ",
                }}
              />
              
            
            </motion.div>
          </div>
        </div>
      </section>

      {/* Titan Reveal Section */}
      <TitanRevealSection />

      {/* Hawiyat Platform Section */}
      <AnimatedBackgroundSection id="platform" className="bg-gradient-to-b from-black to-gray-950">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-16">
              <SectionTitle className="mb-4">
                <GlitchText text="THE HAWIYAT PLATFORM" intensity={1.5} className="inline-block" />
              </SectionTitle>
              <motion.p
                className="text-xl text-gray-400"
                animate={{
                  textShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 5px rgba(255,0,0,0.3)", "0 0 0px rgba(255,0,0,0)"],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
              >
                Where your hacking dreams go to die
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Server className="w-10 h-10 text-red-600" />,
                  title: "Impenetrable Infrastructure",
                  description:
                    "Our servers are fortified with security measures so advanced they make quantum encryption look like a child's toy. Good luck even finding a way in.",
                },
                {
                  icon: <Code className="w-10 h-10 text-red-600" />,
                  title: "Deceptive Codebase",
                  description:
                    "Every line of code is a potential trap. Our developers have hidden vulnerabilities so subtle that even they sometimes forget where they are.",
                },
                {
                  icon: <Lock className="w-10 h-10 text-red-600" />,
                  title: "Adaptive Defense Systems",
                  description:
                    "Our AI-powered security adapts to your attacks in real-time. The more you try, the harder it gets. It's like fighting a hydra with a toothpick.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{
                    y: -10,
                    boxShadow: "0 20px 25px -5px rgba(139, 0, 0, 0.2), 0 10px 10px -5px rgba(139, 0, 0, 0.1)",
                    transition: { duration: 0.2 },
                  }}
                  className="relative bg-gradient-to-br from-gray-900 to-black p-8 rounded-lg border border-red-900/20 shadow-xl shadow-red-900/10 overflow-hidden group"
                >
                  {/* Background glow effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-red-900/5 to-red-800/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    animate={{
                      background: [
                        "radial-gradient(circle at center, rgba(139,0,0,0.05) 0%, transparent 70%)",
                        "radial-gradient(circle at center, rgba(139,0,0,0.1) 0%, transparent 70%)",
                        "radial-gradient(circle at center, rgba(139,0,0,0.05) 0%, transparent 70%)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  />

                  {/* Icon with glow effect */}
                  <motion.div className="mb-4 relative" whileHover={{ scale: 1.1 }}>
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 0px 0px rgba(220,38,38,0)",
                          "0 0 20px 10px rgba(220,38,38,0.2)",
                          "0 0 0px 0px rgba(220,38,38,0)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                      className="absolute inset-0 rounded-full"
                    />
                    {feature.icon}
                  </motion.div>

                  <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>

                  {/* Corner accent */}
                  <motion.div
                    className="absolute -bottom-2 -right-2 w-12 h-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.2 }}
                  >
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-700/30 rounded-br-lg" />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-16 p-8 bg-gradient-to-br from-gray-900 to-black rounded-lg border border-red-900/20 shadow-xl relative overflow-hidden"
            >
              <AwardRibbon text="ELITE TECH" />

              {/* Terminal glow effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                    "inset 0 0 50px 10px rgba(139, 0, 0, 0.2)",
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              <HackerTerminal />
            </motion.div>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Countdown Section */}
      <AnimatedBackgroundSection id="countdown" className="bg-black">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border-red-900/50 shadow-xl shadow-red-900/20 relative">
              {/* Corner decorations */}
              <div className="absolute top-0 left-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-2 bg-red-700 transform -rotate-45 origin-top-left"></div>
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-2 bg-red-700 transform rotate-45 origin-top-right"></div>
              </div>

              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                    "inset 0 0 50px 10px rgba(139, 0, 0, 0.2)",
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="p-8 md:p-12 text-center">
                <motion.h3
                  className="text-xl md:text-2xl font-bold text-gray-400 mb-8 tracking-widest"
                  animate={{
                    textShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 10px rgba(255,0,0,0.5)", "0 0 0px rgba(255,0,0,0)"],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                >
                  TIME LEFT TO FAIL :
                </motion.h3>
                <CountdownTimer targetDate="2025-05-15T12:00:00Z" />
                <p className="text-gray-400 mt-8">May 15, 2025 at 12:00 PM UTC</p>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Prize Section */}
      <AnimatedBackgroundSection id="prize" className="bg-gradient-to-b from-black to-gray-950">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border-red-900/50 shadow-xl shadow-red-900/20 relative">
              <AwardRibbon text="PREMIUM PRIZE" />

              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                    "inset 0 0 50px 10px rgba(139, 0, 0, 0.2)",
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="p-8 md:p-12 text-center">
                <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Trophy className="w-12 h-12 text-red-600 mx-auto mb-6" />
                </motion.div>
                <motion.h3
                  className="text-2xl md:text-3xl font-bold text-red-600 mb-6 tracking-widest"
                  animate={{
                    textShadow: [
                      "0 0 10px rgba(220,38,38,0.3)",
                      "0 0 20px rgba(220,38,38,0.6)",
                      "0 0 10px rgba(220,38,38,0.3)",
                    ],
                  }}
                  transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                >
                  WIN A PRO GAMING MOUSE
                </motion.h3>
                <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                  Be the first to successfully crash our site and win a legendary gaming mouse with customizable RGB
                  lighting, precision optical sensor, and programmable buttons to elevate your gaming experience!
                  <span className="block mt-2 text-gray-400 italic">Not that we expect anyone to actually win it.</span>
                </p>
                <p className="text-sm text-gray-500 italic">Prizes sponsored by Hawiyat Enterprise</p>

                <div className="mt-8 relative">
                  <motion.div
                    className="w-full h-80 relative"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="/mouse.png"
                      alt="Gaming Mouse Prize"
                      width={400}
                      height={300}
                      className="mx-auto object-contain"
                    />
                    <motion.div
                      className="absolute inset-0 pointer-events-none"
                      animate={{
                        background: [
                          "radial-gradient(circle at center, rgba(255,0,0,0.1) 0%, transparent 50%)",
                          "radial-gradient(circle at center, rgba(255,0,0,0.3) 0%, transparent 70%)",
                          "radial-gradient(circle at center, rgba(255,0,0,0.1) 0%, transparent 50%)",
                        ],
                      }}
                      transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />

                    {/* Floating particles around the mouse */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full bg-red-500"
                        style={{
                          left: `${30 + Math.random() * 40}%`,
                          top: `${30 + Math.random() * 40}%`,
                          opacity: 0.4 + Math.random() * 0.3,
                        }}
                        animate={{
                          x: [0, Math.random() * 30 - 15, 0],
                          y: [0, Math.random() * 30 - 15, 0],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={{
                          duration: 3 + Math.random() * 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: Math.random() * 2,
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Rules Section */}
      <AnimatedBackgroundSection id="rules" className="bg-black">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border-red-900/50 shadow-xl shadow-red-900/20 relative">
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                    "inset 0 0 50px 10px rgba(139, 0, 0, 0.2)",
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="p-8 md:p-12">
                <div className="text-center mb-12">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Shield className="w-12 h-12 text-red-600 mx-auto mb-6" />
                  </motion.div>
                  <motion.h3
                    className="text-2xl md:text-3xl font-bold text-red-600 mb-4 tracking-widest"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(220,38,38,0.3)",
                        "0 0 20px rgba(220,38,38,0.6)",
                        "0 0 10px rgba(220,38,38,0.3)",
                      ],
                    }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                  >
                    CHALLENGE RULES
                  </motion.h3>
                  <p className="text-gray-400 italic">NOT THAT ANY OF YOU WILL GET FAR ENOUGH TO NEED THESE</p>
                </div>

                <ul className="space-y-6 max-w-2xl mx-auto">
                  {[
                    "Try (and inevitably fail) to find vulnerabilities in our bulletproof Hawiyat Platform",
                    "Document your pathetic attempts for our entertainment and future training materials",
                    'Email your so-called "proof" to m_aichour@estin.dz for us to laugh at during our coffee breaks',
                    "First legit submission wins - but let's be real, there probably won't be one in this century",
                    "Challenge ends when the first valid submission is confirmed (or when pigs fly, whichever comes first)",
                  ].map((rule, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start group"
                    >
                      <motion.span
                        className="text-red-600 mr-3 mt-1 transform origin-center"
                        animate={{ rotate: [0, 5, 0, -5, 0] }}
                        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, delay: index * 0.5 }}
                      >
                        ►
                      </motion.span>
                      <motion.span
                        className="text-gray-300 text-lg"
                        whileHover={{
                          color: "#ef4444",
                          x: 5,
                          transition: { duration: 0.2 },
                        }}
                      >
                        {rule}
                      </motion.span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Quote Section */}
      <AnimatedBackgroundSection id="quote" className="bg-gradient-to-b from-black to-gray-950">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden bg-gradient-to-br from-gray-900 to-black border-red-900/50 shadow-xl shadow-red-900/20 relative">
              <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{
                  boxShadow: [
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                    "inset 0 0 50px 10px rgba(139, 0, 0, 0.2)",
                    "inset 0 0 30px 5px rgba(139, 0, 0, 0.1)",
                  ],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              />

              <div className="p-8 md:p-12 text-center">
                <motion.p
                  className="text-xl md:text-2xl text-gray-300 italic leading-relaxed"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1 }}
                >
                  So you thought we were hiding behind Vercel's security? WRONG! We've rebuilt everything from zero with
                  our Hawiyat Platform - making Vercel and AWS look like child's play. Our security engineers laugh at
                  conventional protection measures. You don't stand a chance against our custom-built fortress.
                </motion.p>
              </div>
            </Card>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* CTA Section */}
      <AnimatedBackgroundSection id="cta" className="bg-black">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.p
              className="text-2xl md:text-3xl text-gray-300 mb-12 leading-relaxed"
              animate={{
                textShadow: [
                  "0 0 0px rgba(255,255,255,0)",
                  "0 0 10px rgba(255,255,255,0.2)",
                  "0 0 0px rgba(255,255,255,0)",
                ],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Arm yourself with your tools, sharpen your skills, and prepare for glory. Can you be the first to bring
              down our impenetrable Hawiyat fortress?{" "}
              <span className="text-red-600 font-bold">We seriously doubt it.</span>
            </motion.p>

           <Link href="http://estintal-estin-hack-talents-yq6jbn-df8f46-34-31-201-166.traefik.me/">
           <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
              <Button
                variant="destructive"
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-xl px-10 py-6 h-auto font-bold tracking-wider shadow-lg shadow-red-900/50 group"
              >
                <span className="relative z-10">HACK NOW</span>
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-800 z-0"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.5 }}
                />
                <motion.span
                  className="absolute inset-0 opacity-0 group-hover:opacity-30 z-0"
                  animate={{
                    boxShadow: [
                      "0 0 0px 0px rgba(255,0,0,0)",
                      "0 0 20px 10px rgba(255,0,0,0.4)",
                      "0 0 0px 0px rgba(255,0,0,0)",
                    ],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                />
              </Button>
            </motion.div>
           </Link>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Signature Section */}
      <AnimatedBackgroundSection id="signature" className="bg-gradient-to-b from-black to-gray-950">
        <div className="container px-4 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.p
              className="text-xl md:text-2xl text-gray-300 italic mb-6"
              animate={{
                textShadow: ["0 0 0px rgba(255,0,0,0)", "0 0 10px rgba(255,0,0,0.3)", "0 0 0px rgba(255,0,0,0)"],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Dedicate your hearts!
            </motion.p>
            <motion.p
              className="text-2xl md:text-3xl text-red-600 font-bold mb-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Commander Erwin Smith
            </motion.p>
            <p className="text-gray-400">ESTIN Talents CTF Organizer & Hawiyat Platform Architect</p>
          </motion.div>
        </div>
      </AnimatedBackgroundSection>

      {/* Footer */}
      <footer className="relative py-12 bg-gray-950 border-t border-red-900/30">
        <div className="container px-4 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 mb-8">
              You're receiving this because you claimed to know something about cybersecurity.
              <br />
              <span className="text-gray-600 italic">Spoiler alert: You don't.</span>
            </p>

            <div className="flex justify-center space-x-4 mb-8">
              {[
                { icon: <Facebook className="w-5 h-5" />, href: "#" },
                { icon: <Twitter className="w-5 h-5" />, href: "#" },
                { icon: <Linkedin className="w-5 h-5" />, href: "#" },
              ].map((social, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.2, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-red-900 hover:text-white transition-colors duration-300"
                  >
                    {social.icon}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.p className="text-gray-600 mb-6" whileHover={{ color: "#ef4444" }}>
              © 2025 ESTIN Talents - Clearly Superior
            </motion.p>

            <div className="flex justify-center space-x-6">
              {[
                { text: "Unsubscribe", href: "#" },
                { text: "Privacy Policy", href: "#" },
              ].map((link, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.1, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={link.href} className="text-gray-500 hover:text-red-600 transition-colors duration-300">
                    {link.text}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
