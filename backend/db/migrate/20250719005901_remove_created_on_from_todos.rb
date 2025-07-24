class RemoveCreatedOnFromTodos < ActiveRecord::Migration[7.1]
  def change
    remove_column :todos, :created_on, :datetime
  end
end