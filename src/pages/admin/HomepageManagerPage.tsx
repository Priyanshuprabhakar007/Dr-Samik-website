/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Save,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  Image as ImageIcon,
  RotateCcw,
  History,
  Layers,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  ChevronDown,
  ChevronUp,
  X,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  ShieldCheck,
  Sliders,
  HelpCircle,
  Lock,
} from 'lucide-react';
import {
  getHomepageContent,
  saveHomepageContent,
  getHomepageRevisions,
  rollbackHomepageRevision,
  getTreatments,
  HomepageData,
  HomepageRevision,
  DEFAULT_HOMEPAGE,
  TreatmentItem,
} from '../../lib/firestoreService';
import { APPROVED_MEDIA_ASSETS, MediaAsset } from '../../data/mediaAssets';
import { HomepageRenderer } from '../../components/HomepageRenderer';
import { useAuth } from '../../context/AuthContext';

type SectionKey = 'hero' | 'aboutPreview' | 'treatments' | 'approach' | 'finalCta' | 'sections';

export const HomepageManagerPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState<HomepageData>(DEFAULT_HOMEPAGE);
  const [publishedData, setPublishedData] = useState<HomepageData>(DEFAULT_HOMEPAGE);
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [revisions, setRevisions] = useState<HomepageRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Layout & Navigation State
  const [activeSection, setActiveSection] = useState<SectionKey>('hero');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Modals State
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showRollbackModal, setShowRollbackModal] = useState(false);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaTargetField, setMediaTargetField] = useState<string | null>(null);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [mediaActiveCategory, setMediaActiveCategory] = useState<string>('all');
  const [publishNote, setPublishNote] = useState('');

  // 1. Initial Load of Draft, Published, Treatments, and Revisions
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [draftContent, pubContent, allTreatments, revs] = await Promise.all([
          getHomepageContent('draft'),
          getHomepageContent('published'),
          getTreatments(true),
          getHomepageRevisions(),
        ]);
        if (draftContent) setData(draftContent);
        if (pubContent) setPublishedData(pubContent);
        if (allTreatments) setTreatments(allTreatments);
        if (revs) setRevisions(revs);
      } catch (err) {
        console.error('Failed to load homepage manager data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 2. Unsaved Changes BeforeUnload Guard
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

  // Helper to mutate data state & mark dirty
  const updateData = (updater: (prev: HomepageData) => HomepageData) => {
    setData((prev) => {
      const next = updater(prev);
      setIsDirty(true);
      return next;
    });
  };

  // 3. Save Draft (Internal Administrator State)
  const handleSaveDraft = async () => {
    setSaving(true);
    setNotification(null);
    try {
      await saveHomepageContent(data, false, user?.email || undefined);
      setIsDirty(false);
      setNotification({
        type: 'success',
        message: 'Draft saved successfully. Public website remains unchanged.',
      });
      // Refresh draft state timestamp
      const refreshed = await getHomepageContent('draft');
      setData(refreshed);
    } catch (err: any) {
      console.error('Error saving draft:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to save homepage draft.',
      });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // 4. Publish to Live (Atomic Sync + Version History Snapshot)
  const handleConfirmPublish = async () => {
    setPublishing(true);
    setNotification(null);
    setShowPublishModal(false);
    try {
      await saveHomepageContent(data, true, user?.email || undefined, publishNote || 'Published via Visual Homepage Editor');
      setIsDirty(false);
      setNotification({
        type: 'success',
        message: 'Homepage successfully published to live website! All patients and visitors now see the new content.',
      });
      // Refresh published content, draft, and revisions list
      const [refreshedDraft, refreshedPub, refreshedRevs] = await Promise.all([
        getHomepageContent('draft'),
        getHomepageContent('published'),
        getHomepageRevisions(),
      ]);
      setData(refreshedDraft);
      setPublishedData(refreshedPub);
      setRevisions(refreshedRevs);
      setPublishNote('');
    } catch (err: any) {
      console.error('Error publishing homepage:', err);
      setNotification({
        type: 'error',
        message: err.message || 'Failed to publish homepage content.',
      });
    } finally {
      setPublishing(false);
      setTimeout(() => setNotification(null), 6000);
    }
  };

  // 5. Discard Changes (Revert draft to current published state)
  const handleDiscardChanges = () => {
    if (confirm('Discard all unsaved changes and revert to the current published homepage?')) {
      setData(publishedData);
      setIsDirty(false);
      setNotification({
        type: 'success',
        message: 'Editor reset to current published homepage.',
      });
      setTimeout(() => setNotification(null), 4000);
    }
  };

  // 6. Reset Individual Section to Published Version
  const handleResetSectionToPublished = (section: SectionKey) => {
    if (!publishedData) return;
    if (confirm(`Reset the ${section} section to its currently published values?`)) {
      updateData((prev) => {
        if (section === 'hero') return { ...prev, hero: { ...publishedData.hero } };
        if (section === 'aboutPreview') return { ...prev, aboutPreview: { ...publishedData.aboutPreview } };
        if (section === 'treatments') return { ...prev, treatmentsShowcase: { ...(publishedData.treatmentsShowcase || DEFAULT_HOMEPAGE.treatmentsShowcase!) } };
        if (section === 'approach') return { ...prev, approach: { ...publishedData.approach } };
        if (section === 'finalCta') return { ...prev, finalCta: { ...publishedData.finalCta } };
        if (section === 'sections') {
          return {
            ...prev,
            sectionVisibility: { ...(publishedData.sectionVisibility || DEFAULT_HOMEPAGE.sectionVisibility) },
            sectionsOrder: [...(publishedData.sectionsOrder || DEFAULT_HOMEPAGE.sectionsOrder!)],
          };
        }
        return prev;
      });
      setNotification({
        type: 'success',
        message: `Section "${section}" restored to published version.`,
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  // 7. Rollback to Historical Revision
  const handleRollback = async (rev: HomepageRevision) => {
    if (confirm(`Roll back the entire homepage to revision from ${new Date(rev.publishedAt).toLocaleString()}? This will update both draft and live website.`)) {
      setLoading(true);
      setShowRollbackModal(false);
      try {
        await rollbackHomepageRevision(rev, user?.email || undefined);
        const [refreshedDraft, refreshedPub, refreshedRevs] = await Promise.all([
          getHomepageContent('draft'),
          getHomepageContent('published'),
          getHomepageRevisions(),
        ]);
        setData(refreshedDraft);
        setPublishedData(refreshedPub);
        setRevisions(refreshedRevs);
        setIsDirty(false);
        setNotification({
          type: 'success',
          message: `Homepage successfully rolled back to revision from ${new Date(rev.publishedAt).toLocaleString()}.`,
        });
      } catch (err: any) {
        console.error('Error rolling back revision:', err);
        setNotification({
          type: 'error',
          message: err.message || 'Failed to rollback homepage version.',
        });
      } finally {
        setLoading(false);
        setTimeout(() => setNotification(null), 5000);
      }
    }
  };

  // 8. Open Approved Image Picker
  const handleOpenMediaPicker = (fieldPath: string) => {
    setMediaTargetField(fieldPath);
    setCustomImageUrl('');
    setShowMediaModal(true);
  };

  // 9. Apply Selected Image to Field
  const handleApplyImage = (url: string) => {
    if (!mediaTargetField) return;

    // Validate URL to ensure no base64 and standard format
    if (url.startsWith('data:')) {
      alert('Base64 image strings are not permitted. Please use an approved image asset or secure HTTPS URL.');
      return;
    }

    const [section, field] = mediaTargetField.split('.');
    updateData((prev: any) => {
      const next = { ...prev };
      if (section && field) {
        next[section] = {
          ...next[section],
          [field]: url,
        };
      }
      return next;
    });

    setShowMediaModal(false);
    setMediaTargetField(null);
  };

  // Reorder sections helper
  const handleMoveSection = (index: number, direction: 'up' | 'down') => {
    const currentOrder = data.sectionsOrder && data.sectionsOrder.length > 0
      ? [...data.sectionsOrder]
      : ['hero', 'aboutPreview', 'treatments', 'approach', 'patientGuide', 'finalCta'];

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[index];
    currentOrder[index] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    updateData((prev) => ({
      ...prev,
      sectionsOrder: currentOrder,
    }));
  };

  // Toggle treatment feature helper
  const handleToggleFeaturedTreatment = (slug: string) => {
    const currentFeatured = data.treatmentsShowcase?.featuredSlugs || [
      'rhinoplasty',
      'facelift-necklift',
      'blepharoplasty',
      'liposuction',
      'tummy-tuck',
      'hair-transplant',
    ];
    let nextFeatured: string[];
    if (currentFeatured.includes(slug)) {
      nextFeatured = currentFeatured.filter((s) => s !== slug);
    } else {
      nextFeatured = [...currentFeatured, slug];
    }
    updateData((prev) => ({
      ...prev,
      treatmentsShowcase: {
        ...(prev.treatmentsShowcase || DEFAULT_HOMEPAGE.treatmentsShowcase!),
        featuredSlugs: nextFeatured,
      },
    }));
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-8 h-8 border-2 border-[#C9A47F] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs uppercase tracking-[0.2em] text-[#C9A47F]">Loading Visual Homepage Editor...</p>
      </div>
    );
  }

  const sectionsList: Array<{ id: SectionKey; label: string; number: string }> = [
    { id: 'hero', label: '1. Hero Section', number: '01' },
    { id: 'aboutPreview', label: '2. Doctor Introduction', number: '02' },
    { id: 'treatments', label: '3. Treatments Showcase', number: '03' },
    { id: 'approach', label: '4. Approach & Methodology', number: '04' },
    { id: 'finalCta', label: '5. Consultation Banner', number: '05' },
    { id: 'sections', label: '6. Section Management', number: '06' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Master Action Bar */}
      <div className="bg-[#181514] border border-[#C9A47F]/25 p-5 sm:p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
              EDITORIAL CMS
            </span>
            {isDirty && (
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-mono uppercase tracking-widest font-semibold animate-pulse">
                Unsaved Edits
              </span>
            )}
            <span className="text-xs text-[#AFA89F] font-mono hidden sm:inline">
              · Database: ai-studio-drsamiksharmapla
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Visual Homepage Editor &amp; CMS
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-[11px] text-[#AFA89F] mt-1 font-sans">
            <span>
              Draft Saved: <strong className="text-[#F6F0E9] font-mono">{data.updatedAt ? new Date(data.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Approved Baseline'}</strong>
            </span>
            <span>•</span>
            <span>
              Live Published: <strong className="text-[#C9A47F] font-mono">{data.lastPublishedAt ? new Date(data.lastPublishedAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Live Production'}</strong>
            </span>
          </div>
        </div>

        {/* Master Toolbar Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowRollbackModal(true)}
            className="px-3.5 py-2 bg-[#1C1817] hover:bg-[#25201D] text-xs text-[#AFA89F] hover:text-[#F6F0E9] border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
            title="View published revisions history"
          >
            <History className="w-3.5 h-3.5 text-[#C9A47F]" />
            <span className="hidden sm:inline">Revisions ({revisions.length})</span>
          </button>

          {isDirty && (
            <button
              onClick={handleDiscardChanges}
              className="px-3.5 py-2 bg-[#1C1817] hover:bg-[#2A2320] text-xs text-rose-300 border border-rose-500/30 transition-colors flex items-center gap-2 cursor-pointer"
              title="Discard unsaved edits"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          <button
            onClick={handleSaveDraft}
            disabled={saving}
            className="px-5 py-2.5 bg-[#24211E] hover:bg-[#2F2A27] text-xs text-[#C9A47F] border border-[#C9A47F]/40 uppercase tracking-wider font-semibold transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save Draft'}</span>
          </button>

          <button
            onClick={() => setShowPublishModal(true)}
            disabled={publishing}
            className="px-6 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-bold uppercase tracking-[0.15em] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-lg shadow-[#C9A47F]/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish to Live</span>
          </button>
        </div>
      </div>

      {/* Dismissible Feedback Notification */}
      {notification && (
        <div
          className={`p-4 border text-xs flex items-center justify-between gap-3 ${
            notification.type === 'success'
              ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/50 border-rose-500/40 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-white/50 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Two-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ============================================================== */}
        {/* LEFT PANEL: Section Accordion & Form Controls (5 cols on 2xl / 6 cols on lg) */}
        {/* ============================================================== */}
        <div className="lg:col-span-5 xl:col-span-5 space-y-4">
          
          {/* Section Selector Tab Strip */}
          <div className="bg-[#181514] border border-[#C9A47F]/20 p-2 flex flex-wrap gap-1.5">
            {sectionsList.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`px-3 py-2 text-xs font-sans uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
                  activeSection === sec.id
                    ? 'bg-[#C9A47F] text-[#0B0B0B] font-bold shadow-md'
                    : 'bg-[#12100F] text-[#AFA89F] hover:text-[#F6F0E9] hover:bg-[#221E1C]'
                }`}
              >
                <span className="font-mono text-[10px] opacity-75">{sec.number}</span>
                <span>{sec.label.split('. ')[1]}</span>
              </button>
            ))}
          </div>

          {/* Section 1: HERO SECTION */}
          {activeSection === 'hero' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    HERO CONFIGURATION
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">1. Hero Section</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('hero')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                  title="Reset hero to last published version"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Hero</span>
                </button>
              </div>

              {/* Eyebrow */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Eyebrow Kicker
                </label>
                <input
                  type="text"
                  value={data.hero.eyebrow}
                  onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 focus:border-[#C9A47F] p-3 text-xs text-[#F6F0E9] outline-none"
                  placeholder="e.g. PLASTIC | COSMETIC | RECONSTRUCTIVE SURGERY"
                />
              </div>

              {/* Headline Split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Headline Part 1
                  </label>
                  <input
                    type="text"
                    value={data.hero.headlinePart1}
                    onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, headlinePart1: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 focus:border-[#C9A47F] p-3 text-xs text-[#F6F0E9] outline-none"
                    placeholder="RESHAPING FORM, RESTORING "
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Highlighted Word (Gold Italics)
                  </label>
                  <input
                    type="text"
                    value={data.hero.headlineHighlight}
                    onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, headlineHighlight: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 focus:border-[#C9A47F] p-3 text-xs text-[#F6F0E9] outline-none font-serif italic"
                    placeholder="CONFIDENCE"
                  />
                </div>
              </div>

              {/* Supporting Description */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Supporting Description
                </label>
                <textarea
                  rows={3}
                  value={data.hero.description}
                  onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, description: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 focus:border-[#C9A47F] p-3 text-xs text-[#F6F0E9] outline-none leading-relaxed"
                />
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Primary CTA Label
                  </label>
                  <input
                    type="text"
                    value={data.hero.primaryCtaLabel}
                    onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, primaryCtaLabel: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Secondary CTA Label
                  </label>
                  <input
                    type="text"
                    value={data.hero.secondaryCtaLabel}
                    onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, secondaryCtaLabel: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>
              </div>

              {/* Hero Image & Visual Controls */}
              <div className="pt-3 border-t border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                    Hero Editorial Portrait Image
                  </label>
                  <button
                    onClick={() => handleOpenMediaPicker('hero.heroImage')}
                    className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Choose Approved Asset</span>
                  </button>
                </div>

                <div className="flex gap-3 items-center">
                  <div className="w-16 h-20 bg-[#24201E] border border-[#C9A47F]/30 shrink-0 overflow-hidden relative">
                    <img
                      src={data.hero.heroImage}
                      alt="Hero Thumbnail"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as any).src = '/src/assets/images/hero_editorial_beauty_1794213535182.jpg')}
                    />
                  </div>
                  <input
                    type="text"
                    value={data.hero.heroImage}
                    onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, heroImage: e.target.value } }))}
                    className="flex-1 bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] font-mono"
                    placeholder="Image asset path or HTTPS URL"
                  />
                </div>

                {/* Positioning & Overlay Intensity */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] text-[#AFA89F] mb-1 uppercase font-mono">
                      Image Crop Focus
                    </label>
                    <select
                      value={data.hero.imagePosition || 'object-top'}
                      onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, imagePosition: e.target.value as any } }))}
                      className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9]"
                    >
                      <option value="object-top">Top (Head &amp; Contours)</option>
                      <option value="object-center">Center</option>
                      <option value="object-bottom">Bottom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#AFA89F] mb-1 uppercase font-mono">
                      Dark Scrim Intensity ({data.hero.overlayIntensity ?? 70}%)
                    </label>
                    <input
                      type="range"
                      min="30"
                      max="90"
                      step="5"
                      value={data.hero.overlayIntensity ?? 70}
                      onChange={(e) => updateData((prev) => ({ ...prev, hero: { ...prev.hero, overlayIntensity: Number(e.target.value) } }))}
                      className="w-full accent-[#C9A47F]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: DOCTOR INTRODUCTION */}
          {activeSection === 'aboutPreview' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    DOCTOR PROFILE CMS
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">2. Doctor Introduction</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('aboutPreview')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Intro</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Doctor Name
                  </label>
                  <input
                    type="text"
                    value={data.aboutPreview.doctorName}
                    onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, doctorName: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Clinical Designation
                  </label>
                  <input
                    type="text"
                    value={data.aboutPreview.qualificationTitle}
                    onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, qualificationTitle: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Primary Hospital Affiliation
                </label>
                <input
                  type="text"
                  value={data.aboutPreview.hospitalName}
                  onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, hospitalName: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Editorial Biography Preview
                </label>
                <textarea
                  rows={4}
                  value={data.aboutPreview.previewSummary}
                  onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, previewSummary: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-3 text-xs text-[#F6F0E9] leading-relaxed outline-none"
                />
              </div>

              {/* Portrait & Architecture Image Selectors */}
              <div className="space-y-4 pt-3 border-t border-white/5">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                      Doctor Portrait Image
                    </label>
                    <button
                      onClick={() => handleOpenMediaPicker('aboutPreview.portraitImage')}
                      className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Select Portrait</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.aboutPreview.portraitImage}
                    onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, portraitImage: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9] font-mono"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                      Architectural Column Image
                    </label>
                    <button
                      onClick={() => handleOpenMediaPicker('aboutPreview.architecturalImage')}
                      className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Select Sculpture/Arch</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={data.aboutPreview.architecturalImage}
                    onChange={(e) => updateData((prev) => ({ ...prev, aboutPreview: { ...prev.aboutPreview, architecturalImage: e.target.value } }))}
                    className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9] font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 3: TREATMENTS SHOWCASE */}
          {activeSection === 'treatments' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    DISCIPLINES GALLERY
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">3. Treatments Showcase</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('treatments')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Gallery</span>
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Section Headline
                </label>
                <input
                  type="text"
                  value={data.treatmentsShowcase?.title || 'Clinical Procedures & Contouring'}
                  onChange={(e) => updateData((prev) => ({
                    ...prev,
                    treatmentsShowcase: { ...(prev.treatmentsShowcase || DEFAULT_HOMEPAGE.treatmentsShowcase!), title: e.target.value },
                  }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Supporting Gallery Text
                </label>
                <textarea
                  rows={2}
                  value={data.treatmentsShowcase?.description || ''}
                  onChange={(e) => updateData((prev) => ({
                    ...prev,
                    treatmentsShowcase: { ...(prev.treatmentsShowcase || DEFAULT_HOMEPAGE.treatmentsShowcase!), description: e.target.value },
                  }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              {/* Select & Order Published Procedures */}
              <div className="pt-3 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                    Featured Procedures on Homepage
                  </label>
                  <span className="text-[10px] text-[#AFA89F]">Toggle to show/hide</span>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {treatments.map((tr) => {
                    const slug = tr.slug || tr.id;
                    const isFeatured = (data.treatmentsShowcase?.featuredSlugs || [
                      'rhinoplasty',
                      'facelift-necklift',
                      'blepharoplasty',
                      'liposuction',
                      'tummy-tuck',
                      'hair-transplant',
                    ]).includes(slug);

                    return (
                      <div
                        key={slug}
                        className={`p-3 border flex items-center justify-between text-xs transition-colors ${
                          isFeatured
                            ? 'bg-[#1C1817] border-[#C9A47F]/40 text-[#F6F0E9]'
                            : 'bg-[#12100F] border-white/5 text-[#AFA89F]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={() => handleToggleFeaturedTreatment(slug)}
                            className="accent-[#C9A47F] cursor-pointer"
                          />
                          <div>
                            <span className="font-serif text-sm font-medium">{tr.title}</span>
                            <span className="text-[10px] text-[#C9A47F] ml-2 font-mono uppercase">
                              [{tr.category}]
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono text-[#AFA89F]">
                          /treatments/{slug}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Section 4: APPROACH SECTION */}
          {activeSection === 'approach' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    SURGICAL METHODOLOGY
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">4. Approach &amp; Principles</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('approach')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Approach</span>
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={data.approach.headline}
                  onChange={(e) => updateData((prev) => ({ ...prev, approach: { ...prev.approach, headline: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Subheadline / Category
                </label>
                <input
                  type="text"
                  value={data.approach.subheadline}
                  onChange={(e) => updateData((prev) => ({ ...prev, approach: { ...prev.approach, subheadline: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Philosophy Text
                </label>
                <textarea
                  rows={3}
                  value={data.approach.description}
                  onChange={(e) => updateData((prev) => ({ ...prev, approach: { ...prev.approach, description: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] leading-relaxed"
                />
              </div>

              {/* Chiaroscuro Profile Image */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                    Illustrative Chiaroscuro Image
                  </label>
                  <button
                    onClick={() => handleOpenMediaPicker('approach.image')}
                    className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Select Profile</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={data.approach.image}
                  onChange={(e) => updateData((prev) => ({ ...prev, approach: { ...prev.approach, image: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9] font-mono"
                />
              </div>

              {/* Background Theme */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Section Background Setting
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs text-[#F6F0E9] cursor-pointer">
                    <input
                      type="radio"
                      name="approachBg"
                      checked={data.approach.backgroundSetting !== 'charcoal'}
                      onChange={() => updateData((prev) => ({ ...prev, approach: { ...prev.approach, backgroundSetting: 'onyx' } }))}
                      className="accent-[#C9A47F]"
                    />
                    <span>Onyx Black (#12100F)</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#F6F0E9] cursor-pointer">
                    <input
                      type="radio"
                      name="approachBg"
                      checked={data.approach.backgroundSetting === 'charcoal'}
                      onChange={() => updateData((prev) => ({ ...prev, approach: { ...prev.approach, backgroundSetting: 'charcoal' } }))}
                      className="accent-[#C9A47F]"
                    />
                    <span>Warm Charcoal (#181514)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Section 5: CONSULTATION BANNER */}
          {activeSection === 'finalCta' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    CONVERTING INTAKE
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">5. Consultation Banner</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('finalCta')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Banner</span>
                </button>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Kicker Eyebrow
                </label>
                <input
                  type="text"
                  value={data.finalCta.eyebrow}
                  onChange={(e) => updateData((prev) => ({ ...prev, finalCta: { ...prev.finalCta, eyebrow: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Headline
                </label>
                <input
                  type="text"
                  value={data.finalCta.headline}
                  onChange={(e) => updateData((prev) => ({ ...prev, finalCta: { ...prev.finalCta, headline: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Description Text
                </label>
                <textarea
                  rows={3}
                  value={data.finalCta.description}
                  onChange={(e) => updateData((prev) => ({ ...prev, finalCta: { ...prev.finalCta, description: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  CTA Button Label
                </label>
                <input
                  type="text"
                  value={data.finalCta.ctaLabel}
                  onChange={(e) => updateData((prev) => ({ ...prev, finalCta: { ...prev.finalCta, ctaLabel: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              {/* Background Silk Image */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                    Bronze Silk Background Image
                  </label>
                  <button
                    onClick={() => handleOpenMediaPicker('finalCta.backgroundImage')}
                    className="text-xs text-[#C9A47F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Select Silk Texture</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={data.finalCta.backgroundImage}
                  onChange={(e) => updateData((prev) => ({ ...prev, finalCta: { ...prev.finalCta, backgroundImage: e.target.value } }))}
                  className="w-full bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9] font-mono"
                />
              </div>
            </div>
          )}

          {/* Section 6: SECTION ORDER & VISIBILITY MANAGEMENT */}
          {activeSection === 'sections' && (
            <div className="bg-[#181514] border border-[#C9A47F]/25 p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/5">
                <div>
                  <span className="text-[10px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase font-semibold">
                    LAYOUT ARCHITECTURE
                  </span>
                  <h2 className="text-xl font-serif text-[#F6F0E9]">6. Section Management</h2>
                </div>
                <button
                  onClick={() => handleResetSectionToPublished('sections')}
                  className="text-[11px] text-[#AFA89F] hover:text-[#C9A47F] flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Layout</span>
                </button>
              </div>

              <p className="text-xs text-[#AFA89F] leading-relaxed">
                Show, hide, or rearrange the sequence of homepage sections. Essential navigation and accessibility elements are permanently safeguarded.
              </p>

              {/* Reordering Controls */}
              <div className="space-y-2 pt-2">
                {(data.sectionsOrder || DEFAULT_HOMEPAGE.sectionsOrder || []).map((secKey, idx) => {
                  const visibilityMap = data.sectionVisibility || DEFAULT_HOMEPAGE.sectionVisibility || {};
                  const isVisible = (visibilityMap as any)[secKey] !== false;

                  const labelMap: Record<string, string> = {
                    hero: 'Hero Section (Headlines & Editorial Portrait)',
                    aboutPreview: 'Doctor Introduction & Credentials Strip',
                    treatments: 'Clinical Treatments Horizontal Showcase',
                    approach: 'Surgical Approach (Precise. Personalised. Natural.)',
                    patientGuide: 'Patient Pathway & Shalby Hospital Facility',
                    finalCta: 'Consultation Banner & Contact Coordinates',
                  };

                  return (
                    <div
                      key={secKey}
                      className="p-3 bg-[#12100F] border border-white/10 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-[#C9A47F] text-xs w-5">{idx + 1}.</span>
                        <input
                          type="checkbox"
                          checked={isVisible}
                          onChange={() => {
                            updateData((prev) => ({
                              ...prev,
                              sectionVisibility: {
                                ...(prev.sectionVisibility || DEFAULT_HOMEPAGE.sectionVisibility),
                                [secKey]: !isVisible,
                              },
                            }));
                          }}
                          className="accent-[#C9A47F] cursor-pointer"
                          title="Toggle section visibility"
                        />
                        <span className={isVisible ? 'text-[#F6F0E9]' : 'text-[#AFA89F] line-through'}>
                          {labelMap[secKey] || secKey}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleMoveSection(idx, 'up')}
                          disabled={idx === 0}
                          className="p-1.5 hover:bg-white/5 text-[#AFA89F] hover:text-[#C9A47F] disabled:opacity-20 cursor-pointer"
                          title="Move up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveSection(idx, 'down')}
                          disabled={idx === (data.sectionsOrder?.length || 6) - 1}
                          className="p-1.5 hover:bg-white/5 text-[#AFA89F] hover:text-[#C9A47F] disabled:opacity-20 cursor-pointer"
                          title="Move down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>

        {/* ============================================================== */}
        {/* RIGHT PANEL: Live Accurate Responsive Homepage Preview (7 cols) */}
        {/* ============================================================== */}
        <div className="lg:col-span-7 xl:col-span-7 space-y-3 sticky top-20">
          
          {/* Preview Viewport Toolbar */}
          <div className="bg-[#181514] border border-[#C9A47F]/25 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-sans uppercase tracking-widest text-[#F6F0E9] font-medium">
                Live Preview
              </span>
              <span className="text-[10px] text-[#AFA89F] font-mono">
                ({previewMode === 'desktop' ? 'Desktop 100%' : previewMode === 'tablet' ? 'Tablet 768px' : 'Mobile 390px'})
              </span>
            </div>

            {/* Viewport Selectors */}
            <div className="flex items-center gap-1 bg-[#12100F] p-1 border border-white/5">
              <button
                onClick={() => setPreviewMode('desktop')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  previewMode === 'desktop' ? 'bg-[#C9A47F] text-[#0B0B0B]' : 'text-[#AFA89F] hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('tablet')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  previewMode === 'tablet' ? 'bg-[#C9A47F] text-[#0B0B0B]' : 'text-[#AFA89F] hover:text-white'
                }`}
                title="Tablet View (768px)"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                className={`p-1.5 transition-colors cursor-pointer ${
                  previewMode === 'mobile' ? 'bg-[#C9A47F] text-[#0B0B0B]' : 'text-[#AFA89F] hover:text-white'
                }`}
                title="Mobile View (390px)"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Accurate Component Preview Canvas */}
          <div className="bg-[#050505] border border-[#C9A47F]/30 overflow-hidden shadow-2xl flex justify-center p-0 lg:p-2">
            <div
              className={`transition-all duration-300 overflow-y-auto max-h-[82vh] scrollbar-thin scrollbar-thumb-[#C9A47F]/30 ${
                previewMode === 'desktop'
                  ? 'w-full'
                  : previewMode === 'tablet'
                  ? 'w-[768px] border-x border-[#C9A47F]/40 shadow-2xl bg-[#0B0B0B]'
                  : 'w-[390px] border-x border-[#C9A47F]/40 shadow-2xl bg-[#0B0B0B]'
              }`}
            >
              {/* Uses real existing homepage components with live draft state */}
              <HomepageRenderer
                homepageData={data}
                treatments={treatments}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* MODAL 1: Publish Confirmation Dialog */}
      {/* ============================================================== */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181514] border border-[#C9A47F]/40 max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
                  CONFIRM PUBLICATION
                </span>
                <h3 className="text-2xl font-serif text-[#F6F0E9] mt-1">
                  Publish to Live Website?
                </h3>
              </div>
              <button
                onClick={() => setShowPublishModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 bg-[#12100F] border border-[#C9A47F]/20 text-xs text-[#AFA89F] leading-relaxed space-y-2">
              <p>
                <strong className="text-[#F6F0E9]">Public Website Synchronization:</strong> This operation writes directly to <code className="text-[#C9A47F]">/homepage_content/published</code>. All visitors and patients will immediately see the updated content.
              </p>
              <p>
                An immutable revision snapshot will automatically be archived in <code className="text-[#C9A47F]">/homepage_revisions</code>, allowing 1-click rollback at any time.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                Revision Note (Optional)
              </label>
              <input
                type="text"
                value={publishNote}
                onChange={(e) => setPublishNote(e.target.value)}
                placeholder="e.g. Updated hero headline &amp; aesthetic background"
                className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                onClick={() => setShowPublishModal(false)}
                className="px-4 py-2 border border-white/10 hover:border-white/20 text-xs text-[#AFA89F] cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPublish}
                disabled={publishing}
                className="px-6 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Send className="w-4 h-4" />
                <span>{publishing ? 'Publishing...' : 'Confirm & Publish'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: Revision History & Rollback Modal */}
      {/* ============================================================== */}
      {showRollbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#181514] border border-[#C9A47F]/40 max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
                  AUDIT &amp; ROLLBACK
                </span>
                <h3 className="text-2xl font-serif text-[#F6F0E9] mt-1">
                  Homepage Version History
                </h3>
              </div>
              <button
                onClick={() => setShowRollbackModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto space-y-3 flex-1 pr-1">
              {revisions.length === 0 ? (
                <div className="text-center py-10 text-xs text-[#AFA89F]">
                  No historical revisions recorded yet. Revisions are created automatically each time you click &quot;Publish to Live&quot;.
                </div>
              ) : (
                revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-[#12100F] border border-white/10 hover:border-[#C9A47F]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="font-mono text-[#C9A47F] font-semibold">{rev.id}</span>
                        <span className="text-white/30">•</span>
                        <span className="text-[#F6F0E9] font-mono">
                          {new Date(rev.publishedAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#AFA89F] mt-1 italic font-sans">
                        &quot;{rev.note || 'Published via Visual Editor'}&quot; — by {rev.publishedBy}
                      </p>
                      <div className="text-[10px] text-[#C9A47F]/80 mt-1 font-mono">
                        Hero: {rev.snapshot.hero?.headlinePart1} {rev.snapshot.hero?.headlineHighlight}
                      </div>
                    </div>

                    <button
                      onClick={() => handleRollback(rev)}
                      className="px-4 py-2 bg-[#24211E] hover:bg-[#C9A47F] text-[#C9A47F] hover:text-[#0B0B0B] border border-[#C9A47F]/30 text-xs uppercase font-semibold tracking-wider transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore This Version</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setShowRollbackModal(false)}
                className="px-5 py-2 border border-white/10 text-xs text-[#AFA89F] hover:text-white cursor-pointer"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: Approved Media Library Asset Selector */}
      {/* ============================================================== */}
      {showMediaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="bg-[#181514] border border-[#C9A47F]/40 max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
                  APPROVED CLINICAL ASSETS
                </span>
                <h3 className="text-2xl font-serif text-[#F6F0E9] mt-1">
                  Select Visual Asset
                </h3>
              </div>
              <button
                onClick={() => setShowMediaModal(false)}
                className="text-white/40 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {['all', 'portraits', 'architecture', 'treatments', 'textures'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMediaActiveCategory(cat)}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider cursor-pointer transition-colors ${
                    mediaActiveCategory === cat
                      ? 'bg-[#C9A47F] text-[#0B0B0B] font-bold'
                      : 'bg-[#12100F] text-[#AFA89F] hover:text-white border border-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Approved Media Assets */}
            <div className="overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 pr-1">
              {APPROVED_MEDIA_ASSETS.filter((asset) =>
                mediaActiveCategory === 'all' ? true : asset.category === mediaActiveCategory
              ).map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleApplyImage(asset.url)}
                  className="group bg-[#12100F] border border-white/10 hover:border-[#C9A47F] cursor-pointer p-2 flex flex-col justify-between transition-all"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0A0A0A] mb-2">
                    <img
                      src={asset.url}
                      alt={asset.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-[9px] font-mono uppercase text-[#C9A47F]">
                      {asset.category}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-serif text-[#F6F0E9] group-hover:text-[#C9A47F] truncate">
                      {asset.name}
                    </h4>
                    <p className="text-[10px] text-[#AFA89F] font-mono mt-0.5">{asset.dimensions}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct HTTPS URL Input Alternative */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <label className="block text-xs uppercase tracking-wider text-[#C9A47F] font-medium">
                Or Enter Verified HTTPS Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 bg-[#12100F] border border-white/10 p-2 text-xs text-[#F6F0E9] font-mono"
                />
                <button
                  onClick={() => {
                    if (customImageUrl.trim()) handleApplyImage(customImageUrl.trim());
                  }}
                  disabled={!customImageUrl.trim()}
                  className="px-4 py-2 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-bold uppercase tracking-wider cursor-pointer disabled:opacity-40"
                >
                  Use URL
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowMediaModal(false)}
                className="px-5 py-2 border border-white/10 text-xs text-[#AFA89F] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
