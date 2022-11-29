/**
 * Checks the item is not missed or messed
 * @param {object|string[]|Element[]|HTMLElement|string} elem - element
 * @returns {boolean} true if element is correct
 * @private
 */
function _isNotMissed(elem) {
  return (!(elem === undefined || elem === null));
}

/**
 * Create DOM element with set parameters
 * @param {string} tagName - Html tag of the element to be created
 * @param {string[]} cssClasses - Css classes that must be applied to an element
 * @param {object} attrs - Attributes that must be applied to the element
 * @param {Element[]} children - child elements of creating element
 * @returns {HTMLElement} the new element
 */
export function create(tagName, cssClasses = null, attrs = null, children = null) {
  const elem = document.createElement(tagName);

  if (_isNotMissed(cssClasses)) {
    for (let i = 0; i < cssClasses.length; i++) {
      if (_isNotMissed(cssClasses[i])) {
        elem.classList.add(cssClasses[i]);
      }
    }
  }
  if (_isNotMissed(attrs)) {
    for (let key in attrs) {
      elem.setAttribute(key, attrs[key]);
    }
  }
  if (_isNotMissed(children)) {
    for (let i = 0; i < children.length; i++) {
      if (_isNotMissed(children[i])) {
        elem.appendChild(children[i]);
      }
    }
  }
  return elem;
}

/**
 * Get item position relative to document
 * @param {HTMLElement} elem - item
 * @returns {{x1: number, y1: number, x2: number, y2: number}} coordinates of the upper left (x1,y1) and lower right(x2,y2) corners
 */
export function getCoords(elem) {
  const rect = elem.getBoundingClientRect();

  return {
    y1: Math.floor(rect.top + window.pageYOffset),
    x1: Math.floor(rect.left + window.pageXOffset),
    x2: Math.floor(rect.right + window.pageXOffset),
    y2: Math.floor(rect.bottom + window.pageYOffset)
  };
}

/**
 * Recognizes which side of the container  is closer to (x,y)
 * @param {{x1: number, y1: number, x2: number, y2: number}} coords - coords of container
 * @param x - x coord
 * @param y - y coord
 * @return {string}
 */
export function getSideByCoords(coords, x, y) {
  let side;
  const sizeArea = 10;

  // a point is close to the boundary if the distance between them is less than the allowed distance.
  // +1px on each side due to fractional pixels
  if (x - coords.x1 >= -1 && x - coords.x1 <= sizeArea + 1) {
    side = 'left';
  }
  if (coords.x2 - x >= -1 && coords.x2 - x <= sizeArea + 1) {
    side = 'right';
  }
  if (y - coords.y1 >= -1 && y - coords.y1 <= sizeArea + 1) {
    side = 'top';
  }
  if (coords.y2 - y >= -1 && coords.y2 - y <= sizeArea + 1) {
    side = 'bottom';
  }

  return side;
}

/**
 * @param cell - TD Element
 * @description td 엘리먼트를 th 엘리먼트로 변경한다
 */
export function turnTdIntoTh(cell) {
  const th = document.createElement('th');

  th.setAttribute('rowspan', cell.rowSpan);
  th.setAttribute('colspan', cell.colSpan);
  th.setAttribute('class', cell.className);
  
  while(cell.firstChild) {
    th.appendChild(cell.firstChild);
  }

  cell.parentNode.replaceChild(th, cell);
}

/**
 * @param cell - TH Element
 * @description th 엘리먼트를 td 엘리먼트로 변경한다
 */
export function turnThIntoTd(cell) {
  const td = document.createElement('td');

  td.setAttribute('rowspan', cell.rowSpan);
  td.setAttribute('colspan', cell.colSpan);
  td.setAttribute('class', cell.className);
  
  while(cell.firstChild) {
    td.appendChild(cell.firstChild);
  }

  cell.parentNode.replaceChild(td, cell);
}