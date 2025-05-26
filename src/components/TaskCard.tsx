
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'blocked' | 'completed';
  priority: 'low' | 'medium' | 'high';
  assignee: string;
  deadline: string;
  updateInterval: number;
  lastUpdate: string;
  project: string;
}

interface TaskCardProps {
  task: Task;
  onStatusUpdate: (taskId: string, status: Task['status']) => void;
  userRole: string;
  listView?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusUpdate, userRole, listView = false }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'blocked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getNextUpdateTime = () => {
    const lastUpdate = new Date(task.lastUpdate);
    const nextUpdate = new Date(lastUpdate.getTime() + task.updateInterval * 60 * 60 * 1000);
    return nextUpdate;
  };

  const isUpdateDue = () => {
    return new Date() >= getNextUpdateTime();
  };

  if (listView) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
                <h3 className="font-semibold text-gray-900">{task.title}</h3>
                <Badge variant="outline" className={getStatusColor(task.status)}>
                  {task.status.replace('-', ' ')}
                </Badge>
                {isUpdateDue() && (
                  <Badge variant="destructive">Update Due</Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                <span className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  Due: {formatDate(task.deadline)}
                </span>
                <span className="flex items-center">
                  <User className="h-3 w-3 mr-1" />
                  {task.assignee}
                </span>
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Updates every {task.updateInterval}h
                </span>
              </div>
            </div>
            <div className="ml-4">
              <Select 
                value={task.status} 
                onValueChange={(value) => onStatusUpdate(task.id, value as Task['status'])}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`}></div>
            <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
          </div>
          {isUpdateDue() && (
            <Badge variant="destructive" className="text-xs">
              Update Due
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          {task.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Due: {formatDate(task.deadline)}</span>
            </div>
            <div className="flex items-center space-x-1 mt-1">
              <Clock className="h-3 w-3" />
              <span>Updates every {task.updateInterval}h</span>
            </div>
          </div>
          
          <Select 
            value={task.status} 
            onValueChange={(value) => onStatusUpdate(task.id, value as Task['status'])}
          >
            <SelectTrigger className="w-full text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-started">Not Started</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
