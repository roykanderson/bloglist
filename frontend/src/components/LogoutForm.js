const LogoutForm = ({user, setUser, setNotificationMessage }) => {
  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedInUser')
    setNotificationMessage('Logout successful')
    setTimeout(() => setNotificationMessage(null), 3000)
  }

  return (
    <div>
      <p>
        {user.name} logged in <button onClick={handleLogout}>Log Out</button>
      </p>
    </div>
  )
}

export default LogoutForm