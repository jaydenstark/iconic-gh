'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import styles from './Article.module.css';

export const Comments = () => {
  const [comments, setComments] = useState([
    { id: 1, author: 'Alex Rivera', text: 'This is an incredibly detailed and well-written analysis. The shift in corporate infrastructure is real.', time: '2 hours ago' },
    { id: 2, author: 'Elena Rostova', text: 'Excellent piece! I am interested to see how standard regulatory commissions will respond to these scaling dynamics.', time: '1 hour ago' }
  ]);
  const [newComment, setNewComment] = useState('');
  const [commentName, setCommentName] = useState('');

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !commentName.trim()) return;

    setComments([
      ...comments,
      {
        id: Date.now(),
        author: commentName,
        text: newComment,
        time: 'Just now'
      }
    ]);
    setNewComment('');
    setCommentName('');
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

      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentAvatar}>
              {comment.author.charAt(0)}
            </div>
            <div className={styles.commentContent}>
              <div className={styles.commentHeader}>
                <span className={styles.commentAuthor}>{comment.author}</span>
                <span className={styles.commentTime}>{comment.time}</span>
              </div>
              <p className={styles.commentText}>{comment.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
