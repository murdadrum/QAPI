import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ThemeToggle } from './components/ThemeToggle';
import { apiCategories } from './data/apis';
import type { ApiProject } from './data/apis';

export default function App() {
  const [selectedApi, setSelectedApi] = useState<ApiProject | null>(
    apiCategories[0].projects[0]
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="size-full flex bg-zinc-50 dark:bg-zinc-950">
      <Sidebar
        categories={apiCategories}
        selectedApi={selectedApi}
        onSelectApi={setSelectedApi}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
          <div className="lg:hidden text-lg font-semibold text-zinc-900 dark:text-white">
            AI/UX API Dashboard
          </div>
          <ThemeToggle />
        </div>
        
        {selectedApi && <Dashboard api={selectedApi} />}
      </div>
    </div>
  );
}