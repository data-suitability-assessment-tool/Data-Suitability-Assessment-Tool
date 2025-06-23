// src/components/assessment/QualityDimensions.tsx
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QUALITY_DIMENSIONS } from '../../types/assessment';
import { Button } from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import TooltipInfo from '../ui/TooltipInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  TableCaption 
} from '../ui/Table';

interface QualityDimensionsProps {
  qualityScores: Record<string, number>;
  setQualityScores: (value: Record<string, number>) => void;
  totalScore: number;
  setTotalScore: (value: number) => void;
  qualityPass: boolean | null;
  setQualityPass: (value: boolean) => void;
  onEvaluate: () => void;
  onGoBack: () => void;
  showResult: boolean;
  setShowResult: (value: boolean) => void;
  qualityInterpretation: string;
  setQualityInterpretation: (value: string) => void;
  criteriaSatisfaction: Record<string, boolean[]>;
  setCriteriaSatisfaction: (value: Record<string, boolean[]>) => void;
}

const QualityDimensions: React.FC<QualityDimensionsProps> = ({
  qualityScores,
  setQualityScores,
  totalScore,
  setTotalScore,
  qualityPass,
  setQualityPass,
  onEvaluate,
  onGoBack,
  showResult,
  setShowResult,
  qualityInterpretation,
  setQualityInterpretation,
  criteriaSatisfaction,
  setCriteriaSatisfaction,
}) => {
  const { t } = useTranslation();
  const resultRef = useRef<HTMLDivElement>(null);

  // Initialize dimensions with default values if not done already
  React.useEffect(() => {
    // Check if we need to initialize
    const needsInitialization = QUALITY_DIMENSIONS.some(dimension => 
      qualityScores[dimension.id] === undefined || !criteriaSatisfaction[dimension.id]
    );
    
    if (needsInitialization) {
      const initialScores = { ...qualityScores };
      const initialCriteria = { ...criteriaSatisfaction };
      
      // Set default values for any uninitialized dimension
      QUALITY_DIMENSIONS.forEach(dimension => {
        if (initialScores[dimension.id] === undefined) {
          initialScores[dimension.id] = 0;
        }
        if (!initialCriteria[dimension.id]) {
          initialCriteria[dimension.id] = new Array(dimension.criteria.length).fill(false);
        }
      });
      
      setQualityScores(initialScores);
      setCriteriaSatisfaction(initialCriteria);
    }
  }, []);

 // const getQualityScoreText = (score: number) => {
 //   if (score === 0) return t('assessment.quality.scoreText.notSufficient');
 //   if (score === 1) return t('assessment.quality.scoreText.low');
 //   if (score === 2) return t('assessment.quality.scoreText.medium');
 //   if (score === 3) return t('assessment.quality.scoreText.high');
 //   return "";
 // };

  const handleCriteriaChange = (dimensionId: string, criteriaIndex: number, checked: boolean) => {
    const newCriteriaSatisfaction = {
      ...criteriaSatisfaction,
      [dimensionId]: [...(criteriaSatisfaction[dimensionId] || [])]
    };
    
    newCriteriaSatisfaction[dimensionId][criteriaIndex] = checked;
    setCriteriaSatisfaction(newCriteriaSatisfaction);
    
    // Calculate new score for this dimension
    const satisfiedCount = newCriteriaSatisfaction[dimensionId].filter(Boolean).length;
    
    // Special case for Accessibility and clarity (dimension 3): 2 criteria satisfied = 3 points
    let score = satisfiedCount;
    if (dimensionId === "3" && satisfiedCount === 2) {
      score = 3;
    }
    
    const newScores = {
      ...qualityScores,
      [dimensionId]: score
    };
    setQualityScores(newScores);
    
    // Update total score
    const newTotalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(newTotalScore);
  };

  const generateQualitySummary = () => {
    return (
      <div className="overflow-hidden rounded-lg shadow-md">
        <Table aria-labelledby="quality-summary-title">
          <TableHeader>
            <TableRow>
              <TableHead>{t('assessment.quality.summary.tableHeaders.dimension')}</TableHead>
              <TableHead className="text-center">{t('assessment.quality.summary.tableHeaders.score')}</TableHead>
              <TableHead>{t('assessment.overall.criteriaSatisfied')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {QUALITY_DIMENSIONS.map((dimension, index) => {
              const score = qualityScores[dimension.id] || 0;
              const criteria = criteriaSatisfaction[dimension.id] || [];
              
              return (
                <TableRow key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <TableCell className="font-bold text-[var(--primary-color)]">{t(`qualityDimensions.dimension${dimension.id}.element`)}</TableCell>
                  <TableCell className="text-start font-semibold">
                    {t('assessment.quality.summary.scoreDisplay', { score: score, maxScore: dimension.maxScore })}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {dimension.criteria.map((_, idx) => (
                        <div key={idx} className={`text-sm font-semibold ${criteria[idx] ? 'text-[var(--success-color)]' : 'text-[var(--error-color)]'}`}>
                          {criteria[idx] ? '✓' : '✗'} {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  };

  const updateQualityResult = () => {
    // Check if any dimension has a score of 0
    const hasZeroScore = QUALITY_DIMENSIONS.some(dimension => 
      qualityScores[dimension.id] === 0
    );
    
    // Fail if any score is 0 or if total score is less than 8
    const isQualityPass = !hasZeroScore && totalScore >= 8;
    setQualityPass(isQualityPass);
    
    let message = '';
    if (hasZeroScore) {
      message = t('assessment.quality.interpretation.fail');
    } else if (totalScore <= 7) {
      message = t('assessment.quality.interpretation.low');
    } else if (totalScore >= 8 && totalScore <= 10) {
      message = t('assessment.quality.interpretation.medium');
    } else if (totalScore >= 11) {
      message = t('assessment.quality.interpretation.high');
    }
    
    setQualityInterpretation(message);
    setShowResult(true);
    
    // Focus on the result section for screen readers
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.focus();
      }
    }, 100);
  };

  const handleEvaluate = () => {
    updateQualityResult();
  };
  
  const handleContinue = () => {
    // Call the parent onEvaluate function to proceed to the next step
    onEvaluate();
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border border-[var(--border-color)] p-6 rounded-lg transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle id="quality-dimensions-title">
          {t('assessment.quality.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="intro-text mb-6">
          <p className="text-lg">
            {t('assessment.quality.intro.intro')}
          </p>
          <ol 
                className="my-6 list-decimal pl-6 space-y-2" 
                aria-label={t('frontPage.bulletPoints.label')}
            >
              <li className="text-lg">{t('assessment.quality.intro.bulletPoints.item1')}</li>
              <li className="text-lg">{t('assessment.quality.intro.bulletPoints.item2')}</li>
              <li className="text-lg">{t('assessment.quality.intro.bulletPoints.item3')}</li>
              <li className="text-lg">{t('assessment.quality.intro.bulletPoints.item4')}</li>
              <li className="text-lg">{t('assessment.quality.intro.bulletPoints.item5')}</li>
            </ol>
          <p className="text-lg">
            {t('assessment.quality.intro.part1')}
          </p>
          <br />
          <p className="text-lg">
            {t('assessment.quality.intro.part2')}
          </p>
        </div>

        <div className="overflow-hidden rounded-lg shadow-md mb-8">
          <Table aria-labelledby="quality-dimensions-title">
            <TableCaption className="sr-only">{t('assessment.quality.table.caption')}</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.elements')}</TableHead>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.definition')}</TableHead>
                <TableHead className="text-lg">{t('assessment.quality.table.headers.criteria')}</TableHead>
                <TableHead className="text-lg text-center">
                  <div className="flex items-center justify-end">
                    {t('assessment.quality.table.headers.answer')}
                    <TooltipInfo id="tooltip-points-info">
                      {t('assessment.quality.table.tooltip.title')}<br />
                      {t('assessment.quality.table.tooltip.high')}<br />
                      {t('assessment.quality.table.tooltip.medium')}<br />
                      {t('assessment.quality.table.tooltip.low')}<br />
                      {t('assessment.quality.table.tooltip.notSufficient')}<br /><br />
                      {t('assessment.quality.table.tooltip.exceptions')}
                    </TooltipInfo>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUALITY_DIMENSIONS.map((dimension, index) => (
                <TableRow key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <TableCell className="text-base font-bold text-[var(--primary-color)]">
                    <span id={`quality-el-${dimension.id}`}>{t(`qualityDimensions.dimension${dimension.id}.element`)}</span>
                  </TableCell>
                  <TableCell className="text-base">{t(`qualityDimensions.dimension${dimension.id}.definition`)}</TableCell>
                  <TableCell id={`quality-crit-${dimension.id}`} className="text-base" colSpan={2}>
                    <div className="dimension-content">
                      {dimension.criteria.map((_, idx) => (
                        <div key={idx} className="criteria-row-unified">
                          <div className="criteria-text-unified">
                            {idx + 1}. {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                          </div>
                          <div className="criteria-checkbox-unified">
                            <label className="flex items-center justify-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={criteriaSatisfaction[dimension.id]?.[idx] || false}
                                onChange={(e) => handleCriteriaChange(dimension.id, idx, e.target.checked)}
                                className="h-4 w-4 text-[var(--primary-color)] focus:ring-[var(--primary-color)] border-gray-300 rounded"
                                aria-describedby={`quality-crit-${dimension.id}`}
                              />
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div 
          className="section-header font-bold mt-8 mb-4 text-xl"
          id="quality-summary-title"
        >
          {t('assessment.quality.summary.title')}
        </div>
        
        <div 
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="quality-summary-title"
          className="transition-all"
        >
          {showResult && generateQualitySummary()}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-6 bg-[var(--light-blue)]/30 p-4 rounded-lg">
            <div>
              <span className="text-lg">
                {t('assessment.quality.summary.totalScore')} <span className="font-bold text-[var(--primary-color)]">
                  {t('assessment.quality.summary.scoreDisplay', { score: totalScore, maxScore: 15 })}
                </span>
              </span>
            </div>
          </div>
          
          {showResult && qualityPass !== null && (
            <div className="mt-5 transform transition-all text-center">
              <ResultCard result={qualityPass ? 'pass' : 'fail'}>
                <span className="block text-center">{qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}</span>
              </ResultCard>
            </div>
          )}
          
          {showResult && qualityInterpretation && (
            <div className="mt-4 italic bg-[var(--light-blue)]/50 p-4 rounded-lg shadow-sm" role="status" aria-live="polite">
              {qualityInterpretation}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="text-center gap-3">
        <Button 
          onClick={onGoBack}
          variant="outline"
          aria-label={t('assessment.quality.actions.goBack')}
          className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
        >
          {t('assessment.quality.actions.goBack')}
        </Button>
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.quality.actions.evaluate')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.quality.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.quality.actions.continue')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.quality.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default QualityDimensions;