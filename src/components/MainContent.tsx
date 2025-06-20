// src/components/MainContent.tsx (updated version)
/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore - React is used for JSX
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
  
  // Assessment state lifted up to preserve across tab switches
  const [currentStep, setCurrentStep] = useState<'ethics' | 'quality' | 'overall'>('ethics')
  const [ethicsAnswers, setEthicsAnswers] = useState<Record<string, string>>({})
  const [ethicsPass, setEthicsPass] = useState<boolean | null>(null)
  const [part1MessageKey, setPart1MessageKey] = useState<string>('')
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({})
  const [totalQualityScore, setTotalQualityScore] = useState(0)
  const [qualityPass, setQualityPass] = useState<boolean | null>(null)
  const [qualityInterpretationKey, setQualityInterpretationKey] = useState('')
  
  // UI state to preserve result display across tab switches
  const [ethicsShowResult, setEthicsShowResult] = useState(false)
  const [qualityShowResult, setQualityShowResult] = useState(false)
  const [qualityInterpretation, setQualityInterpretation] = useState('')
  const [criteriaSatisfaction, setCriteriaSatisfaction] = useState<Record<string, boolean[]>>({})
  
  const handleStartAssessment = () => {
    setActiveTab('assessment-tab-panel')
    setShowTabsNavigation(true)
  }

  const handleReturnHome = () => {
    setActiveTab('front-page')
    setShowTabsNavigation(false)
    // Reset assessment state when returning home
    setCurrentStep('ethics')
    setEthicsAnswers({})
    setEthicsPass(null)
    setPart1MessageKey('')
    setQualityScores({})
    setTotalQualityScore(0)
    setQualityPass(null)
    setQualityInterpretationKey('')
    // Reset UI state
    setEthicsShowResult(false)
    setQualityShowResult(false)
    setQualityInterpretation('')
    setCriteriaSatisfaction({})
  }
  
  // Expose handleReturnHome method to parent component
  useImperativeHandle(ref, () => ({
    handleReturnHome
  }))
  
  return (
    <div className="container mx-auto px-4 py-6 flex-grow">
      {/* This component uses React JSX */}
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
                className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg mr-1 sm:mr-2 transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 cursor-pointer data-[state=active]:bg-[var(--primary-color)] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:translate-y-px data-[state=inactive]:bg-[var(--light-blue)]/50 data-[state=inactive]:text-[var(--text-color)] data-[state=inactive]:hover:bg-[var(--light-blue)] data-[state=inactive]:hover:text-[var(--primary-color)] data-[state=inactive]:hover:shadow-md`}
              >
                {t('mainContent.tabs.assessment')}
              </Tabs.Trigger>
              <Tabs.Trigger
                value="license-tab-panel"
                className={`py-2 sm:py-3 px-4 sm:px-6 text-lg font-bold text-base rounded-t-lg transition-all duration-200 ease-in-out border-t border-l border-r border-[var(--border-color)] flex-1 cursor-pointer data-[state=active]:bg-[var(--primary-color)] data-[state=active]:text-white data-[state=active]:font-bold data-[state=active]:shadow-md data-[state=active]:translate-y-px data-[state=inactive]:bg-[var(--light-blue)]/50 data-[state=inactive]:text-[var(--text-color)] data-[state=inactive]:hover:bg-[var(--light-blue)] data-[state=inactive]:hover:text-[var(--primary-color)] data-[state=inactive]:hover:shadow-md`}
              >
                {t('mainContent.tabs.license')}
              </Tabs.Trigger>
            </Tabs.List>
            
            <Tabs.Content 
              value="assessment-tab-panel" 
              className="shadow-sm rounded-b-lg"
              tabIndex={0}
            >
              <AssessmentTool 
                onReturnHome={handleReturnHome}
                // Pass assessment state as props
                currentStep={currentStep}
                setCurrentStep={setCurrentStep}
                ethicsAnswers={ethicsAnswers}
                setEthicsAnswers={setEthicsAnswers}
                ethicsPass={ethicsPass}
                setEthicsPass={setEthicsPass}
                part1MessageKey={part1MessageKey}
                setPart1MessageKey={setPart1MessageKey}
                qualityScores={qualityScores}
                setQualityScores={setQualityScores}
                totalQualityScore={totalQualityScore}
                setTotalQualityScore={setTotalQualityScore}
                qualityPass={qualityPass}
                setQualityPass={setQualityPass}
                qualityInterpretationKey={qualityInterpretationKey}
                setQualityInterpretationKey={setQualityInterpretationKey}
                // Pass UI state as props
                ethicsShowResult={ethicsShowResult}
                setEthicsShowResult={setEthicsShowResult}
                qualityShowResult={qualityShowResult}
                setQualityShowResult={setQualityShowResult}
                qualityInterpretation={qualityInterpretation}
                setQualityInterpretation={setQualityInterpretation}
                criteriaSatisfaction={criteriaSatisfaction}
                setCriteriaSatisfaction={setCriteriaSatisfaction}
              />
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