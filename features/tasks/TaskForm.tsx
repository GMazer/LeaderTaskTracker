import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, Note } from '../../types';
import { generateTaskSuggestion } from '../../services/geminiService';
import { X, Sparkles, Loader2, Upload, FileText, Calendar, MessageSquare, Clock } from 'lucide-react';

interface TaskFormProps {
  initialTask?: Task | null;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'projectId'> & { id?: string }) => void;
  onClose: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ initialTask, onSave, onClose }) => {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  
  // Fields that are only visible when editing or have default values
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Simulated file attachments
  const [attachments, setAttachments] = useState<{id: string, name: string, type: string}[]>([]);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setAssignee(initialTask.assignee);
      setDescription(initialTask.description);
      setStatus(initialTask.status);
      setNotes(initialTask.notes || []);
      setAttachments(initialTask.attachments || []);
      
      if (initialTask.deadline) {
        // Format timestamp to YYYY-MM-DDTHH:mm for datetime-local input
        const date = new Date(initialTask.deadline);
        // Adjust for local timezone offset to display correct time in input
        const offset = date.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(date.getTime() - offset)).toISOString().slice(0, 16);
        setDeadline(localISOTime);
      }
    }
  }, [initialTask]);

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const result = await generateTaskSuggestion(aiPrompt);
    if (result) {
      setTitle(result.title);
      setDescription(result.description);
    }
    setIsGenerating(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files).map((f: File) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: f.name,
        type: f.type
      }));
      setAttachments(prev => [...prev, ...newFiles]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert deadline string to timestamp
    const deadlineTimestamp = deadline ? new Date(deadline).getTime() : undefined;

    // Handle new note added directly in form
    let updatedNotes = [...notes];
    if (newNote.trim()) {
      updatedNotes.unshift({
        id: Math.random().toString(36).substr(2, 9),
        content: newNote,
        createdAt: Date.now()
      });
    }

    onSave({
      id: initialTask?.id,
      title,
      assignee,
      description,
      status, 
      notes: updatedNotes,
      deadline: deadlineTimestamp,
      attachments: attachments as any
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl w-full max-w-2xl flex flex-col max-h-[90vh] transition-colors duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {initialTask ? 'Cập nhật Công việc' : 'Tạo Công việc Mới'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* AI Helper Section */}
          {!initialTask && (
            <div className="mb-8 bg-purple-50 dark:bg-purple-900/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-800/50">
              <label className="block text-sm font-semibold text-purple-800 dark:text-purple-300 mb-2 flex items-center">
                <Sparkles size={16} className="mr-2 text-purple-600 dark:text-purple-400" />
                AI Hỗ trợ tạo nội dung nhanh
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ví dụ: Kiểm tra tiến độ dự án website bán hàng..."
                  className="flex-1 px-4 py-2.5 rounded-xl border border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm placeholder-gray-400 dark:placeholder-slate-500"
                />
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating || !aiPrompt}
                  className="bg-purple-600 text-white px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center font-medium text-sm"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={16} /> : 'Tạo'}
                </button>
              </div>
            </div>
          )}

          <form id="taskForm" onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Tên công việc</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Nhập tên công việc"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Người được giao</label>
                <input
                  required
                  type="text"
                  value={assignee}
                  onChange={(e) => setAssignee(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-400 dark:placeholder-slate-500"
                  placeholder="Nhập tên nhân viên"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Hạn chót (Giờ & Ngày)</label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all [color-scheme:light] dark:[color-scheme:dark]"
                  />
                  {!deadline && <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Mô tả chi tiết</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none placeholder-gray-400 dark:placeholder-slate-500"
                placeholder="Mô tả các yêu cầu của công việc..."
              />
            </div>

            {/* Only show Status fields when editing an existing task */}
            {initialTask && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300">Trạng thái tiến độ</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as TaskStatus)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value={TaskStatus.TODO}>Chưa làm</option>
                  <option value={TaskStatus.IN_PROGRESS}>Đang làm</option>
                  <option value={TaskStatus.DONE}>Hoàn thành</option>
                </select>
              </div>
            )}

            {/* Notes Section - Show History */}
            {initialTask && (
              <div className="space-y-3 bg-gray-50 dark:bg-slate-700/30 p-4 rounded-2xl border border-gray-100 dark:border-slate-600">
                <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex items-center gap-2">
                  <MessageSquare size={16} />
                  Lịch sử ghi chú & Cập nhật
                </label>
                
                <div className="max-h-40 overflow-y-auto space-y-3 custom-scrollbar mb-3">
                  {notes.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">Chưa có ghi chú nào.</p>
                  ) : (
                    notes.map((note) => (
                      <div key={note.id} className="text-sm bg-white dark:bg-slate-800 p-3 rounded-xl border border-gray-200 dark:border-slate-600">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-xs text-gray-400 dark:text-slate-400 flex items-center gap-1">
                             <Clock size={10} /> 
                             {new Date(note.createdAt).toLocaleString('vi-VN')}
                           </span>
                         </div>
                         <p className="text-gray-700 dark:text-slate-300">{note.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none placeholder-gray-400 dark:placeholder-slate-500"
                    placeholder="Thêm ghi chú mới..."
                  />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 dark:text-slate-300 flex justify-between">
                <span>Tệp đính kèm</span>
                <span className="text-xs text-gray-500 dark:text-slate-400">{attachments.length} tệp</span>
              </label>
              
              <div className="flex flex-wrap gap-2 mb-2">
                {attachments.map((file, idx) => (
                  <div key={idx} className="flex items-center bg-gray-100 dark:bg-slate-700 px-3 py-1 rounded-full text-xs text-gray-700 dark:text-slate-200 border border-gray-200 dark:border-slate-600">
                    <FileText size={12} className="mr-1" />
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <button 
                      type="button"
                      onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                      className="ml-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-full border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-4 flex flex-col items-center justify-center text-gray-500 dark:text-slate-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:border-blue-400 dark:hover:border-blue-500 transition-colors">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm">Nhấn để tải lên tệp đính kèm</span>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-slate-700 flex justify-end gap-3 bg-gray-50 dark:bg-slate-700/30 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl text-gray-700 dark:text-slate-300 font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="taskForm"
            className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all transform active:scale-95"
          >
            {initialTask ? 'Lưu thay đổi' : 'Tạo công việc'}
          </button>
        </div>
      </div>
    </div>
  );
};