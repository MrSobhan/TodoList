import { useEffect, useState } from 'react'
import { db, collection, addDoc, getDocs, deleteDoc, doc } from './firebase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

function App() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState("")

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

  return (
    <div className="max-w-md mx-auto mt-20 space-y-4 px-4">
      <h1 className="text-2xl font-bold text-center">📝 Todo List</h1>
      <div className="flex gap-2">
        <Input value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="کار جدید..." />
        <Button onClick={addTask}>افزودن</Button>
      </div>
      <div className="space-y-2">
        {tasks.map(task => (
          <Card key={task.id} className="p-4 flex justify-between items-center">
            <span>{task.text}</span>
            <Button variant="destructive" size="sm" onClick={() => deleteTask(task.id)}>🗑</Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default App
