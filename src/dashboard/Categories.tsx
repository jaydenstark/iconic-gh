import React, { useState, useEffect } from 'react';
import { FolderPlus, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Article, ArticlesService } from '@/services/articles';
import { useAuth } from '@/hooks/useAuth';
import styles from '@/components/admin/admin.module.css';

interface CategoriesProps {
  posts: Article[];
  categories: string[];
  simulatedRole: string;
  refreshData: () => Promise<void>;
}

export const Categories: React.FC<CategoriesProps> = ({
  posts,
  categories,
  simulatedRole,
  refreshData
}) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check role authorization: Super Admin and Editor are allowed
  const isAuthorized = simulatedRole === 'super_admin' || simulatedRole === 'editor';

  const getCategoryArticleCount = (catName: string) => {
    return posts.filter(p => p.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    
    setIsSubmitting(true);
    try {
      await ArticlesService.addCategory(newCategoryName.trim());
      setNewCategoryName('');
      await refreshData();
      alert(`Category "${newCategoryName.trim()}" added successfully!`);
    } catch (err) {
      console.error(err);
      alert('Failed to add category.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (catName: string) => {
    if (!confirm(`Are you sure you want to remove the category "${catName}"?\nThis folder will be removed, but articles in it will remain.`)) {
      return;
    }
    
    try {
      await ArticlesService.deleteCategory(catName);
      await refreshData();
      alert(`Category "${catName}" deleted successfully.`);
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
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
            Your current simulated role is <strong>{simulatedRole}</strong>. Only <strong>Super Admins</strong> and <strong>Editors</strong> have permissions to create or delete category folders on this platform.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Category Settings</h1>
          <p className={styles.pageSubtitle}>Add custom folders or structure feeds on the main site.</p>
        </div>
      </div>

      <div className={styles.categoriesWrapper}>
        {/* Category Creation Form */}
        <div className={styles.categoryFormPanel}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <FolderPlus size={20} style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Add New Category</h2>
          </div>
          
          <form className={styles.form} onSubmit={handleAddCategory}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category Folder Name</label>
              <input 
                type="text" 
                placeholder="e.g., Health, Tech, Culture" 
                className={styles.input} 
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                required 
                disabled={isSubmitting}
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Adding...' : 'Create Folder'}
            </Button>
          </form>
        </div>

        {/* Categories List Grid */}
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.25rem' }}>Active Folders</h2>
          <div className={styles.categoriesGrid}>
            {categories.map((cat) => {
              const count = getCategoryArticleCount(cat);
              return (
                <div key={cat} className={styles.categoryCard}>
                  <div className={styles.categoryCardInfo}>
                    <span className={styles.categoryCardName}>{cat}</span>
                    <span className={styles.categoryCardCount}>
                      {count} {count === 1 ? 'article' : 'articles'}
                    </span>
                  </div>
                  
                  {categories.length > 1 && (
                    <button 
                      className={styles.categoryDeleteBtn}
                      onClick={() => handleDeleteCategory(cat)}
                      title="Delete category"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const CategoriesPanelWrapper: React.FC = () => {
  const { role } = useAuth();
  const [posts, setPosts] = useState<Article[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshData = async () => {
    try {
      const allPosts = await ArticlesService.getArticles();
      const allCats = await ArticlesService.getCategories();
      setPosts(allPosts);
      setCategories(allCats);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      refreshData();
    });
  }, []);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)' }}>Loading categories...</div>;
  }

  return (
    <Categories 
      posts={posts}
      categories={categories}
      simulatedRole={role}
      refreshData={refreshData}
    />
  );
};

export default CategoriesPanelWrapper;
