import { useState, useEffect } from "react"

const STORAGE_KEY = "red23_lead_form_completed"

export function useLeadFormModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const hasCompletedForm = localStorage.getItem(STORAGE_KEY)
    
    if (!hasCompletedForm) {
      setIsOpen(true)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem(STORAGE_KEY, "true")
  }

  const resetForm = () => {
    localStorage.removeItem(STORAGE_KEY)
    setIsOpen(true)
  }

  return {
    isOpen,
    handleClose,
    resetForm,
  }
}

