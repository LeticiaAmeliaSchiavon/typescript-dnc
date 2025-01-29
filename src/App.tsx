import { useEffect, useState } from 'react'
import './App.css'

interface TodoItem {
  id: string,
  texto: string,
  completado: boolean
}

function App() {
  const chaveTarefasMemoria = "tarefas"
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [novoTodo, setNovoTodo] = useState<string>("")
  const [estaCarregado, setEstaCarregado] = useState<boolean>(false)

  const adicionarTarefa = ():void => {
    if(novoTodo !== "") {
      const newId = crypto.randomUUID()
      const newTodoItem: TodoItem = {
        id: newId,
        texto: novoTodo,
        completado: false
      }
      setTodos([...todos, newTodoItem])
      setNovoTodo("")
    }
  }

  const removerTarefa = (id: string): void => {
    const tarefasAtualizadas = todos.filter((todo) => todo.id !== id)
    setTodos(tarefasAtualizadas)
  }

  const marcarCompleto = (id: string): void => {
    const todosAtualizados = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, completado: !todo.completado }
      }
      return todo
    })
    setTodos(todosAtualizados)
  }

  useEffect(() => {
    if(estaCarregado) {
      localStorage.setItem(chaveTarefasMemoria, JSON.stringify(todos))
    }
  }, [todos, estaCarregado])

  useEffect(() => {
    const tarefasDaMemoria = localStorage.getItem(chaveTarefasMemoria)

    if(tarefasDaMemoria) {
      setTodos(JSON.parse(tarefasDaMemoria))
    }

    setEstaCarregado(true)

  }, [])

  const obterTarefasCompletas = (): TodoItem[] => {
    return todos.filter(todo => todo.completado)
  }

  return (
    <div className='app'>
      <div className='container'>
        <h1>Lista de Tarefas - {obterTarefasCompletas().length} / {todos.length}</h1>
        <div className='input-container'>
          <input type="text" value={novoTodo} onChange={(e) => setNovoTodo(e.target.value)} />
          <button onClick={adicionarTarefa}>Adicionar tarefa</button>
        </div>
        <ol>
          {
            todos.map((todo) => (
              <li key={todo.id}>
                <input type="checkbox" checked={todo.completado} onChange={() => marcarCompleto(todo.id)} />
                <span style={{textDecoration: todo.completado ? 'line-through' : 'none'}}>{todo.texto}</span>
                <button onClick={() => removerTarefa(todo.id)}>Remover</button>
              </li>
            ))
          }
        </ol>
      </div>
    </div>
  )
}

export default App
