/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarCheck,
  Sparkles,
  BookOpen,
  Home,
  UserCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  BellRing,
  Flag,
  RefreshCw,
} from 'lucide-react';
import {
  getEnquiries,
  getTreatments,
  getBlogPosts,
  getAuditLogs,
  updateEnquiryStatus,
  EnquiryRecord,
  AuditRecord,
} from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';
import { isFollowUpDue, isFollowUpUpcoming, localDateKey } from '../../lib/enquiryFollowUp';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>([]);
  const [treatmentsCount, setTreatmentsCount] = useState(0);
  const [blogCount, setBlogCount] = useState(0);
  const [auditLogs, setAuditLogs] = useState<AuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function loadMetrics() {
      setLoading(true);
      setLoadError(null);
      try {
        const [enqData, treatData, blogData, logsData] = await Promise.all([
          getEnquiries(),
          getTreatments(true),
          getBlogPosts(true),
          getAuditLogs(),
        ]);
        setEnquiries(enqData);
        setTreatmentsCount(treatData.length);
        setBlogCount(blogData.length);
        setAuditLogs(logsData);
      } catch (err) {
        console.error('Failed to load metrics:', err);
        setLoadError('Dashboard metrics could not be loaded. Please check permissions and retry.');
      } finally {
        setLoading(false);
      }
  }

  useEffect(() => {
    void loadMetrics();
  }, []);

  const metricsUnavailable = loading || Boolean(loadError);
  const totalEnquiries = enquiries.length;
  const pendingEnquiries = enquiries.filter((e) => e.status === 'new').length;
  const scheduledCount = enquiries.filter((e) => e.status === 'scheduled').length;
  const contactedCount = enquiries.filter((e) => e.status === 'contacted').length;
  const closedCount = enquiries.filter((e) => e.status === 'closed').length;
  const today = localDateKey();
  const dueEnquiries = enquiries
    .filter(enquiry => isFollowUpDue(enquiry, today))
    .sort((a, b) => {
      const byDate = (a.followUpDate || '').localeCompare(b.followUpDate || '');
      if (byDate !== 0) return byDate;
      return (b.priority === 'high' ? 1 : 0) - (a.priority === 'high' ? 1 : 0);
    });
  const upcomingCount = enquiries.filter(enquiry => isFollowUpUpcoming(enquiry, today)).length;
  const highPriorityCount = enquiries.filter(enquiry => enquiry.priority === 'high' && (enquiry.status === 'new' || enquiry.status === 'contacted')).length;

  const handleQuickStatusChange = async (id: string, status: EnquiryRecord['status']) => {
    try {
      await updateEnquiryStatus(id, status, undefined, user?.email || undefined);
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error('Status update error:', err);
      setActionError('Could not update enquiry status. Please retry.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome & Practice Overview Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#C9A47F]/20">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
            EXECUTIVE DASHBOARD
          </span>
          <h1 className="text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Clinical Practice Command Center
          </h1>
          <p className="text-xs text-[#AFA89F] mt-1">
            Dr. Samik Sharma · Shalby Multi-Specialty Hospital, Mohali
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/appointments"
            className="px-4 py-2 bg-[#C9A47F] text-[#0B0B0B] text-xs font-semibold uppercase tracking-wider hover:bg-[#DFCAAF] transition-colors"
          >
            Review Enquiries ({metricsUnavailable ? '—' : pendingEnquiries})
          </Link>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border border-[#C9A47F]/40 text-xs text-[#C9A47F] hover:bg-[#24211E] transition-colors flex items-center gap-1.5"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {(loadError || actionError) && (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-3 p-3 bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200">
          <span>{loadError || actionError}</span>
          {loadError && <button type="button" onClick={() => void loadMetrics()} className="flex items-center gap-2 underline"><RefreshCw className="w-3.5 h-3.5" /> Retry</button>}
        </div>
      )}

      {/* Real Statistics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Inquiries */}
        <div className="bg-[#181514] border border-[#C9A47F]/30 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#AFA89F] mb-3">
            <span className="text-xs uppercase tracking-wider">New Inquiries</span>
            <Clock className="w-4 h-4 text-[#C9A47F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#F6F0E9] font-light">
              {metricsUnavailable ? '—' : pendingEnquiries}
            </span>
            <span className="text-[11px] text-amber-400 font-medium">Awaiting Contact</span>
          </div>
          <p className="text-[11px] text-[#7C766F] mt-2">
            Recent enquiries loaded: {metricsUnavailable ? 'unavailable' : totalEnquiries} (maximum 100)
          </p>
          <div className="absolute top-0 right-0 w-12 h-12 bg-[#C9A47F]/5 rounded-bl-full pointer-events-none" />
        </div>

        {/* Metric 2: Scheduled Consultations */}
        <div className="bg-[#181514] border border-[#C9A47F]/30 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#AFA89F] mb-3">
            <span className="text-xs uppercase tracking-wider">Scheduled Slots</span>
            <CalendarCheck className="w-4 h-4 text-[#C9A47F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#F6F0E9] font-light">
              {metricsUnavailable ? '—' : scheduledCount}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">Staff-marked scheduled</span>
          </div>
          <p className="text-[11px] text-[#7C766F] mt-2">
            In discussion: {metricsUnavailable ? '—' : contactedCount}
          </p>
        </div>

        {/* Metric 3: Published Treatments */}
        <div className="bg-[#181514] border border-[#C9A47F]/30 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#AFA89F] mb-3">
            <span className="text-xs uppercase tracking-wider">Surgical Portfolio</span>
            <Sparkles className="w-4 h-4 text-[#C9A47F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#F6F0E9] font-light">
              {metricsUnavailable ? '—' : treatmentsCount}
            </span>
            <span className="text-[11px] text-[#C9A47F] font-medium">Procedures</span>
          </div>
          <p className="text-[11px] text-[#7C766F] mt-2">
            Facial, Body &amp; Reconstructive
          </p>
        </div>

        {/* Metric 4: Clinical Journal */}
        <div className="bg-[#181514] border border-[#C9A47F]/30 p-5 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#AFA89F] mb-3">
            <span className="text-xs uppercase tracking-wider">Articles &amp; Blog</span>
            <BookOpen className="w-4 h-4 text-[#C9A47F]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-serif text-[#F6F0E9] font-light">
              {metricsUnavailable ? '—' : blogCount}
            </span>
            <span className="text-[11px] text-[#C9A47F] font-medium">Published Guides</span>
          </div>
          <p className="text-[11px] text-[#7C766F] mt-2">
            Evidence-based clinical insights
          </p>
        </div>
      </div>

      {/* Action Center: work priorities and due follow-up queue */}
      <section className="bg-[#181514] border border-[#C9A47F]/20 p-5 sm:p-6 space-y-5" aria-labelledby="action-center-title">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase tracking-[0.23em] text-[#C9A47F]">OPERATIONS</span>
            <h2 id="action-center-title" className="font-serif text-xl sm:text-2xl text-[#F6F0E9] mt-1">Today's Follow-up Desk</h2>
            <p className="text-[11px] text-[#AFA89F] mt-1">Internal staff reminders only. These are not confirmed patient appointments.</p>
          </div>
          <Link to="/admin/appointments?followUp=due" className="inline-flex items-center gap-2 px-4 py-2 bg-[#C9A47F] text-[#0B0B0B] text-xs font-semibold hover:bg-[#DFCAAF]">
            Review due leads <ArrowRight className="w-3.5 h-3.5"/>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Due / overdue', value: dueEnquiries.length, icon: BellRing, color: 'text-amber-300' },
            { label: 'Upcoming', value: upcomingCount, icon: CalendarCheck, color: 'text-[#C9A47F]' },
            { label: 'High priority', value: highPriorityCount, icon: Flag, color: 'text-rose-300' },
            { label: 'New enquiries', value: pendingEnquiries, icon: Clock, color: 'text-blue-300' },
          ].map(card => (
            <div key={card.label} className="p-4 bg-[#221E1B] border border-white/10">
              <div className={`flex items-center gap-2 text-[11px] ${card.color}`}>
                <card.icon className="w-4 h-4"/>
                {card.label}
              </div>
              <p className="font-serif text-3xl text-[#F6F0E9] mt-2">{metricsUnavailable ? '—' : card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          <div className="lg:col-span-3 space-y-2">
            <div className="text-xs text-[#C9A47F] uppercase tracking-wider font-semibold mb-3">Needs staff attention</div>
            {!metricsUnavailable && dueEnquiries.length === 0 && <p className="text-xs text-[#AFA89F] p-4 border border-white/5">No overdue follow-ups in the loaded enquiry records.</p>}
            {!metricsUnavailable && dueEnquiries.slice(0, 5).map(e => (
              <div key={e.id || e.referenceCode} className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-[#151312] p-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#F6F0E9]">{e.fullName}</p>
                  <p className="text-[10px] text-[#AFA89F]">Due {e.followUpDate} · {e.referenceCode}</p>
                </div>
                <div className="flex items-center gap-2">
                  {e.priority === 'high' && <span className="text-[10px] text-rose-300">HIGH</span>}
                  <Link to="/admin/appointments?followUp=due" className="text-[11px] text-[#C9A47F] hover:underline">Review</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-2">
            <div className="text-xs text-[#C9A47F] uppercase tracking-wider font-semibold mb-3">Lead pipeline</div>
            {[
              { name: 'New', count: pendingEnquiries, color: 'bg-amber-400' },
              { name: 'Contacted', count: contactedCount, color: 'bg-blue-400' },
              { name: 'Scheduled', count: scheduledCount, color: 'bg-emerald-400' },
              { name: 'Closed', count: closedCount, color: 'bg-[#AFA89F]' },
            ].map(item => (
              <div key={item.name} className="mb-3">
                <div className="flex items-center justify-between text-xs text-[#F6F0E9] mb-1">
                  <span>{item.name}</span><span>{metricsUnavailable ? '—' : item.count}</span>
                </div>
                <div className="h-1.5 bg-[#2D2824] overflow-hidden">
                  <div className={`h-full ${item.color}`} style={{ width: `${totalEnquiries ? item.count / totalEnquiries * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[10px] text-[#7C766F]">Statistics show the latest 100 enquiries, not lifetime totals. Follow-up reminders are shown inside the admin dashboard only; no automatic emails are sent.</p>
      </section>

      {/* Quick Access CMS Shortcuts */}
      <div>
        <h2 className="text-sm font-sans uppercase tracking-[0.18em] text-[#C9A47F] mb-3 font-semibold">
          Editorial &amp; CMS Navigation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <Link
            to="/admin/homepage"
            className="p-4 bg-[#1C1817] border border-white/5 hover:border-[#C9A47F]/50 transition-colors group flex flex-col justify-between"
          >
            <Home className="w-5 h-5 text-[#C9A47F] mb-3" />
            <div>
              <p className="text-xs font-medium text-[#F6F0E9] group-hover:text-[#C9A47F]">Homepage CMS</p>
              <p className="text-[10px] text-[#AFA89F] mt-0.5">Hero, highlights &amp; banners</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#C9A47F]">
              <span>Edit Live Content</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/about"
            className="p-4 bg-[#1C1817] border border-white/5 hover:border-[#C9A47F]/50 transition-colors group flex flex-col justify-between"
          >
            <UserCheck className="w-5 h-5 text-[#C9A47F] mb-3" />
            <div>
              <p className="text-xs font-medium text-[#F6F0E9] group-hover:text-[#C9A47F]">About Surgeon</p>
              <p className="text-[10px] text-[#AFA89F] mt-0.5">Credentials &amp; fellowship</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#C9A47F]">
              <span>Update Profile</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/treatments"
            className="p-4 bg-[#1C1817] border border-white/5 hover:border-[#C9A47F]/50 transition-colors group flex flex-col justify-between"
          >
            <Sparkles className="w-5 h-5 text-[#C9A47F] mb-3" />
            <div>
              <p className="text-xs font-medium text-[#F6F0E9] group-hover:text-[#C9A47F]">Treatments CMS</p>
              <p className="text-[10px] text-[#AFA89F] mt-0.5">Procedures &amp; recovery protocols</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#C9A47F]">
              <span>Manage Services</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/blog"
            className="p-4 bg-[#1C1817] border border-white/5 hover:border-[#C9A47F]/50 transition-colors group flex flex-col justify-between"
          >
            <BookOpen className="w-5 h-5 text-[#C9A47F] mb-3" />
            <div>
              <p className="text-xs font-medium text-[#F6F0E9] group-hover:text-[#C9A47F]">Clinical Journal</p>
              <p className="text-[10px] text-[#AFA89F] mt-0.5">Educational patient articles</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#C9A47F]">
              <span>Write Article</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/admin/appointments"
            className="p-4 bg-[#1C1817] border border-[#C9A47F]/40 bg-gradient-to-br from-[#24211E] to-[#1C1817] hover:border-[#C9A47F] transition-colors group flex flex-col justify-between"
          >
            <CalendarCheck className="w-5 h-5 text-[#C9A47F] mb-3" />
            <div>
              <p className="text-xs font-medium text-[#F6F0E9] group-hover:text-[#C9A47F]">Inquiries Desk</p>
              <p className="text-[10px] text-[#AFA89F] mt-0.5">{metricsUnavailable ? 'Count unavailable' : `${pendingEnquiries} pending review`}</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-[10px] text-[#C9A47F]">
              <span>Open Desk</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </div>

      {/* Two Column Layout: Recent Patient Inquiries & Practice Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Recent Patient Inquiries */}
        <div className="lg:col-span-2 bg-[#181514] border border-[#C9A47F]/20 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h2 className="text-lg font-serif text-[#F6F0E9]">Recent Patient Consultation Inquiries</h2>
              <p className="text-xs text-[#AFA89F]">Confidential intake from online appointment modal</p>
            </div>
            <Link
              to="/admin/appointments"
              className="text-xs text-[#C9A47F] hover:text-[#DFCAAF] flex items-center gap-1 uppercase tracking-wider"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-[#AFA89F]">Loading patient inquiries...</div>
          ) : loadError ? (
            <div role="status" className="py-12 text-center text-xs text-amber-300">
              Enquiry records are unavailable. Check Firestore permissions and use Retry above.
            </div>
          ) : enquiries.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#C9A47F] mx-auto opacity-40" />
              <p className="text-xs text-[#F6F0E9]">No pending inquiries</p>
              <p className="text-[11px] text-[#7C766F]">
                New consultation requests submitted by patients will appear here immediately.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/5 text-[10px] text-[#C9A47F] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Patient / Contact</th>
                    <th className="pb-3 font-semibold">Procedure</th>
                    <th className="pb-3 font-semibold">Slot / Mode</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {enquiries.slice(0, 5).map((enq) => (
                    <tr key={enq.id || enq.referenceCode} className="hover:bg-white/[0.02]">
                      <td className="py-3 pr-3">
                        <p className="font-medium text-[#F6F0E9]">{enq.fullName}</p>
                        <p className="text-[11px] text-[#AFA89F] font-mono">{enq.phone}</p>
                        <p className="text-[10px] text-[#7C766F] font-mono">{enq.email}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span className="text-[#C9A47F]">{enq.treatmentInterest}</span>
                      </td>
                      <td className="py-3 pr-3">
                        <p className="text-[#F6F0E9]">{enq.preferredDate || 'Flexible'}</p>
                        <p className="text-[10px] text-[#AFA89F] capitalize">{enq.consultationType}</p>
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] uppercase font-semibold tracking-wider ${
                            enq.status === 'new'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : enq.status === 'contacted'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : enq.status === 'scheduled'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-white/10 text-[#AFA89F]'
                          }`}
                        >
                          {enq.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {enq.id && (
                          <div className="inline-flex items-center gap-1">
                            {enq.status === 'new' && (
                              <button
                                onClick={() => handleQuickStatusChange(enq.id!, 'contacted')}
                                className="px-2 py-1 bg-[#24211E] hover:bg-[#C9A47F] text-[#C9A47F] hover:text-[#0B0B0B] border border-[#C9A47F]/40 text-[10px] transition-colors"
                              >
                                Mark Contacted
                              </button>
                            )}
                            {enq.status === 'contacted' && (
                              <button
                                onClick={() => handleQuickStatusChange(enq.id!, 'scheduled')}
                                className="px-2 py-1 bg-emerald-950/60 hover:bg-emerald-700 text-emerald-300 hover:text-white border border-emerald-500/40 text-[10px] transition-colors"
                              >
                                Mark Scheduled
                              </button>
                            )}
                            {enq.status === 'scheduled' && (
                              <button
                                onClick={() => handleQuickStatusChange(enq.id!, 'closed')}
                                className="px-2 py-1 bg-white/5 hover:bg-white/10 text-[#AFA89F] text-[10px] transition-colors"
                              >
                                Close
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right (1 col): Recent Audit Activity */}
        <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 space-y-4">
          <div className="pb-3 border-b border-white/5">
            <h2 className="text-lg font-serif text-[#F6F0E9]">Practice Audit Trail</h2>
            <p className="text-xs text-[#AFA89F]">Recent CMS modifications &amp; publications</p>
          </div>

          <div className="space-y-3">
            {auditLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-[#7C766F]">
                No recent admin activity recorded.
              </div>
            ) : (
              auditLogs.slice(0, 7).map((log, index) => (
                <div
                  key={log.id || index}
                  className="p-3 bg-[#1C1817] border border-white/5 space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#C9A47F] font-semibold tracking-wider font-mono">
                      {log.action}
                    </span>
                    <span className="text-[#7C766F]">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#F6F0E9] text-[11px] leading-tight">{log.details || log.resource}</p>
                  <p className="text-[10px] text-[#AFA89F] truncate font-mono">
                    By: {log.performedBy}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
