require 'rails_helper'

describe 'Authentication', type: :request do
  describe 'POST /authenticate' do
    let(:user) { FactoryBot.create(:user, username: 'bobby', password: 'tables')}
    it 'authenticates the client' do
      TOKEN = AuthenticationTokenService.encode(user.id)
      post '/api/v1/login', params: { username: user.username, password: 'tables'}
      expect(response).to have_http_status(:accepted)
      expect(JSON.parse(response.body)).to eq({
        'token' => TOKEN
      })
    end

    it 'returns error when username is missing' do
      post '/api/v1/login', params: { password: 'tables'}
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)).to eq({
        'error' =>'param is missing or the value is empty: username'
      })
    end

    it 'returns error when password is missing' do
      post '/api/v1/login', params: { username: 'bobby'}
      expect(response).to have_http_status(:unprocessable_entity)
      expect(JSON.parse(response.body)).to eq({
        'error' =>'param is missing or the value is empty: password'
      })
    end

    it 'returns an error when password is incorrect' do
      post '/api/v1/login', params: {username: user.username, password: 'wrong_password'}
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns an error when the username is incorrect' do
      post '/api/v1/login', params: {username: 'sir_not_appearing_in_this_film', password: 'wrong_password'}
      expect(response).to have_http_status(:unauthorized)
    end

    it 'returns an error when the username is a duplicate' do
      post '/api/v1/signup', params: {username: user.username, password: 'password'}
      expect(response).to have_http_status(:forbidden)
    end

    it 'creates a user' do
      USERNAME = 'suzy'
      USER_COUNT = User.count
      post '/api/v1/signup', params: {username: USERNAME, password: 'Sn0wfl@k3'}
      expect(response).to have_http_status(:created)
      suzy = User.find_by(username: USERNAME)
      expect(suzy).not_to eq(nil)      
    end
  end
end