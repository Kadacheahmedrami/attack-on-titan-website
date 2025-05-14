"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface CountdownTimerProps {
  targetDate: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isFlipping, setIsFlipping] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
  })

  // Use a ref to store previous values for comparison
  const prevTimeRef = useRef<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date()

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)

        // Check which values changed to trigger flip animation
        // Compare with previous values from ref, not current state
        const newIsFlipping = {
          days: days !== prevTimeRef.current.days,
          hours: hours !== prevTimeRef.current.hours,
          minutes: minutes !== prevTimeRef.current.minutes,
          seconds: seconds !== prevTimeRef.current.seconds,
        }

        // Only update isFlipping state if something changed
        if (Object.values(newIsFlipping).some(Boolean)) {
          setIsFlipping(newIsFlipping)

          // Reset flip animations after they complete
          setTimeout(() => {
            setIsFlipping({
              days: false,
              hours: false,
              minutes: false,
              seconds: false,
            })
          }, 500)
        }

        // Update the previous time ref
        prevTimeRef.current = { days, hours, minutes, seconds }

        // Update the time state
        setTimeLeft({ days, hours, minutes, seconds })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate]) // Remove timeLeft from dependencies

  const formatNumber = (num: number) => {
    return num < 10 ? `0${num}` : num.toString()
  }

  return (
    <div className="flex justify-center items-center space-x-4 md:space-x-8">
      <TimeUnit value={formatNumber(timeLeft.days)} label="DAYS" isFlipping={isFlipping.days} />
      <TimeUnit value={formatNumber(timeLeft.hours)} label="HOURS" isFlipping={isFlipping.hours} />
      <TimeUnit value={formatNumber(timeLeft.minutes)} label="MINUTES" isFlipping={isFlipping.minutes} />
      <TimeUnit value={formatNumber(timeLeft.seconds)} label="SECONDS" isFlipping={isFlipping.seconds} />
    </div>
  )
}

interface TimeUnitProps {
  value: string
  label: string
  isFlipping: boolean
}

const TimeUnit = ({ value, label, isFlipping }: TimeUnitProps) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={
          isFlipping
            ? {
                rotateX: [0, 90, 0],
                y: [0, -10, 0],
                boxShadow: [
                  "0 5px 15px rgba(139, 0, 0, 0.3)",
                  "0 15px 25px rgba(139, 0, 0, 0.5)",
                  "0 5px 15px rgba(139, 0, 0, 0.3)",
                ],
              }
            : {}
        }
        transition={{ duration: 0.5 }}
        className="relative bg-gradient-to-b from-red-800 to-red-950 rounded-md px-4 py-3 md:px-6 md:py-4 text-3xl md:text-5xl font-bold text-white shadow-lg shadow-red-900/30"
      >
        {value}
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white opacity-10 rounded-md"></div>
        <motion.div
          className="absolute inset-0 rounded-md"
          animate={{
            boxShadow: [
              "inset 0 0 0px 0px rgba(255, 0, 0, 0)",
              "inset 0 0 10px 2px rgba(255, 0, 0, 0.3)",
              "inset 0 0 0px 0px rgba(255, 0, 0, 0)",
            ],
          }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />
      </motion.div>
      <p className="mt-2 text-xs md:text-sm text-gray-500 font-medium tracking-wider">{label}</p>
    </div>
  )
}

export default CountdownTimer
