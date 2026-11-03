import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import {
  Plus,
  ShieldCheck,
  DollarSign,
  Clock,
  RefreshCw,
  Download,
  FileText,
  X,
  User,
  Building,
  CheckCircle2
} from 'lucide-react';

export default function Contracts() {
  const { contracts, openModal, renewContract, addToast } = useCrm();
  const [selectedContract, setSelectedContract] = useState(null);

  // Lock body scroll and prevent background shifting when modal is open
  useEffect(() => {
    if (selectedContract) {
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
  }, [selectedContract]);

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Legal & Commercial Contracts ({(contracts || []).length})</h2>
          <p>Endorsement agreements, terms, compensation clauses, and duration ledgers</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal && openModal('createContract')}
        >
          <Plus size={16} /> Execute New Contract
        </button>
      </div>

      <div className="contract-kpis">
        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--c-accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Active Portfolio</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$1,220,000</h3>
          </div>
        </div>

        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--c-primary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Fully Executed</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{(contracts || []).length} Agreements</h3>
          </div>
        </div>

        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'var(--c-secondary-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary)' }}>
            <Clock size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Renewals Due Q1</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>2 Contracts</h3>
          </div>
        </div>
      </div>

      <div className="crm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="zenve-table" style={{ whiteSpace: 'nowrap' }}>
            <thead>
              <tr>
                <th style={{ whiteSpace: 'nowrap' }}>Contract ID</th>
                <th style={{ whiteSpace: 'nowrap' }}>Celebrity Talent</th>
                <th style={{ whiteSpace: 'nowrap' }}>Client / Agency</th>
                <th style={{ whiteSpace: 'nowrap' }}>Category</th>
                <th style={{ whiteSpace: 'nowrap' }}>Value</th>
                <th style={{ whiteSpace: 'nowrap' }}>Duration</th>
                <th style={{ whiteSpace: 'nowrap' }}>Status</th>
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {(contracts || []).map((c) => (
                <tr key={c.id}>
                  <td
                    style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                    onClick={() => setSelectedContract(c)}
                    title="Click to view legal dossier"
                  >
                    {c.id}
                  </td>
                  <td
                    style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap', cursor: 'pointer' }}
                    onClick={() => setSelectedContract(c)}
                  >
                    {c.celebrity}
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.client}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className="badge badge-primary" style={{ whiteSpace: 'nowrap' }}>{c.category || 'Endorsement'}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--accent)', whiteSpace: 'nowrap' }}>{c.value}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{c.duration}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <span className={`badge ${c.status === 'Active' ? 'badge-accent' : 'badge-secondary'}`} style={{ whiteSpace: 'nowrap' }}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="View Legal Dossier"
                        onClick={() => setSelectedContract(c)}
                      >
                        Dossier
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="Renew Contract for 1 Year"
                        onClick={() => {
                          renewContract && renewContract(c.id);
                        }}
                      >
                        <RefreshCw size={12} color="var(--accent)" /> Renew
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', whiteSpace: 'nowrap' }}
                        title="Download Contract PDF"
                        onClick={() => addToast && addToast(`Downloaded legal brief for ${c.id} (PDF)`, 'info')}
                      >
                        <Download size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================
          CONTRACT LEGAL DOSSIER POP-UP MODAL
          ======================================================== */}
      {selectedContract && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedContract(null)}
          onWheel={(e) => e.stopPropagation()}
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()}
            onWheel={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', overscrollBehavior: 'contain' }}
          >
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0 }}>Contract Agreement Dossier</h3>
                  <p style={{ margin: '2px 0 0' }}>Ref: {selectedContract.id}</p>
                </div>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedContract(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Core Parties Banner */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Celebrity Talent
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedContract.celebrity}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                    Client Brand / Agency
                  </span>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '2px' }}>
                    {selectedContract.client}
                  </div>
                </div>
              </div>

              {/* Stats Strip */}
              <div className="agency-stats-strip">
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--accent)' }}>{selectedContract.value}</strong>
                  <span>Execution Value</span>
                </div>
                <div className="agency-stat-col">
                  <strong>{selectedContract.duration}</strong>
                  <span>Tenure Duration</span>
                </div>
                <div className="agency-stat-col">
                  <strong style={{ color: 'var(--primary)' }}>
                    {selectedContract.category || 'Endorsement'}
                  </strong>
                  <span>Contract Scope</span>
                </div>
              </div>

              {/* Legal Terms & Clauses */}
              <div style={{ background: 'var(--bg-card-alt)', borderRadius: 'var(--radius-md)', padding: '14px', border: '1px solid var(--border-subtle)' }}>
                <h4 style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Execution Scope & Exclusivity Terms
                </h4>
                <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  <li>Category Exclusivity: Non-compete across direct competitor brand segments</li>
                  <li>Territory Scope: Pan-India, Southeast Asia, and Worldwide Digital Streaming Rights</li>
                  <li>Shoot Allocation: Up to 4 production shoot days per 12-month calendar cycle</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer" style={{ padding: '14px 22px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setSelectedContract(null)}
              >
                Close
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    addToast && addToast(`Downloaded legal PDF for ${selectedContract.id}`, 'info');
                  }}
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => {
                    renewContract && renewContract(selectedContract.id);
                    setSelectedContract((prev) => ({
                      ...prev,
                      duration: `${parseInt(prev.duration || '12') + 12} Months`,
                      status: 'Active'
                    }));
                  }}
                >
                  <RefreshCw size={13} /> Renew +12 Mo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
