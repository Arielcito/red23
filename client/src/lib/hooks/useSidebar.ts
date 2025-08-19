"use client"

import { useState, useEffect, useCallback } from "react"

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Load sidebar state from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("sidebarCollapsed")
      if (stored !== null) {
        setIsCollapsed(JSON.parse(stored))
      }
    } catch (error) {
      console.error("Error loading sidebar state:", error)
    }
  }, [])

  // Save sidebar state to localStorage
  const saveSidebarState = useCallback((collapsed: boolean) => {
    try {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed))
    } catch (error) {
      console.error("Error saving sidebar state:", error)
    }
  }, [])

  const toggleCollapsed = useCallback(() => {
    setIsCollapsed(prev => {
      const newState = !prev
      saveSidebarState(newState)
      console.log("Sidebar toggled:", newState ? "collapsed" : "expanded")
      return newState
    })
  }, [saveSidebarState])

  const toggleMobile = useCallback(() => {
    setIsMobileOpen(prev => {
      const newState = !prev
      console.log("Mobile sidebar toggled:", newState ? "open" : "closed")
      return newState
    })
  }, [])

  const closeMobile = useCallback(() => {
    setIsMobileOpen(false)
    console.log("Mobile sidebar closed")
  }, [])

  const openMobile = useCallback(() => {
    setIsMobileOpen(true)
    console.log("Mobile sidebar opened")
  }, [])

  // Auto-close mobile sidebar on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileOpen) {
        setIsMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isMobileOpen])

  return {
    isCollapsed,
    isMobileOpen,
    toggleCollapsed,
    toggleMobile,
    closeMobile,
    openMobile,
  }
}