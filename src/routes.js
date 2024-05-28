import { randomUUID } from "node:crypto";
import { Database } from "./database.js";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {

      const { search } = req.query
      const tasks = database.select('tasks', search ? {
        title: search,
        description: search
      } : null)

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { title, description } = req.body;
      const currentTime = new Date().toLocaleString()

      const task = {
        id: randomUUID(),
        title,
        description,
        created_at: currentTime,
        updated_at: currentTime,
        completed_at: null,
      }

      database.insert('tasks', task)

      return res.writeHead(201).end("created")
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const { title, description } = req.body

      console.log(req.body, id, "my body")

      if (!title && !description) {
        console.log("entrou?")
        return res.writeHead(400).end(JSON.stringify({ message: 'title or description are required' }))
      }

      const task = database.select('tasks', id)
      console.log("ela", task)

      if (!task) {

        return res.writeHead(404).end("tarefa nao encontrada")
      }


      database.update('tasks', id, {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date().toLocaleString(),
      })

      return res.writeHead(204).end()
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const { id } = req.params

      const [task] = database.select('tasks', { id })

      if (!task) {
        return res.writeHead(404).end()
      }

      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const { id } = req.params

      const task = database.select('tasks', id)
      console.log("ela", task)

      if (!task) {

        return res.writeHead(404).end("tarefa nao encontrada")
      }
      
      database.update('tasks', id, {
        ...task,
        completed_at: new Date().toLocaleString(),
      })
    }
  }

]