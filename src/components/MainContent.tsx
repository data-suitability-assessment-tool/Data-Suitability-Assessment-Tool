// src/components/MainContent.tsx (updated version)
import React, { useState, forwardRef, useImperativeHandle } from 'react'
import { useTranslation } from 'react-i18next'
import * as Tabs from '@radix-ui/react-tabs'
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
  
  return (
    <div className="container mx-auto px-4 py-6 flex-grow">
      {activeTab === 'front-page' && (
        <FrontPage onStartAssessment={handleStartAssessment} />
      )}
      
      {showTabsNavigation && (
        <div className="mt-4">
          <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Tabs.List
              className="flex mb-6 border-b border-[var(--border-color)] shadow-sm w-full"
              aria-label={t('mainContent.navigation')}
            >
              <Tabs.Trigger
                value="assessment-tab-panel"
                className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg mr-1 sm:mr-2 transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 data-[state=active]:bg-[var(--primary-color)] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:translate-y-px data-[state=inactive]:bg-[var(--light-blue)]/50 data-[state=inactive]:text-[var(--text-color)] hover:bg-[var(--light-blue)] hover:text-[var(--primary-color)]`}
              >
                {t('mainContent.tabs.assessment')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="license-tab-panel"
                className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 data-[state=active]:bg-[var(--primary-color)] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:translate-y-px data-[state=inactive]:bg-[var(--light-blue)]/50 data-[state=inactive]:text-[var(--text-color)] hover:bg-[var(--light-blue)] hover:text-[var(--primary-color)]`}
              >
                {t('mainContent.tabs.license')}
              </Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content 
              value="assessment-tab-panel" 
              className="shadow-sm rounded-b-lg"
              tabIndex={0}
            >
              <AssessmentTool onReturnHome={handleReturnHome} />
            </Tabs.Content>
            
            <Tabs.Content 
              value="license-tab-panel" 
              className="shadow-sm rounded-b-lg"
              tabIndex={0}
            >
              <License currentYear={currentYear} />
            </Tabs.Content>
          </Tabs.Root>
        </div>
      )}
    </div>
  )
})

MainContent.displayName = 'MainContent'

export default MainContent