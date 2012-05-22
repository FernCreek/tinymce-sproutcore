//////////////////////////////////////////////////////////////////////////
// File: insert_link_vw.js
//
// Description:
//   Insert Link dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Insert Link dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.InsertLinkPane = SC.PanelPane.extend({
  layout: { width: 500, height: 200, centerX: 0, centerY: 0 },
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
        insertModeBinding: 'TinySC.insertLinkController.insertMode',

        /**
         * Dialog title.
         *
         * @property {String}
         */
        value: function() {
          var title;

          if (this.get('insertMode')) {
            title = 'Insert Hyperlink';
          } else {
            title = 'Edit Hyperlink';
          }

          return title;
        }.property('insertMode').cacheable()
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    mainContentView: SC.View.extend({
      layout: { left: 20, right: 20, top: 68 },
      childViews: 'typeLabel typeSelect urlLabel urlValueTextField displayTextLabel displayTextValueTextField'.w(),

      typeLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Type'
      }),

      typeSelect: SP.ExtendedSelectView.extend({
        layout: { width: 200, height: 20, left: 90, top: 0 },
        nameKey: 'title',
        valueKey: 'title',
        defaultTitle: '',
        defaultValue: '',
        objectsBinding: 'TinySC.insertLinkController.urlTypes',
        valueBinding: 'TinySC.insertLinkController.selectedUrlType'
      }),

      urlLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 0, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'URL'
      }),

      urlValueTextField: SC.TextFieldView.extend({
        layout: { height: 20, left: 90, top: 30 },
        valueBinding: 'TinySC.insertLinkController.url'
      }),

      displayTextLabel: SC.LabelView.extend({
        layout: { width: 80, height: 20, left: 0, top: 60 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Display Text'
      }),

      displayTextValueTextField: SC.TextFieldView.extend({
        layout: { height: 20, left: 90, top: 60 },
        isEditableBinding: 'TinySC.insertLinkController.displayTextEditable',
        valueBinding: 'TinySC.insertLinkController.displayText'
      })
    }),

    saveButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 160, right: 110 },
      theme: 'capsule',
      isDefault: YES,
      action: 'save',
      title: 'Save'
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, top: 160, right: 20 },
      theme: 'capsule',
      title: 'Cancel',
      action: 'cancel'
    })
  }),

  /**
   * Saves the link to the editor and closes the dialog.
   */
  save: function() {
    var owner = this.get('owner'),
        url = TinySC.insertLinkController.get('url'),
        displayText = TinySC.insertLinkController.get('displayText'),
        displayTextEditable = TinySC.insertLinkController.get('displayTextEditable'),
        ed;

    if (owner) {
      ed = owner.get('editor');
    }

    if (ed) {
      TinySC.Utils.restoreSelection(ed, TinySC.insertLinkController.get('bookmark'));

      ed.execCommand('mceInsertLink', false, {
        href: 'tinysc-link',
        title: 'Double-click to follow link',
        target: '_blank'
      }, {
        skip_undo: true
      });

      ed.$('a[href="tinysc-link"]').each(function() {
        var $this = ed.$(this);
        $this.attr('href', url);
        if (displayTextEditable) {
          $this.html(displayText);
        }
      });

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
    var owner = this.get('owner'),
        ed;

    if (owner) {
      ed = owner.get('editor');
    }

    if (ed) {
      TinySC.Utils.closeDialog(ed, this);
    }

    TinySC.insertLinkController.clear();
  }
});
