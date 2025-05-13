// components/layout/Footer.tsx
import { useTranslation } from 'react-i18next'

interface FooterProps {
    year: number
  }
  
  const Footer = ({ year }: FooterProps) => {
    const { t } = useTranslation()
    
    return (
      <footer 
        className="bg-gray-50 py-8 mt-auto border-t border-gray-200" 
        role="contentinfo"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-600">{t('footer.copyright')} {year}</p>
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer