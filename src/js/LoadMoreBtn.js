export default class LoadMoreBtn {
  constructor({ selector }) {
    this.button = document.querySelector(selector);
    this.hide();
  }

  hide() {
    this.button.classList.add('hidden');
  }

  show() {
    this.button.classList.remove('hidden');
  }
}
