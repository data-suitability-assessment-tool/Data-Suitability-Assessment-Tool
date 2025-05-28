// src/components/tabs/AssessmentTool.tsx
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AlertDialogComponent from '../ui/AlertDialog';
import EthicsPrinciples from '../assessment/EthicsPrinciples';
import QualityDimensions from '../assessment/QualityDimensions';
import OverallAssessment from '../assessment/OverallAssessment';

interface AssessmentToolProps {
  onReturnHome?: () => void;
}

const AssessmentTool: React.FC<AssessmentToolProps> = ({ onReturnHome }) => {
  const { t } = useTranslation();
  
  // State for the assessment
  const [currentStep, setCurrentStep] = useState<'ethics' | 'quality' | 'overall'>('ethics');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  
  // Ethics principles state
  const [ethicsAnswers, setEthicsAnswers] = useState<Record<string, string>>({});
  const [ethicsPass, setEthicsPass] = useState<boolean | null>(null);
  const [part1MessageKey, setPart1MessageKey] = useState<string>('');
  
  // Quality dimensions state
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({});
  const [totalQualityScore, setTotalQualityScore] = useState(0);
  const [qualityPass, setQualityPass] = useState<boolean | null>(null);
  const [qualityInterpretationKey, setQualityInterpretationKey] = useState('');
  
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