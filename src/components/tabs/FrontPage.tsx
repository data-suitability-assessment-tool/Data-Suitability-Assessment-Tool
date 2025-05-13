import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

interface FrontPageProps {
  onStartAssessment: () => void;
}

const FrontPage: React.FC<FrontPageProps> = ({ onStartAssessment }) => {
  const { t } = useTranslation();
  
  return (
    <div 
      id="front-page" 
      role="region" 
      aria-labelledby="front-page-title"
      className="max-w-4xl mx-auto"
    >
      <div className="bg-gradient-to-br from-[var(--primary-color)] to-[var(--secondary-color)] rounded-lg shadow-lg overflow-hidden">
        <div className="p-8 md:p-12 text-white">
          <h1 
            id="front-page-title"
            className="text-3xl md:text-4xl font-bold mb-6 text-center"
          >
            {t('frontPage.title')}
          </h1>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-inner">
            <div className="prose prose-lg prose-invert max-w-none">
              <p className="text-lg">{t('frontPage.intro')}</p>
              <p className="mt-4 text-lg">{t('frontPage.assessmentInfo')}</p>
              
              <ul 
                className="my-6 list-disc pl-6 space-y-2" 
                aria-label={t('frontPage.bulletPoints.label')}
              >
                <li className="text-lg">{t('frontPage.bulletPoints.item1')}</li>
                <li className="text-lg">{t('frontPage.bulletPoints.item2')}</li>
              </ul>
              
              <p className="text-lg">{t('frontPage.usage')}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-lg font-medium text-[var(--primary-color)]">{t('frontPage.contactInfo')}</p>
            <a 
              href="mailto:statcan.sdg-odd.statcan@statcan.gc.ca" 
              className="text-[var(--secondary-color)] hover:underline focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] focus:ring-offset-2 rounded-sm inline-flex items-center mt-2"
              aria-label={t('frontPage.emailAriaLabel')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {t('frontPage.email')}
            </a>
          </div>
          
          <Button 
            onClick={onStartAssessment}
            size="lg"
            className="px-8 py-3 text-lg font-medium transition-all transform hover:scale-105 focus:scale-105"
            aria-label={t('frontPage.startButtonAriaLabel')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {t('frontPage.startButton')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;