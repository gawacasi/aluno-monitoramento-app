import { useEffect, useState } from 'react';
import { getAuthState } from '../services/auth';

export function useAuth() {
  const [user, setUser] = useState<{
    id: string;
    name: string;
    email: string;
    type: 'professor' | 'aluno';
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const authState = await getAuthState();
        setUser(authState);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadAuthState();
  }, []);

  return {
    user,
    loading,
    isAuthenticated: !!user,
  };
} 