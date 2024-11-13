// src/api/authApi.ts
import type { LoginCredentials, AuthResponse } from '../features/auth/types';
import { axiosInstance } from '../services/axios';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

// Fonction utilitaire pour créer un JWT de test
const createMockJWT = (user: User) => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: user.id,
    user: user,
    exp: Math.floor(Date.now() / 1000) + (60 * 60), // expire dans 1 heure
    iat: Math.floor(Date.now() / 1000)
  }));
  const signature = btoa('fake_signature'); // Ne pas faire ça en production !

  return `${header}.${payload}.${signature}`;
};

const mockUser: User = {
  id: '1',
  email: 'test@test.com',
  name: 'Test User',
  role: 'user'
};

const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ data: AuthResponse }> => {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (credentials.email === 'test@test.com' && credentials.password === 'password') {
      const access_token = createMockJWT(mockUser);
      const refresh_token = createMockJWT(mockUser);

      return {
        data: {
          access_token,
          refresh_token,
          token_type: 'Bearer',
          user: mockUser
        }
      };
    }

    throw new Error('Invalid credentials');
  },

  refreshToken: async (refresh_token: string): Promise<{ data: AuthResponse }> => {
    // Vérifier si le refresh token est valide (simulation)
    if (!refresh_token) {
      throw new Error('Invalid refresh token');
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    // En production, vous voudriez valider le refresh_token ici
    // Pour la démo, on génère simplement de nouveaux tokens
    const access_token = createMockJWT(mockUser);
    const new_refresh_token = createMockJWT(mockUser);

    return {
      data: {
        access_token,
        refresh_token: new_refresh_token,
        token_type: 'Bearer',
        user: mockUser
      }
    };
  },

  logout: async () => {
    return axiosInstance.post('/auth/logout');
  }
};

export default authApi;
