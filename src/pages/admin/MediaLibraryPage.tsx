/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Copy,
  Check,
  Filter,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

interface MediaAsset {
  id: string;
  name: string;
  category: 'portraits' | 'treatments' | 'architecture' | 'textures';
  url: string;
  size: string;
  dimensions: string;
}

const PRESET_ASSETS: MediaAsset[] = [
  {
    id: 'asset-samik-portrait',
    name: 'Dr. Samik Sharma Official Portrait',
    category: 'portraits',
    url: '/samik-portrait.jpg',
    size: '1.2 MB',
    dimensions: '1200 x 1600',
  },
  {
    id: 'asset-hero-beauty',
    name: 'Hero Editorial Aesthetic Sculpture',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1400&q=85',
    size: '2.4 MB',
    dimensions: '1920 x 1280',
  },
  {
    id: 'asset-arch-atrium',
    name: 'Shalby Clinical Architectural Suite',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    size: '1.8 MB',
    dimensions: '1600 x 1060',
  },
  {
    id: 'asset-rhinoplasty',
    name: 'Structural Rhinoplasty Aesthetic Portrait',
    category: 'treatments',
    url: 'https://images.unsplash.com/photo-1512290900672-1f41639d4fae?auto=format&fit=crop&w=1200&q=85',
    size: '1.9 MB',
    dimensions: '1200 x 1600',
  },
  {
    id: 'asset-facelift',
    name: 'Deep Plane Facelift & Neck Profile',
    category: 'treatments',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=85',
    size: '2.1 MB',
    dimensions: '1200 x 1600',
  },
  {
    id: 'asset-eyelid',
    name: 'Blepharoplasty Orbital Refinement',
    category: 'treatments',
    url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=85',
    size: '1.5 MB',
    dimensions: '1200 x 1600',
  },
  {
    id: 'asset-lipo',
    name: 'High-Definition Body Contouring',
    category: 'treatments',
    url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=85',
    size: '2.2 MB',
    dimensions: '1200 x 1600',
  },
  {
    id: 'asset-tummytuck',
    name: 'Abdominoplasty Architectural Form',
    category: 'treatments',
    url: '/src/assets/images/treatment_tummytuck_1794213592223.jpg',
    size: '2.6 MB',
    dimensions: '1024 x 1536',
  },
  {
    id: 'asset-bronze-silk',
    name: 'Bronze Champagne Silk Backdrop',
    category: 'textures',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1800&q=85',
    size: '3.1 MB',
    dimensions: '2400 x 1600',
  },
];

export const MediaLibraryPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAsset[]>(PRESET_ASSETS);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    setUploadSuccess(null);
    if (!file) return;

    // Validate size (max 5MB)
    const maxSizeBytes = 5 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setUploadError(`File exceeds maximum permitted size of 5MB (${(file.size / 1024 / 1024).toFixed(2)} MB uploaded).`);
      return;
    }

    // Validate type (JPG, PNG, WebP)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Invalid image format. Only JPEG, PNG, and WebP assets are allowed for high-resolution clinical rendering.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const resultUrl = reader.result as string;
      const newAsset: MediaAsset = {
        id: `uploaded-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        category: 'treatments',
        url: resultUrl,
        size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        dimensions: 'Original Quality',
      };
      setAssets([newAsset, ...assets]);
      setUploadSuccess(`Successfully loaded asset '${file.name}'. You can copy the URL to use in CMS screens.`);
      setTimeout(() => setUploadSuccess(null), 5000);
    };
    reader.readAsDataURL(file);
  };

  const filteredAssets = categoryFilter === 'all'
    ? assets
    : assets.filter((a) => a.category === categoryFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#C9A47F]/20">
        <div>
          <span className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase font-semibold">
            CURATED ASSET MANAGEMENT
          </span>
          <h1 className="text-3xl font-serif text-[#F6F0E9] font-light mt-1">
            Media &amp; Clinical Imagery
          </h1>
          <p className="text-xs text-[#AFA89F] mt-1">
            Browse approved high-resolution editorial assets, doctor portraits, and upload new procedure imagery (max 5MB).
          </p>
        </div>

        {/* Upload Trigger Button */}
        <div>
          <label className="px-5 py-2.5 bg-[#C9A47F] hover:bg-[#DFCAAF] text-[#0B0B0B] text-xs font-semibold uppercase tracking-[0.14em] transition-colors flex items-center gap-2 cursor-pointer shadow-lg">
            <Upload className="w-4 h-4" />
            <span>Upload New Asset</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Alert Notices */}
      {uploadError && (
        <div className="p-4 bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2.5">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="flex items-center justify-between bg-[#181514] border border-[#C9A47F]/20 p-3">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'all', label: 'All Assets' },
            { id: 'portraits', label: 'Doctor Portraits' },
            { id: 'treatments', label: 'Procedures' },
            { id: 'architecture', label: 'Hospital Architecture' },
            { id: 'textures', label: 'Luxury Textures' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-[#24211E] text-[#C9A47F] border border-[#C9A47F]/40'
                  : 'text-[#AFA89F] hover:text-[#F6F0E9]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="text-[11px] text-[#7C766F] font-mono hidden sm:inline">
          {filteredAssets.length} assets
        </span>
      </div>

      {/* Grid of Assets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredAssets.map((asset) => {
          const isCopied = copiedId === asset.id;
          return (
            <div
              key={asset.id}
              className="bg-[#181514] border border-white/5 hover:border-[#C9A47F]/50 transition-colors group flex flex-col justify-between overflow-hidden"
            >
              <div className="aspect-[4/3] bg-[#0B0B0B] relative overflow-hidden">
                <img
                  src={asset.url}
                  alt={asset.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) =>
                    ((e.target as any).src =
                      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80')
                  }
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#0B0B0B]/80 backdrop-blur-sm text-[9px] uppercase tracking-wider text-[#C9A47F] border border-white/10">
                  {asset.category}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs font-serif text-[#F6F0E9] font-medium truncate" title={asset.name}>
                  {asset.name}
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#7C766F] font-mono">
                  <span>{asset.dimensions}</span>
                  <span>{asset.size}</span>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-white/5">
                  <button
                    onClick={() => handleCopyUrl(asset.id, asset.url)}
                    className="flex items-center gap-1.5 text-[11px] text-[#C9A47F] hover:text-[#DFCAAF] transition-colors cursor-pointer"
                    title="Copy URL to clipboard"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1 text-[#AFA89F] hover:text-white"
                    title="Open Full Image"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
