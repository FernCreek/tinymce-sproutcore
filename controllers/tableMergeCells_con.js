//////////////////////////////////////////////////////////////////////////
// File: tableMergeCells_con.js
//
// Description:
//   Controller for the Table Merge Cells dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Merge Cells dialog controller.
 *
 * @extends SC.Object
 */
TinySC.tableMergeCellsController = SC.Object.create({

  /**
   * Clears the controller state.
   */
  clear: function() {
    this.beginPropertyChanges()
      .set('mergeAction', null)
      .set('mergeRows', 1)
      .set('mergeColumns', 1)
    .endPropertyChanges();
  },

  /**
   * Function that will do the cell merge; provided by tinymce.
   *
   * @property {Function}
   */
  mergeAction: null,

  /**
   * Number of table rows to merge.
   *
   * @property {Number}
   */
  mergeRows: 1,

  /**
   * Number of table columns to merge.
   *
   * @property {Number}
   */
  mergeColumns: 1

});
