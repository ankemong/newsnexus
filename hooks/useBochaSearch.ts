import { useState, useCallback, useEffect } from 'react';
import { BochaService, BochaApiResponse } from '../services/bochaService';

const TRIAL_COUNT_KEY = 'bocha_trial_count';
const MAX_TRIAL_CALLS = 10;

export const useBochaSearch = (apiKey: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [results, setResults] = useState<BochaApiResponse | null>(null);
  const [trialCount, setTrialCount] = useState<number>(0);

  useEffect(() => {
    try {
      const storedCount = localStorage.getItem(TRIAL_COUNT_KEY);
      setTrialCount(storedCount ? parseInt(storedCount, 10) : 0);
    } catch (e) {
      console.error('Failed to read trial count from localStorage', e);
      setTrialCount(0);
    }
  }, []);

  const search = useCallback(async (query: string) => {
    if (!apiKey) {
      const noApiKeyError = new Error('Bocha API key is not configured.');
      setError(noApiKeyError);
      return;
    }

    if (trialCount >= MAX_TRIAL_CALLS) {
        const limitError = new Error(`Free trial limit of ${MAX_TRIAL_CALLS} calls reached.`);
        setError(limitError);
        return;
    }

    const bocha = new BochaService(apiKey);
    setIsLoading(true);
    setError(null);

    try {
      const response = await bocha.search(query);
      setResults(response);
      const newCount = trialCount + 1;
      setTrialCount(newCount);
      localStorage.setItem(TRIAL_COUNT_KEY, newCount.toString());
      return response;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, trialCount]);

  const resetTrial = () => {
      setTrialCount(0);
      localStorage.setItem(TRIAL_COUNT_KEY, '0');
      setError(null);
      setResults(null);
  }

  return {
    search,
    results,
    isLoading,
    error,
    trialCount,
    maxTrialCalls: MAX_TRIAL_CALLS,
    resetTrial,
  };
};