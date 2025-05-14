"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

const HackerTerminal = () => {
  const [text, setText] = useState("")
  const [cursorVisible, setCursorVisible] = useState(true)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [currentInput, setCurrentInput] = useState("")
  const terminalRef = useRef<HTMLDivElement>(null)

  // Predefined responses
  const responses: Record<string, string> = {
    help: "Available commands: help, scan, exploit, status, clear, about",
    scan: "SCANNING HAWIYAT DEFENSES...\n> Firewall: ACTIVE\n> Intrusion Detection: ACTIVE\n> Honeypots: ACTIVE\n> Vulnerability: NONE DETECTED\n\nScan complete. No entry points found. Nice try.",
    exploit:
      "EXPLOIT ATTEMPT FAILED\n> Your pathetic attempt has been logged\n> IP address recorded\n> Counter-measures deployed\n\nDid you really think it would be that easy?",
    status:
      "HAWIYAT PLATFORM STATUS\n> System: FULLY OPERATIONAL\n> Security Level: MAXIMUM\n> Breach Attempts: 1,337\n> Successful Breaches: 0\n\nYour chances of success: ZERO",
    about:
      "The Hawiyat Platform is the most advanced CTF infrastructure ever created. Built from scratch by the Rankiha Team, it makes conventional security measures look like child's play. Good luck breaking in - you'll need it.",
    clear: "",
  }

  // Typing effect
  useEffect(() => {
    const typeText = (text: string, delay = 30) => {
      let i = 0
      setText("")
      const typing = setInterval(() => {
        if (i < text.length) {
          setText((prev) => prev + text.charAt(i))
          i++
        } else {
          clearInterval(typing)
        }
      }, delay)
      return () => clearInterval(typing)
    }

    // Initial text
    typeText(
      "HAWIYAT TERMINAL v3.5.2\n> Type 'help' for available commands\n> Warning: All activities are monitored and logged",
    )

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 500)

    return () => {
      clearInterval(cursorInterval)
    }
  }, [])

  // Handle command input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && currentInput.trim()) {
      const command = currentInput.trim().toLowerCase()

      // Add to history
      setCommandHistory([...commandHistory, `> ${currentInput}`])

      // Process command
      if (command in responses) {
        if (command === "clear") {
          setText("")
          setCommandHistory([])
        } else {
          setCommandHistory((prev) => [...prev, responses[command]])
        }
      } else {
        setCommandHistory((prev) => [
          ...prev,
          `Command not recognized: '${command}'. Type 'help' for available commands.`,
        ])
      }

      // Clear input
      setCurrentInput("")

      // Scroll to bottom
      if (terminalRef.current) {
        setTimeout(() => {
          if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight
          }
        }, 100)
      }
    }
  }

  return (
    <div className="terminal-container">
      <div className="terminal-header flex items-center justify-between bg-gray-950 border-b border-red-900/30 p-2 rounded-t-lg">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-600 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-600 mr-2"></div>
          <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
        </div>
        <div className="text-xs text-gray-400">hawiyat@estin:~</div>
        <div></div>
      </div>

      <motion.div
        ref={terminalRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="terminal-body bg-gray-950 p-4 font-mono text-sm text-green-500 h-64 overflow-y-auto rounded-b-lg"
        style={{
          boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.5)",
          backgroundImage: "radial-gradient(rgba(0, 50, 0, 0.1) 1px, transparent 1px)",
          backgroundSize: "4px 4px",
        }}
      >
        <div className="whitespace-pre-line">{text}</div>

        {commandHistory.map((cmd, index) => (
          <div key={index} className={`whitespace-pre-line ${cmd.startsWith(">") ? "text-cyan-500" : ""}`}>
            {cmd}
          </div>
        ))}

        <div className="flex items-center mt-2">
          <span className="text-cyan-500 mr-2">&gt;</span>
          <input
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none text-green-500"
            autoFocus
          />
          <span className={`w-2 h-4 bg-green-500 ml-1 ${cursorVisible ? "opacity-100" : "opacity-0"}`}></span>
        </div>
      </motion.div>
    </div>
  )
}

export default HackerTerminal
