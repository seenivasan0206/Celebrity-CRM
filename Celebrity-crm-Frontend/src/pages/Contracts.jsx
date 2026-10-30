import React from 'react';
import { useCrm } from '../context/CrmContext';
import { FileText, Plus, ShieldCheck, DollarSign, Clock, RefreshCw, Download } from 'lucide-react';

export default function Contracts() {
  const { contracts, openModal, renewContract, addToast } = useCrm();

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Legal & Commercial Contracts ({contracts.length})</h2>
          <p>Endorsement agreements, terms, compensation clauses, and duration ledgers</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => openModal('createContract')}
        >
          <Plus size={16} /> Execute New Contract
        </button>
      </div>

      <div className="contract-kpis">
        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Active Portfolio</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>$1,220,000</h3>
          </div>
        </div>

        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366F1' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Fully Executed</span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-main)' }}>{contracts.length} Agreements</h3>
          </div>
        </div>

        <div className="crm-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F59E0B' }}>
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
          <table className="zenve-table">
            <thead>
              <tr>
                <th>Contract ID</th>
                <th>Celebrity Talent</th>
                <th>Client / Agency</th>
                <th>Category</th>
                <th>Value</th>
                <th>Duration</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contracts.map((c) => (
                <tr key={c.id}>
                  <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>
                    {c.id}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.celebrity}</td>
                  <td>{c.client}</td>
                  <td>
                    <span className="badge badge-purple">{c.category || 'Endorsement'}</span>
                  </td>
                  <td style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>{c.value}</td>
                  <td>{c.duration}</td>
                  <td>
                    <span className={`badge ${c.status === 'Active' ? 'badge-emerald' : 'badge-amber'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        title="Renew Contract for 1 Year"
                        onClick={() => renewContract(c.id)}
                      >
                        <RefreshCw size={12} color="#10B981" /> Renew
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        title="Download Contract PDF"
                        onClick={() => addToast(`Downloaded legal brief for ${c.id} (PDF)`, 'info')}
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
