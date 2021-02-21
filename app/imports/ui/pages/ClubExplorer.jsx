import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Loader, Menu, Segment, Card, Grid, Button, Form, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import ClubCard from '../components/ClubCard';
import { Clubs } from '../../api/club/Club';
import { Interests } from '../../api/interest/Interest';

/** Renders a table containing all of the Stuff documents. Use <StuffItem> to render each row. */
class ClubExplorer extends React.Component {
  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */

  state = { selectedTags: [], pageNumber: 0, search: '', cardCount: 0 };

  render() {
    return this.props.ready ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  getCard(club, index) {
    return <ClubCard key={index} club={club} style={{ padding: '20px 20px 20px 20px' }}/>;
  }

  selectTag(name) {
    if (this.state.selectedTags.includes(name)) {
      this.setState({ selectedTags: this.state.selectedTags.filter((value) => value !== name) });
    } else {
      this.setState({ selectedTags: this.state.selectedTags.concat([name]) });
    }
    this.setState({ pageNumber: 0 });
  }

  doesClubMatchInterest(club) {
    let count = 0;
    for (let i = 0; i < this.state.selectedTags.length; i++) {
      if (club.tags.includes(this.state.selectedTags[i].toLowerCase())) {
        count += 1;
      }
    }
    return count === this.state.selectedTags.length;
  }

  handleChange = (e, { name, value }) => {
    this.setState({ pageNumber: 0 });
    this.setState({ [name]: value });
  };

  nextPage = () => {
    this.setState({ pageNumber: this.state.pageNumber + 1 });
  };

  previousPage = () => {
    this.setState({ pageNumber: this.state.pageNumber - 1 });
  };

  /** Render the page once subscriptions have been received. */
  renderPage() {
    let display = this.props.clubs.filter((club) => (this.doesClubMatchInterest(club)));
    display = display.filter((club) => club.name.toLowerCase().indexOf(this.state.search.toLowerCase()) > -1);
    const size = display.length;
    display = display.filter((club, i) => i >= this.state.pageNumber * 12 && i < (this.state.pageNumber + 1) * 12);
    return (
        <div className="club-explorer-background">
            <Grid>
            <Grid.Column width={3}>
              <Menu fitted fluid vertical tabular>
                <Segment>
                  <Form >
                    <Form.Input onChange={this.handleChange} name='search'
                                className='icon' icon='search' placeholder='Search...' />
                  </Form>
                {this.props.interests.map((interest, index) => <Menu.Item key={index}
                                 style={{ color: this.state.selectedTags.includes(interest.name) ? 'green' : 'black' }}
                                 content={ this.state.selectedTags.includes(interest.name) ? <div>{interest.name}
                                 <Icon name={'check'}/></div> : interest.name }
                                 onClick={() => this.selectTag(interest.name)}/>)}
                </Segment>
              </Menu>
            </Grid.Column>
            <Grid.Column width={12} relaxed>
              <div className="grid-bg">
              {
                <Card.Group centered stretched relaxed fluid itemsPerRow={5}>
                  {display.map((club, index) => this.getCard(club, index))}
                </Card.Group>
              }
              {this.state.pageNumber > 0 ? <Button onClick={this.previousPage}>Back</Button> : null}
              {(this.state.pageNumber + 1) * 12 < size ? <Button onClick={this.nextPage}>Next</Button> : null}
              </div>
            </Grid.Column>
            </Grid>
        </div>
    );
  }
}

/** Require an array of Stuff documents in the props. */
ClubExplorer.propTypes = {
  ready: PropTypes.bool.isRequired,
  clubs: PropTypes.array.isRequired,
  interests: PropTypes.array.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Get access to Stuff documents.
  const clubs_sub = Meteor.subscribe('Clubs');
  const interests_sub = Meteor.subscribe('Interests');

  return {
    interests: Interests.find({}).fetch(),
    clubs: Clubs.find({}).fetch(),
    ready: clubs_sub.ready() && interests_sub.ready(),
  };
})(ClubExplorer);
