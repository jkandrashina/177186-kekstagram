function getMessage(a, b) {
	var message;

	if (typeof(a) === 'boolean') {
	  if (a) {
	    message = 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
	  } else {
	    message = 'Переданное GIF-изображение не анимировано';
	  }
		
	} else if (typeof(a) === 'number') {
			message = 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
		
	} else if (Array.isArray(a) && Array.isArray(b)) {
			var square = 0;

      a.forEach(function(item, index) {
        square += item * b[index];
      });
      
			message = 'Общая площадь артефактов сжатия: ' + square + ' пикселей';
		
	} else {
	    if (Array.isArray(a)){
    		var sum = a.reduce(function(totalSum, current) {
    			return totalSum + current;
    		}, 0);
    		
    		message = 'Количество красных точек во всех строчках изображения: ' + sum;
			}
	}
	return message;
}