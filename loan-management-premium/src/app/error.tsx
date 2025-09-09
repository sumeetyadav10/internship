"use client";

import { useEffect } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <GlassCard className="p-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong!
            </h1>
            
            <p className="text-gray-400 mb-6">
              An error occurred while processing your request. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <GradientButton
                onClick={() => reset()}
                icon={<RefreshCw className="w-4 h-4" />}
                fullWidth
              >
                Try again
              </GradientButton>
              
              <GradientButton
                onClick={() => router.push('/dashboard')}
                variant="secondary"
                icon={<Home className="w-4 h-4" />}
                fullWidth
              >
                Go to Dashboard
              </GradientButton>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <div className="mt-6 w-full p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <p className="text-xs font-mono text-yellow-400 break-words">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-xs text-gray-500 mt-2">
                    Error ID: {error.digest}
                  </p>
                )}
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}