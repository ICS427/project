import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Majors = new Mongo.Collection('Majors');

/** Define a schema to specify the structure of each document in the collection. */
const MajorSchema = new SimpleSchema({
  name: String,

}, { tracker: Tracker });

/** Attach this schema to the collection. */
Majors.attachSchema(MajorSchema);

/** Make the collection and schema available to other code. */
export { Majors, MajorSchema };
