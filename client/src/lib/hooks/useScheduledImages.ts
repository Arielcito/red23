"use client"

import { useState, useEffect } from "react"

export interface ScheduledImage {
  id: string
  imageUrl: string
  imageTitle: string
  date: string
  time: string
  caption?: string
  status: "pending" | "published" | "failed"
  createdAt: string
}

export function useScheduledImages() {
  const [scheduledImages, setScheduledImages] = useState<ScheduledImage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Load scheduled images from localStorage on mount
  useEffect(() => {
    loadScheduledImages()
  }, [])

  const loadScheduledImages = () => {
    try {
      const stored = localStorage.getItem("scheduledImages")
      if (stored) {
        const images = JSON.parse(stored)
        setScheduledImages(images)
      }
    } catch (error) {
      console.error("Error loading scheduled images:", error)
    }
  }

  const saveScheduledImages = (images: ScheduledImage[]) => {
    try {
      localStorage.setItem("scheduledImages", JSON.stringify(images))
      setScheduledImages(images)
    } catch (error) {
      console.error("Error saving scheduled images:", error)
    }
  }

  const scheduleImage = (
    imageUrl: string,
    imageTitle: string,
    date: string,
    time: string,
    caption?: string
  ) => {
    setIsLoading(true)
    
    try {
      const newScheduledImage: ScheduledImage = {
        id: Date.now().toString(),
        imageUrl,
        imageTitle,
        date,
        time,
        caption,
        status: "pending",
        createdAt: new Date().toISOString()
      }

      const updatedImages = [...scheduledImages, newScheduledImage]
      saveScheduledImages(updatedImages)
      
      console.log("Imagen programada:", {
        title: imageTitle,
        date,
        time,
        caption
      })
      
      return newScheduledImage
    } catch (error) {
      console.error("Error scheduling image:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const cancelScheduledImage = (id: string) => {
    const updatedImages = scheduledImages.filter(img => img.id !== id)
    saveScheduledImages(updatedImages)
    
    console.log("Imagen desprogramada:", id)
  }

  const updateImageStatus = (id: string, status: ScheduledImage["status"]) => {
    const updatedImages = scheduledImages.map(img =>
      img.id === id ? { ...img, status } : img
    )
    saveScheduledImages(updatedImages)
    
    console.log("Estado actualizado:", { id, status })
  }

  const getUpcomingImages = () => {
    const now = new Date()
    return scheduledImages
      .filter(img => {
        const scheduledDateTime = new Date(`${img.date}T${img.time}`)
        return scheduledDateTime > now && img.status === "pending"
      })
      .sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`)
        const dateB = new Date(`${b.date}T${b.time}`)
        return dateA.getTime() - dateB.getTime()
      })
  }

  const getTodayImages = () => {
    const today = new Date().toISOString().split('T')[0]
    return scheduledImages.filter(img => img.date === today)
  }

  const getImagesByDate = (date: string) => {
    return scheduledImages.filter(img => img.date === date)
  }

  return {
    scheduledImages,
    isLoading,
    scheduleImage,
    cancelScheduledImage,
    updateImageStatus,
    getUpcomingImages,
    getTodayImages,
    getImagesByDate,
    loadScheduledImages
  }
}