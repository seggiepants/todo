class TodoRepresenter
  def initialize(todo)
    @todo = todo
  end

  def as_json
    {
      id: @todo.id,
      title: @todo.title,
      memo: @todo.memo,
      completed: @todo.completed,
    }
  end

  private

  attr_reader :todos
end