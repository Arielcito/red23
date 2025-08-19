"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar as CalendarIcon, Clock, X, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ImageSchedulerProps {
  imageUrl?: string
  imageTitle?: string
  onSchedule: (scheduleData: ScheduleData) => void
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export interface ScheduleData {
  date: string
  time: string
  caption?: string
  imageUrl?: string
  imageTitle?: string
}

export function ImageScheduler({ 
  imageUrl, 
  imageTitle, 
  onSchedule, 
  isOpen, 
  onOpenChange 
}: ImageSchedulerProps) {
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("09:00")
  const [caption, setCaption] = useState("")

  const handleSchedule = () => {
    if (!selectedDate) return

    const scheduleData: ScheduleData = {
      date: selectedDate,
      time: selectedTime,
      caption,
      imageUrl,
      imageTitle
    }

    onSchedule(scheduleData)
    setSelectedDate("")
    setSelectedTime("09:00")
    setCaption("")
    onOpenChange(false)
  }

  const getNextWeekDates = () => {
    const dates = []
    const today = new Date()
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date)
    }
    
    return dates
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const formatDisplayDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    }
    return date.toLocaleDateString('es-ES', options)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Programar para WhatsApp</span>
          </DialogTitle>
          <DialogDescription>
            Selecciona fecha, hora y agrega un mensaje personalizado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Preview */}
          {imageUrl && (
            <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={imageUrl}
                  alt={imageTitle || "Imagen"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{imageTitle || "Imagen sin título"}</p>
                <p className="text-xs text-gray-500">Se publicará en WhatsApp Stories</p>
              </div>
            </div>
          )}

          {/* Date Selection */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Seleccionar fecha</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {getNextWeekDates().map((date) => {
                const dateStr = formatDate(date)
                const isSelected = selectedDate === dateStr
                const isToday = dateStr === formatDate(new Date())
                
                return (
                  <Button
                    key={dateStr}
                    variant={isSelected ? "default" : "outline"}
                    className={`flex flex-col h-auto py-3 ${
                      isSelected ? "bg-primary-600 hover:bg-primary-700" : ""
                    } ${isToday ? "border-primary-500" : ""}`}
                    onClick={() => setSelectedDate(dateStr)}
                  >
                    <span className="text-xs">{formatDisplayDate(date)}</span>
                    <span className="text-lg font-bold">{date.getDate()}</span>
                    {isToday && (
                      <span className="text-xs text-primary-600 dark:text-primary-400">Hoy</span>
                    )}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-3">
            <Label htmlFor="time" className="text-base font-medium flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span>Hora de publicación</span>
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {["06:00", "09:00", "12:00", "15:00", "18:00", "21:00"].map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  className={selectedTime === time ? "bg-primary-600 hover:bg-primary-700" : ""}
                  onClick={() => setSelectedTime(time)}
                >
                  {time}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-2">
              <Input
                id="custom-time"
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-32"
              />
              <span className="text-sm text-gray-500">o elige hora personalizada</span>
            </div>
          </div>

          {/* Caption */}
          <div className="space-y-3">
            <Label htmlFor="caption" className="text-base font-medium">
              Mensaje (opcional)
            </Label>
            <Textarea
              id="caption"
              placeholder="🎨 Creado con IA | #arte #creatividad #casino"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500">
              {caption.length}/200 caracteres
            </p>
          </div>

          {/* Quick Templates */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Plantillas rápidas</Label>
            <div className="flex flex-wrap gap-2">
              {[
                "🎰 ¡Nueva promoción! #casino",
                "🎨 Arte generado con IA #creatividad",
                "✨ Contenido exclusivo #premium",
                "🔥 ¡No te lo pierdas! #oferta"
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => setCaption(template)}
                >
                  {template}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button 
            onClick={handleSchedule}
            disabled={!selectedDate}
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
          >
            <Check className="h-4 w-4 mr-2" />
            Programar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}