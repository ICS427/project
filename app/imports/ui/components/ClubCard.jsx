import React from 'react';
import { Card, Image } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter, Link } from 'react-router-dom';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
export class ClubCard extends React.Component {
  render() {
    if (!this.props.club) {
      return null;
    }
    return (
        <div className="card-shadow" style={{ padding: '4px' }}>
          {/* eslint-disable-next-line no-template-curly-in-string */}
          <Card as={Link} to={`/clubpage/${this.props.club._id}`} style={{ height: '450px' }}>
            {/* eslint-disable-next-line max-len */}
            <Image src={(this.props.club.image !== 'N/A' && this.props.club.image !== '') ? this.props.club.image : 'https://pbs.twimg.com/profile_images/1052001602628857856/AGtSZNoO_400x400.jpg'} style={{ height: '60%' }} />
            <Card.Content>
              <Card.Header>{this.props.club.name}</Card.Header>
              <Card.Meta>{(this.props.club.subname !== 'N/A') ? this.props.club.subname : '' }</Card.Meta>

              <Card.Description>
                {/* eslint-disable-next-line max-len */}
                {(this.props.club.description && this.props.club.description !== 'N/A') ? ((this.props.club.description.length >= 150) ? (this.props.club.description.slice(0, 150)).concat('...') : (this.props.club.description)) : '' }
              </Card.Description>
            </Card.Content>
          </Card>
        </div>
    );
  }
}

/** Require a document to be passed to this component. */
ClubCard.propTypes = {
  club: PropTypes.object.isRequired,
};

/** Wrap this component in withRouter since we use the <Link> React Router element. */
export default withRouter(ClubCard);
