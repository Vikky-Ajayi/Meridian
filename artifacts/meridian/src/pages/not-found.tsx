import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function NotFound() {
  const [_, setLocation] = useLocation();

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <ShieldAlert className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-foreground mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved. 
          Please check the URL or return to our homepage.
        </p>
        <Button 
          onClick={() => setLocation('/')}
          className="rounded-full h-12 px-8 bg-primary hover:bg-primary/90 text-white"
        >
          Return to Homepage
        </Button>
      </div>
    </div>
  );
}
