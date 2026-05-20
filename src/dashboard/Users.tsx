'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Check, X, User as UserIcon, RefreshCw, Save, Trash2, UserPlus, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getAuthorsFromStore, saveAuthorsToStore, Author } from '@/services/articles';
import styles from '@/components/admin/admin.module.css';
import articleStyles from '@/components/article/Article.module.css';

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

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop'
];

export const Users: React.FC = () => {
  const { user, role, changeRole } = useAuth();

  // Authors State
  const [authorsList, setAuthorsList] = useState<Author[]>([]);
  const [selectedAuthorIndex, setSelectedAuthorIndex] = useState<number>(-1); // -1 means Create New
  
  // Form states
  const [formName, setFormName] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formAvatar, setFormAvatar] = useState(AVATAR_PRESETS[0]);

  // Load authors on mount
  useEffect(() => {
    setAuthorsList(getAuthorsFromStore());
  }, []);

  // Update form inputs when selected author changes
  useEffect(() => {
    if (selectedAuthorIndex >= 0 && selectedAuthorIndex < authorsList.length) {
      const author = authorsList[selectedAuthorIndex];
      setFormName(author.name);
      setFormBio(author.bio);
      setFormAvatar(author.avatar);
    } else {
      // Clear form for new author
      setFormName('');
      setFormBio('');
      setFormAvatar(AVATAR_PRESETS[0]);
    }
  }, [selectedAuthorIndex, authorsList]);

  const handleSwitchProfile = (newRole: UserMockProfile['role']) => {
    changeRole(newRole);
    alert(`Switched current simulated session to: ${ROLE_DISPLAY_NAMES[newRole]}!`);
  };

  const handleSaveAuthor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      alert('Please provide an author name!');
      return;
    }
    if (!formBio.trim()) {
      alert('Please provide an author biography!');
      return;
    }

    const updatedAuthor: Author = {
      name: formName.trim(),
      bio: formBio.trim(),
      avatar: formAvatar.trim() || AVATAR_PRESETS[0]
    };

    let newAuthorsList = [...authorsList];
    if (selectedAuthorIndex >= 0) {
      // Editing existing author
      newAuthorsList[selectedAuthorIndex] = updatedAuthor;
      alert(`Successfully updated author: ${updatedAuthor.name}!`);
    } else {
      // Check if duplicate name
      if (authorsList.some(a => a.name.toLowerCase() === updatedAuthor.name.toLowerCase())) {
        alert('An author with this name already exists!');
        return;
      }
      // Creating new author
      newAuthorsList.push(updatedAuthor);
      alert(`Successfully added new author: ${updatedAuthor.name}!`);
    }

    setAuthorsList(newAuthorsList);
    saveAuthorsToStore(newAuthorsList);
    // Refresh selector index to show the newly saved author
    if (selectedAuthorIndex < 0) {
      setSelectedAuthorIndex(newAuthorsList.length - 1);
    }
  };

  const handleDeleteAuthor = () => {
    if (selectedAuthorIndex < 0) return;
    const authorName = authorsList[selectedAuthorIndex].name;
    if (window.confirm(`Are you sure you want to remove author ${authorName}?`)) {
      const newAuthorsList = authorsList.filter((_, idx) => idx !== selectedAuthorIndex);
      setAuthorsList(newAuthorsList);
      saveAuthorsToStore(newAuthorsList);
      setSelectedAuthorIndex(-1); // Reset to Create New
      alert(`Removed author: ${authorName}!`);
    }
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
      <div className={styles.tableWrapper} style={{ marginBottom: '3.5rem' }}>
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

      {/* Author Biography Manager Subsection */}
      <div style={{ borderTop: '2px solid var(--border)', paddingTop: '2.5rem', marginTop: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserIcon size={20} style={{ color: 'var(--primary)' }} /> Author Biography Manager
            </h2>
            <p style={{ fontSize: '0.825rem', color: 'var(--muted)', margin: '0.2rem 0 0' }}>
              Configure biographies and professional details of journalists contributing to ICONIC GH.
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setSelectedAuthorIndex(-1)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: selectedAuthorIndex === -1 ? 'var(--primary)' : 'var(--secondary)',
              color: selectedAuthorIndex === -1 ? 'white' : 'var(--foreground)',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              fontWeight: 700,
              fontSize: '0.8rem',
              border: '1px solid var(--border)',
              transition: 'all 0.2s'
            }}
          >
            <UserPlus size={14} /> New Author
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="author-mgr-grid">
          <style jsx global>{`
            @media (min-width: 992px) {
              .author-mgr-grid {
                grid-template-columns: 1.2fr 1fr !important;
              }
            }
          `}</style>

          {/* Form Side */}
          <div style={{ background: 'var(--secondary)', border: '1px solid var(--border)', borderRadius: '10px', padding: '1.5rem' }}>
            <form onSubmit={handleSaveAuthor} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Select Author to Edit
                </label>
                <select
                  value={selectedAuthorIndex}
                  onChange={(e) => setSelectedAuthorIndex(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                >
                  <option value="-1">-- Add New Contributor / Author --</option>
                  {authorsList.map((author, index) => (
                    <option key={index} value={index}>{author.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Author Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. David Atten"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Biography & Title
                </label>
                <textarea
                  placeholder="Write a compelling professional biography of this editor or journalist..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '0.875rem',
                    lineHeight: '1.5',
                    resize: 'vertical',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '0.5rem' }}>
                  Avatar Profile Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.8rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border)',
                    backgroundColor: 'var(--background)',
                    color: 'var(--foreground)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    marginBottom: '0.5rem'
                  }}
                />
                
                {/* Avatar presets quick buttons */}
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <ImageIcon size={12} /> Click Preset:
                  </span>
                  {AVATAR_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormAvatar(preset)}
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundImage: `url('${preset}')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        border: formAvatar === preset ? '2px solid var(--primary)' : '1px solid var(--border)',
                        padding: 0,
                        cursor: 'pointer',
                        transition: 'transform 0.15s'
                      }}
                      title={`Preset Avatar ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '0.65rem 1rem',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  <Save size={16} /> Save Profile
                </button>

                {selectedAuthorIndex >= 0 && (
                  <button
                    type="button"
                    onClick={handleDeleteAuthor}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      backgroundColor: 'rgba(214, 0, 0, 0.08)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(214, 0, 0, 0.2)',
                      padding: '0.65rem 1rem',
                      borderRadius: '6px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Preview Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
              Live Layout Preview (Article Details Card)
            </span>
            
            <div style={{ border: '1px dashed var(--border)', borderRadius: '10px', padding: '1.5rem', background: 'var(--background)' }}>
              {/* Actual Author Biography Card exactly as in Article.tsx */}
              <div className={articleStyles.authorCard} style={{ margin: 0 }}>
                <div 
                  className={articleStyles.authorAvatar} 
                  style={{ backgroundImage: `url('${formAvatar || AVATAR_PRESETS[0]}')` }}
                />
                <div className={articleStyles.authorInfo}>
                  <span className={articleStyles.authorName}>{formName || 'Contributor Name'}</span>
                  <p className={articleStyles.authorBio}>{formBio || 'Write a biography in the form to see it rendered instantly inside this premium live preview frame...'}</p>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(255, 215, 0, 0.05)', border: '1px solid rgba(255, 215, 0, 0.2)', borderRadius: '8px', padding: '1rem', fontSize: '0.8rem', color: 'var(--foreground)' }}>
              <span style={{ fontWeight: 800, color: 'var(--accent, #d4af37)', display: 'block', marginBottom: '0.25rem' }}>
                💡 PERSISTENCE SYNCING ACTIVE
              </span>
              All profiles configured here save directly into standard localized database stores. When a journalist drafts or updates posts, their modified biography card will populate reactively on production article detail pages.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
