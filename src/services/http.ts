type JsonValue = null | boolean | number | string | JsonValue[] | {[key: string]: JsonValue};

type RequestOptions = RequestInit & {
  headers?: Record<string, string>;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

const buildUrl = (path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
};

const parseResponse = async (res: Response) => {
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return res.json();
  }
  return res.text();
};

export const requestJson = async <T = JsonValue>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const res = await fetch(buildUrl(path), {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.headers ?? {}),
    },
  });

  const data = await parseResponse(res);

  if (!res.ok) {
    const message =
      (typeof data === 'object' && data && 'error' in data && String((data as any).error)) ||
      (typeof data === 'object' && data && 'message' in data && String((data as any).message)) ||
      (typeof data === 'string' ? data : res.statusText);
    throw new Error(message || 'Request failed');
  }

  return data as T;
};

export const postJson = async <T = JsonValue>(
  path: string,
  body: JsonValue,
  options: RequestOptions = {}
): Promise<T> => {
  return requestJson<T>(path, {
    method: 'POST',
    body: JSON.stringify(body),
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
};
