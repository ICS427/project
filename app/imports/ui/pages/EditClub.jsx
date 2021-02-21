import React from 'react';
import { Grid, Loader, Header, Segment, Button } from 'semantic-ui-react';
import { Clubs, ClubSchema } from '/imports/api/club/Club';
import swal from 'sweetalert';
import AutoForm from 'uniforms-semantic/AutoForm';
import TextField from 'uniforms-semantic/TextField';
import HiddenField from 'uniforms-semantic/HiddenField';
import ErrorsField from 'uniforms-semantic/ErrorsField';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import 'uniforms-bridge-simple-schema-2';
import LongTextField from 'uniforms-semantic/LongTextField';
import { NavLink } from 'react-router-dom'; // required for Uniforms

/** Renders the Page for editing a single document. */
class EditClub extends React.Component {

  /** On successful submit, insert the data. */
  submit(data) {
    const { subname, image, description, leader, email, website, _id } = data;
    Clubs.update(_id, { $set: { subname, image, description, leader, email, website } }, (error) => (error ?
        swal('Error', error.message, 'error') :
        swal('Success', 'Club updated successfully', 'success')));
  }

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the form. Use Uniforms: https://github.com/vazco/uniforms */
  renderPage() {
    return (
        <Grid container centered>
          <Grid.Column>
            <Header as="h2" textAlign="center">Edit Club Information</Header>
            <Header as="h2" textAlign="center">{this.props.club.name}</Header>
            <AutoForm schema={ClubSchema} onSubmit={data => this.submit(data)} model={this.props.club}>
              <Segment>
                <TextField label='Club Acronym' name='subname'/>
                <TextField label='Club Image Link' name='image'/>
                <LongTextField label={'Club Description'} name='description'/>
                <HiddenField name='leader'/>
                <TextField label='Club Leader Email' name='email'/>
                <TextField label='Club Website' name='website'/>
                <Button primary type={'submit'} content={'Update Info'} value='Submit'/>

                <Button secondary style={{ float: 'right' }} as={NavLink}
                  exact to={`/clubpage/${this.props.club._id}`} content={'Back to Club Page'}/>

                <ErrorsField/>
                <HiddenField name='name' />
                <HiddenField name='tags' />
                <HiddenField name='members' />
              </Segment>
            </AutoForm>



          </Grid.Column>
        </Grid>
    );
  }
}

/** Require the presence of a Stuff document in the props object. Uniforms adds 'model' to the props, which we use. */
EditClub.propTypes = {
  club: PropTypes.object,
  model: PropTypes.object,
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(({ match }) => {
  // Get the documentID from the URL field. See imports/ui/layouts/App.jsx for the route containing :_id.
  const documentId = match.params._id;
  // Get access to Stuff documents.
  const subscription = Meteor.subscribe('Clubs');
  return {
    club: Clubs.findOne({ _id: documentId }),
    ready: subscription.ready(),
  };
})(EditClub);
