'use strict';

const h1 = document.querySelector('h1');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content ');

const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const nav = document.querySelector('.nav');
///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => {
  btn.addEventListener('click', openModal);
});

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
///////////////////////////////////////

//button scrolling
btnScrollTo.addEventListener('click', function (e) {
  // const s1coords = section1.getBoundingClientRect();
  // // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log(window.pageXOffset, window.pageYOffset);
  // console.log(
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  //scrolling

  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffsetff
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' }); //modernway
});

// Page Navigation

// document.querySelectorAll('.nav__link').forEach(function (el, i) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     // document
//     //   .querySelector(`#section--${i + 1}`)
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//event delegation
//1. add evet listener to common parent element
//2. determine what element originated the evenet

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  //matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href'); //href attribute specifies the id of the element
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

//tabbed component

tabsContainer.addEventListener('click', function (e) {
  e.preventDefault();

  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return; //guard clause
  //remove active from other tabs
  tabs.forEach(function (el) {
    el.classList.remove('operations__tab--active');
  });
  //active tab
  clicked.classList.add('operations__tab--active');
  //remove active content from all
  tabsContent.forEach(function (el) {
    el.classList.remove('operations__content--active');
  });
  //activating content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//menu fade animation

const handleHover = function (e) {
  // console.log(e);
  // console.log(this);
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// nav.addEventListener('mouseover', function (e) {
//   handleHover(e, 0.5);
// });
nav.addEventListener('mouseover', handleHover.bind(0.5)); //0.5 is passed as this keyword
nav.addEventListener('mouseout', handleHover.bind(1)); //1 is passed as this keyword

// nav.addEventListener('mouseout', function (e) {
//   handleHover(e, 1);
// });

//sticky navigation
// const initialCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   if (window.scrollY >= initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

//sticky navigation: Intersection observer API

// const obsCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };
// const obsOptions = {
//   root: null,
//   threshold: 0.1,
// };

// const observer = new IntersectionObserver(obsCallback, obsOptions);
// observer.observe(section1);
const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight);
const stickyNav = function (entries) {
  const [entry] = entries;

  // console.log(entry.isIntersecting);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

//Reveal Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
  // rootMargin: `10px`,
});
allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  // console.log(entry);
  // replace src with data-src
  entry.target.src = entry.target.dataset.src; //once the image is found and loaded target emits load event
  entry.target.addEventListener('load', () =>
    entry.target.classList.remove('lazy-img')
  );
  observer.unobserve(entry.target);
};
const imgTargets = document.querySelectorAll('img[data-src]');
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
});
imgTargets.forEach(imgTarget => imgObserver.observe(imgTarget)); //arrow fucntion for observing each image of nodelist 'imgTargets'

// slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length - 1;
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.52) translateX(-1200px)';
  // slider.style.overflow = 'visible';

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slideNum) {
    slides.forEach(
      (slide, i) =>
        (slide.style.transform = `translateX(${100 * (i - slideNum)}%)`)
    );
  };
  const nextSlide = function () {
    if (curSlide === maxSlide) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const previousSlide = function () {
    if (curSlide === 0) curSlide = maxSlide;
    else curSlide--;
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // slides.forEach(
  //   (slide, i) => (slide.style.transform = `translateX(${i * 100}%)`)
  // );

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  //event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', previousSlide);

  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && previousSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      // const slide = e.target.dataset.slide;
      const { slide } = e.target.dataset; //destructuring
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

// selecting elements
// console.log(document.documentElement);

// console.log(document.head);
// console.log(document.body);

// console.log(allSections);
document.getElementById('section--1 ');

const allButtons = document.getElementsByTagName('button');
// console.log(allButtons);

// console.log(document.getElementsByClassName('btn'));

// creating and insertng elements
// .insertAdjacentHtml

const message = document.createElement('div');
message.classList.add('cookie-message');
message.innerHTML =
  'We use cookies for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

// header.prepend(message);
// header.append(message);
// header.append(message.cloneNode(true));

// header.before(message);
// header.after(message);
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     // message.remove(); // modern way of removing element
//     message.parentElement.removeChild(message);
//   });

//styles

message.style.backgroundColor = '#37383d';
message.style.width = '106%';
// console.log(message.style.width);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height) + 40 + 'px';

document.documentElement.style.setProperty('--color-primary', 'greenyellow');

const logo = document.querySelector('.nav__logo');

// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.className);
// logo.setAttribute('designer', 'game');
// console.log(logo.getAttribute('designer'));
// console.log(logo.dataset.versionNumber);

// const h1 = document.querySelector('h1');
// const alertH1 = function () {
//   alert("Great! you're reading the heading");
// };
// h1.addEventListener('mouseenter', alertH1);

// setTimeout(() => {
//   h1.removeEventListener('mouseenter', alertH1);
// }, 3000);
// h1.onmouseenter = function () {
//   alert("Great! you're reading the heading");
// };

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
// console.log(randomColor());

// document.querySelector('.nav__link').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(1);
// });

// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(2);
// });

// document.querySelector('.nav').addEventListener('click', function (e) {
//   this.style.backgroundColor = randomColor();
//   console.log(3);
// });

// going downwards:child

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// console.log(h1.firstElementChild);
// console.log(h1.lastElementChild);
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// going upwards:parent

// console.log(h1.parentNode);
// console.log(h1.parentElement);
// h1.closest('.header').style.background = 'var(--gradient-secondary)';
// h1.closest('h1').style.background = 'var(--gradient-primary)';

//going sideways: siblings

// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);

// console.log(h1.previousSibling);
// console.log(h1.nextSibling);

// console.log(h1.parentElement.children);
// [...h1.parentElement.children].forEach(function (el) {
//   if (el !== h1) el.style.transform = 'scale(0.5)';
// });

// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   // console.log(e);
//   e.returnValue = '';
// });
