class TodosRepresenter
  def initialize(todos)
    @todos = todos
  end

  def as_json
    todos.map do |todo| 
      {
        id: todo.id,
        title: todo.title,
        memo: todo.memo,
        completed: todo.completed,

      }
    end
  end

  private

  attr_reader :todos
end