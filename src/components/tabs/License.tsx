import { useTranslation } from 'react-i18next';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '../ui/Table';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

const License = ({ currentYear }: { currentYear: number }) => {
  const { t, i18n } = useTranslation();
  
  // Debug: log the currentYear value
  console.log("Current Year in License component:", currentYear, typeof currentYear);
  
  // Ensure i18n has the correct values for interpolation
  useEffect(() => {
    // Force re-render when language changes or component mounts
    console.log("Current language:", i18n.language);
  }, [i18n.language]);
  
  return (
    <Card className="backdrop-blur-sm bg-white/90 shadow-lg border border-[var(--border-color)] transition-all hover:shadow-xl">
      <CardHeader>
        <CardTitle id="license-title" className="text-2xl text-[var(--primary-color)]">
          {t('license.title')}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-[var(--text-color)] mx-auto mb-6">
          {t('license.intro')}
        </p>
        
        <div className="rounded-lg overflow-hidden shadow-md">
          <Table aria-labelledby="license-title">
            <caption className="sr-only">{t('license.title')}</caption>
            <TableHeader className="text-lg">
              <TableRow>
                <TableHead 
                  className="bg-[var(--primary-color)] text-lg font-medium p-4 w-1/3 text-white"
                  scope="col"
                >
                  {t('license.table.headers.section')}
                </TableHead>
                <TableHead 
                  className="bg-[var(--primary-color)] text-lg font-medium p-4 w-2/3 text-white"
                  scope="col"
                >
                  {t('license.table.headers.details')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-base">
              <TableRow className="bg-white hover:bg-[var(--light-blue)]/30 transition-colors">
                <TableCell className="font-bold text-[var(--primary-color)] p-4 border-b border-[var(--border-color)] align-top">
                  {t('license.table.termsSection')}
                </TableCell>
                <TableCell className="p-4 border-b border-[var(--border-color)]">
                  <div className="license-terms space-y-4">
                    <p>{t('license.table.termsDetails.part1')}</p>
                    <p>{t('license.table.termsDetails.part2')}</p>
                    <p>{t('license.table.termsDetails.part3')}</p>
                  </div>
                </TableCell>
              </TableRow>
              <TableRow className="bg-[var(--light-blue)] hover:bg-[var(--light-blue)]/70 transition-colors">
                <TableCell className="font-bold text-[var(--primary-color)] p-4 align-top">
                  {t('license.table.licenseSection')}
                </TableCell>
                <TableCell className="p-4">
                  <div className="license-details space-y-4">
                    {/* Use updated translation key with double curly braces */}
                    <p className="font-medium">
                      {t('license.table.licenseDetails.copyright', { year: currentYear })}
                    </p>
                    <p>{t('license.table.licenseDetails.part1')}</p>
                    <p>{t('license.table.licenseDetails.part2')}</p>
                    <p>{t('license.table.licenseDetails.part3')}</p>
                  </div>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default License;