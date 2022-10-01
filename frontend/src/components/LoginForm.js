import { useState } from 'react'
import blogService from '../services/blogs'
import loginService from '../services/login'

const LoginForm = ({ setUser, setNotificationMessage }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedInUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setNotificationMessage(`Logged in as ${user.name}`)
      setTimeout(() => setNotificationMessage(null), 3000)
    } catch {
      setNotificationMessage('Invalid username or password')
      setTimeout(() => setNotificationMessage(null), 3000)
    }
  }

  return (
    <div>
      <h1>Log In</h1>
      <form onSubmit={handleLogin}>
        <div>
          Username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          Password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">Log In</button>
      </form>
    </div>
  )
}

export default LoginForm