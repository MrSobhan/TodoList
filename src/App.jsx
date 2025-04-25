import { useEffect, useState } from 'react'
import axios from 'axios'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MdDelete, MdModeEditOutline } from "react-icons/md"
import { IoMdAddCircle } from "react-icons/io"
import { CiCircleList } from "react-icons/ci"
import { BsListCheck } from "react-icons/bs"

export default function App() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [newProject, setNewProject] = useState("")
  const [editingProjectId, setEditingProjectId] = useState(null)
  const [editingProjectName, setEditingProjectName] = useState("")

  const baseUrl = "https://todolist-eouo.onrender.com/api";

  // https://backend-todolist-mu2e.onrender.com/api

  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${baseUrl}/projects`)
      setProjects(res.data)
    } catch (err) {
      console.error('Error fetching projects', err)
    }
  }

  const fetchTasks = async (projectId) => {
    if (!projectId) return
    try {
      const res = await axios.get(`${baseUrl}/tasks`, { params: { projectId } })
      setTasks(res.data)
    } catch (err) {
      console.error('Error fetching tasks', err)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject)
    }
  }, [selectedProject])

  const addProject = async () => {
    if (newProject.trim() === "") return
    try {
      await axios.post(`${baseUrl}/projects`, { name: newProject })
      setNewProject("")
      fetchProjects()
    } catch (err) {
      console.error('Error adding project', err)
    }
  }

  const deleteProject = async (id) => {
    try {
      await axios.delete(`${baseUrl}/projects/${id}`)
      if (selectedProject === id) setSelectedProject(null)
      fetchProjects()
    } catch (err) {
      console.error('Error deleting project', err)
    }
  }

  const startEditingProject = (proj) => {
    setEditingProjectId(proj._id)
    setEditingProjectName(proj.name)
  }

  const cancelEditingProject = () => {
    setEditingProjectId(null)
    setEditingProjectName("")
  }

  const updateProject = async (id) => {
    if (editingProjectName.trim() === "") return
    try {
      await axios.put(`${baseUrl}/projects/${id}`, { name: editingProjectName })
      cancelEditingProject()
      fetchProjects()
    } catch (err) {
      console.error('Error updating project', err)
    }
  }

  const addTask = async () => {
    if (newTask.trim() === "" || !selectedProject) return
    try {
      await axios.post(`${baseUrl}/tasks`, {
        title: newTask,
        completed: false,
        projectId: selectedProject
      })
      setNewTask("")
      fetchTasks(selectedProject)
    } catch (err) {
      console.error('Error adding task', err)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${baseUrl}/tasks/${id}`)
      fetchTasks(selectedProject)
    } catch (err) {
      console.error('Error deleting task', err)
    }
  }

  const startEditing = (task) => {
    setEditingId(task._id)
    setEditingText(task.title)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText("")
  }

  const updateTask = async (id) => {
    if (editingText.trim() === "") return
    try {
      await axios.put(`${baseUrl}/tasks/${id}`, { title: editingText })
      setEditingId(null)
      setEditingText("")
      fetchTasks(selectedProject)
    } catch (err) {
      console.error('Error updating task', err)
    }
  }

  const toggleTaskComplete = async (id, currentStatus) => {
    try {
      await axios.put(`${baseUrl}/tasks/${id}`, { completed: !currentStatus })
      fetchTasks(selectedProject)
    } catch (err) {
      console.error('Error toggling task', err)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      {!selectedProject ? (
        <>
          <h1 className="text-2xl font-bold text-center mb-8 moraba">لیست پروژه‌ها <CiCircleList className='inline' /></h1>

          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              placeholder="پروژه جدید را وارد کنید..."
              className="flex-grow"
            />
            <Button onClick={addProject}><IoMdAddCircle /></Button>
          </div>

          <div className="space-y-3">
            {projects.map(proj => (
              <Card key={proj._id} className="p-4 flex justify-between items-center">
                <div className="cursor-pointer flex-grow">
                  {editingProjectId === proj._id ? (
                    <Input value={editingProjectName} onChange={(e) => setEditingProjectName(e.target.value)} />
                  ) : (
                    <h2 className="font-semibold">{proj.name}</h2>
                  )}
                </div>
                <div className="flex gap-2">
                  {editingProjectId === proj._id ? (
                    <>
                      <Button size="sm" onClick={() => updateProject(proj._id)}>ثبت</Button>
                      <Button size="sm" variant="secondary" onClick={cancelEditingProject}>لغو</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => setSelectedProject(proj._id)}>مشاهده</Button>
                      <Button size="sm" onClick={() => startEditingProject(proj)}><MdModeEditOutline /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteProject(proj._id)}><MdDelete /></Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className='my-20 text-center'>ساخته شده با ❤️ توسط سبحان</p>
        </>
      ) : (
        <>
          <Button variant="link" onClick={() => setSelectedProject(null)}>⬅ بازگشت به پروژه‌ها</Button>
          <h1 className="text-2xl font-bold text-center mb-6 moraba">تسک‌های پروژه <BsListCheck className='inline' /></h1>

          <div className="flex gap-2 mb-4">
            <Input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="تسک جدید رو وارد کنید..."
              className="flex-grow"
            />
            <Button onClick={addTask}><IoMdAddCircle /></Button>
          </div>

          <div className="space-y-3">
            {tasks.map(task => (
              <Card key={task._id} className="p-4 flex justify-between items-center gap-2">
                <div className="flex items-center gap-2 w-full">
                  <Checkbox
                    id={`task-${task._id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTaskComplete(task._id, task.completed)}
                  />
                  {editingId === task._id ? (
                    <Input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      className="flex-grow"
                    />
                  ) : (
                    <label
                      htmlFor={`task-${task._id}`}
                      className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                  )}
                </div>
                <div className="flex gap-2 justify-end">
                  {editingId === task._id ? (
                    <>
                      <Button size="sm" onClick={() => updateTask(task._id)}>ثبت</Button>
                      <Button size="sm" variant="secondary" onClick={cancelEditing}>لغو</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => startEditing(task)}><MdModeEditOutline /></Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTask(task._id)}><MdDelete /></Button>
                    </>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <p className='my-20 text-center'>ساخته شده با ❤️ توسط سبحان</p>
        </>
      )}
    </div>
  )
}