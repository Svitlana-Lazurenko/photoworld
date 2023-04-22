import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayApiService from './PixabayApiService.js';
import LoadMoreBtn from './LoadMoreBtn.js';

const refs = {
  formEl: document.querySelector('#search-form'),
  galleryEl: document.querySelector('.gallery'),
};
const lightbox = new SimpleLightbox('.gallery a');
const pixabayApiService = new PixabayApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
});
let fetchedTotalHits = 0;

refs.formEl.addEventListener('submit', onSubmit);
loadMoreBtn.button.addEventListener('click', fetchArticles);

// -----------------Functions----------------------

function onSubmit(e) {
  e.preventDefault();
  refs.galleryEl.innerHTML = '';
  pixabayApiService.resetPage();
  fetchedTotalHits = 0;

  const form = e.currentTarget;
  pixabayApiService.query = form.elements.searchQuery.value;
  fetchArticles();

  form.reset();
}

async function fetchArticles() {
  try {
    const { hits, totalHits } = await pixabayApiService.getImages();
    const fetchedHits = hits.length;
    fetchedTotalHits += fetchedHits;

    if (fetchedTotalHits === 40) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
    }

    if (fetchedHits === 0) {
      loadMoreBtn.hide();
      Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (fetchedTotalHits >= totalHits) {
      createImagesList(hits);
      loadMoreBtn.hide();
      Notify.info(`We're sorry, but you've reached the end of search results.`);
      return;
    }

    createImagesList(hits);
    loadMoreBtn.show();
  } catch (err) {
    onError(err);
  }
}

function createImagesList(hits) {
  const markup = hits.reduce(
    (markup, hit) => markup + createCardMarkup(hit),
    ''
  );
  refs.galleryEl.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function createCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<a href="${largeImageURL}" class="card-link"><div class="photo-card"><div class="thumb">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" /></div>
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div></a>`;
}

function onError(err) {
  console.error(err);
  Notify.failure('Error');
}
