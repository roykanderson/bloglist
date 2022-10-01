const Notification = ({ message }) => {
  if (message) {
    return (
      <div className="notif">
        {message}
      </div>
    )
  }

  return null
}

export default Notification