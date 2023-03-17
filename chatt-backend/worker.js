import Bull from 'bull';


const welcomeNewMembers = Bull('welcomeNewMembers');

welcomeNewMembers.process((job, done) => {
  if (job.data.email === undefined) {
    done("No user email found");
  } else if (job.data.username === undefined) {
    done("No username found");
  } else {
    const message = "Welcome to Chatt instant messaging"
  }
});

export default welcomeNewMembers;