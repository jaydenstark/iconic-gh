import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth';
import { User } from '@/services/firebase/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const currentUser = AuthService.getCurrentUser();
    Promise.resolve().then(() => {
      setUser(currentUser);
      setLoading(false);
    });

    // Listen to changes
    const handleRoleChange = () => {
      setUser(AuthService.getCurrentUser());
    };

    window.addEventListener('iconic_gh_role_changed', handleRoleChange);
    return () => {
      window.removeEventListener('iconic_gh_role_changed', handleRoleChange);
    };
  }, []);

  const changeRole = (newRole: User['role']) => {
    AuthService.setSimulatedRole(newRole);
    window.dispatchEvent(new Event('iconic_gh_role_changed'));
  };

  return {
    user,
    loading,
    changeRole,
    role: user?.role || 'visitor',
  };
};
