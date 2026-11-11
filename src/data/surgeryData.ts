/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface JourneyStep {
  step: string;
  title: string;
  description: string;
}

export interface RecoveryPhase {
  phase: string;
  timeline: string;
  milestones: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TreatmentDetail {
  slug: string;
  id: string;
  title: string;
  category: 'facial' | 'body' | 'hair' | 'reconstructive';
  categoryLabel: string;
  tagline: string;
  heroImage: string;
  galleryImages?: string[];
  summary: string;
  indications: string[];
  duration: string;
  anesthesia: string;
  recoverySummary: string;
  clinicalApproach: string;
  
  // Rich sections for individual treatment page
  understanding: {
    leadParagraph: string;
    anatomicalDepth: string;
    surgicalTechniques: string[];
  };
  candidacy: {
    overview: string;
    goodCandidates: string[];
    carefulConsiderations: string;
  };
  journey: JourneyStep[];
  recovery: {
    intro: string;
    phases: RecoveryPhase[];
    guidelines: string[];
    variabilityDisclaimer: string;
  };
  faqs: FAQItem[];
  seo: {
    metaTitle: string;
    metaDescription: string;
    canonicalPath: string;
  };
}

export const TREATMENTS_DETAILED: Record<string, TreatmentDetail> = {
  'rhinoplasty': {
    slug: 'rhinoplasty',
    id: 'rhinoplasty',
    title: 'Rhinoplasty',
    category: 'facial',
    categoryLabel: 'Facial Aesthetics',
    tagline: 'Aesthetic & Functional Nasal Harmonisation',
    heroImage: '/src/assets/images/treatment_rhinoplasty_1794213538703.jpg',
    summary: 'Refining nasal proportions, profile contour, and breathing dynamics with preservation and structural techniques tailored to individual facial balance.',
    indications: ['Dorsal hump reduction', 'Tip refinement and rotation', 'Septal deviation & airway improvement', 'Revision rhinoplasty'],
    duration: '2.5 – 3.5 Hours',
    anesthesia: 'General Anesthesia (NABH Accredited Tertiary OT)',
    recoverySummary: 'External splint removed at 7 days; return to non-strenuous activities in 10–14 days.',
    clinicalApproach: 'Structural and preservation rhinoplasty techniques designed to preserve cartilaginous integrity while creating enduring, natural profiles that never appear operated upon.',
    understanding: {
      leadParagraph: 'Rhinoplasty is widely considered the most demanding operation in aesthetic surgery because millimeters dictate both three-dimensional facial balance and internal respiratory mechanics. Under Dr. Samik Sharma’s surgical direction at Shalby Hospital Mohali, rhinoplasty is treated not merely as bone reduction, but as an architectural realignment that preserves foundational nasal support.',
      anatomicalDepth: 'Dr. Sharma specializes in both Preservation Rhinoplasty (where the dorsal cartilage and bone vaults are preserved and repositioned rather than resected) and Structural Open Rhinoplasty using autologous cartilage graft frameworks. This ensures the nasal tip remains supple, stable, and resistant to post-operative pinching or airway compromise across decades.',
      surgicalTechniques: [
        'Preservation Rhinoplasty: Maintaining native osteocartilaginous dorsal roof architecture.',
        'Structural Grafting: Autologous septal or auricular cartilage struts for long-term tip stability.',
        'Ultrasonic / Micro-instrumentation: Precision osteotomies that reduce periorbital bruising and promote rapid tissue recovery.',
        'Septoplasty & Turbinoplasty: Concomitant correction of internal airway obstructions for unimpeded nasal breathing.'
      ]
    },
    candidacy: {
      overview: 'Candidates for rhinoplasty are typically individuals seeking aesthetic refinement of their nasal bridge, tip, or proportions, or those suffering from restricted nasal airflow due to traumatic or congenital deviation.',
      goodCandidates: [
        'Complete skeletal maturity (generally age 16–18 and above)',
        'Concern with dorsal hump, bulbous or drooping tip, wide nasal bones, or nostril asymmetry',
        'Impaired nasal airflow or chronic obstruction that has not responded to medical management',
        'Realistic expectations and desire for natural improvement rather than artificial perfection',
        'Good general health and non-smoker or willing to abstain during surgical healing'
      ],
      carefulConsiderations: 'Thick sebaceous nasal skin or severe previous scar tissue from prior surgeries requires nuanced structural reinforcement and realistic expectations regarding definition. A comprehensive in-person anatomical evaluation is mandatory.'
    },
    journey: [
      {
        step: '01',
        title: 'Clinical & Photographic Examination',
        description: 'Comprehensive 45-minute clinical consultation with Dr. Samik Sharma at Shalby Hospital Mohali. Examination of nasal skin thickness, internal septum, nasal valves, and multi-angle digital analysis.'
      },
      {
        step: '02',
        title: 'Bespoke Anatomical Strategy',
        description: 'Formulation of an individualized surgical blueprint: preservation versus open structural technique, cartilage harvest requirements, and precise aesthetic milestones.'
      },
      {
        step: '03',
        title: 'Tertiary Suite Surgery',
        description: 'Executed within Shalby Hospital’s laminar airflow modular theaters under board-certified anesthesiology with advanced hemodynamic monitoring.'
      },
      {
        step: '04',
        title: 'Splint Removal & Early Milestone',
        description: 'External protective thermoplastic splint and fine sutures removed at 7 to 8 days. Initial profile refinement is immediately apparent.'
      },
      {
        step: '05',
        title: 'Longitudinal Care & Follow-Up',
        description: 'Scheduled post-operative reviews at 1, 3, 6, and 12 months with night-time taping protocols to guide delicate dermal redraping.'
      }
    ],
    recovery: {
      intro: 'Recovery following rhinoplasty is typically comfortable with minimal sharp pain. Temporary nasal congestion, periorbital swelling, and subtle bruising are normal physiological responses.',
      phases: [
        {
          phase: 'Days 1 – 7',
          timeline: 'Splint in place',
          milestones: 'Rest with head elevated. Cold compresses around eyes. Splint and external sutures removed on Day 7.'
        },
        {
          phase: 'Weeks 2 – 3',
          timeline: 'Social reintegration',
          milestones: 'Bruising has typically resolved; 70% of superficial swelling dissipates. Return to desk work and light walking.'
        },
        {
          phase: 'Months 2 – 6',
          timeline: 'Structural refinement',
          milestones: 'Gradual definition of the supratip and bony dorsum. Light cardio and gym workouts permitted.'
        },
        {
          phase: 'Months 9 – 12+',
          timeline: 'Final anatomical settling',
          milestones: 'Deep interstitial swelling in the lower cartilaginous third completely clears; final definitive contour established.'
        }
      ],
      guidelines: [
        'Avoid blowing your nose for 2 weeks; use sterile saline irrigations as prescribed.',
        'Wear contact lenses or taped glasses for 4 to 6 weeks to avoid pressure on nasal bones.',
        'Sleep with head elevated on two pillows for the initial 10 days to minimize morning swelling.'
      ],
      variabilityDisclaimer: 'Individual healing rates vary significantly based on dermal thickness, genetic vascularity, and adherence to aftercare protocols. All surgical timelines are indicative only.'
    },
    faqs: [
      {
        question: 'Will my nose look obviously operated or artificial?',
        answer: 'No. Dr. Samik Sharma adheres to structural restraint and individual ethnic harmony. The goal of modern rhinoplasty is an organic, balanced profile that complements your chin, forehead, and cheekbones without tell-tale scoop humps or overly pinched tips.'
      },
      {
        question: 'Is rhinoplasty painful during the recovery period?',
        answer: 'Most patients describe the recovery as mild discomfort similar to a head cold or sinus pressure, rather than severe pain. Dr. Sharma avoids painful nasal packing, instead utilizing gentle internal dissolvable splints that allow gentle airflow and minimal removal discomfort.'
      },
      {
        question: 'Can rhinoplasty improve my breathing while altering appearance?',
        answer: 'Yes. This is termed septorhinoplasty. In many patients, cosmetic irregularities are directly connected to underlying septal deviation or internal nasal valve collapse. Both structural breathing pathways and external contours are addressed simultaneously in the same operation.'
      },
      {
        question: 'When can I resume exercise and social gatherings?',
        answer: 'Most patients feel comfortable attending social engagements and returning to work approximately 10 to 14 days after surgery once the splint is removed and major bruising resolves. Strenuous cardiovascular exercise and contact sports should be deferred for 4 to 6 weeks.'
      },
      {
        question: 'How long does the final result take to settle completely?',
        answer: 'While the profile looks significantly refined immediately upon splint removal, subtle microscopic swelling in the nasal tip takes between 9 and 15 months to fully resolve. Follow-up visits at Shalby Hospital Mohali monitor this gradual maturation.'
      }
    ],
    seo: {
      metaTitle: 'Rhinoplasty in Mohali & Chandigarh | Dr. Samik Sharma Plastic Surgeon',
      metaDescription: 'Specialist aesthetic and functional rhinoplasty by Dr. Samik Sharma, UK fellowship-trained plastic surgeon at Shalby Hospital Mohali. Natural nasal contouring.',
      canonicalPath: '/treatments/rhinoplasty'
    }
  },

  'facelift-neck-lift': {
    slug: 'facelift-neck-lift',
    id: 'facelift-necklift',
    title: 'Facelift & Neck Lift',
    category: 'facial',
    categoryLabel: 'Facial Aesthetics',
    tagline: 'Deep Plane SMAS & Platysmaplasty Rejuvenation',
    heroImage: '/src/assets/images/treatment_facelift_1794213539762.jpg',
    summary: 'Comprehensive anatomical repositioning of deeper facial structures, restoring jawline definition, midface volume, and smooth cervical neck contours.',
    indications: ['Lower facial jowling & skin laxity', 'Deep nasolabial folds', 'Platysmal neck bands', 'Loss of mandibular jawline definition'],
    duration: '3.5 – 5 Hours',
    anesthesia: 'General Anesthesia (NABH Accredited Tertiary Suite)',
    recoverySummary: 'Sutures removed in 7–10 days; return to social engagements in 2–3 weeks.',
    clinicalApproach: 'Tension-free deep-plane SMAS lifting with platysmal plication. Skin is redraped without unnatural horizontal tension, preserving natural earlobe anatomy and hairline position.',
    understanding: {
      leadParagraph: 'Facial aging is characterized by the gravitational descent of deeper retaining ligaments, the sub-muscular aponeurotic system (SMAS), and cervical platysmal bands—not simply by skin stretching. At Shalby Hospital Mohali, Dr. Samik Sharma performs deep-plane SMAS facelifts and platysmaplasties that reposition underlying structural foundations without pulling the skin tight.',
      anatomicalDepth: 'By releasing key facial retaining ligaments (zygomatic and mandibular ligaments), the deeper fat compartments of the cheek and jawline are mobilized and elevated vertically back to their anatomical youthful position. The overlying skin is then redraped tension-free, completely avoiding the unnatural windblown look of outdated procedures.',
      surgicalTechniques: [
        'Deep Plane SMAS Mobilization: Vertical repositioning of structural retaining tissues and midface volume.',
        'Submental Platysmaplasty: Repair and midline corset plication of separated neck muscle bands.',
        'Micro-fat Grafting (Optional): Restoring structural volume depletion in the periorbital and temporal hollows.',
        'Concealed Periauricular Incisions: Incisions placed within tragal cartilage folds and behind the ear for virtually invisible scar maturation.'
      ]
    },
    candidacy: {
      overview: 'Ideal candidates are individuals in their 40s to 70s experiencing moderate to pronounced sagging along the jawline (jowls), deep marionette lines, midface descent, or loose, banded skin in the neck.',
      goodCandidates: [
        'Noticeable loss of defined jawline and presence of lower cheek jowls',
        'Deep vertical platysma banding in the neck or submental skin pooling',
        'Good general cardiovascular health and controlled blood pressure',
        'Desire for an organic, 10–12 year youthful restoration without altered facial expressions'
      ],
      carefulConsiderations: 'Patients who smoke must discontinue nicotine for at least 4 weeks pre- and post-operatively to guarantee optimal microvascular skin flap healing.'
    },
    journey: [
      {
        step: '01',
        title: '3D Facial Architecture Consultation',
        description: 'Comprehensive mapping of facial volume loss, deep structural laxity, ear anatomy, and hairline position at Shalby Hospital Mohali.'
      },
      {
        step: '02',
        title: 'Individual Pre-Operative Clearance',
        description: 'Cardiopulmonary assessment and biochemical evaluation to ensure peak surgical safety within a tertiary care hospital environment.'
      },
      {
        step: '03',
        title: 'Deep Plane Surgical Rejuvenation',
        description: 'Precise SMAS release, platysmal corset plication, and delicate multi-layer closure under uninterrupted general anesthesia.'
      },
      {
        step: '04',
        title: 'Supervised Inpatient Recovery',
        description: 'Overnight tertiary hospital stay with specialized head elevation, gentle cervical dressings, and direct monitoring by surgical nursing.'
      },
      {
        step: '05',
        title: 'Suture Removal & Gradual Unveiling',
        description: 'Fine periauricular sutures removed at Day 7 to 10. Normal public and professional engagements resume at 2 to 3 weeks.'
      }
    ],
    recovery: {
      intro: 'Recovery from a deep-plane facelift is characterized by mild tightness and numbness around the ears rather than acute pain, as deeper tissues carry less superficial sensory receptors.',
      phases: [
        {
          phase: 'Days 1 – 3',
          timeline: 'Initial healing',
          milestones: 'Light compression head dressing worn. Sleep elevated at 45 degrees. Light walking encouraged.'
        },
        {
          phase: 'Days 7 – 10',
          timeline: 'Suture management',
          milestones: 'All fine periauricular and hairline sutures removed by Dr. Sharma. Hair may be washed gently.'
        },
        {
          phase: 'Weeks 2 – 3',
          timeline: 'Social readiness',
          milestones: 'Bruising clears; 80% of edema subsides. Patients comfortably return to work and social luncheons.'
        },
        {
          phase: 'Months 2 – 4',
          timeline: 'Full tissue suppleness',
          milestones: 'Full sensation returns around preauricular skin; incision lines soften into faint, undetectable silver lines.'
        }
      ],
      guidelines: [
        'Keep neck movements gentle and avoid sudden horizontal twisting for 2 weeks.',
        'Abstain from hair dyeing or chemical treatments for 4 weeks following surgery.',
        'Apply high-potency medical SPF on incision boundaries once fully closed.'
      ],
      variabilityDisclaimer: 'Tissue elasticity, microcirculation, and individual healing predispositions influence the rate at which swelling resolves.'
    },
    faqs: [
      {
        question: 'Will a facelift make me look pulled, stretched, or unnatural?',
        answer: 'Never with a deep-plane technique. Outdated facelifts pulled the skin horizontally. Dr. Samik Sharma repositions the deep muscular SMAS layer vertically, allowing the skin to rest naturally without tension. The result looks rested, revitalized, and completely authentic to your personal identity.'
      },
      {
        question: 'How long do the rejuvenating results of a deep plane facelift last?',
        answer: 'While natural biological aging continues, a deep-plane SMAS facelift resets your facial clock by approximately 8 to 12 years. Because deeper muscular foundations were physically elevated, you will consistently appear younger than your chronological age decades into the future.'
      },
      {
        question: 'Where will the surgical incisions be located?',
        answer: 'Incisions are discreetly hidden within the natural temporal hairline, tracing the subtle curves inside the tragus of the ear, wrapping around the earlobe, and extending into the posterior retroauricular crease. Once matured, they are nearly impossible to detect even with hair tied up.'
      },
      {
        question: 'Can a neck lift be performed independently of a facelift?',
        answer: 'In younger patients whose primary complaint is isolated platysmal neck banding or hereditary submental fullness with good midface tone, an isolated neck lift with platysmaplasty is appropriate. In most patients over 50, harmonizing the lower face and neck together produces superior continuity.'
      }
    ],
    seo: {
      metaTitle: 'Facelift & Neck Lift Specialist Mohali, Chandigarh | Dr. Samik Sharma',
      metaDescription: 'Deep plane SMAS facelift and neck lift by UK-trained plastic surgeon Dr. Samik Sharma at Shalby Hospital Mohali. Natural, tension-free facial rejuvenation.',
      canonicalPath: '/treatments/facelift-neck-lift'
    }
  },

  'eyelid-surgery': {
    slug: 'eyelid-surgery',
    id: 'eyelid-surgery',
    title: 'Eyelid Surgery',
    category: 'facial',
    categoryLabel: 'Facial Aesthetics',
    tagline: 'Upper & Lower Blepharoplasty',
    heroImage: '/src/assets/images/treatment_eyelid_1794213577248.jpg',
    summary: 'Periorbital rejuvenation eliminating hooding, puffiness, and redundant skin around the eyes while preserving expressive vitality and natural almond contours.',
    indications: ['Upper eyelid skin hooding & visual fatigue', 'Lower eyelid fat herniation / bags', 'Tear trough depression', 'Fine crepey under-eye skin'],
    duration: '1.5 – 2.5 Hours',
    anesthesia: 'Twilight Sedation or General Anesthesia',
    recoverySummary: 'Fine sutures removed in 5–7 days; bruising resolves within 10–12 days.',
    clinicalApproach: 'Transconjunctival lower blepharoplasty with fat repositioning to eliminate hollows, combined with conservative upper lid skin excision that maintains a youthful eyelid crease.',
    understanding: {
      leadParagraph: 'The periorbital region is often the earliest facial zone to show signs of structural aging. Heavy upper lid skin can weigh down the eyelashes and restrict superior visual fields, while weakening orbital septa allow fat pads to herniate, forming chronic under-eye bags. Eyelid surgery (blepharoplasty) performed by Dr. Samik Sharma restores a bright, alert, and rested gaze.',
      anatomicalDepth: 'Rather than aggressively resecting fat—which creates hollow, gaunt, prematurely aged eye sockets—Dr. Sharma utilizes transconjunctival fat preservation and transposition. Lower lid fat pockets are meticulously mobilized and smoothed downward into the hollow tear trough groove, erasing dark under-eye circles without visible cutaneous incisions.',
      surgicalTechniques: [
        'Conservative Upper Blepharoplasty: Removing redundant dermatochalasis while preserving the natural supratarsal crease.',
        'Transconjunctival Lower Blepharoplasty: Accessing fat compartments from the pink inner eyelid surface to avoid external skin scars.',
        'Orbital Fat Repositioning: Sliding herniated fat pads into the tear trough depression for a seamless lid-cheek junction.',
        'Lateral Canthopexy: Supporting the lower eyelid tendon to maintain healthy tone and prevent ectropion (eyelid pulling).'
      ]
    },
    candidacy: {
      overview: 'Ideal candidates are men and women with heavy upper eyelid folds, constant tired appearance despite adequate rest, or pronounced under-eye bags and hollows.',
      goodCandidates: [
        'Dermatochalasis (redundant, sagging upper eyelid skin causing hooding)',
        'Pseudoherniation of orbital fat creating chronic lower eyelid puffiness',
        'Dry eye evaluation within safe functional limits',
        'Desire for a refreshed, rested, open-eyed appearance without changing eye shape'
      ],
      carefulConsiderations: 'Patients with thyroid eye disease (Graves’), severe dry eye syndrome, or glaucoma require pre-operative clearance by an ophthalmologist.'
    },
    journey: [
      {
        step: '01',
        title: 'Oculoplastic Evaluation',
        description: 'Detailed assessment of tear production, eyelid laxity, brow position, and orbital fat distribution at Shalby Hospital Mohali.'
      },
      {
        step: '02',
        title: 'Precision Micro-Marking',
        description: 'Meticulous caliper measurement in the upright seated position to ensure millimetric symmetry and flawless eye closure.'
      },
      {
        step: '03',
        title: 'Delicate Micro-Surgery',
        description: 'Conducted under gentle twilight sedation or general anesthesia with microsurgical instruments and high-magnification loupes.'
      },
      {
        step: '04',
        title: 'Suture Removal on Day 6',
        description: 'Hairline-fine non-absorbable sutures removed. Cold compresses are transitioned to warm packs to facilitate lymphatic clearing.'
      },
      {
        step: '05',
        title: 'Restored Periorbital Vitality',
        description: 'Complete freedom to resume computer work, driving, and social interactions with a rested, youthful eye architecture.'
      }
    ],
    recovery: {
      intro: 'Recovery from blepharoplasty is among the fastest in facial surgery. Mild tightness and temporary light sensitivity are managed easily with lubricating eye drops and cold compresses.',
      phases: [
        {
          phase: 'Days 1 – 3',
          timeline: 'Peak mild swelling',
          milestones: 'Use cold compresses 20 minutes hourly while awake. Lubricating eye drops provided. Rest eyes from bright screens.'
        },
        {
          phase: 'Days 5 – 7',
          timeline: 'Suture clearance',
          milestones: 'Fine sutures removed by Dr. Sharma. Light eye makeup permitted after Day 8.'
        },
        {
          phase: 'Days 10 – 14',
          timeline: 'Visual clarity',
          milestones: 'Subtle periorbital yellowing resolves; return to social engagements, driving, and professional meetings.'
        },
        {
          phase: 'Weeks 4 – 8',
          timeline: 'Incision maturation',
          milestones: 'Upper eyelid crease incision fades into an invisible natural eyelid fold line.'
        }
      ],
      guidelines: [
        'Avoid rubbing eyes or wearing contact lenses for 10 days post-procedure.',
        'Wear dark UV-protective sunglasses outdoors to guard sensitive healing tissues.',
        'Refrain from heavy lifting, bending over, and vigorous cardio for 2 weeks.'
      ],
      variabilityDisclaimer: 'Pre-existing skin thickness, lymphatic drainage speed, and smoking history influence recovery velocity.'
    },
    faqs: [
      {
        question: 'Will eyelid surgery change the natural shape of my eyes?',
        answer: 'No. Dr. Sharma’s conservative technique preserves your innate eye anatomy, ethnicity, and expressive warmth. The goal is to remove the fatigued, aged veil while leaving your fundamental almond eye shape completely intact.'
      },
      {
        question: 'Can blepharoplasty correct crow’s feet or dark pigmentation?',
        answer: 'Blepharoplasty primarily addresses sagging skin and fat herniation. While it dramatically reduces shadows caused by bags, dark skin pigmentation itself is treated with skin quality treatments, and active dynamic crow’s feet respond best to neuromodulators.'
      },
      {
        question: 'Will there be visible scars on my lower eyelids?',
        answer: 'For patients with fat puffiness and good skin elasticity, Dr. Sharma uses the transconjunctival approach where the incision is hidden inside the pink inner lining of the eyelid, leaving zero external scar. When excess lower skin must be removed, a delicate incision is placed just 1mm beneath the lower lash line.'
      },
      {
        question: 'Is eyelid surgery covered by medical insurance?',
        answer: 'If severe upper eyelid hooding blocks your superior peripheral visual field (confirmed via visual field testing), the upper blepharoplasty may qualify as a medically necessary procedure. Purely cosmetic procedures are self-funded.'
      }
    ],
    seo: {
      metaTitle: 'Eyelid Surgery & Blepharoplasty Mohali, Chandigarh | Dr. Samik Sharma',
      metaDescription: 'Upper and lower blepharoplasty by UK-trained plastic surgeon Dr. Samik Sharma at Shalby Hospital Mohali. Eliminate eye bags and heavy drooping lids.',
      canonicalPath: '/treatments/eyelid-surgery'
    }
  },

  'liposuction': {
    slug: 'liposuction',
    id: 'liposuction',
    title: 'Liposuction',
    category: 'body',
    categoryLabel: 'Body Contouring',
    tagline: 'High-Definition & VASER Liposculpture',
    heroImage: '/src/assets/images/treatment_liposuction_1794213577090.jpg',
    summary: 'Targeted ultrasound-assisted removal of diet-resistant adiposity, sculpting athletic muscular shadows, tapering the waistline, and refining silhouette lines.',
    indications: ['Abdominal & flank adiposity', 'Inner and outer thigh contouring', 'Male gynecomastia contouring', 'Back rolls & submental fat'],
    duration: '2 – 3.5 Hours',
    anesthesia: 'General or Regional Anesthesia (Tertiary Care Suites)',
    recoverySummary: 'Compression garment for 4–6 weeks; light activities resume in 4–5 days.',
    clinicalApproach: 'VASER ultrasound liquefaction combined with micro-cannula aspiration for minimal bruising, superior skin retraction, and precision superficial-to-deep layer sculpting.',
    understanding: {
      leadParagraph: 'Modern liposuction is not a weight-loss operation; it is an advanced form of three-dimensional anatomical sculpting. Diet and exercise reduce overall fat cell volume, but genetic predisposition often preserves stubborn localized depots along the flanks, lower abdomen, thighs, and chin. Dr. Samik Sharma employs VASER ultrasound-assisted technology to carve elegant contours.',
      anatomicalDepth: 'VASER technology emits acoustic ultrasound waves that selectively emulsify fat cells into a liquid state while leaving delicate blood vessels, nerves, and connective collagen fibers unharmed. This leads to dramatically less post-operative bruising, minimal blood loss, and enhanced dermal retraction compared to mechanical suction methods.',
      surgicalTechniques: [
        'Tumescent Solution Infiltration: Constricting local microvasculature with specialized saline and epinephrine.',
        'VASER Ultrasound Cavitation: Liquefying fibrous and deep adipose layers with microscopic sound wave energy.',
        'High-Definition Micro-Cannula Extraction: Aspiration with 2.5mm–3.5mm blunt curved cannulas following natural athletic musculature.',
        'Skin Tightening Stimulation: Thermal acoustic stimulation of subdermal fibro-septal networks to maximize post-operative skin adherence.'
      ]
    },
    candidacy: {
      overview: 'Ideal candidates are individuals within 10–15% of their target body weight who possess good skin elasticity and localized fat deposits resistant to diet and cardiovascular training.',
      goodCandidates: [
        'Stable body weight maintained for at least 6 months',
        'Localized fat deposits around flanks ("love handles"), abdomen, thighs, arms, or chin',
        'Firm, elastic skin capable of snapping back over newly contoured structural lines',
        'Commitment to maintaining a healthy lifestyle, hydration, and nutritional balance'
      ],
      carefulConsiderations: 'Patients with significant lax, stretched skin and separated abdominal muscles are better candidates for an abdominoplasty (tummy tuck) rather than isolated liposuction.'
    },
    journey: [
      {
        step: '01',
        title: '3D Silhouette Consultation',
        description: 'Comprehensive physical examination of subcutaneous versus visceral fat, skin pinch tests, and vector planning at Shalby Hospital Mohali.'
      },
      {
        step: '02',
        title: 'Standing Topographic Mapping',
        description: 'High-precision anatomical ink markings placed while standing to accurately register gravitational shadow lines and target zones.'
      },
      {
        step: '03',
        title: 'Ultrasound-Assisted Sculpting',
        description: 'VASER liquefaction and gentle micro-cannula contouring within tertiary sterile suites at Shalby Hospital.'
      },
      {
        step: '04',
        title: 'Medical Compression Fitting',
        description: 'Custom-fitted medical-grade compression garment applied immediately to control edema and optimize smooth skin adherence.'
      },
      {
        step: '05',
        title: 'Lymphatic Drainage & Milestone Care',
        description: 'Post-operative massage protocols and clinical checkups at 1 week, 1 month, and 3 months to ensure smooth, unblemished contouring.'
      }
    ],
    recovery: {
      intro: 'Recovery is characterized by muscle soreness akin to an intense athletic workout. The medical compression garment provides soothing stability during normal daily mobility.',
      phases: [
        {
          phase: 'Days 1 – 3',
          timeline: 'Acute settling',
          milestones: 'Mild fluid weeping through puncture sites. Rest with gentle walking around the home encouraged.'
        },
        {
          phase: 'Days 4 – 7',
          timeline: 'Return to routine',
          milestones: 'Desk work, driving, and light social activities resume. Showering permitted with garment off.'
        },
        {
          phase: 'Weeks 2 – 4',
          timeline: 'Compression phase',
          milestones: 'Garment worn 24/7 (except bathing). Bruising clears; dramatic waistline and contour narrowing visible.'
        },
        {
          phase: 'Months 2 – 3',
          timeline: 'Final skin retraction',
          milestones: 'Deeper internal induration softens; athletic muscular highlights and silhouette definition reach full peak.'
        }
      ],
      guidelines: [
        'Wear your medical compression garment faithfully as instructed by Dr. Sharma.',
        'Drink 2.5 to 3 liters of water daily to facilitate lymphatic clearance.',
        'Avoid high-impact aerobic exercise, sauna, and heavy weightlifting for 4 weeks.'
      ],
      variabilityDisclaimer: 'Skin tone, genetic collagen quality, volume of aspirated fat, and adherence to compression protocols influence contour finalization.'
    },
    faqs: [
      {
        question: 'Will the removed fat cells come back after liposuction?',
        answer: 'Adult humans possess a finite number of fat cells. Once removed via VASER liposuction, those specific fat cells do not regenerate. However, maintaining a stable weight through balanced nutrition and exercise is essential to keep remaining fat cells from expanding.'
      },
      {
        question: 'What is the advantage of VASER ultrasound over traditional liposuction?',
        answer: 'Traditional liposuction mechanically tears fat cells, causing higher bruising, blood loss, and longer recovery. VASER uses gentle ultrasound sound waves to selectively liquefy fat while preserving blood vessels and nerves, resulting in smoother contours and faster healing.'
      },
      {
        question: 'Will liposuction tighten loose skin on my stomach?',
        answer: 'VASER ultrasound provides noticeable subdermal skin retraction for mild skin laxity. However, if there is substantial over-stretched, folded skin or separated abdominal muscles (diastasis), an abdominoplasty (tummy tuck) will be recommended.'
      },
      {
        question: 'How much fat can be safely removed in one procedure?',
        answer: 'Patient safety is paramount. In accordance with tertiary hospital guidelines at Shalby Hospital Mohali, safe elective liposuction typically aspirates between 3 to 5 liters in a single session to safeguard fluid balance and cardiovascular stability.'
      }
    ],
    seo: {
      metaTitle: 'VASER Liposuction in Mohali & Chandigarh | Dr. Samik Sharma',
      metaDescription: 'Advanced VASER ultrasound liposuction and high-definition body contouring by Dr. Samik Sharma at Shalby Hospital Mohali. Natural athletic body sculpting.',
      canonicalPath: '/treatments/liposuction'
    }
  },

  'tummy-tuck': {
    slug: 'tummy-tuck',
    id: 'tummy-tuck',
    title: 'Tummy Tuck',
    category: 'body',
    categoryLabel: 'Body Contouring',
    tagline: 'Abdominoplasty & Diastasis Recti Repair',
    heroImage: '/src/assets/images/treatment_tummytuck_1794213592223.jpg',
    summary: 'Restoration of abdominal wall integrity, muscular plication for separated core muscles (diastasis), excess apron removal, and bespoke umbilicoplasty.',
    indications: ['Post-pregnancy abdominal laxity', 'Significant post-weight-loss redundant skin', 'Separated abdominal wall (diastasis recti)', 'Caesarean scar correction'],
    duration: '3 – 4 Hours',
    anesthesia: 'General Anesthesia (NABH Accredited Tertiary Center)',
    recoverySummary: 'Abdominal support binder for 6 weeks; desk work in 10–14 days; gym in 6–8 weeks.',
    clinicalApproach: 'Progressive tension suturing technique minimizing drain requirements, internal rectus fascia plication to cinch the waist, and low-placed bikini-line incisions.',
    understanding: {
      leadParagraph: 'Following pregnancy or significant weight loss, the abdominal wall undergoes severe anatomical changes: the rectus abdominis muscles separate vertically (diastasis recti), the supportive fascia stretches, and the skin loses its elastic recoil. An abdominoplasty (tummy tuck) performed by Dr. Samik Sharma repairs the internal muscular core and eliminates redundant overhang.',
      anatomicalDepth: 'Dr. Sharma employs a modern progressive-tension suturing approach combined with internal muscular plication. The rectus muscles are brought back together in the midline like an internal corset, flattening the abdomen and creating a tapered waistline. The low bikini incision is designed to be completely hidden beneath standard swimwear and undergarments.',
      surgicalTechniques: [
        'Internal Rectus Fascia Plication: Repairing separated six-pack core muscles to restore a flat, firm abdominal wall.',
        'Progressive Tension Sutures (PTS): Distributing tension across the deep fascia, drastically reducing seroma risk and eliminating awkward drains.',
        'Bespoke Umbilicoplasty: Sculpting an organic, vertically oval, inverted belly button with no tell-tale circular scars.',
        'Flank Lipo-Contouring: Concurrent ultrasound liposuction along the hips and flanks for a 360-degree hourglass contour.'
      ]
    },
    candidacy: {
      overview: 'Candidates are men and women with persistent lower abdominal apron skin, visible muscle bulging following pregnancy, or significant tissue overhang after bariatric weight reduction.',
      goodCandidates: [
        'Post-partum mothers with resolved childbearing plans experiencing core weakness or diastasis',
        'Individuals who achieved substantial weight loss but retain redundant lower abdominal skin folds',
        'Stable body weight close to ideal BMI for at least 6 months',
        'Realistic expectations and good general nutritional status'
      ],
      carefulConsiderations: 'Future pregnancies can stretch repaired muscles and skin; while safe, completing your family prior to undergoing a definitive abdominoplasty is strongly recommended.'
    },
    journey: [
      {
        step: '01',
        title: 'Core & Abdominal Wall Assessment',
        description: 'Physical evaluation for diastasis recti, umbilical hernia presence, skin excess, and prior surgical scars at Shalby Hospital Mohali.'
      },
      {
        step: '02',
        title: 'Precision Bikini-Line Marking',
        description: 'Individual incision design mapped precisely within your personal preferred swimwear and underwear boundaries.'
      },
      {
        step: '03',
        title: 'Tertiary Hospital Abdominoplasty',
        description: 'Performed under general anesthesia with progressive tension repair and multi-layer closure in Shalby Hospital’s sterile surgical campus.'
      },
      {
        step: '04',
        title: 'Supported Inpatient Nursing',
        description: '1 to 2 nights of comfortable inpatient recovery with calf compression pumps, pain management, and assisted mobilization.'
      },
      {
        step: '05',
        title: 'Progressive Healing Milestones',
        description: 'Transition from supportive abdominal binder to normal active life with ongoing scar therapy up to 12 months.'
      }
    ],
    recovery: {
      intro: 'Recovery requires patience during the first 10 days as abdominal core muscles settle into their tightened alignment. Walking with a slight forward flex relieves tension during early days.',
      phases: [
        {
          phase: 'Days 1 – 5',
          timeline: 'Rest & gentle ambulation',
          milestones: 'Rest at home with supportive binder. Short, frequent walks around the room to encourage circulation.'
        },
        {
          phase: 'Days 10 – 14',
          timeline: 'Standing upright',
          milestones: 'Return to comfortable vertical posture. Desk work, remote computer tasks, and driving can resume.'
        },
        {
          phase: 'Weeks 4 – 6',
          timeline: 'Binder transition',
          milestones: 'Abdominal binder discontinued. Low-impact cardiovascular training and light aerobic walking allowed.'
        },
        {
          phase: 'Weeks 8 – 12',
          timeline: 'Full core strength',
          milestones: 'Full abdominal core workouts, gym training, and swimming cleared by Dr. Sharma.'
        }
      ],
      guidelines: [
        'Wear your abdominal compression garment continuously as directed for 6 weeks.',
        'Refrain from lifting anything heavier than 5 kg (including toddlers) for the initial 4 weeks.',
        'Apply silicone scar sheets or gel once incisions are completely sealed at 3 weeks.'
      ],
      variabilityDisclaimer: 'Extent of muscle repair, skin removal volume, and individual metabolic rates dictate your exact personal recovery curve.'
    },
    faqs: [
      {
        question: 'Where will the tummy tuck scar be located, and will it be visible?',
        answer: 'The incision is placed very low on the lower abdomen, running horizontally between the hipbones well below the waistband. Dr. Sharma measures your preferred underwear or bikini styles to ensure the scar is discreetly concealed beneath your clothing.'
      },
      {
        question: 'Can a tummy tuck fix a separated post-pregnancy stomach (diastasis recti)?',
        answer: 'Yes. Repairing diastasis recti is a fundamental component of Dr. Sharma’s abdominoplasty. The abdominal rectus muscles are sutured together along the midline, eliminating the protruding "pooch" and restoring functional core stability and lower back support.'
      },
      {
        question: 'What is the difference between a full tummy tuck and a mini tummy tuck?',
        answer: 'A mini tummy tuck addresses only mild skin laxity located strictly below the belly button and does not reposition the umbilicus. A full tummy tuck addresses the entire abdominal wall—above and below the navel—with comprehensive muscle plication and belly button creation.'
      },
      {
        question: 'What happens if I become pregnant after a tummy tuck?',
        answer: 'Pregnancy after a tummy tuck is completely safe for both mother and baby. However, the expanding uterus will stretch the repaired abdominal muscles and skin, potentially diminishing some of the cosmetic improvements achieved.'
      }
    ],
    seo: {
      metaTitle: 'Tummy Tuck & Abdominoplasty Mohali, Chandigarh | Dr. Samik Sharma',
      metaDescription: 'Specialist abdominoplasty and diastasis recti repair by UK fellowship-trained surgeon Dr. Samik Sharma at Shalby Hospital Mohali. Restore a flat, toned abdomen.',
      canonicalPath: '/treatments/tummy-tuck'
    }
  },

  'hair-transplant': {
    slug: 'hair-transplant',
    id: 'hair-transplant',
    title: 'Hair Transplant',
    category: 'hair',
    categoryLabel: 'Hair Restoration',
    tagline: 'Bio-Enhanced Micro-FUE Hairline Restoration',
    heroImage: '/src/assets/images/treatment_hairtransplant_1794213578712.jpg',
    summary: 'Individual follicle unit extraction with meticulous angle, depth, and direction control to recreate a soft, undetectable frontal hairline and crown density.',
    indications: ['Male pattern androgenic alopecia', 'Receding temple points', 'Crown vertex thinning', 'Beard & eyebrow reconstruction'],
    duration: '4 – 7 Hours',
    anesthesia: 'Local Anesthesia with Gentle Sedation',
    recoverySummary: 'Crusting clears at 7–10 days; new permanent growth initiates at 3–4 months.',
    clinicalApproach: 'Motorized punch micro-FUE with sapphire blades for ultra-dense placement. Single-hair follicular units placed in irregular micro-waves for an organic, unclockable hairline.',
    understanding: {
      leadParagraph: 'A natural hair transplant requires an artistic eye for facial framing combined with microscopic surgical precision. Under Dr. Samik Sharma at Shalby Hospital Mohali, hair restoration focuses on creating natural hair direction, appropriate density gradients, and an organic hairline transition that complements your age and facial structure.',
      anatomicalDepth: 'Using Micro-Follicular Unit Extraction (Micro-FUE), individual follicular grafts containing 1, 2, or 3 hairs are harvested from the genetically resilient donor zone at the back of the scalp. Micro-incisions are created using specialized sapphire blades that preserve scalp microcirculation and ensure ultra-fine graft survival.',
      surgicalTechniques: [
        'Single-Hair Feathering: Placing exclusively single-hair units in the anterior transition zone for a soft, undetectable front edge.',
        'Sapphire Blade Recipient Sites: Ultra-clean micro-slits allowing higher graft density with minimal scalp tissue trauma.',
        'Angle & Curl Direction Alignment: Replicating the acute forward-and-downward acute angle native to natural human hair growth.',
        'Donor Zone Stewardship: Diffuse staggered extraction preventing moth-eaten or patchy thinning in the donor area.'
      ]
    },
    candidacy: {
      overview: 'Ideal candidates are men and women with genetic pattern thinning who possess adequate, healthy donor hair density along the occipital and parietal scalp regions.',
      goodCandidates: [
        'Norwood Scale 2 through 6 pattern baldness with stable donor hair reserves',
        'Receding temporal angles seeking restoration of masculine or feminine facial framing',
        'Realistic understanding of donor supply versus recipient surface area',
        'Willingness to follow post-procedure medical maintenance (e.g. PRP or medical therapies)'
      ],
      carefulConsiderations: 'Active inflammatory scalp conditions (e.g. lichen planopilaris or active alopecia areata) require medical dermatology treatment prior to any consideration of surgical restoration.'
    },
    journey: [
      {
        step: '01',
        title: 'Trichoscopic & Hairline Design Consultation',
        description: 'Microscopic analysis of donor hair density, follicle thickness, and personalized hairline sketching with Dr. Samik Sharma at Shalby Hospital Mohali.'
      },
      {
        step: '02',
        title: 'Comfortable Local Anesthesia',
        description: 'Virtually painless buffered local anesthesia administered with gentle sedation in dedicated sterile minor surgery suites.'
      },
      {
        step: '03',
        title: 'Micro-FUE Graft Harvesting',
        description: 'Precision motorized micro-punch harvesting with immediate chilling in bio-enhanced preservation solutions.'
      },
      {
        step: '04',
        title: 'Artistic Sapphire Implantation',
        description: 'Meticulous placement of individual follicular units matching natural scalp exit angles, direction, and density gradients.'
      },
      {
        step: '05',
        title: 'First Wash & Guided Growth Protocol',
        description: 'Specialized head wash demonstration at Shalby Hospital Mohali on Day 3, followed by periodic photographic growth reviews.'
      }
    ],
    recovery: {
      intro: 'Recovery is mild with virtually no debilitating pain. Patients walk out immediately following the session and return to remote work within 2 to 3 days.',
      phases: [
        {
          phase: 'Days 1 – 3',
          timeline: 'Graft anchor phase',
          milestones: 'Grafts are fragile; sleep with neck pillow. Saline spray applied every 2 hours to keep recipient zone hydrated.'
        },
        {
          phase: 'Days 7 – 10',
          timeline: 'Crust shedding',
          milestones: 'Gentle foam washing clears all tiny scabs; recipient scalp returns to normal skin appearance.'
        },
        {
          phase: 'Weeks 3 – 8',
          timeline: 'Dormancy / Shock loss',
          milestones: 'Transplanted hair shafts shed as hair bulbs enter their natural resting (telogen) phase. This is normal.'
        },
        {
          phase: 'Months 3 – 12',
          timeline: 'Active new growth',
          milestones: 'New fine hairs sprout at Month 3–4, thickening progressively into full mature density by Month 9 to 12.'
        }
      ],
      guidelines: [
        'Avoid touching, scratching, or rubbing the transplanted recipient grafts for the first 5 days.',
        'Sleep at a 30-degree incline using a travel neck pillow to prevent forehead edema.',
        'Refrain from wearing tight helmets, direct sun exposure, and strenuous exercise for 2 weeks.'
      ],
      variabilityDisclaimer: 'Hair follicle caliber, wave characteristics, and natural biological growth cycles influence final visual density.'
    },
    faqs: [
      {
        question: 'Are hair transplant results permanent?',
        answer: 'Yes. Follicles harvested from the back and sides of the scalp (the donor area) are genetically resistant to DHT (dihydrotestosterone), the hormone responsible for pattern baldness. When transplanted to the front or crown, they retain this lifelong genetic resistance.'
      },
      {
        question: 'Will my transplanted hairline look like "doll hair" or plugs?',
        answer: 'Never. Pluggy hairlines were the result of outdated 1980s punch grafts containing 10–15 hairs. Dr. Sharma uses single-hair micro-follicular units arranged in an irregular, micro-wave pattern with acute exit angles, rendering the hairline completely undetectable even upon close inspection.'
      },
      {
        question: 'Why do the transplanted hairs fall out a few weeks after surgery?',
        answer: 'This temporary phenomenon is known as "shock loss" or anagen effluvium. The hair shafts shed as the follicle enters its natural resting phase, while the living stem cell roots remain securely anchored beneath the skin. New permanent hair begins growing around month 3 to 4.'
      },
      {
        question: 'Will there be a linear scar at the back of my head?',
        answer: 'No. Dr. Sharma performs FUE (Follicular Unit Extraction), which leaves microscopic circular point marks under 0.8mm that heal into imperceptible specks easily hidden even with short clipper hairstyles (Grade 1 or 2).'
      }
    ],
    seo: {
      metaTitle: 'Micro-FUE Hair Transplant Mohali, Chandigarh | Dr. Samik Sharma',
      metaDescription: 'Natural hairline restoration and sapphire Micro-FUE hair transplant by Dr. Samik Sharma at Shalby Hospital Mohali. Natural density and artistic direction.',
      canonicalPath: '/treatments/hair-transplant'
    }
  }
};

export interface TreatmentItem {
  id: string;
  slug: string;
  title: string;
  category: 'facial' | 'body' | 'hair' | 'reconstructive';
  categoryLabel: string;
  tagline: string;
  image: string;
  heroImage?: string;
  summary: string;
  indications: string[];
  duration: string;
  anesthesia: string;
  recovery: string;
  clinicalApproach: string;
  status?: 'draft' | 'published' | 'archived';
  updatedAt?: string;
}

export const TREATMENTS_DATA: TreatmentItem[] = Object.values(TREATMENTS_DETAILED).map((t) => ({
  id: t.id,
  slug: t.slug,
  title: t.title,
  category: t.category,
  categoryLabel: t.categoryLabel,
  tagline: t.tagline,
  image: t.heroImage,
  summary: t.summary,
  indications: t.indications,
  duration: t.duration,
  anesthesia: t.anesthesia,
  recovery: t.recoverySummary,
  clinicalApproach: t.clinicalApproach,
}));

export const APPROACH_PILLARS = [
  {
    number: '01',
    title: 'Individual Assessment',
    description: 'Every anatomical plan begins with an exhaustive evaluation of your facial geometry, skeletal architecture, skin quality, and personal aesthetic objectives.',
    highlight: 'Proportion over volume'
  },
  {
    number: '02',
    title: 'Thoughtful Planning',
    description: 'We prioritize surgical restraint and structural preservation. Techniques are tailored to achieve subtle, harmonious refinement that looks native to your heritage.',
    highlight: 'Restrained elegance'
  },
  {
    number: '03',
    title: 'Patient Safety',
    description: 'Surgeries take place in NABH-accredited tertiary hospital suites at Shalby Hospital Mohali with dedicated senior anesthesiologists and HEPA-filtered modular theaters.',
    highlight: 'Tertiary-grade safety'
  },
  {
    number: '04',
    title: 'Continuity of Care',
    description: 'From pre-operative clearance through 12-month post-operative milestones, your recovery is personally monitored with scar optimization and round-the-clock clinical support.',
    highlight: 'End-to-end stewardship'
  }
];

export const PATIENT_STEPS = [
  {
    step: '01',
    title: 'In-Depth Consultation',
    desc: 'A comprehensive 45-minute clinical meeting examining medical history, anatomical nuances, and visual goals with digital photographic evaluation.'
  },
  {
    step: '02',
    title: 'Bespoke Surgical Strategy',
    desc: 'Formulation of a customized surgical plan detailing technique nuances, incision placement, anesthesia selection, and anticipated downtime.'
  },
  {
    step: '03',
    title: 'Tertiary Care Execution',
    desc: 'Performed at Shalby Hospital Mohali within state-of-the-art modular operating theatres with continuous post-anesthesia hemodynamic monitoring.'
  },
  {
    step: '04',
    title: 'Guided Recovery Concierge',
    desc: 'Personalized aftercare regime including specialized compression, lymphatic drainage guidelines, and scheduled follow-up assessments with Dr. Sharma.'
  }
];

export const CLINIC_INFO = {
  doctor: 'Dr. Samik Sharma',
  role: 'Senior Consultant – Plastic & Aesthetic Surgery',
  degrees: 'MBBS, MS (General Surgery), DrNB (Plastic Surgery)',
  fellowships: [
    'Fellowship in Advanced Cosmetic Surgery',
    'Fellowship in Facial Aesthetic Surgery, London, UK',
    'Fellowship in Plastic & Reconstructive Surgery, UK'
  ],
  hospital: 'Shalby Hospital, Mohali',
  location: 'Sector 71, Mohali, Punjab 160071, India',
  hours: 'Monday – Saturday: 10:00 AM – 5:00 PM (By Prior Appointment)',
  phone: '+91 172 503 8000',
  receptionDesk: 'Department of Plastic & Reconstructive Surgery, Shalby Hospital',
  disclaimer: 'All surgical and cosmetic procedures are medical operations carrying individualized risks. Suitability is determined strictly through personal consultation and medical evaluation.'
};

