/* global pictures */
'use strict';

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

  var IMAGE_TIMEOUT = 10000;
  imageLoadTimeout = setTimeout(function() {
    pictureImg.src = '';
    element.classList.add('picture-load-failure');
  }, IMAGE_TIMEOUT);

  container.appendChild(element);
  return element;
};

window.pictures.forEach(function(item, i) {
  getPictureElement(pictures[i], picturesContainer);
});
filtersBlock.classList.remove('hidden');
