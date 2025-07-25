import axios from 'axios'

const api_root = 'http://localhost:3000/api/v1/';

class TodoDataService
{
    getAll(token, offset = 0, batch = 2) 
    {
        axios.defaults.headers.common["Authorization"] = "Token " + token
        return axios.get(api_root + 'todos/', { params: {'offset': offset, 'limit': batch}})
    }

    createTodo(data, token) 
    {
        axios.defaults.headers.common["Authorization"] = "Token " + token
        return axios.post(api_root + 'todos/', data)
    }

    updateTodo(id, data, token) 
    {
        axios.defaults.headers.common["Authorization"] = "Token " + token
        return axios.put(api_root + `todos/${id}`, data)
    }

    deleteTodo(id, token) 
    {
        axios.defaults.headers.common["Authorization"] = "Token " + token
        return axios.delete(api_root + `todos/${id}`)
    }

    completeTodo(id, token) 
    {
        axios.defaults.headers.common["Authorization"] = "Token " + token
        return axios.put(api_root + `todos/${id}/complete`)
    }

    async login(data) 
    {
        return axios.post(api_root + 'login/', data)
    }

    
    signup(data) 
    {
        return axios.post(api_root + 'signup/', data)
    }
}

export default new TodoDataService()