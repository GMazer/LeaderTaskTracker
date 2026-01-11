import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS, TaskFilter } from '../../types';
import { Search, Filter, CheckCircle, Clock, Circle, Paperclip, AlertCircle, Edit2, Trash2, Calendar, ChevronDown } from 'lucide-react';
import { StatsDashboard } from '../dashboard/StatsDashboard';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onToggleConfirm: (id: string, e: React.MouseEvent) => void;
  onChangeStatus: (id: string, status: TaskStatus, e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, onEditTask, onDeleteTask, onToggleConfirm, onChangeStatus 
}) => {
  const [filterStatus, setFilterStatus] = useState<TaskFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'ALL' || task.status === filterStatus;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusIcon = (status: TaskStatus) => {
    switch(status) {
      case TaskStatus.DONE: return <CheckCircle size={16} className="text-green-600 dark:text-green-400" />;
      case TaskStatus.IN_PROGRESS: return <Clock size={16} className="text-blue-600 dark:text-blue-400" />;
      default: return <Circle size={16} className="text-gray-400 dark:text-slate-500" />;
    }
  };

  return (
    <>
      {/* Statistics Section */}
      <StatsDashboard tasks={tasks} />

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={18} className="text-gray-400 hidden md:block" />
          {(['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200 ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      {/* Task List Rendering */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
            <p className="text-gray-500 dark:text-slate-400">Chưa có công việc nào trong danh sách này.</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group"
            >
              <div className="p-5 flex flex-col md:flex-row gap-4">
                
                {/* Status Indicator Bar */}
                <div className={`w-full md:w-1.5 h-1.5 md:h-auto rounded-full ${
                  task.status === TaskStatus.DONE ? 'bg-green-500' : 
                  task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'
                }`} />

                {/* Main Content */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                        {task.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-slate-400">
                        <span className="font-medium bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-700 dark:text-slate-300">
                          {task.assignee}
                        </span>
                        <span className="flex items-center gap-1 text-xs">
                          Ngày tạo: {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Interactive Status Badge */}
                    <div className="relative">
                      <select 
                        value={task.status}
                        onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus, e)}
                        className={`appearance-none pl-8 pr-8 py-1.5 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-800 ${STATUS_COLORS[task.status]}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value={TaskStatus.TODO}>Chưa làm</option>
                        <option value={TaskStatus.IN_PROGRESS}>Đang làm</option>
                        <option value={TaskStatus.DONE}>Hoàn thành</option>
                      </select>
                      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                        {getStatusIcon(task.status)}
                      </div>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-60">
                          <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-slate-300 text-sm line-clamp-2">{task.description}</p>

                  {/* Meta Info */}
                  <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-gray-50 dark:border-slate-700 mt-2">
                    
                    {/* Interactive Confirmation */}
                    <button 
                      onClick={(e) => onToggleConfirm(task.id, e)}
                      className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${
                        task.isConfirmed 
                          ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/50' 
                          : 'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50'
                      }`}
                      title={task.isConfirmed ? "Nhấn để hủy xác nhận" : "Nhấn để xác nhận"}
                    >
                      {task.isConfirmed ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                      <span className="text-xs font-medium">{task.isConfirmed ? 'Đã xác nhận' : 'Chưa xác nhận'}</span>
                    </button>

                    {/* Deadline Display */}
                    {task.deadline && (
                      <div className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded ${
                        task.deadline < Date.now() && task.status !== TaskStatus.DONE
                          ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                          : 'bg-gray-50 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        <Calendar size={14} />
                        <span>Hạn: {new Date(task.deadline).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}

                    {task.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 px-2 py-1 rounded">
                        <Paperclip size={12} />
                        <span>{task.attachments.length} tệp</span>
                      </div>
                    )}

                    {task.progressNotes && (
                      <div className="text-xs text-gray-500 dark:text-slate-400 italic flex-1 truncate">
                        Ghi chú: "{task.progressNotes}"
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex md:flex-col items-center justify-center gap-2 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100 dark:border-slate-700">
                  <button 
                    onClick={() => onEditTask(task)}
                    className="p-2 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDeleteTask(task.id)}
                    className="p-2 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};