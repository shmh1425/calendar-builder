import { useEffect } from 'react';
import { CalendarProvider } from './context/CalendarContext';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/layout/Header';
import { PreviewPanel } from './components/layout/PreviewPanel';
import { CustomizationSidebar } from './components/layout/CustomizationSidebar';
import { ToastContainer } from './components/ui/ToastContainer';
import { ConfirmDialog } from './components/ui/ConfirmDialog';

function AppContent() {
  const { locale, theme } = useApp();

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [locale, theme]);

  return (
    <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950">
      <Header />
      <div className="flex min-h-0 flex-1 flex-col-reverse lg:flex-row">
        <div className="h-[45vh] shrink-0 lg:h-auto lg:w-[380px] lg:shrink-0 xl:w-[420px]">
          <CustomizationSidebar />
        </div>
        <PreviewPanel />
      </div>
      <ToastContainer />
      <ConfirmDialog />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <CalendarProvider>
        <AppContent />
      </CalendarProvider>
    </AppProvider>
  );
}

export default App;
