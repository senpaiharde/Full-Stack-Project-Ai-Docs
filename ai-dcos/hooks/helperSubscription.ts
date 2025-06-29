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
}
