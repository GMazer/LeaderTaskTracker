import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, FolderPlus, FolderPen } from 'lucide-react';

interface ProjectFormProps {
  initialProject?: Project | null;
  onSave: (project: Omit<Project, 'id' | 'createdAt'> & { id?: string }) => void;
  onClose: () => void;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ initialProject, onSave, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialProject) {
      setName(initialProject.name);
      setDescription(initialProject.description);
    }
  }, [initialProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      id: initialProject?.id,
      name, 
      description 
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md flex flex-col transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {initialProject ? <FolderPen className="text-blue-600 dark:text-blue-400" /> : <FolderPlus className="text-blue-600 dark:text-blue-400" />}
            {initialProject ? 'Cập nhật Dự án' : 'Tạo Dự án Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>

        <form id="projectForm" onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Tên dự án</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
              placeholder="Ví dụ: Website E-commerce"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Mô tả</label>
            <textarea
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-slate-500"
              placeholder="Mô tả ngắn về dự án..."
            />
          </div>
        </form>

        <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-700/30 rounded-b-2xl">
          <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
            Hủy
          </button>
          <button
            type="submit"
            form="projectForm"
            className="px-6 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all transform active:scale-95"
          >
            {initialProject ? 'Lưu thay đổi' : 'Tạo dự án'}
          </button>
        </div>
      </div>
    </div>
  );
};