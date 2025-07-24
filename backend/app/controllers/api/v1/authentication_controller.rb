module Api
  module V1
    class AuthenticationController < ApplicationController
      
      class AuthenticationError < StandardError; end
      class AuthenticationBadUsernameError < StandardError; end

      rescue_from ActionController::ParameterMissing, with: :parameter_missing
      rescue_from AuthenticationError, with: :handle_unauthenticated
      def login
        # lookup existing user in database if found return a token.
        params.require(:username) # get the unprocessable entity errors before trying the user
        params.require(:password) # otherwise they get skipped. 
        raise AuthenticationError unless user != nil
        raise AuthenticationError unless user.authenticate(params.require(:password))
        token = AuthenticationTokenService.encode(user.id)

        render json: {token: token}, status: :accepted
      end

      rescue_from AuthenticationBadUsernameError, with: :handle_dupliateusername
      def signup
        # post a new user in the database.
        params.require(:username)
        params.require(:password)

        existing = User.find_by username: params[:username]
        raise AuthenticationBadUsernameError unless existing == nil
        
        user = User.new
        user.username = params[:username]
        user.password = params[:password]
        user.save
        token = AuthenticationTokenService.encode(user.id)

        render json: {token: token}, status: :created
      end

      private

      def user
        @user ||= User.find_by(username: params.require(:username))
      end

      def parameter_missing(e)
        render json: { error: e.message }, status: :unprocessable_entity
      end

      def handle_unauthenticated(e)
        head :unauthorized
      end

      def handle_dupliateusername(e)
        render json: { error: "Username is taken"}
        head :forbidden
      end
    end
  end
end