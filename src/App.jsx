import { useEffect, useState } from 'react'
import { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from './firebase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

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
    await addDoc(collection(db, "todos"), { text: newTask })
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

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 px-4">
      <h1 className="text-2xl font-bold text-center">📝 Todo List</h1>

      <div className="flex gap-2">
        <Input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="کار جدید..."
        />
        <Button onClick={addTask}>افزودن</Button>
      </div>

      <div className="space-y-2">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
            {editingId === task.id ? (
              <>
                <Input
                  value={editingText}
                  onChange={e => setEditingText(e.target.value)}
                  className="flex-grow"
                />
                <div className="flex gap-2 justify-end">
                  <Button size="sm" onClick={() => updateTask(task.id)}>ثبت</Button>
                  <Button size="sm" variant="secondary" onClick={cancelEditing}>لغو</Button>
                </div>
              </>
            ) : (
              <>
                <span className="text-right">{task.text}</span>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => startEditing(task)}>✏️</Button>
                  <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>🗑</Button>
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}

export default App
