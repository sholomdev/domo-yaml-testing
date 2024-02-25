import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';

export function AlertDestructive(description: string) {
  return (
    <Alert className="m-4" variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
