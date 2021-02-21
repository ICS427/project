import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import Redirect from 'react-router/Redirect';
import swal from 'sweetalert';
import { Clubs } from '../../api/club/Club';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Search extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  render() {
    return this.props.ready ? this.redirect() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  redirect() {
    const club = Clubs.findOne({ name: this.props.searchQuery });
    if (club) {
      return <Redirect to={`/clubpage/${club._id}`}/>;
    }

    swal('Error', 'The club that you searched for could not be found.  Maybe look for it here?', 'error');
    return <Redirect to={'/clubexplorer'}/>;
  }
}

/** Require an array of Stuff documents in the props. */
Search.propTypes = {
  clubs: PropTypes.array.isRequired,
  searchQuery: PropTypes.string.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get access to Stuff documents.
  const clubs_sub = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find({}).fetch(),
    searchQuery: match.params.searchQuery,
    ready: clubs_sub.ready(),
  };
})(Search);
