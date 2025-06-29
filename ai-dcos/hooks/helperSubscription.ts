'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const PRO_LIMIT = 20;
const FREE_LIMIT = 2;

export default function useSubscription() {
  const supabase = createClientComponentClient();
  const { user } = useUser();

  const [hasActiveMembership, setHasActiveMembershop] = useState<boolean | null>(null);
  const [isOverFileLimit, setIsOverFileLimit] = useState(false);
  const [membershipLoading, setMembershipLoading] = useState(true);
  const [filesLoading, setFilesLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);


  useEffect(() => {
    if(!user){
        setHasActiveMembershop(false)
        setMembershipLoading(false)
        return;
    }
    setMembershipLoading(true);
    supabase
    .from
  })
}
