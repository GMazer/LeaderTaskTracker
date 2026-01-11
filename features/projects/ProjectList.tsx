import React from 'react';
import { Project, Task, TaskStatus } from '../../types';
import { Folder, Edit2, Trash2, CheckCircle, Circle } from 'lucide-react';

interface ProjectListProps {
  projects: Project[];
  tasks: Task[];
  onSelectProject: (id: string) => void;
  onEditProject: (e: React.MouseEvent, project: Project) => void;
  onDeleteProject: (e: React.MouseEvent, id: string) => void;
  onAddNew: () => void;
}

export const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, tasks, onSelectProject, onEditProject, onDeleteProject, onAddNew 
}) => {
  const getProjectStats = (pid: string) => {
    const pTasks = tasks.filter(t => t.projectId === pid);
    const total = pTasks.length;
    const completed = pTasks.filter(t => t.status === TaskStatus.DONE).length;
    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, percent };
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
        <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
          <Folder className="text-gray-400 dark:text-slate-400" size={32} />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Chưa có dự án nào</h3>
        <p className="text-gray-500 dark:text-slate-400 mt-1 mb-6">Bắt đầu bằng cách tạo dự án đầu tiên của bạn</p>
        <button 
          onClick={onAddNew}
          className="text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300"
        >
          + Tạo dự án mới
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => {
        const stats = getProjectStats(project.id);
        return (
          <div 
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer group flex flex-col relative"
          >
            <div className="p-6 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-3 rounded-xl group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/50 transition-colors">
                  <Folder className="text-indigo-600 dark:text-indigo-400" size={24} />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => onEditProject(e, project)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Chỉnh sửa dự án"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={(e) => onDeleteProject(e, project.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Xóa dự án"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors">
                {project.name}
              </h3>
              <p className="text-gray-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                {project.description}
              </p>
            </div>
            
            <div className="px-6 pb-6 pt-0">
              <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-2">
                <span>Tiến độ</span>
                <span className="font-semibold text-gray-800 dark:text-slate-200">{stats.percent}%</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${stats.percent}%` }}
                />
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} className="text-green-500 dark:text-green-400"/>
                  <span>{stats.completed} hoàn thành</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Circle size={16} className="text-gray-400 dark:text-slate-500"/>
                  <span>{stats.total} task</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};