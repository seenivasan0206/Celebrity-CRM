import React from 'react';
import { useCrm } from '../context/CrmContext';
import { Building2, Plus, MapPin, Users, Globe, Phone, Mail } from 'lucide-react';

export default function Agencies() {
  const { addToast } = useCrm();

  const agenciesList = [
    {
      id: 1,
      name: 'Elite Talent Management',
      headquarters: 'Bandra West, Mumbai',
      specialty: 'A-List Film Actors & Global Ambassadorship',
      rosterCount: 14,
      commission: '12%',
      website: 'www.elitetalent.com',
      email: 'partners@elitetalent.com',
      phone: '+91 22 2640 8899',
      status: 'Verified Partner'
    },
    {
      id: 2,
      name: 'Global Talent & Media',
      headquarters: 'Poes Garden, Chennai',
      specialty: 'South Indian Superstars & OTT Exclusives',
      rosterCount: 22,
      commission: '10%',
      website: 'www.globaltalent.in',
      email: 'contact@globaltalent.in',
      phone: '+91 44 2811 5566',
      status: 'Verified Partner'
    },
    {
      id: 3,
      name: 'Apex Studio Representations',
      headquarters: 'Jubilee Hills, Hyderabad',
      specialty: 'Pan-India Action Icons & Commercial Ads',
      rosterCount: 11,
      commission: '15%',
      website: 'www.apexstudio.in',
      email: 'connect@apexstudio.in',
      phone: '+91 40 2355 4433',
      status: 'Premium Partner'
    },
    {
      id: 4,
      name: 'Zenve Talent Network',
      headquarters: 'Koramangala, Bangalore',
      specialty: 'Music Directors, Indie Stars & Tech Brands',
      rosterCount: 18,
      commission: '8%',
      website: 'www.zenvetalent.com',
      email: 'roster@zenvetalent.com',
      phone: '+91 80 4123 7788',
      status: 'Direct Network'
    }
  ];

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Partner Talent Agencies ({agenciesList.length})</h2>
          <p>Affiliated production agencies, talent agencies, and casting liaisons</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => addToast('Agency partner onboarding application initiated', 'info')}
        >
          <Plus size={16} /> Partner Agency
        </button>
      </div>

      <div className="celebrities-grid">
        {agenciesList.map((agency) => (
          <div key={agency.id} className="celebrity-card">
            <div className="celeb-card-top">
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontSize: '1.2rem',
                  fontWeight: 800
                }}
              >
                <Building2 size={26} />
              </div>
              <div className="celeb-card-meta">
                <h3>{agency.name}</h3>
                <span>{agency.specialty}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  <MapPin size={12} /> {agency.headquarters}
                </div>
              </div>
              <span className="badge badge-emerald">{agency.status}</span>
            </div>

            <div className="celeb-stats-strip">
              <div className="celeb-stat-unit">
                <strong>{agency.rosterCount}</strong>
                <span>Stars</span>
              </div>
              <div className="celeb-stat-unit">
                <strong>{agency.commission}</strong>
                <span>Agency Fee</span>
              </div>
              <div className="celeb-stat-unit">
                <strong style={{ color: '#10B981' }}>Active</strong>
                <span>Status</span>
              </div>
            </div>

            <div className="celeb-contact-info">
              <div className="celeb-contact-row">
                <Globe size={13} color="var(--primary)" />
                <span>{agency.website}</span>
              </div>
              <div className="celeb-contact-row">
                <Mail size={13} color="var(--primary)" />
                <span>{agency.email}</span>
              </div>
              <div className="celeb-contact-row">
                <Phone size={13} color="var(--accent-emerald)" />
                <span>{agency.phone}</span>
              </div>
            </div>

            <div className="celeb-card-footer">
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Authorized Network</span>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                onClick={() => addToast(`Contact request sent to ${agency.name}`, 'success')}
              >
                Connect Agency
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

