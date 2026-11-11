/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  Award,
  BookOpen,
} from 'lucide-react';
import {
  getAboutContent,
  saveAboutContent,
  AboutData,
  DEFAULT_ABOUT,
} from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';

export const AboutManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<AboutData>(DEFAULT_ABOUT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const content = await getAboutContent('draft');
        setData(content);
      } catch (err) {
        console.error('Failed to load about data:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const updateData = (updater: (prev: AboutData) => AboutData) => {
    setData((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
  };

  const handleSave = async (publish: boolean) => {
    setSaving(true);
    setNotification(null);
    try {
      await saveAboutContent(data, publish, user?.email || undefined);
      setIsDirty(false);
      setNotification({
        type: 'success',
        message: publish
          ? 'Doctor profile successfully published to the live site!'
          : 'Draft saved successfully. Click "Publish to Live" when ready.',
      });
      const refreshed = await getAboutContent('draft');
      setData(refreshed);
    } catch (err: any) {
      console.error('Error saving about data:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save doctor profile.',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Biography Paragraph handlers
  const handleBioChange = (index: number, text: string) => {
    updateData((prev) => {
      const updated = [...prev.biography];
      updated[index] = text;
      return { ...prev, biography: updated };
    });
  };

  const handleAddBio = () => {
    updateData((prev) => ({ ...prev, biography: [...prev.biography, ''] }));
  };

  const handleRemoveBio = (index: number) => {
    updateData((prev) => ({
      ...prev,
      biography: prev.biography.filter((_, i) => i !== index),
    }));
  };

  // Qualifications handlers
  const handleQualChange = (index: number, field: string, val: string) => {
    updateData((prev) => {
      const updated = [...prev.qualifications];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, qualifications: updated };
    });
  };

  const handleAddQual = () => {
    updateData((prev) => ({
      ...prev,
      qualifications: [...prev.qualifications, { degree: '', institution: '', year: '' }],
    }));
  };

  const handleRemoveQual = (index: number) => {
    updateData((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  // Fellowships handlers
  const handleFellowshipChange = (index: number, val: string) => {
    updateData((prev) => {
      const updated = [...prev.fellowships];
      updated[index] = val;
      return { ...prev, fellowships: updated };
    });
  };

  const handleAddFellowship = () => {
    updateData((prev) => ({
      ...prev,
      fellowships: [...prev.fellowships, ''],
    }));
  };

  const handleRemoveFellowship = (index: number) => {
    updateData((prev) => ({
      ...prev,
      fellowships: prev.fellowships.filter((_, i) => i !== index),
    }));
  };

  // Memberships handlers
  const handleMembershipChange = (index: number, val: string) => {
    updateData((prev) => {
      const updated = [...prev.memberships];
      updated[index] = val;
      return { ...prev, memberships: updated };
    });
  };

  const handleAddMembership = () => {
    updateData((prev) => ({
      ...prev,
      memberships: [...prev.memberships, ''],
    }));
  };

  const handleRemoveMembership = (index: number) => {
    updateData((prev) => ({
      ...prev,
      memberships: prev.memberships.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-[#AFA89F]">
        Loading Surgeon Profile CMS...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#C9A47F]/20">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
              SURGEON CREDENTIALS CMS
            </span>
            {isDirty && (
              <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-none">
                Unsaved Changes
              </span>
            )}
          </div>
          <h1 className="text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Doctor Profile &amp; Qualifications
          </h1>
          <div className="flex items-center gap-4 text-xs text-[#AFA89F] mt-1">
            <p>Manage Dr. Samik Sharma&apos;s biography, academic degrees, fellowships, and hospital affiliations.</p>
            {data.updatedAt && (
              <span className="text-[11px] font-mono text-[#C9A47F]/70">
                Last updated: {new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="px-5 py-2.5 bg-[#24211E] hover:bg-[#2F2A27] text-xs text-[#C9A47F] border border-[#C9A47F]/30 uppercase tracking-wider transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-6 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{saving ? 'Publishing...' : 'Publish to Live'}</span>
          </button>
        </div>
      </div>

      {notification && (
        <div
          className={`p-4 border text-xs flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Core Surgeon Identity Section */}
      <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 sm:p-8 space-y-6">
        <div className="border-b border-white/5 pb-4">
          <h2 className="text-xl font-serif text-[#F6F0E9]">Surgeon Identity &amp; Affiliation</h2>
          <p className="text-xs text-[#AFA89F] mt-1">
            Display name, formal medical title, and hospital base.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Surgeon Name
            </label>
            <input
              type="text"
              value={data.doctorName}
              onChange={(e) => updateData((prev) => ({ ...prev, doctorName: e.target.value }))}
              className="w-full bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Clinical Title
            </label>
            <input
              type="text"
              value={data.title}
              onChange={(e) => updateData((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Primary Hospital
            </label>
            <input
              type="text"
              value={data.primaryHospital}
              onChange={(e) => updateData((prev) => ({ ...prev, primaryHospital: e.target.value }))}
              className="w-full bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Location / Region
            </label>
            <input
              type="text"
              value={data.location}
              onChange={(e) => updateData((prev) => ({ ...prev, location: e.target.value }))}
              className="w-full bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9]"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Doctor Portrait Image Path / URL
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={data.portraitImage}
                onChange={(e) => updateData((prev) => ({ ...prev, portraitImage: e.target.value }))}
                className="flex-1 bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9] font-mono"
              />
              <div className="w-12 h-12 bg-[#24201E] border border-[#C9A47F]/30 shrink-0 overflow-hidden">
                <img
                  src={data.portraitImage}
                  alt="Doctor Portrait"
                  className="w-full h-full object-cover"
                  onError={(e) => ((e.target as any).src = '/samik-portrait.jpg')}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
              Architectural Column Image Path / URL
            </label>
            <input
              type="text"
              value={data.architecturalImage}
              onChange={(e) => updateData((prev) => ({ ...prev, architecturalImage: e.target.value }))}
              className="w-full bg-[#12100F] border border-[#C9A47F]/30 p-3 text-xs text-[#F6F0E9] font-mono"
            />
          </div>
        </div>
      </div>

      {/* Biography Paragraphs */}
      <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <h2 className="text-xl font-serif text-[#F6F0E9]">Editorial Clinical Biography</h2>
            <p className="text-xs text-[#AFA89F]">Structured multi-paragraph narrative detailing philosophy and training.</p>
          </div>
          <button
            onClick={handleAddBio}
            className="px-3 py-1.5 border border-[#C9A47F]/40 text-[#C9A47F] hover:bg-[#C9A47F] hover:text-[#0B0B0B] text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Paragraph</span>
          </button>
        </div>

        <div className="space-y-4">
          {data.biography.map((p, idx) => (
            <div key={idx} className="relative group bg-[#141211] p-3 border border-white/5">
              <div className="flex items-center justify-between text-[10px] text-[#AFA89F] mb-1.5">
                <span>Paragraph #{idx + 1}</span>
                {data.biography.length > 1 && (
                  <button
                    onClick={() => handleRemoveBio(idx)}
                    className="text-rose-400 hover:text-rose-300"
                    title="Delete paragraph"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                value={p}
                onChange={(e) => handleBioChange(idx, e.target.value)}
                className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] focus:outline-none focus:border-[#C9A47F] leading-relaxed"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Academic Qualifications */}
      <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div>
            <h2 className="text-xl font-serif text-[#F6F0E9]">Academic Qualifications &amp; Degrees</h2>
            <p className="text-xs text-[#AFA89F]">Super-speciality surgical degrees and institutions.</p>
          </div>
          <button
            onClick={handleAddQual}
            className="px-3 py-1.5 border border-[#C9A47F]/40 text-[#C9A47F] hover:bg-[#C9A47F] hover:text-[#0B0B0B] text-xs transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Qualification</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.qualifications.map((q, idx) => (
            <div key={idx} className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3 bg-[#141211] border border-white/5 items-center">
              <div className="sm:col-span-4">
                <label className="block text-[10px] text-[#AFA89F] mb-1 uppercase font-mono">Degree</label>
                <input
                  type="text"
                  value={q.degree}
                  onChange={(e) => handleQualChange(idx, 'degree', e.target.value)}
                  placeholder="e.g. M.Ch. (Plastic Surgery)"
                  className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                />
              </div>

              <div className="sm:col-span-5">
                <label className="block text-[10px] text-[#AFA89F] mb-1 uppercase font-mono">Institution</label>
                <input
                  type="text"
                  value={q.institution}
                  onChange={(e) => handleQualChange(idx, 'institution', e.target.value)}
                  placeholder="e.g. Apex National Super-Specialty Medical Institute"
                  className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] text-[#AFA89F] mb-1 uppercase font-mono">Year</label>
                <input
                  type="text"
                  value={q.year || ''}
                  onChange={(e) => handleQualChange(idx, 'year', e.target.value)}
                  placeholder="e.g. 2020"
                  className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                />
              </div>

              <div className="sm:col-span-1 text-right pt-4 sm:pt-0">
                <button
                  onClick={() => handleRemoveQual(idx)}
                  className="p-2 text-rose-400 hover:text-rose-300"
                  title="Remove degree"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fellowships & Memberships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fellowships */}
        <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-lg font-serif text-[#F6F0E9]">Fellowships &amp; Training</h3>
            <button
              onClick={handleAddFellowship}
              className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {data.fellowships.map((f, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleFellowshipChange(idx, e.target.value)}
                  className="flex-1 bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                />
                <button
                  onClick={() => handleRemoveFellowship(idx)}
                  className="p-2 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Memberships */}
        <div className="bg-[#181514] border border-[#C9A47F]/20 p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-lg font-serif text-[#F6F0E9]">Council &amp; Society Memberships</h3>
            <button
              onClick={handleAddMembership}
              className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
          <div className="space-y-2">
            {data.memberships.map((m, idx) => (
              <div key={idx} className="flex gap-2">
                <input
                  type="text"
                  value={m}
                  onChange={(e) => handleMembershipChange(idx, e.target.value)}
                  className="flex-1 bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                />
                <button
                  onClick={() => handleRemoveMembership(idx)}
                  className="p-2 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
