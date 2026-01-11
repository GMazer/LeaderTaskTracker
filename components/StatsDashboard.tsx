import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Task, TaskStatus, STATUS_LABELS } from '../types';
import { CheckCircle2, Clock, Circle, ListTodo } from 'lucide-react';

interface StatsDashboardProps {
  tasks: Task[];
}

const COLORS = {
  [TaskStatus.TODO]: '#9CA3AF', // Gray-400
  [TaskStatus.IN_PROGRESS]: '#3B82F6', // Blue-500
  [TaskStatus.DONE]: '#22C55E' // Green-500
};

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ tasks }) => {
  const totalTasks = tasks.length;
  
  const stats = {
    [TaskStatus.TODO]: tasks.filter(t => t.status === TaskStatus.TODO).length,
    [TaskStatus.IN_PROGRESS]: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS).length,
    [TaskStatus.DONE]: tasks.filter(t => t.status === TaskStatus.DONE).length,
  };

  const completedPercentage = totalTasks === 0 ? 0 : Math.round((stats[TaskStatus.DONE] / totalTasks) * 100);

  const data = [
    { name: STATUS_LABELS[TaskStatus.TODO], value: stats[TaskStatus.TODO], color: COLORS[TaskStatus.TODO] },
    { name: STATUS_LABELS[TaskStatus.IN_PROGRESS], value: stats[TaskStatus.IN_PROGRESS], color: COLORS[TaskStatus.IN_PROGRESS] },
    { name: STATUS_LABELS[TaskStatus.DONE], value: stats[TaskStatus.DONE], color: COLORS[TaskStatus.DONE] },
  ].filter(item => item.value > 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-between transition-colors duration-200">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-1">Tổng quan tiến độ</h3>
          <p className="text-sm text-gray-500 dark:text-slate-400">Tỷ lệ hoàn thành toàn dự án</p>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <span className="text-5xl font-bold text-gray-900 dark:text-white">{completedPercentage}%</span>
          </div>
          <div className="h-14 w-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
            <ListTodo className="text-blue-600 dark:text-blue-400" size={28} />
          </div>
        </div>
        <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 mt-6">
          <div 
            className="bg-blue-600 dark:bg-blue-500 h-3 rounded-full transition-all duration-500 shadow-lg shadow-blue-500/30" 
            style={{ width: `${completedPercentage}%` }}
          />
        </div>
      </div>

      {/* Detailed Counts */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 flex flex-col justify-center space-y-4 transition-colors duration-200">
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-transparent hover:border-gray-200 dark:hover:border-slate-600 transition-colors">
          <div className="flex items-center space-x-3">
            <Circle className="text-gray-400 dark:text-slate-400" size={20} />
            <span className="text-gray-700 dark:text-slate-200 font-medium">Chưa làm</span>
          </div>
          <span className="font-bold text-gray-900 dark:text-white px-2.5 py-0.5 bg-gray-200 dark:bg-slate-600 rounded-md text-sm">{stats[TaskStatus.TODO]}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <div className="flex items-center space-x-3">
            <Clock className="text-blue-500 dark:text-blue-400" size={20} />
            <span className="text-blue-700 dark:text-blue-300 font-medium">Đang làm</span>
          </div>
          <span className="font-bold text-blue-900 dark:text-blue-100 px-2.5 py-0.5 bg-blue-100 dark:bg-blue-800 rounded-md text-sm">{stats[TaskStatus.IN_PROGRESS]}</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-transparent hover:border-green-200 dark:hover:border-green-800 transition-colors">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="text-green-500 dark:text-green-400" size={20} />
            <span className="text-green-700 dark:text-green-300 font-medium">Hoàn thành</span>
          </div>
          <span className="font-bold text-green-900 dark:text-green-100 px-2.5 py-0.5 bg-green-100 dark:bg-green-800 rounded-md text-sm">{stats[TaskStatus.DONE]}</span>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 transition-colors duration-200 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-slate-200 mb-2">Biểu đồ trạng thái</h3>
        <div className="flex-1 min-h-[160px]">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="40%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #334155', 
                    borderRadius: '8px',
                    color: '#f8fafc',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend 
                  layout="vertical" 
                  verticalAlign="middle" 
                  align="right"
                  iconType="circle"
                  formatter={(value) => <span className="text-sm text-gray-600 dark:text-slate-300 ml-1">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-slate-500">
               <div className="w-16 h-16 rounded-full border-4 border-gray-100 dark:border-slate-700 mb-2"></div>
               <span className="text-sm">Chưa có dữ liệu</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};