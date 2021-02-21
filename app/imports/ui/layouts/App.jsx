import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import 'semantic-ui-css/semantic.css';
import { Roles } from 'meteor/alanning:roles';
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import AnnouncementBoard from '../pages/AnnouncementBoard';
import EditAnnouncement from '../pages/EditAnnouncement';
import ClubPage from '../pages/ClubPage';
import EditClub from '../pages/EditClub';
import NotFound from '../pages/NotFound';
import Signin from '../pages/Signin';
import Landing from '../pages/Landing';
import Signout from '../pages/Signout';
import Signup from '../pages/Signup';
import ClubExplorer from '../pages/ClubExplorer';
import Profile from '../pages/Profile';
import Randomizer from '../pages/Randomizer';
import Search from '../pages/Search';

/** Top-level layout component for this application. Called in imports/startup/client/startup.jsx. */
class App extends React.Component {
  render() {
    return (
        <Router>
          <div>
            <NavBar/>
            <Switch>
              <Route exact path="/" component={Landing}/>
              <Route path="/signin" component={Signin}/>
              <Route path="/signup" component={Signup}/>
              <Route path="/profile/:_id" component={Profile}/>
              <Route path="/announcements" component={AnnouncementBoard}/>
              <Route path="/clubpage/:_id" component={ClubPage}/>
              <Route path="/clubexplorer" component={ClubExplorer}/>
              <Route path="/randomizer/:isPseudoRandom" component={Randomizer}/>
              <Route path="/search/:searchQuery" component={Search}/>
              <LeaderProtectedRoute path="/editclub/:_id" component={EditClub}/>
              <ProtectedRoute path="/editannouncement/:_id" component={EditAnnouncement}/>
              <ProtectedRoute path="/signout" component={Signout}/>
              <Route component={NotFound}/>
            </Switch>
            <Footer/>
          </div>
        </Router>
    );
  }
}

/**
 * ProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      const isLogged = Meteor.userId() !== null;
      return isLogged ?
          (<Component {...props} />) :
          (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
      );
    }}
  />
);

/**
 * AdminProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and admin role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const AdminProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isAdmin = Roles.userIsInRole(Meteor.userId(), 'admin');
          return (isLogged && isAdmin) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);

/**
 * LeaderProtectedRoute (see React Router v4 sample)
 * Checks for Meteor login and leader role before routing to the requested page, otherwise goes to signin page.
 * @param {any} { component: Component, ...rest }
 */
const LeaderProtectedRoute = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) => {
          const isLogged = Meteor.userId() !== null;
          const isLeader = Roles.userIsInRole(Meteor.userId(), 'leader');
          return (isLogged && isLeader) ?
              (<Component {...props} />) :
              (<Redirect to={{ pathname: '/signin', state: { from: props.location } }}/>
              );
        }}
    />
);


/** Require a component and location to be passed to each ProtectedRoute. */
ProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each AdminProtectedRoute. */
AdminProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

/** Require a component and location to be passed to each LeaderProtectedRoute. */
LeaderProtectedRoute.propTypes = {
  component: PropTypes.func.isRequired,
  location: PropTypes.object,
};

export default App;
