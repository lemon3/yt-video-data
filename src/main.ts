import { YTVideoData } from "./index";
import "./style.css"

interface Elements {
  input: HTMLInputElement | Element | null;
  submit: Element | null;
  result: Element | null;
}

const pad = (number = 0) => {
  return ("0" + number).slice(-2);
};

const formatTime = (seconds: number | string) => {
  const h = Math.floor(+seconds / 3600);
  const m = Math.floor((+seconds - h * 3600) / 60);
  const s = (+seconds - h * 3600 - m * 60) << 0;
  return `${pad(m)}:${pad(s)}`;
};

const init = () => {
  const app = document.querySelector('#app');
  const yth = new YTVideoData();
  const elements: Elements = { input: null, submit: null, result: null };
  const $ = (el: string) => document.querySelector(el);

  const input = (evt: Event) => {
    console.log(evt);
  };

  const submitted = async () => {
    if (!elements.input) return;
    const inputElement = elements.input as HTMLInputElement;
    let r;
    try {
      r = await yth.getInfo(inputElement.value);
    } catch (error) {
      console.log(error);
      return false;
    }

    if (!elements.result) return;
    elements.result.innerHTML = `
        <div class="image"><img src="${r.poster.hq720}" alt="${r.title}"/></div>
        <div class="title">${r.title}</div>
        <div class="author">${r.author}</div>
        <div class="time">${formatTime(r.duration)}</div>
      `
  };

  if (app) {
    app.innerHTML = `
    <h1>Enter a YouTube video id ...</h1>
    <div class="input-bar">
      <input type="text" id="myInput" value="JeSkFRTj7kU">
      <button id="submit">submit</button>
    </div>
    <div id="result"></div>
    `;

    elements.input = $('#myInput');
    elements.submit = $('#submit');
    elements.result = $('#result');

    if (elements.input) {
      elements.input.addEventListener('input', input);
    }

    if (elements.submit) {
      elements.submit.addEventListener('click', submitted);
    }
  }
};

if ('complete' === document.readyState || 'interactive' === document.readyState) {
  init();
  document.removeEventListener('DOMContentLoaded', init);
} else {
  document.addEventListener('DOMContentLoaded', init, false);
}
