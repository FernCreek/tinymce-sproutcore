//////////////////////////////////////////////////////////////////////////
// File: tableMergeCells_vw.js
//
// Description:
//   Table Merge Cells dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Merge Cells dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.TableMergeCellsPane = SC.PanelPane.extend({
  layout: { width: 260, height: 180, centerX: 0, centerY: 0 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider tableRowsView tableColsView saveButton cancelButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),

        /**
         * Dialog title.
         *
         * @property {String}
         */
        value: 'Merge Cells'

      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    tableRowsView: SC.View.extend({
      layout: { left: 20, right: 20, top: 68 },
      childViews: 'rowsLabel rowsValueTextField'.w(),

      rowsLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Rows'
      }),

      rowsValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 90, top: 0 },
        valueBinding: 'TinySC.tableMergeCellsController.mergeRows'
      })
    }),

    tableColsView: SC.View.extend({
      layout: { left: 20, right: 20, top: 98 },
      childViews: 'columnsLabel columnsValueTextField'.w(),

      columnsLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Columns'
      }),

      columnsValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 90, top: 0 },
        valueBinding: 'TinySC.tableMergeCellsController.mergeColumns'
      })
    }),


    saveButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, bottom: 20, right: 110 },
      theme: 'capsule',
      isDefault: YES,
      action: 'save',
      title: 'Save'
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, bottom: 20, right: 20 },
      theme: 'capsule',
      title: 'Cancel',
      action: 'cancel'
    })
  }),

  /**
   * Performs the cell merge and closes the dialog.
   */
  save: function() {
    var mergeAction = TinySC.tableMergeCellsController.get('mergeAction'),
        data = {
          rows: TinySC.tableMergeCellsController.get('mergeRows'),
          cols: TinySC.tableMergeCellsController.get('mergeColumns')
        };

    if (SC.typeOf(mergeAction) === SC.T_FUNCTION) {
      mergeAction.call(null, data);
    }

    this.close();
  },

  /**
   * Cancels and closes the dialog.
   */
  cancel: function() {
    this.close();
  },

  /**
   * Closes the dialog.
   */
  close: function() {
    var owner = this.get('owner'),
      ed;

    if (owner) {
      ed = owner.get('editor');
    }

    if (ed) {
      TinySC.Utils.closeDialog(ed, this);
    }

    TinySC.tableMergeCellsController.clear();
  }
});
