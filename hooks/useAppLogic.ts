import { useState, useEffect } from 'react';
import { Project, Task, TaskStatus, Note } from '../types';

// Mock data
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Phát triển Website Admin', description: 'Hệ thống quản lý nội bộ cho công ty', createdAt: Date.now() }
];

const MOCK_TASKS: Task[] = [
  {
    id: '1',
    projectId: 'p1',
    title: 'Thiết kế giao diện Dashboard',
    assignee: 'Nguyễn Văn A',
    description: 'Thiết kế UI/UX cho màn hình dashboard của admin, bao gồm biểu đồ thống kê.',
    status: TaskStatus.IN_PROGRESS,
    notes: [
      { id: 'n1', content: 'Đã xong wireframe, đang lên màu.', createdAt: Date.now() - 10000000 }
    ],
    attachments: [{ id: '1', name: 'wireframe_v1.png', type: 'image/png' }],
    deadline: Date.now() + 86400000 * 2,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '2',
    projectId: 'p1',
    title: 'Viết API Login',
    assignee: 'Trần Thị B',
    description: 'Xây dựng API xác thực người dùng sử dụng JWT.',
    status: TaskStatus.TODO,
    notes: [],
    attachments: [],
    deadline: Date.now() + 86400000 * 5,
    createdAt: Date.now(),
    updatedAt: Date.now()
  },
  {
    id: '3',
    projectId: 'p1',
    title: 'Kiểm thử tích hợp',
    assignee: 'Lê Văn C',
    description: 'Chạy test case cho module thanh toán.',
    status: TaskStatus.DONE,
    notes: [
      { id: 'n2', content: 'Đã pass 100% test case.', createdAt: Date.now() - 500000 }
    ],
    attachments: [{ id: '2', name: 'test_report.pdf', type: 'application/pdf' }],
    deadline: Date.now() - 86400000,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
];

export const useAppLogic = () => {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved as 'light' | 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Data State
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    let loadedTasks = saved ? JSON.parse(saved) : MOCK_TASKS;
    if (loadedTasks.length > 0 && !loadedTasks[0].projectId) {
      const defaultProjectId = projects.length > 0 ? projects[0].id : 'p1';
      loadedTasks = loadedTasks.map((t: Task) => ({ ...t, projectId: defaultProjectId }));
    }
    return loadedTasks;
  });

  // UI State
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Effects
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);

  // Handlers
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleSaveProject = (projectData: any) => {
    if (projectData.id) {
      setProjects(prev => prev.map(p => p.id === projectData.id ? { ...p, ...projectData } : p));
    } else {
      const newProject: Project = {
        ...projectData,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now()
      };
      setProjects(prev => [newProject, ...prev]);
      setCurrentProjectId(newProject.id);
    }
    setIsProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Xóa dự án sẽ xóa tất cả công việc bên trong. Bạn có chắc không?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
      setTasks(prev => prev.filter(t => t.projectId !== id));
      if (currentProjectId === id) setCurrentProjectId(null);
    }
  };

  const handleEditProject = (e: React.MouseEvent, project: Project) => {
    e.stopPropagation();
    setEditingProject(project);
    setIsProjectModalOpen(true);
  };

  const handleSaveTask = (taskData: any) => {
    if (!currentProjectId) return;
    if (taskData.id) {
      setTasks(prev => prev.map(t => t.id === taskData.id ? { ...t, ...taskData, updatedAt: Date.now() } : t));
    } else {
      const newTask: Task = {
        ...taskData,
        status: TaskStatus.TODO,
        notes: [],
        projectId: currentProjectId,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setTasks(prev => [newTask, ...prev]);
    }
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleChangeStatus = (taskId: string, newStatus: TaskStatus, e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation();
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: Date.now() } : t));
  };

  const handleAddNote = (taskId: string, content: string) => {
    if (!content.trim()) return;
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      createdAt: Date.now()
    };
    setTasks(prev => prev.map(t => t.id === taskId ? { 
      ...t, 
      notes: [newNote, ...t.notes], 
      updatedAt: Date.now() 
    } : t));
  };

  return {
    theme, toggleTheme,
    projects, currentProjectId, setCurrentProjectId,
    tasks,
    ui: {
      isTaskModalOpen, setIsTaskModalOpen,
      isProjectModalOpen, setIsProjectModalOpen,
      editingTask, setEditingTask,
      editingProject, setEditingProject
    },
    actions: {
      handleSaveProject, handleDeleteProject, handleEditProject,
      handleSaveTask, handleDeleteTask, handleChangeStatus, handleAddNote
    }
  };
};