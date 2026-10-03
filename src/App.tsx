/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { StatusBanner } from './components/StatusBanner';
import { DemoWalkthroughModal } from './components/DemoWalkthroughModal';
import { OnboardingModal } from './pages/OnboardingModal';

import { WelcomeLanding } from './pages/WelcomeLanding';
import { VoiceAssistant } from './pages/VoiceAssistant';
import { AskByText } from './pages/AskByText';
import { WeatherDashboard } from './pages/WeatherDashboard';
import { MarketPrices } from './pages/MarketPrices';
import { CropHealthDiagnostic } from './pages/CropHealthDiagnostic';
import { CropAdvisory } from './pages/CropAdvisory';
import { MyFarm } from './pages/MyFarm';
import { ConversationHistory } from './pages/ConversationHistory';
import { SavedAdvice } from './pages/SavedAdvice';
import { LanguageSettings } from './pages/LanguageSettings';
import { SettingsProfile } from './pages/SettingsProfile';
import { AboutUzhavanKural } from './pages/AboutUzhavanKural';

const AppContent: React.FC = () => {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'welcome':
        return <WelcomeLanding />;
      case 'voice':
        return <VoiceAssistant />;
      case 'text':
        return <AskByText />;
      case 'weather':
        return <WeatherDashboard />;
      case 'market':
        return <MarketPrices />;
      case 'crop-health':
        return <CropHealthDiagnostic />;
      case 'crop-guide':
        return <CropAdvisory />;
      case 'farm':
        return <MyFarm />;
      case 'history':
        return <ConversationHistory />;
      case 'saved':
        return <SavedAdvice />;
      case 'language':
        return <LanguageSettings />;
      case 'settings':
        return <SettingsProfile />;
      case 'about':
        return <AboutUzhavanKural />;
      default:
        return <WelcomeLanding />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f7f9f4] text-slate-800 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-900">
      {/* Top Banner for Demo / Offline Status */}
      <StatusBanner />

      {/* Main App Bar */}
      <Navbar />

      {/* Responsive Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar */}
        <Sidebar />

        {/* Dynamic Screen Content */}
        <main className="flex-1 overflow-x-hidden min-h-[calc(100vh-64px)]">
          {renderScreen()}
        </main>
      </div>

      {/* Mobile Thumb-Friendly Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <OnboardingModal />
      <DemoWalkthroughModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
