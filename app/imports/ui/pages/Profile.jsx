import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image, Loader, Grid, Header, List, Menu, Card, Form, Button } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubCard from '../components/ClubCard';
import { Announcements } from '../../api/announcement/Announcements';
import { Interests } from '../../api/interest/Interest';
import { Majors } from '../../api/major/Major';
import { Clubs } from '../../api/club/Club';
import AnnouncementPost from '../components/AnnouncementPost';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class Profile extends React.Component {

  state = { activeItem: Meteor.user().profile.newUser ? 'recommended-clubs' : 'clubs-joined', interest: '',
    major: '', recommendations: [], image: '', interests: [], majors: [], flag: true };

  handleMenuClick = (e, { name }) => { this.setState({ activeItem: name }); };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleInterestSubmit = () => {
    if (Interests.findOne({ name: this.state.interest }) && !(this.state.interests.includes(this.state.interest))) {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.interests': this.state.interests.concat([this.state.interest]) } });
      this.setState({ interests: this.state.interests.concat([this.state.interest]) });
      this.setState({ interest: '' });
    }
  };

  removeInterest = (interest) => {
    const interests = this.state.interests;
    const tempThis = this;
    return function () {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.interests': interests.filter(function (value) { return value !== interest; }) } });
      tempThis.setState({ interests: interests.filter((value) => value !== interest) });
    };
  };

  removeMajor = (major) => {
    const majors = this.state.majors;
    const tempThis = this;
    return function () {
      Meteor.users.update({ _id: Meteor.userId() },
        { $set: { 'profile.majors': majors.filter(function (value) { return value !== major; }) } });
      tempThis.setState({ majors: majors.filter((value) => value !== major) });
    };
  };

  handleMajorSubmit = () => {
    if (Majors.findOne({ name: this.state.major }) && !this.state.majors.includes(this.state.major)) {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.majors': this.state.majors.concat([this.state.major]) } });
      this.setState({ majors: this.state.majors.concat([this.state.major]) });
      this.setState({ major: '' });
    }
  };

  handleImageSubmit = () => {
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.image': this.state.image } });
    this.setState({ image: '' });
  };

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const { activeItem } = this.state;
    const recommendations = [];
    for (let i = 0; i < this.state.interests.length; i++) {
      if (this.state.interests[i] !== 'Academic' || this.state.interests[i] !== 'Professional') {
        const clubs = Interests.findOne({ name: this.state.interests[i] }).associated_clubs;
        const temp = [];
        for (let j = 0; j < clubs.length; j++) {
          if (!recommendations.includes(clubs[j]) && !this.props.user.profile.clubs.favorite.includes(clubs[j])
              && !this.props.user.profile.clubs.joined.includes(clubs[j])) {
            temp.push(clubs[j]);
          }
        }
        recommendations.unshift(...temp);
      }
    }

    if (this.props.user.profile.newUser) {
      Meteor.users.update({ _id: Meteor.userId() }, { $set: { 'profile.newUser': false } });
    }

    if (this.state.flag) {
      this.setState({ flag: false });
      this.setState({ interests: Meteor.user().profile.interests });
      this.setState({ majors: Meteor.user().profile.majors });
    }

    const announcements = [];
    const subscribed = this.props.user.profile.clubs.favorite.concat(this.props.user.profile.clubs.joined);
    // eslint-disable-next-line max-len
    subscribed.map((clubName) => Announcements.find({ club: clubName }).map((announcement) => (!announcements.find((a) => a._id === announcement._id) ? announcements.push(announcement) : null)));

    return (
        <div className="profile">
          <Grid>
            <Grid.Column width={4} className="user_info">
              <Image className="profile_picture" src={ this.props.user.profile.image } size="medium"/>
              <Form onSubmit={this.handleImageSubmit}>
                <Grid column={16}>
                  <Grid.Column width={10}>
                    <Header style={{ marginLeft: '2em' }}>Profile Image Link:</Header>
                    <Form.Input style={{ marginLeft: '3em' }} name='image' value={this.state.image}
                      onChange={this.handleChange}/>
                  </Grid.Column>
                  <Grid.Column width = {10}>
                    <Form.Button primary style={{ marginLeft: '2em' }}
                                 type='submit' onClick={this.swalTutorial}>Submit</Form.Button>
                  </Grid.Column>
                </Grid>
              </Form>
              <Header style={{ marginLeft: '1em' }} className="name"> {Meteor.user()._id === this.props.user._id ?
                  `My Profile:\n${this.props.user.username}` : this.props.user.username}</Header>
              <Header className="heading">Interests</Header>
              <hr style={{ marginLeft: '1em' }}/>
              <List bulleted className="list">
                {/* eslint-disable-next-line max-len */}
                {this.props.user.profile.interests.map((interest, index) => (<List.Item key={index}>{interest} <Button secondary style={{ marginLeft: '3em' }} size={'mini'} content='Remove' onClick={this.removeInterest(interest)}/></List.Item>))}
              </List>
              {Meteor.user()._id === this.props.user._id ? (<Form onSubmit={this.handleInterestSubmit}>
                <Grid columns={2}>
                  <Grid.Column>
                    <Form.Input style={{ marginLeft: '3em' }}
                           list='interests'
                           name="interest"
                           value={this.state.interest}
                            onChange={this.handleChange}/>
                    <datalist id='interests'>
                      {this.props.interests.map((interest, index) => <option key={index} value={interest.name}/>)}
                    </datalist>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Button primary style={{ marginLeft: '2em' }}
                            type='submit'>Submit</Form.Button>
                  </Grid.Column>
                </Grid>
              </Form>) : ''}
              <Header className="heading">Majors</Header>
              <hr style={{ marginLeft: '1em' }}/>
              <List bulleted className="list">
                {/* eslint-disable-next-line max-len */}
                {this.state.majors.map((major, index) => <List.Item key={index} onClick={this.removeMajor(major)}>{major}<Button secondary style={{ marginLeft: '1em' }} size={'mini'} content='Remove' onClick={this.removeMajor(major)}/></List.Item>)}
              </List>
              {Meteor.user()._id === this.props.user._id ? (<Form onSubmit={this.handleMajorSubmit}>
                <Grid columns={2}>
                  <Grid.Column>
                    <div>
                      <Form.Input style={{ marginLeft: '3em' }}
                             list='majors'
                             name="major"
                             value={this.state.major}
                             onChange={this.handleChange}/>
                      <datalist id='majors'>
                        {this.props.majors.map((major, index) => <option key={index} value={major.name}/>)}
                      </datalist>
                    </div>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Button primary style={{ marginLeft: '2em' }}
                            type='submit'>Submit</Form.Button>
                  </Grid.Column>
                </Grid>
              </Form>) : ''}
            </Grid.Column>
            <Grid.Column width={12} className="club_info">
              <Menu pointing secondary>
                <Menu.Item name="clubs-joined" active={ activeItem === 'clubs-joined' } onClick={this.handleMenuClick}/>
                <Menu.Item name="favorite-clubs" active={ activeItem === 'favorite-clubs' }
                           onClick={this.handleMenuClick}/>
                <Menu.Item name="recommended-clubs" active={ activeItem === 'recommended-clubs' }
                           onClick={this.handleMenuClick}/>
                <Menu.Item name="announcements" active={ activeItem === 'announcements' }
                           onClick={this.handleMenuClick}/>
              </Menu>
              {
                // eslint-disable-next-line max-len
                (activeItem === 'clubs-joined' && this.props.user.profile.clubs.joined.length > 0) || (activeItem === 'favorite-clubs' && this.props.user.profile.clubs.favorite.length > 0) || (activeItem === 'recommended-clubs' && recommendations.length > 0) || (activeItem === 'announcements') ?
                <Card.Group>
                  {
                    // eslint-disable-next-line no-nested-ternary
                    activeItem === 'clubs-joined' ?
                     // eslint-disable-next-line max-len
                      this.props.user.profile.clubs.joined.map((club, index) => <ClubCard key={index} club={Clubs.findOne({ name: club })}/>) :
                    // eslint-disable-next-line no-nested-ternary
                    activeItem === 'favorite-clubs' ?
                      this.props.user.profile.clubs.favorite.map((club, index) => <ClubCard
                                                              key={index} club={Clubs.findOne({ name: club })}/>) :
                    // eslint-disable-next-line no-nested-ternary
                    activeItem === 'recommended-clubs' ?
                      recommendations.map((recommendation, index) => <ClubCard key={index}
                                         club={Clubs.findOne({ name: recommendation })}/>) :

                    activeItem === 'announcements' ?
                    // eslint-disable-next-line no-nested-ternary,max-len
                        announcements.reverse().map((announcement, index) => <AnnouncementPost
                            key={index} announcement={announcement}/>) :
                    null
                  }
                </Card.Group> : null
              }
            </Grid.Column>
          </Grid>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
Profile.propTypes = {
  interests: PropTypes.array.isRequired,
  majors: PropTypes.array.isRequired,
  clubs: PropTypes.array.isRequired,
  announcements: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get access to Stuff documents.
  const interests_sub = Meteor.subscribe('Interests');
  const majors_sub = Meteor.subscribe('Majors');
  const clubs_sub = Meteor.subscribe('Clubs');
  const announcements_sub = Meteor.subscribe('Announcements');
  const documentId = match.params._id;
  const users_sub = Meteor.subscribe('userData');

  return {
    interests: Interests.find({}).fetch(),
    majors: Majors.find({}).fetch(),
    clubs: Clubs.find({}).fetch(),
    announcements: Announcements.find({}).fetch(),
    user: Meteor.users.findOne({ _id: documentId }),
    ready: interests_sub.ready() && majors_sub.ready() && clubs_sub.ready() &&
        announcements_sub.ready() && users_sub.ready(),
  };
})(Profile);
