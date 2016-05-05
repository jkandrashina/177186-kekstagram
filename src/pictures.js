'use strict';

(function() {

  var filtersBlock = document.querySelector('.filters');
  filtersBlock.classList.add('hidden');

  var picturesContainer = document.querySelector('.pictures');
  var templateElement = document.querySelector('#picture-template');
  var elementToClone;

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.picture');
  } else {
    elementToClone = templateElement.querySelector('.picture');
  }

  //Массив изображений
  var pictures = [];

  //Максимальная продолжительность загрузки изображения (10 сек.)
  var IMAGE_TIMEOUT = 10000;

  //URL загрузки массива изображений
  var PICTURES_LOAD_URL = '//o0.github.io/assets/json/pictures.json';

  //Объект Filter с набором свойств и значений фильтров
  var Filter = {
    'POPULAR': 'filter-popular',
    'NEW': 'filter-new',
    'DISCUSSED': 'filter-discussed'
  };


  //Функция отрисовки изображений на странице
  var getPictureElement = function(data, container) {
    var element = elementToClone.cloneNode(true);

    element.querySelector('.picture-comments').textContent = data.comments;
    element.querySelector('.picture-likes').textContent = data.likes;

    var pictureImg = new Image();
    var imageLoadTimeout;

    pictureImg.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.querySelector('img').src = pictureImg.src;
      pictureImg.width = 182;
      pictureImg.height = 182;
    };

    pictureImg.onerror = function() {
      element.classList.add('picture-load-failure');
    };

    pictureImg.src = data.url;

    imageLoadTimeout = setTimeout(function() {
      pictureImg.src = '';
      element.classList.add('picture-load-failure');
    }, IMAGE_TIMEOUT);

    container.appendChild(element);
    return element;
  };

  //Функция renderPictures очищает блок изображений и вызывает
  //функцию отрисовки изображений
  var renderPictures = function(picturesFiltered) {
    picturesContainer.innerHTML = '';

    picturesFiltered.forEach(function(picture) {
      getPictureElement(picture, picturesContainer);
    });
  };


  //getFilteredPictures возвращает отсортированный массив
  //Сортировка производится на копии исходного массива
  var getFilteredPictures = function(pics, filter) {
    var picturesToFilter = pictures.slice(0);

    switch (filter) {
      case Filter.NEW:
        picturesToFilter.sort(function(a, b) {
          a = Date.parse(a.date);
          b = Date.parse(b.date);
          return b - a;
        });
        break;

      case Filter.DISCUSSED:
        picturesToFilter.sort(function(a, b) {
          return b.comments - a.comments;
        });
        break;

      default:
        picturesToFilter = pictures;
        break;
    }

    return picturesToFilter;
  };


  //Получение массива изображений, отсортированного в зависимости
  //от выбранного фильтра. Функция renderPictures принимает на вход
  //отсортированный массив и отрисовывает его на странице
  var setFilterEnabled = function(filter) {
    var filteredPictures = getFilteredPictures(pictures, filter);
    renderPictures(filteredPictures);
  };


  //Установка обработчика события на каждый из фильтров
  var setFiltrationEnabled = function() {
    var filters = filtersBlock.querySelectorAll('.filters-radio');
    for (var i = 0; i < filters.length; i++) {
      filters[i].onclick = function() {
        setFilterEnabled(this.id);
      };
    }
  };


  //Функция загрузки массива изображений с сервера
  var getPictures = function(callback) {
    //На время загрузки изображений показывается прелоадер
    picturesContainer.classList.add('.pictures-loading');

    var xhr = new XMLHttpRequest();

    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
      //При успешной загрузке прелоадер скрывается
      picturesContainer.classList.remove('.pictures-loading');
    };

    xhr.onerror = function() {
      picturesContainer.classList.remove('.pictures-loading');
      picturesContainer.classList.add('.pictures-failure');
    };

    xhr.timeout = 10000;
    xhr.ontimeout = function() {
      picturesContainer.classList.remove('.pictures-loading');
      picturesContainer.classList.add('.pictures-failure');
    };

    xhr.open('GET', PICTURES_LOAD_URL);
    xhr.send();
  };


  //Вызов функции getPictures с параметром loadedPictures, который равен loadedData
  getPictures(function(loadedPictures) {
    pictures = loadedPictures;
    setFiltrationEnabled(true);
    setFilterEnabled('filter-popular');
  });

  filtersBlock.classList.remove('hidden');
})();
