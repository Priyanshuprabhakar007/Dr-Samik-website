/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  MoveUp,
  MoveDown,
  Archive,
  Send,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  getTreatments,
  saveTreatment,
  deleteTreatment,
} from '../../lib/firestoreService';
import { TreatmentItem } from '../../data/surgeryData';
import { useAuth } from '../../context/AuthContext';

type TreatmentCategory = 'Facial Aesthetics' | 'Body Contouring' | 'Hair Restoration' | 'Reconstructive Surgery';

export const TreatmentManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Modal State for Create / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<any | null>(null);
  const [isNewTreatment, setIsNewTreatment] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadTreatmentsList();
  }, []);

  const loadTreatmentsList = async () => {
    setLoading(true);
    try {
      const list = await getTreatments(true);
      setTreatments(list);
    } catch (err) {
      console.error('Failed to load treatments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setIsNewTreatment(true);
    setEditingTreatment({
      id: '',
      slug: '',
      title: '',
      category: 'Facial Aesthetics',
      tagline: '',
      shortDescription: '',
      heroImage: 'https://images.unsplash.com/photo-1512290900672-1f41639d4fae?auto=format&fit=crop&w=1200&q=85',
      galleryImages: [],
      overview: '',
      idealCandidate: ['Healthy individuals seeking anatomical balance', 'Realistic aesthetic expectations'],
      benefits: ['Restores natural harmonious contours', 'Long-lasting structural stability'],
      technique: 'Performed under magnification with precision tissue preservation.',
      anesthesia: 'General Anesthesia or Monitored Sedation',
      duration: '2 – 3 Hours',
      stay: 'Day-care / 1 Night Observation',
      downtime: '7 – 10 Days',
      resultsTimeline: 'Visible at 2-3 weeks; fully settled by 6-12 months',
      preOpRequirements: ['Avoid blood-thinning medications 10 days prior', 'Fasting for 8 hours prior'],
      postOpCare: ['Apply cold compresses as advised', 'Sleep with head elevated for 5-7 days'],
      faqs: [
        {
          question: 'How long do surgical results endure?',
          answer: 'Results are anatomically permanent, with natural aging continuing gracefully over time.',
        },
      ],
      seoTitle: '',
      seoDescription: '',
      status: 'published',
      order: treatments.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (treatment: TreatmentItem) => {
    setIsNewTreatment(false);
    setEditingTreatment({
      ...treatment,
      status: (treatment as any).status || 'published',
      order: (treatment as any).order ?? 0,
    });
    setIsModalOpen(true);
  };

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const [formDirty, setFormDirty] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleCloseModal = () => {
    if (formDirty && !window.confirm('You have unsaved changes in this procedure. Are you sure you want to discard them?')) {
      return;
    }
    setFormDirty(false);
    setIsModalOpen(false);
  };

  const handleSaveTreatment = async (e: React.FormEvent, targetStatus?: 'published' | 'draft') => {
    e.preventDefault();
    if (!editingTreatment.title.trim()) {
      alert('Please enter a treatment title.');
      return;
    }

    const targetSlug = editingTreatment.slug?.trim() || handleSlugify(editingTreatment.title);
    if (!targetSlug) {
      alert('A valid slug is required.');
      return;
    }

    // Protect against duplicate slug if creating new
    if (isNewTreatment && treatments.some((t) => t.slug === targetSlug || t.id === targetSlug)) {
      alert(`The slug '${targetSlug}' already exists. Please choose a distinct title or slug.`);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ...editingTreatment,
        id: targetSlug,
        slug: targetSlug,
        status: targetStatus || editingTreatment.status || 'published',
        seoTitle: editingTreatment.seoTitle || `${editingTreatment.title} in Mohali | Dr. Samik Sharma`,
        seoDescription: editingTreatment.seoDescription || editingTreatment.shortDescription,
        updatedAt: new Date().toISOString(),
      };

      await saveTreatment(payload, user?.email || undefined);
      setFormDirty(false);
      setNotification({
        type: 'success',
        message: `Procedure '${payload.title}' successfully saved as ${payload.status.toUpperCase()}!`,
      });
      setIsModalOpen(false);
      await loadTreatmentsList();
    } catch (err: any) {
      console.error('Error saving treatment:', err);
      alert(err.message || 'Failed to save treatment.');
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Are you certain you wish to delete '${title}'? This action is irreversible.`)) {
      return;
    }
    try {
      await deleteTreatment(slug, user?.email || undefined);
      setNotification({
        type: 'success',
        message: `Treatment '${title}' deleted successfully.`,
      });
      await loadTreatmentsList();
    } catch (err) {
      console.error('Error deleting treatment:', err);
      alert('Failed to delete treatment.');
    }
  };

  const handleToggleStatus = async (treatment: any, newStatus: 'published' | 'draft' | 'archived') => {
    try {
      await saveTreatment({ ...treatment, status: newStatus }, user?.email || undefined);
      await loadTreatmentsList();
    } catch (err) {
      console.error('Status toggle error:', err);
    }
  };

  const handleMoveOrder = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === treatments.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const currentItem = treatments[index];
    const targetItem = treatments[targetIndex];

    try {
      await saveTreatment({ ...currentItem, order: targetIndex + 1 } as any, user?.email || undefined);
      await saveTreatment({ ...targetItem, order: index + 1 } as any, user?.email || undefined);
      await loadTreatmentsList();
    } catch (err) {
      console.error('Reorder error:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#C9A47F]/20">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
            SURGICAL PORTFOLIO CMS
          </span>
          <h1 className="text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Treatments &amp; Procedures
          </h1>
          <p className="text-xs text-[#AFA89F] mt-1">
            Manage procedures, clinical technical protocols, FAQs, recovery timelines, and SEO metadata.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center gap-2 cursor-pointer shadow-lg self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Procedure</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 border text-xs flex items-center gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Treatments List Table */}
      <div className="bg-[#181514] border border-[#C9A47F]/20 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#AFA89F]">Loading surgical portfolio...</div>
        ) : treatments.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#AFA89F]">
            No procedures found. Click &quot;New Procedure&quot; to add one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#141211] text-[10px] text-[#C9A47F] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4">Procedure &amp; Category</th>
                  <th className="py-3 px-4">URL Slug</th>
                  <th className="py-3 px-4">Clinical Parameters</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {treatments.map((t, idx) => {
                  const status = (t as any).status || 'published';
                  const slug = t.slug || t.id;
                  return (
                    <tr key={slug} className="hover:bg-white/[0.02] transition-colors">
                      {/* Order Controls */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-[#7C766F] w-4">{idx + 1}</span>
                          <button
                            onClick={() => handleMoveOrder(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1 text-[#AFA89F] hover:text-[#C9A47F] disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <MoveUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveOrder(idx, 'down')}
                            disabled={idx === treatments.length - 1}
                            className="p-1 text-[#AFA89F] hover:text-[#C9A47F] disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <MoveDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#24201E] border border-white/10 shrink-0 overflow-hidden">
                            <img
                              src={(t as any).heroImage || t.image}
                              alt={t.title}
                              className="w-full h-full object-cover"
                              onError={(e) => ((e.target as any).src = 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80')}
                            />
                          </div>
                          <div>
                            <p className="font-serif text-sm text-[#F6F0E9] font-medium">{t.title}</p>
                            <span className="text-[10px] text-[#C9A47F] uppercase tracking-wider">{t.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#AFA89F]">
                        /treatments/{slug}
                      </td>

                      {/* Clinical Parameters */}
                      <td className="py-3.5 px-4 text-[11px] text-[#AFA89F]">
                        <p>{t.duration} · {t.anesthesia}</p>
                        <p className="text-[10px] text-[#7C766F]">Recovery: {t.recovery || (t as any).downtime}</p>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <select
                          value={status}
                          onChange={(e) => handleToggleStatus(t, e.target.value as any)}
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-[#12100F] border cursor-pointer ${
                            status === 'published'
                              ? 'border-emerald-500/40 text-emerald-400'
                              : status === 'draft'
                              ? 'border-amber-500/40 text-amber-300'
                              : 'border-white/20 text-[#AFA89F]'
                          }`}
                        >
                          <option value="published">Published</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-2">
                          <a
                            href={`/treatments/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-[#AFA89F] hover:text-[#C9A47F] transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 text-[#AFA89F] hover:text-[#C9A47F] transition-colors cursor-pointer"
                            title="Edit Procedure"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(slug, t.title)}
                            className="p-1.5 text-[#AFA89F] hover:text-rose-400 transition-colors cursor-pointer"
                            title="Delete Procedure"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Modal for Create / Edit Treatment */}
      {isModalOpen && editingTreatment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181514] border border-[#C9A47F] w-full max-w-4xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-[#F6F0E9]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
                  {isNewTreatment ? 'ADD PROCEDURE' : 'EDIT CLINICAL PROCEDURE'}
                </span>
                <h2 className="text-2xl font-serif text-[#F6F0E9] mt-0.5">
                  {editingTreatment.title || 'Untitled Procedure'}
                </h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#AFA89F] hover:text-[#F6F0E9] hover:border-[#C9A47F]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveTreatment} className="space-y-6 text-xs">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Procedure Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTreatment.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditingTreatment({
                        ...editingTreatment,
                        title,
                        slug: isNewTreatment ? handleSlugify(title) : editingTreatment.slug,
                      });
                    }}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] focus:border-[#C9A47F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    URL Slug * (Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTreatment.slug}
                    onChange={(e) =>
                      setEditingTreatment({
                        ...editingTreatment,
                        slug: handleSlugify(e.target.value),
                      })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] font-mono focus:border-[#C9A47F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Surgical Category
                  </label>
                  <select
                    value={editingTreatment.category}
                    onChange={(e) =>
                      setEditingTreatment({
                        ...editingTreatment,
                        category: e.target.value as TreatmentCategory,
                      })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] focus:border-[#C9A47F]"
                  >
                    <option value="Facial Aesthetics">Facial Aesthetics</option>
                    <option value="Body Contouring">Body Contouring</option>
                    <option value="Hair Restoration">Hair Restoration</option>
                    <option value="Reconstructive Surgery">Reconstructive Surgery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Publishing Status
                  </label>
                  <select
                    value={editingTreatment.status}
                    onChange={(e) =>
                      setEditingTreatment({
                        ...editingTreatment,
                        status: e.target.value,
                      })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] focus:border-[#C9A47F]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Tagline / Aesthetic Subtitle
                </label>
                <input
                  type="text"
                  value={editingTreatment.tagline}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, tagline: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Short Summary
                </label>
                <textarea
                  rows={2}
                  value={editingTreatment.shortDescription}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, shortDescription: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Hero Image URL
                </label>
                <input
                  type="text"
                  value={editingTreatment.heroImage}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, heroImage: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] font-mono"
                />
              </div>

              {/* Clinical Overview */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Detailed Clinical Overview
                </label>
                <textarea
                  rows={4}
                  value={editingTreatment.overview}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, overview: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] leading-relaxed"
                />
              </div>

              {/* Surgical Technique */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Surgical Technique &amp; Operational Approach
                </label>
                <textarea
                  rows={3}
                  value={editingTreatment.technique}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, technique: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] leading-relaxed"
                />
              </div>

              {/* Clinical Parameters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-[#141211] border border-white/5">
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#AFA89F] mb-1">
                    Anesthesia
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.anesthesia}
                    onChange={(e) =>
                      setEditingTreatment({ ...editingTreatment, anesthesia: e.target.value })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#AFA89F] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.duration}
                    onChange={(e) =>
                      setEditingTreatment({ ...editingTreatment, duration: e.target.value })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#AFA89F] mb-1">
                    Hospital Stay
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.stay}
                    onChange={(e) =>
                      setEditingTreatment({ ...editingTreatment, stay: e.target.value })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono text-[#AFA89F] mb-1">
                    Downtime
                  </label>
                  <input
                    type="text"
                    value={editingTreatment.downtime}
                    onChange={(e) =>
                      setEditingTreatment({ ...editingTreatment, downtime: e.target.value })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                  />
                </div>
              </div>

              {/* Expected Results Timeline */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Expected Results Timeline
                </label>
                <input
                  type="text"
                  value={editingTreatment.resultsTimeline}
                  onChange={(e) =>
                    setEditingTreatment({ ...editingTreatment, resultsTimeline: e.target.value })
                  }
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              {/* SEO Meta */}
              <div className="p-4 bg-[#141211] border border-white/5 space-y-3">
                <span className="text-[10px] uppercase font-mono text-[#C9A47F] font-semibold">
                  Search Engine Optimization (SEO)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-[#AFA89F] mb-1">Page Title Tag</label>
                    <input
                      type="text"
                      placeholder="e.g. Rhinoplasty in Mohali | Dr. Samik Sharma"
                      value={editingTreatment.seoTitle || ''}
                      onChange={(e) =>
                        setEditingTreatment({ ...editingTreatment, seoTitle: e.target.value })
                      }
                      className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#AFA89F] mb-1">Meta Description</label>
                    <input
                      type="text"
                      placeholder="Short Google search snippet (150 chars)"
                      value={editingTreatment.seoDescription || ''}
                      onChange={(e) =>
                        setEditingTreatment({ ...editingTreatment, seoDescription: e.target.value })
                      }
                      className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                    />
                  </div>
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-white/10">
                <div className="flex items-center gap-2 text-[11px] text-[#AFA89F]">
                  {formDirty && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase font-mono font-semibold">
                      Unsaved Changes
                    </span>
                  )}
                  {editingTreatment.updatedAt && (
                    <span className="font-mono text-[10px] text-[#7C766F]">
                      Last updated: {new Date(editingTreatment.updatedAt).toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 border border-white/10 text-xs text-[#AFA89F] hover:text-[#F6F0E9] uppercase tracking-wider cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveTreatment(e, 'draft')}
                    disabled={saving}
                    className="px-5 py-2.5 bg-[#24211E] hover:bg-[#2F2A27] text-xs text-[#C9A47F] border border-[#C9A47F]/40 uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSaveTreatment(e, 'published')}
                    disabled={saving}
                    className="px-7 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-semibold uppercase tracking-[0.14em] cursor-pointer disabled:opacity-50 shadow-lg"
                  >
                    {saving ? 'Publishing...' : 'Publish to Live'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
