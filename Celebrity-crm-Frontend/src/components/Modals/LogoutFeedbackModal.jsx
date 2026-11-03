import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCrm } from '../../context/CrmContext';
import {
  LogOut,
  Star,
  X,
  MessageSquare,
  Sparkles,
  Send,
  Heart,
  CheckCircle2
} from 'lucide-react';

const SUGGESTION_TAGS = [
  '⚡ Faster Shoot Scheduling',
  '🌟 Talent Search & Filters',
  '📄 Contract Workflows',
  '💼 Agency Integrations',
  '🎨 UI & Theme Colors',
  '📱 Mobile Experience'
];

const RATING_LABELS = {
  1: 'Needs Improvement',
  2: 'Could Be Better',
  3: 'Good Experience',
  4: 'Great Platform',
  5: 'Exceptional & Loving it!'
};

export default function LogoutFeedbackModal() {
  const { user, isLogoutModalOpen, closeLogoutModal, logout } = useAuth();
  const { addToast } = useCrm();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState([]);
  const [suggestion, setSuggestion] = useState('');

  // Lock body scroll and prevent background shifting when modal is open
  useEffect(() => {
    if (isLogoutModalOpen) {
      const originalOverflow = document.body.style.overflow;
      const originalPaddingRight = document.body.style.paddingRight;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.overflow = 'hidden';
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = `${scrollBarWidth}px`;
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.paddingRight = originalPaddingRight;
      };
    }
  }, [isLogoutModalOpen]);

  if (!isLogoutModalOpen) return null;

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleDirectLogout = () => {
    closeLogoutModal();
    logout();
    navigate('/login');
    if (addToast) addToast('You have signed out successfully.', 'info');
  };

  const handleSubmitFeedbackAndLogout = (e) => {
    e.preventDefault();

    // Persist suggestion to localStorage for review
    const feedbackPayload = {
      id: Date.now(),
      userName: user?.name || 'Anonymous User',
      userEmail: user?.email || '',
      userRole: user?.role || 'User',
      rating,
      tags: selectedTags,
      suggestion: suggestion.trim() || 'No custom notes provided',
      submittedAt: new Date().toISOString()
    };

    try {
      const existing = JSON.parse(localStorage.getItem('zenve_user_suggestions') || '[]');
      existing.unshift(feedbackPayload);
      localStorage.setItem('zenve_user_suggestions', JSON.stringify(existing.slice(0, 50)));
    } catch (err) {
      console.warn('Feedback save note:', err);
    }

    closeLogoutModal();
    logout();
    navigate('/login');
    if (addToast) {
      addToast(`Thank you for your valuable feedback, ${user?.name || 'Partner'}! See you soon.`, 'success');
    }
  };

  const activeStarCount = hoverRating || rating;

  return (
    <div
      className="modal-overlay"
      onClick={closeLogoutModal}
      onWheel={(e) => e.stopPropagation()}
    >
      <div
        className="modal-dialog"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        style={{ maxWidth: '540px', overscrollBehavior: 'contain' }}
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div
              className="modal-icon-badge"
              style={{ background: 'rgba(234, 179, 8, 0.12)', color: '#EAB308', borderColor: 'rgba(234, 179, 8, 0.25)' }}
            >
              <Heart size={20} fill="#EAB308" />
            </div>
            <div>
              <h3 style={{ margin: 0 }}>Leaving so soon, {user?.name || 'Partner'}?</h3>
              <p style={{ margin: '2px 0 0' }}>Help us make Zenve CRM better with your quick suggestion</p>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={closeLogoutModal}
            title="Stay signed in"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmitFeedbackAndLogout}>
          <div className="modal-body">
            {/* Rating Box */}
            <div
              style={{
                background: 'var(--bg-card-alt)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                How was your experience working on Zenve CRM today?
              </span>

              {/* 5-Star Row */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', margin: '12px 0 6px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '4px',
                      transition: 'transform 0.15s ease'
                    }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  >
                    <Star
                      size={28}
                      color={star <= activeStarCount ? '#EAB308' : 'var(--border-medium)'}
                      fill={star <= activeStarCount ? '#EAB308' : 'transparent'}
                      style={{
                        transform: star <= activeStarCount ? 'scale(1.1)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  </button>
                ))}
              </div>

              <span
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: activeStarCount >= 4 ? 'var(--accent)' : activeStarCount === 3 ? 'var(--primary)' : '#EF4444'
                }}
              >
                {RATING_LABELS[activeStarCount] || 'Good Experience'}
              </span>
            </div>

            {/* Quick Suggestion Pills */}
            <div className="form-group">
              <label className="form-label">What would you like us to improve? (Optional)</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {SUGGESTION_TAGS.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isSelected ? '1px solid var(--primary)' : '1px solid var(--border-subtle)',
                        background: isSelected ? 'var(--primary)' : 'var(--bg-card-alt)',
                        color: isSelected ? '#ffffff' : 'var(--text-muted)'
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Suggestion Textarea */}
            <div className="form-group">
              <label className="form-label">Your Suggestion or Feedback</label>
              <textarea
                className="zenve-input"
                rows={3}
                placeholder="Share any ideas, missing features, or feedback for our engineering team..."
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div
            className="modal-footer"
            style={{
              padding: '14px 22px',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <button
              type="button"
              className="btn-secondary"
              onClick={closeLogoutModal}
              style={{ fontSize: '0.78rem' }}
            >
              Cancel
            </button>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleDirectLogout}
                style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}
              >
                <LogOut size={13} /> Just Sign Out
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ fontSize: '0.78rem' }}
              >
                <Send size={13} /> Submit & Sign Out
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

