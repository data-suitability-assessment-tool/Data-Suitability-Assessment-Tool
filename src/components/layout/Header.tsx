// src/components/layout/Header.tsx
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

interface HeaderProps {
  onTitleClick?: () => void;
}

const Header = ({ onTitleClick }: HeaderProps) => {
  const { t, i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'en')
  
  // Update the state when i18n.language changes
  useEffect(() => {
    setCurrentLanguage(i18n.language)
  }, [i18n.language])
  
  const toggleLanguage = () => {
    const newLanguage = currentLanguage === 'en' ? 'fr' : 'en'
    i18n.changeLanguage(newLanguage)
    setCurrentLanguage(newLanguage)
  }
  
  return (
    <header 
      className="bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] text-white py-4 px-6 shadow-md"
      role="banner"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Center title and beta */}
        <div className="flex flex-col items-center mb-4 sm:mb-0">
          <h1 
            id="siteTitle" 
            className="text-2xl font-bold cursor-pointer hover:text-white/90 transition-colors"
            onClick={onTitleClick}
            tabIndex={0}
            role="button"
            aria-label={t('header.returnToHome')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onTitleClick?.();
              }
            }}
          >
            {t('header.title')}
          </h1>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium mt-2">
            {t('header.beta')}
          </div>
        </div>
        
        {/* Language toggle positioned absolutely on the right and centered vertically */}
        <div className="absolute top-1/2 right-0 sm:right-6 transform -translate-y-1/2">
          <button 
            className="relative overflow-hidden group bg-white text-[var(--primary-color)] border-none rounded-full px-5 py-2 font-medium transition-all hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--primary-color)]"
            onClick={toggleLanguage}
            aria-label={currentLanguage === 'en' ? t('header.switchToFrench') : t('header.switchToEnglish')}
            aria-pressed={currentLanguage === 'fr'}
            type="button"
          >
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              {currentLanguage === 'en' ? t('header.switchToFrench') : t('header.switchToEnglish')}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header