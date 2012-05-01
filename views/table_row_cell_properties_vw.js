//////////////////////////////////////////////////////////////////////////
// File: table_row_cell_properties_vw.js
//
// Description:
//   Table Row/Cell Properties dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Row/Cell Properties dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.TableRowCellPropertiesPane = SC.PanelPane.extend({
  layout: { width: 500, height: 170, centerX: 0, centerY: 0 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider mainContentView saveButton cancelButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),
        rowModeBinding: 'TinySC.tableRowCellPropertiesController.rowMode',

        /**
         * Dialog title.
         *
         * @property {String}
         */
        value: function() {
          var title;

          if (this.get('rowMode')) {
            title = 'Row Properties';
          } else {
            title = 'Cell Properties';
          }

          return title;
        }.property('rowMode').cacheable()
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    mainContentView: SC.View.extend({
      layout: { left: 20, right: 20, top: 68 },
      childViews: 'alignmentLabel horizontalAlignmentButton verticalAlignmentButton backgroundColorLabel backgroundColorPicker'.w(),

      alignmentLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Alignment'
      }),

      horizontalAlignmentButton: SC.SegmentedView.extend({
        layout: { width: 160, height: 20, left: 120, top: 0 },
        align: SC.ALIGN_LEFT,
        valueBinding: 'TinySC.tableRowCellPropertiesController.horizontalAlignment',
        itemIconKey: 'icon',
        itemValueKey: 'value',
        // TODO: Update icons.
        items: [
          {
            icon: '/ttweb/images/btn_table_align_left.gif',
            value: 'left'
          },
          {
            icon: '/ttweb/images/btn_table_align_center.gif',
            value: 'center'
          },
          {
            icon: '/ttweb/images/btn_table_align_right.gif',
            value: 'right'
          },
          {
            icon: '/ttweb/images/btn_table_align_right.gif',
            value: 'full'
          }
        ]
      }),

      verticalAlignmentButton: SC.SegmentedView.extend({
        layout: { width: 120, height: 20, left: 300, top: 0 },
        align: SC.ALIGN_LEFT,
        itemIconKey: 'icon',
        itemValueKey: 'value',
        valueBinding: 'TinySC.tableRowCellPropertiesController.verticalAlignment',
        // TODO: Update icons.
        items: [
          {
            icon: '/ttweb/images/btn_table_align_left.gif',
            value: 'top'
          },
          {
            icon: '/ttweb/images/btn_table_align_center.gif',
            value: 'middle'
          },
          {
            icon: '/ttweb/images/btn_table_align_right.gif',
            value: 'bottom'
          }
        ]
      }),

      backgroundColorLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Background Color'
      }),

      // TODO: color picker
      backgroundColorPicker: SC.TextFieldView.extend({
        layout: { width: 80, height: 20, left: 120, top: 30 },
        valueBinding: 'TinySC.tableRowCellPropertiesController.backgroundColor'
      })
    }),

    saveButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 130, right: 110 },
      theme: 'capsule',
      isDefault: YES,
      action: 'save',
      title: 'Save'
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 130, right: 20 },
      theme: 'capsule',
      title: 'Cancel',
      action: 'cancel'
    })
  }),

  /**
   * Saves the row/cell properties to the editor and closes the dialog.
   */
  save: function() {
    var owner = this.get('owner'),
        ed,
        node,
        $q,
        horizontalAlignment,
        verticalAlignment,
        backgroundColor;

    if (owner) {
      ed = owner.get('editor');
    }

    node = TinySC.tableRowCellPropertiesController.get('node');

    if (TinySC.tableRowCellPropertiesController.get('rowMode')) {
      $q = ed.$(node).children('td').andSelf();
    } else {
      $q = ed.$(node);
    }

    horizontalAlignment = TinySC.tableRowCellPropertiesController.get('horizontalAlignment');
    verticalAlignment = TinySC.tableRowCellPropertiesController.get('verticalAlignment');
    backgroundColor = TinySC.tableRowCellPropertiesController.get('backgroundColor');

    $q
      .prop('align', horizontalAlignment)
      .prop('vAlign', verticalAlignment)
      .prop('bgColor', backgroundColor);

    ed.execCommand('mceAddUndoLevel');

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
    // TODO: integrate this into the app's pane system
    this.remove();
    TinySC.tableRowCellPropertiesController.clear();
  }
});
