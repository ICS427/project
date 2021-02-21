import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, NavLink } from 'react-router-dom';
import { Meteor } from 'meteor/meteor';
import '../../../client/style.css';
import { Header, Button, Image, Form } from 'semantic-ui-react';
import swal from 'sweetalert';
import SignUp from '../pages/Signup';


/**
 * Signin page overrides the form’s submit event and call Meteor’s loginWithPassword().
 * Authentication errors modify the component’s state to be displayed
 */
export default class Signin extends React.Component {

  /** Initialize component state with properties for login and redirection. */
  constructor(props) {
    super(props);
    this.state = { email: '', password: '', error: '', redirectToReferer: false };
  }

  /** Update the form controls each time the user interacts with them. */
  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  }

  /** Handle Signin submission using Meteor's account mechanism. */
  submit = () => {
    const { email, password } = this.state;
    Meteor.loginWithPassword(email, password, (err) => {
      if (err) {
        this.setState({ error: err.reason });
        swal('Error', err.reason, 'error');
      } else {
        this.setState({ error: '', redirectToReferer: true });
      }
    });
  }

  /** Render the signin form. */
  render() {
    // if correct authentication, redirect to page instead of login screen
    if (this.state.redirectToReferer) {
      return <Redirect to={ `/profile/${Meteor.user()._id}` }/>;
    }
    // Otherwise return the Login form.
    return (
          <div className="signin">
            <div className="midground_box">
              <div className="description">
                <div className="title">
                  <Header as="h2" color='grey'>HUB FOR CLUBS</Header>
                  <Header as="h5" className="p"> find your perfect club </Header>
                  <Image className="logo" src="images/HubForClubsLogo.png"/>
                  <Header as="h5" className="p" style={{ marginTop: '15%', fontSize: '10px' }}>
                    Don&apos;t have an account?</Header>
                  <Button basic color='green' as={NavLink} exact to="/signup" component={SignUp}>sign up</Button>
                </div>
              </div>
            </div>
            <div className="foreground_box">
              <div className="heading">
                <Header as="h1" style={{ marginTop: '-1.5em' }} inverted>SIGN IN</Header>
              </div>
              <Form className = "form" onSubmit={this.submit}>
                <Form.Input
                    label="Email"
                    icon="user"
                    iconPosition="left"
                    name="email"
                    type="email"
                    placeholder="E-mail address"
                    className="input"
                    onChange={this.handleChange}
                />
                <Form.Input
                    label="Password"
                    icon="lock"
                    iconPosition="left"
                    name="password"
                    placeholder="Password"
                    type="password"
                    className="input"
                    onChange={this.handleChange}
                />
                <Form.Button className="input" content="Submit"/>
              </Form>
            </div>
        </div>
    );
  }
}

/** Ensure that the React Router location object is available in case we need to redirect. */
Signin.propTypes = {
  location: PropTypes.object,
};
