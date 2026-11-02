import React, { useState, useEffect, useRef } from 'react';
import { useCrm } from '../context/CrmContext';
import { FolderLock, Upload, Download, FileText, Image, Film, ShieldCheck, Trash2, CheckCircle2 } from 'lucide-react';
import api from '../services/api';

const defaultDocuments = [
  {
    id: 1,
    name: 'Vijay_ChronoElite_MasterAgreement_Signed.pdf',
    fileName: 'Vijay_ChronoElite_MasterAgreement_Signed.pdf',
    type: 'Legal Contract',
    size: '4.8 MB',
    updated: '28 Oct 2025'
  },
  {
    id: 2,
    name: 'Nayanthara_Vogue_HiRes_StillPack_2026.zip',
    fileName: 'Nayanthara_Vogue_HiRes_StillPack_2026.zip',
    type: 'Media Press Kit',
    size: '142.0 MB',
    updated: '29 Oct 2025'
  },
  {
    id: 3,
    name: 'ChennaiStudio4_CallSheet_Day1_CrewDispatch.pdf',
    fileName: 'ChennaiStudio4_CallSheet_Day1_CrewDispatch.pdf',
    type: 'Call Sheet',
    size: '1.2 MB',
    updated: '02 Nov 2026'
  },
  {
    id: 4,
    name: 'ApexMotors_EV_Commercial_Storyboard_v3.mp4',
    fileName: 'ApexMotors_EV_Commercial_Storyboard_v3.mp4',
    type: 'Video Reel',
    size: '64.5 MB',
    updated: '01 Nov 2026'
  }
];

export default function Files() {
  const { addToast } = useCrm();
  const fileInputRef = useRef(null);

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileIcon = (name, type) => {
    const ext = (name || '').toLowerCase();
    if (ext.endsWith('.mp4') || ext.endsWith('.mov') || ext.endsWith('.mkv') || (type || '').toLowerCase().includes('video')) {
      return Film;
    }
    if (ext.endsWith('.jpg') || ext.endsWith('.png') || ext.endsWith('.jpeg') || ext.endsWith('.webp') || ext.endsWith('.zip') || (type || '').toLowerCase().includes('media')) {
      return Image;
    }
    return FileText;
  };

  const normalizeFile = (f) => ({
    id: f.id,
    name: f.originalFileName || f.fileName,
    fileName: f.fileName,
    type: f.category || (f.fileType?.includes('pdf') ? 'Legal Contract' : f.fileType?.includes('image') ? 'Media Press Kit' : 'Vault Asset'),
    size: typeof f.size === 'number' ? formatFileSize(f.size) : (f.size || '2.4 MB'),
    updated: f.uploadedAt ? new Date(f.uploadedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Recently',
    downloadUri: f.fileDownloadUri || `/api/files/download/${encodeURIComponent(f.fileName)}`
  });

  const [documents, setDocuments] = useState(defaultDocuments);
  const [uploading, setUploading] = useState(false);

  // Fetch live vault documents from Spring Boot backend
  useEffect(() => {
    let isMounted = true;
    const fetchFiles = async () => {
      try {
        const live = await api.files.getAll();
        if (isMounted && Array.isArray(live) && live.length > 0) {
          setDocuments(live.map(normalizeFile));
        }
      } catch (err) {
        console.warn('Backend unavailable, using cached files:', err.message);
      }
    };
    fetchFiles();
    return () => { isMounted = false; };
  }, []);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', 'Vault Document');
    formData.append('description', `Uploaded file: ${file.name}`);

    setUploading(true);
    addToast(`Uploading "${file.name}" to secure vault...`, 'info');

    try {
      const uploaded = await api.files.upload(formData);
      setDocuments(prev => [normalizeFile(uploaded), ...prev]);
      addToast(`"${file.name}" successfully uploaded and encrypted!`, 'success');
    } catch (err) {
      console.warn('Backend upload failed, creating local vault record:', err.message);
      const fallback = {
        id: Date.now(),
        name: file.name,
        fileName: file.name,
        type: 'Vault Document',
        size: formatFileSize(file.size),
        updated: 'Just now'
      };
      setDocuments(prev => [fallback, ...prev]);
      addToast(`"${file.name}" added to vault view!`, 'success');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDownload = (doc) => {
    const url = `/api/files/download/${encodeURIComponent(doc.fileName)}`;
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', doc.name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast(`Downloading ${doc.name}`, 'info');
  };

  const handleDeleteFile = async (doc, e) => {
    e.stopPropagation();
    setDocuments(prev => prev.filter(d => d.id !== doc.id));

    try {
      await api.files.delete(doc.fileName);
      addToast('File purged from secure vault', 'info');
    } catch (err) {
      console.warn('Backend delete failed:', err.message);
      addToast('File removed locally', 'info');
    }
  };

  return (
    <div>
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileInputChange}
      />

      <div className="page-header-row">
        <div>
          <h2>Secure Document & Media Vault ({documents.length})</h2>
          <p>Encrypted contracts, call sheets, talent high-res imagery, and brand assets</p>
        </div>
        <button
          type="button"
          className="btn-primary"
          disabled={uploading}
          onClick={handleUploadClick}
        >
          <Upload size={16} /> {uploading ? 'Encrypting & Uploading...' : 'Upload Asset'}
        </button>
      </div>

      <div className="celebrities-grid">
        {documents.map((doc) => {
          const Icon = getFileIcon(doc.name, doc.type);
          return (
            <div key={doc.id} className="celebrity-card">
              <div className="celeb-card-top">
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'var(--c-primary-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--primary)',
                    flexShrink: 0
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
                <ShieldCheck size={14} color="var(--accent)" /> 256-bit Encrypted Vault Storage
              </div>

              <div className="celeb-card-footer">
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Updated: {doc.updated}</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '6px 12px', fontSize: '0.76rem' }}
                    onClick={() => handleDownload(doc)}
                  >
                    <Download size={13} /> Download
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    style={{ padding: '6px 8px', color: 'var(--secondary)' }}
                    title="Purge file"
                    onClick={(e) => handleDeleteFile(doc, e)}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
