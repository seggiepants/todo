require "rails_helper"

RSpec.describe Api::V1::TodosController, type: :controller do
  context 'authorization header present' do
    before do
      @user = FactoryBot.create(:user, username: 'sgray', password: 'password')
    end  
    describe 'Get index' do
      it 'has a maximum limit of 100' do
        expect(Todo).to receive(:limit).with(100).and_call_original
        @request.headers["Authorization"] = "Bearer #{AuthenticationTokenService.encode(@user.id)}"
        get :index, params: {limit: 999 }
      end
    end
  end

  context 'missing authorization header'
    describe 'Post create' do
      it 'returns a 401' do
        post :create, params: { 
            todo: { 
              title: 'Eat your lunch', 
              memo: 'What time is it? Lunch Time!!', 
              completed: false
            }
          }
        expect(response).to have_http_status(:unauthorized)
      end
    end

    describe 'DELETE destroy' do
      it 'returns a 401' do
        delete :destroy, params: { id: 1 }
        expect(response).to have_http_status(:unauthorized)
      end
    end
end