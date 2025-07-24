class Todo < ApplicationRecord
  validates :title, presence: true, length: {minimum: 3, maximum: 255}
  belongs_to :User, optional: true
end