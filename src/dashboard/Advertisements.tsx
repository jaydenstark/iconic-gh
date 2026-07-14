/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { Megaphone, Trash2, Link as LinkIcon, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Advertisement } from '@/services/firebase/types';
import { AdvertisementsService } from '@/services/advertisements';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/admin/admin.module.css';

interface AdvertisementsProps {
  simulatedRole: string;
}

export const Advertisements: React.FC<AdvertisementsProps> = ({
  simulatedRole
}) => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [position, setPosition] = useState<'hero-banner' | 'sidebar-square' | 'footer-banner'>('hero-banner');
  const [durationDays, setDurationDays] = useState('30');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check role authorization: Super Admin and Advertiser are allowed
  const isAuthorized = simulatedRole === 'super_admin' || simulatedRole === 'advertiser';

  const loadAds = async () => {
    try {
      const data = await AdvertisementsService.getAdvertisements();
      setAds(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadAds();
    });
  }, []);

  const handleRegisterAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl || !linkUrl) return;

    setIsSubmitting(true);
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + parseInt(durationDays, 10));

      await AdvertisementsService.addAdvertisement({
        title,
        image: imageUrl,
        link: linkUrl,
        position,
        startDate,
        endDate
      });

      setTitle('');
      setImageUrl('');
      setLinkUrl('');
      await loadAds();
      alert('Advertisement campaign registered successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to register advertisement campaign.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to stop this advertisement campaign?')) {
      return;
    }
    try {
      await AdvertisementsService.deleteAdvertisement(id);
      await loadAds();
      alert('Advertisement campaign stopped and removed.');
    } catch (err) {
      console.error(err);
      alert('Failed to delete campaign.');
    }
  };

  if (!isAuthorized) {
    return (
      <div className={styles.visitorWelcomeCard}>
        <div className={styles.visitorIcon}>
          <Eye size={48} style={{ color: 'var(--primary)' }} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Denied</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
            Your current simulated role is <strong>{simulatedRole}</strong>. Only <strong>Super Admins</strong> and <strong>Advertisers</strong> have permissions to configure sponsorships and programmatic placements across the platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Advertisement Management</h1>
          <p className={styles.pageSubtitle}>Monitor and allocate premium ad spaces across the site.</p>
        </div>
      </div>

      <div className={styles.categoriesWrapper}>
        {/* Ad Creation Form */}
        <div className={styles.categoryFormPanel} style={{ height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <Megaphone size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Launch Ad Campaign</h2>
          </div>

          <form className={styles.form} onSubmit={handleRegisterAd}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Campaign Name / Client Title</label>
              <input 
                type="text" 
                placeholder="e.g., Premium Automotives Corp" 
                className={styles.input} 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Creative Banner Image (URL)</label>
              <input 
                type="url" 
                placeholder="https://images.unsplash.com/... or secure Cloudinary path" 
                className={styles.input} 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Target Sponsoring Link (URL)</label>
              <input 
                type="url" 
                placeholder="https://example.com/sponsorship-target" 
                className={styles.input} 
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Placement Slot</label>
                <select 
                  className={styles.select}
                  value={position}
                  onChange={(e: any) => setPosition(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="hero-banner">Top Leaderboard (970x90)</option>
                  <option value="sidebar-square">Sidebar Rectangle (300x250)</option>
                  <option value="footer-banner">Footer Ticker Slot (728x90)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Campaign Duration</label>
                <select 
                  className={styles.select}
                  value={durationDays}
                  onChange={(e) => setDurationDays(e.target.value)}
                  required
                  disabled={isSubmitting}
                >
                  <option value="7">7 Days Weeklong</option>
                  <option value="30">30 Days Standard</option>
                  <option value="90">90 Days Quarter</option>
                  <option value="365">365 Days Annual</option>
                </select>
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register Campaign'}
            </Button>
          </form>
        </div>

        {/* Ad Placements Grid */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Campaigns</h2>
          <div className={styles.adsGrid} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            {ads.map((ad) => (
              <div key={ad.id} className={styles.adPlacementCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative' }}>
                <div className={styles.adHeader} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className={styles.adSlotName} style={{ fontWeight: 700 }}>{ad.title}</span>
                  <span className={styles.adStatus} style={{
                    backgroundColor: 'rgba(72, 187, 120, 0.1)',
                    color: '#48bb78',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700
                  }}>
                    Active
                  </span>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={ad.image} 
                    alt={ad.title} 
                    style={{ width: '120px', height: '60px', borderRadius: '4px', objectFit: 'cover', border: '1px solid var(--border)' }}
                  />
                  <div style={{ color: 'var(--muted)', fontSize: '0.8rem', flex: 1 }}>
                    <p style={{ margin: '0 0 0.25rem 0' }}>Slot: <strong style={{ color: 'var(--foreground)' }}>{ad.position}</strong></p>
                    <p style={{ margin: '0 0 0.25rem 0' }}>Ends: <strong>{new Date(ad.endDate).toLocaleDateString()}</strong></p>
                    <a href={ad.link} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                      <LinkIcon size={12} /> Target URL
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteAd(ad.id)}
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    background: 'none',
                    border: 'none',
                    color: 'var(--muted)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Remove Campaign"
                >
                  <Trash2 size={16} style={{ color: 'red' }} />
                </button>
              </div>
            ))}
            {ads.length === 0 && (
              <div style={{ padding: '2rem', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '8px', color: 'var(--muted)' }}>
                No active advertisement campaigns registered. Use the panel on the left to set up active sponsoring slots.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdvertisementsPanelWrapper: React.FC = () => {
  const { role } = useAuth();
  return <Advertisements simulatedRole={role} />;
};

export default AdvertisementsPanelWrapper;
