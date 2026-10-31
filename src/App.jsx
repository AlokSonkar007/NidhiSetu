import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownToLine, ArrowLeftRight, ArrowRight,
  Bell, CalendarDays, Check, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight,
  CircleHelp, ClipboardCheck, Clock3, Download, Eye, FileCheck2, FileImage, FilePlus2,
  FileText, Filter, Landmark, LayoutDashboard, LogOut, Menu, MoreHorizontal,
  Plus, RefreshCw, Search, Settings, Shield, ShieldCheck, SlidersHorizontal,
  Upload, UserRound, Users, Wallet, X, XCircle, Zap
} from 'lucide-react';
import { Doughnut } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const ROLES = [
  'Institution User',
  'Scrutiny Officer',
  'Approving Authority',
  'Bank Verifier',
  'Administrator'
];

const NAV = [
  { id: 'overview', label: 'Overview Dashboard', icon: LayoutDashboard, roles: ROLES },
  { id: 'repository', label: 'FDR Repository', icon: Wallet, roles: ROLES },
  { id: 'documents', label: 'Document Management', icon: FileText, roles: ROLES },
  { id: 'verification', label: 'Verification Centre', icon: ShieldCheck, roles: ROLES },
  { id: 'dates', label: 'Date Tracking', icon: CalendarDays, roles: ROLES },
  { id: 'renewals', label: 'Renewals & Replacements', icon: RefreshCw, roles: ['Institution User', 'Scrutiny Officer', 'Approving Authority', 'Administrator'] },
  { id: 'release', label: 'Release & Refund', icon: ArrowLeftRight, roles: ['Institution User', 'Scrutiny Officer', 'Approving Authority', 'Administrator'] },
  { id: 'alerts', label: 'Alerts & Escalations', icon: Bell, roles: ROLES },
  { id: 'reports', label: 'Reports & Analytics', icon: Activity, roles: ['Scrutiny Officer', 'Approving Authority', 'Administrator'] },
  { id: 'audit', label: 'Audit Trail', icon: ClipboardCheck, roles: ['Scrutiny Officer', 'Approving Authority', 'Administrator'] },
];

const todayISO = '2026-10-31';
const seedFdrs = [
  { id: 'FDR-26001', institution: 'Suryodaya Institute of Technology', ref: 'FDR/BOB/884219', bank: 'Bank of Baroda', branch: 'Hazratganj, Lucknow', amount: 2500000, issueDate: '2026-02-15', maturityDate: '2027-02-15', lien: 'AICTE security deposit', status: 'Active', submitted: { amount: 2500000, issueDate: '2026-02-15', maturityDate: '2027-02-15', bank: 'Bank of Baroda', ref: 'FDR/BOB/884219' }, extracted: { amount: 2500000, issueDate: '2026-02-15', maturityDate: '2027-02-15', bank: 'Bank of Baroda', ref: 'FDR/BOB/884219', confidence: 98 }, bankConfirmed: { amount: 2500000, issueDate: '2026-02-15', maturityDate: '2027-02-15', bank: 'Bank of Baroda', ref: 'FDR/BOB/884219' }, createdAt: '2026-08-12', officer: 'A. Sharma', lienNote: 'Lien marked in favour of AICTE', finding: '' },
  { id: 'FDR-26002', institution: 'North Valley College of Engineering', ref: 'FDR/SBI/209183', bank: 'State Bank of India', branch: 'Gomti Nagar, Lucknow', amount: 1800000, issueDate: '2025-11-18', maturityDate: '2026-11-18', lien: 'AICTE security deposit', status: 'Expiring', submitted: { amount: 1800000, issueDate: '2025-11-18', maturityDate: '2026-11-18', bank: 'State Bank of India', ref: 'FDR/SBI/209183' }, extracted: { amount: 1800000, issueDate: '2025-11-18', maturityDate: '2026-11-18', bank: 'State Bank of India', ref: 'FDR/SBI/209183', confidence: 96 }, bankConfirmed: { amount: 1800000, issueDate: '2025-11-18', maturityDate: '2026-11-18', bank: 'State Bank of India', ref: 'FDR/SBI/209183' }, createdAt: '2026-07-21', officer: 'R. Verma', lienNote: 'Lien active', finding: '' },
  { id: 'FDR-26003', institution: 'Riverbend Institute of Pharmacy', ref: 'FDR/PNB/773501', bank: 'Punjab National Bank', branch: 'Civil Lines, Prayagraj', amount: 1250000, issueDate: '2025-12-12', maturityDate: '2026-12-12', lien: 'Lien confirmation awaited', status: 'Under scrutiny', submitted: { amount: 1250000, issueDate: '2025-12-12', maturityDate: '2026-12-12', bank: 'Punjab National Bank', ref: 'FDR/PNB/773501' }, extracted: null, bankConfirmed: null, createdAt: '2026-09-25', officer: 'M. Khan', lienNote: 'Bank confirmation pending', finding: 'Lien confirmation document not attached' },
  { id: 'FDR-26004', institution: 'Central Institute of Technology', ref: 'FDR/AXIS/448210', bank: 'Axis Bank', branch: 'Aliganj, Lucknow', amount: 4000000, issueDate: '2026-04-08', maturityDate: '2027-04-08', lien: 'AICTE security deposit', status: 'Under scrutiny', submitted: { amount: 4000000, issueDate: '2026-04-08', maturityDate: '2027-04-08', bank: 'Axis Bank', ref: 'FDR/AXIS/448210' }, extracted: { amount: 4500000, issueDate: '2026-04-08', maturityDate: '2027-04-08', bank: 'Axis Bank', ref: 'FDR/AXIS/448210', confidence: 84 }, bankConfirmed: null, createdAt: '2026-09-30', officer: 'A. Sharma', lienNote: 'Lien active', finding: 'Submitted amount and extracted amount differ' },
  { id: 'FDR-26005', institution: 'Saraswati School of Management', ref: 'FDR/CAN/661920', bank: 'Canara Bank', branch: 'Civil Lines, Kanpur', amount: 950000, issueDate: '2025-10-12', maturityDate: '2026-10-12', lien: 'AICTE security deposit', status: 'Matured', submitted: { amount: 950000, issueDate: '2025-10-12', maturityDate: '2026-10-12', bank: 'Canara Bank', ref: 'FDR/CAN/661920' }, extracted: { amount: 950000, issueDate: '2025-10-12', maturityDate: '2026-10-12', bank: 'Canara Bank', ref: 'FDR/CAN/661920', confidence: 97 }, bankConfirmed: { amount: 950000, issueDate: '2025-10-12', maturityDate: '2026-10-12', bank: 'Canara Bank', ref: 'FDR/CAN/661920' }, createdAt: '2026-05-11', officer: 'R. Verma', lienNote: 'Awaiting renewal or discharge instruction', finding: '' },
  { id: 'FDR-26006', institution: 'Eastern Technical University', ref: 'FDR/HDFC/038211', bank: 'HDFC Bank', branch: 'Vibhuti Khand, Lucknow', amount: 3200000, issueDate: '2026-06-02', maturityDate: '2027-06-02', lien: 'AICTE security deposit', status: 'Verified', submitted: { amount: 3200000, issueDate: '2026-06-02', maturityDate: '2027-06-02', bank: 'HDFC Bank', ref: 'FDR/HDFC/038211' }, extracted: { amount: 3200000, issueDate: '2026-06-02', maturityDate: '2027-06-02', bank: 'HDFC Bank', ref: 'FDR/HDFC/038211', confidence: 99 }, bankConfirmed: { amount: 3200000, issueDate: '2026-06-02', maturityDate: '2027-06-02', bank: 'HDFC Bank', ref: 'FDR/HDFC/038211' }, createdAt: '2026-08-04', officer: 'M. Khan', lienNote: 'Lien active', finding: '' },
  { id: 'FDR-26007', institution: 'Pragati College of Applied Sciences', ref: 'FDR/ICICI/092133', bank: 'ICICI Bank', branch: 'Indira Nagar, Lucknow', amount: 2100000, issueDate: '2025-09-22', maturityDate: '2026-09-22', lien: 'Release request submitted', status: 'Release requested', submitted: { amount: 2100000, issueDate: '2025-09-22', maturityDate: '2026-09-22', bank: 'ICICI Bank', ref: 'FDR/ICICI/092133' }, extracted: { amount: 2100000, issueDate: '2025-09-22', maturityDate: '2026-09-22', bank: 'ICICI Bank', ref: 'FDR/ICICI/092133', confidence: 98 }, bankConfirmed: { amount: 2100000, issueDate: '2025-09-22', maturityDate: '2026-09-22', bank: 'ICICI Bank', ref: 'FDR/ICICI/092133' }, createdAt: '2026-07-30', officer: 'A. Sharma', lienNote: 'Release under review', finding: '' },
  { id: 'FDR-26008', institution: 'Bluebell Institute of Technology', ref: 'FDR/UBI/771823', bank: 'Union Bank of India', branch: 'Mahanagar, Lucknow', amount: 1500000, issueDate: '2026-01-20', maturityDate: '2027-01-20', lien: 'AICTE security deposit', status: 'Submitted', submitted: { amount: 1500000, issueDate: '2026-01-20', maturityDate: '2027-01-20', bank: 'Union Bank of India', ref: 'FDR/UBI/771823' }, extracted: null, bankConfirmed: null, createdAt: '2026-10-20', officer: 'Unassigned', lienNote: 'Pending initial scrutiny', finding: '' },
];

const seedDocuments = [
  { id: 'DOC-1042', name: 'FDR_Certificate_884219.pdf', category: 'Original FDR Certificate', fdrId: 'FDR-26001', institution: 'Suryodaya Institute of Technology', uploaded: '2026-08-12', version: 1, size: '428 KB', status: 'Processed', confidence: 98 },
  { id: 'DOC-1038', name: 'Bank_Advice_209183.pdf', category: 'Bank Confirmation', fdrId: 'FDR-26002', institution: 'North Valley College of Engineering', uploaded: '2026-07-21', version: 1, size: '312 KB', status: 'Processed', confidence: 96 },
  { id: 'DOC-1026', name: 'FDR_773501_scan.jpg', category: 'Original FDR Certificate', fdrId: 'FDR-26003', institution: 'Riverbend Institute of Pharmacy', uploaded: '2026-09-25', version: 1, size: '1.2 MB', status: 'Awaiting extraction', confidence: null },
  { id: 'DOC-1022', name: 'FDR_Axis_448210.pdf', category: 'Original FDR Certificate', fdrId: 'FDR-26004', institution: 'Central Institute of Technology', uploaded: '2026-09-30', version: 1, size: '506 KB', status: 'Finding raised', confidence: 84 },
];

