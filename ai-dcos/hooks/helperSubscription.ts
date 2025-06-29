'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export default function useSubscription() {
  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setHasActiveMembership(false);
      setIsOverFileLimit(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch('/api/subscription')
    .then(async (res: Response) => {
      if (!res.ok) throw new Error('error at fetching subscription');
      return res.json() as Promise<{
        hasActiveMembership: boolean;
        fileCount: number;
      }>;
    })
    .then(({hasActiveMembership , fileCount}) => {
        setHasActiveMembership(hasActiveMembership);
        const limit = hasActiveMembership ?  PRO_LIMIT : FREE_LIMIT;
        setIsOverFileLimit(fileCount >= limit)
    })
    .catch((err) => {
        console.error(err)
        setError(err)
    })
    .finally(() => setLoading(false)) 
    
   
  },[user]);
   return {
    hasActiveMembership,
    loading,
    error,
    isOverFileLimit
   }
}
