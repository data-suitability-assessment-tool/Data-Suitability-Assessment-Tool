// src/components/MainContent.tsx (updated version)
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import FrontPage from './tabs/FrontPage'
import AssessmentTool from './tabs/AssessmentTool'
import License from './tabs/License'

export interface MainContentRef {
  handleReturnHome: () => void;
}

const MainContent = forwardRef<MainContentRef>((_, ref) => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('front-page')
  const [showTabsNavigation, setShowTabsNavigation] = useState(false)
  const [currentYear] = useState(() => new Date().getFullYear())
  
  const handleStartAssessment = () => {
    setActiveTab('assessment-tab-panel')
    setShowTabsNavigation(true)
  }

  const handleReturnHome = () => {
    setActiveTab('front-page')
    setShowTabsNavigation(false)
  }
  
  // Expose handleReturnHome method to parent component
  useImperativeHandle(ref, () => ({
    handleReturnHome
  }))
  
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
  }
  
  // Handle keyboard navigation for tabs
  const handleKeyDown = (e: React.KeyboardEvent, tabId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleTabChange(tabId)
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      const tabs = ['assessment-tab-panel', 'license-tab-panel']
      const currentIndex = tabs.indexOf(activeTab)
      let newIndex
      
      if (e.key === 'ArrowRight') {
        newIndex = (currentIndex + 1) % tabs.length
      } else {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length
      }
      
      handleTabChange(tabs[newIndex])
      document.getElementById(`${tabs[newIndex].split('-')[0]}-tab`)?.focus()
    }
  }
  
  // Focus management for tab changes
  useEffect(() => {
    if (showTabsNavigation) {
      const activeTabElement = document.getElementById(`${activeTab.split('-')[0]}-tab`)
      if (activeTabElement) {
        activeTabElement.focus()
      }
    }
  }, [activeTab, showTabsNavigation])
  
  return (
    <div className="container mx-auto px-4 py-6 flex-grow">
      {activeTab === 'front-page' && (
        <FrontPage onStartAssessment={handleStartAssessment} />
      )}
      
      {showTabsNavigation && (
        <div className="mt-4">
          <nav
            className="flex mb-6 border-b border-[var(--border-color)] shadow-sm w-full"
            role="tablist"
            aria-label={t('mainContent.navigation')}
          >
            <button
              role="tab"
              id="assessment-tab"
              aria-controls="assessment-tab-panel"
              aria-selected={activeTab === 'assessment-tab-panel'}
              className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg mr-1 sm:mr-2 transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 ${
                activeTab === 'assessment-tab-panel' 
                  ? 'bg-[var(--primary-color)] text-white font-bold shadow-md translate-y-px' 
                  : 'bg-[var(--light-blue)]/50 text-[var(--text-color)] hover:bg-[var(--light-blue)] hover:text-[var(--primary-color)]'
              }`}
              onClick={() => handleTabChange('assessment-tab-panel')}
              onKeyDown={(e) => handleKeyDown(e, 'assessment-tab-panel')}
              tabIndex={activeTab === 'assessment-tab-panel' ? 0 : -1}
            >
              {t('mainContent.tabs.assessment')}
            </button>
            <button
              role="tab"
              id="license-tab"
              aria-controls="license-tab-panel"
              aria-selected={activeTab === 'license-tab-panel'}
              className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 ${
                activeTab === 'license-tab-panel' 
                  ? 'bg-[var(--primary-color)] text-white font-bold shadow-md translate-y-px' 
                  : 'bg-[var(--light-blue)]/50 text-[var(--text-color)] hover:bg-[var(--light-blue)] hover:text-[var(--primary-color)]'
              }`}
              onClick={() => handleTabChange('license-tab-panel')}
              onKeyDown={(e) => handleKeyDown(e, 'license-tab-panel')}
              tabIndex={activeTab === 'license-tab-panel' ? 0 : -1}
            >
              {t('mainContent.tabs.license')}
            </button>
          </nav>
          
          <div 
            id="assessment-tab-panel" 
            role="tabpanel" 
            aria-labelledby="assessment-tab"
            className={`shadow-sm rounded-b-lg ${activeTab === 'assessment-tab-panel' ? 'block' : 'hidden'}`}
            tabIndex={0}
          >
            <AssessmentTool onReturnHome={handleReturnHome} />
          </div>
          
          <div 
            id="license-tab-panel" 
            role="tabpanel" 
            aria-labelledby="license-tab"
            className={`shadow-sm rounded-b-lg ${activeTab === 'license-tab-panel' ? 'block' : 'hidden'}`}
            tabIndex={0}
          >
            <License currentYear={currentYear} />
          </div>
        </div>
      )}
    </div>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent