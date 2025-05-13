// src/App.tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import MainContent from './components/MainContent'
import React from 'react'

function App() {
  const [currentYear] = useState(new Date().getFullYear())
  const { i18n } = useTranslation()
  
  const mainContentRef = React.useRef<{ handleReturnHome: () => void } | null>(null)
  
  const handleTitleClick = () => {
    if (mainContentRef.current) {
      mainContentRef.current.handleReturnHome()
    }
  }

  // Update document language attribute when language changes
  useEffect(() => {
    document.documentElement.lang = i18n.language
    document.title = i18n.language === 'en' ? 'Data Quality Self Evaluation Tool' : 'Outil d\'auto-évaluation de la qualité des données'
  }, [i18n.language])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:bg-white focus:text-[var(--primary-color)] focus:p-4 focus:shadow-lg focus:rounded-md"
      >
        Skip to main content
      </a>
      
      <Header onTitleClick={handleTitleClick} />
      
      <main 
        id="main-content" 
        className="flex-grow px-4 py-8 md:py-12" 
        role="main"
      >
        <div className="max-w-7xl mx-auto">
          <MainContent ref={mainContentRef} />
        </div>
      </main>
      
      <Footer year={currentYear} />
    </div>
  )
}

export default App