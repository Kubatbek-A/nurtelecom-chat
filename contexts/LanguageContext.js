'use client'

import React, { createContext, useState, useContext, useEffect } from 'react'

const LanguageContext = createContext()

export const LanguageProvider = ({ children, initialLang }) => {
  const [language, setLanguage] = useState(() => {
    const savedLanguage =
      typeof window !== 'undefined'
        ? localStorage.getItem('preferredLanguage')
        : null
    return savedLanguage || initialLang || 'en'
  })

  useEffect(() => {
    if (language) {
      localStorage.setItem('preferredLanguage', language)
    }
  }, [language])

  const changeLanguage = lang => {
    setLanguage(lang)
    localStorage.setItem('preferredLanguage', lang)
  }

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
