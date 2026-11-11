/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { CLINIC_INFO } from '../data/surgeryData';
import { ArrowUp, MapPin, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B0B0B] border-t border-[#C9A47F]/20 text-[#AFA89F] text-xs font-sans relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/5">
          
          {/* Brand & Monogram (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-3.5 group">
              <div className="w-10 h-10 border border-[#C9A47F]/60 flex items-center justify-center bg-[#24201E] group-hover:border-[#C9A47F] transition-colors">
                <span className="font-serif text-base text-[#C9A47F]">SS</span>
              </div>
              <div>
                <p className="font-serif text-lg tracking-[0.16em] text-[#F6F0E9] uppercase font-medium leading-tight group-hover:text-white transition-colors">
                  DR. SAMIK SHARMA
                </p>
                <p className="text-[10px] tracking-[0.22em] text-[#C9A47F] uppercase font-light">
                  PLASTIC &amp; AESTHETIC SURGEON
                </p>
              </div>
            </Link>

            <p className="text-xs text-[#AFA89F] font-light leading-relaxed max-w-sm pt-2">
              Senior Consultant Plastic &amp; Aesthetic Surgeon at Shalby Hospital, Mohali. Dedicated to natural harmony, surgical safety, and anatomical precision.
            </p>

            <div className="text-[11px] text-[#C9A47F]/80 space-y-1 pt-1">
              <p>MBBS, MS (General Surgery), DrNB (Plastic Surgery)</p>
              <p>Fellowships in Aesthetic &amp; Facial Surgery (London &amp; UK)</p>
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F6F0E9]">
              Navigation
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-[#C9A47F] transition-colors">Home</Link>
              </li>
              <li>
                <a href="/#about" className="hover:text-[#C9A47F] transition-colors">About Surgeon</a>
              </li>
              <li>
                <Link to="/treatments" className="hover:text-[#C9A47F] transition-colors">Treatments</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C9A47F] transition-colors">Clinical Journal</Link>
              </li>
              <li>
                <a href="/#approach" className="hover:text-[#C9A47F] transition-colors">Clinical Approach</a>
              </li>
              <li>
                <a href="/#guide" className="hover:text-[#C9A47F] transition-colors">Patient Guide</a>
              </li>
              <li>
                <a href="/#contact" className="hover:text-[#C9A47F] transition-colors">Consultation</a>
              </li>
            </ul>
          </div>

          {/* Dedicated Procedure Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F6F0E9]">
              Key Disciplines
            </p>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/treatments/rhinoplasty" className="hover:text-[#C9A47F] transition-colors">
                  Rhinoplasty
                </Link>
              </li>
              <li>
                <Link to="/treatments/facelift-neck-lift" className="hover:text-[#C9A47F] transition-colors">
                  Facelift &amp; Neck Lift
                </Link>
              </li>
              <li>
                <Link to="/treatments/eyelid-surgery" className="hover:text-[#C9A47F] transition-colors">
                  Eyelid Surgery
                </Link>
              </li>
              <li>
                <Link to="/treatments/liposuction" className="hover:text-[#C9A47F] transition-colors">
                  High-Def Liposuction
                </Link>
              </li>
              <li>
                <Link to="/treatments/tummy-tuck" className="hover:text-[#C9A47F] transition-colors">
                  Tummy Tuck
                </Link>
              </li>
              <li>
                <Link to="/treatments/hair-transplant" className="hover:text-[#C9A47F] transition-colors">
                  Hair Restoration
                </Link>
              </li>
            </ul>
          </div>

          {/* Location & Practice Desk (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <p className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#F6F0E9]">
              Consultation Desk
            </p>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C9A47F] shrink-0 mt-0.5" />
                <span>
                  Department of Plastic Surgery, Shalby Hospital, Sector 71, Mohali, Punjab 160071
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#F6F0E9]">
                <ShieldCheck className="w-4 h-4 text-[#C9A47F] shrink-0" />
                <span>NABH Accredited Tertiary Center</span>
              </div>
              <div className="text-[11px] text-[#AFA89F]/80 pt-1">
                Mon – Sat: 10:00 AM – 5:00 PM (By Appointment)
              </div>
            </div>
          </div>

        </div>

        {/* Medical Legal Disclaimer */}
        <div className="py-6 border-b border-white/5 text-[11px] text-[#7C766F] leading-relaxed">
          <p>
            <strong className="text-[#AFA89F] font-normal">Medical Disclaimer:</strong> The information provided on this website is for educational and orientation purposes only and should not be construed as medical diagnosis, prognosis, or guarantee of surgical outcomes. All plastic, aesthetic, and reconstructive operations involve individualized clinical considerations, potential risks, and downtime. Suitability for any procedure is determined solely following an in-person clinical examination and medical clearance by Dr. Samik Sharma.
          </p>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#7C766F]">
          <p>
            &copy; {new Date().getFullYear()} Dr. Samik Sharma. All rights reserved. Shalby Hospital, Mohali.
          </p>

          <div className="flex items-center gap-6">
            {/* Staff / Doctor Portal Gateway */}
            <Link
              to="/admin"
              className="text-[#7C766F] hover:text-[#C9A47F] transition-colors text-[10px] uppercase tracking-wider"
              title="Practice Administrator Portal"
            >
              Surgeon Portal
            </Link>

            {/* Required Credit */}
            <span className="text-[#AFA89F] font-light">
              Designed by <span className="text-[#C9A47F] font-medium">Digiexplode AI</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 border border-[#C9A47F]/30 hover:border-[#C9A47F] text-[#C9A47F] hover:text-[#F6F0E9] transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
