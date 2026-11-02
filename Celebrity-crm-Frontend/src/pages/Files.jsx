import React from 'react';
import { useCrm } from '../context/CrmContext';
import { FolderLock, Upload, Download, FileText, Image, Film, ShieldCheck } from 'lucide-react';

export default function Files() {
  const { addToast } = useCrm();

  const documents = [
    {
      id: 1,
      name: 'Vijay_ChronoElite_MasterAgreement_Signed.pdf',
      type: 'Legal Contract',
      size: '4.8 MB',
      updated: '28 Oct 2025',
      icon: FileText,
      color: '#6366F1'
    },
    {
      id: 2,
      name: 'Nayanthara_Vogue_HiRes_StillPack_2026.zip',
      type: 'Media Press Kit',
      size: '142.0 MB',
      updated: '29 Oct 2025',
      icon: Image,
      color: '#EC4899'
    },
    {
      id: 3,
      name: 'ChennaiStudio4_CallSheet_Day1_CrewDispatch.pdf',
      type: 'Call Sheet',
      size: '1.2 MB',
      updated: 'Today, 08:30 AM',
      icon: FileText,
      color: '#10B981'
    },
    {
      id: 4,
      name: 'ApexMotors_EV_Commercial_Storyboard_v3.mp4',
      type: 'Video Reel',
      size: '64.5 MB',
      updated: 'Yesterday',
      icon: Film,
      color: '#06B6D4'
    }
  ];

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Secure Document & Media Vault ({documents.length})</h2>
          <p>Encrypted contracts, call sheets, talent high-res imagery, and brand assets</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => addToast('Upload dialog opened: Choose document or media file', 'info')}
        >
          <Upload size={16} /> Upload Asset
        </button>
      </div>

      <div className="celebrities-grid">
        {documents.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="celebrity-card">
              <div className="celeb-card-top">
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--bg-card-alt)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: doc.color
                  }}
                >
                  <Icon size={24} />
                </div>
                <div className="celeb-card-meta">
                  <h3 style={{ fontSize: '0.92rem', wordBreak: 'break-all' }}>{doc.name}</h3>
                  <span>{doc.type} · {doc.size}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: 'var(--text-dim)', margin: '10px 0' }}>
                <ShieldCheck size={14} color="#10B981" /> 256-bit Encrypted Vault
              </div>

              <div className="celeb-card-footer">
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Updated: {doc.updated}</span>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                  onClick={() => addToast(`Downloaded ${doc.name}`, 'success')}
                >
                  <Download size={13} /> Download
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

