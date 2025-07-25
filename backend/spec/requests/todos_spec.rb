require 'rails_helper'

describe 'Todos API', type: :request do
  before do
    @user = FactoryBot.create(:user, username: 'sgray', password: 'password')    
  end
  describe 'GET /books' do
    before do
      @todo1 = FactoryBot.create(:todo, title: 'Go for a walk', memo: 'The fresh air will do you some good', completed: false, user_id: @user.id)
      @todo2 = FactoryBot.create(:todo, title: 'Eat lunch', memo: 'How about a nice glass of OJ?', completed: true, user_id: @user.id)
    end
    it 'returns all todos' do
      get '/api/v1/todos', headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }

      expect(response).to have_http_status(:success)
      expect(response_body.size).to eq(2)
      expect(response_body['todos']).to eq(
        [{
          'id' => @todo1.id,
          'title' => 'Go for a walk',
          'memo' => 'The fresh air will do you some good',
          'completed' => false
        }, 
        {
          'id' => @todo2.id,
          'title' => 'Eat lunch',
          'memo' => 'How about a nice glass of OJ?',
          'completed' => true
        }]
      )
    end

    it 'returns a subset of books based on limit' do
      get '/api/v1/todos', params: {limit: 1}, headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }
      expect(response).to have_http_status(:success)
      expect(response_body['todos'].size).to eq(1)
      expect(response_body['todos']).to eq(
        [{
          'id' => @todo1.id,
          'title' => 'Go for a walk',
          'memo' => 'The fresh air will do you some good',
          'completed' => false
        }])
    end

    it 'returns a subset of books based on limit and offset' do
      get '/api/v1/todos', params: {limit: 1, offset: 1}, headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }

      expect(response).to have_http_status(:success)
      expect(response_body['todos'].size).to eq(1)
      expect(response_body['todos']).to eq(
        [{
          'id' => @todo2.id,
          'title' => 'Eat lunch',
          'memo' => 'How about a nice glass of OJ?',
          'completed' => true
        }])        
    end

  end

  describe 'POST /todos' do
    it 'creates a new todo' do
      expect {
        post '/api/v1/todos', params: { 
          todo: { 
            title: 'Pay your bills', 
            memo: 'Pay the bills already.', 
            completed: false
          }
        }, headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }
      }.to change { Todo.count }.from(0).to(1)
      expect(response).to have_http_status(:created)
      todo = Todo.find_by(title: 'Pay your bills')
      expect(JSON.parse(response.body)).to eq(
        {
          'id' => todo.id,
          'title' => 'Pay your bills',
          'memo' => 'Pay the bills already.',
          'completed' => false
        }
      )
    end
  end

  describe 'DELETE /todos/:id' do
    let!(:todo) {FactoryBot.create(:todo, title: 'Go for a walk', memo: 'The fresh air will do you some good', completed: false, user_id: @user.id)}
    it 'deletes a todo' do
      expect {
        # string interpolation requires double quotes strings
        delete "/api/v1/todos/#{todo.id}", headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" } 
      }.to change { Todo.count }.from(1).to(0)

      expect(response).to have_http_status(:no_content)
    end
  end

  describe 'PUT /todos/:index/complete' do
    let!(:todo) {FactoryBot.create(:todo, title: 'Test marking complete', memo: 'This should go from fals to true', completed: false, user_id: @user.id)}
    it 'toggles a todo complete ' do
      put "/api/v1/todos/#{todo.id}/complete", 
        headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }      
      expect(response).to have_http_status(:ok)      
      expect(Todo.find(todo.id).completed).to eq(true)      

      put "/api/v1/todos/#{todo.id}/complete", 
        headers: { "Authorization" => "Bearer #{AuthenticationTokenService.encode(@user.id)}" }
      expect(response).to have_http_status(:ok)
      expect(Todo.find(todo.id).completed).to eq(false)
      
    end
  end
end
