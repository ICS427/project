import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Image, Loader, Grid, Header, List, Menu, Card, Container, Button, Segment, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import swal from 'sweetalert';
import TextField from 'uniforms-semantic/TextField';
import LongTextField from 'uniforms-semantic/LongTextField';
import SubmitField from 'uniforms-semantic/SubmitField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import AutoForm from 'uniforms-semantic/AutoForm';
import SimpleSchema from 'simpl-schema';
import { Interests } from '../../api/interest/Interest';
import { Majors } from '../../api/major/Major';
import { Clubs } from '../../api/club/Club';
import { Announcements } from '../../api/announcement/Announcements';
import AnnouncementPost from '../components/AnnouncementPost';
import UserCard from '../components/UserCard';

const formSchema = new SimpleSchema({
  title: String,
  description: String,
});

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubPage extends React.Component {

  state = { activeItem: 'About-Us', club: null };

  handleMenuClick = (e, { name }) => { this.setState({ activeItem: name }); };

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  fRef = null;

  /** On submit, insert the data. */
  submit(data, formRef) {
    const { title, description } = data;
    const club = Clubs.findOne(this.props.id).name;
    const owner = Meteor.user().username;
    const date = new Date();
    Announcements.insert({ title, description, owner, club, date },
        (error) => {
          if (error) {
            swal('Error', error.message, 'error');
          } else {
            swal('Success', 'Post added successfully', 'success');
            formRef.reset();

          }
        });
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  toggleJoin(name) {
    let index = Meteor.user().profile.clubs.joined.indexOf(name);
    if (index !== -1) {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.clubs.joined': Meteor.user().profile.clubs.joined.filter((club) => club !== name) } });
    } else if (Meteor.user().profile.clubs.joined.indexOf(name) === -1) {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.clubs.joined': Meteor.user().profile.clubs.joined.concat([name]) } });
      index = Meteor.user().profile.clubs.favorite.indexOf(name);
      if (index !== -1) {
        Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.clubs.favorite': Meteor.user().profile.clubs.favorite.filter((club) => club !== name) } });
      }
    }
  }

  toggleFavorite(name) {
    let index = Meteor.user().profile.clubs.favorite.indexOf(name);
    if (index !== -1) {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.clubs.favorite': Meteor.user().profile.clubs.favorite.filter((club) => club !== name) } });
    } else {
      Meteor.users.update({ _id: Meteor.userId() },
          { $set: { 'profile.clubs.favorite': Meteor.user().profile.clubs.favorite.concat([name]) } });
      index = Meteor.user().profile.clubs.joined.indexOf(name);
      if (index !== -1) {
        Meteor.users.update({ _id: Meteor.userId() },
            { $set: { 'profile.clubs.joined': Meteor.user().profile.clubs.joined.filter((club) => club !== name) } });
      }
    }
  }

  displayActiveItem(activeItem) {
    if (activeItem === 'About-Us') {
      return (
        <Container>
          {(this.props.clubs.description !== 'N/A') ? <h4 style={{ marginTop: '1em' }}>
            {this.props.clubs.description}</h4> : <h3> </h3>}
          <h2>Our Announcements</h2>
          {this.displayAddAnnouncements()}
          {this.props.announcements.reverse().map((announcement, i) => this.displayAnnouncements(announcement, i))}
        </Container>
      );
    }
    if (activeItem === 'Members') {
      if (Meteor.user()) {
        return this.props.users.filter((user) => (this.joined(user))).map((user, index) => this.userCard(user, index));
      }
      return <Image src={'/images/MembersSignInFix.png'} style={{ marginLeft: '20%' }}/>;
    }
    return null;
  }

  joined(user) {
    return user.profile.clubs.joined.includes(this.props.clubs.name);
  }

  userCard(user, index) {
    if (Meteor.user().username !== user.username) {
      return <UserCard key={index} club={this.props.clubs} user={user}/>;
    }
    return null;
  }

  displayAddAnnouncements() {
    if (Meteor.user() !== null && this.props.clubs.leader.includes(Meteor.user().username)) {
      return (
      <AutoForm ref={ref => { this.fRef = ref; }} schema={formSchema} onSubmit={data => this.submit(data, this.fRef)}>
        <h2>Make an Announcement!</h2>
        <Segment>
          <TextField name='title'/>
          <LongTextField name='description'/>
          <SubmitField value='Submit'/>
          <ErrorsField/>
        </Segment>
      </AutoForm>
      );
    }
    return null;
  }

  displayAnnouncements(announcement, index) {
    if (this.props.clubs.name === announcement.club) {
      return (<AnnouncementPost key={index} announcement={announcement}/>);
    }
    return null;
  }

  displayLeaders() {
    if (Array.isArray(this.props.clubs.leader)) {
      let result = this.props.clubs.leader[0];
      for (let i = 1; i < this.props.clubs.leader.length; i++) {
        result += `, ${this.props.clubs.leader[i]}`;
      }
      return result;
    }
    return this.props.clubs.leader;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    if (!this.state.club) {
      this.setState({ club: this.props.clubs });
    }
    const { activeItem } = this.state;
    const image = 'https://pbs.twimg.com/profile_images/1052001602628857856/AGtSZNoO_400x400.jpg';
    if (this.props.clubs === undefined) {
      return (
        <h1>ERROR 404: Yo put in something that exists</h1>
      );
    }
    return (
      <div className="profile">
        <Grid>
          <Grid.Column width={4} className="user_info">
            <Image className="profile_picture"
               src={(this.props.clubs.image !== 'N/A') ? this.props.clubs.image : image}
               alt={'Club Picture'}
               size="medium"/>
            <Header className="name">{this.props.clubs.name}</Header>
            {Meteor.user() ? <Button color={Meteor.user().profile.clubs.joined.includes(this.props.clubs.name) ?
                'red' : 'blue'} style={{ marginLeft: '1.5em' }}
                 content={Meteor.user().profile.clubs.joined.includes(this.props.clubs.name) ?
                'Leave Club' : 'Join'} onClick={() => this.toggleJoin(this.props.clubs.name)}/> :
            <Button as={NavLink} exact to={''} style={{ marginLeft: '1.5em' }} content={'Join'}/>}

            {Meteor.user() ? <Button color={Meteor.user().profile.clubs.favorite.includes(this.props.clubs.name) ?
                'red' : 'blue'} style={{ marginLeft: '1.5em' }}
                 content={Meteor.user().profile.clubs.favorite.includes(this.props.clubs.name) ?
                'Unfavorite' : 'Favorite'} onClick={() => this.toggleFavorite(this.props.clubs.name)}/> :
            <Button as={NavLink} style={{ marginLeft: '1.5em' }} exact to={''} content={'Favorite'}/>}

            <h2 className="heading">Leader</h2>
            <h3 style={{ marginLeft: '1.5em' }}>{this.displayLeaders()}</h3>
            <h4 style={{ marginLeft: '1.5em' }}>{this.props.clubs.email}</h4>
            <hr style={{ marginLeft: '1em' }}/>
            <Header className="heading">Our Website</Header>
            <h4 style={{ marginLeft: '1.5em' }}><a target="_blank" rel='noopener noreferrer'
             href={`//${this.props.clubs.website.toString()}`}>{this.props.clubs.website}</a></h4>
            <hr style={{ marginLeft: '1em' }}/>
            <Header className={'heading'}>Interests</Header>
            <List bulleted className="list">
              {this.props.clubs.tags.map((m, index) => <List.Item key={index}>{m}</List.Item>)}
            </List>
          </Grid.Column>

          <Grid.Column width={12} className="club_info">
            {Meteor.user() && this.props.clubs.leader.includes(Meteor.user().username) ?
              <Button as={NavLink} exact to={`/editclub/${this.props.clubs._id}`} content={'Manage Club Info'}/> : ''}
            <Menu pointing secondary>
              <Menu.Item name="About-Us" active={activeItem === 'About-Us'} onClick={this.handleMenuClick}/>
              <Menu.Item name={'Members'} active={activeItem === 'Members'} onClick={this.handleMenuClick}/>
            </Menu>
            <Container>
              <Card.Group>
                {this.displayActiveItem(activeItem)}
              </Card.Group>
            </Container>
          </Grid.Column>

        </Grid>
      </div>
      );
    }
}

/** Require an array of Stuff documents in the props. */
ClubPage.propTypes = {
  clubs: PropTypes.object.isRequired,
  interests: PropTypes.array.isRequired,
  majors: PropTypes.array.isRequired,
  ready: PropTypes.bool.isRequired,
  users: PropTypes.array.isRequired,
  announcements: PropTypes.array.isRequired,
  id: PropTypes.string.isRequired,
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
    clubs: Clubs.findOne({ _id: documentId }),
    id: documentId,
    announcements: Announcements.find({}).fetch(),
    users: Meteor.users.find({}).fetch(),
    ready: interests_sub.ready() && majors_sub.ready() && clubs_sub.ready() && announcements_sub.ready() &&
      users_sub.ready(),
  };
})(ClubPage);
