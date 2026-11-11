/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Camera, Upload, Check, User } from 'lucide-react';

interface DoctorPortraitPlaceholderProps {
  className?: string;
}

export const DoctorPortraitPlaceholder: React.FC<DoctorPortraitPlaceholderProps> = ({
  className = '',
}) => {
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomPhotoUrl(url);
    }
  };

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden border border-[#C9A47F]/40 bg-gradient-to-b from-[#1E1B19] via-[#141211] to-[#0B0B0B] flex flex-col justify-between p-6 sm:p-7 shadow-2xl group ${className}`}
    >
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(201,164,127,0.12),transparent_70%)] pointer-events-none" />

      {customPhotoUrl ? (
        <div className="absolute inset-0">
          <img
            src={customPhotoUrl}
            alt="Dr. Samik Sharma - Approved Portrait"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
        </div>
      ) : (
        <>
          {/* Architectural Gold Corner Accents */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C9A47F]/60" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A47F]/60" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A47F]/60" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C9A47F]/60" />

          {/* Top Label */}
          <div className="relative z-10 flex items-center justify-between text-[10px] font-sans tracking-[0.24em] text-[#C9A47F] uppercase font-semibold">
            <span>OFFICIAL PORTRAIT SLOT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A47F]/80 animate-pulse" />
          </div>

          {/* Center Monogram / Silhouette Emblem */}
          <div className="relative z-10 my-auto text-center py-6">
            <div className="relative w-24 h-24 mx-auto mb-4 border border-[#C9A47F]/50 rounded-full flex items-center justify-center bg-[#24201E]/60 shadow-lg group-hover:border-[#C9A47F] transition-colors duration-300">
              <span className="font-serif text-3xl font-light text-[#C9A47F] tracking-widest select-none">
                SS
              </span>
              <div className="absolute -inset-1.5 border border-[#C9A47F]/20 rounded-full" />
            </div>

            <p className="font-serif text-xl sm:text-2xl text-[#F6F0E9] font-normal tracking-wide">
              Dr. Samik Sharma
            </p>
            <p className="text-[11px] font-sans tracking-[0.2em] text-[#C9A47F] uppercase mt-1 font-light">
              SENIOR CONSULTANT · PLASTIC SURGEON
            </p>

            <div className="mt-4 px-4 py-2 bg-[#0B0B0B]/70 border border-[#C9A47F]/25 inline-block text-[11px] text-[#AFA89F] font-sans font-light max-w-[240px]">
              Approved original portrait to be inserted upon doctor sign-off
            </div>
          </div>
        </>
      )}

      {/* Bottom Identity & Action Strip */}
      <div className="relative z-10 pt-4 border-t border-[#C9A47F]/20 flex items-center justify-between gap-3 text-xs">
        <div className="text-[10px] text-[#AFA89F] font-sans tracking-wider uppercase">
          SHALBY HOSPITAL, MOHALI
        </div>

        {/* Upload replacement trigger for genuine approved photo */}
        <label
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#24201E] hover:bg-[#C9A47F] text-[#C9A47F] hover:text-[#0B0B0B] border border-[#C9A47F]/40 text-[10px] font-sans tracking-wider uppercase transition-colors cursor-pointer"
          title="Upload Dr. Sharma's original photograph"
        >
          <Camera className="w-3 h-3" />
          <span>{customPhotoUrl ? 'Change' : 'Insert Photo'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};
