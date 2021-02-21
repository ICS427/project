import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Announcements } from '../../api/announcement/Announcements';
import { Interests } from '../../api/interest/Interest';
import { Clubs } from '../../api/club/Club';
import { Majors } from '../../api/major/Major';

function addAnnouncements(data) {
  console.log(`  Adding: ${data.title} (${data.owner})`);
  console.log(data);
  Announcements.insert(data);
}

function addInterest(data) {
  console.log(`  Adding: ${data.name}`)
  Interests.insert(data);
}

function addClub(data) {
  console.log(`  Adding: ${data.name}`);
  // eslint-disable-next-line no-param-reassign
  data.leader = [data.leader, 'admin'];
  Clubs.insert(data);
  try {
    Accounts.createUser({
      username: data.leader[0],
      email: data.email,
      password: 'changeme',
      profile: {
        image: 'images/empty-profile.png',
        leader: '',
        clubs: { joined: [data.name], favorite: [], banned: [] },
        interests: [],
        majors: [],
      },
    });
  } catch (e) {
    console.log(e);
    // Do not create second account for users that already exist
  }
}

function addMajor(data) {
  console.log(`  Adding: ${data.name}`);
  Majors.insert(data);
}

/** Initialize the collection if empty. */
if (Announcements.find().count() === 0) {
  if (Meteor.settings.defaultAnnouncements) {
    console.log('Creating default announcements.');
    Meteor.settings.defaultAnnouncements.map(data => addAnnouncements(data));
  }
}

if (Clubs.find().count() === 0) {
  console.log('Creating default clubs');
  const clubJSON = JSON.parse(Assets.getText('RIOS.json')).RIOS;
  if (clubJSON.length !== 0) {
    clubJSON.map(data => addClub(data));
  }
}

if (Interests.find().count() === 0) {
  console.log('Creating default interests.');
  const interestJSON = JSON.parse(Assets.getText('Interests.json')).Interest;
  if (interestJSON.length !== 0) {
    interestJSON.map(data => addInterest(data));
  }
}

if (Majors.find().count() === 0) {
  console.log('Creating default majors');
  const majorJSON = JSON.parse(Assets.getText('Majors.json')).Majors;
  if (majorJSON !== 0) {
    majorJSON.map(data => addMajor(data));
  }
}
