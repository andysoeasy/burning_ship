var canvas = document.getElementById("animationCanvas");
var ctx = canvas.getContext("2d");

// Задать максимальное количество итераций и радус выхода для 
// заполнения фона вне фрактала
const MAX_ITERATIONS = 255;
const ESCAPE_RADIUS = 2;

const ESCAPE_THRESHOLD = ESCAPE_RADIUS * ESCAPE_RADIUS;

// Ширина и высота холста
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

function iterateUntilEscape(x0, y0) {
    /**
     * Функция, которая задает радиус изменения цветов
     * при отрисовке фрактала на холсте (не более MAX_ITERATIONS раз).
     * 
     * Основывается на стартовой точке рисования.
     * 
     * Возвращает массив с количеством пройденных итераций и радиусом выхода.
     */

  let x = 0, y = 0;
  let iteration = 0;

  while ((x*x + y*y < ESCAPE_THRESHOLD) && (iteration < MAX_ITERATIONS)) {

    const x_n = x*x - y*y + x0;
    const y_n = 2 * Math.abs(x*y) + y0;
    x = x_n;
    y = y_n;
    iteration++;

  }
  return [iteration, Math.sqrt(x*x + y*y)];
}

function getMu(numIterations, escapeDistance) {
    /**
     * Нормализация количества итераций на основе расстояния выхода
     * для получения более плавной картинки
     */
  return numIterations + 1 - Math.log2(Math.log(escapeDistance));
}

function getColor(mu){ 
    /**
     * Задать цвет для пикселя
     */
    return [ 255, mu * 7, 0, mu * 15 ]
}

function drawBurningShip(xRange, yRange, colorFunc) {

    /**
     * Основная функция отрисовки фрактала.
     * 
     * Из холста берется один пиксель и на его основе
     * строятся, а также на значениях высоты и ширины 
     * холста, отрисовываются фрагменты фрактала
     */


  const canvasImageData = ctx.createImageData(canvasWidth, canvasHeight);
  const image = canvasImageData.data;

  for (let i = 0; i < canvasHeight; i++) {
    for (let j = 0; j < canvasWidth; j++) {


      // Начальное комплексное число

      const x0 = xRange[0] + j*(xRange[1] - xRange[0]) / canvasWidth;
      const y0 = yRange[0] + i*(yRange[1] - yRange[0]) / canvasHeight;

      // Получить количество итераций, пройденных в ходе изменения
      // начального комплексного числа, а также расстояние выхода
      // (область отрисовки)

      const [numIterations, escapeDistance] = iterateUntilEscape(x0, y0);

      // получить индекс текущего пикселя, который нужно закрасить
      const pixelIndex = 4*i*canvasWidth + 4*j;

      // "Плавно" закрашивать пиксели полученным цветом
      if (numIterations !== MAX_ITERATIONS) {
        const mu = getMu(numIterations, escapeDistance);
        const pixels = colorFunc(mu);

        for (let p = 0; p < 4; p++) {
          image[pixelIndex + p] = pixels[p];
        }
      }
    }
  }

  // Отобразить пиксель на холсте
  ctx.putImageData(canvasImageData, 0, 0);
}

// Значения промежутков x и y по умолчанию
var x_range = [-1.8, -1.7];
var y_range = [-0.08, 0.01];

drawBurningShip(x_range, y_range, getColor);

function changeConfiguration() {
    /**
     * Функция считывает новые значения промежутков для x и y,
     * которые пользователь указывает в полях для ввода, и 
     * перерисовывает фрактал
     */

    var xStart = parseFloat(document.getElementById('xRangeStart').value);
    var xEnd = parseFloat(document.getElementById('xRangeEnd').value);
    var yStart = parseFloat(document.getElementById('yRangeStart').value);
    var yEnd = parseFloat(document.getElementById('yRangeEnd').value);

    drawBurningShip([xStart, xEnd], [yStart, yEnd], getColor);

}

// Получаем кнопку и добавляем обработчик события
// Применяет введенные пользователем значения
var changeConfigBtn = document.getElementById('changeConfigBtn');
changeConfigBtn.addEventListener('click', changeConfiguration);

// Функция для сброса формы
function resetForm() {
    document.getElementById('configForm').reset();
}

// Получаем кнопку для сброса формы и добавляем обработчик события
// Сбрасываем указанные данные в полях ввода (не сбрасывает фрактал до
// состояния по умолчанию)

var resetFormBtn = document.getElementById('resetFormBtn');
resetFormBtn.addEventListener('click', resetForm);