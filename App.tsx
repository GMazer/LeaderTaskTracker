import React from 'react';
import { useAppLogic } from './hooks/useAppLogic';
import { Header } from './components/common/Header';
import { ProjectList } from './features/projects/ProjectList';
import { TaskList } from './features/tasks/TaskList';
import { ProjectForm } from './features/projects/ProjectForm';
import { TaskForm } from './features/tasks/TaskForm';

export default function App() {
  const {
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
  } = useAppLogic();

  // Derived state
  const currentProject = projects.find(p => p.id === currentProjectId) || null;
  const projectTasks = currentProjectId 
    ? tasks.filter(t => t.projectId === currentProjectId)
    : [];

  const handleAddNewTask = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleAddNewProject = () => {
    setEditingProject(null);
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-slate-200 font-sans pb-20 transition-colors duration-200">
      
      <Header 
        currentProject={currentProject}
        theme={theme}
        onToggleTheme={toggleTheme}
        onBack={() => setCurrentProjectId(null)}
        onAdd={currentProject ? handleAddNewTask : handleAddNewProject}
        onEditProject={(e) => currentProject && handleEditProject(e, currentProject)}
        addButtonLabel={currentProject ? "Thêm công việc" : "Dự án mới"}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentProject ? (
          <ProjectList 
            projects={projects}
            tasks={tasks}
            onSelectProject={setCurrentProjectId}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            onAddNew={handleAddNewProject}
          />
        ) : (
          <TaskList 
            tasks={projectTasks}
            onEditTask={(task) => {
              setEditingTask(task);
              setIsTaskModalOpen(true);
            }}
            onDeleteTask={handleDeleteTask}
            onChangeStatus={handleChangeStatus}
            onAddNote={handleAddNote}
          />
        )}
      </main>

      {/* Modal - Projects */}
      {isProjectModalOpen && (
        <ProjectForm 
          initialProject={editingProject}
          onSave={handleSaveProject} 
          onClose={() => setIsProjectModalOpen(false)} 
        />
      )}

      {/* Modal - Tasks */}
      {isTaskModalOpen && (
        <TaskForm 
          initialTask={editingTask} 
          onSave={handleSaveTask} 
          onClose={() => setIsTaskModalOpen(false)} 
        />
      )}
    </div>
  );
}