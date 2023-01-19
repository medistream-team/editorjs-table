import "./styles/table-constructor.scss"
import { create } from "./documentUtils"
import { Table, CSS as TableCSS } from "./table"

/**
 * Entry point. Controls table and give API to user
 */
export class TableConstructor {
  /**
   * Creates
   * @param {TableData} data - previously saved data for insert in table
   * @param {object} config - configuration of table
   * @param {object} api - Editor.js API
   * @param {boolean} readOnly - read-only mode flag
   */
  constructor(data, config, api, readOnly) {
    this.readOnly = readOnly

    this._CSS = {
      editor: "tc-editor",
      inputField: "tc-table__inp",
      withBorder: "tc-table__with_border",
    }

    /** creating table */

    try {
      this._table = new Table(config, api, readOnly)
      this._drawTable(data, config)
    } catch (e) {
      console.log(e)
    }

    /** creating container around table */
    this._container = create("div", [this._CSS.editor, api.styles.block], null, [
      this._table.htmlElement,
    ])

    /** Создаем кнопку для загрузки изображения */
    this._table.imageUpload.createElem(this._container)

    /** Activated elements */
    this._hoveredCell = null
    this._hoveredCellSide = null

    if (!this.readOnly) {
      this._attachAddRowColumnButton()
    }
  }

  /**
   * returns html element of TableConstructor;
   * @return {HTMLElement}
   */
  get htmlElement() {
    return this._container
  }

  /**
   * @private
   *
   * resize to match config or transmitted data
   * @param {TableData} data - data for inserting to the table
   * @param {object} config - configuration of table
   * @param {number|string} config.rows - number of rows in configuration
   * @param {number|string} config.cols - number of cols in configuration
   * @return {{rows: number, cols: number}} - number of cols and rows
   */
  _drawTable(data, config) {
    const isDataValid = !!data && Array.isArray(data.rows) && Array.isArray(data.colgroup)
    const contentRows = isDataValid ? data.rows.length : undefined
    const contentCols = isDataValid ? data.colgroup.length : undefined
    const configRows = Number.parseInt(config.rows)
    const configCols = Number.parseInt(config.cols)
    const defaultRows = 3
    const defaultCols = 2
    const rows = contentRows || configRows || defaultRows
    const cols = contentCols || configCols || defaultCols
    const table = this._table

    if (!isDataValid) {
      for (let i = 0; i < rows; i++) {
        table.addRow(i)
      }
      for (let i = 0; i < cols; i++) {
        table.addColumn(i)
      }

      table.htmlElement.classList.toggle(this._CSS.withBorder, true)
    } else {
      table.htmlElement.classList.toggle(this._CSS.withBorder, true)
      this._table.drawTableFromData(data)
    }

    return {
      rows: rows,
      cols: cols,
    }
  }

  _attachAddRowColumnButton() {
    const addRowButton = create("div", [TableCSS.addRowButton])
    const addColumnButton = create("div", [TableCSS.addColumnButton])

    addRowButton.addEventListener(
      "click",
      () => this._table.addColumn(this._table._numberOfColumns),
      true
    )
    addColumnButton.addEventListener(
      "click",
      () => this._table.addRow(this._table._numberOfRows),
      true
    )

    this._container.appendChild(addRowButton)
    this._container.appendChild(addColumnButton)
  }
}
