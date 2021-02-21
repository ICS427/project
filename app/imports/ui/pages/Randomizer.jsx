import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Redirect from 'react-router/Redirect';
import swal from 'sweetalert';
import { Clubs } from '../../api/club/Club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Randomizer extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  state = { selectedTags: [] };

  render() {
    return this.props.ready ? this.redirect() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  redirect() {
    let available = [];
    let valid = true;
    if (this.props.isPseudoRandom === 'true' && Meteor.user().profile.interests.length > 0) {
      for (let i = 0; i < this.props.clubs.length; i++) {
        for (let j = 0; j < Meteor.user().profile.interests.length; j++) {
          if (this.props.clubs[i].tags.includes(Meteor.user().profile.interests[j].toLowerCase())) {
            available.push(this.props.clubs[i]);
            break;
          }
        }
      }
    } else if (this.props.isPseudoRandom === 'false') {
      available = this.props.clubs;
    } else if (Meteor.user().profile.interests.length === 0) {
      swal('Error', 'No suggestions, please add interests so we know what to show you.', 'error');
      valid = false;
    }
    if (valid) {
      return <Redirect to={`/clubpage/${available[Math.floor(Math.random() * available.length)]._id}`}/>;
    }
    return <Redirect to={`/profile/${Meteor.user()._id}`}/>;

  }
}

/** Require an array of Stuff documents in the props. */
Randomizer.propTypes = {
  clubs: PropTypes.array.isRequired,
  isPseudoRandom: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get access to Stuff documents.
  const clubs_sub = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find({}).fetch(),
    isPseudoRandom: match.params.isPseudoRandom,
    ready: clubs_sub.ready(),
  };
})(Randomizer);
