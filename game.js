let ar = document.querySelector(".ar");
let en = document.querySelector(".en");
let check = document.querySelector(".check");
let hint = document.querySelector(".hint");
let masege = document.querySelector(".masege");
let numperOfHint = 2;
let agen = document.querySelector(".agen");
document.querySelector(".hint span").innerHTML = numperOfHint;

let numperOfTray = 5;
let current = 1;
let language = "ar"; // default

// الكلمات
let wordAR = [
  "بقرة",
  "نساء",
  "بروج",
  "أعلي",
  "رحمن",
  "حديد",
  "توبة",
  "كوثر",
  "همزة",
  "بينة",
  "طارق",
  "مدثر",
  "طلاق",
  "الحج",
  "جمعة",
  "دخان",
  "شوري",
  "زخرف",
  "سجدة",
];

let wordEN = [
  "Slsbel",
  "Aymane",
  "Shaema",
  "Gaunat",
  "Yasmen",
  "Maryam",
  "Alzero",
  "mohmed",
  "Shroce",
  "manare",
  "Kapape",
  "Chekin",
  "School",
];

// متغيرات اللعبة حسب اللغة
let theWord = "";
let numperOfLetter = 0;

// اختيار اللغة
ar.onclick = function () {
  language = "ar";
  startGame();
};
en.onclick = function () {
  language = "en";
  startGame();
};

function startGame() {
  document.querySelector(".lang").style.display = "none";

  if (language === "ar") {
    theWord = wordAR[Math.floor(Math.random() * wordAR.length)].toLowerCase();
    numperOfLetter = theWord.length;
  } else {
    theWord = wordEN[Math.floor(Math.random() * wordEN.length)].toLowerCase();
    numperOfLetter = theWord.length;
  }

  generat();

  check.addEventListener("click", handleCheck);
  hint.addEventListener("click", getHint);
}

// توليد مربعات المحاولات
function generat() {
  let inputCont = document.querySelector(".inputs");
  inputCont.innerHTML = "";

  for (let i = 1; i <= numperOfTray; i++) {
    let tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    if (language === "ar") {
      tryDiv.innerHTML = `<span>المحاولة ${i}</span>`;
      tryDiv.style.direction = "rtl";
    } else if (language === "en") {
      tryDiv.innerHTML = `<span>TRY ${i}</span>`;
    }
    if (i !== 1) tryDiv.classList.add("hedin");
    for (let j = 1; j <= numperOfLetter; j++) {
      let input = document.createElement("input");
      input.type = "text";
      input.id = `try-${i}-letter-${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }
    inputCont.appendChild(tryDiv);
  }

  inputCont.children[0].children[1].focus();

  // تعطيل المربعات المخفية
  document
    .querySelectorAll(".hedin input")
    .forEach((input) => (input.disabled = true));

  // الحروف الكبيرة والتنقل
  let inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      let theNext = inputs[index + 1];
      if (theNext) theNext.focus();
    });

    input.addEventListener("keydown", function (click) {
      let curent = Array.from(inputs).indexOf(this);
      if (click.key === "ArrowRight") {
        let nextInput = curent + 1;
        if (nextInput < inputs.length) inputs[nextInput].focus();
      }
      if (click.key === "ArrowLeft") {
        let preInput = curent - 1;
        if (preInput >= 0) inputs[preInput].focus();
      }
    });
  });
}

// التحقق من الكلمة
function handleCheck() {
  let trueWord = true;

  for (let i = 1; i <= numperOfLetter; i++) {
    let inputFelid = document.querySelector(`#try-${current}-letter-${i}`);
    let letter = inputFelid.value.toLowerCase();
    let trueLeteer = theWord[i - 1];

    if (letter === trueLeteer) {
      inputFelid.classList.add("green");
    } else if (theWord.includes(letter) && letter != "") {
      inputFelid.classList.add("orange");
      trueWord = false;
    } else {
      inputFelid.classList.add("red");
      trueWord = false;
    }
  }

  if (trueWord) {
    masege.innerHTML =
      language === "ar"
        ? `ممتاز يا صاحبي الكلمة هي <span>ال${theWord}</span>`
        : `Good Game! The word is <span>${theWord}</span>`;
    document.querySelector(".win").play();
    endGame();
  } else {
    let currentTry = document.querySelector(`.try-${current}`);
    currentTry.classList.add("hedin");
    currentTry.querySelectorAll("input").forEach((i) => (i.disabled = true));

    current++;
    let nextTry = document.querySelector(`.try-${current}`);
    if (nextTry) {
      nextTry.classList.remove("hedin");
      nextTry.querySelectorAll("input").forEach((i) => (i.disabled = false));
      nextTry.children[1].focus();
    } else {
      masege.innerHTML =
        language === "ar"
          ? `للأسف يا صاحبي خسرت! الكلمة كانت <span>ال${theWord}</span>`
          : `Game Over! The word was <span>${theWord}</span>`;
      document.querySelector(".fil").play();
      endGame();
    }
  }
}

function endGame() {
  check.classList.add("hedin");
  hint.classList.add("hedin");
  document
    .querySelectorAll(".inputs > div")
    .forEach((div) => div.classList.add("hedin"));
  agen.classList.remove("hedin");
  agen.innerHTML = "اللعب مجدداً";
}

// المساعدة
function getHint() {
  if (numperOfHint > 0) {
    numperOfHint--;
    document.querySelector(".hint span").innerHTML = numperOfHint;
  }
  if (numperOfHint == 0) {
    hint.classList.add("hedin");
  }

  let all = document.querySelectorAll("input:not([disabled])");
  let emty = Array.from(all).filter((input) => input.value === "");

  if (emty.length > 0) {
    let random = Math.floor(Math.random() * emty.length);
    let inHint = emty[random];
    let indexFil = Array.from(all).indexOf(inHint);
    if (indexFil !== -1) {
      inHint.value = theWord[indexFil].toUpperCase();
    }
  }
}

// زر المسح
document.addEventListener("keydown", function (click) {
  if (click.key === "Backspace") {
    let inputs = document.querySelectorAll("input:not([disabled])");
    let curent = Array.from(inputs).indexOf(document.activeElement);
    if (curent > 0) {
      let incurnt = inputs[curent];
      let inprave = inputs[curent - 1];
      inprave.value = "";
      incurnt.value = "";
    }
  }
});