const seedAlerts = [
  { id: 'ALT-801', title: 'Maturity approaching', detail: 'FDR/BOB/209183 matures in 18 days.', institution: 'North Valley College of Engineering', severity: 'High', type: 'Maturity', assigned: 'R. Verma', date: '2026-10-31', status: 'Open', escalations: 0 },
  { id: 'ALT-802', title: 'Amount discrepancy requires review', detail: 'Extracted amount differs from submitted amount.', institution: 'Central Institute of Technology', severity: 'Critical', type: 'Discrepancy', assigned: 'A. Sharma', date: '2026-10-30', status: 'Open', escalations: 1 },
  { id: 'ALT-803', title: 'Bank verification pending', detail: 'Bank confirmation is not yet recorded.', institution: 'Riverbend Institute of Pharmacy', severity: 'Medium', type: 'Verification', assigned: 'M. Khan', date: '2026-10-29', status: 'Acknowledged', escalations: 0 },
  { id: 'ALT-804', title: 'Release request awaits approval', detail: 'Scrutiny recommendation is ready for authority review.', institution: 'Pragati College of Applied Sciences', severity: 'High', type: 'Release', assigned: 'Approving Authority', date: '2026-10-28', status: 'Open', escalations: 1 },
];

const seedReleases = [
  { id: 'REL-201', fdrId: 'FDR-26007', institution: 'Pragati College of Applied Sciences', reason: 'Approval cycle completed; requesting discharge of security deposit.', date: '2026-10-18', status: 'Awaiting Approval', recommendedBy: 'Scrutiny Officer', approvedBy: '', remarks: 'Documents reviewed; recommending release subject to authority approval.' },
  { id: 'REL-202', fdrId: 'FDR-26005', institution: 'Saraswati School of Management', reason: 'Matured instrument; institution requests refund processing.', date: '2026-10-24', status: 'Under Scrutiny', recommendedBy: '', approvedBy: '', remarks: '' },
];

function useLocalState(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn('Could not persist prototype state', error); }
  }, [key, value]);
  return [value, setValue];
}

