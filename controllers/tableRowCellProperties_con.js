//////////////////////////////////////////////////////////////////////////
// File: tableRowCellProperties_con.js
//
// Description:
//   Controller for the Table Row/Cell Properties dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Row/Cell Properties dialog controller.
 *
 * @extends SC.Object
 */
TinySC.tableRowCellPropertiesController = SC.Object.create({

  /**
   * Clears the controller state.
   */
  clear: function() {
    this.beginPropertyChanges()
      .set('rowMode', YES)
      .set('horizontalAlignment', 'left')
      .set('verticalAlignment', 'middle')
      .set('backgroundColor', '#FFFFFF')
    .endPropertyChanges();
  },

  /**
   * Dialog mode. YES = row, NO = column.
   *
   * @property {Boolean}
   */
  rowMode: YES,

  /**
   * Horizontal cell alignment.
   *
   * Possible values are 'left', 'center', 'right', 'full'.
   *
   * @property {String}
   */
  horizontalAlignment: 'left',

  /**
   * Vertical cell alignment.
   *
   * Possible values are 'top', 'middle', 'bottom'.
   *
   * @property {String}
   */
  verticalAlignment: 'middle',

  /**
   * Cell background color.
   *
   * @property {String}
   */
  backgroundColor: '#FFFFFF'
});
