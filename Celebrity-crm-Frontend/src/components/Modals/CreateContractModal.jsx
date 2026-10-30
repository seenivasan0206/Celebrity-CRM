import React, { useState } from 'react';
import { useCrm } from '../../context/CrmContext';
import { X, FileText, Sparkles } from 'lucide-react';

export default function CreateContractModal() {
  const { activeModal, setActiveModal, addContract, celebrities } = useCrm();

  const [formData, setFormData] = useState({
    celebrity: celebrities[0]?.name || 'Vijay',
    client: '',
    value: '$250,000',
    duration: '12 Months',
    expiryDate: '2026-12-31',
    category: 'Brand Endorsement'
  });

  if (activeModal !== 'createContract') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.client.trim()) return;
    addContract(formData);
    setActiveModal(null);
  };

  return (
    <div className="modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}>
              <FileText size={20} />
            </div>
            <div>
              <h3>Execute Talent Contract</h3>
              <p>Bind legal, brand and talent terms with signature ledger</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
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
                <label className="form-label">Contract Category</label>
                <select
                  className="zenve-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Brand Endorsement">Brand Endorsement</option>
                  <option value="Feature Film Cast">Feature Film Cast</option>
                  <option value="OTT Web Series Exclusive">OTT Web Series Exclusive</option>
                  <option value="Public Appearance / Gala">Public Appearance / Gala</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Client / Production Agency *</label>
              <input
                type="text"
                className="zenve-input"
                placeholder="e.g. Netflix Global Media"
                required
                value={formData.client}
                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
              />
            </div>

            <div className="modal-grid-2">
              <div className="form-group">
                <label className="form-label">Contract Value</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. $300,000"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Term Duration</label>
                <input
                  type="text"
                  className="zenve-input"
                  placeholder="e.g. 18 Months"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> Execute Agreement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

