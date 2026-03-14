import {postJson, requestJson} from './http';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: (email: string, password: string) =>
    postJson<AuthResponse>('/api/auth/login', {email, password}),

  register: (name: string, email: string, password: string) =>
    postJson<AuthResponse>('/api/auth/register', {name, email, password}),

  me: (token: string) =>
    requestJson<User>('/api/auth/me', {
      headers: {Authorization: `Bearer ${token}`},
    }),
};
