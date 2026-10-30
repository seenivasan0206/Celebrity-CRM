import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { X, UserPlus, Sparkles } from 'lucide-react';

export default function AddCelebrityModal() {
  const { activeModal, closeModal, addCelebrity } = useCrm();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Actor / Superstar',
    location: 'Chennai',
    email: '',
    phone: '',
    activeContract: '$250,000 / yr',
    followers: '5.0M',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
  });

  if (activeModal !== 'addCelebrity') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    addCelebrity(formData);
    // Reset form
    setFormData({
      name: '',
      category: 'Actor / Superstar',
      location: 'Chennai',
      email: '',
      phone: '',
      activeContract: '$250,000 / yr',
      followers: '5.0M',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
    });
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <UserPlus size={20} />
            </div>
            <div>
              <h3>Add Celebrity / Talent</h3>
              <p>Onboard an artist or public figure to Zenve CRM</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Full Name / Stage Name *</label>
              <input
                type="text"
                className="zenve-input"
                placeholder="e.g. Sivakarthikeyan"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Category / Profession</label>
                <select
                  className="zenve-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Actor / Superstar">Actor / Superstar</option>
                  <option value="Actress / Superstar">Actress / Superstar</option>
                  <option value="Music Composer / Star">Music Composer / Star</option>
                  <option value="Director / Producer">Director / Producer</option>
                  <option value="Athlete / Racer">Athlete / Racer</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Base Location</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. Chennai / Mumbai"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Management Email</label>
                <input
                  type="email"
                  className="zenve-input"
                  placeholder="mgmt@talent.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Phone</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="+91 98400 00000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Social Reach (Followers)</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. 18.5M"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Annual Contract Estimate</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. $280,000 / yr"
                  value={formData.activeContract}
                  onChange={(e) => setFormData({ ...formData, activeContract: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Save Talent
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
