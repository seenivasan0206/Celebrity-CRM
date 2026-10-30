import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { X, Camera, Sparkles } from 'lucide-react';

export default function ScheduleShootModal() {
  const { activeModal, setActiveModal, addShoot, celebrities } = useCrm();

  const [formData, setFormData] = useState({
    title: '',
    celebrity: celebrities[0]?.name || 'Vijay',
    location: 'Chennai Studio 4',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    time: '09:00 AM - 05:00 PM',
    director: 'Gautham Menon'
  });

  if (activeModal !== 'scheduleShoot') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) return;
    addShoot(formData);
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}>
              <Camera size={20} />
            </div>
            <div>
              <h3>Schedule Production Shoot</h3>
              <p>Book location, crew, and talent call time</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Shoot Title / Project *</label>
              <input
                type="text"
                className="zenve-input"
                placeholder="e.g. Brand Commercial Day 1"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Celebrity Talent</label>
                <select
                  className="zenve-select"
                  value={formData.celebrity}
                  onChange={(e) => setFormData({ ...formData, celebrity: e.target.value })}
                >
                  {celebrities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Location / Studio *</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. Hyderabad Film City"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. 15 Dec 2025"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Call Time & Duration</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. 08:00 AM - 06:00 PM"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Director / DP In Charge</label>
              <input
                type="text"
                className="zenve-input"
                placeholder="e.g. Lokesh Kanagaraj"
                value={formData.director}
                onChange={(e) => setFormData({ ...formData, director: e.target.value })}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Confirm Shoot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

