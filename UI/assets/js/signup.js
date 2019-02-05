/* eslint-disable no-undef */
const error = document.getElementById('error');
const exitError = document.getElementById('exit-error');
const errorDiv = document.getElementById('error-div');
const successMsg = document.getElementById('success');
const loader = document.getElementById('loader');

const form = document.getElementById('signup-form');
const route = 'https://questioner-mchardex.herokuapp.com/api/v1/auth/signup';

// clear error message
exitError.addEventListener('click', (e) => {
  e.preventDefault();
  errorDiv.style.display = 'none';
});

// clear error after 15seconds
const hideError = () => {
  setTimeout(() => {
    errorDiv.style.display = 'none';
  }, 15000);
};

// get form details
const signupUser = () => {
  const signupDetails = {
    firstname: form.firstname.value,
    lastname: form.lastname.value,
    othername: form.othername.value,
    username: form.username.value,
    email: form.email.value.toLowerCase(),
    phoneNumber: form.phoneNumber.value,
    password: form.password.value,
  };
  fetch(route, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(signupDetails),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        loader.style.display = 'none';
        error.innerHTML = data.error;
        errorDiv.style.display = 'block';
        successMsg.style.visibility = 'hidden';
        hideError();
      } else {
        successMsg.style.visibility = 'visible';
        loader.style.display = 'none';
        errorDiv.style.display = 'none';
        form.reset();
        localStorage.setItem('token', data.data.token);
      }
    })
    .catch((err) => {
      error.innerHTML = 'slow or no connection...try reconnecting';
      errorDiv.style.display = 'block';
      loader.style.display = 'none';
      throw new Error(err);
    });
};

// submit signup form
form.addEventListener('submit', (e) => {
  e.preventDefault();
  loader.style.display = 'flex';
  errorDiv.style.display = 'none';
  successMsg.style.visibility = 'hidden';
  signupUser();
});
