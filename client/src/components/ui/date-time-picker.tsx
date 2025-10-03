"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DateTimePickerProps {
  date?: Date
  onDateChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  minDate?: Date
}

export function DateTimePicker({
  date,
  onDateChange,
  placeholder = "Seleccionar fecha y hora",
  className,
  disabled = false,
  minDate,
}: DateTimePickerProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date)
  const [selectedTime, setSelectedTime] = React.useState<string>("")

  React.useEffect(() => {
    setSelectedDate(date)
    if (date) {
      setSelectedTime(format(date, "HH:mm"))
    }
  }, [date])

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate)
    if (newDate && selectedTime) {
      const [hours, minutes] = selectedTime.split(":").map(Number)
      const dateWithTime = new Date(newDate)
      dateWithTime.setHours(hours, minutes, 0, 0)
      onDateChange?.(dateWithTime)
    } else if (newDate) {
      // Si no hay hora seleccionada, usar medianoche
      const dateWithTime = new Date(newDate)
      dateWithTime.setHours(0, 0, 0, 0)
      onDateChange?.(dateWithTime)
    } else {
      onDateChange?.(undefined)
    }
  }

  const handleTimeChange = (time: string) => {
    setSelectedTime(time)
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number)
      const dateWithTime = new Date(selectedDate)
      dateWithTime.setHours(hours, minutes, 0, 0)
      onDateChange?.(dateWithTime)
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3 flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
                className
              )}
              disabled={disabled}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, "PPP") : placeholder}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date: Date) => minDate ? date < minDate : false}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          value={selectedTime}
          onChange={(e) => handleTimeChange(e.target.value)}
          className="w-32"
          disabled={disabled}
        />
      </div>
    </div>
  )
}
