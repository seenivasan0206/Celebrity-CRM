import React, { useState } from 'react';
import { useCrm } from '../context/CrmContext';
import { Inbox, CheckCircle2, XCircle, Video, User, Star } from 'lucide-react';

export default function Applications() {
  const { addToast } = useCrm();

  const [applications, setApplications] = useState([
    {
      id: 1,
      applicantName: 'Ronit Sharma',
      appliedRole: 'Lead Actor — OTT Thriller Series',
      experience: '4 Years Theatre & Web Shorts',
      city: 'Mumbai',
      tapeUrl: 'https://vimeo.com/demo-tape-1',
      rating: 92,
      status: 'Under Review'
    },
    {
      id: 2,
      applicantName: 'Ananya Deshmukh',
      appliedRole: 'Female Parallel Lead — Feature Film',
      experience: '2 Feature Films & Classical Dance',
      city: 'Pune',
      tapeUrl: 'https://vimeo.com/demo-tape-2',
      rating: 88,
      status: 'Shortlisted'
    },
    {
      id: 3,
      applicantName: 'Karthik Subramanian',
      appliedRole: 'Youth Protagonist — Sports Drama',
      experience: 'State Level Athlete & Commercial Model',
      city: 'Chennai',
      tapeUrl: 'https://vimeo.com/demo-tape-3',
      rating: 95,
      status: 'Audition Call Scheduled'
    }
  ]);

  const handleStatusUpdate = (id, newStatus) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a));
    addToast(`Candidate marked as "${newStatus}"`, 'success');
  };

  return (
    <div>
      <div className="page-header-row">
        <div>
          <h2>Audition Applications & Submissions ({applications.length})</h2>
          <p>Review self-tapes, portfolios, and casting director evaluations</p>
        </div>
      </div>

      <div className="crm-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div className="table-responsive">
          <table className="zenve-table">
            <thead>
              <tr>
                <th>Applicant Name</th>
                <th>Applied Role</th>
                <th>Location & Experience</th>
                <th>Audition Reel</th>
                <th>Audition Score</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                        <User size={16} />
                      </div>
                      <strong style={{ color: 'var(--text-main)' }}>{app.applicantName}</strong>
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>{app.appliedRole}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {app.city} · {app.experience}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn-secondary"
                      style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                      onClick={() => addToast(`Opening video reel for ${app.applicantName}`, 'info')}
                    >
                      <Video size={13} color="var(--primary)" /> View Tape
                    </button>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="#F59E0B" /> {app.rating}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      app.status === 'Shortlisted' ? 'badge-emerald' :
                      app.status === 'Audition Call Scheduled' ? 'badge-indigo' : 'badge-amber'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem' }}
                        title="Shortlist applicant"
                        onClick={() => handleStatusUpdate(app.id, 'Shortlisted')}
                      >
                        <CheckCircle2 size={14} color="#10B981" />
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--accent-rose)' }}
                        title="Decline applicant"
                        onClick={() => handleStatusUpdate(app.id, 'Declined')}
                      >
                        <XCircle size={14} />
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

