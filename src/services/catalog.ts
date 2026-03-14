import {requestJson} from './http';

export type CategoryInput =
  | string
  | {
      id?: string | number;
      name?: string;
      title?: string;
      slug?: string;
    };

const normalizeCategory = (item: CategoryInput) => {
  if (typeof item === 'string') return item;
  return item.name || item.title || item.slug || (item.id ? String(item.id) : '');
};

export const catalogApi = {
  getCategories: async (): Promise<string[]> => {
    const data = await requestJson<CategoryInput[]>('/api/categories');
    console.log('Fetched categories:', data);
    return (Array.isArray(data) ? data : [])
      .map(normalizeCategory)
      .filter(Boolean);
  },
};
