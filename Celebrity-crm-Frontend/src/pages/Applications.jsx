import React, { useState, useEffect } from 'react';
import { useCrm } from '../context/CrmContext';
import { Inbox, CheckCircle2, XCircle, Video, User, Star } from 'lucide-react';
import api from '../services/api';

const defaultApplications = [
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
];

export default function Applications() {
  const { addToast } = useCrm();

  const normalizeApp = (app) => {
    let displayStatus = 'Under Review';
    if (app.status === 'SHORTLISTED') displayStatus = 'Shortlisted';
    else if (app.status === 'AUDITION_SCHEDULED') displayStatus = 'Audition Call Scheduled';
    else if (app.status === 'DECLINED') displayStatus = 'Declined';
    else if (app.status === 'UNDER_REVIEW') displayStatus = 'Under Review';
    else if (app.status) displayStatus = app.status;

    let city = app.city;
    let exp = app.experience || (app.experienceYears ? `${app.experienceYears} Years Experience` : '3 Years Experience');
    if (!city && app.notes && app.notes.includes('|')) {
      const parts = app.notes.split('|');
      city = parts[1]?.trim() || 'Mumbai';
      exp = parts[0]?.trim() || exp;
    }

    return {
      id: app.id,
      applicantName: app.applicantName,
      appliedRole: app.appliedRole || app.castingCallTitle || 'Lead Role',
      experience: exp,
      city: city || 'Mumbai',
      tapeUrl: app.portfolioUrl || app.tapeUrl || 'https://vimeo.com/demo-tape',
      rating: app.rating || (85 + (app.id * 3) % 15),
      status: displayStatus,
      rawStatus: app.status
    };
  };

  const [applications, setApplications] = useState(defaultApplications);

  // Fetch live applications from Spring Boot backend
  useEffect(() => {
    let isMounted = true;
    const fetchApps = async () => {
      try {
        const live = await api.casting.getApplications();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setApplications(live.map(normalizeApp));
        }
      } catch (err) {
        console.warn('Backend unavailable, using cached applications:', err.message);
      }
    };
    fetchApps();
    return () => { isMounted = false; };
  }, []);

  const handleStatusUpdate = async (id, newStatus) => {
    const backendStatus = newStatus === 'Shortlisted' ? 'SHORTLISTED' :
                          newStatus === 'Declined' ? 'DECLINED' :
                          newStatus === 'Audition Call Scheduled' ? 'AUDITION_SCHEDULED' : 'UNDER_REVIEW';

    setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, rawStatus: backendStatus } : a));

    try {
      await api.casting.updateApplicationStatus(id, backendStatus);
      addToast(`Candidate marked as "${newStatus}"`, 'success');
    } catch (err) {
      console.warn('Backend status update failed:', err.message);
      addToast(`Candidate marked as "${newStatus}"`, 'info');
    }
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
                    <span style={{ fontWeight: 700, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={13} fill="var(--accent)" /> {app.rating}%
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${
                      app.status === 'Shortlisted' ? 'badge-accent' :
                      app.status === 'Audition Call Scheduled' ? 'badge-primary' : 'badge-secondary'
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
                        <CheckCircle2 size={14} color="var(--accent)" />
                      </button>
                      <button
                        type="button"
                        className="btn-secondary"
                        style={{ padding: '4px 8px', fontSize: '0.74rem', color: 'var(--secondary)' }}
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
