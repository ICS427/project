import React from 'react';
import { Form, Header } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Redirect } from 'react-router-dom';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '', email: '', password: '', error: '', redirectToProfile: false };
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  submit = () => {
    const { username, email, password } = this.state;
    Accounts.createUser({
      username: username,
      email: email,
      password: password,
      profile: {
        image: 'images/empty-profile.png',
        leader: '',
        clubs: { joined: [], favorite: [], banned: [] },
        interests: [],
        majors: [],
      },
    }, (err) => {
      if (err) {
        this.setState({ error: err.reason });
      } else {
        this.setState({ error: '', redirectToProfile: true });
      }
    });
  }

  render() {
    if (this.state.redirectToProfile) {
      return <Redirect to={ `/profile/${Meteor.user()._id}` }/>;
    }
    return (
        <div className="signin">
          <div className="foreground_box_signup">
            <div className="heading">
              <Header as="h1" style={{ marginTop: '-1.5em' }} inverted>SIGN UP</Header>
            </div>
            <Form onSubmit={this.submit}>
              <div className="signup-input">
              <Form.Field required>
                <Form.Input className="item" label='Name:' placeholder='John Doe' name='username'
                            onChange={this.handleChange}/>
                <Form.Input className="item" label='Email:' placeholder='Email' name='email'
                            onChange={this.handleChange}/>
                <Form.Input className="item" label='Password:' placeholder='Password' name='password'
                            type='password' onChange={this.handleChange}/>
                <Form.Button className="item" content='Create Your Account'/>
              </Form.Field>
            </div>
            </Form>
          </div>
        </div>
    );
  }
}
export default Signup;
