/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Send,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
} from 'lucide-react';
import {
  getBlogPosts,
  saveBlogPost,
  deleteBlogPost,
  BlogPost,
} from '../../lib/firestoreService';
import { useAuth } from '../../context/AuthContext';

export const BlogManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const data = await getBlogPosts(true);
      setPosts(data);
    } catch (err) {
      console.error('Failed to load blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSlugify = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleOpenCreate = () => {
    setIsNewPost(true);
    setEditingPost({
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      coverImage: 'https://images.unsplash.com/photo-1512290900672-1f41639d4fae?auto=format&fit=crop&w=1200&q=85',
      category: 'Facial Aesthetics',
      readTime: '5 min read',
      author: 'Dr. Samik Sharma',
      status: 'published',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (post: BlogPost) => {
    setIsNewPost(false);
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const [formDirty, setFormDirty] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleCloseModal = () => {
    if (formDirty && !window.confirm('You have unsaved changes in this article. Are you sure you want to discard them?')) {
      return;
    }
    setFormDirty(false);
    setIsModalOpen(false);
  };

  const handleSavePost = async (e: React.FormEvent, targetStatus?: 'published' | 'draft') => {
    e.preventDefault();
    if (!editingPost || !editingPost.title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    const slug = editingPost.slug?.trim() || handleSlugify(editingPost.title);
    if (!slug) {
      alert('Please provide a valid slug.');
      return;
    }

    if (isNewPost && posts.some((p) => p.slug === slug)) {
      alert(`An article with slug '${slug}' already exists.`);
      return;
    }

    setSaving(true);
    try {
      const statusToSave = targetStatus || editingPost.status || 'published';
      await saveBlogPost(
        {
          ...editingPost,
          slug,
          id: slug,
          status: statusToSave,
          updatedAt: new Date().toISOString(),
        },
        user?.email || undefined
      );

      setFormDirty(false);
      setNotification({
        type: 'success',
        message: `Article '${editingPost.title}' saved as ${statusToSave.toUpperCase()}!`,
      });
      setIsModalOpen(false);
      await loadPosts();
    } catch (err: any) {
      console.error('Error saving post:', err);
      alert(err.message || 'Failed to save blog post.');
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!window.confirm(`Delete article '${title}'? This action cannot be undone.`)) return;
    try {
      await deleteBlogPost(slug, user?.email || undefined);
      setNotification({ type: 'success', message: 'Article deleted.' });
      await loadPosts();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleStatus = async (post: BlogPost, newStatus: 'draft' | 'published') => {
    try {
      await saveBlogPost({ ...post, status: newStatus }, user?.email || undefined);
      await loadPosts();
    } catch (err) {
      console.error('Status toggle failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#C9A47F]/20">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
            PATIENT EDUCATION &amp; CLINICAL JOURNAL
          </span>
          <h1 className="text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Articles &amp; Clinical Guides
          </h1>
          <p className="text-xs text-[#AFA89F] mt-1">
            Author authoritative educational articles explaining surgical principles, preparation, and recovery.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center gap-2 cursor-pointer shadow-lg self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-3.5 border text-xs flex items-center gap-2.5 ${
            notification.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#181514] border border-[#C9A47F]/20 overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-xs text-[#AFA89F]">Loading articles...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#AFA89F] space-y-2">
            <BookOpen className="w-8 h-8 text-[#C9A47F] mx-auto opacity-40" />
            <p>No articles written yet. Click &quot;New Article&quot; to create your first educational guide.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 bg-[#141211] text-[10px] text-[#C9A47F] uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Article</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Read Time</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-10 bg-[#24201E] border border-white/10 shrink-0 overflow-hidden">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              ((e.target as any).src =
                                'https://images.unsplash.com/photo-1512290900672-1f41639d4fae?auto=format&fit=crop&w=300&q=80')
                            }
                          />
                        </div>
                        <div>
                          <p className="font-serif text-sm text-[#F6F0E9] font-medium leading-snug">
                            {post.title}
                          </p>
                          <p className="text-[10px] text-[#AFA89F] font-mono mt-0.5">
                            /{post.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#C9A47F]">
                      {post.category}
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-[#AFA89F]">
                      {post.readTime}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={post.status}
                        onChange={(e) => handleToggleStatus(post, e.target.value as any)}
                        className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 bg-[#12100F] border cursor-pointer ${
                          post.status === 'published'
                            ? 'border-emerald-500/40 text-emerald-400'
                            : 'border-amber-500/40 text-amber-300'
                        }`}
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-[10px] text-[#7C766F] font-mono whitespace-nowrap">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(post)}
                          className="p-1.5 text-[#AFA89F] hover:text-[#C9A47F] transition-colors"
                          title="Edit Article"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug, post.title)}
                          className="p-1.5 text-[#AFA89F] hover:text-rose-400 transition-colors"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && editingPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-[#181514] border border-[#C9A47F] w-full max-w-4xl p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto text-[#F6F0E9]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
                  {isNewPost ? 'NEW CLINICAL ARTICLE' : 'EDIT ARTICLE'}
                </span>
                <h3 className="text-2xl font-serif text-[#F6F0E9] mt-0.5">
                  {editingPost.title || 'Untitled Article'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-[#AFA89F] hover:text-[#F6F0E9]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSavePost} className="space-y-5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setEditingPost({
                        ...editingPost,
                        title,
                        slug: isNewPost ? handleSlugify(title) : editingPost.slug,
                      });
                    }}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingPost.slug}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, slug: handleSlugify(e.target.value) })
                    }
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Category
                  </label>
                  <select
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  >
                    <option value="Facial Aesthetics">Facial Aesthetics</option>
                    <option value="Body Contouring">Body Contouring</option>
                    <option value="Hair Restoration">Hair Restoration</option>
                    <option value="Reconstructive Surgery">Reconstructive Surgery</option>
                    <option value="Patient Safety & Preparation">Patient Safety &amp; Preparation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                    Estimated Read Time
                  </label>
                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    placeholder="e.g. 5 min read"
                    className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Cover Image URL
                </label>
                <input
                  type="text"
                  value={editingPost.coverImage}
                  onChange={(e) => setEditingPost({ ...editingPost, coverImage: e.target.value })}
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Executive Excerpt
                </label>
                <textarea
                  rows={2}
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  placeholder="Short 2-sentence summary for preview cards..."
                  className="w-full bg-[#12100F] border border-white/10 p-2.5 text-xs text-[#F6F0E9]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#C9A47F] mb-1 font-medium">
                  Clinical Article Content (Supports Markdown headers #, ##, bolding, lists)
                </label>
                <textarea
                  rows={10}
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full bg-[#12100F] border border-white/10 p-3 text-xs text-[#F6F0E9] leading-relaxed font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="flex items-center gap-2 text-[11px] text-[#AFA89F]">
                  {formDirty && (
                    <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] uppercase font-mono font-semibold">
                      Unsaved Changes
                    </span>
                  )}
                  {editingPost.updatedAt && (
                    <span className="font-mono text-[10px] text-[#7C766F]">
                      Last updated: {new Date(editingPost.updatedAt).toLocaleDateString()}
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
                    onClick={(e) => handleSavePost(e, 'draft')}
                    disabled={saving}
                    className="px-5 py-2.5 bg-[#24211E] hover:bg-[#2F2A27] text-xs text-[#C9A47F] border border-[#C9A47F]/40 uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Save as Draft
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleSavePost(e, 'published')}
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
