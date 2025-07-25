Rails.application.routes.draw do
  resources :todos
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
  # take out the only: :index later.
  namespace :api do
    namespace :v1 do
      put 'todos/:id/complete', to: 'todos#complete'
      resources :todos #, only: [:index, :create, :destroy]
      post 'login', to: 'authentication#login'
      post 'signup', to: 'authentication#signup'
    end
  end
end
