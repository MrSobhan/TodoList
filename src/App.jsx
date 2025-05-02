import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { AiOutlinePlusCircle, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { CiCircleList } from "react-icons/ci";
import { BsListCheck } from "react-icons/bs";
import { TbSubtask } from "react-icons/tb";
import Loader from "./components/Loader/Loader";

export default function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newProject, setNewProject] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProjectName, setEditingProjectName] = useState("");
  const [loader, setLoader] = useState(true);

  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const baseUrl = "https://todolist-eouo.onrender.com/api";

  setTimeout(() => {
    setLoader(false)
  }, 2000);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseUrl}/projects`);
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects", err);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      const res = await axios.get(`${baseUrl}/tasks`, {
        params: { projectId },
      });
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchTasks(selectedProject);
  }, [selectedProject]);


  const addProject = async () => {
    if (!newProject.trim()) return;
    await axios.post(`${baseUrl}/projects`, { name: newProject });
    setNewProject("");
    fetchProjects();
  };
  const deleteProject = async (id) => {
    await axios.delete(`${baseUrl}/projects/${id}`);
    if (selectedProject === id) setSelectedProject(null);
    fetchProjects();
  };
  const startEditingProject = (proj) => {
    setEditingProjectId(proj._id);
    setEditingProjectName(proj.name);
  };
  const cancelEditingProject = () => {
    setEditingProjectId(null);
    setEditingProjectName("");
  };
  const updateProject = async (id) => {
    if (!editingProjectName.trim()) return;
    await axios.put(`${baseUrl}/projects/${id}`, { name: editingProjectName });
    cancelEditingProject();
    fetchProjects();
  };


  const addTask = async () => {
    if (!newTask.trim() || !selectedProject) return;
    await axios.post(`${baseUrl}/tasks`, {
      title: newTask,
      completed: false,
      projectId: selectedProject,
    });
    setNewTask("");
    fetchTasks(selectedProject);
  };
  const deleteTask = async (id) => {
    await axios.delete(`${baseUrl}/tasks/${id}`);
    fetchTasks(selectedProject);
  };
  const startEditing = (task) => {
    setEditingId(task._id);
    setEditingText(task.title);
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditingText("");
  };
  const updateTask = async (id) => {
    if (!editingText.trim()) return;
    await axios.put(`${baseUrl}/tasks/${id}`, { title: editingText });
    setEditingId(null);
    setEditingText("");
    fetchTasks(selectedProject);
  };
  const toggleTaskComplete = async (id, currentStatus) => {
    await axios.put(`${baseUrl}/tasks/${id}`, { completed: !currentStatus });
    fetchTasks(selectedProject);
  };

  return (
    <>
      {
        loader ? <Loader /> : (
          <div className="min-h-screen relative overflow-hidden bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 flex flex-col">
            <div className="max-w-md mx-auto mt-16 px-4 flex-grow">
              {!selectedProject ? (
                <>
                  <h1 className="text-2xl font-bold text-center mb-8">
                    لیست پروژه‌ها <CiCircleList className="inline" />
                  </h1>

                  <div className="flex gap-2 mb-4">
                    <Input
                      placeholder="پروژه جدید را وارد کنید..."
                      value={newProject}
                      onChange={(e) => setNewProject(e.target.value)}
                      className="flex-grow bg-white dark:bg-gray-800"
                    />
                    <Button
                      onClick={addProject}
                      variant="ghost"
                      className="text-purple-500 dark:bg-gray-800"
                    >
                      <AiOutlinePlusCircle size={24} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <Card
                        key={proj._id}
                        className="p-4 min-w-[350px] flex justify-between items-center bg-white dark:bg-gray-800"
                      >
                        <div className="flex-grow">
                          {editingProjectId === proj._id ? (
                            <Input
                              value={editingProjectName}
                              onChange={(e) => setEditingProjectName(e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700"
                            />
                          ) : (
                            <h2 className="font-semibold">{proj.name}</h2>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingProjectId === proj._id ? (
                            <>
                              <Button size="sm" onClick={() => updateProject(proj._id)}>
                                ثبت
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={cancelEditingProject}
                              >
                                لغو
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedProject(proj._id)}
                              >
                                <TbSubtask size={20} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditingProject(proj)}
                              >
                                <AiOutlineEdit size={20} />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteProject(proj._id)}
                              >
                                <AiOutlineDelete size={20} />
                              </Button>
                            </>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="link"
                    onClick={() => setSelectedProject(null)}
                    className="mb-4"
                  >
                    ← بازگشت به پروژه‌ها
                  </Button>
                  <h1 className="text-2xl font-bold text-center mb-6">
                    تسک‌های پروژه <BsListCheck className="inline" />
                  </h1>

                  <div className="flex gap-2 mb-4 min-w-[350px]">
                    <Input
                      placeholder="تسک جدید را وارد کنید..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="flex-grow bg-white dark:bg-gray-800"
                    />
                    <Button
                      onClick={addTask}
                      variant="ghost"
                      className="text-purple-500 dark:bg-gray-800"
                    >
                      <AiOutlinePlusCircle size={24} />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <Card
                        key={task._id}
                        className="p-4 flex justify-between items-center bg-white dark:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() =>
                              toggleTaskComplete(task._id, task.completed)
                            }
                          />
                          {editingId === task._id ? (
                            <Input
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              className="bg-gray-50 dark:bg-gray-700 flex-grow"
                            />
                          ) : (
                            <span
                              className={`flex-grow ${task.completed
                                ? "line-through text-gray-400 dark:text-gray-600"
                                : ""
                                }`}
                            >
                              {task.title}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {editingId === task._id ? (
                            <>
                              <Button size="sm" onClick={() => updateTask(task._id)}>
                                ثبت
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={cancelEditing}
                              >
                                لغو
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => startEditing(task)}
                              >
                                <AiOutlineEdit size={20} />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteTask(task._id)}
                              >
                                <AiOutlineDelete size={20} />
                              </Button>
                            </>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>


            <div className="hidden md:block h-[500px] w-[500px] blur-[40px] rounded-full bg-gradient-to-t from-purple-300 to-transparent absolute -right-28 -bottom-28" />
          </div>
        )
      }
    </>

  );
}