function money(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value || 0));
}
function compactMoney(value) {
  const amount = Number(value || 0);
  if (amount >= 10000000) return '₹' + (amount / 10000000).toFixed(2) + ' Cr';
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + ' L';
  return money(amount);
}
function dateLabel(value) {
  if (!value) return '—';
  return new Date(value + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function daysUntil(value) {
  if (!value) return 0;
  const start = new Date(todayISO + 'T00:00:00');
  const end = new Date(value + 'T00:00:00');
  return Math.ceil((end - start) / 86400000);
}
function maskRef(value) {
  if (!value) return '—';
  const chunks = String(value).split('/');
  const last = chunks.pop();
  return chunks.join('/') + '/' + '••••' + String(last).slice(-2);
}
function initials(value) {
  return String(value || '').split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
}
function statusClass(status) {
  const value = String(status || '').toLowerCase();
  if (value.includes('active') || value.includes('verified') || value === 'released' || value === 'approved' || value === 'processed') return 'status-good';
  if (value.includes('expir') || value.includes('matur') || value.includes('awaiting') || value.includes('scrutiny') || value.includes('requested') || value.includes('pending') || value.includes('clarification')) return 'status-warn';
  if (value.includes('reject') || value.includes('critical') || value.includes('finding') || value.includes('mismatch')) return 'status-danger';
  return 'status-neutral';
}

function Badge({ children, tone }) {
  return <span className={'badge ' + (tone || statusClass(children))}><span className="badge-dot" />{children}</span>;
}
function Trust({ type }) {
  const cls = type === 'Bank-confirmed' ? 'trust-bank' : type === 'Extracted' ? 'trust-extracted' : 'trust-submitted';
  return <span className={'trust ' + cls}>{type}</span>;
}
function SectionHeading({ eyebrow, title, description, action }) {
  return <div className="section-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="heading-action">{action}</div>}</div>;
}
function Metric({ label, value, helper, icon: Icon, tone }) {
  return <div className="metric-card"><div className={'metric-icon ' + (tone || '')}><Icon size={18} /></div><div className="metric-label">{label}</div><div className="metric-value">{value}</div><div className="metric-helper">{helper}</div></div>;
}
function EmptyState({ title, detail }) {
  return <div className="empty-state"><div className="empty-icon"><FileText size={20} /></div><strong>{title}</strong><span>{detail}</span></div>;
}
function Modal({ title, subtitle, onClose, children, wide }) {
  return <div className="modal-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}><div className={'modal ' + (wide ? 'modal-wide' : '')}><div className="modal-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Close"><X size={18} /></button></div>{children}</div></div>;
}

export default function App() {
  const [role, setRole] = useLocalState('nidhi-role', 'Scrutiny Officer');
  const [entered, setEntered] = useLocalState('nidhi-entered', false);
  const [page, setPage] = useState('overview');
  const [fdrs, setFdrs] = useLocalState('nidhi-fdrs-v1', seedFdrs);
  const [documents, setDocuments] = useLocalState('nidhi-documents-v1', seedDocuments);
  const [alerts, setAlerts] = useLocalState('nidhi-alerts-v1', seedAlerts);
  const [releases, setReleases] = useLocalState('nidhi-releases-v1', seedReleases);
  const [audit, setAudit] = useLocalState('nidhi-audit-v1', [
    { id: 'AUD-9101', time: '2026-10-31T09:10:00', actor: 'R. Verma', role: 'Scrutiny Officer', action: 'Maturity reminder generated', fdr: 'FDR-26002', description: 'Advance reminder created for an approaching maturity date.' },
    { id: 'AUD-9100', time: '2026-10-30T15:42:00', actor: 'A. Sharma', role: 'Scrutiny Officer', action: 'Discrepancy flagged', fdr: 'FDR-26004', description: 'Extracted amount differs from the institution-submitted amount.' },
    { id: 'AUD-9099', time: '2026-10-29T12:18:00', actor: 'Bank Verifier', role: 'Bank Verifier', action: 'Verification confirmed', fdr: 'FDR-26001', description: 'Mock bank response matched the submitted instrument details.' },
  ]);
  const [threshold, setThreshold] = useLocalState('nidhi-reminder-threshold', 30);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [bankFilter, setBankFilter] = useState('All banks');
  const [modal, setModal] = useState('');
  const [selectedFdrId, setSelectedFdrId] = useState('');
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [toast, setToast] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [reportType, setReportType] = useState('Institution-wise FDR summary');
  const [docCategory, setDocCategory] = useState('Original FDR Certificate');
  const [docFdr, setDocFdr] = useState('FDR-26008');
  const [selectedDoc, setSelectedDoc] = useState('DOC-1042');

  const selectedFdr = fdrs.find(item => item.id === selectedFdrId);
  const navItems = NAV.filter(item => item.roles.includes(role));
  const totalValue = fdrs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const upcoming = fdrs.filter(item => daysUntil(item.maturityDate) >= 0 && daysUntil(item.maturityDate) <= threshold);
  const pendingVerification = fdrs.filter(item => !item.bankConfirmed && item.status !== 'Released').length;
  const pendingRelease = releases.filter(item => !['Released', 'Rejected'].includes(item.status)).length;
  const filteredFdrs = fdrs.filter(item => {
    const query = search.trim().toLowerCase();
    const matchesQuery = !query || [item.id, item.ref, item.institution, item.bank].some(value => String(value || '').toLowerCase().includes(query));
    const matchesStatus = statusFilter === 'All statuses' || item.status === statusFilter;
    const matchesBank = bankFilter === 'All banks' || item.bank === bankFilter;
    return matchesQuery && matchesStatus && matchesBank;
  });
  const banks = [...new Set(fdrs.map(item => item.bank))].sort();
  const activity = audit.slice(0, 5);

  function notify(message) {
    setToast(message);
    window.clearTimeout(window.__nidhiToastTimer);
    window.__nidhiToastTimer = window.setTimeout(() => setToast(''), 2800);
  }
  function addAudit(action, fdr, description, previousValue, newValue) {
    const event = {
      id: 'AUD-' + String(Date.now()).slice(-6),
      time: new Date().toISOString(),
      actor: role === 'Institution User' ? 'Institution desk' : role === 'Administrator' ? 'System administrator' : role,
      role,
      action,
      fdr: fdr || '—',
      description: description || '',
      previousValue: previousValue || '',
      newValue: newValue || ''
    };
    setAudit(current => [event, ...current]);
  }
  function updateFdr(id, patch, action, description) {
    const existing = fdrs.find(item => item.id === id);
    if (!existing) return;
    setFdrs(current => current.map(item => item.id === id ? { ...item, ...patch, updatedAt: new Date().toISOString() } : item));
    addAudit(action || 'FDR record updated', id, description || 'Record details were updated.', existing.status, patch.status || existing.status);
  }
  function openDetail(id) {
    setSelectedFdrId(id);
    setModal('detail');
  }
  function exportCsv(rows, filename) {
    if (!rows.length) { notify('There are no records to export.'); return; }
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(','), ...rows.map(row => headers.map(key => '"' + String(row[key] ?? '').replaceAll('"', '""') + '"').join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    anchor.click();
    URL.revokeObjectURL(url);
    notify('CSV report downloaded.');
  }
  function handleRoleChange(nextRole) {
    setRole(nextRole);
    const allowed = NAV.filter(item => item.roles.includes(nextRole)).map(item => item.id);
    if (!allowed.includes(page)) setPage('overview');
    notify('Demo view switched to ' + nextRole + '.');
  }
  function runOcr(id) {
    const record = fdrs.find(item => item.id === id);
    if (!record) return;
    const extracted = record.extracted || {
      amount: record.submitted.amount,
      issueDate: record.submitted.issueDate,
      maturityDate: record.submitted.maturityDate,
      bank: record.submitted.bank,
      ref: record.submitted.ref,
      confidence: 94
    };
    updateFdr(id, { extracted, status: record.status === 'Submitted' ? 'Under scrutiny' : record.status }, 'Mock OCR extraction completed', 'Sample extraction values and confidence scores were generated from a predefined demo response.');
    notify('Mock OCR extraction completed. Review the extracted values.');
  }
  function runBankCheck(id, outcome) {
    const record = fdrs.find(item => item.id === id);
    if (!record) return;
    if (outcome === 'unavailable') {
      updateFdr(id, { bankCheckUnavailable: true, bankConfirmed: null }, 'Bank verification unavailable', 'The mock bank adapter returned an unavailable response. Manual verification remains possible.');
      notify('Mock bank service unavailable. No bank-confirmed label was applied.');
      return;
    }
    if (outcome === 'mismatch') {
      updateFdr(id, { bankConfirmed: { ...record.submitted, amount: Math.max(0, record.submitted.amount - 100000), remark: 'Mock mismatch response' }, bankCheckUnavailable: false }, 'Bank mismatch reported', 'A predefined mock response returned an amount mismatch for officer review.');
      notify('A mock mismatch was recorded for human review.');
      return;
    }
    updateFdr(id, { bankConfirmed: { ...record.submitted, source: 'Mock bank adapter', checkedAt: new Date().toISOString() }, bankCheckUnavailable: false }, 'Mock bank details confirmed', 'Predefined mock bank response matched the institution-submitted details.');
    notify('Mock bank confirmation recorded.');
  }
  function completeScrutiny(id) {
    const record = fdrs.find(item => item.id === id);
    if (!record || !record.bankConfirmed) { notify('Bank confirmation is required before this record can be marked verified.'); return; }
    const amountMatches = Number(record.submitted.amount) === Number(record.bankConfirmed.amount);
    const dateMatches = record.submitted.maturityDate === record.bankConfirmed.maturityDate;
    if (!amountMatches || !dateMatches) { notify('A mismatch remains. Record the officer finding before changing the lifecycle state.'); return; }
    updateFdr(id, { status: 'Active', finding: '' }, 'Officer scrutiny completed', 'Officer reviewed the available evidence after a bank-confirmed response.');
    notify('Scrutiny completed. The FDR is now marked Active.');
  }
  function addFdrFromForm(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const amount = Number(form.get('amount'));
    if (!amount || amount <= 0) { notify('Enter a valid deposit amount.'); return; }
    const id = 'FDR-' + String(Date.now()).slice(-5);
    const record = {
      id,
      institution: String(form.get('institution') || ''),
      ref: String(form.get('ref') || ''),
      bank: String(form.get('bank') || ''),
      branch: String(form.get('branch') || ''),
      amount,
      issueDate: String(form.get('issueDate') || ''),
      maturityDate: String(form.get('maturityDate') || ''),
      lien: String(form.get('lien') || 'AICTE security deposit'),
      lienNote: String(form.get('lien') || 'AICTE security deposit'),
      status: 'Submitted',
      submitted: { amount, issueDate: String(form.get('issueDate') || ''), maturityDate: String(form.get('maturityDate') || ''), bank: String(form.get('bank') || ''), ref: String(form.get('ref') || '') },
      extracted: null,
      bankConfirmed: null,
      createdAt: todayISO,
      officer: 'Unassigned',
      finding: ''
    };
    setFdrs(current => [record, ...current]);
    addAudit('New FDR submitted', id, 'An institution submitted a new FDR record. It remains unverified.');
    setModal('');
    notify('FDR submitted. It is awaiting extraction and scrutiny.');
  }
  function addReleaseFromForm(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const fdr = fdrs.find(item => item.id === form.get('fdrId'));
    if (!fdr) return;
    const request = { id: 'REL-' + String(Date.now()).slice(-5), fdrId: fdr.id, institution: fdr.institution, reason: String(form.get('reason') || ''), date: todayISO, status: 'Under Scrutiny', recommendedBy: '', approvedBy: '', remarks: '' };
    setReleases(current => [request, ...current]);
    updateFdr(fdr.id, { status: 'Release requested' }, 'Release/refund requested', 'Institution submitted a release/refund request.');
    setModal('');
    notify('Release/refund request submitted for scrutiny.');
  }
  function addRenewalFromForm(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const old = fdrs.find(item => item.id === form.get('oldFdrId'));
    if (!old) return;
    const id = 'FDR-' + String(Date.now()).slice(-5);
    const ref = String(form.get('ref') || '');
    const amount = Number(form.get('amount'));
    const maturityDate = String(form.get('maturityDate') || '');
    const next = {
      id, institution: old.institution, ref, bank: String(form.get('bank') || old.bank), branch: old.branch,
      amount, issueDate: todayISO, maturityDate, lien: old.lien, lienNote: old.lienNote,
      status: 'Submitted', submitted: { amount, issueDate: todayISO, maturityDate, bank: String(form.get('bank') || old.bank), ref },
      extracted: null, bankConfirmed: null, createdAt: todayISO, officer: 'Unassigned', finding: '', replacementFor: old.id
    };
    setFdrs(current => [{ ...next }, ...current.map(item => item.id === old.id ? { ...item, status: 'Renewed / Replaced', replacedBy: id } : item)]);
    addAudit('Renewal / replacement initiated', id, 'A replacement FDR was submitted and linked to the previous instrument.', old.id, id);
    setModal('');
    notify('Replacement FDR added. The earlier instrument remains in history.');
  }
  function recommendRelease(id, action) {
    if (role !== 'Scrutiny Officer') { notify('Only a scrutiny officer can record a recommendation in this demo.'); return; }
    const request = releases.find(item => item.id === id);
    if (!request) return;
    setReleases(current => current.map(item => item.id === id ? { ...item, status: action, recommendedBy: role, remarks: action === 'Awaiting Approval' ? 'Recommended for competent authority approval.' : 'Clarification requested by scrutiny.' } : item));
    addAudit('Release request recommendation recorded', request.fdrId, 'Scrutiny officer updated release request status to ' + action + '.');
    notify('Recommendation recorded.');
  }
  function decideRelease(id, action) {
    if (role !== 'Approving Authority') { notify('Switch to Approving Authority to perform the maker-checker approval.'); return; }
    const request = releases.find(item => item.id === id);
    if (!request) return;
    if (!request.recommendedBy || request.recommendedBy === role) { notify('A separate scrutiny recommendation is required before authority action.'); return; }
    setReleases(current => current.map(item => item.id === id ? { ...item, status: action, approvedBy: role } : item));
    if (action === 'Released') updateFdr(request.fdrId, { status: 'Released' }, 'Release authorized', 'Approving authority completed the final release action.');
    addAudit('Approving authority decision', request.fdrId, 'Approving authority recorded: ' + action + '.');
    notify('Authority decision recorded: ' + action + '.');
  }
  function updateAlert(id, patch, action) {
    const alert = alerts.find(item => item.id === id);
    setAlerts(current => current.map(item => item.id === id ? { ...item, ...patch } : item));
    addAudit(action || 'Alert updated', alert?.id, alert?.title || 'Alert status changed.');
  }
  function switchPage(nextPage) {
    setPage(nextPage);
    setMobileOpen(false);
    setSearch('');
  }

  if (!entered) {
    return <LoginScreen role={role} onRoleChange={setRole} onEnter={() => setEntered(true)} />;
  }

  const pageTitle = NAV.find(item => item.id === page)?.label || 'Overview Dashboard';

  return (
    <div className="app-shell">
      <aside className={'sidebar ' + (mobileOpen ? 'sidebar-open' : '')}>
        <div className="brand-lockup"><div className="brand-mark"><Landmark size={21} strokeWidth={1.8} /></div><div><div className="brand-name">nidhi setu</div><div className="brand-sub">SECURITY DEPOSIT MANAGEMENT</div></div><button className="mobile-close icon-button" onClick={() => setMobileOpen(false)}><X size={18} /></button></div>
        <div className="sidebar-label">WORKSPACE</div>
        <nav className="side-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            return <button key={item.id} className={'nav-item ' + (page === item.id ? 'nav-active' : '')} onClick={() => switchPage(item.id)}><Icon size={17} strokeWidth={1.8} /><span>{item.label}</span>{item.id === 'alerts' && alerts.filter(alert => alert.status === 'Open').length > 0 && <em>{alerts.filter(alert => alert.status === 'Open').length}</em>}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="prototype-note"><ShieldCheck size={16} /><div><strong>Prototype workspace</strong><span>Sample data · Mock integrations</span></div></div>
          <button className="sidebar-help" onClick={() => notify('Prototype only: bank, OCR and notification services are simulated.')}><CircleHelp size={16} /> Help & information</button>
          <div className="sidebar-footer"><span>SIH 2026 · SIH26265</span><span>v1.0 demo</span></div>
        </div>
      </aside>

      <div className="main-shell">
        <header className="topbar">
          <div className="topbar-left"><button className="mobile-menu icon-button" onClick={() => setMobileOpen(true)}><Menu size={19} /></button><div className="crumb"><span>Workspace</span><ChevronRight size={14} /><strong>{pageTitle}</strong></div></div>
          <div className="topbar-right">
            <label className="global-search"><Search size={16} /><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search records, institutions..." /><kbd>⌘ K</kbd></label>
            <button className="top-icon" onClick={() => switchPage('alerts')} aria-label="Notifications"><Bell size={18} /><i>{alerts.filter(alert => alert.status === 'Open').length}</i></button>
            <div className="top-divider" />
            <div className="role-switch"><span>Viewing as</span><select value={role} onChange={event => handleRoleChange(event.target.value)}>{ROLES.map(item => <option key={item}>{item}</option>)}</select><ChevronDown size={13} /></div>
            <button className="profile-button" onClick={() => setEntered(false)} title="End demo session"><span className="avatar">{initials(role)}</span><span className="profile-copy"><strong>{role === 'Institution User' ? 'Institution Desk' : role}</strong><small>Demo account</small></span><ChevronDown size={14} /></button>
          </div>
        </header>
        <main className="content-area">
          {page === 'overview' && <Dashboard fdrs={fdrs} releases={releases} alerts={alerts} audit={activity} upcoming={upcoming} pendingVerification={pendingVerification} pendingRelease={pendingRelease} openDetail={openDetail} setPage={switchPage} />}
          {page === 'repository' && <Repository fdrs={filteredFdrs} allFdrs={fdrs} search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} bankFilter={bankFilter} setBankFilter={setBankFilter} banks={banks} openDetail={openDetail} onNew={() => setModal('new-fdr')} onExport={() => exportCsv(filteredFdrs.map(({ id, institution, ref, bank, amount, issueDate, maturityDate, status, lien }) => ({ id, institution, ref, bank, amount, issueDate, maturityDate, status, lien })), 'nidhi-setu-fdr-register.csv')} />}
          {page === 'documents' && <Documents documents={documents} fdrs={fdrs} selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} category={docCategory} setCategory={setDocCategory} docFdr={docFdr} setDocFdr={setDocFdr} onUpload={file => {
            if (!file) return;
            const linked = fdrs.find(item => item.id === docFdr);
            const previous = documents.filter(item => item.fdrId === docFdr);
            const item = { id: 'DOC-' + String(Date.now()).slice(-5), name: file.name, category: docCategory, fdrId: docFdr, institution: linked?.institution || 'Unassigned', uploaded: todayISO, version: previous.length + 1, size: Math.max(1, Math.round(file.size / 1024)) + ' KB', status: 'Awaiting extraction', confidence: null };
            setDocuments(current => [item, ...current]);
            setSelectedDoc(item.id);
            addAudit('Document uploaded', docFdr, 'A new document version was uploaded: ' + file.name + '.');
            notify('Document uploaded as version ' + item.version + '. Previous versions remain available.');
          }} />}
          {page === 'verification' && <Verification fdrs={fdrs} role={role} runOcr={runOcr} runBankCheck={runBankCheck} completeScrutiny={completeScrutiny} openDetail={openDetail} updateFdr={updateFdr} notify={notify} />}
          {page === 'dates' && <DateTracking fdrs={fdrs} month={month} setMonth={setMonth} threshold={threshold} setThreshold={setThreshold} role={role} />}
          {page === 'renewals' && <Renewals fdrs={fdrs} onNew={() => setModal('new-renewal')} openDetail={openDetail} />}
          {page === 'release' && <Release requests={releases} role={role} onNew={() => setModal('new-release')} onRecommend={recommendRelease} onDecision={decideRelease} openDetail={openDetail} />}
          {page === 'alerts' && <Alerts alerts={alerts} onUpdate={updateAlert} />}
          {page === 'reports' && <Reports fdrs={fdrs} releases={releases} reportType={reportType} setReportType={setReportType} exportCsv={exportCsv} />}
          {page === 'audit' && <AuditTrail audit={audit} />}
        </main>
        <footer className="app-footer"><span>© 2026 Nidhi Setu · SIH26265 Prototype</span><span><span className="live-dot" /> Demo environment — not connected to live bank or AICTE systems</span></footer>
      </div>

      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
      {modal === 'new-fdr' && <Modal title="Submit a new FDR" subtitle="Create an institutional submission. This record will begin as Submitted, not bank-verified." onClose={() => setModal('')} wide><form className="form-grid" onSubmit={addFdrFromForm}>
        <Field label="Institution name" name="institution" required defaultValue="Suryodaya Institute of Technology" />
        <Field label="FDR reference number" name="ref" required placeholder="e.g. FDR/BOB/884219" />
        <Field label="Issuing bank" name="bank" required placeholder="Bank name" />
        <Field label="Branch" name="branch" placeholder="Branch / location" />
        <Field label="Deposit amount (₹)" name="amount" type="number" required placeholder="2500000" />
        <Field label="Issue date" name="issueDate" type="date" required />
        <Field label="Maturity date" name="maturityDate" type="date" required />
        <Field label="Lien / purpose note" name="lien" defaultValue="AICTE security deposit" />
        <div className="form-note"><InfoIcon />Submitted values are institution declarations. Upload a document and complete verification separately.</div>
        <div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={() => setModal('')}>Cancel</button><button className="btn btn-primary" type="submit"><Plus size={16} /> Submit FDR</button></div>
      </form></Modal>}
      {modal === 'new-release' && <Modal title="Request release / refund" subtitle="Submit a request for scrutiny. Final release requires a separate approving authority." onClose={() => setModal('')}><form className="form-grid one-column" onSubmit={addReleaseFromForm}>
        <label className="field"><span>FDR record</span><select name="fdrId" required defaultValue={fdrs[0]?.id}>{fdrs.filter(item => item.status !== 'Released').map(item => <option key={item.id} value={item.id}>{item.id} · {item.institution}</option>)}</select></label>
        <label className="field"><span>Reason for release / refund</span><textarea name="reason" required rows="4" placeholder="Provide the institutional request and supporting context." /></label>
        <div className="form-note"><ShieldCheck size={16} />Maker-checker control applies. The requesting / recommending role cannot approve its own recommendation.</div>
        <div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={() => setModal('')}>Cancel</button><button type="submit" className="btn btn-primary">Submit request <ArrowRight size={16} /></button></div>
      </form></Modal>}
      {modal === 'new-renewal' && <Modal title="Register replacement FDR" subtitle="Link a replacement instrument to the previous FDR. The old record will remain in history." onClose={() => setModal('')}><form className="form-grid one-column" onSubmit={addRenewalFromForm}>
        <label className="field"><span>Previous FDR</span><select name="oldFdrId" required>{fdrs.filter(item => item.status !== 'Released' && item.status !== 'Renewed / Replaced').map(item => <option key={item.id} value={item.id}>{item.id} · {item.institution}</option>)}</select></label>
        <Field label="New FDR reference" name="ref" required placeholder="FDR/NEW/000001" />
        <Field label="Issuing bank" name="bank" placeholder="Bank name" />
        <Field label="Replacement amount (₹)" name="amount" type="number" required />
        <Field label="New maturity date" name="maturityDate" type="date" required />
        <div className="form-note"><RefreshCw size={16} />The replacement will be created as Submitted and must be verified independently.</div>
        <div className="modal-actions"><button type="button" className="btn btn-quiet" onClick={() => setModal('')}>Cancel</button><button type="submit" className="btn btn-primary">Register replacement <ArrowRight size={16} /></button></div>
      </form></Modal>}
      {modal === 'detail' && selectedFdr && <Modal title={selectedFdr.id + ' · FDR details'} subtitle={selectedFdr.institution} onClose={() => setModal('')} wide>
        <div className="detail-topline"><Badge>{selectedFdr.status}</Badge><span className="muted">Reference {role === 'Institution User' ? maskRef(selectedFdr.ref) : selectedFdr.ref}</span><span className="muted">Updated {dateLabel(selectedFdr.updatedAt?.slice(0, 10) || selectedFdr.createdAt)}</span></div>
        <div className="detail-grid"><div className="detail-panel"><div className="panel-kicker">INSTRUMENT INFORMATION</div><div className="detail-amount">{money(selectedFdr.amount)}</div><div className="detail-label">Submitted deposit amount</div><dl><dt>FDR reference</dt><dd>{role === 'Institution User' ? maskRef(selectedFdr.ref) : selectedFdr.ref}</dd><dt>Issuing bank</dt><dd>{selectedFdr.bank}</dd><dt>Branch</dt><dd>{selectedFdr.branch || '—'}</dd><dt>Issue date</dt><dd>{dateLabel(selectedFdr.issueDate)}</dd><dt>Maturity date</dt><dd>{dateLabel(selectedFdr.maturityDate)}</dd><dt>Lien note</dt><dd>{selectedFdr.lienNote || selectedFdr.lien || '—'}</dd><dt>Assigned officer</dt><dd>{selectedFdr.officer || 'Unassigned'}</dd></dl></div><div className="detail-panel"><div className="panel-kicker">FIELD TRUST & VERIFICATION</div><ValueRow label="Institution submitted" value={money(selectedFdr.submitted?.amount)} trust="Submitted" /><ValueRow label="Document extracted" value={selectedFdr.extracted ? money(selectedFdr.extracted.amount) : 'Not extracted'} trust={selectedFdr.extracted ? 'Extracted' : null} /><ValueRow label="Bank confirmed" value={selectedFdr.bankConfirmed ? money(selectedFdr.bankConfirmed.amount) : 'Awaiting confirmation'} trust={selectedFdr.bankConfirmed ? 'Bank-confirmed' : null} /><div className="detail-divider" /><ValueRow label="Submitted maturity" value={dateLabel(selectedFdr.submitted?.maturityDate)} trust="Submitted" /><ValueRow label="Extracted maturity" value={dateLabel(selectedFdr.extracted?.maturityDate)} trust={selectedFdr.extracted ? 'Extracted' : null} /><ValueRow label="Bank-confirmed maturity" value={dateLabel(selectedFdr.bankConfirmed?.maturityDate)} trust={selectedFdr.bankConfirmed ? 'Bank-confirmed' : null} /></div></div>
        {selectedFdr.finding && <div className="finding-banner"><AlertTriangle size={17} /><div><strong>Finding requires human review</strong><span>{selectedFdr.finding}</span></div></div>}
        <div className="modal-actions"><button className="btn btn-quiet" onClick={() => setModal('')}>Close</button><button className="btn btn-primary" onClick={() => { setModal(''); setPage('verification'); }}>Open in Verification Centre <ArrowRight size={15} /></button></div>
      </Modal>}
    </div>
  );
}

function Field({ label, name, type, required, placeholder, defaultValue }) {
  return <label className="field"><span>{label}</span><input name={name} type={type || 'text'} required={required} placeholder={placeholder} defaultValue={defaultValue} /></label>;
}
function InfoIcon() { return <CircleHelp size={16} />; }
function ValueRow({ label, value, trust }) {
  return <div className="value-row"><span>{label}</span><strong>{value}</strong>{trust ? <Trust type={trust} /> : <span className="muted">—</span>}</div>;
}

function LoginScreen({ role, onRoleChange, onEnter }) {
  return <div className="login-screen"><div className="login-left"><div className="brand-lockup login-brand"><div className="brand-mark"><Landmark size={22} /></div><div><div className="brand-name">nidhi setu</div><div className="brand-sub">SECURITY DEPOSIT MANAGEMENT</div></div></div><div className="login-intro"><div className="eyebrow light-eyebrow">AICTE · REGULATION BUREAU</div><h1>Every deposit.<br /><span>Every date.</span><br />Accounted for.</h1><p>A unified workspace for institutional security deposits and FDR lifecycle management — from submission to verified release.</p><div className="login-points"><div><ShieldCheck size={17} />Evidence-led verification</div><div><CalendarDays size={17} />Proactive maturity monitoring</div><div><ClipboardCheck size={17} />Traceable approval workflows</div></div></div><div className="login-left-footer">SMART INDIA HACKATHON 2026 <span>·</span> SIH26265</div></div><div className="login-right"><div className="login-card"><div className="login-card-top"><span className="eyebrow">SECURE WORKSPACE</span><span className="demo-pill"><i /> DEMO ENVIRONMENT</span></div><h2>Welcome to Nidhi Setu</h2><p className="login-subtitle">Sign in to continue to your financial operations workspace.</p><form onSubmit={event => { event.preventDefault(); onEnter(); }}><label className="field"><span>Email address</span><input type="email" defaultValue="demo@nidhi-setu.in" /></label><label className="field"><span>Password</span><input type="password" defaultValue="demopassword" /></label><div className="login-options"><label><input type="checkbox" defaultChecked /> Remember me</label><button type="button" onClick={() => window.alert('This is a prototype login. Password recovery is not connected.')}>Forgot password?</button></div><label className="field"><span>Explore as a demo role</span><select value={role} onChange={event => onRoleChange(event.target.value)}>{ROLES.map(item => <option key={item}>{item}</option>)}</select></label><button type="submit" className="btn btn-primary login-submit">Enter workspace <ArrowRight size={16} /></button></form><div className="login-legal"><Shield size={14} /> Prototype authentication only. No real credentials are required.</div></div><div className="login-footnote">Nidhi Setu · Financial Record Management & Regulatory Compliance</div></div></div>;
}

function Dashboard({ fdrs, releases, alerts, audit, upcoming, pendingVerification, pendingRelease, openDetail, setPage }) {
  const active = fdrs.filter(item => ['Active', 'Verified', 'Expiring'].includes(item.status));
  const matured = fdrs.filter(item => item.status === 'Matured');
  const total = fdrs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const counts = ['Submitted', 'Under scrutiny', 'Verified', 'Active', 'Expiring', 'Matured', 'Renewed / Replaced', 'Release requested', 'Released'].map(status => ({ status, count: fdrs.filter(item => item.status === status).length }));
  const chartData = { labels: counts.map(item => item.status), datasets: [{ data: counts.map(item => item.count), backgroundColor: ['#9AAFC2', '#6885A2', '#82A999', '#438568', '#C18A38', '#B95350', '#7C91A9', '#D39B54', '#8295A2'], borderWidth: 0, hoverOffset: 4 }] };
  const chartOptions = { cutout: '68%', plugins: { legend: { display: false }, tooltip: { backgroundColor: '#20334D', padding: 10 } }, maintainAspectRatio: false };
  const upcomingRows = fdrs.filter(item => daysUntil(item.maturityDate) >= 0).sort((a, b) => a.maturityDate.localeCompare(b.maturityDate)).slice(0, 5);
  return <div>
    <SectionHeading eyebrow="REGULATION BUREAU / OPERATIONS" title="Overview dashboard" description="A consolidated view of security deposits, verification progress and upcoming obligations." action={<span className="demo-data-label"><span /> DEMO DATA · 31 OCT 2026</span>} />
    <div className="metric-grid six">
      <Metric label="Total FDR records" value={fdrs.length} helper={compactMoney(total) + ' portfolio value'} icon={FileText} />
      <Metric label="Active deposits" value={active.length} helper="Verified and currently in force" icon={Wallet} tone="metric-green" />
      <Metric label="Expiring soon" value={upcoming.length} helper="Within configured reminder window" icon={Clock3} tone="metric-amber" />
      <Metric label="Matured deposits" value={matured.length} helper="Awaiting next lifecycle action" icon={CalendarDays} tone="metric-red" />
      <Metric label="Pending verification" value={pendingVerification} helper="Not yet bank-confirmed" icon={ShieldCheck} tone="metric-blue" />
      <Metric label="Release requests" value={pendingRelease} helper="Open requests in workflow" icon={ArrowLeftRight} tone="metric-purple" />
    </div>
    <div className="dashboard-grid">
      <section className="panel portfolio-panel"><PanelTitle title="FDR portfolio overview" subtitle="Distribution by current lifecycle state" right={<span className="panel-meta"> {fdrs.length} records</span>} /><div className="portfolio-content"><div className="donut-wrap"><Doughnut data={chartData} options={chartOptions} /><div className="donut-center"><strong>{fdrs.length}</strong><span>Total FDRs</span></div></div><div className="legend-list">{counts.filter(item => item.count > 0).map((item, index) => <div key={item.status}><i style={{ background: chartData.datasets[0].backgroundColor[counts.indexOf(item)] }} /><span>{item.status}</span><strong>{item.count}</strong></div>)}</div></div></section>
      <section className="panel action-panel"><PanelTitle title="Pending actions" subtitle="Items that may need attention" right={<button className="text-link" onClick={() => setPage('alerts')}>View alerts <ArrowRight size={13} /></button>} /><div className="action-list">
        <ActionLine icon={ShieldCheck} label="Bank verifications pending" value={pendingVerification} tone="blue" onClick={() => setPage('verification')} />
        <ActionLine icon={AlertTriangle} label="Discrepancies for scrutiny" value={fdrs.filter(item => item.finding).length} tone="amber" onClick={() => setPage('verification')} />
        <ActionLine icon={CalendarDays} label="Maturities in reminder window" value={upcoming.length} tone="red" onClick={() => setPage('dates')} />
        <ActionLine icon={RefreshCw} label="Renewals to monitor" value={fdrs.filter(item => item.status === 'Matured' || item.status === 'Expiring').length} tone="slate" onClick={() => setPage('renewals')} />
        <ActionLine icon={ArrowLeftRight} label="Release requests pending" value={pendingRelease} tone="green" onClick={() => setPage('release')} />
      </div><div className="panel-footnote"><span className="live-dot" /> Updated from the local prototype workspace</div></section>
      <section className="panel upcoming-panel"><PanelTitle title="Upcoming maturities" subtitle="Nearest instrument maturity dates" right={<button className="text-link" onClick={() => setPage('dates')}>All dates <ArrowRight size={13} /></button>} /><div className="table-wrap"><table><thead><tr><th>INSTITUTION / FDR</th><th>BANK</th><th>AMOUNT</th><th>MATURITY</th><th>REMAINING</th><th>STATUS</th><th /></tr></thead><tbody>{upcomingRows.map(item => <tr key={item.id} onClick={() => openDetail(item.id)} className="click-row"><td><strong>{item.institution}</strong><small>{item.id} · {item.ref}</small></td><td>{item.bank}</td><td className="numeric">{money(item.amount)}</td><td>{dateLabel(item.maturityDate)}</td><td><span className={'days-pill ' + (daysUntil(item.maturityDate) <= 30 ? 'days-urgent' : '')}>{daysUntil(item.maturityDate)} days</span></td><td><Badge>{item.status}</Badge></td><td><ChevronRight size={15} className="muted" /></td></tr>)}</tbody></table>{upcomingRows.length === 0 && <EmptyState title="No upcoming maturities" detail="There are no instruments with future maturity dates." />}</div></section>
      <section className="panel activity-panel"><PanelTitle title="Recent activity" subtitle="Latest changes in the audit history" right={<button className="text-link" onClick={() => setPage('audit')}>Full audit trail <ArrowRight size={13} /></button>} /><div className="activity-list">{audit.map(item => <div className="activity-item" key={item.id}><div className="activity-marker"><Check size={13} /></div><div><strong>{item.action}</strong><span>{item.description}</span><small>{item.actor} · {new Date(item.time).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></div></div>)}</div></section>
    </div>
  </div>;
}

function PanelTitle({ title, subtitle, right }) {
  return <div className="panel-title"><div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>{right && <div>{right}</div>}</div>;
}
function ActionLine({ icon: Icon, label, value, tone, onClick }) {
  return <button className="action-line" onClick={onClick}><span className={'action-icon ' + tone}><Icon size={16} /></span><span>{label}</span><strong>{value}</strong><ChevronRight size={14} className="muted" /></button>;
}

function Repository({ fdrs, allFdrs, search, setSearch, statusFilter, setStatusFilter, bankFilter, setBankFilter, banks, openDetail, onNew, onExport }) {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 7;
  const pageCount = Math.max(1, Math.ceil(fdrs.length / pageSize));
  const visible = fdrs.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  useEffect(() => setPageNumber(1), [search, statusFilter, bankFilter]);
  return <div><SectionHeading eyebrow="RECORDS / REGISTER" title="FDR repository" description="Institution-wise and instrument-wise records, with source-level trust visibility." action={<><button className="btn btn-secondary" onClick={onExport}><Download size={15} /> Export CSV</button><button className="btn btn-primary" onClick={onNew}><Plus size={16} /> Submit new FDR</button></>} />
    <div className="repo-summary"><div><span>Records in view</span><strong>{fdrs.length}</strong></div><div><span>Issuing banks</span><strong>{new Set(allFdrs.map(item => item.bank)).size}</strong></div><div><span>Portfolio value</span><strong>{compactMoney(allFdrs.reduce((sum, item) => sum + item.amount, 0))}</strong></div><div><span>Not bank-confirmed</span><strong>{allFdrs.filter(item => !item.bankConfirmed).length}</strong></div></div>
    <section className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><h3>All FDR records</h3><span>{fdrs.length} results</span></div><div className="filter-group"><label className="filter-select"><Filter size={14} /><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)}><option>All statuses</option>{[...new Set(allFdrs.map(item => item.status))].map(item => <option key={item}>{item}</option>)}</select></label><label className="filter-select"><Landmark size={14} /><select value={bankFilter} onChange={event => setBankFilter(event.target.value)}><option>All banks</option>{banks.map(item => <option key={item}>{item}</option>)}</select></label></div></div>
      <div className="table-wrap"><table><thead><tr><th>FDR ID / INSTITUTION</th><th>REFERENCE NUMBER</th><th>ISSUING BANK</th><th>DEPOSIT AMOUNT</th><th>ISSUE DATE</th><th>MATURITY DATE</th><th>LIEN NOTE</th><th>STATUS</th><th /></tr></thead><tbody>{visible.map(item => <tr key={item.id} className="click-row" onClick={() => openDetail(item.id)}><td><strong>{item.id}</strong><small>{item.institution}</small></td><td><span className="mono">{item.ref}</span></td><td>{item.bank}<small>{item.branch}</small></td><td className="numeric">{money(item.amount)}</td><td>{dateLabel(item.issueDate)}</td><td>{dateLabel(item.maturityDate)}</td><td><span className="truncate-cell">{item.lienNote || item.lien}</span></td><td><Badge>{item.status}</Badge></td><td><button className="row-action" onClick={event => { event.stopPropagation(); openDetail(item.id); }}><Eye size={16} /></button></td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="No matching FDR records" detail="Try adjusting your search or filters." />}</div>
      <div className="table-pagination"><span>Showing {fdrs.length ? (pageNumber - 1) * pageSize + 1 : 0}–{Math.min(pageNumber * pageSize, fdrs.length)} of {fdrs.length} records</span><div><button disabled={pageNumber === 1} onClick={() => setPageNumber(value => value - 1)}><ChevronLeft size={15} /> Previous</button><span className="page-indicator">{pageNumber} / {pageCount}</span><button disabled={pageNumber === pageCount} onClick={() => setPageNumber(value => value + 1)}>Next <ChevronRight size={15} /></button></div></div>
    </section><p className="subtle-note"><ShieldCheck size={14} /> Institutional declarations, extracted document values and bank confirmations remain separate throughout the register.</p>
  </div>;
}

function Documents({ documents, fdrs, selectedDoc, setSelectedDoc, category, setCategory, docFdr, setDocFdr, onUpload }) {
  const activeDoc = documents.find(item => item.id === selectedDoc) || documents[0];
  const versions = activeDoc ? documents.filter(item => item.fdrId === activeDoc.fdrId).sort((a, b) => b.version - a.version) : [];
  return <div><SectionHeading eyebrow="EVIDENCE / DOCUMENT CONTROL" title="Document management" description="Institutional submissions, supporting evidence and retained document versions." action={<span className="demo-data-label"><span /> LOCAL DOCUMENT METADATA</span>} />
    <div className="documents-layout"><div className="documents-main">
      <section className="panel upload-panel"><PanelTitle title="Upload a document" subtitle="PDF and image files are supported in this local prototype." /><div className="upload-controls"><label className="field"><span>Document category</span><select value={category} onChange={event => setCategory(event.target.value)}>{['Original FDR Certificate', 'Renewal Certificate', 'Bank Confirmation', 'Discharge Letter', 'Release Letter', 'Supporting Correspondence', 'Other Supporting Documents'].map(item => <option key={item}>{item}</option>)}</select></label><label className="field"><span>Link to FDR record</span><select value={docFdr} onChange={event => setDocFdr(event.target.value)}>{fdrs.map(item => <option key={item.id} value={item.id}>{item.id} · {item.institution}</option>)}</select></label></div><label className="drop-zone"><input type="file" accept=".pdf,.png,.jpg,.jpeg,.webp" onChange={event => { onUpload(event.target.files?.[0]); event.target.value = ''; }} /><span className="drop-icon"><Upload size={20} /></span><strong>Choose a file to upload</strong><span>PDF, JPG or PNG · File metadata is retained in this browser session.</span><span className="drop-link">Browse files</span></label><div className="document-disclaimer"><AlertCircle size={15} />Prototype note: files are represented by metadata only; secure server-side document storage is not connected.</div></section>
      <section className="panel documents-list"><PanelTitle title="Document register" subtitle="Latest versions and extraction status" right={<span className="panel-meta">{documents.length} documents</span>} /><div className="document-rows">{documents.map(item => <button key={item.id} className={'document-row ' + (selectedDoc === item.id ? 'document-selected' : '')} onClick={() => setSelectedDoc(item.id)}><span className="file-icon">{item.name.toLowerCase().endsWith('.pdf') ? <FileText size={18} /> : <FileImage size={18} />}</span><span className="document-name"><strong>{item.name}</strong><small>{item.category} · {item.institution}</small></span><span className="document-version">v{item.version}</span><Badge>{item.status}</Badge><ChevronRight size={15} className="muted" /></button>)}</div></section>
    </div><aside className="panel document-preview"><div className="preview-top"><div><div className="panel-kicker">DOCUMENT PREVIEW</div><strong>{activeDoc?.name || 'Select a document'}</strong></div><button className="icon-button" title="Preview options" onClick={() => window.alert('Preview is simulated in this prototype.')}><MoreHorizontal size={18} /></button></div><div className="fake-pdf"><div className="pdf-toolbar"><span><FileText size={14} /> {activeDoc?.name || 'Document'}</span><span>− <b>100%</b> +</span></div><div className="pdf-page"><div className="pdf-seal"><Landmark size={23} /></div><div className="pdf-overline">BANK DOCUMENT · SAMPLE PREVIEW</div><h4>FIXED DEPOSIT RECEIPT</h4><div className="pdf-rule" /><div className="pdf-line wide" /><div className="pdf-line medium" /><div className="pdf-field-grid"><div>DEPOSIT HOLDER</div><strong>{activeDoc?.institution || 'Institution name'}</strong><div>INSTRUMENT REFERENCE</div><strong>{fdrs.find(item => item.id === activeDoc?.fdrId)?.ref || '—'}</strong><div>DOCUMENT CATEGORY</div><strong>{activeDoc?.category || '—'}</strong><div>DOCUMENT DATE</div><strong>{dateLabel(activeDoc?.uploaded)}</strong></div><div className="pdf-stamp">SAMPLE<br />COPY</div><div className="pdf-line wide" /><div className="pdf-line short" /><div className="pdf-signature">Authorised Signatory</div></div></div><div className="preview-meta"><div><span>Document ID</span><strong>{activeDoc?.id || '—'}</strong></div><div><span>Uploaded</span><strong>{dateLabel(activeDoc?.uploaded)}</strong></div><div><span>File size</span><strong>{activeDoc?.size || '—'}</strong></div></div><div className="version-block"><div className="panel-kicker">VERSION HISTORY</div>{versions.map(item => <div className="version-row" key={item.id}><span className="version-dot" /><div><strong>Version {item.version}</strong><small>{dateLabel(item.uploaded)} · {item.id}</small></div>{item.version === Math.max(...versions.map(version => version.version)) && <Badge tone="status-good">Latest</Badge>}</div>)}</div><div className="extraction-box"><div className="panel-kicker">EXTRACTION SUMMARY</div>{activeDoc?.confidence ? <><strong>{activeDoc.confidence}% confidence</strong><span>Mock extraction values are available in Verification Centre.</span></> : <><strong>Awaiting extraction</strong><span>Run the mock OCR workflow after selecting the linked FDR.</span></>}</div></aside></div>
  </div>;
}

function Verification({ fdrs, role, runOcr, runBankCheck, completeScrutiny, openDetail, updateFdr, notify }) {
  const [selected, setSelected] = useState(fdrs[0]?.id || '');
  const [filter, setFilter] = useState('All records');
  const records = fdrs.filter(item => filter === 'All records' || (filter === 'Findings' && item.finding) || (filter === 'Awaiting bank' && !item.bankConfirmed));
  const current = records.find(item => item.id === selected) || records[0];
  useEffect(() => { if (current) setSelected(current.id); }, [filter]);
  const mismatch = current && current.extracted && (Number(current.submitted.amount) !== Number(current.extracted.amount) || current.submitted.maturityDate !== current.extracted.maturityDate);
  const isBankRole = role === 'Bank Verifier';
  return <div><SectionHeading eyebrow="SCRUTINY / TRUST WORKFLOW" title="Verification centre" description="Review document extraction, obtain a mock bank response and record a human scrutiny decision." action={<span className="demo-data-label"><span /> MOCK VERIFICATION ADAPTER</span>} />
    <div className="workflow-strip">{['Submission', 'OCR & extraction', 'Bank verification', 'Discrepancy review', 'Officer scrutiny'].map((item, index) => <div className="workflow-step" key={item}><span className={index === 0 ? 'step-done' : index === 1 ? 'step-current' : ''}>{index + 1}</span><strong>{item}</strong>{index < 4 && <i />}</div>)}</div>
    <div className="verification-layout"><section className="panel verification-queue"><div className="panel-title"><div><h3>Verification queue</h3><p>{records.length} records in the current view</p></div></div><div className="queue-filter"><select value={filter} onChange={event => setFilter(event.target.value)}><option>All records</option><option>Findings</option><option>Awaiting bank</option></select></div>{records.map(item => <button key={item.id} onClick={() => setSelected(item.id)} className={'queue-record ' + (current?.id === item.id ? 'queue-selected' : '')}><span className="queue-record-top"><strong>{item.id}</strong><Badge>{item.status}</Badge></span><span>{item.institution}</span><small>{item.ref}</small>{item.finding && <em><AlertTriangle size={12} /> Finding flagged</em>}</button>)}</section>
      {current ? <section className="verification-workspace"><div className="panel verification-instrument"><div className="instrument-heading"><div><div className="panel-kicker">SELECTED INSTRUMENT</div><h3>{current.id} <span>· {current.institution}</span></h3></div><button className="btn btn-secondary btn-small" onClick={() => openDetail(current.id)}><Eye size={14} /> Full record</button></div><div className="instrument-stats"><div><span>Submitted amount</span><strong>{money(current.submitted.amount)}</strong><Trust type="Submitted" /></div><div><span>Issue date</span><strong>{dateLabel(current.issueDate)}</strong><Trust type="Submitted" /></div><div><span>Maturity date</span><strong>{dateLabel(current.maturityDate)}</strong><Trust type="Submitted" /></div><div><span>Issuing bank</span><strong>{current.bank}</strong><Trust type="Submitted" /></div></div></div>
        <div className="panel compare-panel"><PanelTitle title="Source comparison" subtitle="Values stay attributed to their source." /><div className="compare-table"><div className="compare-header"><span>FIELD</span><span>SUBMITTED</span><span>EXTRACTED</span><span>BANK-CONFIRMED</span></div>{['amount', 'ref', 'bank', 'issueDate', 'maturityDate'].map(field => { const label = { amount: 'Deposit amount', ref: 'Reference number', bank: 'Issuing bank', issueDate: 'Issue date', maturityDate: 'Maturity date' }[field]; const format = value => field === 'amount' && value !== undefined ? money(value) : ['issueDate', 'maturityDate'].includes(field) ? dateLabel(value) : (value || '—'); return <div className="compare-row" key={field}><strong>{label}</strong><span>{format(current.submitted?.[field])}</span><span className={current.extracted && current.submitted?.[field] !== current.extracted?.[field] ? 'mismatch-value' : ''}>{current.extracted ? format(current.extracted[field]) : 'Not extracted'}</span><span>{current.bankConfirmed ? format(current.bankConfirmed[field]) : current.bankCheckUnavailable ? 'Unavailable' : 'Awaiting confirmation'}</span></div>; })}</div>
          {mismatch && <div className="finding-banner"><AlertTriangle size={17} /><div><strong>Discrepancy detected — human review required</strong><span>Submitted and extracted values differ. This is a review signal, not a fraud finding or automatic rejection.</span></div></div>}
          {current.finding && <div className="review-note"><strong>Existing scrutiny finding</strong><span>{current.finding}</span></div>}
        </div>
        <div className="verification-actions-grid"><div className="panel step-panel"><div className="step-panel-head"><span className="step-number">02</span><div><strong>OCR field extraction</strong><small>Predefined sample extraction response</small></div></div><div className="confidence-line"><span>Extraction confidence</span><strong>{current.extracted ? current.extracted.confidence + '%' : 'Not run'}</strong></div><div className="confidence-track"><i style={{ width: (current.extracted?.confidence || 0) + '%' }} /></div><button className="btn btn-secondary btn-block" onClick={() => runOcr(current.id)}><Zap size={15} /> {current.extracted ? 'Re-run mock extraction' : 'Run mock OCR extraction'}</button><div className="micro-copy">Source: linked document · Simulated Tesseract-style field response</div></div>
          <div className="panel step-panel"><div className="step-panel-head"><span className="step-number">03</span><div><strong>Bank verification</strong><small>Mock adapter · no live bank connection</small></div></div><div className="bank-result">{current.bankConfirmed ? <><Badge tone="status-good">Bank-confirmed</Badge><span>Response recorded {current.bankConfirmed.checkedAt ? dateLabel(current.bankConfirmed.checkedAt.slice(0, 10)) : 'in demo data'}</span></> : current.bankCheckUnavailable ? <><Badge tone="status-warn">Unavailable</Badge><span>Manual verification fallback is required.</span></> : <><Badge tone="status-neutral">Awaiting response</Badge><span>Institution values remain unconfirmed.</span></>}</div><div className="action-pair"><button className="btn btn-primary btn-small" onClick={() => runBankCheck(current.id, 'confirm')}><Check size={14} /> Confirm match</button><button className="btn btn-quiet btn-small" onClick={() => runBankCheck(current.id, 'mismatch')}><AlertTriangle size={14} /> Mismatch</button></div><button className="text-link" onClick={() => runBankCheck(current.id, 'unavailable')}>Simulate unavailable bank service</button></div>
          <div className="panel step-panel scrutiny-panel"><div className="step-panel-head"><span className="step-number">05</span><div><strong>Officer scrutiny</strong><small>Human decision after evidence review</small></div></div><p>Complete scrutiny only after bank confirmation and resolution of material differences.</p><button className="btn btn-primary btn-block" disabled={!current.bankConfirmed || mismatch} onClick={() => completeScrutiny(current.id)}><FileCheck2 size={15} /> Mark verified & active</button><button className="text-link" onClick={() => { const note = window.prompt('Add a scrutiny observation', current.finding || ''); if (note !== null) updateFdr(current.id, { finding: note }, 'Scrutiny observation added', note); }}>Add / update scrutiny observation</button></div>
        </div>
      </section> : <section className="panel"><EmptyState title="No records in this queue" detail="Change the queue filter to view other FDRs." /></section>}
    </div>
    <div className="subtle-note"><ShieldCheck size={14} /> {isBankRole ? 'Bank verifier demo view: confirmation actions use predefined responses only.' : 'Trust labels are source-specific. No institution declaration becomes bank-confirmed without an explicit confirmation event.'}</div>
  </div>;
}

function DateTracking({ fdrs, month, setMonth, threshold, setThreshold, role }) {
  const monthStart = new Date(month.getFullYear(), month.getMonth(), 1);
  const startDay = monthStart.getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const previousDays = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  const cells = [];
  for (let index = 0; index < 42; index++) {
    const day = index - startDay + 1;
    const actualDay = day < 1 ? previousDays + day : day > daysInMonth ? day - daysInMonth : day;
    const cellMonth = day < 1 ? month.getMonth() - 1 : day > daysInMonth ? month.getMonth() + 1 : month.getMonth();
    const cellDate = new Date(month.getFullYear(), cellMonth, actualDay);
    const dateKey = cellDate.getFullYear() + '-' + String(cellDate.getMonth() + 1).padStart(2, '0') + '-' + String(actualDay).padStart(2, '0');
    const events = fdrs.filter(item => item.maturityDate === dateKey);
    cells.push({ day: actualDay, inMonth: day > 0 && day <= daysInMonth, key: dateKey, events });
  }
  const near = fdrs.filter(item => daysUntil(item.maturityDate) >= 0).sort((a, b) => a.maturityDate.localeCompare(b.maturityDate));
  const canConfigure = role === 'Administrator' || role === 'Scrutiny Officer';
  return <div><SectionHeading eyebrow="MONITORING / DEADLINES" title="Date tracking" description="A forward-looking view of instrument maturity, renewal timing and follow-up obligations." action={<span className="demo-data-label"><span /> DAILY SCAN SIMULATED</span>} />
    <div className="date-metrics"><div className="date-metric"><Clock3 size={17} /><span>Within {threshold} days</span><strong>{near.filter(item => daysUntil(item.maturityDate) <= threshold).length}</strong></div><div className="date-metric"><AlertTriangle size={17} /><span>Already matured</span><strong>{fdrs.filter(item => daysUntil(item.maturityDate) < 0 && item.status !== 'Released').length}</strong></div><div className="date-metric"><RefreshCw size={17} /><span>Renewal / replacement</span><strong>{fdrs.filter(item => ['Matured', 'Expiring'].includes(item.status)).length}</strong></div><div className="date-metric"><Bell size={17} /><span>Reminder threshold</span><strong>{threshold} days</strong></div></div>
    <div className="dates-layout"><section className="panel calendar-panel"><div className="calendar-header"><div><div className="panel-kicker">MATURITY CALENDAR</div><h3>{month.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</h3></div><div className="calendar-controls"><button className="icon-button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft size={17} /></button><button className="btn btn-quiet btn-small" onClick={() => setMonth(new Date(2026, 9, 1))}>Today</button><button className="icon-button" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight size={17} /></button></div></div><div className="calendar-grid">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div className="calendar-weekday" key={day}>{day}</div>)}{cells.map((cell, index) => <div key={index} className={'calendar-cell ' + (cell.inMonth ? '' : 'calendar-outside') + (cell.key === todayISO ? ' calendar-today' : '')}><span>{cell.day}</span>{cell.events.slice(0, 2).map(item => <div key={item.id} className="calendar-event" title={item.institution}>{item.id.replace('FDR-', '')} · {item.institution.split(' ')[0]}</div>)}</div>)}</div><div className="calendar-legend"><span><i className="legend-maturity" /> Maturity date</span><span><i className="legend-today" /> Today</span><span><i className="legend-expired" /> Past-due instrument</span></div></section>
      <section className="panel reminder-panel"><PanelTitle title="Reminder configuration" subtitle="Local demonstration settings" /><div className="reminder-setting"><label htmlFor="threshold">Advance maturity reminder</label><strong>{threshold} days before</strong><input id="threshold" type="range" min="7" max="90" step="1" value={threshold} disabled={!canConfigure} onChange={event => setThreshold(Number(event.target.value))} /><div className="range-labels"><span>7 days</span><span>90 days</span></div></div><div className="escalation-steps"><div><span>1</span><div><strong>Advance reminder</strong><small>{threshold} days before maturity</small></div></div><div><span>2</span><div><strong>Assigned officer alert</strong><small>When a deadline enters the active window</small></div></div><div><span>3</span><div><strong>Senior authority escalation</strong><small>When action remains overdue or unresolved</small></div></div></div>{!canConfigure && <p className="permission-note">Switch to Scrutiny Officer or Administrator to change reminder settings.</p>}</section></div>
    <section className="panel upcoming-date-table"><PanelTitle title="Upcoming and past-due instruments" subtitle="Ordered by maturity date" /><div className="table-wrap"><table><thead><tr><th>INSTITUTION</th><th>FDR REFERENCE</th><th>AMOUNT</th><th>MATURITY DATE</th><th>DAYS REMAINING</th><th>REMINDER STATUS</th></tr></thead><tbody>{near.map(item => <tr key={item.id}><td><strong>{item.institution}</strong><small>{item.id}</small></td><td className="mono">{item.ref}</td><td className="numeric">{money(item.amount)}</td><td>{dateLabel(item.maturityDate)}</td><td><span className={'days-pill ' + (daysUntil(item.maturityDate) <= threshold ? 'days-urgent' : '')}>{daysUntil(item.maturityDate)} days</span></td><td><Badge>{daysUntil(item.maturityDate) <= threshold ? 'Reminder window' : 'Scheduled'}</Badge></td></tr>)}</tbody></table></div></section>
  </div>;
}

function Renewals({ fdrs, onNew, openDetail }) {
  const rows = fdrs.filter(item => ['Expiring', 'Matured', 'Renewed / Replaced', 'Submitted', 'Under scrutiny'].includes(item.status) || item.replacementFor);
  return <div><SectionHeading eyebrow="CONTINUITY / INSTRUMENT HISTORY" title="Renewals & replacements" description="Track approaching maturity, replacement submissions and linked instrument history." action={<button className="btn btn-primary" onClick={onNew}><Plus size={16} /> Register replacement FDR</button>} />
    <div className="renewal-flow">{['Approaching maturity', 'Renewal initiated', 'Replacement submitted', 'Verification pending', 'New FDR active'].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item}</strong>{index < 4 && <ArrowRight size={15} />}</div>)}</div>
    <section className="panel table-panel"><PanelTitle title="Renewal monitoring register" subtitle="Previous instruments are retained when replacements are added." /><div className="table-wrap"><table><thead><tr><th>INSTITUTION / FDR</th><th>REFERENCE</th><th>DEPOSIT AMOUNT</th><th>MATURITY</th><th>REMAINING</th><th>LIFECYCLE</th><th>LINKED RECORD</th><th /></tr></thead><tbody>{rows.map(item => <tr key={item.id} className="click-row" onClick={() => openDetail(item.id)}><td><strong>{item.institution}</strong><small>{item.id}</small></td><td className="mono">{item.ref}</td><td className="numeric">{money(item.amount)}</td><td>{dateLabel(item.maturityDate)}</td><td>{daysUntil(item.maturityDate) < 0 ? <span className="days-pill days-urgent">Matured</span> : <span className="days-pill">{daysUntil(item.maturityDate)} days</span>}</td><td><Badge>{item.status}</Badge></td><td>{item.replacedBy ? <span className="link-pill">Replaced by {item.replacedBy}</span> : item.replacementFor ? <span className="link-pill">Replaces {item.replacementFor}</span> : '—'}</td><td><ChevronRight size={15} className="muted" /></td></tr>)}</tbody></table>{rows.length === 0 && <EmptyState title="No renewal items" detail="There are no instruments in the renewal queue." />}</div></section>
    <div className="notice-card"><ShieldCheck size={18} /><div><strong>Historical continuity is preserved</strong><span>When a replacement FDR is created, the previous instrument is marked Renewed / Replaced and remains available in the repository and audit trail.</span></div></div>
  </div>;
}

