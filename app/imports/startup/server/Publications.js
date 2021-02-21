import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import { Announcements } from '../../api/announcement/Announcements';
import { Interests } from '../../api/interest/Interest';
import { Clubs } from '../../api/club/Club';
import { Majors } from '../../api/major/Major';

/** This subscription publishes only the documents associated with the logged in user */
Meteor.publish('Announcements', function publish() {
  return Announcements.find();
});

Meteor.publish('Interests', function publish() {
  return Interests.find();
});

Meteor.publish('Majors', function publish() {
  return Majors.find();
});

Meteor.publish('Clubs', function publish() {
  return Clubs.find();
});

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find();
  } else {
    return this.ready();
  }
});
