// components/layout/Footer.tsx
import { useTranslation } from 'react-i18next'

interface FooterProps {
    year: number
  }
  
  const Footer = ({ year }: FooterProps) => {
    const { t } = useTranslation()
    
    return (
          <footer 
      className="bg-[var(--slate-2)] py-8 mt-auto border-t border-[var(--border-color)]" 
      role="contentinfo"
    >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-center items-center">
            <div className="mb-4 md:mb-0 text-center">
              <p className="text-[var(--slate-11)]">{t('footer.copyright')} {year}</p>
                              <p 
                  className="text-sm text-[var(--slate-9)] mt-2"
                  dangerouslySetInnerHTML={{ __html: t('footer.builtWith') }}
                />
            </div>
          </div>
        </div>
      </footer>
    )
  }
  
  export default Footer