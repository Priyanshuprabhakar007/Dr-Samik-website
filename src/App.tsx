/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { TreatmentsPage } from './pages/TreatmentsPage';
import { TreatmentDetailPage } from './pages/TreatmentDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ConsultationModal } from './components/ConsultationModal';
import { TreatmentDetailModal } from './components/TreatmentDetailModal';
import { TreatmentItem } from './data/surgeryData';
import { AnimatePresence } from 'motion/react';

// Firebase Auth Context Provider
import { AuthProvider } from './context/AuthContext';

// Admin CMS Panel
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { HomepageManagerPage } from './pages/admin/HomepageManagerPage';
import { AboutManagerPage } from './pages/admin/AboutManagerPage';
import { TreatmentManagerPage } from './pages/admin/TreatmentManagerPage';
import { AppointmentManagerPage } from './pages/admin/AppointmentManagerPage';
import { BlogManagerPage } from './pages/admin/BlogManagerPage';
import { MediaLibraryPage } from './pages/admin/MediaLibraryPage';
import { SettingsPage } from './pages/admin/SettingsPage';

interface PublicLayoutProps {
  children: React.ReactNode;
  onOpenBooking: (treatmentTitle?: string) => void;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children, onOpenBooking }) => {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-[#F6F0E9] flex flex-col font-sans selection:bg-[#C9A47F]/30 selection:text-[#F6F0E9] relative">
      <Header onOpenBooking={() => onOpenBooking()} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedTreatmentForBooking, setSelectedTreatmentForBooking] = useState<string | undefined>(undefined);
  const [activeTreatmentDetail, setActiveTreatmentDetail] = useState<TreatmentItem | null>(null);

  const handleOpenBooking = (treatmentTitle?: string) => {
    setSelectedTreatmentForBooking(treatmentTitle);
    setBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setBookingModalOpen(false);
    setSelectedTreatmentForBooking(undefined);
  };

  const handleSelectTreatment = (treatment: TreatmentItem) => {
    setActiveTreatmentDetail(treatment);
  };

  const handleCloseTreatmentDetail = () => {
    setActiveTreatmentDetail(null);
  };

  const handleBookFromTreatmentDetail = (treatmentTitle: string) => {
    setActiveTreatmentDetail(null);
    handleOpenBooking(treatmentTitle);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route
            path="/"
            element={
              <PublicLayout onOpenBooking={handleOpenBooking}>
                <HomePage
                  onOpenBooking={handleOpenBooking}
                  onSelectTreatment={handleSelectTreatment}
                />
              </PublicLayout>
            }
          />
          <Route
            path="/treatments"
            element={
              <PublicLayout onOpenBooking={handleOpenBooking}>
                <TreatmentsPage onOpenBooking={handleOpenBooking} />
              </PublicLayout>
            }
          />
          <Route
            path="/treatments/:slug"
            element={
              <PublicLayout onOpenBooking={handleOpenBooking}>
                <TreatmentDetailPage onOpenBooking={handleOpenBooking} />
              </PublicLayout>
            }
          />
          <Route
            path="/blog"
            element={
              <PublicLayout onOpenBooking={handleOpenBooking}>
                <BlogPage onOpenBooking={() => handleOpenBooking()} />
              </PublicLayout>
            }
          />
          <Route
            path="/blog/:slug"
            element={
              <PublicLayout onOpenBooking={handleOpenBooking}>
                <BlogDetailPage onOpenBooking={handleOpenBooking} />
              </PublicLayout>
            }
          />

          {/* Admin Authentication */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Protected Admin CMS Panel */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="homepage" element={<HomepageManagerPage />} />
            <Route path="about" element={<AboutManagerPage />} />
            <Route path="treatments" element={<TreatmentManagerPage />} />
            <Route path="appointments" element={<AppointmentManagerPage />} />
            <Route path="blog" element={<BlogManagerPage />} />
            <Route path="media" element={<MediaLibraryPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Interactive Booking / Consultation Modal */}
        <AnimatePresence>
          {bookingModalOpen && (
            <ConsultationModal
              isOpen={bookingModalOpen}
              onClose={handleCloseBooking}
              initialTreatment={selectedTreatmentForBooking}
            />
          )}
        </AnimatePresence>

        {/* Interactive Treatment Detail Quick Modal */}
        <AnimatePresence>
          {activeTreatmentDetail && (
            <TreatmentDetailModal
              treatment={activeTreatmentDetail}
              onClose={handleCloseTreatmentDetail}
              onBookTreatment={handleBookFromTreatmentDetail}
            />
          )}
        </AnimatePresence>
      </BrowserRouter>
    </AuthProvider>
  );
}
