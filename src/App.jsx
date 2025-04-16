import { useEffect, useState } from 'react'
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { MdDelete , MdModeEditOutline } from "react-icons/md";
import { IoMdAddCircle } from "react-icons/io";
import { CiCircleList } from "react-icons/ci";
import { BsListCheck } from "react-icons/bs";

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [editingText, setEditingText] = useState("")

  const fetchTasks = async () => {
    const snapshot = await getDocs(collection(db, "todos"))
    const tasksList = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setTasks(tasksList)
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const addTask = async () => {
    if (newTask.trim() === "") return
    await addDoc(collection(db, "todos"), {
      text: newTask,
      completed: false
    })
    setNewTask("")
    fetchTasks()
  }

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "todos", id))
    fetchTasks()
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setEditingText(task.text)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText("")
  }

  const updateTask = async (id) => {
    if (editingText.trim() === "") return
    await updateDoc(doc(db, "todos", id), {
      text: editingText
    })
    setEditingId(null)
    setEditingText("")
    fetchTasks()
  }

  const toggleTaskComplete = async (id, currentStatus) => {
    await updateDoc(doc(db, "todos", id), {
      completed: !currentStatus
    })
    fetchTasks()
  }

  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <h1 className="text-2xl font-bold text-center mb-14 font-sans">Todo List - Mr.Legend <BsListCheck className='inline'/></h1>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="کار جدید را وارد کنید..."
          className="flex-grow"
        />
        <Button onClick={addTask}><IoMdAddCircle /></Button>
      </div>

      <div className="space-y-3">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 flex justify-between items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              <Checkbox
                id={`task-${task.id}`}
                checked={task.completed}
                onCheckedChange={() => toggleTaskComplete(task.id, task.completed)}
              />
              {editingId === task.id ? (
                <Input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  className="flex-grow"
                />
              ) : (
                <label
                  htmlFor={`task-${task.id}`}
                  className={`flex-grow ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                >
                  {task.text}
                </label>
              )}
            </div>
            <div className="flex gap-2 justify-end">
              {editingId === task.id ? (
                <>
                  <Button size="sm" onClick={() => updateTask(task.id)}>ثبت</Button>
                  <Button size="sm" variant="secondary" onClick={cancelEditing}>لغو</Button>
                </>
              ) : (
                <>
                  <Button size="sm" onClick={() => startEditing(task)}><MdModeEditOutline /></Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteTask(task.id)}><MdDelete /></Button>
                </>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default App
