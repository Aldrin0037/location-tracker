'use client';

import { useState, useEffect } from 'react';
import { setCookie, getCookie } from '../lib/utils';

export function useCookieConsent() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const consent = getCookie('consent') === 'accepted';
    setHasConsent(consent);
    setIsLoading(false);
  }, []);
  
  const giveConsent = () => {
    setCookie('consent', 'accepted', 365);
    setHasConsent(true);
  };
  
  const revokeConsent = () => {
    setCookie('consent', 'revoked', 365);
    setHasConsent(false);
  };
  
  return {
    hasConsent,
    isLoading,
    giveConsent,
    revokeConsent,
    acceptCookies: giveConsent,
    declineCookies: revokeConsent
  };
}

