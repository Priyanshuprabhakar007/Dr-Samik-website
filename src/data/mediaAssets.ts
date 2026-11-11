/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MediaAsset {
  id: string;
  name: string;
  category: 'portraits' | 'treatments' | 'architecture' | 'textures';
  url: string;
  size: string;
  dimensions: string;
  description?: string;
}

export const APPROVED_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'samik-portrait',
    name: 'Dr. Samik Sharma Official Portrait',
    category: 'portraits',
    url: '/samik-portrait.jpg',
    size: '1.2 MB',
    dimensions: '1200 x 1600',
    description: 'Senior Consultant Plastic & Aesthetic Surgeon verified portrait',
  },
  {
    id: 'hero-editorial-beauty',
    name: 'Hero Editorial Sculptural Beauty',
    category: 'portraits',
    url: '/src/assets/images/hero_editorial_beauty_1794213535182.jpg',
    size: '2.1 MB',
    dimensions: '1440 x 1920',
    description: 'Cinematic chiaroscuro beauty portrait with champagne gold drapery',
  },
  {
    id: 'sculptural-marble-torso',
    name: 'Classical Sculptural Marble Torso',
    category: 'architecture',
    url: '/src/assets/images/about_sculptural_marble_1794213536764.jpg',
    size: '1.9 MB',
    dimensions: '1200 x 1600',
    description: 'Architectural classical Greek torso reflecting timeless anatomical proportion',
  },
  {
    id: 'approach-sculptural-profile',
    name: 'Aesthetic Chiaroscuro Profile',
    category: 'portraits',
    url: '/src/assets/images/approach_sculptural_profile_1794213536894.jpg',
    size: '1.8 MB',
    dimensions: '1200 x 1600',
    description: 'Sculptural facial profile showing light, shadow, and balanced organic contours',
  },
  {
    id: 'cta-bronze-silk',
    name: 'Bronze Champagne Silk Drape',
    category: 'textures',
    url: '/src/assets/images/cta_bronze_silk_1794213538249.jpg',
    size: '2.4 MB',
    dimensions: '2400 x 1600',
    description: 'Luxury bronze and champagne flowing silk for dramatic consultation backdrop',
  },
  {
    id: 'treatments-museum-hall',
    name: 'Sculptural Museum Aesthetic Hall',
    category: 'architecture',
    url: '/src/assets/images/treatments_hero_sculptural_1794217994345.jpg',
    size: '2.8 MB',
    dimensions: '2560 x 1440',
    description: 'Grand architectural museum hall background for clinical discipline hero',
  },
  {
    id: 'treatment-rhinoplasty',
    name: 'Structural Rhinoplasty Aesthetic Profile',
    category: 'treatments',
    url: '/src/assets/images/treatment_rhinoplasty_1794213538703.jpg',
    size: '1.7 MB',
    dimensions: '1200 x 1600',
    description: 'Aesthetic nasal profile refinement and structural harmony',
  },
  {
    id: 'treatment-facelift',
    name: 'Deep Plane Facelift & Neck Profile',
    category: 'treatments',
    url: '/src/assets/images/treatment_facelift_1794213539762.jpg',
    size: '2.0 MB',
    dimensions: '1200 x 1600',
    description: 'Restored youthful mandibular jawline and smooth neck contours',
  },
  {
    id: 'treatment-eyelid',
    name: 'Blepharoplasty Periorbital Refinement',
    category: 'treatments',
    url: '/src/assets/images/treatment_eyelid_1794213577248.jpg',
    size: '1.6 MB',
    dimensions: '1200 x 1600',
    description: 'Upper and lower eyelid rejuvenation preserving natural almond eyes',
  },
  {
    id: 'treatment-liposuction',
    name: 'High-Definition Body Contouring',
    category: 'treatments',
    url: '/src/assets/images/treatment_liposuction_1794213577090.jpg',
    size: '2.2 MB',
    dimensions: '1200 x 1600',
    description: 'VASER ultrasound precision body contouring and athletic definition',
  },
  {
    id: 'treatment-tummytuck',
    name: 'Abdominoplasty Core Restoration',
    category: 'treatments',
    url: '/src/assets/images/treatment_tummytuck_1794213592223.jpg',
    size: '2.5 MB',
    dimensions: '1024 x 1536',
    description: 'Abdominal wall plication and natural waistline contouring',
  },
  {
    id: 'treatment-hair',
    name: 'Micro-Follicular Hair Restoration',
    category: 'treatments',
    url: '/src/assets/images/treatment_hairtransplant_1794213578712.jpg',
    size: '1.9 MB',
    dimensions: '1200 x 1600',
    description: 'Natural hairline architecture and dense follicular unit extraction',
  },
  {
    id: 'treatment-reconstructive',
    name: 'Reconstructive Microsurgery Clinical Suite',
    category: 'treatments',
    url: '/src/assets/images/treatment_reconstructive_1794217995258.jpg',
    size: '2.3 MB',
    dimensions: '1600 x 1066',
    description: 'Complex trauma reconstruction, scar revision, and congenital care',
  },
  {
    id: 'shalby-hospital-suite',
    name: 'Shalby Hospital Tertiary OT Suite',
    category: 'architecture',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    size: '1.8 MB',
    dimensions: '1600 x 1060',
    description: 'NABH-accredited tertiary multi-specialty facility at Sector 71 Mohali',
  },
];
