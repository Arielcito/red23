"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"

interface CountdownTimerProps {
  targetDate: Date
  label: string
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function CountdownTimer({ targetDate, label, className }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    console.log('⏱️ [COUNTDOWN] Target date:', targetDate)
    console.log('⏱️ [COUNTDOWN] Target date (locale):', targetDate.toLocaleString())
    console.log('⏱️ [COUNTDOWN] Target date (ISO):', targetDate.toISOString())

    const calculateTimeLeft = (): TimeLeft => {
      const now = new Date()
      const nowTime = now.getTime()
      const target = targetDate.getTime()
      const difference = target - nowTime

      console.log('⏱️ [COUNTDOWN] Ahora (locale):', now.toLocaleString())
      console.log('⏱️ [COUNTDOWN] Ahora (timestamp):', nowTime)
      console.log('⏱️ [COUNTDOWN] Target (timestamp):', target)
      console.log('⏱️ [COUNTDOWN] Diferencia (ms):', difference)
      console.log('⏱️ [COUNTDOWN] Diferencia (horas):', difference / (1000 * 60 * 60))

      if (difference > 0) {
        const result = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        }
        console.log('⏱️ [COUNTDOWN] Tiempo restante:', result)
        return result
      }

      console.log('⏱️ [COUNTDOWN] ¡Tiempo expirado!')
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    setTimeLeft(calculateTimeLeft())

    return () => clearInterval(timer)
  }, [targetDate, mounted])

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Clock className="h-4 w-4 text-muted-foreground" />
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
      </div>
    )
  }

  const formatTime = (time: number) => time.toString().padStart(2, "0")

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      
      <div className="flex items-center gap-1 text-sm font-mono">
        {timeLeft.days > 0 && (
          <>
            <span className="text-primary font-semibold">{timeLeft.days}</span>
            <span className="text-muted-foreground">d</span>
          </>
        )}
        <span className="text-primary font-semibold">{formatTime(timeLeft.hours)}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-primary font-semibold">{formatTime(timeLeft.minutes)}</span>
        <span className="text-muted-foreground">:</span>
        <span className="text-primary font-semibold">{formatTime(timeLeft.seconds)}</span>
      </div>
    </div>
  )
}