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
  const [part1Message, setPart1Message] = useState('');
  
  // Quality dimensions state
  const [qualityScores, setQualityScores] = useState<Record<string, number>>({});
  const [totalQualityScore, setTotalQualityScore] = useState(0);
  const [qualityPass, setQualityPass] = useState<boolean | null>(null);
  const [qualityInterpretation, setQualityInterpretation] = useState('');
  
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
    }
  };
  
  const handleReset = () => {
    setEthicsAnswers({});
    setEthicsPass(null);
    setPart1Message('');
    setQualityScores({});
    setTotalQualityScore(0);
    setQualityPass(null);
    setQualityInterpretation('');
    setCurrentStep('ethics');
  };
  
  const handleQualityEvaluate = () => {
    const isQualityPass = totalQualityScore >= 8;
    setQualityPass(isQualityPass);
    
    let message = '';
    if (totalQualityScore <= 7) {
      message = t('assessment.quality.interpretation.low');
    } else if (totalQualityScore >= 8 && totalQualityScore <= 10) {
      message = t('assessment.quality.interpretation.medium');
    } else if (totalQualityScore >= 11) {
      message = t('assessment.quality.interpretation.high');
    }
    
    setQualityInterpretation(message);
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
            part1Message={part1Message}
            setPart1Message={setPart1Message}
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
            part1Message={part1Message}
            qualityInterpretation={qualityInterpretation}
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