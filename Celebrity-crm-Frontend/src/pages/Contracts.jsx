import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Plus, ShieldCheck, DollarSign, Clock, RefreshCw, Download } from 'lucide-react';

export default function Contracts() {
  const { contracts, openModal, renewContract, addToast } = useCrm();

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
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)', whiteSpace: 'nowrap' }}>
                    {c.id}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{c.celebrity}</td>
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
                        title="Renew Contract for 1 Year"
                        onClick={() => renewContract && renewContract(c.id)}
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
    </div>
  );
}
