module Api
  module V1
    class TodosController < ApplicationController
      include ActionController::HttpAuthentication::Token

      MAX_PAGINATION_LIMIT = 100

      before_action :authenticate_user
      before_action :set_todo, only: %i[ show update destroy complete ]
      before_action :limit, only: %i[index]

      # GET /todos
      def index
        # if no pagination parameters then all
        total = Todo.where(user_id: @user.id).count
        offset = params[:offset].to_i || 0
        todos = Todo.limit(limit).offset(offset).where(user_id: @user.id)
        
        render json: {'pagination' => {'offset' => params[:offset] || 0, 'limit' => limit, 'total' => total},
        'todos' =>         TodosRepresenter.new(todos).as_json}
      end

      # GET /todos/1
      def show
        render json: @todo
      end

      # POST /todos
      def create
        @todo = Todo.new(todo_params)
        @todo.user_id = @user.id

        if @todo.save
          render json: TodoRepresenter.new(@todo).as_json, status: :created, location: @todo
        else
          render json: @todo.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /todos/1
      def update
        if @todo.update(todo_params)
          render json: @todo
        else
          render json: @todo.errors, status: :unprocessable_entity
        end
      end

      # DELETE /todos/1
      def destroy
        @todo.destroy!

        head :no_content # new from video.
      end

      # PUT /todos/1/complete
      def complete
        @todo.completed = !@todo.completed
        @todo.save

        render json: @todo
      end

      private
        # Use callbacks to share common setup or constraints between actions.

        def authenticate_user
          # Authorization: Bearer <token>
          token, _options = token_and_options(request)
          user_id = AuthenticationTokenService.decode(token)
          @user = User.find(user_id)
        rescue ActiveRecord::RecordNotFound, JWT::DecodeError
          render status: :unauthorized
        end

        def limit
          [params.fetch(:limit, MAX_PAGINATION_LIMIT).to_i, MAX_PAGINATION_LIMIT].min
        end

        def set_todo
          @todo = Todo.find_by(id: params[:id], user_id: @user.id)
        end

        # Only allow a list of trusted parameters through.
        def todo_params
          params.require(:todo).permit(:title, :memo, :completed)
        end
    end
  end
end