'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/services/firebase/types';
import styles from '@/components/admin/admin.module.css';

// Import sub-panels
import PostsPanel from '@/dashboard/Posts';
import CategoriesPanel from '@/dashboard/Categories';
import AnalyticsPanel from '@/dashboard/Analytics';
import UsersPanel from '@/dashboard/Users';
import AdvertisementsPanel from '@/dashboard/Advertisements';
import AIAuthorPanel from '@/dashboard/AIAuthor';

const TAB_LABELS: Record<string, string> = {
  posts: 'Posts Management',
  categories: 'Categories',
  analytics: 'Analytics & Traffic',
  users: 'User Profiles & RBAC',
  advertisements: 'Sponsor Ads',
  aiauthor: '⚡ Iconic AI Author'
};

export const Dashboard = () => {
  const { user, role, changeRole, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('posts');

  // Determine allowed tabs for each role
  const getAllowedTabs = (currentRole: User['role']): string[] => {
    switch (currentRole) {
      case 'super_admin':
        return ['posts', 'categories', 'analytics', 'users', 'advertisements', 'aiauthor'];
      case 'editor':
        return ['posts', 'categories'];
      case 'journalist':
        return ['posts'];
      case 'moderator':
        return ['posts']; // Can review posts/comments
      case 'advertiser':
        return ['advertisements'];
      case 'visitor':
      default:
        return [];
    }
  };

  const allowedTabs = getAllowedTabs(role);

  // Maintain active tab valid within allowed list
  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0]);
    }
  }, [role, allowedTabs, activeTab]);

  if (loading) {
    return (
      <div style={{ padding: '6rem 2rem', textAlign: 'center', color: 'var(--muted)' }}>
        Loading secure panel...
      </div>
    );
  }

  // Format roles for display
  const formatRoleName = (r: string) => {
    return r.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <div className={styles.adminContainer}>
      
      {/* Top Banner with RBAC Simulation Hot-Switcher */}
      <div className={styles.topControlPanel} style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'var(--secondary)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '1rem 1.5rem',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1rem', fontWeight: 800, margin: 0 }}>RBAC Simulation Environment</h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--muted)', margin: '0.2rem 0 0' }}>
            Current simulated identity: <strong>{user?.name}</strong> as <strong>{formatRoleName(role)}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--muted)' }}>Switch Role:</span>
          <select 
            value={role} 
            onChange={(e) => changeRole(e.target.value as User['role'])}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="super_admin">Super Admin</option>
            <option value="editor">Editor</option>
            <option value="journalist">Journalist</option>
            <option value="moderator">Moderator</option>
            <option value="advertiser">Advertiser</option>
            <option value="visitor">Visitor</option>
          </select>
        </div>
      </div>

      <div className={styles.layout}>
        {/* Sidebar Tabs List */}
        {allowedTabs.length > 0 ? (
          <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
              <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--muted)', margin: 0 }}>
                Control center
              </h3>
            </div>
            <nav className={styles.nav}>
              {allowedTabs.map(tab => (
                <button
                  key={tab}
                  className={`${styles.navItem} ${activeTab === tab ? styles.active : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {TAB_LABELS[tab]}
                </button>
              ))}
            </nav>
          </aside>
        ) : (
          <div style={{ flexShrink: 0 }} />
        )}

        {/* Dynamic Mounted Sub-Panel */}
        <main className={styles.mainContent} style={{ flex: 1 }}>
          {role === 'visitor' ? (
            <div style={{
              textAlign: 'center',
              padding: '5rem 2rem',
              border: '1px dashed var(--border)',
              borderRadius: '12px',
              backgroundColor: 'var(--secondary)'
            }}>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h3>
              <p style={{ color: 'var(--muted)', maxWidth: '500px', margin: '0 auto 1.5rem', fontSize: '0.9rem' }}>
                Simulated visitors do not have dashboard editing rights. Switch your active role in the simulation top bar above to explore dashboard actions.
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'posts' && <PostsPanel />}
              {activeTab === 'categories' && <CategoriesPanel />}
              {activeTab === 'analytics' && <AnalyticsPanel />}
              {activeTab === 'users' && <UsersPanel />}
              {activeTab === 'advertisements' && <AdvertisementsPanel />}
              {activeTab === 'aiauthor' && <AIAuthorPanel />}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
