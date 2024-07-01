'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { i18n } from '@/i18n.config'
// import './main.css'

const flagMap = {
  kg: '🇰🇬',
  ru: '🇷🇺'
}

export default function LocaleSwitcher(props) {
  const pathName = usePathname()
  const router = useRouter()
  const { language, changeLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const redirectedPathName = locale => {
    if (!pathName) return '/'
    const segments = pathName.split('/')
    segments[1] = locale
    return segments.join('/')
  }

  const handleChangeLanguage = lang => {
    if (lang !== language) {
      changeLanguage(lang)
      router.push(redirectedPathName(lang))
    }
    setOpen(false)
  }

  useEffect(() => {
    if (pathName) {
      const currentLocale = pathName.split('/')[1]
      if (currentLocale !== language) {
        changeLanguage(currentLocale)
      }
    }
  }, [pathName, language, changeLanguage])

  return (
    <div className="dropdown" {...props}>
      <button className="dropbtn" onClick={() => setOpen(!open)}>
        <span className="flag">{flagMap[language]}</span>

        <div className="dropbottom">
          <svg
            fill="grey"
            height="10px"
            width="10px"
            version="1.1"
            id="Layer_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 330.002 330.002"
            xmlSpace="preserve"
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              <path
                id="XMLID_229_"
                d="M327.001,99.751c-4.971-6.628-14.374-7.971-21-3l-140.997,105.75L24.001,96.751 c-6.628-4.971-16.029-3.626-21,3c-4.971,6.627-3.627,16.03,3,21l150.004,112.5c2.667,2,5.833,3,9,3c3.166,0,6.333-1,9-3 l149.996-112.5C330.628,115.781,331.972,106.379,327.001,99.751z"
              ></path>{' '}
            </g>
          </svg>
        </div>
      </button>
      {open && (
        <div className="dropdownContent">
          {i18n.locales.map(locale => (
            <div
              key={locale}
              className="dropdownItem"
              onClick={() => handleChangeLanguage(locale)}
            >
              <span className="flag">{flagMap[locale]}</span>
              <span>{locale === 'ru' ? 'Русский' : 'Кыргызча'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
