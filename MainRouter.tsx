import React from 'react';
import { RouterProvider, useRouter } from './components/Router';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { FeaturesPage } from './pages/FeaturesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import App from './App';

const MainContent: React.FC = () => {
  const { path } = useRouter();

  // Route: /app -> Render the original application experience
  if (path === '/app' || path.startsWith('/app/')) {
    return <App />;
  }

  // Marketing Site Routes with Navbar & Footer
  let pageComponent = <LandingPage />;
  if (path === '/features') {
    pageComponent = <FeaturesPage />;
  } else if (path === '/about') {
    pageComponent = <AboutPage />;
  } else if (path === '/contact') {
    pageComponent = <ContactPage />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{pageComponent}</main>
      <Footer />
    </div>
  );
};

export const MainRouter: React.FC = () => {
  return (
    <RouterProvider>
      <MainContent />
    </RouterProvider>
  );
};
