import './style.css';
import { faker } from '@faker-js/faker';

const allUsers = faker.helpers.multiple(
  () => ({
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    company: Math.random() > 0.4 ? faker.company.name() : '',
    job: faker.person.jobType(),
    country: faker.location.country(),
    date: new Date(
      2000 + Math.floor(Math.random() * 23.5),
      0,
      Math.ceil(Math.random() * 365)
    ),
  }),
  { count: 16 }
);

const managementJobs = ['Manager', 'Supervisor'];

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

function renderUsers(users) {
  const usersHTML = users
    .map(
      ({ username, job, avatar, company, country, date }) => `<div>
        <img src="${avatar}" />
        <span>${username} - ${job}</span>
        <sm>${company || 'Unemployed'}</sm>
        <div title="${country}">${country}</div>
        <p>${date.getFullYear() + '-' + date.getMonth()}</p>
      </div>`
    )
    .join('');
  document.querySelector('#users').innerHTML = usersHTML;
}

window.setFilter = setFilter;

function setFilter(index) {
  const filterEls = Array.from(document.querySelectorAll('#filters > div'));
  filterEls.forEach((el, i) => el.classList.toggle('selected', i === index));
  allFilters[index][1]();
}

function renderFilters(filters) {
  const usersHTML = filters
    .map(
      ([text], i) => `<div onclick="setFilter(${i})">
        <span>${text}</span>
      </div>`
    )
    .join('');
  document.querySelector('#filters').innerHTML = usersHTML;
}
