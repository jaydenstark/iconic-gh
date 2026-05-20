import React from 'react';
import { Shield, Check, X, User as UserIcon, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/admin/admin.module.css';

interface UserMockProfile {
  name: string;
  email: string;
  role: 'super_admin' | 'editor' | 'journalist' | 'moderator' | 'advertiser' | 'visitor';
  avatar: string;
  bio: string;
}

const MOCK_PROFILES: UserMockProfile[] = [
  {
    name: 'Sarah Jenkins',
    email: 'sarah.j@iconicgh.com',
    role: 'super_admin',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    bio: 'Platform Owner. Responsible for complete operations, database configurations, and security audits.'
  },
  {
    name: 'Alex Rivera',
    email: 'alex.r@iconicgh.com',
    role: 'editor',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    bio: 'Chief Editor. Oversees the editorial board and validates submitted draft news stories.'
  },
  {
    name: 'David Atten',
    email: 'david.a@iconicgh.com',
    role: 'journalist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop',
    bio: 'Lead Journalist. Specializes in environmental advocacy and writing premium investigations.'
  },
  {
    name: 'Elena Rostova',
    email: 'elena.r@iconicgh.com',
    role: 'moderator',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop',
    bio: 'Community Moderator. Monitors comment feeds and engages with public reader discussions.'
  },
  {
    name: 'Sponsoring Brands',
    email: 'partners@iconicgh.com',
    role: 'advertiser',
    avatar: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=100&auto=format&fit=crop',
    bio: 'Advertising Partner. Monopolizes programmatic sponsor banners and links directories.'
  },
  {
    name: 'Guest Reader',
    email: 'visitor@gmail.com',
    role: 'visitor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop',
    bio: 'Public Reader. Follows news tickers, reads articles, and shares reactions with comments.'
  }
];

const MATRIX_ROWS = [
  { name: 'View Performance Analytics', roles: ['super_admin', 'editor', 'visitor'] },
  { name: 'Draft/Write Own Articles', roles: ['super_admin', 'editor', 'journalist'] },
  { name: 'Approve or Reject Articles', roles: ['super_admin', 'editor'] },
  { name: 'Manage Category Folders', roles: ['super_admin', 'editor'] },
  { name: 'Configure Sponsor Ads', roles: ['super_admin', 'advertiser'] },
  { name: 'Review & Delete Comments', roles: ['super_admin', 'editor', 'moderator'] },
  { name: 'Broadcast Push Tickers', roles: ['super_admin', 'editor'] }
];

const ROLE_DISPLAY_NAMES: Record<string, string> = {
  super_admin: 'Super Admin',
  editor: 'Editor',
  journalist: 'Journalist',
  moderator: 'Moderator',
  advertiser: 'Advertiser',
  visitor: 'Visitor'
};

export const Users: React.FC = () => {
  const { user, role, changeRole } = useAuth();

  const handleSwitchProfile = (newRole: UserMockProfile['role']) => {
    changeRole(newRole);
    alert(`Switched current simulated session to: ${ROLE_DISPLAY_NAMES[newRole]}!`);
  };

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>User Profiles & RBAC Switcher</h1>
          <p className={styles.pageSubtitle}>
            Simulate different identity contexts to test standard security constraints.
          </p>
        </div>
      </div>

      {/* Active Profile Info */}
      <div className={styles.bannerEditing} style={{ background: 'rgba(255, 42, 95, 0.04)', borderColor: 'rgba(255, 42, 95, 0.15)', marginBottom: '2rem' }}>
        <div className={styles.bannerText}>
          <Shield size={18} style={{ color: 'var(--primary)', fill: 'rgba(255, 42, 95, 0.1)' }} />
          <span>
            Active Simulated Session: <strong style={{ color: 'var(--primary)' }}>{ROLE_DISPLAY_NAMES[role]}</strong> ({user?.email})
          </span>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <RefreshCw size={12} className="animate-spin" /> Zero-Delay Hot Switch Active
        </div>
      </div>

      {/* Profiles Grid */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <UserIcon size={18} style={{ color: 'var(--primary)' }} /> Select Profile to Switch Role
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem', marginBottom: '3rem' }}>
        {MOCK_PROFILES.map((profile) => {
          const isActive = role === profile.role;
          return (
            <div 
              key={profile.role} 
              onClick={() => handleSwitchProfile(profile.role)}
              className={styles.adPlacementCard}
              style={{
                cursor: 'pointer',
                border: isActive ? '2px solid var(--primary)' : '1px solid var(--border)',
                transition: 'all 0.25s ease',
                backgroundColor: isActive ? 'var(--card-bg-active, rgba(255, 42, 95, 0.02))' : 'var(--card-bg)',
                transform: isActive ? 'translateY(-2px)' : 'none',
                boxShadow: isActive ? '0 10px 20px -5px rgba(255, 42, 95, 0.15)' : 'none'
              }}
            >
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border)' }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{profile.name}</span>
                    <span style={{
                      backgroundColor: isActive ? 'var(--primary)' : 'var(--secondary)',
                      color: isActive ? 'white' : 'var(--muted)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 700
                    }}>
                      {ROLE_DISPLAY_NAMES[profile.role]}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: '0 0 0.5rem 0' }}>{profile.email}</p>
                  <p style={{ fontSize: '0.8rem', color: 'var(--foreground)', lineHeight: '1.4', margin: 0 }}>{profile.bio}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Permissions Matrix */}
      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Shield size={18} style={{ color: 'var(--primary)' }} /> Visual Permissions Matrix
      </h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th} style={{ minWidth: '240px' }}>Capabilities</th>
              {Object.keys(ROLE_DISPLAY_NAMES).map((key) => (
                <th 
                  key={key} 
                  className={styles.th} 
                  style={{ 
                    textAlign: 'center',
                    color: role === key ? 'var(--primary)' : 'var(--foreground)',
                    backgroundColor: role === key ? 'rgba(255, 42, 95, 0.02)' : 'transparent',
                    fontWeight: role === key ? 800 : 600
                  }}
                >
                  {ROLE_DISPLAY_NAMES[key]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX_ROWS.map((row, idx) => (
              <tr key={idx}>
                <td className={styles.td} style={{ fontWeight: 600 }}>{row.name}</td>
                {Object.keys(ROLE_DISPLAY_NAMES).map((rKey) => {
                  const hasPerm = row.roles.includes(rKey);
                  return (
                    <td 
                      key={rKey} 
                      className={styles.td} 
                      style={{ 
                        textAlign: 'center',
                        backgroundColor: role === rKey ? 'rgba(255, 42, 95, 0.01)' : 'transparent'
                      }}
                    >
                      {hasPerm ? (
                        <Check size={18} style={{ color: '#48bb78', display: 'inline-block', strokeWidth: 3 }} />
                      ) : (
                        <X size={16} style={{ color: '#f56565', display: 'inline-block', opacity: 0.4 }} />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
