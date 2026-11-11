/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PATIENT_STEPS } from '../data/surgeryData';
import { ChevronDown, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientGuideSectionProps {
  onOpenBooking: () => void;
}

export const PatientGuideSection: React.FC<PatientGuideSectionProps> = ({ onOpenBooking }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do I prepare for my first aesthetic surgery consultation?',
      a: 'Bring your medical history, any prior operative records, and a list of specific aesthetic or functional concerns. Dr. Sharma will conduct an in-depth photographic and anatomical assessment, discuss conservative options, and explain realistic outcomes.'
    },
    {
      q: 'Are surgical procedures performed in an outpatient clinic or hospital?',
      a: 'All surgical procedures under Dr. Samik Sharma are performed exclusively in the tertiary surgical suites of Shalby Hospital, Mohali. This guarantees modular HEPA-filtered operating theatres, round-the-clock intensive care backup, and board-certified anesthesiologists.'
    },
    {
      q: 'Can outstation or international patients arrange virtual evaluations?',
      a: 'Yes. Preliminary consultations can be scheduled via secure video call. High-resolution standardized clinical photographs and medical clearance tests are reviewed before you travel to Mohali for in-person surgical assessment.'
    },
    {
      q: 'What is the recovery protocol and post-operative monitoring?',
      a: 'Every patient receives an itemized post-operative recovery protocol, including direct clinical telephone support, prescription medications, scheduled suture removal milestones, and ongoing scar maturation management up to 12 months.'
    }
  ];

  return (
    <section id="guide" className="py-24 sm:py-32 bg-[#0B0B0B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-[1px] bg-[#C9A47F]" />
            <span className="text-[11px] font-sans tracking-[0.28em] text-[#C9A47F] uppercase font-semibold">
              PATIENT PATHWAY
            </span>
            <span className="w-8 h-[1px] bg-[#C9A47F]" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-light text-[#F6F0E9] tracking-tight">
            Your Clinical Journey
          </h2>
          <p className="text-sm text-[#AFA89F] font-light mt-4 font-sans">
            A structured, transparent pathway from initial evaluation to enduring aesthetic refinement.
          </p>
        </motion.div>

        {/* 4-Step Patient Roadmap */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PATIENT_STEPS.map((step, idx) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-[#1C1817] border border-[#C9A47F]/20 p-7 flex flex-col justify-between relative hover:border-[#C9A47F]/60 transition-colors duration-300 shadow-lg"
            >
              <div>
                <div className="text-3xl font-serif font-light text-[#C9A47F] mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-serif text-[#F6F0E9] font-medium mb-3">
                  {step.title}
                </h3>
                <p className="text-xs text-[#AFA89F] font-light leading-relaxed font-sans">
                  {step.desc}
                </p>
              </div>

              <div className="pt-5 mt-5 border-t border-white/5 flex items-center gap-2 text-[11px] text-[#C9A47F]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="uppercase tracking-wider">Step Complete</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hospital Facility & FAQ Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Facility Highlights Box (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5 bg-[#1F1B19] border border-[#C9A47F]/30 p-8 sm:p-9 shadow-xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C9A47F] to-transparent" />

            <span className="text-[10px] font-sans tracking-[0.24em] text-[#C9A47F] uppercase font-semibold block mb-2">
              TERTIARY INFRASTRUCTURE
            </span>
            <h3 className="text-2xl font-serif text-[#F6F0E9] font-normal mb-4">
              Shalby Hospital, Mohali
            </h3>
            <p className="text-xs text-[#AFA89F] font-light leading-relaxed mb-6 font-sans">
              As Senior Consultant, Dr. Samik Sharma performs all surgical interventions within Shalby Hospital&apos;s accredited multi-specialty surgical campus.
            </p>

            <div className="space-y-3.5 mb-8">
              {[
                'NABH accredited tertiary hospital infrastructure',
                'Modular laminar airflow surgical theaters',
                'Dedicated board-certified cardiac & surgical anesthesiology',
                'Private inpatient recovery suites with 24/7 clinical nursing',
                'Standardized pre-op cardiopulmonary & biochemical screening',
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#C9A47F] mt-1.5 shrink-0" />
                  <span className="text-xs text-[#F6F0E9]/90 font-sans font-light">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={onOpenBooking}
              type="button"
              className="w-full py-3.5 border border-[#C9A47F] text-[#F6F0E9] hover:bg-[#C9A47F] hover:text-[#0B0B0B] text-xs font-sans font-semibold tracking-[0.16em] uppercase transition-all duration-300 text-center cursor-pointer shadow-md"
            >
              Request Hospital Consultation
            </button>
          </motion.div>

          {/* Frequently Asked Questions Accordion (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-7"
          >
            <h3 className="text-xl font-serif text-[#F6F0E9] font-normal mb-6 flex items-center gap-3">
              <span>Patient Guidelines &amp; Enquiries</span>
              <span className="w-10 h-[1px] bg-[#C9A47F]/40" />
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="border border-[#C9A47F]/20 bg-[#141211] overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/[0.02] cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-serif text-[#F6F0E9] font-normal">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C9A47F] shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-[13px] text-[#AFA89F] font-light leading-relaxed font-sans border-t border-white/5">
                            {faq.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};
