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
            <div>{t('frontPage.titleLine1')}</div>
            <div>{t('frontPage.titleLine2')}</div>
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
              
              <p className="mt-4 text-lg">{t('frontPage.noteToUsers')}</p>

              <p 
                className="mt-4 text-lg"
                dangerouslySetInnerHTML={{ __html: t('frontPage.usage') }}
              ></p>
              
              <p 
                className="mt-4 text-lg"
                dangerouslySetInnerHTML={{ __html: t('frontPage.contactInfo') }}
              ></p>
              
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-12 flex justify-center">
        <Button 
          onClick={onStartAssessment}
          size="lg"
          className="px-12 py-4 text-xl font-semibold transition-all transform hover:scale-105 focus:scale-105 shadow-xl hover:shadow-2xl bg-[var(--primary-color)] border-0 rounded-full cursor-pointer"
          aria-label={t('frontPage.startButtonAriaLabel')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          {t('frontPage.startButton')}
        </Button>
      </div>
    </div>
  );
};

export default FrontPage;