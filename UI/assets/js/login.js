/* eslint-disable no-undef */

const error = document.getElementById('error');
const exitError = document.getElementById('exit-error');
const errorDiv = document.getElementById('error-div');
const loader = document.getElementById('loader');

const form = document.getElementById('login-form');
const route = 'https://questioner-mchardex.herokuapp.com/api/v1/auth/login';

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
const loginUser = () => {
  const loginDetails = {
    email: form.email.value,
    password: form.password.value,
  };

  fetch(route, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(loginDetails),
  })
    .then(response => response.json())
    .then((data) => {
      if (data.error) {
        error.innerHTML = 'Invalid email or password';
        errorDiv.style.display = 'block';
        loader.style.display = 'none';
        hideError();
      } else {
        errorDiv.style.display = 'none';
        loader.style.display = 'none';
        localStorage.setItem('token', data.data[0].token);
        localStorage.setItem('user', JSON.stringify(data.data[0].user));
        if (data.data[0].user.isAdmin) {
          window.location.href = 'admin.html';
        } else {
          window.location.href = 'meetups.html';
        }
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
  loginUser();
});
