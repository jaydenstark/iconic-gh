import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, PlusCircle, Trash2, Edit, Eye, Sparkles, Loader, 
  Laptop, Smartphone, UploadCloud, X, ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Article, Author, ArticlesService } from '@/services/articles';
import { AIService } from '@/services/ai';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/admin/admin.module.css';

interface PostsProps {
  posts: Article[];
  authors: Author[];
  categories: string[];
  simulatedRole: string;
  refreshData: () => Promise<void>;
}

const PRESET_IMAGES = [
  { id: 'tech', label: 'Cyber AI', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop' },
  { id: 'finance', label: 'Global Trade', url: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=600&auto=format&fit=crop' },
  { id: 'world', label: 'Ecosystems', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9cce?q=80&w=600&auto=format&fit=crop' },
  { id: 'general', label: 'Spatial Tech', url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=600&auto=format&fit=crop' }
];

export const Posts: React.FC<PostsProps> = ({
  posts,
  authors,
  categories,
  simulatedRole,
  refreshData
}) => {
  const [viewTab, setViewTab] = useState<'list' | 'composer'>('list');
  
  // Composer Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  
  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Uploader State
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);

  // Preview Mode State
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // AI Assistant Suggestions
  const [suggestedHeadlines, setSuggestedHeadlines] = useState<string[]>([]);
  const [isGeneratingHeadlines, setIsGeneratingHeadlines] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);

  // Pre-fill composer values
  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0]);
    }
    if (authors.length > 0 && !authorName) {
      setAuthorName(authors[0].name);
    }
  }, [categories, authors, category, authorName]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            const randomId = Math.floor(Math.random() * PRESET_IMAGES.length);
            setImageUrl(PRESET_IMAGES[randomId].url);
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 120);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const excerpt = paragraphs[0] ? (paragraphs[0].slice(0, 120) + '...') : '';
    const image = imageUrl || PRESET_IMAGES[0].url;
    const readTime = `${Math.max(1, Math.ceil(content.split(' ').length / 200))} min read`;
    const status = (simulatedRole === 'super_admin' || simulatedRole === 'editor') ? 'approved' : 'pending';

    if (isEditMode && editingPostId) {
      await ArticlesService.updateArticle(editingPostId, {
        title,
        category,
        image,
        excerpt,
        readTime,
        body: paragraphs,
        summary: aiSummary || undefined,
        authorName,
        status
      });
      alert('Article updated successfully!');
    } else {
      await ArticlesService.addArticle({
        title,
        category,
        excerpt,
        image,
        readTime,
        body: paragraphs,
        summary: aiSummary || undefined,
        authorName,
        status
      });
      if (status === 'pending') {
        alert('Article submitted for review! It will be visible once approved by an Editor.');
      } else {
        alert('Article published successfully!');
      }
    }

    resetComposer();
    setViewTab('list');
    await refreshData();
  };

  const resetComposer = () => {
    setTitle('');
    setContent('');
    setImageUrl('');
    setAiSummary('');
    setIsEditMode(false);
    setEditingPostId(null);
    setSuggestedHeadlines([]);
    if (categories.length > 0) setCategory(categories[0]);
    if (authors.length > 0) setAuthorName(authors[0].name);
  };

  const handleEditPost = (post: Article) => {
    setEditingPostId(post.id);
    setIsEditMode(true);
    setTitle(post.title);
    setCategory(post.category);
    setAuthorName(post.author.name);
    setImageUrl(post.image);
    setAiSummary(post.summary || '');
    setContent(post.body.join('\n\n'));
    setViewTab('composer');
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Are you sure you want to delete this article?')) {
      const deleted = await ArticlesService.deleteArticle(id);
      if (deleted) {
        await refreshData();
      }
    }
  };

  const handleOptimizeHeadlines = async () => {
    if (!content) {
      alert('Please write some content first to optimize the headline!');
      return;
    }
    setIsGeneratingHeadlines(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const topics = [category, 'Global Business', 'Next Generation'].filter(Boolean);
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    
    setSuggestedHeadlines([
      `REVEALED: The Real Story Behind ${title || 'This Development'}`,
      `How New Breakthroughs in ${randomTopic} are Changing Everything`,
      `Inside the Revolutionary Shift: What ${title || 'This'} Means for the Public`
    ]);
    setIsGeneratingHeadlines(false);
  };

  const handleGenerateSummary = async () => {
    if (!title || !content) {
      alert('Please fill out the headline and body content first to generate an AI summary!');
      return;
    }
    setIsGeneratingSummary(true);
    try {
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
      const generated = await AIService.summarizeArticle(title, paragraphs);
      setAiSummary(generated);
    } catch (e) {
      console.error(e);
      alert('Failed to generate summary. Please try again.');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleAutoSEOMeta = () => {
    if (!title || !content) {
      alert('Please write a headline and body content to generate SEO meta!');
      return;
    }
    const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
    const summary = paragraphs[0] ? (paragraphs[0].slice(0, 155) + '...') : '';
    setAiSummary(summary);
    alert('SEO meta description generated and loaded into summary!');
  };

  const getWordCount = (text: string) => {
    return text.trim() ? text.trim().split(/\s+/).length : 0;
  };

  const selectedAuthorObj = authors.find(a => a.name === authorName) || authors[0];

  const renderStatusBadge = (status: 'draft' | 'pending' | 'approved' | 'rejected' | undefined) => {
    const s = status || 'pending';
    let bg = 'rgba(113, 128, 150, 0.1)';
    let color = '#718096';
    let text = 'Draft';

    if (s === 'approved') {
      bg = 'rgba(72, 187, 120, 0.1)';
      color = '#48bb78';
      text = 'Approved';
    } else if (s === 'pending') {
      bg = 'rgba(236, 151, 87, 0.1)';
      color = '#ec9757';
      text = 'Pending Review';
    } else if (s === 'rejected') {
      bg = 'rgba(245, 101, 101, 0.1)';
      color = '#f56565';
      text = 'Rejected';
    }

    return (
      <span style={{ 
        backgroundColor: bg, 
        color: color, 
        padding: '0.25rem 0.5rem', 
        borderRadius: '4px', 
        fontSize: '0.75rem', 
        fontWeight: 700,
        display: 'inline-block' 
      }}>
        {text}
      </span>
    );
  };

  const filteredPosts = posts.filter(post => {
    if (simulatedRole === 'journalist') {
      return post.author.name.toLowerCase() === 'sarah jenkins';
    }
    return true;
  });

  return (
    <div>
      {/* Tab Switcher inside the decoupled component */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setViewTab('list')}
          style={{
            background: 'none',
            border: 'none',
            color: viewTab === 'list' ? 'var(--primary)' : 'var(--muted)',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            padding: '0.5rem 1rem',
            borderBottom: viewTab === 'list' ? '2px solid var(--primary)' : 'none'
          }}
        >
          Manage Posts
        </button>
        {(simulatedRole === 'super_admin' || simulatedRole === 'editor' || simulatedRole === 'journalist') && (
          <button 
            onClick={() => {
              if (viewTab !== 'composer') resetComposer();
              setViewTab('composer');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: viewTab === 'composer' ? 'var(--primary)' : 'var(--muted)',
              fontWeight: 700,
              fontSize: '1rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              borderBottom: viewTab === 'composer' ? '2px solid var(--primary)' : 'none'
            }}
          >
            {isEditMode ? 'Edit Article' : 'Write Article'}
          </button>
        )}
      </div>

      {viewTab === 'list' ? (
        <div>
          <div className={styles.header}>
            <div>
              <h1 className={styles.pageTitle}>Manage Articles</h1>
              <p className={styles.pageSubtitle}>Update, edit, or delete editorial news stories.</p>
            </div>
            {(simulatedRole === 'super_admin' || simulatedRole === 'editor' || simulatedRole === 'journalist') && (
              <Button onClick={() => { resetComposer(); setViewTab('composer'); }}>Create Post</Button>
            )}
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Headline</th>
                  <th className={styles.th}>Category</th>
                  <th className={styles.th}>Author</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Views</th>
                  <th className={styles.th}>Status</th>
                  <th className={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((post) => (
                  <tr key={post.id}>
                    <td className={styles.td} style={{ fontWeight: 600 }}>{post.title}</td>
                    <td className={styles.td}>{post.category}</td>
                    <td className={styles.td}>{post.author.name}</td>
                    <td className={styles.td}>{new Date(post.date).toLocaleDateString()}</td>
                    <td className={styles.td}>{post.views.toLocaleString()}</td>
                    <td className={styles.td}>{renderStatusBadge(post.status)}</td>
                    <td className={styles.td}>
                      <div className={styles.actionsCell}>
                        <Link href={`/article/${post.id}`} target="_blank" className={styles.actionBtn} style={{ color: 'var(--muted)', background: 'none', display: 'inline-flex', padding: '4px' }}>
                          <Eye size={16} />
                        </Link>
                        {(simulatedRole === 'super_admin' || simulatedRole === 'editor' || (simulatedRole === 'journalist' && post.author.name.toLowerCase() === 'sarah jenkins')) && (
                          <button 
                            className={styles.actionBtn} 
                            style={{ color: 'var(--foreground)', background: 'none', cursor: 'pointer', border: 'none', padding: '4px' }}
                            onClick={() => handleEditPost(post)}
                            title="Edit Post"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {(simulatedRole === 'super_admin' || simulatedRole === 'editor') && (
                          <button 
                            className={styles.actionBtn} 
                            style={{ color: 'red', background: 'none', cursor: 'pointer', border: 'none', padding: '4px' }}
                            onClick={() => handleDeletePost(post.id)}
                            title="Delete Post"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        {(simulatedRole === 'super_admin' || simulatedRole === 'editor') && post.status !== 'approved' && (
                          <button
                            className={styles.approveBtn}
                            onClick={async () => {
                              await ArticlesService.updateArticle(post.id, { status: 'approved' });
                              alert('Article approved!');
                              await refreshData();
                            }}
                            title="Approve Article"
                          >
                            Approve
                          </button>
                        )}
                        {(simulatedRole === 'super_admin' || simulatedRole === 'editor') && post.status !== 'rejected' && (
                          <button
                            className={styles.rejectBtn}
                            onClick={async () => {
                              await ArticlesService.updateArticle(post.id, { status: 'rejected' });
                              alert('Article rejected.');
                              await refreshData();
                            }}
                            title="Reject Article"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div className={styles.header} style={{ marginBottom: '1.5rem' }}>
            <div>
              <h1 className={styles.pageTitle}>{isEditMode ? 'Edit News Article' : 'Write Premium Article'}</h1>
              <p className={styles.pageSubtitle}>
                {isEditMode ? 'Update article details, headings, and key points.' : 'Draft premium stories and queue them with live side-by-side device previews.'}
              </p>
            </div>
          </div>

          {isEditMode && (
            <div className={styles.bannerEditing}>
              <div className={styles.bannerText}>
                <Sparkles size={16} style={{ color: '#ff2a5f' }} />
                <span>Editing Mode Active: Modifying Article <strong>#{editingPostId}</strong></span>
              </div>
              <button className={styles.bannerCancelBtn} onClick={resetComposer}>
                Cancel Edit
              </button>
            </div>
          )}

          <div className={styles.composerLayout}>
            {/* Left Side: Article Composer Form */}
            <form className={styles.form} onSubmit={handleCreatePost} style={{ maxWidth: '100%' }}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Headline</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Enter a compelling news headline" 
                    className={styles.input}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={handleOptimizeHeadlines}
                    disabled={isGeneratingHeadlines}
                    style={{
                      background: 'var(--secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '6px',
                      padding: '0 1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: 'var(--primary)',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      cursor: 'pointer'
                    }}
                    title="AI Optimise Headline"
                  >
                    {isGeneratingHeadlines ? <Loader size={14} className="animate-spin" /> : <Sparkles size={14} />}
                    Optimize
                  </button>
                </div>
              </div>

              {/* AI Headline Suggestions List */}
              {suggestedHeadlines.length > 0 && (
                <div className={styles.aiAssistantContainer}>
                  <div className={styles.aiAssistantHeader}>
                    <span className={styles.aiHeadlineBadge}>AI Suggested Headlines</span>
                    <button 
                      type="button" 
                      onClick={() => setSuggestedHeadlines([])} 
                      style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                  <ul className={styles.aiSuggestionsList}>
                    {suggestedHeadlines.map((headline, idx) => (
                      <li key={idx}>
                        <button
                          type="button"
                          className={styles.aiSuggestionItem}
                          onClick={() => { setTitle(headline); setSuggestedHeadlines([]); }}
                        >
                          <span>{headline}</span>
                          <ChevronRight size={14} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select 
                    className={styles.select}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Author</label>
                  <select 
                    className={styles.select}
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    required
                  >
                    {authors.map((auth) => (
                      <option key={auth.name} value={auth.name}>{auth.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Featured Visual (Image)</label>
                
                {imageUrl ? (
                  <div className={styles.thumbnailContainer}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Thumbnail preview" className={styles.thumbnailImage} />
                    <button type="button" className={styles.thumbnailRemoveBtn} onClick={() => setImageUrl('')}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <div 
                    className={`${styles.uploaderBox} ${isDragOver ? styles.uploaderActive : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={simulateUpload}
                  >
                    {isUploading ? (
                      <div className={styles.uploaderProgressOverlay}>
                        <div className={styles.progressRingContainer}>
                          <svg width="60" height="60">
                            <circle cx="30" cy="30" r="26" stroke="var(--border)" strokeWidth="4" fill="transparent" />
                            <circle cx="30" cy="30" r="26" stroke="var(--primary)" strokeWidth="4" fill="transparent" 
                                    strokeDasharray={163} strokeDashoffset={163 - (163 * uploadProgress) / 100}
                                    strokeLinecap="round" transform="rotate(-90 30 30)" />
                          </svg>
                          <span className={styles.progressText}>{uploadProgress}%</span>
                        </div>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Simulating Cloudinary Media Sync...</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={32} className={styles.uploadIcon} />
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Drag & Drop Image or Click to Simulated Upload</p>
                          <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginTop: '0.25rem' }}>Supports PNG, JPG, WEBP (simulates compression to 80kb)</p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Preset Unsplash Gallery Selectors */}
                <span className={styles.galleryLabel}>Or choose from Unsplash Premium Presets:</span>
                <div className={styles.galleryGrid}>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      className={imageUrl === preset.url ? styles.galleryCardActive : styles.galleryCard}
                      onClick={() => setImageUrl(preset.url)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={preset.url} alt={preset.label} className={styles.galleryImage} />
                      <div className={styles.galleryOverlay}>{preset.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                  <label className={styles.label} style={{ margin: 0 }}>Article Story Content</label>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      type="button"
                      onClick={handleAutoSEOMeta}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--muted)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      Auto-SEO Meta
                    </button>
                    <button
                      type="button"
                      onClick={handleGenerateSummary}
                      disabled={isGeneratingSummary}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary)',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {isGeneratingSummary ? (
                        <>
                          <Loader size={14} className="animate-spin" /> Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles size={14} /> AI Summary
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <textarea 
                  placeholder="Write the core of your news story here... (Use double empty lines to divide paragraphs)" 
                  className={styles.textarea}
                  style={{ minHeight: '220px' }}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
                <div className={styles.wordCounter}>
                  {getWordCount(content)} words | {content.length} characters
                </div>
              </div>

              {aiSummary && (
                <div className={styles.formGroup} style={{ background: 'rgba(255, 42, 95, 0.05)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255, 42, 95, 0.2)' }}>
                  <label className={styles.label} style={{ color: '#ff2a5f', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Sparkles size={14} /> AI-Generated Key Highlights (Bullet Points)
                  </label>
                  <textarea 
                    className={styles.textarea} 
                    style={{ minHeight: '60px', marginTop: '0.5rem' }} 
                    value={aiSummary}
                    onChange={(e) => setAiSummary(e.target.value)}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem' }}>
                <Button type="submit">
                  {isEditMode ? 'Update Article' : 'Publish Story'}
                </Button>
                <Button type="button" variant="outline" onClick={resetComposer}>
                  Reset
                </Button>
              </div>
            </form>

            {/* Right Side: Real-Time Device Previewer */}
            <div className={styles.previewContainer}>
              <div className={styles.previewHeader}>
                <span className={styles.previewTitle}>
                  <Eye size={16} /> Device Simulator
                </span>
                <div className={styles.previewSelector}>
                  <button
                    type="button"
                    className={previewDevice === 'desktop' ? styles.previewSelectorBtnActive : styles.previewSelectorBtn}
                    onClick={() => setPreviewDevice('desktop')}
                  >
                    <Laptop size={14} /> Desktop
                  </button>
                  <button
                    type="button"
                    className={previewDevice === 'mobile' ? styles.previewSelectorBtnActive : styles.previewSelectorBtn}
                    onClick={() => setPreviewDevice('mobile')}
                  >
                    <Smartphone size={14} /> Mobile
                  </button>
                </div>
              </div>

              {previewDevice === 'desktop' ? (
                /* DESKTOP WRAPPER */
                <div className={styles.desktopFrame}>
                  <div className={styles.simulatedBrowserBar}>
                    <div className={styles.simDot} style={{ backgroundColor: '#ff5f56' }} />
                    <div className={styles.simDot} style={{ backgroundColor: '#ffbd2e' }} />
                    <div className={styles.simDot} style={{ backgroundColor: '#27c93f' }} />
                    <div className={styles.simAddressBar}>iconicgh.com/article/preview</div>
                  </div>
                  <div className={styles.simulatedViewport}>
                    <div className={styles.simArticleHeader}>
                      <span className={styles.simCategory}>{category || 'Category'}</span>
                      <h1 className={styles.simTitle}>{title || 'Placeholder Compelling News Headline'}</h1>
                      
                      <div className={styles.simAuthorRow}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={selectedAuthorObj?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} 
                          alt="Author" 
                          className={styles.simAvatar} 
                        />
                        <div className={styles.simAuthorMeta}>
                          <span className={styles.simAuthorName}>{selectedAuthorObj?.name || 'Journalist'}</span>
                          <span className={styles.simDateMeta}>
                            Published today • {Math.max(1, Math.ceil(content.split(' ').length / 200))} min read
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.simArticleContent}>
                      {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Featured" className={styles.simHeroImage} />
                      )}
                      
                      {aiSummary && (
                        <div className={styles.simAISummary}>
                          <div className={styles.simAISummaryTitle}>
                            <Sparkles size={12} /> AI Quick Key Takeaways
                          </div>
                          <p style={{ fontSize: '0.8rem', fontStyle: 'italic' }}>{aiSummary}</p>
                        </div>
                      )}

                      {content ? (
                        content.split('\n\n').map((para, i) => (
                          <p key={i} className={i === 0 ? styles.simExcerpt : styles.simBodyPara}>{para}</p>
                        ))
                      ) : (
                        <>
                          <p className={styles.simExcerpt}>This first paragraph will serve as a visual excerpt, styled with a distinct accent bar on the left to draw early reader focus.</p>
                          <p className={styles.simBodyPara}>Subsequent paragraphs display standard structural typography for high-end digital reading comfort.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                /* MOBILE WRAPPER */
                <div className={styles.mobileFrame}>
                  <div className={styles.mobileNotch} />
                  <div className={styles.simulatedViewport}>
                    <div className={styles.simArticleHeader} style={{ padding: '1rem 0.75rem' }}>
                      <span className={styles.simCategory} style={{ fontSize: '0.65rem' }}>{category || 'Category'}</span>
                      <h1 className={styles.simTitle} style={{ fontSize: '1.15rem' }}>{title || 'Placeholder Headline'}</h1>
                      
                      <div className={styles.simAuthorRow} style={{ gap: '0.5rem' }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={selectedAuthorObj?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100'} 
                          alt="Author" 
                          className={styles.simAvatar} 
                          style={{ width: '28px', height: '28px' }}
                        />
                        <div className={styles.simAuthorMeta}>
                          <span className={styles.simAuthorName} style={{ fontSize: '0.75rem' }}>{selectedAuthorObj?.name || 'Journalist'}</span>
                          <span className={styles.simDateMeta} style={{ fontSize: '0.65rem' }}>Today • {Math.max(1, Math.ceil(content.split(' ').length / 200))} min read</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.simArticleContent} style={{ padding: '0.75rem' }}>
                      {imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={imageUrl} alt="Featured" className={styles.simHeroImage} />
                      )}

                      {aiSummary && (
                        <div className={styles.simAISummary} style={{ padding: '0.75rem' }}>
                          <div className={styles.simAISummaryTitle} style={{ fontSize: '0.7rem' }}>
                            <Sparkles size={10} /> Key Takeaways
                          </div>
                          <p style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>{aiSummary}</p>
                        </div>
                      )}

                      {content ? (
                        content.split('\n\n').map((para, i) => (
                          <p key={i} className={i === 0 ? styles.simExcerpt : styles.simBodyPara} style={{ fontSize: i === 0 ? '0.8rem' : '0.75rem', paddingLeft: i === 0 ? '0.5rem' : '0' }}>{para}</p>
                        ))
                      ) : (
                        <>
                          <p className={styles.simExcerpt} style={{ fontSize: '0.8rem', paddingLeft: '0.5rem' }}>First paragraphs display styled callout highlights on mobile device viewports.</p>
                          <p className={styles.simBodyPara} style={{ fontSize: '0.75rem' }}>Subsequent bodies display compact readability layouts.</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const PostsPanelWrapper: React.FC = () => {
  const { role } = useAuth();
  const [posts, setPosts] = useState<Article[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const fetchedPosts = await ArticlesService.getArticles();
      const fetchedAuthors = await ArticlesService.getAuthors();
      const fetchedCategories = await ArticlesService.getCategories();
      setPosts(fetchedPosts);
      setAuthors(fetchedAuthors);
      setCategories(fetchedCategories);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading posts manager...</div>;
  }

  return (
    <Posts 
      posts={posts}
      authors={authors}
      categories={categories}
      simulatedRole={role}
      refreshData={refreshData}
    />
  );
};

export default PostsPanelWrapper;
