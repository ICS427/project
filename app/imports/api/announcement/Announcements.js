import { Mongo } from 'meteor/mongo';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Announcements = new Mongo.Collection('Announcements');

/** Define a schema to specify the structure of each document in the collection. */
const AnnouncementSchema = new SimpleSchema({
  title: String,
  description: String,
  owner: String,
  club: String,

}, { tracker: Tracker });

/** Attach this schema to the collection. */
Announcements.attachSchema(AnnouncementSchema);

/** Make the collection and schema available to other code. */
export { Announcements, AnnouncementSchema };
