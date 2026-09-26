const getApiBaseUrl = (): string => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;

  // 1. If explicit production API URL is configured (not pointing to localhost)
  if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
    return envUrl.replace(/\/$/, '');
  }

  // 2. In browser environment
  if (typeof window !== 'undefined') {
    const isLocalhost =
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname === '0.0.0.0';

    // If deployed online (e.g. Vercel, Render) and no external API URL was provided:
    // Use relative '/api' so Next.js rewrites proxy it directly to the backend
    if (!isLocalhost && (!envUrl || envUrl.includes('localhost'))) {
      return '/api';
    }
  }

  // 3. Fallback for local development
  return envUrl || 'http://localhost:5000/api';
};

export async function fetchApi<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; message?: string; data?: T; error?: any; [key: string]: any }> {
  try {
    const baseUrl = getApiBaseUrl();
    const url = endpoint.startsWith('http')
      ? endpoint
      : endpoint.startsWith('/api')
      ? `${baseUrl.replace(/\/api$/, '')}${endpoint}`
      : `${baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const authHeaders: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('frndma_token');
      if (storedToken) {
        authHeaders['Authorization'] = `Bearer ${storedToken}`;
      }
    }

    const response = await fetch(url, {
      ...options,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
        ...(options.headers || {}),
      },
    });

    let data: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = {
        success: response.ok,
        message: text || `Server returned status ${response.status}`,
      };
    }

    if (data && typeof data === 'object') {
      data.status = response.status;
    }

    return data;

  } catch (error) {
    console.error(`API Fetch Error [${endpoint}]:`, error);
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

    return {
      success: false,
      message: isLocal
        ? 'Backend server is not running on port 5000. Please start the backend (`npm run dev` in project root).'
        : 'Cannot connect to backend server. Please verify that NEXT_PUBLIC_API_URL is configured in your deployment settings or that the backend service is running.',
      error,
    };
  }
}
