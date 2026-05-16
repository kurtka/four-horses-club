const tickerContent = `
  <div class="ticker__track"></div>
`;

const tickerTexts = [
  'Дело помощи утопающим — дело рук самих утопающих!',
  'Шахматы двигают вперед не только культуру, но и экономику!',
  'Лед тронулся, господа присяжные заседатели!'
];

const defaultAvatar = 'assets/images/avatar.svg';

document.querySelectorAll('.ticker').forEach(ticker => {
  ticker.innerHTML = tickerContent;

  const tickerTrack = ticker.querySelector('.ticker__track');

  const tickerItems = tickerTexts.map(text => {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  });

  function buildTicker() {
    tickerTrack.replaceChildren();

    const group = document.createElement('div');
    group.className = 'ticker__group';

    tickerTrack.append(group);

    while (group.scrollWidth < ticker.offsetWidth + 80) {
      tickerItems.forEach(item => {
        group.append(item.cloneNode(true));
      });
    }

    const clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');

    tickerTrack.append(clone);
  }

  buildTicker();

  window.addEventListener('resize', buildTicker);
});

const members = [
  {
    name: 'Хозе-Рауль Капабланка',
    role: 'Чемпион мира по шахматам',
    avatar: '',
    link: ''
  },
  {
    name: 'Эммануил Ласкер',
    role: 'Чемпион мира по шахматам',
    avatar: '',
    link: ''
  },
  {
    name: 'Александр Алехин',
    role: 'Чемпион мира по шахматам',
    avatar: '',
    link: ''
  },
  {
    name: 'Арон Нимцович',
    role: 'Гроссмейстер',
    avatar: '',
    link: ''
  },
  {
    name: 'Рихард Рети',
    role: 'Гроссмейстер',
    avatar: '',
    link: ''
  },
  {
    name: 'Остап Бендер',
    role: 'Гроссмейстер',
    avatar: '',
    link: ''
  }
];

const membersTrack = document.querySelector('[data-members-track]');

membersTrack.innerHTML = members
  .map(
    member => `
    <article class="member">
      <img src="${member.avatar || defaultAvatar}" alt="${member.name}" />
      <h3>${member.name}</h3>
      <p>${member.role}</p>
      <a href="${member.link || `https://ya.ru/search/?text=${member.name.replace(' ', '+')}`}" target="_blank">Подробнее</a>
    </article>
  `
  )
  .join('');

const membersPrev = document.querySelector('[data-members-prev]');
const membersNext = document.querySelector('[data-members-next]');
const membersCurrent = document.querySelector('[data-members-current]');
const membersTotal = document.querySelector('[data-members-total]');
const memberCards = [...document.querySelectorAll('.member')];

let membersIndex = 0;
let membersTimer;

function getVisibleMembers() {
  if (window.matchMedia('(max-width: 620px)').matches) return 1;
  if (window.matchMedia('(max-width: 1300px)').matches) return 2;
  return 3;
}

function updateMembers() {
  const visible = getVisibleMembers();
  const maxIndex = Math.max(0, memberCards.length - visible);
  if (membersIndex > maxIndex) membersIndex = 0;
  const step = 100 / visible;
  membersTrack.style.transform = `translateX(-${membersIndex * step}%)`;
  membersCurrent.textContent = String(Math.min(membersIndex + visible, memberCards.length));
  membersTotal.textContent = String(memberCards.length);
}

function moveMembers(direction) {
  const maxIndex = Math.max(0, memberCards.length - getVisibleMembers());
  if (direction > 0) {
    membersIndex = membersIndex >= maxIndex ? 0 : membersIndex + 1;
  } else {
    membersIndex = membersIndex <= 0 ? maxIndex : membersIndex - 1;
  }
  updateMembers();
}

function restartMembersAuto() {
  clearInterval(membersTimer);
  membersTimer = setInterval(() => moveMembers(1), 4000);
}

membersPrev.addEventListener('click', () => {
  moveMembers(-1);
  restartMembersAuto();
});

membersNext.addEventListener('click', () => {
  moveMembers(1);
  restartMembersAuto();
});

window.addEventListener('resize', updateMembers);
updateMembers();
restartMembersAuto();

const stagesTrack = document.querySelector('.stages__grid');
const stagesItems = [...document.querySelectorAll('.stages__grid li')];
const stagesPrev = document.querySelector('[data-stages-prev]');
const stagesNext = document.querySelector('[data-stages-next]');
const stagesDots = document.querySelector('[data-stages-dots]');
let stagesIndex = 0;
let stagesDotsCount = 0;

function getStagesSlidesCount() {
  return window.matchMedia('(max-width: 1300px)').matches ? 5 : stagesItems.length;
}

function renderStagesDots(slidesCount) {
  if (stagesDotsCount === slidesCount) return;
  stagesDotsCount = slidesCount;
  stagesDots.replaceChildren();

  for (let index = 0; index < slidesCount; index += 1) {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Этап ${index + 1}`);
    dot.addEventListener('click', () => {
      stagesIndex = index;
      updateStages();
    });
    stagesDots.append(dot);
  }
}

function updateStages() {
  const mobile = window.matchMedia('(max-width: 1300px)').matches;
  const slidesCount = getStagesSlidesCount();
  renderStagesDots(slidesCount);
  stagesIndex = Math.min(stagesIndex, slidesCount - 1);
  stagesTrack.style.transform = mobile
    ? `translateX(-${stagesIndex * 100}%)`
    : '';
  stagesPrev.disabled = stagesIndex === 0;
  stagesNext.disabled = stagesIndex === slidesCount - 1;
  [...stagesDots.children].forEach((dot, index) => {
    dot.classList.toggle('is-active', index === stagesIndex);
  });
}

stagesPrev.addEventListener('click', () => {
  stagesIndex = Math.max(0, stagesIndex - 1);
  updateStages();
});

stagesNext.addEventListener('click', () => {
  stagesIndex = Math.min(getStagesSlidesCount() - 1, stagesIndex + 1);
  updateStages();
});

window.addEventListener('resize', updateStages);
updateStages();

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

document
  .querySelectorAll('.reveal')
  .forEach(node => revealObserver.observe(node));