function Release({ requests, role, onNew, onRecommend, onDecision, openDetail }) {
  return <div><SectionHeading eyebrow="CONTROLLED DISCHARGE / REFUND" title="Release & refund" description="A maker-checker workflow for institution requests, scrutiny recommendations and authority decisions." action={role === 'Institution User' || role === 'Administrator' ? <button className="btn btn-primary" onClick={onNew}><Plus size={16} /> New release request</button> : null} />
    <div className="release-summary"><div><span>Open requests</span><strong>{requests.filter(item => !['Released', 'Rejected'].includes(item.status)).length}</strong></div><div><span>Awaiting authority</span><strong>{requests.filter(item => item.status === 'Awaiting Approval').length}</strong></div><div><span>Released</span><strong>{requests.filter(item => item.status === 'Released').length}</strong></div><div><span>Returned for clarification</span><strong>{requests.filter(item => item.status === 'Clarification Required').length}</strong></div></div>
    <div className="release-list">{requests.map(item => <section className="panel release-card" key={item.id}><div className="release-card-head"><div><div className="panel-kicker">{item.id} · {dateLabel(item.date)}</div><h3>{item.institution}</h3><span className="mono">{item.fdrId}</span></div><Badge>{item.status}</Badge></div><p className="release-reason">{item.reason}</p><div className="release-progress"><div className="progress-step completed"><i><Check size={12} /></i><span>Requested</span></div><div className={item.recommendedBy ? 'progress-step completed' : 'progress-step'}><i>{item.recommendedBy ? <Check size={12} /> : '2'}</i><span>Scrutiny</span></div><div className={['Approved', 'Released'].includes(item.status) ? 'progress-step completed' : 'progress-step'}><i>{['Approved', 'Released'].includes(item.status) ? <Check size={12} /> : '3'}</i><span>Authority</span></div><div className={item.status === 'Released' ? 'progress-step completed' : 'progress-step'}><i>{item.status === 'Released' ? <Check size={12} /> : '4'}</i><span>Released</span></div></div><div className="release-meta"><div><span>Scrutiny recommendation</span><strong>{item.recommendedBy || 'Not recorded'}</strong></div><div><span>Authority action</span><strong>{item.approvedBy || 'Pending'}</strong></div><div><span>Scrutiny notes</span><strong>{item.remarks || 'No notes added'}</strong></div></div><div className="release-actions"><button className="btn btn-quiet btn-small" onClick={() => openDetail(item.fdrId)}><Eye size={14} /> View FDR</button>{role === 'Scrutiny Officer' && ['Under Scrutiny', 'Clarification Required'].includes(item.status) && <><button className="btn btn-secondary btn-small" onClick={() => onRecommend(item.id, 'Clarification Required')}>Send back for clarification</button><button className="btn btn-primary btn-small" onClick={() => onRecommend(item.id, 'Awaiting Approval')}>Recommend approval <ArrowRight size={14} /></button></>}{role === 'Approving Authority' && item.status === 'Awaiting Approval' && item.recommendedBy !== role && <><button className="btn btn-quiet btn-small" onClick={() => onDecision(item.id, 'Rejected')}>Reject</button><button className="btn btn-secondary btn-small" onClick={() => onDecision(item.id, 'Clarification Required')}>Send back</button><button className="btn btn-primary btn-small" onClick={() => onDecision(item.id, 'Released')}><Check size={14} /> Authorize release</button></>}{role === 'Approving Authority' && item.status === 'Approved' && <button className="btn btn-primary btn-small" onClick={() => onDecision(item.id, 'Released')}>Confirm final release <ArrowRight size={14} /></button>}</div></section>)}</div>
    <div className="notice-card"><ShieldCheck size={18} /><div><strong>Maker-checker separation is active in the demo</strong><span>A scrutiny recommendation must be recorded before the approving authority can finalize a release. The same role cannot perform both steps.</span></div></div>
  </div>;
}

