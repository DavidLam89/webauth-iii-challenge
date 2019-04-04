import React from 'react';
import axios from 'axios';

class Signup extends React.Component {
  state = {
    username: '',
    password: '',
    department: ''
  };

  render() {
    return (
      <>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="username" />
            <input
              value={this.state.username}
              onChange={this.handleInputChange}
              id="username"
              type="text"
            />
          </div>
          <div>
            <label htmlFor="password" />
            <input
              value={this.state.password}
              onChange={this.handleInputChange}
              id="password"
              type="password"
            />
          </div>
          <div>
            <label htmlFor="department" />
            <input
              value={this.state.department}
              onChange={this.handleInputChange}
              id="department"
              type="text"
            />
          </div>
          <div>
            <button type="submit">Sign up</button>
          </div>
        </form>
      </>
    );
  }

  handleSubmit = event => {
    event.preventDefault();

    const endpoint = 'http://localhost:5000/api/register';
    axios
      .post(endpoint, this.state)
      .then(res => {
        axios
          .post('http://localhost:5000/api/login', {username: this.state.username, password: this.state.password})
          .then(res => {
            console.log('LOGIN RESPONSE', res);
            localStorage.setItem('token', res.data.token);
            window.location = "/users";
          })
          .catch(error => {
            console.error('LOGIN ERROR', error);
          });
      })
      .catch(error => {
        console.error('SIGN UP ERROR', error);
      });
  };

  handleInputChange = event => {
    const { id, value } = event.target;
    this.setState({ [id]: value });
  };
}

export default Signup;
