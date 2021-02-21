import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import SimpleSchema from 'simpl-schema';
import { Tracker } from 'meteor/tracker';

/** Define a Mongo collection to hold the data. */
const Clubs = new Mongo.Collection('Clubs');

/** Define a schema to specify the structure of each document in the collection. */
const ClubSchema = new SimpleSchema({
  name: String,
  subname: String,
  type: String,
  image: String,
  description: String,
  leader: [String],
  email: String,
  website: String,
  tags: [String],
  members: [String],

}, { tracker: Tracker });

/** Attach this schema to the collection. */
Clubs.attachSchema(ClubSchema);

Meteor.methods({
  'club.toggleLeader'({ id, leader }) {
    new SimpleSchema({
      id: { type: String },
      leader: { type: String },
    }).validate({ id, leader });

    const club = Clubs.findOne(id);
    if (club.leader.includes(leader)) {
      Clubs.update(id, { $set: { leader: club.leader.filter((person) => person !== leader) } });
    } else {
      Clubs.update(id, { $set: { leader: club.leader.concat(leader) } });
    }
  },
});

/** Make the collection and schema available to other code. */
export { Clubs, ClubSchema };
