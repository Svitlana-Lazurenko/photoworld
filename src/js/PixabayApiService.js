import axios from 'axios';

export default class PixabayApiService {
  static ENDPOINT = 'https://pixabay.com/api/';
  static API_KEY = '35568856-099cdd83ac58028a9b45ec202';

  constructor() {
    this.query = '';
    this.page = 1;
  }

  async getImages() {
    const url = `${PixabayApiService.ENDPOINT}?key=${PixabayApiService.API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`;

    const { data } = await axios.get(url);
    this.incrementPage();

    return data;
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}
