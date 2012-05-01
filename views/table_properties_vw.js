//////////////////////////////////////////////////////////////////////////
// File: table_properties_vw.js
//
// Description:
//   Table Properties dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Table Properties dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.TablePropertiesPane = SC.PanelPane.extend({
  layout: { width: 500, height: 300, centerX: 0, centerY: 0 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider tableSizeView tableOptionsView saveButton cancelButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),
        insertModeBinding: 'TinySC.tablePropertiesController.insertMode',

        /**
         * Dialog title.
         *
         * @property {String}
         */
        value: function() {
          var title;

          if (this.get('insertMode')) {
            title = 'Insert Table';
          } else {
            title = 'Table Properties';
          }

          return title;
        }.property('insertMode').cacheable()
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    tableSizeView: SC.View.extend({
      layout: { left: 20, right: 20, top: 68 },
      childViews: 'rowsLabel rowsValueTextField columnsLabel columnsValueTextField'.w(),

      rowsLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Rows'
      }),

      rowsValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 60, top: 0 },
        valueBinding: 'TinySC.tablePropertiesController.rows'
      }),

      columnsLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 120, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Columns'
      }),

      columnsValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 210, top: 0 },
        valueBinding: 'TinySC.tablePropertiesController.columns'
      })
    }),

    tableOptionsView: SC.View.extend({
      layout: { left: 20, right: 20, top: 100 },
      childViews: ['widthLabel', 'widthValueTextField', 'widthUnitLabel', 'cellPaddingLabel',
        'cellPaddingValueTextField', 'cellPaddingUnitLabel', 'cellSpacingLabel', 'cellSpacingValueTextField',
        'cellSpacingUnitLabel', 'frameLabel', 'frameButton', 'frameWidthLabel', 'frameWidthValueTextField',
        'frameWidthUnitLabel', 'alignmentLabel', 'alignmentButton', 'backgroundColorLabel', 'backgroundColorPicker'],

      widthLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Width'
      }),

      widthValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 120, top: 0 },
        valueBinding: 'TinySC.tablePropertiesController.width'
      }),

      widthUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 175, top: 0 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      cellPaddingLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Cell Padding'
      }),

      cellPaddingValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 120, top: 30 },
        valueBinding: 'TinySC.tablePropertiesController.cellPadding'
      }),

      cellPaddingUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 175, top: 30 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      cellSpacingLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 250, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Cell Spacing'
      }),

      cellSpacingValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 340, top: 30 },
        valueBinding: 'TinySC.tablePropertiesController.cellSpacing'
      }),

      cellSpacingUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 395, top: 30 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      frameLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 60 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Frame'
      }),

      frameButton: SC.SegmentedView.extend({
        layout: { width: 80, height: 20, left: 120, top: 60 },
        align: SC.ALIGN_LEFT,
        itemIconKey: 'icon',
        itemValueKey: 'value',
        valueBinding: 'TinySC.tablePropertiesController.frame',
        // TODO: Update icons.
        items: [
          {
            icon: '/ttweb/images/btn_table_frame_on.gif',
            value: 'on'
          },
          {
            icon: '/ttweb/images/btn_table_frame_off.gif',
            value: 'off'
          }
        ]
      }),

      frameWidthLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 250, top: 60 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Width'
      }),

      frameWidthValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 340, top: 60 },
        valueBinding: 'TinySC.tablePropertiesController.frameWidth'
      }),

      frameWidthUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 395, top: 60 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      alignmentLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 90 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Alignment'
      }),

      alignmentButton: SC.SegmentedView.extend({
        layout: { width: 120, height: 20, left: 120, top: 90 },
        align: SC.ALIGN_LEFT,
        itemIconKey: 'icon',
        itemValueKey: 'value',
        valueBinding: 'TinySC.tablePropertiesController.alignment',
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
          }
        ]
      }),

      backgroundColorLabel: SC.LabelView.extend({
        layout: { width: 110, height: 20, left: 0, top: 120 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Background Color'
      }),

      // TODO: color picker
      backgroundColorPicker: SC.TextFieldView.extend({
        layout: { width: 80, height: 20, left: 120, top: 120 },
        valueBinding: 'TinySC.tablePropertiesController.backgroundColor'
      })
    }),

    saveButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 250, right: 110 },
      theme: 'capsule',
      isDefault: YES,
      action: 'save',
      title: 'Save'
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 250, right: 20 },
      theme: 'capsule',
      title: 'Cancel',
      action: 'cancel'
    })
  }),

  /**
   * Saves the table properties to the editor and closes the dialog.
   */
  save: function() {
    var owner = this.get('owner'),
        ed,
        i,
        node,
        $table,
        $q,
        tableHtml,
        rows,
        currentRows,
        columns,
        width,
        cellPadding,
        cellSpacing,
        border,
        alignment,
        backgroundColor;

    if (owner) {
      ed = owner.get('editor');
    }

    rows = TinySC.tablePropertiesController.get('rows');
    columns = TinySC.tablePropertiesController.get('columns');

    if (TinySC.tablePropertiesController.get('insertMode')) {
      tableHtml = ed.dom.createHTML('table', {
        id: 'tinysc-table'
      }, '<tr><td>\u00a0</td></tr>');
      ed.execCommand('mceInsertContent', false, tableHtml, { skip_undo: true });
      $table = ed.$('#tinysc-table')
    } else {
      node = TinySC.tablePropertiesController.get('node');
      $table = ed.$(node);
    }

    if ($table && $table.length) {
      currentRows = TinySC.Utils.countTableRows($table);

      // add/remove rows
      if (currentRows > rows) {
        // need to remove rows
        $table.find('tr').slice(rows).remove();
      } else if (currentRows < rows) {
        // need to add rows
        for (i = 0; i < rows - currentRows; ++i) {
          $table.find('tr').filter(':last').after('<tr><td>\u00a0</td></tr>');
        }
      }

      // add/remove columns
      $table.find('tr').each(function() {
        var $this = ed.$(this),
            numColumns = TinySC.Utils.countRowColumns($this),
            i;

        if (numColumns > columns) {
          // need to remove columns
          $this.find('td').slice(columns).remove();
        } else if (numColumns < columns) {
          // need to add columns
          for (i = 0; i < columns - numColumns; ++i) {
            $this.find('td').filter(':last').after('<td>\u00a0</td>');
          }
        }
      });

      // set table properties
      width = TinySC.tablePropertiesController.get('width');
      cellPadding = TinySC.tablePropertiesController.get('cellPadding');
      cellSpacing = TinySC.tablePropertiesController.get('cellSpacing');
      border = TinySC.tablePropertiesController.get('frame') === 'on' ? TinySC.tablePropertiesController.get('frameWidth') : 0;
      alignment = TinySC.tablePropertiesController.get('alignment');
      backgroundColor = TinySC.tablePropertiesController.get('backgroundColor');

      $table
        .prop('width', width)
        .prop('cellPadding', cellPadding)
        .prop('cellSpacing', cellSpacing)
        .prop('border', border)
        .prop('align', alignment)
        .prop('bgColor', backgroundColor)
        .removeAttr('id');

      // The visual aid class gets added regardless of the border because of the way the table is created.
      // Toggle the class here based on the border.
      if (border) {
        $table.removeClass(ed.settings.visual_table_class);
      } else {
        $table.addClass(ed.settings.visual_table_class);
      }

      ed.execCommand('mceAddUndoLevel');
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
    // TODO: integrate this into the app's pane system
    this.remove();
    TinySC.tablePropertiesController.clear();
  }
});
