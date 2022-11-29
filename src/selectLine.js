import {create} from "./documentUtils";

export const CSS = {
  selectLineCol: 'tc-table__select_line_col',
  selectLineRow: 'tc-table__select_line_row',
  trRemove: 'tc-table__tr_remove',
  tdRemove: 'tc-table__td_remove',
};

export class SelectLine {
  constructor(table) {
    this.table = table;
  }
  
  createElem(cell, direction = 0) {
    const className = direction === 0 ? CSS.selectLineCol : CSS.selectLineRow;

    if (!cell.querySelector(`.${className}`)) {
      const elem = create('div', [className]);
      elem.addEventListener('click', this.onClick, false);
      elem.addEventListener('mouseenter', this.onMouseEnter, false);
      elem.addEventListener('mouseleave', this.onMouseLeave, false);
      cell.appendChild(elem);
    }
  }
  
  getDirection = (e) => {
    if (e.target.classList.contains(CSS.selectLineCol)) return 0;
    return 1;
  }
  
  onMouseEnter = (e) => {
    // 가로 줄
    if (this.getDirection(e) === 0) {
      const index = this.getIndex(e)
      for (let i = 0; i < this.table.body.rows.length; i += 1) {
        if (this.table.body.rows[i].children[index]) {
          this.table.body.rows[i].children[index].classList.add(CSS.tdRemove);
        }
      }
    // 세로 줄
    } else {
      const tr = e.target.closest('tr');
      tr.classList.add(CSS.trRemove);
    }
  }
  
  onMouseLeave = (e) => {
    if (e.target) {
      if (this.getDirection(e) === 0) {
        const tds = this.table.body.querySelectorAll(`.${CSS.tdRemove}`);
        tds.forEach(td => {
          td.classList.remove(CSS.tdRemove);
        })
      } else {
        const tr = e.target.closest('tr');
        tr.classList.remove(CSS.trRemove);
      }
    }
  }
  
  getIndex = (e) => {
    const items = this.table.body.querySelectorAll(`.${e.target.className}`);
    for (let i = 0; i < items.length; i += 1) {
      if (items[i] === e.target) {
        return i
      }
    }
    return -1;
  }
  
  onClick = (e) => {
    const index = this.getIndex(e);
    if (this.getDirection(e) === 0) {
      this.table.removeColumn(index);
    } else {
      this.table.removeRow(index);
    }
  }
}
