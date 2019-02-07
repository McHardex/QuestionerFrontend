/* eslint-disable no-undef */

const meetups = document.getElementById('meetups');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const overlay = document.getElementById('overlay');
const form = document.getElementById('create-meetup');
const submitEdit = document.getElementsByClassName('editform');
const tag1 = document.getElementById('tag1');
const tag2 = document.getElementById('tag2');
const tag3 = document.getElementById('tag3');

const editTag1 = document.getElementById('edit-tag1');
const editTag2 = document.getElementById('edit-tag2');
const editTag3 = document.getElementById('edit-tag3');

const error = document.getElementById('error');
const exitError = document.getElementById('exit-error');
const errorDiv = document.getElementById('error-div');
const successMsg = document.getElementById('success');
const editSuccess = document.getElementById('edit-success');
const loader = document.getElementById('loader');

const route = 'https://questioner-mchardex.herokuapp.com/api/v1/meetups';
const token = localStorage.getItem('token');

let meetupData = '';
// load meetups on page load
const getAllMeetups = () => {
  fetch(route, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    method: 'GET',
    mode: 'cors',
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        meetups.innerHTML = 'No meetup record yet';
        loader.style.display = 'none';
      } else {
        meetupData = data.data;
        meetupData.sort((a, b) => b.id - a.id);
        meetupData.map((meetup) => {
          loader.style.display = 'none';
          let meet = `<div class="meetup-cont" id=${meetup.id}>`;
          meet += '<div class="meetup-text">';
          meet += `<p>${new Date(meetup.happeningon).toDateString()}</p>`;
          meet += `<h3>${meetup.topic}</h3>`;
          meet += `<p>${meetup.location}</p>`;
          meet += `<span>${meetup.tags.join(' ')}</span>`;
          meet += '</div>';
          meet += `<i class="fas fa-trash" title="delete" id=${meetup.id}></i>`;
          meet += `<i class="far fa-edit" title="edit" id=${meetup.id}></i>`;
          meet += '</div>';
          meetups.innerHTML += meet;
          return meetup;
        });
      }
    })
    .catch((err) => {
      throw new Error(err);
    });
};

window.onload = () => {
  loader.style.display = 'flex';
  getAllMeetups();
};

// clear form error message
exitError.addEventListener('click', (e) => {
  e.preventDefault();
  errorDiv.style.display = 'none';
});

// clear form error after 15seconds
const hideError = () => {
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 15000);
};

// admin create meetup
const createMeetup = () => {
  const tagsValue1 = tag1.value.toLowerCase();
  const tagsValue2 = tag2.value.toLowerCase();
  const tagsValue3 = tag3.value.toLowerCase();
  const tagsArray = [tagsValue1, tagsValue2, tagsValue3];
  const meetupDetails = {
    topic: form.topic.value,
    happeningOn: form.happeningOn.value,
    location: form.location.value,
    tags: tagsArray,
  };
  fetch(route, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    method: 'POST',
    mode: 'cors',
    body: JSON.stringify(meetupDetails),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        error.innerHTML = data.error;
        loader.style.display = 'none';
        errorDiv.style.display = 'block';
        successMsg.style.visibility = 'hidden';
        hideError();
      } else {
        successMsg.style.visibility = 'visible';
        loader.style.display = 'none';
        errorDiv.style.display = 'none';
        form.reset();
        setTimeout(() => {
          getAllMeetups();
          window.location.reload();
        }, 1000);
      }
    })
    .catch((err) => {
      error.innerHTML = 'slow or no connection...try reconnecting';
      errorDiv.style.display = 'block';
      loader.style.display = 'none';
      throw new Error(err);
    });
};

form.addEventListener('submit', (e) => {
  e.preventDefault();
  loader.style.display = 'flex';
  createMeetup();
});

// delete meetup
meetups.addEventListener('click', (e) => {
  if (e.target.id && e.target.classList.contains('fa-trash')) {
    loader.style.display = 'flex';
    e.preventDefault();
    fetch(`${route}/${e.target.id}`, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      method: 'DELETE',
      mode: 'cors',
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          error.innerHTML = data.error;
          errorDiv.style.display = 'block';
          editSuccess.style.visibility = 'hidden';
          loader.style.display = 'none';
          hideError();
        } else {
          errorDiv.style.display = 'none';
          loader.style.display = 'none';
          setTimeout(() => {
            getAllMeetups();
            window.location.reload();
          }, 1000);
        }
      })
      .catch((err) => {
        loader.style.display = 'none';
        throw new Error(err);
      });
  }
});

