/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Hero } from './Hero';
import { AboutSection } from './AboutSection';
import { TreatmentsSection } from './TreatmentsSection';
import { ApproachSection } from './ApproachSection';
import { PatientGuideSection } from './PatientGuideSection';
import { FinalCTA } from './FinalCTA';
import { TreatmentItem } from '../data/surgeryData';
import { HomepageData, DEFAULT_HOMEPAGE } from '../lib/firestoreService';

export interface HomepageRendererProps {
  homepageData: HomepageData;
  treatments: TreatmentItem[];
  onOpenBooking?: (treatmentTitle?: string) => void;
  onSelectTreatment?: (treatment: TreatmentItem) => void;
}

export const HomepageRenderer: React.FC<HomepageRendererProps> = ({
  homepageData,
  treatments,
  onOpenBooking = () => {},
  onSelectTreatment = () => {},
}) => {
  const visibility = homepageData.sectionVisibility || DEFAULT_HOMEPAGE.sectionVisibility || {};
  const order = homepageData.sectionsOrder && homepageData.sectionsOrder.length > 0
    ? homepageData.sectionsOrder
    : ['hero', 'aboutPreview', 'treatments', 'approach', 'patientGuide', 'finalCta'];

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        if (visibility.hero === false) return null;
        return (
          <Hero
            key="hero"
            onOpenBooking={() => onOpenBooking()}
            heroData={homepageData.hero}
          />
        );

      case 'aboutPreview':
        if (visibility.aboutPreview === false) return null;
        return (
          <AboutSection
            key="aboutPreview"
            onOpenBooking={() => onOpenBooking()}
            data={homepageData.aboutPreview}
          />
        );

      case 'treatments':
        if (visibility.treatments === false) return null;
        return (
          <TreatmentsSection
            key="treatments"
            onSelectTreatment={onSelectTreatment}
            onOpenBooking={onOpenBooking}
            treatments={treatments}
            sectionData={homepageData.treatmentsShowcase}
          />
        );

      case 'approach':
        if (visibility.approach === false) return null;
        return (
          <ApproachSection
            key="approach"
            onOpenBooking={() => onOpenBooking()}
            data={homepageData.approach}
          />
        );

      case 'patientGuide':
        if (visibility.patientGuide === false) return null;
        return (
          <PatientGuideSection
            key="patientGuide"
            onOpenBooking={() => onOpenBooking()}
          />
        );

      case 'finalCta':
        if (visibility.finalCta === false) return null;
        return (
          <FinalCTA
            key="finalCta"
            onOpenBooking={() => onOpenBooking()}
            data={homepageData.finalCta}
          />
        );

      default:
        return null;
    }
  };

  return <>{order.map((key) => renderSection(key))}</>;
};
