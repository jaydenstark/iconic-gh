import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, FileText, Bell, Layout } from 'lucide-react';
import { Article, ArticlesService } from '@/services/articles';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/admin/admin.module.css';

interface AnalyticsProps {
  posts: Article[];
  simulatedRole: string;
  isPushSubscribed: boolean;
  onRoleChange: (role: any) => void;
}

export const Analytics: React.FC<AnalyticsProps> = ({
  posts,
  simulatedRole,
  isPushSubscribed,
  onRoleChange,
}) => {
  if (simulatedRole === 'visitor') {
    return (
      <div className={styles.visitorWelcomeCard}>
        <div className={styles.visitorIcon}>
          <Eye size={48} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome to the Admin Console</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            You are currently simulating the <strong>Visitor (Public User)</strong> role. In a production environment, public readers do not have access to administrative controls. Use the switcher dropdown above to toggle between the 6 different Role-Based Access Control (RBAC) tiers to test full operational pipelines.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <Link href="/" style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            fontWeight: 600,
            textDecoration: 'none'
          }}>
            Return to Homepage
          </Link>
          <button 
            className="btn btn-outline" 
            onClick={() => onRoleChange('editor')}
            style={{
              background: 'var(--secondary)',
              border: '1px solid var(--border)',
              color: 'var(--foreground)',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Simulate Editor Role
          </button>
        </div>
      </div>
    );
  }

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return (
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
            <span className={styles.statValue}>
              {totalViews.toLocaleString()}
            </span>
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
            <span className={styles.statValue}>{isPushSubscribed ? '1,825' : '1,824'}</span>
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
              <th className={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {[...posts].sort((a, b) => b.views - a.views).slice(0, 3).map((post) => (
              <tr key={post.id}>
                <td className={styles.td} style={{ fontWeight: 600 }}>{post.title}</td>
                <td className={styles.td}>{post.category}</td>
                <td className={styles.td}>{post.views.toLocaleString()}</td>
                <td className={styles.td}>
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AnalyticsPanelWrapper: React.FC = () => {
  const { role, changeRole } = useAuth();
  const [posts, setPosts] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await ArticlesService.getArticles();
        setPosts(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading analytics...</div>;
  }

  return (
    <Analytics 
      posts={posts}
      simulatedRole={role}
      isPushSubscribed={true}
      onRoleChange={changeRole}
    />
  );
};

export default AnalyticsPanelWrapper;
