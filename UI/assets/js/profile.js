/* eslint-disable no-undef */

const upcomingMeetups = document.getElementById('upcoming-meetups');

const route = 'https://questioner-mchardex.herokuapp.com/api/v1/meetups/upcoming';
const token = localStorage.getItem('token');

// load meetups on page load
const getAllMeetups = () => {
  fetch(route, {
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'x-auth-token': token,
    },
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        upcomingMeetups.innerHTML = 'There are no upcoming meetups';
        loader.style.display = 'none';
      } else {
        loader.style.display = 'none';
        searchArray = data.data;
        searchArray.sort((a, b) => b.id - a.id);
        searchArray.map((meetup) => {
          let meet = `<div class="meetup-cont" id=${meetup.id}>`;
          meet += `<div class="meetup-text" id=${meetup.id}>`;
          meet += `<p>${new Date(meetup.happeningon).toDateString()}</p>`;
          meet += `<h3 id=${meetup.id} class="meetup-topic">${meetup.topic}</h3>`;
          meet += `<p>${meetup.location}</p>`;
          meet += `<span>${meetup.tags.join(' ')}</span>`;
          meet += '</div>';
          meet += '</div>';
          upcomingMeetups.innerHTML += meet;
          return meetup;
        });
      }
    });
};
window.onload = () => {
  loader.style.display = 'flex';
  getAllMeetups();
};

// get specific meetup
upcomingMeetups.addEventListener('click', (e) => {
  if (e.target.id && e.target.classList.contains('meetup-topic')) {
    loader.style.display = 'flex';
    const meetupId = e.target.id;
    fetch(`https://questioner-mchardex.herokuapp.com/api/v1/meetups/${meetupId}`, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-auth-token': token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        const resp = data.data[0];
        loader.style.display = 'none';
        localStorage.setItem('meetupDetails', JSON.stringify(resp));
        window.location.href = 'meetupDetails.html';
      });
  }
});


// get profile details
const name = document.getElementsByClassName('name');
const email = document.getElementsByClassName('email');
const noOfQuestionsPosted = document.getElementsByClassName('questions-posted');
const noOfComments = document.getElementsByClassName('question-comment');

const profile = JSON.parse(localStorage.getItem('user'));
name[0].innerHTML = `${profile.firstname} ${profile.lastname}`;
email[0].innerHTML = profile.email;

// fetch questions and get no of questions posted by user
fetch('https://questioner-mchardex.herokuapp.com/api/v1/questions', {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'x-auth-token': token,
  },
})
  .then(response => response.json())
  .then((data) => {
    if (data.error) {
      loader.style.display = 'none';
      noOfQuestionsPosted[0].innerHTML = 0;
    } else {
      loader.style.display = 'none';
      const questions = data.data.filter(question => question.createdby === profile.id);
      noOfQuestionsPosted[0].innerHTML = questions.length;
    }
  })
  .catch((err) => { throw new Error(err); });

// fetch comments and get total no of questions commentted on by active user
fetch(`https://questioner-mchardex.herokuapp.com/api/v1/comments/${profile.id}`, {
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'x-auth-token': token,
  },
})
  .then(response => response.json())
  .then((data) => {
    if (data.error) {
      noOfComments[0].innerHTML = 0;
      loader.style.display = 'none';
    } else {
      noOfComments[0].innerHTML = data.data.length;
      loader.style.display = 'none';
    }
  })
  .catch((err) => { throw new Error(err); });
