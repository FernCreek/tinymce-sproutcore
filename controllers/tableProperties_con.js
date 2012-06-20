//////////////////////////////////////////////////////////////////////////
// File: tableProperties_con.js
//
// Description:
//   Controller for the Table Properties dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Properties dialog controller.
 *
 * @extends SC.Object
 */
TinySC.tablePropertiesController = SC.Object.create({

  /**
   * Clears the controller state.
   */
  clear: function() {
    this.beginPropertyChanges()
      .set('insertMode', YES)
      .set('node', null)
      .set('rows', 2)
      .set('columns', 2)
      .set('width', 300)
      .set('cellPadding', 3)
      .set('cellSpacing', 0)
      .set('frame', 'on')
      .set('frameWidth', 1)
      .set('alignment', 'left')
      .set('backgroundColor', '#FFFFFF')
    .endPropertyChanges();
  },

  /**
   * Dialog mode. YES = insert, NO = edit.
   *
   * @property {Boolean}
   */
  insertMode: YES,

  /**
   * Selected node.
   *
   * @property {DOMElement}
   */
  node: null,

  /**
   * Number of table rows.
   *
   * @property {Number}
   */
  rows: 2,

  /**
   * Number of table columns.
   *
   * @property {Number}
   */
  columns: 2,

  /**
   * Table width.
   *
   * @property {Number}
   */
  width: 300,

  /**
   * Table cell padding.
   *
   * @property {Number}
   */
  cellPadding: 3,

  /**
   * Table cell spacing.
   *
   * @property {Number}
   */
  cellSpacing: 0,

  /**
   * Table frame.
   *
   * Possible values are 'on' and 'off'.
   *
   * @property {String}
   */
  frame: 'on',

  /**
   * Table frame width.
   *
   * @property {Number}
   */
  frameWidth: 1,

  /**
   * Table alignment.
   *
   * Possible values are 'left', 'center', 'right'.
   *
   * @property {String}
   */
  alignment: 'left',

  /**
   * Table background color.
   *
   * @property {String}
   */
  backgroundColor: '#FFFFFF'
});
