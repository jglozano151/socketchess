export const functions = {
  register: (email, password) => {
    fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
      .then((resp) => resp.json())
      .then((resp) => this.setState({
        authenticated: resp.auth ? true : false,
        userId: resp.id ? null : resp.id
      }))
  }
}
