import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ExportButton() {
  const handleExport = () => {
    window.print();
  };

  return (
    <Button onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export as PDF
    </Button>
  );
}
