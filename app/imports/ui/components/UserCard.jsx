import React from 'react';
import { Button, Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Link } from 'react-router-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Clubs } from '../../api/club/Club.js';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class UserCard extends React.Component {
  togglePosition(name) {
    if (!this.props.club.leader.includes(name)) {
      Meteor.call('club.toggleLeader', {
        id: this.props.club._id,
        leader: this.props.user.username },
        (err) => {
          if (err) {
            // eslint-disable-next-line no-undef
            alert(err);
          } else {
            // success
          }
      });
    } else {
      Clubs.update(this.props.club._id, { $set:
        { leader: this.props.club.leader.filter((c) => c !== this.props.user.name) } });
    }
  }

  editOfficerPosition() {
    if (this.props.club !== undefined && this.props.club.leader.includes(Meteor.user().username)) {
      return (
        <Card.Content>
          <Button content={this.officer()} onClick={() => this.togglePosition(this.props.club.name)}/>
        </Card.Content>
      );
    }
    return null;
  }

  officer() {
    if (this.props.club.leader.includes(this.props.user.username)) {
      return 'Demote Officer';
    }
    return 'Make An Officer';
  }

  render() {
    return (
        <div className="card-shadow">
          <Card>
            <Image as={Link} to={`/profile/${this.props.user._id}`}
              src={this.props.user.profile.image} wrapped ui={false}/>
            <Card.Content style={{ height: '100px' }}>
              <Card.Header>{this.props.user.username}</Card.Header>
              {(this.props.user.profile.majors[0]) ? <Card.Meta>{this.props.user.profile.majors[0]}</Card.Meta> : ''}
              {(this.props.user.profile.majors[1]) ? <Card.Meta>{this.props.user.profile.majors[1]}</Card.Meta> : ''}
              {(this.props.user.profile.majors[2]) ? <Card.Meta>{this.props.user.profile.majors[2]}</Card.Meta> : ''}
            </Card.Content>
            {this.editOfficerPosition()}
          </Card>
        </div>
    );
  }
}

/** Require a document to be passed to this component. */
UserCard.propTypes = {
  user: PropTypes.object.isRequired,
  club: PropTypes.object.isRequired,
  clubs: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withTracker(() => {
  // Get access to Announcement documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    clubs: Clubs.find({}).fetch(),
    ready: subscription.ready(),
  };
})(UserCard);
