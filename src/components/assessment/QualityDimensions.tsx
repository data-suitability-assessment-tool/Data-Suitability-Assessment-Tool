// src/components/assessment/QualityDimensions.tsx
import React, { type JSX, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QUALITY_DIMENSIONS } from '../../types/assessment';
import { Button } from '../ui/Button';
import ResultCard from '../ui/ResultCard';
import TooltipInfo from '../ui/TooltipInfo';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/Card';

interface QualityDimensionsProps {
  qualityScores: Record<string, number>;
  setQualityScores: (value: Record<string, number>) => void;
  totalScore: number;
  setTotalScore: (value: number) => void;
  qualityPass: boolean | null;
  setQualityPass: (value: boolean) => void;
  onEvaluate: () => void;
}

const QualityDimensions: React.FC<QualityDimensionsProps> = ({
  qualityScores,
  setQualityScores,
  totalScore,
  setTotalScore,
  qualityPass,
  setQualityPass,
  onEvaluate,
}) => {
  const { t } = useTranslation();
  const [qualitySummary, setQualitySummary] = React.useState<JSX.Element | null>(null);
  const [qualityInterpretation, setQualityInterpretation] = React.useState('');
  const [showResult, setShowResult] = React.useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const getQualityScoreText = (score: number) => {
    if (score === 0) return t('assessment.quality.scoreText.notSufficient');
    if (score === 1) return t('assessment.quality.scoreText.low');
    if (score === 2) return t('assessment.quality.scoreText.medium');
    if (score === 3) return t('assessment.quality.scoreText.high');
    return "";
  };

  const handleScoreChange = (id: string, value: number) => {
    const newScores = {
      ...qualityScores,
      [id]: value
    };
    setQualityScores(newScores);
    
    // Update total score
    const newTotalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
    setTotalScore(newTotalScore);
  };

  const generateQualitySummary = () => {
    return (
      <div className="overflow-hidden rounded-lg shadow-md">
        <table className="w-full border-collapse my-5" aria-labelledby="quality-summary-title">
          <caption className="text-left font-bold mb-2 text-[var(--primary-color)]">{t('assessment.quality.summary.tableCaption')}</caption>
          <thead>
            <tr>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-3 text-left">{t('assessment.quality.summary.tableHeaders.dimension')}</th>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-3 text-center">{t('assessment.quality.summary.tableHeaders.score')}</th>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-3 text-left">{t('assessment.quality.summary.tableHeaders.assessment')}</th>
            </tr>
          </thead>
          <tbody>
            {QUALITY_DIMENSIONS.map((dimension, index) => {
              const score = qualityScores[dimension.id] || 0;
              const assessment = getQualityScoreText(score);
              return (
                <tr key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <th scope="row" className="p-3 border border-[var(--border-color)] font-medium text-left text-[var(--primary-color)]">{t(`qualityDimensions.dimension${dimension.id}.element`)}</th>
                  <td className="p-3 border border-[var(--border-color)] text-center font-semibold">
                    {t('assessment.quality.summary.scoreDisplay', { score: score, maxScore: dimension.maxScore })}
                  </td>
                  <td className="p-3 border border-[var(--border-color)]">{assessment}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const updateQualityResult = () => {
    const isQualityPass = totalScore >= 8;
    setQualityPass(isQualityPass);
    
    let message = '';
    if (totalScore <= 7) {
      message = t('assessment.quality.interpretation.low');
    } else if (totalScore >= 8 && totalScore <= 10) {
      message = t('assessment.quality.interpretation.medium');
    } else if (totalScore >= 11) {
      message = t('assessment.quality.interpretation.high');
    }
    
    setQualityInterpretation(message);
    setQualitySummary(generateQualitySummary());
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
          {t('assessment.quality.intro')}
        </p>
      </div>

      <div className="overflow-hidden rounded-lg shadow-md mb-8">
        <table className="w-full border-collapse" aria-labelledby="quality-dimensions-title">
          <caption className="sr-only">{t('assessment.quality.table.caption')}</caption>
          <thead className="text-lg">
            <tr>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-4 text-left">{t('assessment.quality.table.headers.elements')}</th>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-4 text-left">{t('assessment.quality.table.headers.definition')}</th>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-4 text-left">{t('assessment.quality.table.headers.criteria')}</th>
              <th scope="col" className="bg-[var(--primary-color)] text-white p-4 text-left">
                {t('assessment.quality.table.headers.answer')}
                <TooltipInfo id="tooltip-points-info">
                  {t('assessment.quality.table.tooltip.title')}<br />
                  {t('assessment.quality.table.tooltip.high')}<br />
                  {t('assessment.quality.table.tooltip.medium')}<br />
                  {t('assessment.quality.table.tooltip.low')}<br />
                  {t('assessment.quality.table.tooltip.notSufficient')}
                </TooltipInfo>
              </th>
            </tr>
          </thead>
          <tbody>
            {QUALITY_DIMENSIONS.map((dimension, index) => (
              <tr key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                <th scope="row" className="p-4 border-b border-[var(--border-color)] font-bold text-left text-[var(--primary-color)]">
                  <span id={`quality-el-${dimension.id}`}>{t(`qualityDimensions.dimension${dimension.id}.element`)}</span>
                </th>
                <td className="p-4 border-b border-[var(--border-color)]">{t(`qualityDimensions.dimension${dimension.id}.definition`)}</td>
                <td className="p-4 border-b border-[var(--border-color)]" id={`quality-crit-${dimension.id}`}>
                  {dimension.criteria.map((_, idx) => (
                    <React.Fragment key={idx}>
                      {idx + 1}. {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
                      {idx < dimension.criteria.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </td>
                <td className="p-4 border-b border-[var(--border-color)]">
                  <div className="relative w-full">
                    <select
                      className="w-full p-3 border border-[var(--border-color)] rounded-md shadow-sm appearance-none bg-white transition-all hover:border-[var(--secondary-color)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:border-[var(--secondary-color)]"
                      value={qualityScores[dimension.id] || 0}
                      onChange={(e) => handleScoreChange(dimension.id, parseInt(e.target.value))}
                      aria-labelledby={`quality-el-${dimension.id} quality-crit-${dimension.id}`}
                    >
                      <option value={0}>
                        {t('assessment.quality.table.options.notSufficient')}
                      </option>
                      <option value={1}>{t('assessment.quality.table.options.low')}</option>
                      <option value={2}>{t('assessment.quality.table.options.medium')}</option>
                      <option value={3}>{t('assessment.quality.table.options.high')}</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
        {showResult && qualitySummary}
        
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
      
      <CardFooter className="text-center gap-3">
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
    </CardContent>
    </Card>
  );
};

export default QualityDimensions;