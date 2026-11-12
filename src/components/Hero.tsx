/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Sparkles, Award } from 'lucide-react';
import { motion } from 'motion/react';

import { HomepageData } from '../lib/firestoreService';

interface HeroProps {
  onOpenBooking: () => void;
  heroData?: HomepageData['hero'];
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking, heroData }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const },
    },
  };


  return (
    <section
      id="home"
      className="relative min-h-[100svh] flex items-center bg-[#0B0B0B] overflow-hidden pt-24 sm:pt-28 lg:pt-0"
    >
      {/* Background Architectural & Atmospheric Elements */}
      <div className="absolute inset-0 pointer-events-none luxury-noise opacity-40 z-0" />
      <div className="absolute top-1/3 left-8 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(201,164,127,0.08)_0%,transparent_70%)] blur-2xl pointer-events-none" />

      {/* Main Full-Width Edge-to-Edge Grid with 1440px Max Bounds */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Typography & Staggered Entrance (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 min-w-0 flex flex-col justify-center pr-0 lg:pr-8"
          >
            {/* Small uppercase eyebrow */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-3 mb-6">
              <span className="w-10 h-[1px] bg-[#C9A47F]" />
              <p className="text-[11px] sm:text-xs font-sans tracking-[0.3em] text-[#C9A47F] uppercase font-semibold">
                {heroData?.eyebrow || 'PLASTIC | COSMETIC | RECONSTRUCTIVE SURGERY'}
              </p>
            </motion.div>

            {/* Oversized luxury serif headline */}
            <motion.h1
              variants={itemVariants}
              className="text-[clamp(2.2rem,10.2vw,2.9rem)] sm:text-[3.3rem] md:text-[4.15rem] lg:text-[4.65rem] xl:text-[5rem] font-serif font-normal text-[#F6F0E9] leading-[1.09] tracking-[-0.045em] mb-7 max-w-2xl text-balance break-words"
            >
              {heroData ? (
                <>
                  {heroData.headlinePart1}{' '}
                  <span className="font-serif italic font-medium text-[#C9A47F] inline-block tracking-[-0.04em]">
                    {heroData.headlineHighlight}
                  </span>
                </>
              ) : (
                <>
                  RESHAPING FORM, <br className="hidden sm:inline" />
                  RESTORING{' '}
                  <span className="font-serif italic font-medium text-[#C9A47F] inline-block tracking-[-0.04em]">
                    CONFIDENCE
                  </span>
                </>
              )}
            </motion.h1>

            {/* Short clear supporting description */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[#C4B9AC] font-normal leading-[1.8] max-w-xl mb-10 font-sans"
            >
              {heroData?.description ||
                'Under the surgical direction of Dr. Samik Sharma, UK-fellowship trained plastic & aesthetic surgeon. Harmonizing anatomical structural precision with restrained artistry to achieve natural, enduring results.'}
            </motion.p>

            {/* CTA action buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5 mb-12"
            >
              <button
                onClick={onOpenBooking}
                type="button"
                className="relative group px-8 py-4 bg-[#C9A47F] text-[#0B0B0B] text-xs font-sans font-bold tracking-[0.18em] uppercase hover:bg-[#DFCAAF] transition-all duration-300 shadow-xl shadow-[#C9A47F]/15 flex items-center justify-center gap-3 cursor-pointer overflow-hidden"
              >
                <span className="relative z-10">{heroData?.primaryCtaLabel || 'Book a Consultation'}</span>
                <ArrowRight className="w-4 h-4 relative z-10 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </button>

              <a
                href={heroData?.secondaryCtaLink || '#treatments'}
                className="px-7 py-4 border border-[#C9A47F]/40 text-[#F6F0E9] text-xs font-sans font-medium tracking-[0.16em] uppercase hover:border-[#C9A47F] hover:bg-white/[0.03] transition-all duration-300 flex items-center justify-center gap-2 text-center"
              >
                <span>{heroData?.secondaryCtaLabel || 'Explore Procedures'}</span>
              </a>
            </motion.div>

            {/* Credential trust markers */}
            <motion.div
              variants={itemVariants}
              className="pt-6 border-t border-[#C9A47F]/20 flex flex-wrap items-center gap-3 sm:gap-8 text-xs text-[#AFA89F]"
            >
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-[#C9A47F] shrink-0" />
                <span className="text-[#F6F0E9] font-medium">UK Fellowship Trained</span>
                <span className="text-white/20">|</span>
                <span>London &amp; UK Fellowships</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-[#C9A47F] shrink-0" />
                <span className="text-[#F6F0E9] font-medium">Shalby Hospital</span>
                <span className="text-white/20">·</span>
                <span>Mohali, Punjab</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Cinematic Beauty Portrait with Golden Arcs (5 cols) */}
          <div className="lg:col-span-5 relative flex items-center justify-center lg:justify-end">
            
            {/* Architectural Golden Curves / Arcs Background */}
            <div className="absolute -inset-4 sm:-inset-8 pointer-events-none flex items-center justify-center">
              {/* Outer Golden Arc */}
              <div className="w-[96%] h-[102%] border border-[#C9A47F]/25 rounded-t-[220px] lg:rounded-t-[280px] translate-y-3" />
              {/* Inner Fine Golden Arc */}
              <div className="absolute w-[88%] h-[95%] border border-[#C9A47F]/15 rounded-t-[200px] lg:rounded-t-[250px] translate-y-6" />
              {/* Radial Golden Halo */}
              <div className="absolute w-72 h-72 bg-[#C9A47F]/10 rounded-full blur-3xl -top-6 -right-6" />
            </div>

            {/* Cinematic Full-Bleed Portrait Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative w-full max-w-md lg:max-w-none aspect-[4/4.1] sm:aspect-[3/4] overflow-hidden shadow-2xl shadow-black z-10 border-b border-[#C9A47F]/50 group"
            >
              <img
                src={heroData?.heroImage || '/src/assets/images/hero_editorial_beauty_1794213535182.jpg'}
                alt="Cinematic sculptural beauty editorial with champagne drapery"
                className={`w-full h-full object-cover scale-100 group-hover:scale-103 transition-transform duration-1000 ease-out ${
                  heroData?.imagePosition === 'object-bottom'
                    ? 'object-bottom'
                    : heroData?.imagePosition === 'object-center'
                    ? 'object-center'
                    : 'object-top'
                }`}
                loading="eager"
                referrerPolicy="no-referrer"
              />

              {/* Chiaroscuro vignetting with adjustable intensity */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent pointer-events-none"
                style={{ opacity: (heroData?.overlayIntensity ?? 70) / 100 }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0B0B0B]/40 via-transparent to-transparent pointer-events-none" />

              {/* Bottom Subtle Editorial Caption */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-[11px] font-sans tracking-widest text-[#F6F0E9]/80 uppercase">
                <span className="font-serif italic text-xs tracking-normal text-[#C9A47F]">
                  Form &amp; Proportion
                </span>
                <span className="text-[10px] text-[#AFA89F]/70 tracking-[0.22em]">
                  EDITORIAL VISUAL CONCEPT
                </span>
              </div>
            </motion.div>

            {/* Floating Luxury Editorial Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="hidden sm:flex absolute -bottom-6 -left-8 z-20 bg-[#1A1716]/95 backdrop-blur-md border border-[#C9A47F]/40 p-4 shadow-2xl max-w-[220px]"
            >
              <div className="flex flex-col">
                <div className="text-[10px] tracking-[0.24em] uppercase text-[#C9A47F] mb-1 font-semibold">
                  AESTHETIC INTEGRITY
                </div>
                <div className="text-xs text-[#F6F0E9] font-serif leading-snug">
                  Precision surgical contouring without tell-tale operated signs.
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>

      {/* Bottom Hairline Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A47F]/30 to-transparent" />
    </section>
  );
};
