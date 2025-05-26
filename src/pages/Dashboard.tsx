
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar, Clock, User, Bell } from 'lucide-react';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import { useToast } from '@/hooks/use-toast';

interface User {
  email: string;
  role: string;
  name: string;
}

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

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      navigate('/');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Initialize with sample tasks
    const sampleTasks: Task[] = [
      {
        id: '1',
        title: 'Design User Interface',
        description: 'Create wireframes and mockups for the new dashboard',
        status: 'in-progress',
        priority: 'high',
        assignee: 'john@company.com',
        deadline: '2024-01-15',
        updateInterval: 2,
        lastUpdate: new Date().toISOString(),
        project: 'Dashboard Redesign'
      },
      {
        id: '2',
        title: 'Implement Authentication',
        description: 'Set up user login and registration system',
        status: 'not-started',
        priority: 'medium',
        assignee: 'jane@company.com',
        deadline: '2024-01-20',
        updateInterval: 3,
        lastUpdate: new Date().toISOString(),
        project: 'Backend Development'
      }
    ];
    setTasks(sampleTasks);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'lastUpdate'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      lastUpdate: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    toast({
      title: "Task Created",
      description: "New task has been added to the project"
    });
  };

  const updateTaskStatus = (taskId: string, status: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, lastUpdate: new Date().toISOString() }
        : task
    ));
    toast({
      title: "Task Updated",
      description: "Task status has been updated"
    });
  };

  if (!user) return null;

  const myTasks = tasks.filter(task => 
    user.role === 'admin' ? true : task.assignee === user.email
  );

  const getStatusCounts = () => {
    return {
      total: myTasks.length,
      completed: myTasks.filter(t => t.status === 'completed').length,
      inProgress: myTasks.filter(t => t.status === 'in-progress').length,
      blocked: myTasks.filter(t => t.status === 'blocked').length
    };
  };

  const statusCounts = getStatusCounts();
  const completionRate = statusCounts.total > 0 ? (statusCounts.completed / statusCounts.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">PlanX</h1>
              <Badge variant="secondary" className="ml-3">
                {user.role === 'admin' ? 'Admin' : 'Member'}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.total}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.inProgress}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.completed}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(completionRate)}%</div>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.role === 'admin' ? 'All Tasks' : 'My Tasks'}
              </h2>
              {user.role === 'admin' && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Task
                </Button>
              )}
            </div>

            <Tabs defaultValue="board" className="w-full">
              <TabsList>
                <TabsTrigger value="board">Board View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="board" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {['not-started', 'in-progress', 'blocked', 'completed'].map(status => (
                    <div key={status} className="bg-gray-100 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-3 capitalize">
                        {status.replace('-', ' ')}
                      </h3>
                      <div className="space-y-3">
                        {myTasks
                          .filter(task => task.status === status)
                          .map(task => (
                            <TaskCard 
                              key={task.id} 
                              task={task} 
                              onStatusUpdate={updateTaskStatus}
                              userRole={user.role}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <div className="space-y-4">
                  {myTasks.map(task => (
                    <TaskCard 
                      key={task.id} 
                      task={task} 
                      onStatusUpdate={updateTaskStatus}
                      userRole={user.role}
                      listView
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {user.role === 'admin' && (
                  <Button className="w-full" onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Task
                  </Button>
                )}
                <Button variant="outline" className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  Update Reminders
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Task "Design UI" completed</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>New task assigned to you</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Update reminder sent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CreateTaskModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
};

export default Dashboard;
