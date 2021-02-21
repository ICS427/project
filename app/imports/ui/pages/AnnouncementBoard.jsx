import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Header, Loader, Card, Button } from 'semantic-ui-react';
import { Announcements } from '/imports/api/announcement/Announcements';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import AnnouncementPost from '../components/AnnouncementPost';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class AnnouncementBoard extends React.Component {

  state = { pageNumber: 0 };

  nextPage = () => {
    this.setState({ pageNumber: this.state.pageNumber + 1 });
  };

  previousPage = () => {
    this.setState({ pageNumber: this.state.pageNumber - 1 });
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const announcements = [];
    const size = this.props.announcements.length;
    for (let i = this.state.pageNumber * 3; i < (this.state.pageNumber + 1) * 3 && i < size; i++) {
      announcements.push(this.props.announcements.reverse()[i]);
    }
    return (
    <div className="announcementBoard-image">
      <Container>
        <div className="announcementBoard-header">
          <Header as="h2" textAlign="center" color='black'>Announcement Board</Header>
        </div>
        <Card.Group centered style={{ marginBottom: '1em', marginTop: '1em' }}>
          {announcements.map((announcement, index) => <AnnouncementPost key={index} announcement={announcement}/>)}
        </Card.Group>
      </Container>
      {this.state.pageNumber > 0 ? <Button onClick={this.previousPage}>Back</Button> : null}
      {(this.state.pageNumber + 1) * 3 < size ? <Button onClick={this.nextPage}>Next</Button> : null}
    </div>
  );
  }
}

/** Require an array of Stuff documents in the props. */
AnnouncementBoard.propTypes = {
  announcements: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Announcement documents.
  const subscription = Meteor.subscribe('Announcements');
  return {
    announcements: Announcements.find({}).fetch(),
    ready: subscription.ready(),
  };
})(AnnouncementBoard);
