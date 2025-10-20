const title = document.getElementsByClassName("title")[0];
const subtitle = document.getElementsByClassName("subtitle")[0];
const barTitle = document.getElementsByClassName("bar-title")[0];
const barInfo = document.getElementsByClassName("bar-info")[0];
const slideshow = document.getElementsByClassName("right-side")[0];
const qrCodeImg = document.getElementById("qr-code-img");
const content = document.getElementById("content");
const infoWrapper = document.getElementsByClassName("info-wrapper")[0];

//Rychlost animace 1000ms * 10
const loopIntervalTimeout = 1000 * 20;
let mainLoopInterval;
let data;

let mainRound = 0;
let subRound = 0;
let firstRun = true;

// Hlavní loop
const mainLoop = async () => {
  if (firstRun) {
    animationHideLeftSide();
    animationHideRightSide();
    await new Promise((res) =>
      setTimeout(async () => {
        firstRun = false;
        loadLeftSide();
        await new Promise((res) => {
          loadRightSide(res);
        });
        subRound++;
        res();
      }, 1000)
    );
    await checkIfEndOfSection();
    return;
  }
  animationHideRightSide();
  await new Promise((res) =>
    setTimeout(async () => {
      await new Promise((res) => {
        loadRightSide(res);
      });
      subRound++;
      res();
    }, 1000)
  );
  checkIfEndOfSection();
};

const checkIfEndOfSection = async () => {
  if (subRound === data[mainRound]["images"].length) {
    if (mainRound === data.length - 1) {
      firstRun = true;
      mainRound = 0;
      subRound = 0;
      return;
    }
    await new Promise((res) =>
      setTimeout(() => {
        firstRun = true;
        mainRound++;
        subRound = 0;
        res();
      }, 1000)
    );
    return;
  }
};

// Levá strana
const loadLeftSide = () => {
  title.textContent = data[mainRound].title;
  subtitle.textContent = data[mainRound].subtitle;
  content.innerHTML = data[mainRound].content;
  qrCodeImg.src = data[mainRound].qrcode;
  animationLoadLeftSide();
};

const animationHideLeftSide = () => {
  let t = 200;
  setTimeout(() => { title.classList.add("left-hidden"); title.classList.remove("left-shown"); }, t);
  setTimeout(() => { subtitle.classList.add("left-hidden"); subtitle.classList.remove("left-shown"); }, t*2);
  setTimeout(() => { content.classList.add("left-hidden"); content.classList.remove("left-shown"); }, t*3);
  setTimeout(() => { qrCodeImg.classList.add("bottom-hidden"); qrCodeImg.classList.remove("bottom-shown"); }, t*4);
};

const animationLoadLeftSide = () => {
  let t = 200;
  setTimeout(() => { title.classList.remove("left-hidden"); title.classList.add("left-shown"); }, t);
  setTimeout(() => { subtitle.classList.remove("left-hidden"); subtitle.classList.add("left-shown"); }, t*2);
  setTimeout(() => { content.classList.remove("left-hidden"); content.classList.add("left-shown"); }, t*3);
  setTimeout(() => { qrCodeImg.classList.remove("bottom-hidden"); qrCodeImg.classList.add("bottom-shown"); }, t*4);
};

// Pravá strana
const loadRightSide = (res) => {
  barTitle.textContent = data[mainRound]["images"][subRound].heading;
  barInfo.textContent = data[mainRound]["images"][subRound].info;
  animationLoadImage(res);
  animationLoadRightSide();
};

const animationHideImage = () => {
  slideshow.classList.add("hidden");
  slideshow.classList.remove("shown");
};

const animationLoadImage = (res) => {
  animationHideImage();
  setTimeout(() => {
    slideshow.style.backgroundImage = `url(${data[mainRound]["images"][subRound].path})`;
  }, 400);
  setTimeout(() => {
    infoWrapper.classList.remove("hidden");
    slideshow.classList.remove("hidden");
    infoWrapper.classList.add("shown");
    slideshow.classList.add("shown");
    res();
  }, 600);
};

const animationLoadRightSide = () => {
  let t = 200;
  setTimeout(() => { barTitle.classList.remove("left-hidden"); barTitle.classList.add("left-shown"); }, t);
  setTimeout(() => { barInfo.classList.remove("bottom-rp-hidden"); barInfo.classList.add("bottom-rp-shown"); }, t*2);
};

const animationHideRightSide = () => {
  let t = 200;
  setTimeout(() => { barTitle.classList.remove("left-shown"); barTitle.classList.add("left-hidden"); }, t);
  setTimeout(() => { barInfo.classList.remove("bottom-rp-shown"); barInfo.classList.add("bottom-rp-hidden"); }, t*2);
};

window.onload = async () => {
  data = await fetch("./res/data/content.json?v=2").then(r => r.json());
  mainLoop();
  mainLoopInterval = setInterval(mainLoop, loopIntervalTimeout);
};
