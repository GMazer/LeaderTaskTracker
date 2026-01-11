import React from 'react';
import { LayoutGrid, Plus, Moon, Sun, ArrowLeft, Edit2 } from 'lucide-react';
import { Project } from '../../types';

interface HeaderProps {
  currentProject: Project | null;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onBack?: () => void;
  onAdd: () => void;
  onEditProject?: (e: React.MouseEvent) => void;
  addButtonLabel: string;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentProject, theme, onToggleTheme, onBack, onAdd, onEditProject, addButtonLabel 
}) => {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-30 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentProject ? (
            <>
              <button 
                onClick={onBack}
                className="p-2 -ml-2 text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-slate-600 hidden sm:block"></div>
              <div className="flex items-center gap-2 group cursor-pointer" onClick={onEditProject}>
                <div>
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {currentProject.name}
                  </h1>
                  <p className="text-xs text-gray-500 dark:text-slate-400 hidden sm:block">Quản lý công việc dự án</p>
                </div>
                <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutGrid className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Quản lý Dự án</h1>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleTheme}
            className="p-2 rounded-lg bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"
            title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button 
            onClick={onAdd}
            className={`text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-95 ${currentProject ? 'bg-blue-600 hover:bg-blue-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{addButtonLabel}</span>
          </button>
        </div>
      </div>
    </header>
  );
};