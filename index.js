import './style.css';
import { faker } from '@faker-js/faker';

const initalUserCount = 16;
const usersPerPage = 4;

let userCount = initalUserCount;
let page = 0;
let curFilter;

let allUsers;
const myStorage = window.localStorage;

const updateUsers = () => {
  myStorage.setItem('users', JSON.stringify(allUsers));
  setFilter(curFilter);
};

const removeUser = (index) => {
  allUsers.splice(index, 1);
  updateUsers();
};

const loadNewUsers = () => {
  allUsers = faker.helpers.multiple(
    () => ({
      userId: faker.string.uuid(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      avatar: faker.image.avatar(),
      company: Math.random() > 0.4 ? faker.company.name() : '',
      job: faker.person.jobType(),
      country: faker.location.country(),
      dateJoined:
        2000 +
        Math.ceil(Math.random() * 23) +
        ' - ' +
        Math.ceil(Math.random() * 12),
    }),
    { count: initalUserCount }
  );
  myStorage.setItem('users', JSON.stringify(allUsers));
};

// setup users on reload
if (myStorage.getItem('users')) {
  allUsers = JSON.parse(myStorage.getItem('users'));
} else {
  loadNewUsers();
}

let managementJobs = ['Manager', 'Supervisor', 'Director', 'Executive'];

const allFilters = [
  ['All', () => renderUsers(allUsers)],
  ['Employed', () => renderUsers(allUsers.filter((user) => user.company))],
  ['Unemployed', () => renderUsers(allUsers.filter((user) => !user.company))],
  [
    'Management',
    () =>
      renderUsers(allUsers.filter((user) => managementJobs.includes(user.job))),
  ],
];

renderFilters(allFilters);
setFilter(0);
renderPaginationElements();

function renderUsers(users) {
  userCount = users.length;

  let curUsers = users.slice(
    page * usersPerPage,
    page * usersPerPage + usersPerPage
  );

  const usersHTML = curUsers
    .map(
      (
        { username, avatar, company, country, job, dateJoined, userId },
        index
      ) => `<div>
        <img src="${avatar}" />
        <span>${username}</span>
        <sm>${company || 'Unemployed'} </sm>
        <div title="${country}">${country}</div>
        <p id = "removeBtn" key="${index}"><strong>x</strong></p>
        <p>${job}</p>
        <p>${dateJoined}</p>
      </div>`
    )
    .join('');
  document.querySelector('#users').innerHTML = usersHTML;

  const removeBtn = document.getElementById('removeBtn');
  removeBtn.addEventListener(
    'click',
    removeUser.bind(null, removeBtn.accessKey)
  );
}

window.setFilter = setFilter;

function setFilter(index) {
  curFilter = index;
  const filterEls = Array.from(document.querySelectorAll('#filters > div'));
  filterEls.forEach((el, i) => el.classList.toggle('selected', i === index));
  allFilters[index][1]();
}

function renderFilters(filters) {
  const usersHTML = filters
    .map(
      ([text], i) => `<div onclick="setFilter(${i});">
        <span>${text}</span>
      </div>`
    )
    .join('');
  document.querySelector('#filters').innerHTML = usersHTML;
}

function renderPaginationElements() {
  const decrease = () => {
    page > 0 ? page-- : page;
    renderPaginationElements();
    setFilter(curFilter);
  };

  const increase = () => {
    page < userCount / usersPerPage - 1 ? page++ : page;
    renderPaginationElements();
    setFilter(curFilter);
  };

  const usersHTML = `
    <div>
      <button id="decrBtn"><</button>
      <p>${page + 1}</p>
      <button id="incrBtn">></button>
    </div>
  `;

  document.querySelector('#paginationElements').innerHTML = usersHTML;

  const decrBtn = document.getElementById('decrBtn');
  const incrBtn = document.getElementById('incrBtn');

  decrBtn.addEventListener('click', decrease);
  incrBtn.addEventListener('click', increase);
}
