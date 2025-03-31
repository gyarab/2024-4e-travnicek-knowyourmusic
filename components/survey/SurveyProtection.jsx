"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Higher Order Component to protect survey routes
export default function withSurveyProtection(Component) {
  return function SurveyProtectedComponent(props) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      // Check if the user is authenticated
      if (status === 'unauthenticated') {
        router.replace('/login');
        return;
      }

      // If still loading session, wait
      if (status === 'loading') return;

      // If authenticated, check survey status
      if (session) {
        checkSurveyStatus();
      }
    }, [session, status]);

    const checkSurveyStatus = async () => {
      try {
        const res = await fetch('/api/user/survey-status');
        const data = await res.json();

        // If already completed the survey, redirect to dashboard
        if (data.hasCompletedSurvey && router.pathname === '/artist-selection') {
          router.replace('/dashboard');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking survey status:', error);
        setLoading(false);
      }
    };

    if (loading) {
      // Return loading state
      return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
    }

    return <Component {...props} />;
  };
}