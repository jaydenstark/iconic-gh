'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { ArticlesService, ArticleComment } from '@/services/articles';
import styles from './Article.module.css';

export const Comments = () => {
  const params = useParams();
  const postId = typeof params?.id === 'string' ? params.id : '';

  const [comments, setComments] = useState<ArticleComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadComments = async () => {
      setIsLoading(true);
      try {
        const list = await ArticlesService.getCommentsForArticle(postId);
        setComments(list);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (postId) {
      Promise.resolve().then(() => {
        loadComments();
      });
    }
  }, [postId]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim() || !postId) return;

    try {
      const added = await ArticlesService.addComment(postId, commentName, newComment);
      setComments(prev => [added, ...prev]);
      setNewComment('');
      setCommentName('');
    } catch (err) {
      console.error(err);
      alert('Failed to submit comment.');
    }
  };

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      // eslint-disable-next-line react-hooks/purity
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>Discussion ({comments.length})</h3>
      
      <form className={styles.commentForm} onSubmit={handleCommentSubmit}>
        <input 
          type="text" 
          placeholder="Your name" 
          className={styles.textarea} 
          style={{ minHeight: 'auto', padding: '0.75rem' }}
          value={commentName}
          onChange={(e) => setCommentName(e.target.value)}
          required
        />
        <textarea 
          placeholder="Join the conversation..." 
          className={styles.textarea}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
        />
        <Button type="submit" style={{ alignSelf: 'flex-start' }}>Post Comment</Button>
      </form>

      {isLoading ? (
        <div style={{ color: 'var(--muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
          Loading comments...
        </div>
      ) : (
        <div className={styles.commentsList}>
          {comments.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '0.9rem', fontStyle: 'italic', textAlign: 'center', padding: '1.5rem 0' }}>
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <div className={styles.commentAvatar}>
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div className={styles.commentContent}>
                  <div className={styles.commentHeader}>
                    <span className={styles.commentAuthor}>{comment.authorName}</span>
                    <span className={styles.commentTime}>{formatTime(comment.createdAt)}</span>
                  </div>
                  <p className={styles.commentText}>{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