function Alerts({ alerts, onUpdate }) {
  const [filter, setFilter] = useState('All');
  const [query, setQuery] = useState('');
  const visible = alerts.filter(item => (filter === 'All' || item.severity === filter || item.status === filter) && [item.title, item.detail, item.institution, item.assigned].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <div><SectionHeading eyebrow="TASK MANAGEMENT / ESCALATION" title="Alerts & escalations" description="Prioritized reminders and exceptions for verification, maturity, renewal and release workflows." action={<span className="demo-data-label"><span /> SIMULATED NOTIFICATIONS</span>} />
    <div className="alert-summary"><div><span>Active alerts</span><strong>{alerts.filter(item => item.status !== 'Resolved').length}</strong></div><div><span>Critical / high</span><strong>{alerts.filter(item => ['Critical', 'High'].includes(item.severity) && item.status !== 'Resolved').length}</strong></div><div><span>Overdue / escalated</span><strong>{alerts.filter(item => item.escalations > 0 && item.status !== 'Resolved').length}</strong></div><div><span>Acknowledged</span><strong>{alerts.filter(item => item.status === 'Acknowledged').length}</strong></div></div>
    <section className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><h3>Alert register</h3><span>{visible.length} alerts</span></div><div className="filter-group"><label className="filter-search"><Search size={14} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search alerts" /></label><select className="select-compact" value={filter} onChange={event => setFilter(event.target.value)}>{['All', 'Critical', 'High', 'Medium', 'Open', 'Acknowledged', 'Resolved'].map(item => <option key={item}>{item}</option>)}</select></div></div><div className="alert-list">{visible.map(item => <div className="alert-row" key={item.id}><div className={'alert-severity ' + item.severity.toLowerCase()}>{item.severity === 'Critical' ? <AlertCircle size={18} /> : <Bell size={18} />}</div><div className="alert-main"><div className="alert-title-line"><strong>{item.title}</strong><Badge tone={item.status === 'Resolved' ? 'status-good' : statusClass(item.status)}>{item.status}</Badge><Badge tone={item.severity === 'Critical' ? 'status-danger' : item.severity === 'High' ? 'status-warn' : 'status-neutral'}>{item.severity}</Badge></div><p>{item.detail}</p><small>{item.institution} · {item.assigned} · {dateLabel(item.date)} · {item.escalations} escalation(s)</small></div><div className="alert-buttons">{item.status === 'Open' && <button className="btn btn-quiet btn-small" onClick={() => onUpdate(item.id, { status: 'Acknowledged' }, 'Alert acknowledged')}>Acknowledge</button>}{item.status !== 'Resolved' && <button className="btn btn-secondary btn-small" onClick={() => onUpdate(item.id, { status: 'Resolved' }, 'Alert resolved')}>Resolve</button>}{item.status !== 'Resolved' && <button className="icon-button" title="Escalate" onClick={() => onUpdate(item.id, { escalations: item.escalations + 1, assigned: 'Senior Authority' }, 'Alert escalated')}><ArrowRight size={16} /></button>}</div></div>)}</div>{visible.length === 0 && <EmptyState title="No matching alerts" detail="Try another severity or search term." />}</section>
    <div className="notice-card"><Bell size={18} /><div><strong>Notification delivery is simulated</strong><span>Alert state and escalation history are saved in localStorage. Email and SMS gateways are not connected.</span></div></div>
  </div>;
}

function Reports({ fdrs, releases, reportType, setReportType, exportCsv }) {
  const total = fdrs.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const institutions = [...new Set(fdrs.map(item => item.institution))].map(name => ({ institution: name, records: fdrs.filter(item => item.institution === name).length, amount: fdrs.filter(item => item.institution === name).reduce((sum, item) => sum + item.amount, 0), bankConfirmed: fdrs.filter(item => item.institution === name && item.bankConfirmed).length }));
  const records = reportType === 'Pending verification report' ? fdrs.filter(item => !item.bankConfirmed) : reportType === 'Expiring FDR report' ? fdrs.filter(item => daysUntil(item.maturityDate) >= 0 && daysUntil(item.maturityDate) <= 90) : reportType === 'Matured instrument report' ? fdrs.filter(item => item.status === 'Matured') : reportType === 'Release/refund report' ? releases : fdrs;
  function exportSelected() {
    if (reportType === 'Release/refund report') exportCsv(records, 'nidhi-setu-release-refund.csv');
    else exportCsv(records.map(item => ({ id: item.id, institution: item.institution, reference: item.ref, bank: item.bank, submitted_amount_inr: item.submitted?.amount, extracted_amount_inr: item.extracted?.amount ?? '', bank_confirmed_amount_inr: item.bankConfirmed?.amount ?? '', maturity_date: item.maturityDate, lifecycle_status: item.status, verification_state: item.bankConfirmed ? 'Bank-confirmed' : 'Awaiting confirmation' })), 'nidhi-setu-report.csv');
  }
  return <div><SectionHeading eyebrow="MANAGEMENT INFORMATION / EXPORTS" title="Reports & analytics" description="Portfolio reporting with source-aware financial values and downloadable CSV extracts." action={<button className="btn btn-primary" onClick={exportSelected}><Download size={15} /> Download report</button>} />
    <div className="report-kpis"><div><span>Total portfolio value</span><strong>{compactMoney(total)}</strong><small>Submitted register value</small></div><div><span>Bank-confirmed value</span><strong>{compactMoney(fdrs.filter(item => item.bankConfirmed).reduce((sum, item) => sum + Number(item.bankConfirmed.amount || 0), 0))}</strong><small>Based on mock bank confirmations</small></div><div><span>Verification coverage</span><strong>{Math.round((fdrs.filter(item => item.bankConfirmed).length / Math.max(1, fdrs.length)) * 100)}%</strong><small>Records with bank-confirmed response</small></div><div><span>Open release requests</span><strong>{releases.filter(item => !['Released', 'Rejected'].includes(item.status)).length}</strong><small>Across all institutions</small></div></div>
    <div className="reports-layout"><section className="panel report-builder"><PanelTitle title="Report builder" subtitle="Choose a report and export the matching records." /><label className="field"><span>Report type</span><select value={reportType} onChange={event => setReportType(event.target.value)}>{['Institution-wise FDR summary', 'Active deposit report', 'Expiring FDR report', 'Matured instrument report', 'Pending verification report', 'Renewal history', 'Release/refund report', 'Discrepancy report', 'Officer activity report'].map(item => <option key={item}>{item}</option>)}</select></label><div className="report-preview-box"><div className="panel-kicker">REPORT PREVIEW</div><strong>{reportType}</strong><span>{records.length} matching records</span><span>Prepared from local demo data · 31 Oct 2026</span></div><button className="btn btn-primary btn-block" onClick={exportSelected}><ArrowDownToLine size={15} /> Export selected report</button><button className="btn btn-secondary btn-block" onClick={() => window.print()}><FileText size={15} /> Print report preview</button></section>
      <section className="panel institution-report"><PanelTitle title="Institution-wise deposit summary" subtitle="Submitted portfolio view · fictional demo institutions" /><div className="table-wrap"><table><thead><tr><th>INSTITUTION</th><th>FDR RECORDS</th><th>SUBMITTED VALUE</th><th>BANK-CONFIRMED RECORDS</th><th>COVERAGE</th></tr></thead><tbody>{institutions.map(item => <tr key={item.institution}><td><strong>{item.institution}</strong></td><td>{item.records}</td><td className="numeric">{money(item.amount)}</td><td>{item.bankConfirmed} / {item.records}</td><td><div className="coverage-bar"><i style={{ width: (item.bankConfirmed / item.records * 100) + '%' }} /></div></td></tr>)}</tbody></table></div></section>
    </div><div className="subtle-note"><ShieldCheck size={14} /> Submitted, extracted and bank-confirmed amounts are exported in separate columns. No value is silently promoted to verified.</div>
  </div>;
}

function AuditTrail({ audit }) {
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All roles');
  const visible = audit.filter(item => (roleFilter === 'All roles' || item.role === roleFilter) && [item.id, item.actor, item.action, item.fdr, item.description].join(' ').toLowerCase().includes(query.toLowerCase()));
  return <div><SectionHeading eyebrow="ACCOUNTABILITY / EVENT HISTORY" title="Audit trail" description="A chronological record of submissions, verification, scrutiny, approvals and lifecycle changes." action={<span className="audit-integrity"><ShieldCheck size={15} /> HMAC chain · simulated</span>} />
    <div className="audit-summary"><div><span>Total events</span><strong>{audit.length}</strong></div><div><span>Unique actors</span><strong>{new Set(audit.map(item => item.actor)).size}</strong></div><div><span>Latest event</span><strong>{audit[0] ? new Date(audit[0].time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—'}</strong></div></div>
    <section className="panel table-panel"><div className="table-toolbar"><div className="toolbar-title"><h3>Event history</h3><span>Newest first</span></div><div className="filter-group"><label className="filter-search"><Search size={14} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search audit events" /></label><select className="select-compact" value={roleFilter} onChange={event => setRoleFilter(event.target.value)}><option>All roles</option>{ROLES.map(item => <option key={item}>{item}</option>)}</select></div></div><div className="table-wrap"><table><thead><tr><th>EVENT / TIMESTAMP</th><th>ACTOR</th><th>ROLE</th><th>ACTION</th><th>FDR REFERENCE</th><th>DESCRIPTION</th></tr></thead><tbody>{visible.map(item => <tr key={item.id}><td><strong>{item.id}</strong><small>{new Date(item.time).toLocaleString('en-IN')}</small></td><td>{item.actor}</td><td>{item.role}</td><td><strong>{item.action}</strong></td><td className="mono">{item.fdr}</td><td className="audit-description">{item.description}</td></tr>)}</tbody></table>{visible.length === 0 && <EmptyState title="No events found" detail="Try adjusting the role filter or search phrase." />}</div></section>
    <div className="notice-card"><Shield size={18} /><div><strong>Integrity model shown for demonstration only</strong><span>The UI represents a proposed HMAC-chained audit design. This frontend does not provide cryptographic immutability or production-grade audit guarantees.</span></div></div>
  </div>;
}
