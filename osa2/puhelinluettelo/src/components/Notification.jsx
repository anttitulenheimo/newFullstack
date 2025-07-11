const Notification = ({ message, type }) => {

  const successStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  const errorStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10
  }

  // Makes sure that an empty block is not shown!!!
  if (!message) return null

  const notificationStyle = type === 'success' ? successStyle : errorStyle

  return (
    <div style={notificationStyle}>
      {message}
    </div>
  )
}

export default Notification
