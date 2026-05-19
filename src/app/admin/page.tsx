'use client';

import React, { useState } from 'react';
import { BarChart2, FileText, PlusCircle, Layout, Bell, Settings, Image as ImageIcon, Trash2, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from '@/components/admin/admin.module.css';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'posts' | 'new-post' | 'ads' | 'push' | 'settings'>('analytics');
  const [posts, setPosts] = useState([
    { id: '1', title: 'The Future of AI: How New Models are Reshaping Industries', category: 'Technology', views: 1420, date: '2026-05-19', status: 'Published' },
    { id: '2', title: 'Global Summit Reaches Historic Agreement on Climate Action', category: 'World', views: 2890, date: '2026-05-18', status: 'Published' },
    { id: '3', title: 'Tech Giant Unveils Revolutionary Mixed Reality Headset', category: 'Business', views: 3110, date: '2026-05-17', status: 'Published' }
  ]);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technology');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scheduleDate, setScheduleDate] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const newPost = {
      id: String(posts.length + 1),
      title,
      category,
      views: 0,
      date: scheduleDate || new Date().toISOString().split('T')[0],
      status: scheduleDate ? 'Scheduled' : 'Published'
    };

    setPosts([newPost, ...posts]);
    setTitle('');
    setContent('');
    setImageUrl('');
    setScheduleDate('');
    setActiveTab('posts');
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter(p => p.id !== id));
  };

  return (
    <div className={styles.adminContainer}>
      {/* Sidebar navigation */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTitle}>Admin Console</div>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button 
            className={activeTab === 'analytics' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={18} /> Analytics
          </button>
          <button 
            className={activeTab === 'posts' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={18} /> Manage Posts
          </button>
          <button 
            className={activeTab === 'new-post' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('new-post')}
          >
            <PlusCircle size={18} /> Write Article
          </button>
          <button 
            className={activeTab === 'ads' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('ads')}
          >
            <Layout size={18} /> Ads Campaigns
          </button>
          <button 
            className={activeTab === 'push' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('push')}
          >
            <Bell size={18} /> Push Alerts
          </button>
          <button 
            className={activeTab === 'settings' ? styles.navButtonActive : styles.navButton}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} /> Platform Settings
          </button>
        </nav>
      </aside>

      {/* Main panel content */}
      <main className={styles.mainContent}>
        {activeTab === 'analytics' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Dashboard Analytics</h1>
                <p className={styles.pageSubtitle}>Real-time performance and audience metrics.</p>
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Eye size={20} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Total Page Views</span>
                  <span className={styles.statValue}>24,892</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><FileText size={20} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Total Articles</span>
                  <span className={styles.statValue}>{posts.length}</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Bell size={20} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Push Subscribers</span>
                  <span className={styles.statValue}>1,824</span>
                </div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statIcon}><Layout size={20} /></div>
                <div className={styles.statInfo}>
                  <span className={styles.statLabel}>Ad Revenue</span>
                  <span className={styles.statValue}>$428.50</span>
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Top Performing Articles</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Headline</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Views</th>
                    <th className={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.slice(0, 3).map((post) => (
                    <tr key={post.id}>
                      <td className={styles.td} style={{ fontWeight: 600 }}>{post.title}</td>
                      <td className={styles.td}>{post.category}</td>
                      <td className={styles.td}>{post.views.toLocaleString()}</td>
                      <td className={styles.td}>
                        <span style={{ color: 'green', fontWeight: 600 }}>{post.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Manage Articles</h1>
                <p className={styles.pageSubtitle}>Update, delete, or review editorial posts.</p>
              </div>
              <Button onClick={() => setActiveTab('new-post')}>Create Post</Button>
            </div>

            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th className={styles.th}>Headline</th>
                    <th className={styles.th}>Category</th>
                    <th className={styles.th}>Date</th>
                    <th className={styles.th}>Views</th>
                    <th className={styles.th}>Status</th>
                    <th className={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map((post) => (
                    <tr key={post.id}>
                      <td className={styles.td} style={{ fontWeight: 600 }}>{post.title}</td>
                      <td className={styles.td}>{post.category}</td>
                      <td className={styles.td}>{post.date}</td>
                      <td className={styles.td}>{post.views}</td>
                      <td className={styles.td}>
                        <span style={{ color: post.status === 'Published' ? 'green' : 'orange', fontWeight: 600 }}>
                          {post.status}
                        </span>
                      </td>
                      <td className={styles.td}>
                        <div className={styles.actionsCell}>
                          <button className={styles.actionBtn} style={{ color: 'var(--muted)', background: 'none' }}>
                            <Edit size={16} />
                          </button>
                          <button 
                            className={styles.actionBtn} 
                            style={{ color: 'red', background: 'none' }}
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'new-post' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Create New Article</h1>
                <p className={styles.pageSubtitle}>Draft premium stories and queue them for publication.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={handleCreatePost}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Article Headline</label>
                <input 
                  type="text" 
                  placeholder="Enter a compelling headline" 
                  className={styles.input}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select 
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Business">Business</option>
                    <option value="Politics">Politics</option>
                    <option value="Sports">Sports</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="World">World</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Schedule Publication</label>
                  <input 
                    type="date" 
                    className={styles.input}
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Featured Image URL (Cloudinary / Unsplash)</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="https://images.unsplash.com/..." 
                    className={styles.input}
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                  <Button type="button" variant="outline" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                    <ImageIcon size={16} /> Upload
                  </Button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Article Body</label>
                <textarea 
                  placeholder="Draft your story here... Supports HTML formatting." 
                  className={styles.textarea}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" style={{ alignSelf: 'flex-start' }}>Publish Article</Button>
            </form>
          </div>
        )}

        {activeTab === 'ads' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Advertisement Management</h1>
                <p className={styles.pageSubtitle}>Monitor and allocate premium ad spaces across the site.</p>
              </div>
            </div>

            <div className={styles.adsGrid}>
              <div className={styles.adPlacementCard}>
                <div className={styles.adHeader}>
                  <span className={styles.adSlotName}>Homepage Top Banner</span>
                  <span className={styles.adStatus}>Active Campaign</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                  <p>Client: Premium Automotives Corp</p>
                  <p>Dimensions: 970x90 Leaderboard</p>
                  <p>Impressions: 12,420 • Clicks: 240</p>
                </div>
                <Button variant="outline" size="sm" style={{ width: 'fit-content' }}>Configure Placement</Button>
              </div>

              <div className={styles.adPlacementCard}>
                <div className={styles.adHeader}>
                  <span className={styles.adSlotName}>Article Sidebar Square</span>
                  <span className={styles.adStatus}>Active Campaign</span>
                </div>
                <div style={{ color: 'var(--muted)', fontSize: '0.875rem' }}>
                  <p>Client: TechAcademy Inc</p>
                  <p>Dimensions: 300x250 Medium Rectangle</p>
                  <p>Impressions: 8,110 • Clicks: 115</p>
                </div>
                <Button variant="outline" size="sm" style={{ width: 'fit-content' }}>Configure Placement</Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'push' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Push Notifications</h1>
                <p className={styles.pageSubtitle}>Broadcast instant alerts to all active subscribers.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('Push Notification Broadcasted successfully!'); }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Alert Title</label>
                <input type="text" placeholder="e.g., BREAKING NEWS" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Notification Message</label>
                <textarea placeholder="Write a short, engaging alert message..." className={styles.textarea} style={{ minHeight: '100px' }} required />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Redirect URL</label>
                <input type="text" placeholder="e.g., https://iconicgh.com/article/1" className={styles.input} />
              </div>
              <Button type="submit" style={{ alignSelf: 'flex-start' }}>Send Push Broadcast</Button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <div className={styles.header}>
              <div>
                <h1 className={styles.pageTitle}>Platform Settings</h1>
                <p className={styles.pageSubtitle}>Configure global SEO parameters and system integrations.</p>
              </div>
            </div>

            <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('Settings saved successfully!'); }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>SEO Settings</h3>
              <div className={styles.formGroup}>
                <label className={styles.label}>Site Title Override</label>
                <input type="text" defaultValue="ICONIC GH | Premium News Platform" className={styles.input} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Default Meta Description</label>
                <textarea defaultValue="Breaking news, deep analysis, and trending stories from around the globe." className={styles.textarea} style={{ minHeight: '80px' }} />
              </div>

              <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginTop: '1.5rem' }}>Cloud Services</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Firebase Project ID</label>
                  <input type="text" defaultValue="iconic-gh-prod" className={styles.input} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Cloudinary Cloud Name</label>
                  <input type="text" defaultValue="iconic-gh-media" className={styles.input} />
                </div>
              </div>

              <Button type="submit" style={{ alignSelf: 'flex-start', marginTop: '1rem' }}>Save Config</Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
