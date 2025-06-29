'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export default function useSubscription() {
  const supabase = createClientComponentClient();
  const { user } = useUser();

  const [hasActiveMembership, setHasActiveMembership] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setHasActiveMembership(false);
      setMembershipLoading(false);
      return;
    }

   
    (async () => {
      setMembershipLoading(true);
      try {
        const { data, error } = await supabase
          .from('subscriptions')
          .select('is_pro, expires_at, status')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })  // loading only the last one from bottom not from top
          .limit(1)
          .single();

        if (error) throw error;

        const now = new Date();
        const notExpired = new Date(data.expires_at) > now; //checking for current left sub
        setHasActiveMembership(data.is_pro && notExpired && data.status === 'active');
        setMembershipLoading(data.status === 'pending' || data.status === 'incomplete');
      } catch (err) {
        console.error(err);
        setError(err as Error);
      } finally {
        setMembershipLoading(false);
      }
    })();
  }, [user]);


  useEffect(() => {
    if(!user)return;
    const checkFiles = async () => {
        setFilesLoading(true)
        const {count, error: err} = await supabase
    }
  })
}
