class AddUserToTodos < ActiveRecord::Migration[7.1]
  def change
    add_reference :todos, :user, null: false, foreign_key: true
  end
end