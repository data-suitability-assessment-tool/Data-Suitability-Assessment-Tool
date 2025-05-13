// src/components/assessment/EthicsPrinciples.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ETHICS_PRINCIPLES } from '../../types/assessment';
import { Button } from '../ui/Button';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter 
} from '../ui/Card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from '../ui/Select';

interface EthicsPrinciplesProps {
  ethicsAnswers: Record<string, string>;
  setEthicsAnswers: (value: Record<string, string>) => void;
  ethicsPass: boolean | null;
  setEthicsPass: (value: boolean) => void;
  part1Message: string;
  setPart1Message: (value: string) => void;
  onShowAlert: (message: string) => void;
  onNextStep: () => void;
}

const EthicsPrinciples: React.FC<EthicsPrinciplesProps> = ({
  ethicsAnswers,
  setEthicsAnswers,
  ethicsPass,
  setEthicsPass,
  part1Message,
  setPart1Message,
  onShowAlert,
  onNextStep,
}) => {
  const { t } = useTranslation();
  const [showResult, setShowResult] = React.useState(false);
  const resultRef = React.useRef<HTMLDivElement>(null);

  const handleAnswerChange = (id: string, value: string) => {
    setEthicsAnswers({
      ...ethicsAnswers,
      [id]: value
    });
  };

  const validateAnswers = () => {
    const requiredPrinciples = ETHICS_PRINCIPLES.map(p => p.id);
    let allValid = true;
    let noAnswers = 0;
    
    for (const id of requiredPrinciples) {
      if (!ethicsAnswers[id] || ethicsAnswers[id] === "unselected") {
        allValid = false;
      } else if (ethicsAnswers[id] === "No") {
        noAnswers++;
      }
    }
    
    if (!allValid) {
      onShowAlert(t('assessment.ethics.alerts.answerAll'));
      return false;
    }
    
    const isPass = noAnswers === 0;
    setEthicsPass(isPass);
    
    // Set message based on result using translation keys
    if (isPass) {
      setPart1Message(t('assessment.ethics.results.passMessage'));
    } else {
      setPart1Message(t('assessment.ethics.results.failMessage'));
    }
    
    setShowResult(true);
    
    // Focus on the result section for screen readers
    setTimeout(() => {
      if (resultRef.current) {
        resultRef.current.focus();
      }
    }, 100);
    
    return true;
  };
  
  const handleEvaluate = () => {
    validateAnswers();
  };
  
  const handleContinue = () => {
    if (showResult) {
      onNextStep();
    } else {
      if (validateAnswers()) {
        onNextStep();
      }
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border border-[var(--border-color)] transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle id="ethics-principles-title" className="text-2xl">
          {t('assessment.ethics.title')}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-5 text-[var(--text-color)]">
          <p className="text-lg">
            {t('assessment.ethics.intro.part1')}
          </p>
          <p className="mt-3 text-[var(--text-color)] opacity-80">
            {t('assessment.ethics.intro.part2')}
          </p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-md">
          <Table>
            <caption className="sr-only">{t('assessment.ethics.table.caption')}</caption>
            <TableHeader className="text-lg">
              <TableRow>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.elements')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.explanation')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.criteria')}</TableHead>
                <TableHead className="bg-[var(--primary-color)]">{t('assessment.ethics.table.headers.answer')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ETHICS_PRINCIPLES.map((principle, index) => (
                <TableRow 
                  key={principle.id} 
                  className={index % 2 === 1 ? "bg-[var(--light-blue)]" : "bg-white"}
                >
                  <TableCell className="font-medium">
                    <strong id={`ethics-el-${principle.id}`} className="text-[var(--primary-color)]">{t(`ethicsPrinciples.principle${principle.id}.element`)}</strong>
                  </TableCell>
                  <TableCell>{t(`ethicsPrinciples.principle${principle.id}.explanation`)}</TableCell>
                  <TableCell id={`ethics-crit-${principle.id}`}>{t(`ethicsPrinciples.principle${principle.id}.criteria`)}</TableCell>
                  <TableCell>
                    <Select
                      value={ethicsAnswers[principle.id] || ""}
                      onValueChange={(value) => handleAnswerChange(principle.id, value)}
                    >
                      <SelectTrigger 
                        className="w-full shadow-sm transition-all hover:border-[var(--secondary-color)]" 
                        aria-labelledby={`ethics-el-${principle.id} ethics-crit-${principle.id}`}
                      >
                        <SelectValue placeholder={t('assessment.ethics.table.answers.select')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unselected">{t('assessment.ethics.table.answers.select')}</SelectItem>
                        <SelectItem value="Yes">{t('assessment.ethics.table.answers.yes')}</SelectItem>
                        <SelectItem value="No">{t('assessment.ethics.table.answers.no')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div 
          className="section-header font-bold mt-8 mb-4 text-xl"
          id="ethics-results-title"
        >
          {t('assessment.ethics.results.title')}
        </div>
        
        <div 
          ref={resultRef}
          tabIndex={-1}
          aria-labelledby="ethics-results-title"
          className="transition-all"
        >
          {showResult && ethicsPass !== null && (
            <div 
              className={`p-4 rounded-lg font-bold mt-5 text-center shadow-md transform transition-all ${
                ethicsPass 
                  ? 'bg-[var(--success-color)] text-white' 
                  : 'bg-[var(--error-color)] text-white'
              }`}
              role="alert"
              aria-live="polite"
            >
              <span className="text-center block">{ethicsPass ? t('assessment.ethics.results.pass') : t('assessment.ethics.results.fail')}</span>
            </div>
          )}

          {showResult && (
            <div className="mt-5 italic bg-[var(--light-blue)]/50 p-4 rounded-lg" role="status" aria-live="polite">
              <p>{part1Message}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="text-center gap-3">
        {!showResult ? (
          <Button 
            onClick={handleEvaluate}
            aria-label={t('assessment.ethics.actions.evaluate')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.ethics.actions.evaluate')}
          </Button>
        ) : (
          <Button 
            onClick={handleContinue}
            aria-label={t('assessment.ethics.actions.continue')}
            className="transform transition-transform hover:scale-105 px-6 py-2.5 text-lg"
          >
            {t('assessment.ethics.actions.continue')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default EthicsPrinciples;