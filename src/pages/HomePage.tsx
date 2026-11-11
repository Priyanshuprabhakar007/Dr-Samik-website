/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Hero } from '../components/Hero';
import { AboutSection } from '../components/AboutSection';
import { TreatmentsSection } from '../components/TreatmentsSection';
import { ApproachSection } from '../components/ApproachSection';
import { PatientGuideSection } from '../components/PatientGuideSection';
import { FinalCTA } from '../components/FinalCTA';
import { TreatmentItem, TREATMENTS_DATA } from '../data/surgeryData';
import {
  getHomepageContent,
  getTreatments,
  HomepageData,
  DEFAULT_HOMEPAGE,
} from '../lib/firestoreService';

import { HomepageRenderer } from '../components/HomepageRenderer';

interface HomePageProps {
  onOpenBooking: (treatmentTitle?: string) => void;
  onSelectTreatment: (treatment: TreatmentItem) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenBooking,
  onSelectTreatment,
}) => {
  const [homepageData, setHomepageData] = useState<HomepageData>(DEFAULT_HOMEPAGE);
  const [treatments, setTreatments] = useState<TreatmentItem[]>(TREATMENTS_DATA);

  useEffect(() => {
    document.title = 'Dr. Samik Sharma | Plastic & Aesthetic Surgery, Mohali';

    // Fetch published homepage content and published treatments from Firestore
    async function loadPublishedData() {
      try {
        const [hp, tr] = await Promise.all([
          getHomepageContent('published'),
          getTreatments(false),
        ]);
        if (hp) setHomepageData(hp);
        if (tr && tr.length > 0) setTreatments(tr);
      } catch (err) {
        console.warn('Using default approved homepage data (Firestore loading note):', err);
      }
    }

    loadPublishedData();
  }, []);

  return (
    <HomepageRenderer
      homepageData={homepageData}
      treatments={treatments}
      onOpenBooking={onOpenBooking}
      onSelectTreatment={onSelectTreatment}
    />
  );
};
