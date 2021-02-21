import React from 'react';
import { Card } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class AnnouncementPost extends React.Component {

  dateCreated() {
    return this.props.announcement.date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  renderAnnouncements() {
    return (
    <Card.Content>
      <Card.Description>{this.props.announcement.date ? this.dateCreated() : null}</Card.Description>
    </Card.Content>
    );
  }

  renderEditOption() {
    if (Meteor.user() !== null && Meteor.user().profile.leader === this.props.announcement.club) {
      return (
        <Card.Content>
          <Link exact to={`/editannouncement/${this.props.announcement._id}`}>Edit Announcement</Link>
        </Card.Content>
      );
    }
    return null;
  }

  render() {
    return (
      <Card fluid color='green'>
          <Card.Content>
            <Card.Header>{this.props.announcement.club}: {this.props.announcement.title}</Card.Header>
            <Card.Meta>{this.props.announcement.owner}</Card.Meta>
            <Card.Description>
              {this.props.announcement.description}
            </Card.Description>
          </Card.Content>
        {this.props.announcement.date ? this.renderAnnouncements() : null}
        {this.renderEditOption()}
      </Card>
    );
  }
}

/** Require a document to be passed to this component. */
AnnouncementPost.propTypes = {
    announcement: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(AnnouncementPost);
