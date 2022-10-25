import TodoModel from "../models/TodoModel.js";

export const readTodos = async (request, response) => {
  try {
    const todos = await TodoModel.findAndCountAll({
      where: {
        is_deleted: false
      }, order: [["id", "desc"]]
    });

    return response.json({ todos: todos.rows, count: todos.count });
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

export const createTodo = async (request, response) => {
  try {
    let { shortDescription, dueDate, priority, completed } = request.body;

    if (shortDescription.replace(/\s/g, "") == "")
      return response.status(400).json("Informe a descrição da tarefa");

    if (dueDate.replace(/\s/g, "") == "") dueDate = null;

    const todo = await TodoModel.create({
      short_description: shortDescription,
      due_date: dueDate,
      priority,
      completed,
      created: Date.now()
    });

    response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

export const deleteTodo = async (request, response) => {
  try {
    if (request.params.todoId === undefined)
      return response.status(500).json('Routing server error');

    // checks if todo exists in the database or was deleted
    const todo = await TodoModel.findByPk(request.params.todoId);

    if (todo === null || todo.is_deleted == true)
      return response.status(404).json('Todo not found');

    // soft delete
    await todo.update({
      is_deleted: 1,
      modified: Date.now()
    });

    response.json({ success: 'Apagado com sucesso' })
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
}
