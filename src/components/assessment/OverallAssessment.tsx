import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
} from '../ui/Card';
import {
  AlertDialogRoot,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter
} from '../ui/Dialog';
import { ETHICS_PRINCIPLES, QUALITY_DIMENSIONS } from '../../types/assessment';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';

interface OverallAssessmentProps {
  ethicsPass: boolean | null;
  qualityPass: boolean | null;
  totalQualityScore: number;
  part1MessageKey: string;
  qualityInterpretationKey: string;
  onReset: () => void;
  assessmentData: any;
  onReturnHome?: () => void;
}

const OverallAssessment: React.FC<OverallAssessmentProps> = ({
  ethicsPass,
  qualityPass,
  totalQualityScore,
  part1MessageKey,
  qualityInterpretationKey,
  onReset,
  assessmentData,
  onReturnHome
}) => {
  const { t } = useTranslation();
  const [exportDialogOpen, setExportDialogOpen] = React.useState(false);
  const [exportFormat, setExportFormat] = React.useState<'text' | 'json' | 'csv'>('text');
  const [exportContent, setExportContent] = React.useState('');
  const resultSummaryRef = useRef<HTMLDivElement>(null);
  
  const overallPass = ethicsPass && qualityPass;
  
  let resultClass = '';
  let resultText = t('assessment.overall.summary.fail');
  
  if (overallPass) {
    resultClass = 'bg-[var(--success-color)] text-white';
    resultText = t('assessment.overall.summary.pass');
  } else if (ethicsPass && !qualityPass) {
    resultClass = 'bg-[var(--error-color)] text-white';
    resultText = t('assessment.overall.summary.fail');
  } else {
    resultClass = 'bg-[var(--error-color)] text-white';
    resultText = t('assessment.overall.summary.fail');
  }

  // Focus on the summary when component mounts
  useEffect(() => {
    if (resultSummaryRef.current) {
      resultSummaryRef.current.focus();
    }
  }, []);

  const handleExport = () => {
    generateExportContent();
    setExportDialogOpen(true);
  };

  const generateExportContent = () => {
    const date = new Date().toISOString().split('T')[0];
    const part1Message = part1MessageKey ? t(part1MessageKey) : '';
    const qualityInterpretation = qualityInterpretationKey ? t(qualityInterpretationKey) : '';
    const part1ResultText = `${t('assessment.overall.export.ethicsAssessment')}: ${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n${t('assessment.overall.export.message')}: ${part1Message}\n`;
    const qualityResultText = `${t('assessment.overall.export.qualityAssessment')}: ${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')} (${t('assessment.overall.export.score')}: ${totalQualityScore}/15)\n${t('assessment.overall.export.interpretation')}: ${qualityInterpretation}\n`;
    const overallResultText = `${t('assessment.overall.export.result')}: ${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n`;
    
    // Generate overall assessment message
    const overallMessage = overallPass 
      ? t('assessment.overall.messages.bothPass')
      : ethicsPass && !qualityPass
        ? t('assessment.overall.messages.ethicsPassQualityFail')
        : !ethicsPass && qualityPass
          ? t('assessment.overall.messages.ethicsFailQualityPass')
          : t('assessment.overall.messages.bothFail');
    
    let content = '';
    
    if (exportFormat === 'text') {
      content = `${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}\n`;
      content += `${t('assessment.overall.export.date')}: ${date}\n\n`;
      content += `${t('assessment.overall.export.overallResult')}: ${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\n`;
      content += `${t('assessment.overall.export.overallMessage')}: ${overallMessage}\n\n`;
      content += `${t('assessment.overall.export.ethicsPrinciples')}\n`;
      content += part1ResultText + "\n";
      content += `${t('assessment.overall.export.ethicsPrinciplesList')}:\n`;
      for (const [id, answer] of Object.entries(assessmentData.ethicsPrinciples)) {
        const principle = ETHICS_PRINCIPLES.find(p => p.id === id);
        if (principle) {
          const translatedAnswer = answer === "Yes" 
            ? t('assessment.ethics.table.answers.yes') 
            : answer === "No" 
              ? t('assessment.ethics.table.answers.no') 
              : answer || t('assessment.overall.export.notEvaluated');
          content += `- ${t(`ethicsPrinciples.principle${principle.id}.element`)}: ${translatedAnswer}\n`;
        }
      }
      content += `\n${t('assessment.overall.export.qualityDimensions')}\n`;
      content += qualityResultText + "\n";
      content += `${t('assessment.overall.export.qualityDimensionsList')}:\n`;
      
      // Use QUALITY_DIMENSIONS to ensure all dimensions are included with detailed criteria
      for (const dimension of QUALITY_DIMENSIONS) {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        content += `- ${t(`qualityDimensions.dimension${dimension.id}.element`)}: ${score}/3 - ${assessment}\n`;
        
        // Add detailed criteria satisfaction
        const criteriaSatisfied: any[] = [];
        for (let i = 0; i < dimension.criteria.length; i++) {
          if (dimension.id === "3") {
            criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
          } else {
            criteriaSatisfied.push(i < score);
          }
        }
        
        content += `  ${t('assessment.overall.export.criteriaDetails')}:\n`;
        dimension.criteria.forEach((_, idx) => {
          const status = criteriaSatisfied[idx] ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          content += `    ${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: ${status}\n`;
        });
        content += '\n';
      }
      
      content += overallResultText;
    }
    else if (exportFormat === 'json') {
      // Create a complete qualityDimensions object that includes all dimensions with detailed criteria
      const completeQualityDimensions: Record<string, any> = {};
      
      // Initialize all dimensions with detailed information
      QUALITY_DIMENSIONS.forEach(dimension => {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        
        // Calculate criteria satisfaction
        const criteriaSatisfied: any[] = [];
        for (let i = 0; i < dimension.criteria.length; i++) {
          if (dimension.id === "3") {
            criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
          } else {
            criteriaSatisfied.push(i < score);
          }
        }
        
        completeQualityDimensions[dimension.id] = {
          score: score,
          maxScore: 3,
          assessment: getQualityScoreText(Number(score)),
          criteria: dimension.criteria.map((_, idx) => ({
            text: t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`),
            satisfied: criteriaSatisfied[idx]
          }))
        };
      });
      
      // Translate ethics principles answers for JSON export
      const translatedEthicsPrinciples: Record<string, string> = {};
      if (assessmentData.ethicsPrinciples) {
        Object.entries(assessmentData.ethicsPrinciples).forEach(([id, answer]) => {
          translatedEthicsPrinciples[id] = answer === "Yes" 
            ? t('assessment.ethics.table.answers.yes') 
            : answer === "No" 
              ? t('assessment.ethics.table.answers.no') 
              : answer as string || t('assessment.overall.export.notEvaluated');
        });
      }
      
      content = JSON.stringify({
        date,
        overallResult: overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail'),
        overallMessage: overallMessage,
        ethicsPrinciples: translatedEthicsPrinciples,
        qualityDimensions: completeQualityDimensions,
        results: {
          ethicsPass,
          qualityPass,
          overallPass,
          totalQualityScore,
          part1Message,
          qualityInterpretation
        }
      }, null, 2);
    }
    else if (exportFormat === 'csv') {
      // CSV format with detailed criteria information
      content = `${t('mainContent.tabs.assessment')} - ${t('assessment.overall.title')}\r\n\r\n`;
      content += `${t('assessment.overall.export.summaryHeader')}\r\n`;
      content += `${t('assessment.overall.export.category')},${t('assessment.overall.export.result')}\r\n`;
      content += `${t('assessment.overall.export.date')},${date}\r\n`;
      content += `${t('assessment.overall.export.overallResult')},${overallPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.overallMessage')},"${overallMessage.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.ethicsAssessment')},${ethicsPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.message')},"${part1Message.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.qualityAssessment')},${qualityPass ? t('assessment.overall.summary.pass') : t('assessment.overall.summary.fail')}\r\n`;
      content += `${t('assessment.overall.export.interpretation')},"${qualityInterpretation.replace(/"/g, '""')}"\r\n`;
      content += `${t('assessment.overall.export.score')},${totalQualityScore}/15\r\n\r\n`;
      content += `${t('assessment.overall.export.ethicsPrinciples')}\r\n`;
      content += `${t('assessment.overall.export.ethicsPrinciple')},${t('assessment.overall.export.evaluation')}\r\n`;
      
      for (const principle of ETHICS_PRINCIPLES) {
        const answer = assessmentData.ethicsPrinciples[principle.id];
        const translatedAnswer = answer === "Yes" 
          ? t('assessment.ethics.table.answers.yes') 
          : answer === "No" 
            ? t('assessment.ethics.table.answers.no') 
            : answer || t('assessment.overall.export.notEvaluated');
        content += `"${t(`ethicsPrinciples.principle${principle.id}.element`)}","${translatedAnswer}"\r\n`;
      }
      
      content += "\r\n";
      content += `${t('assessment.overall.export.qualityDimensions')}\r\n`;
      content += `${t('assessment.overall.export.qualityDimension')},${t('assessment.overall.export.scoreHeader')},${t('assessment.overall.export.assessment')},${t('assessment.overall.export.criteriaDetails')}\r\n`;
      
      for (const dimension of QUALITY_DIMENSIONS) {
        const score = assessmentData.qualityDimensions[dimension.id] || 0;
        const assessment = getQualityScoreText(Number(score));
        
        // Calculate criteria satisfaction
        const criteriaSatisfied: any[] = [];
        for (let i = 0; i < dimension.criteria.length; i++) {
          if (dimension.id === "3") {
            criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
          } else {
            criteriaSatisfied.push(i < score);
          }
        }
        
        // Create criteria details string
        const criteriaDetails = dimension.criteria.map((_, idx) => {
          const status = criteriaSatisfied[idx] ? t('assessment.overall.export.criteriaStatus.satisfied') : t('assessment.overall.export.criteriaStatus.notSatisfied');
          return `${idx + 1}. ${t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}: ${status}`;
        }).join('; ');
        
        content += `"${t(`qualityDimensions.dimension${dimension.id}.element`)}",${score}/3,"${assessment}","${criteriaDetails.replace(/"/g, '""')}"\r\n`;
      }
    }
    
    setExportContent(content);
  };
  
  // Use useEffect to update the export content whenever the format changes
  useEffect(() => {
    if (exportDialogOpen) {
      generateExportContent();
    }
  }, [exportFormat, exportDialogOpen]);
  
  const getQualityScoreText = (score: number) => {
    if (score === 0) return t('assessment.quality.scoreText.notSufficient');
    if (score === 1) return t('assessment.quality.scoreText.low');
    if (score === 2) return t('assessment.quality.scoreText.medium');
    if (score === 3) return t('assessment.quality.scoreText.high');
    return "";
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(exportContent)
      .then(() => {
        // Show success message or animation
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };
  
  const handleDownload = () => {
    const date = new Date().toISOString().split('T')[0];
    let fileName = `data-quality-assessment-${date}`;
    let mimeType = "";
    
    if (exportFormat === "text") {
      fileName += ".txt";
      mimeType = "text/plain";
    } else if (exportFormat === "json") {
      fileName += ".json";
      mimeType = "application/json";
    } else if (exportFormat === "csv") {
      fileName += ".csv";
      mimeType = "text/csv";
    }
    
    const blob = new Blob([exportContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  const renderEthicsPrinciplesSummary = () => {
    return (
      <div className="mb-8">
        <h3 id="ethics-summary-title" className="text-xl font-semibold mb-4 text-[var(--primary-color)] border-b border-[var(--light-blue)] pb-2">
          {t('assessment.ethics.title')}
        </h3>
        
        <div className={`p-4 rounded-lg mb-4 shadow-md text-center ${ethicsPass ? 'bg-[var(--success-color)] text-white' : 'bg-[var(--error-color)] text-white'}`} role="status">
          <strong className="block text-center">{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</strong>
        </div>
        
        <p className="italic mb-4 bg-[var(--light-blue)]/50 p-3 rounded-lg">{part1MessageKey ? t(part1MessageKey) : ''}</p>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <Table aria-labelledby="ethics-summary-title">
            <caption className="sr-only">{t('assessment.ethics.table.caption')}</caption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.elements')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.answer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ETHICS_PRINCIPLES.map((principle, index) => (
                <TableRow key={principle.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                  <TableCell className="font-bold text-[var(--primary-color)]">{t(`ethicsPrinciples.principle${principle.id}.element`)}</TableCell>
                  <TableCell>
                    {assessmentData.ethicsPrinciples[principle.id] 
                      ? assessmentData.ethicsPrinciples[principle.id] === "Yes"
                        ? t('assessment.ethics.table.answers.yes')
                        : assessmentData.ethicsPrinciples[principle.id] === "No"
                          ? t('assessment.ethics.table.answers.no')
                          : assessmentData.ethicsPrinciples[principle.id] 
                      : t('assessment.overall.export.notEvaluated')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };
  
  const renderQualityDimensionsSummary = () => {
    return (
      <div className="mb-8">
        <h3 id="quality-summary-title" className="text-xl font-semibold mb-4 text-[var(--primary-color)] border-b border-[var(--light-blue)] pb-2">
          {t('assessment.quality.title')}
        </h3>
        
        <div className={`p-4 rounded-lg mb-4 shadow-md text-center ${qualityPass ? 'bg-[var(--success-color)] text-white' : 'bg-[var(--error-color)] text-white'}`} role="status">
          <strong>{qualityPass ? t('assessment.quality.summary.pass') : t('assessment.quality.summary.fail')}</strong>
          <span className="ml-2">{t('assessment.quality.summary.totalScore')} {totalQualityScore}/15</span>
        </div>
        
        <p className="italic mb-4 bg-[var(--light-blue)]/50 p-3 rounded-lg">{qualityInterpretationKey ? t(qualityInterpretationKey) : ''}</p>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <Table aria-labelledby="quality-summary-title">
            <caption className="sr-only">{t('assessment.quality.table.caption')}</caption>
            <TableHeader>
              <TableRow>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.quality.table.headers.elements')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)] text-center">{t('assessment.quality.summary.tableHeaders.score')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.quality.summary.tableHeaders.assessment')}</TableHead>
                <TableHead scope="col" className="bg-[var(--primary-color)]">{t('assessment.overall.criteriaSatisfied')}</TableHead>  
              </TableRow>
            </TableHeader>
            <TableBody>
              {QUALITY_DIMENSIONS.map((dimension, index) => {
                const score = assessmentData.qualityDimensions[dimension.id] || 0;
                const assessment = getQualityScoreText(Number(score));
                
                // Calculate which criteria were satisfied based on the score
                const criteriaSatisfied: any[] = [];
                for (let i = 0; i < dimension.criteria.length; i++) {
                  if (dimension.id === "3") {
                    // Special case for Accessibility and clarity: if score is 3, both criteria are satisfied
                    criteriaSatisfied.push(score === 3 || (score >= 1 && i < score));
                  } else {
                    // Standard case: score equals number of criteria satisfied
                    criteriaSatisfied.push(i < score);
                  }
                }
                
                return (
                  <TableRow key={dimension.id} className={index % 2 === 0 ? "bg-white" : "bg-[var(--light-blue)]"}>
                    <TableCell className="font-bold text-[var(--primary-color)]">{t(`qualityDimensions.dimension${dimension.id}.element`)}</TableCell>
                    <TableCell className="text-start font-semibold">{score}/3</TableCell>
                    <TableCell>{assessment}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {dimension.criteria.map((_, idx) => (
                          <div key={idx} className={`text-sm font-semibold ${criteriaSatisfied[idx] ? 'text-[var(--success-color)]' : 'text-[var(--error-color)]'}`}>
                            {criteriaSatisfied[idx] ? '✓' : '✗'} {t(`qualityDimensions.dimension${dimension.id}.criteria.${idx}`)}
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
      </div>
    );
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border border-[var(--border-color)] transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle id="overall-assessment-title" className="text-2xl">
          {t('assessment.overall.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div 
          ref={resultSummaryRef}
          tabIndex={-1}
          className="mb-6"
          aria-labelledby="overall-assessment-title"
        >
          <div className={`p-5 rounded-lg shadow-md text-center mb-6 ${resultClass}`}>
            <h2 className="text-2xl font-bold text-white">{resultText}</h2>
          </div>
          
          <div className="mt-4 mb-6 italic bg-[var(--light-blue)]/50 p-4 rounded-lg">
            {overallPass 
              ? t('assessment.overall.messages.bothPass')
              : ethicsPass && !qualityPass
                ? t('assessment.overall.messages.ethicsPassQualityFail')
                : !ethicsPass && qualityPass
                  ? t('assessment.overall.messages.ethicsFailQualityPass')
                  : t('assessment.overall.messages.bothFail')
            }
          </div>
          
          {renderEthicsPrinciplesSummary()}
          {renderQualityDimensionsSummary()}
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Button 
              onClick={handleExport}
              className="transform transition-transform hover:scale-105"
              aria-label={t('assessment.overall.export.buttons.export')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {t('assessment.overall.export.buttons.export')}
            </Button>
            
            <Button 
              onClick={onReset}
              variant="secondary"
              className="transform transition-transform hover:scale-105"
              aria-label={t('assessment.overall.actions.reset')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              {t('assessment.overall.actions.reset')}
            </Button>
            
            {onReturnHome && (
              <Button 
                onClick={onReturnHome}
                variant="outline"
                className="transform transition-transform hover:scale-105 border-[var(--primary-color)] text-[var(--primary-color)]"
                aria-label={t('assessment.overall.actions.home')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {t('assessment.overall.actions.home')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
      
      <AlertDialogRoot open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-[var(--primary-color)]">
              {t('assessment.overall.export.title')}
            </AlertDialogTitle>
          </AlertDialogHeader>
          
          <div className="my-4">
            <div className="mb-4">
              <label htmlFor="export-format" className="block text-sm font-medium text-[var(--text-color)]">
                {t('assessment.overall.export.formatLabel')}
              </label>
              <div className="mt-2 flex gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--primary-color)]"
                    name="export-format"
                    value="text"
                    checked={exportFormat === 'text'}
                    onChange={() => setExportFormat('text')}
                  />
                  <span className="ml-2">{t('assessment.overall.export.formats.text')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--primary-color)]"
                    name="export-format"
                    value="json"
                    checked={exportFormat === 'json'}
                    onChange={() => setExportFormat('json')}
                  />
                  <span className="ml-2">{t('assessment.overall.export.formats.json')}</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-[var(--primary-color)]"
                    name="export-format"
                    value="csv"
                    checked={exportFormat === 'csv'}
                    onChange={() => setExportFormat('csv')}
                  />
                  <span className="ml-2">{t('assessment.overall.export.formats.csv')}</span>
                </label>
              </div>
            </div>
            
            <div className="mt-4">
              <label htmlFor="export-content" className="block text-sm font-medium text-[var(--text-color)]">
                {t('assessment.overall.export.preview', 'Preview')}
              </label>
              <div className="mt-2">
                <textarea
                  id="export-content"
                  className="w-full h-64 p-3 border border-[var(--border-color)] rounded-md shadow-sm bg-gray-50 font-mono text-sm"
                  value={exportContent}
                  readOnly
                />
              </div>
            </div>
          </div>
          
          <AlertDialogFooter className="flex justify-end gap-3 mt-6 pt-4 border-t border-[var(--border-color)]">
            <Button 
              onClick={handleCopyToClipboard}
              variant="secondary"
              className="transform transition-transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              {t('assessment.overall.export.buttons.copy')}
            </Button>
            <Button 
              onClick={handleDownload}
              className="transform transition-transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              {t('assessment.overall.export.buttons.download')}
            </Button>
            <Button 
              onClick={() => setExportDialogOpen(false)}
              variant="outline"
              className="border-[var(--primary-color)] text-[var(--primary-color)]"
            >
              {t('assessment.overall.export.buttons.close')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogRoot>
    </Card>
  );
};

export default OverallAssessment;