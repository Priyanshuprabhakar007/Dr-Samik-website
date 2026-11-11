/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { APPROACH_PILLARS } from '../data/surgeryData';
import { Compass, ShieldCheck, HeartHandshake, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { HomepageData } from '../lib/firestoreService';

interface ApproachSectionProps {
  onOpenBooking: () => void;
  data?: HomepageData['approach'];
}

export const ApproachSection: React.FC<ApproachSectionProps> = ({ onOpenBooking, data }) => {
  const getIcon = (idx: number) => {
    switch (idx) {
      case 0:
        return <Eye className="w-5 h-5 text-[#C9A47F]" strokeWidth={1.5} />;
      case 1:
        return <Compass className="w-5 h-5 text-[#C9A47F]" strokeWidth={1.5} />;
      case 2:
        return <ShieldCheck className="w-5 h-5 text-[#C9A47F]" strokeWidth={1.5} />;
      case 3:
      default:
        return <HeartHandshake className="w-5 h-5 text-[#C9A47F]" strokeWidth={1.5} />;
    }
  };

  const bgClass = data?.backgroundSetting === 'charcoal' ? 'bg-[#181514]' : 'bg-[#12100F]';
  const pillarsList = data?.pillars && data.pillars.length > 0 ? data.pillars : APPROACH_PILLARS;

  return (
    <section id="approach" className={`py-24 sm:py-32 ${bgClass} relative overflow-hidden border-t border-[#C9A47F]/15`}>
      {/* Background Subtle Accent */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-[radial-gradient(circle,rgba(201,164,127,0.06)_0%,transparent_70%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left: Large Sculptural Profile Photograph (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-5 relative"
          >
            {/* Fine architectural gold framing */}
            <div className="relative aspect-[3/4] w-full overflow-hidden border border-[#C9A47F]/30 bg-[#0B0B0B] shadow-2xl">
              <img
                src={data?.image || '/src/assets/images/approach_sculptural_profile_1794213536894.jpg'}
                alt="Sculptural profile photograph showing chiaroscuro aesthetic harmony"
                className="w-full h-full object-cover filter contrast-[110%] hover:scale-102 transition-transform duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />

              {/* Dark subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent opacity-80" />
              <div className="absolute inset-0 border border-[#C9A47F]/20 m-3 pointer-events-none" />

              {/* Bottom tag */}
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[10px] font-sans tracking-[0.25em] text-[#C9A47F] uppercase mb-1">
                  SURGICAL GOLDEN RATIO
                </p>
                <p className="font-serif italic text-base sm:text-lg text-[#F6F0E9] leading-snug">
                  Balancing light, shadow, and organic contours.
                </p>
              </div>
            </div>

            {/* Subtle decorative gold line underneath */}
            <div className="hidden lg:block absolute -bottom-6 -right-6 w-28 h-28 border-b border-r border-[#C9A47F]/30 pointer-events-none" />
          </motion.div>

          {/* Right: Heading & The 4 Approach Pillars (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] as const }}
            className="lg:col-span-7"
          >
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-8 h-[1px] bg-[#C9A47F]" />
              <span className="text-[11px] font-sans tracking-[0.28em] text-[#C9A47F] uppercase font-semibold">
                {data?.subheadline || 'OUR METHODOLOGY'}
              </span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#F6F0E9] tracking-tight mb-4">
              {data?.headline ? (
                data.headline
              ) : (
                <>
                  Precise. Personalised.{' '}
                  <span className="font-serif italic text-[#C9A47F]">Natural.</span>
                </>
              )}
            </h2>

            <p className="text-sm sm:text-base text-[#AFA89F] font-light leading-relaxed mb-10 max-w-xl font-sans">
              {data?.description ||
                'Aesthetic surgery at its highest echelon is quiet, balanced, and imperceptible. Our clinical protocol centers on structural preservation rather than artificial exaggeration.'}
            </p>

            {/* 4 Pillars with refined line icons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7">
              {pillarsList.map((pillar, idx) => (
                <motion.div
                  key={pillar.title || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-[#1C1817] border border-[#C9A47F]/20 p-6 flex flex-col justify-between hover:border-[#C9A47F]/60 transition-colors duration-300 group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 border border-[#C9A47F]/30 bg-[#24201E] flex items-center justify-center group-hover:border-[#C9A47F] transition-colors">
                        {getIcon(idx)}
                      </div>
                      <span className="font-mono text-xs text-[#C9A47F]/70">
                        {pillar.number}
                      </span>
                    </div>

                    <h3 className="text-lg font-serif text-[#F6F0E9] font-medium mb-2 group-hover:text-[#C9A47F] transition-colors">
                      {pillar.title}
                    </h3>

                    <p className="text-xs text-[#AFA89F] font-light leading-relaxed font-sans mb-3">
                      {pillar.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#C9A47F] font-sans">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C9A47F]/70" />
                    <span>{pillar.highlight}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-xs text-[#AFA89F]">
                Consultations conducted in complete medical privacy at Shalby Hospital Mohali.
              </div>
              <button
                onClick={onOpenBooking}
                type="button"
                className="inline-flex items-center gap-2 text-xs font-sans font-semibold tracking-[0.14em] uppercase text-[#C9A47F] hover:text-[#DFCAAF] cursor-pointer group"
              >
                <span>Book Clinical Consultation</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
