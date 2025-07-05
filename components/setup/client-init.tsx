"use client";

import { useEffect } from 'react';
import { useChatStore } from '@/lib/store';
import { getRandomCustomerProfile } from '@/lib/customer-profiles';

export function ClientInit() {
  const { setApiKey, setCurrentCustomer, setUserProfile } = useChatStore();

  useEffect(() => {
    // Set default customer profile
    setCurrentCustomer(getRandomCustomerProfile());
    
    // Load API key from session storage
    const savedApiKey = sessionStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }

    // Load user profile from localStorage
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
      } catch (error) {
        console.error('Error loading user profile:', error);
      }
    }
  }, [setApiKey, setCurrentCustomer, setUserProfile]);

  return null;
}
