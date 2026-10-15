/**
 * Centrally preserves all active URL query parameters (service, upa_id, uid, locale, etc.)
 * when navigating to a new path or route.
 */
export const preserveQueryParams = (targetPath: string): string => {
  if (typeof window === 'undefined' || !window.location) {
    return targetPath;
  }

  const [pathname, targetQuery] = targetPath.split('?');
  const currentParams = new URLSearchParams(window.location.search || '');

  // Normalize legacy 'source' param to 'service'
  if (currentParams.has('source')) {
    const val = currentParams.get('source');
    if (val && !currentParams.has('service')) {
      currentParams.set('service', val);
    }
    currentParams.delete('source');
  }

  // Fallback to cached upa_id if missing from current search
  if (!currentParams.has('upa_id')) {
    try {
      const cachedUpa = sessionStorage.getItem('upa_id') || localStorage.getItem('upa_id');
      if (cachedUpa) currentParams.set('upa_id', cachedUpa);
    } catch (e) {}
  }

  // Fallback to cached uid if missing from current search
  if (!currentParams.has('uid')) {
    try {
      const cachedUid = sessionStorage.getItem('uid') || localStorage.getItem('uid');
      if (cachedUid) currentParams.set('uid', cachedUid);
    } catch (e) {}
  }

  // Fallback to cached user_id if missing from current search
  if (!currentParams.has('user_id') && !currentParams.has('userId')) {
    try {
      const cachedUserId = sessionStorage.getItem('user_id') || localStorage.getItem('user_id');
      if (cachedUserId) currentParams.set('user_id', cachedUserId);
    } catch (e) {}
  }

  // Fallback to cached isB2B if present in storage and not in current search
  if (!currentParams.has('isB2B') && !currentParams.has('is_b2b')) {
    try {
      const cachedB2B = sessionStorage.getItem('isB2B');
      if (cachedB2B === 'true') currentParams.set('isB2B', 'true');
    } catch (e) {}
  }

  // If uid is in the URL, remove email-formatted uids or unnecessary default uids from URL
  if (currentParams.has('uid')) {
    const val = currentParams.get('uid');
    if (val && (val.includes('@') || val === 'ketan.gulati@mantra.care')) {
      currentParams.delete('uid');
    }
  }
  if (currentParams.has('user_id')) {
    const val = currentParams.get('user_id');
    if (val && (val.includes('@') || val === 'ketan.gulati@mantra.care')) {
      currentParams.delete('user_id');
    }
  }

  if (targetQuery) {
    const targetParams = new URLSearchParams(targetQuery);
    targetParams.forEach((value, key) => {
      if (key === 'source') {
        currentParams.set('service', value);
      } else {
        currentParams.set(key, value);
      }
    });
  }

  const mergedSearch = currentParams.toString();
  return mergedSearch ? `${pathname}?${mergedSearch}` : pathname;
};

declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}

/**
 * Centrally detects execution context and handles exit / back actions across all contexts:
 * 1. React Native WebView -> window.ReactNativeWebView.postMessage
 * 2. iframe inside web.mantracare.com -> window.parent.postMessage
 * 3. onBack callback (if provided)
 * 4. onNavigate callback (if provided)
 * 5. In-app history back (if prior SPA history exists)
 * 6. Local dev, LAN IP (192.168.x.x, 10.x.x.x, etc.), or localhost fallback -> /coach/coaching_areas/ or /task/daily-check-in
 * 7. Standalone production browser fallback -> https://web.mantracare.com/tasks
 */
export function handleExit(
  onBackOrService?: (() => void) | string,
  onNavigate?: (path: string) => void,
  service?: string
) {
  if (typeof window === 'undefined') return;

  const onBackCallback = typeof onBackOrService === 'function' ? onBackOrService : undefined;

  const hostname = window.location.hostname;
  const isLocalOrDev = 
    hostname === 'localhost' || 
    hostname === '127.0.0.1' || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    hostname.startsWith('172.') || 
    hostname.endsWith('.local') ||
    hostname.includes('vercel.app') ||
    window.location.port === '5173' ||
    window.location.port === '3000';

  try {
    // 1. Explicit in-app callbacks take top priority
    if (onBackCallback) {
      onBackCallback();
      return;
    }

    if (onNavigate) {
      onNavigate('/coach/coaching_areas/');
      return;
    }

    // 2. React Native WebView
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          action: 'exit'
        })
      );
      return;
    }

    // 3. iframe inside web.mantracare.com (production container)
    if (window.parent && window.parent !== window && !isLocalOrDev) {
      window.parent.postMessage(
        {
          action: 'exit'
        },
        '*'
      );
      return;
    }

    // 4. In-app history: if browser has prior history within the same host origin
    if (
      window.history && 
      window.history.length > 1 && 
      document.referrer && 
      document.referrer.includes(window.location.host)
    ) {
      window.history.back();
      return;
    }

    // 5. Local dev, LAN IP (192.168.x.x, 10.x.x.x, 172.x.x.x), localhost, Vercel, or custom port (e.g. 5173, 3000)
    if (isLocalOrDev) {
      const targetUrl = preserveQueryParams('/coach/coaching_areas/');
      window.location.href = targetUrl;
      return;
    }

    // 6. Standalone production browser fallback
    window.location.href = 'https://web.mantracare.com/tasks';
  } catch (err: any) {
    console.warn('[handleExit] Exit failed:', err);
  }
}

/**
 * Handles back routing, delegating to onBackCallback or handleExit.
 */
export const goBack = (onBackCallback?: () => void) => {
  try {
    if (onBackCallback) {
      onBackCallback();
    } else {
      handleExit();
    }
  } catch (err: any) {
    console.warn('[goBack] Back action failed:', err);
    handleExit();
  }
};

/**
 * Trigger completion webhook for a completed lesson/activity
 */
export const triggerCompletionWebhook = async (lessonId?: string): Promise<boolean> => {
  try {
    const currentParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search || '') : null;
    const upaId = currentParams?.get('upa_id') || 
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('upa_id') : null) || 
      (typeof localStorage !== 'undefined' ? localStorage.getItem('upa_id') : null);
    
    const userId = currentParams?.get('user_id') || currentParams?.get('uid') ||
      (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('user_id') : null) || 
      (typeof localStorage !== 'undefined' ? localStorage.getItem('user_id') : null);

    const payload = {
      lesson_id: lessonId || 'coach_exercise',
      upa_id: upaId || undefined,
      user_id: userId || undefined,
      completed_at: new Date().toISOString(),
      status: 'completed'
    };

    // Post to MantraCare completion endpoint
    const response = await fetch('https://api.mantracare.com/pathway/complete-lesson', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).catch(() => null);

    return response?.ok ?? true;
  } catch (err) {
    console.warn('[triggerCompletionWebhook] Completion webhook warning:', err);
    return false;
  }
};

/**
 * Centrally completes an activity via the completion webhook and then invokes exit/back navigation.
 */
export const completeAndExit = async (lessonId?: string, onBackCallback?: () => void) => {
  try {
    await triggerCompletionWebhook(lessonId);
  } catch (error: any) {
    console.warn('[Navigation] Activity completion warning:', error);
  }
  handleExit(onBackCallback);
};

/**
 * Controls completion redirection actions.
 * First hits the activity completion webhook and then uses handleExit logic.
 */
export const redirectAfterCompletion = async (lessonId?: string, onBackCallback?: () => void) => {
  await completeAndExit(lessonId, onBackCallback);
};
