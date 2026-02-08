import { ChevronDown, ChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import { ApiCategory, ApiProject } from '../data/apis';

interface SidebarProps {
  categories: ApiCategory[];
  selectedApi: ApiProject | null;
  onSelectApi: (api: ApiProject) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ categories, selectedApi, onSelectApi, isOpen, onClose }: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    categories.map(c => c.id)
  );

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const getStatusColor = (status: ApiProject['status']) => {
    switch (status) {
      case 'online': return 'bg-emerald-500';
      case 'degraded': return 'bg-amber-500';
      case 'offline': return 'bg-red-500';
    }
  };

  const handleSelectApi = (api: ApiProject) => {
    onSelectApi(api);
    // Close sidebar on mobile after selection
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50
        w-80 h-full bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 
        flex flex-col transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              AI/UX API Dashboard
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {categories.reduce((sum, cat) => sum + cat.projects.length, 0)} projects
            </p>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-zinc-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {categories.map(category => {
            const isExpanded = expandedCategories.includes(category.id);
            
            return (
              <div key={category.id} className="border-b border-zinc-200 dark:border-zinc-800">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span className="font-medium text-zinc-900 dark:text-white text-left text-sm">
                    {category.name}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-zinc-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="pb-2">
                    {category.projects.map(project => (
                      <button
                        key={project.id}
                        onClick={() => handleSelectApi(project)}
                        className={`w-full px-6 py-3 flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors ${
                          selectedApi?.id === project.id
                            ? 'bg-blue-50 dark:bg-blue-950 border-l-4 border-blue-500'
                            : ''
                        }`}
                      >
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium text-zinc-900 dark:text-white">
                            {project.name}
                          </div>
                          <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                            {project.focus}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(project.status)}`} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}