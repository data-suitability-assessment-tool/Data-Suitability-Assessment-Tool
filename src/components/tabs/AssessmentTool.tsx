// src/components/tabs/AssessmentTool.tsx
import React, { useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import AlertDialogComponent from '../ui/AlertDialog';
import EthicsPrinciples from '../assessment/EthicsPrinciples';
import QualityDimensions from '../assessment/QualityDimensions';
import OverallAssessment from '../assessment/OverallAssessment';

interface AssessmentToolProps {
  onReturnHome?: () => void;
  // State props passed down from MainContent
  currentStep: 'ethics' | 'quality' | 'overall';
  setCurrentStep: Dispatch<SetStateAction<'ethics' | 'quality' | 'overall'>>;
  ethicsAnswers: Record<string, string>;
  setEthicsAnswers: Dispatch<SetStateAction<Record<string, string>>>;
  ethicsPass: boolean | null;
  setEthicsPass: Dispatch<SetStateAction<boolean | null>>;
  part1MessageKey: string;
  setPart1MessageKey: Dispatch<SetStateAction<string>>;
  qualityScores: Record<string, number>;
  setQualityScores: Dispatch<SetStateAction<Record<string, number>>>;
  totalQualityScore: number;
  setTotalQualityScore: Dispatch<SetStateAction<number>>;
  qualityPass: boolean | null;
  setQualityPass: Dispatch<SetStateAction<boolean | null>>;
  qualityInterpretationKey: string;
  setQualityInterpretationKey: Dispatch<SetStateAction<string>>;
}

const AssessmentTool: React.FC<AssessmentToolProps> = ({
  onReturnHome,
  currentStep,
  setCurrentStep,
  ethicsAnswers,
  setEthicsAnswers,
  ethicsPass,
  setEthicsPass,
  part1MessageKey,
  setPart1MessageKey,
  qualityScores,
  setQualityScores,
  totalQualityScore,
  setTotalQualityScore,
  qualityPass,
  setQualityPass,
  qualityInterpretationKey,
  setQualityInterpretationKey,
}) => {
  const { t } = useTranslation();
  
  // Local state for alerts only
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Assessment data for export
  const assessmentData = {
    ethicsPrinciples: ethicsAnswers,
    qualityDimensions: qualityScores,
  };
  
  const showAlert = (message: string) => {
    setAlertMessage(message);
    setAlertOpen(true);
  };
  
  const handleNextStep = () => {
    if (currentStep === 'ethics') {
      setCurrentStep('quality');
    } else if (currentStep === 'quality') {
      setCurrentStep('overall');
      // Scroll to top when reaching overall assessment with a slight delay to ensure component is rendered
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  };
  
  const handleReset = () => {
    setCurrentStep('ethics');
    setEthicsAnswers({});
    setQualityScores({});
    setEthicsPass(null);
    setQualityPass(null);
    setPart1MessageKey('');
    setQualityInterpretationKey('');
    setTotalQualityScore(0);
    setAlertOpen(false);
    setAlertMessage('');
  };
  
  const handleQualityEvaluate = () => {
    // Check if any dimension has a score of 0
    const hasZeroScore = Object.values(qualityScores).some(score => score === 0);
    
    // Fail if any score is 0 or if total score is less than 8
    const isQualityPass = !hasZeroScore && totalQualityScore >= 8;
    setQualityPass(isQualityPass);
    
    let messageKey = '';
    if (hasZeroScore) {
      messageKey = 'assessment.quality.interpretation.fail';
    } else if (totalQualityScore <= 7) {
      messageKey = 'assessment.quality.interpretation.low';
    } else if (totalQualityScore >= 8 && totalQualityScore <= 10) {
      messageKey = 'assessment.quality.interpretation.medium';
    } else if (totalQualityScore >= 11) {
      messageKey = 'assessment.quality.interpretation.high';
    }
    
    setQualityInterpretationKey(messageKey);
    handleNextStep();
  };

  const handleGoBack = () => {
    if (currentStep === 'quality') {
      setCurrentStep('ethics');
    } else if (currentStep === 'overall') {
      setCurrentStep('quality');
    }
  };
  
  return (
    <div 
      role="region" 
      aria-label={t('assessment.title')}
    >
      {currentStep === 'ethics' && (
        <div aria-live="polite">
          <EthicsPrinciples 
            ethicsAnswers={ethicsAnswers}
            setEthicsAnswers={setEthicsAnswers}
            ethicsPass={ethicsPass}
            setEthicsPass={setEthicsPass}
            part1MessageKey={part1MessageKey}
            setPart1MessageKey={setPart1MessageKey}
            onShowAlert={showAlert}
            onNextStep={handleNextStep}
          />
        </div>
      )}
      
      {currentStep === 'quality' && (
        <div aria-live="polite">
          <QualityDimensions 
            qualityScores={qualityScores}
            setQualityScores={setQualityScores}
            totalScore={totalQualityScore}
            setTotalScore={setTotalQualityScore}
            qualityPass={qualityPass}
            setQualityPass={setQualityPass}
            onEvaluate={handleQualityEvaluate}
            onGoBack={handleGoBack}
          />
        </div>
      )}
      
      {currentStep === 'overall' && (
        <div aria-live="polite">
          <OverallAssessment 
            ethicsPass={ethicsPass}
            qualityPass={qualityPass}
            totalQualityScore={totalQualityScore}
            part1MessageKey={part1MessageKey}
            qualityInterpretationKey={qualityInterpretationKey}
            onReset={handleReset}
            assessmentData={assessmentData}
            onReturnHome={onReturnHome}
          />
        </div>
      )}
      
      <AlertDialogComponent 
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        message={alertMessage}
      />
    </div>
  );
};

export default AssessmentTool;