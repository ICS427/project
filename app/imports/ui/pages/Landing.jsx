import React from 'react';
import { Header, Image, Card, Loader } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { Clubs } from '../../api/club/Club';
import { ClubCard } from '../components/ClubCard';

/**
 * Signup component is similar to signin component, but we create a new user instead.
 */
class Landing extends React.Component {
  render() {
    if (!this.props.ready) {
      return <Loader active>Getting data</Loader>;
    }
    const results = [];
    for (let i = 0; i < 3; i++) {
      const found = this.props.clubs[Math.floor(Math.random() * this.props.clubs.length)];
      if (!results.includes(found)) {
        results.push(found);
      }
    }
    console.log(results);
    return (
        <div className="landing-body">
          <div className="img-background">
            <Image src="/images/hubforclubbackground.png" style={{ marginTop: '-10%' }} fluid />
            <div className="content2">
              <Header as="h1" size='medium' color='yellow'>
                Hub for Clubs
              </Header>
              <div className="description">
                <Header as="h3" inverted>
                  With more than 200 registered clubs at the University of Hawai&apos;i at Manoa, it can be
                  challenging to find ones that align with your interests. Hub for Clubs provides a way for students to
                  quickly search for clubs that are right for them!
                </Header>
              </div>
            </div>
          </div>
          <div className="featured-clubs">
            <Header as="h1" textAlign="center" size='huge' color='yellow'>
              Featured Clubs
            </Header>
          </div>
          <div className='card-layout'>
            <Card.Group centered style={{ marginTop: '10%' }}>
              {results.map((result, index) => <ClubCard key={index} club={result}/>)}
            </Card.Group>
          </div>
        </div>
    );
  }
}

Landing.propTypes = {
  ready: PropTypes.bool.isRequired,
  clubs: PropTypes.array.isRequired,
};

export default withTracker(() => {
  // Get access to Stuff documents.
  const clubs_sub = Meteor.subscribe('Clubs');

  return {
    clubs: Clubs.find({}).fetch(),
    ready: clubs_sub.ready(),
  };
})(Landing);
