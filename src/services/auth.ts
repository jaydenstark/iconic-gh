import { User } from './firebase/types';

export const AuthService = {
  getSimulatedRole(): User['role'] {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('iconic_gh_simulated_role') as User['role']) || 'super_admin';
    }
    return 'super_admin';
  },

  setSimulatedRole(role: User['role']) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('iconic_gh_simulated_role', role);
    }
  },

  getCurrentUser(): User | null {
    if (typeof window !== 'undefined') {
      const role = this.getSimulatedRole();
      return {
        id: 'simulated-user-id',
        name: 'Sarah Jenkins',
        email: 'sarah@iconicgh.com',
        role: role,
        profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
        bio: 'Simulated User for testing RBAC system.',
        createdAt: new Date()
      };
    }
    return null;
  }
};
