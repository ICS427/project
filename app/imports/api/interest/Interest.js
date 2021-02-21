import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Interests = new Mongo.Collection('Interests');

/** Define a schema to specify the structure of each document in the collection. */
const InterestSchema = new SimpleSchema({
  name: String,
  associated_clubs: [String],

}, { tracker: Tracker });

/** Attach this schema to the collection. */
Interests.attachSchema(InterestSchema);

/** Make the collection and schema available to other code. */
export { Interests, InterestSchema };