// edit meetup
meetups.addEventListener('click', (e) => {
  if (e.target.id && e.target.classList.contains('fa-edit')) {
    loader.style.display = 'flex';
    const { id } = e.target;
    fetch(`${route}/${id}`, {
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'x-auth-token': token,
      },
    })
      .then(response => response.json())
      .then((data) => {
        if (data.error) {
          loader.style.display = 'none';
          throw new Error(data.error);
        } else {
          const resp = data.data[0];
          localStorage.setItem('meetupDetails', JSON.stringify(resp));
          modal.style.display = 'block';
          meetups.style.display = 'none';
          overlay.style.visibility = 'visible';
          submitEdit[0].setAttribute('id', `${id}`);
          loader.style.display = 'none';
          setTimeout(() => {
            // set default value for edit form input
            const editDefaultvalue = JSON.parse(localStorage.getItem('meetupDetails'));
            document.getElementById('topic').defaultValue = editDefaultvalue.topic;
            document.getElementById('happeningOn').defaultValue = editDefaultvalue.happeningon;
            document.getElementById('location').defaultValue = editDefaultvalue.location;
            const firstTag = editDefaultvalue.tags[0];
            const secondTag = editDefaultvalue.tags[1];
            const thirdTag = editDefaultvalue.tags[2];
            editTag1.defaultValue = firstTag;
            editTag2.defaultValue = secondTag;
            editTag3.defaultValue = thirdTag;
          }, 1000);
        }
      });
  }
});

// close form edit modal
closeModal.addEventListener('click', (e) => {
  e.preventDefault();
  getAllMeetups();
  window.location.reload();
  meetups.style.display = 'grid';
  overlay.style.visibility = 'hidden';
  modal.style.display = 'none';
});

// submit form edit
submitEdit[0].addEventListener('submit', (e) => {
  loader.style.display = 'flex';
  e.preventDefault();
  const tagsValue1 = editTag1.value;
  const tagsValue2 = editTag2.value;
  const tagsValue3 = editTag3.value;
  const tagsArray = [tagsValue1, tagsValue2, tagsValue3];
  const meetupDetails = {
    topic: document.getElementById('topic').value,
    happeningOn: document.getElementById('happeningOn').value,
    location: document.getElementById('location').value,
    tags: tagsArray,
  };
  fetch(`${route}/${e.target.id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'x-auth-token': token,
    },
    method: 'PUT',
    mode: 'cors',
    body: JSON.stringify(meetupDetails),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        error.innerHTML = data.error;
        errorDiv.style.display = 'block';
        editSuccess.style.visibility = 'hidden';
        loader.style.display = 'none';
        hideError();
      } else {
        // clear edit form input value on submit
        document.getElementById('topic').value = '';
        document.getElementById('happeningOn').value = '';
        document.getElementById('location').value = '';
        editTag1.value = '';
        editTag2.value = '';
        editTag3.value = '';


        editSuccess.style.visibility = 'visible';
        errorDiv.style.display = 'none';
        loader.style.display = 'none';
        setTimeout(() => {
          editSuccess.style.visibility = 'hidden';
        }, 10000);
      }
    })
    .catch((err) => {
      loader.style.display = 'none';
      throw new Error(err);
    });
});

// search feature
const searchForm = document.getElementById('search-bar');

searchForm.addEventListener('keyup', (e) => {
  meetups.innerHTML = '';
  const searchValue = searchForm.search.value.toString();
  const valueStr = searchValue.toLowerCase();
  e.preventDefault();
  meetupData.filter((meetupList) => {
    if (meetupList.topic.toLowerCase().includes(valueStr)
    || meetupList.tags.join(' ').toLowerCase().includes(valueStr)
    || meetupList.location.toLowerCase().includes(valueStr)) {
      let meet = `<div class="meetup-cont" id=${meetupList.id}>`;
      meet += `<div class="meetup-text" id=${meetupList.id}>`;
      meet += `<p>${new Date(meetupList.happeningon).toDateString()}</p>`;
      meet += `<h3 id=${meetupList.id} class="meetup-topic">${meetupList.topic}</h3>`;
      meet += `<p>${meetupList.location}</p>`;
      meet += `<span>${meetupList.tags.join(' ')}</span>`;
      meet += '</div>';
      meet += '</div>';
      meetups.innerHTML += meet;
    }
    return meetupList;
  });
});
