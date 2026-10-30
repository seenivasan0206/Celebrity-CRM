import React, { useState, useEffect } from 'react';
import { useCrm } from '../../context/CrmContext';
import { X, Megaphone, Sparkles } from 'lucide-react';

export default function CreateCampaignModal() {
  const { activeModal, closeModal, addCampaign, celebrities, modalPayload } = useCrm();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    celebrity: celebrities[0]?.name || 'Vijay',
    budget: '$150,000',
    deadline: '2026-03-31'
  });

  useEffect(() => {
    if (modalPayload?.celebrity) {
      setFormData((prev) => ({ ...prev, celebrity: modalPayload.celebrity }));
    }
  }, [modalPayload]);

  if (activeModal !== 'createCampaign') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.brand.trim()) return;
    addCampaign(formData);
    // Reset form
    setFormData({
      title: '',
      brand: '',
      celebrity: celebrities[0]?.name || 'Vijay',
      budget: '$150,000',
      deadline: '2026-03-31'
    });
    closeModal();
  };

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)' }}>
              <Megaphone size={20} />
            </div>
            <div>
              <h3>Create Brand Campaign</h3>
              <p>Launch an advertising or endorsement initiative</p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={closeModal}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Campaign Title *</label>
              <input
                type="text"
                className="zenve-input"
                placeholder="e.g. Festive Luxury Watch Campaign"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Brand / Client *</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. Titan Worldwide"
                  required
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Assigned Celebrity</label>
                <select
                  className="zenve-select"
                  value={formData.celebrity}
                  onChange={(e) => setFormData({ ...formData, celebrity: e.target.value })}
                >
                  {celebrities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Total Budget</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. $200,000"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Target Completion Date</label>
                <input
                  type="date"
                  className="zenve-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Launch Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
