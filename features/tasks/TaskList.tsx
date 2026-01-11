import React, { useState } from 'react';
import { Task, TaskStatus, STATUS_LABELS, STATUS_COLORS, TaskFilter } from '../../types';
import { Search, Filter, CheckCircle, Clock, Circle, Paperclip, Edit2, Trash2, Calendar, ChevronDown, MessageSquare, Send, History } from 'lucide-react';
import { StatsDashboard } from '../dashboard/StatsDashboard';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onChangeStatus: (id: string, status: TaskStatus, e: React.ChangeEvent<HTMLSelectElement>) => void;
  onAddNote: (taskId: string, content: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ 
  tasks, onEditTask, onDeleteTask, onChangeStatus, onAddNote 
}) => {
  const [filterStatus, setFilterStatus] = useState<TaskFilter>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [expandedDescIds, setExpandedDescIds] = useState<Set<string>>(new Set());
  const [quickNote, setQuickNote] = useState('');

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

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (expandedTaskId === id) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(id);
      setQuickNote('');
    }
  };

  const toggleDescription = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedDescIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSendNote = (id: string) => {
    if (quickNote.trim()) {
      onAddNote(id, quickNote);
      setQuickNote('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendNote(id);
    }
  };

  return (
    <>
      <StatsDashboard tasks={tasks} />

      <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm transition-colors duration-200">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Tìm kiếm công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter size={18} className="text-gray-400 dark:text-slate-400 hidden md:block" />
          {(['ALL', TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filterStatus === status 
                  ? 'bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-100 ring-2 ring-blue-500 ring-offset-1 dark:ring-offset-slate-800' 
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {status === 'ALL' ? 'Tất cả' : STATUS_LABELS[status]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-gray-300 dark:border-slate-700">
            <p className="text-gray-500 dark:text-slate-400">Chưa có công việc nào trong danh sách này.</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isDescExpanded = expandedDescIds.has(task.id);
            const showExpandButton = task.description && task.description.length > 60;

            return (
              <div 
                key={task.id} 
                className={`bg-white dark:bg-slate-800 rounded-2xl border shadow-sm transition-all duration-200 overflow-hidden group ${expandedTaskId === task.id ? 'border-blue-300 dark:border-blue-700 ring-1 ring-blue-200 dark:ring-blue-900' : 'border-gray-100 dark:border-slate-700/60 hover:shadow-md'}`}
              >
                <div className="p-5 flex flex-col md:flex-row gap-4 relative">
                  
                  <div className={`w-full md:w-1.5 h-1.5 md:h-auto rounded-full flex-shrink-0 ${
                    task.status === TaskStatus.DONE ? 'bg-green-500' : 
                    task.status === TaskStatus.IN_PROGRESS ? 'bg-blue-500' : 'bg-gray-300 dark:bg-slate-600'
                  }`} />

                  <div className="flex-1 space-y-3 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-slate-100 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">
                          {task.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500 dark:text-slate-400">
                          <span className="font-medium bg-gray-100 dark:bg-slate-700 px-2.5 py-1 rounded-lg text-gray-700 dark:text-slate-300">
                            {task.assignee}
                          </span>
                          <span className="flex items-center gap-1 text-xs">
                            Tạo: {new Date(task.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <select 
                          value={task.status}
                          onChange={(e) => onChangeStatus(task.id, e.target.value as TaskStatus, e)}
                          className={`appearance-none pl-9 pr-8 py-2 rounded-full text-xs font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-slate-800 ${STATUS_COLORS[task.status]}`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value={TaskStatus.TODO}>Chưa làm</option>
                          <option value={TaskStatus.IN_PROGRESS}>Đang làm</option>
                          <option value={TaskStatus.DONE}>Hoàn thành</option>
                        </select>
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                          {getStatusIcon(task.status)}
                        </div>
                        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70">
                            <ChevronDown size={14} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <p className={`text-gray-600 dark:text-slate-300 text-sm leading-relaxed ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                        {task.description}
                      </p>
                      {showExpandButton && (
                        <button
                          onClick={(e) => toggleDescription(task.id, e)}
                          className="mt-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center gap-0.5 transition-colors focus:outline-none"
                        >
                          {isDescExpanded ? 'Thu gọn' : 'Xem thêm'}
                          <ChevronDown size={14} className={`transition-transform duration-200 ${isDescExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-50 dark:border-slate-700/50 mt-2">
                      
                      <button 
                          onClick={(e) => toggleExpand(task.id, e)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                              expandedTaskId === task.id
                              ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300'
                              : 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
                          }`}
                          title="Xem và thêm ghi chú"
                      >
                          <MessageSquare size={14} />
                          <span className="text-xs font-medium">
                              {task.notes.length > 0 ? `${task.notes.length} ghi chú` : 'Ghi chú'}
                          </span>
                          <ChevronDown size={12} className={`transition-transform duration-200 ${expandedTaskId === task.id ? 'rotate-180' : ''}`} />
                      </button>

                      {task.deadline && (
                        <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full ${
                          task.deadline < Date.now() && task.status !== TaskStatus.DONE
                            ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-300'
                            : 'bg-gray-50 text-gray-600 dark:bg-slate-700 dark:text-slate-300'
                        }`}>
                          <Calendar size={14} />
                          <span>
                              Hạn: {new Date(task.deadline).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})} {new Date(task.deadline).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}

                      {task.attachments.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-slate-400 bg-gray-50 dark:bg-slate-700 px-3 py-1.5 rounded-full">
                          <Paperclip size={12} />
                          <span>{task.attachments.length} tệp</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-center justify-center gap-2 pl-0 md:pl-4 border-l-0 md:border-l border-gray-100 dark:border-slate-700/50">
                    <button 
                      onClick={() => onEditTask(task)}
                      className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => onDeleteTask(task.id)}
                      className="p-2.5 text-gray-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                      title="Xóa"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {expandedTaskId === task.id && (
                  <div className="bg-gray-50 dark:bg-slate-700/30 border-t border-gray-100 dark:border-slate-700 p-4 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-gray-700 dark:text-slate-300">
                          <History size={16} />
                          <span>Lịch sử tiến độ</span>
                      </div>
                      
                      <div className="space-y-3 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                          {task.notes.length === 0 ? (
                              <p className="text-sm text-gray-400 italic text-center py-2">Chưa có ghi chú nào. Hãy thêm ghi chú đầu tiên!</p>
                          ) : (
                              task.notes.map(note => (
                                  <div key={note.id} className="bg-white dark:bg-slate-800 p-3.5 rounded-xl border border-gray-200 dark:border-slate-600 shadow-sm">
                                      <div className="flex justify-between items-center mb-1">
                                          <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1">
                                              <Clock size={10} />
                                              {new Date(note.createdAt).toLocaleString('vi-VN')}
                                          </span>
                                      </div>
                                      <p className="text-sm text-gray-700 dark:text-slate-200 whitespace-pre-wrap">{note.content}</p>
                                  </div>
                              ))
                          )}
                      </div>

                      <div className="flex gap-2">
                          <input
                              type="text"
                              value={quickNote}
                              onChange={(e) => setQuickNote(e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, task.id)}
                              placeholder="Nhập ghi chú tiến độ mới..."
                              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 dark:placeholder-slate-500"
                              autoFocus
                          />
                          <button
                              onClick={() => handleSendNote(task.id)}
                              disabled={!quickNote.trim()}
                              className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-blue-500/20"
                          >
                              <Send size={18} />
                          </button>
                      </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </>
  );
};