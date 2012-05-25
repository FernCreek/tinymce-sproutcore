//////////////////////////////////////////////////////////////////////////
// File: sourceEditor_vw.js
//
// Description:
//   Dialog for viewing the raw HTML source of the TinyMCE editor.
//   This is for debugging purposes only.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * HTML Source Editor dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.SourceEditorPane = SC.PanelPane.extend({
  layout: { width: 500, height: 350, centerX: 0, centerY: 0 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  sourceView: SC.outlet('contentView.sourceView'),

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider sourceView saveButton cancelButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),
        value: 'HTML Source Editor'
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    sourceView: SC.TextFieldView.extend({
      layout: { left: 20, right: 20, top: 68, bottom: 50 },
      isTextArea: YES
    }),

    saveButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, right: 110, bottom: 10 },
      theme: 'capsule',
      title: 'Update',
      action: 'save'
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, right: 20, bottom: 10 },
      theme: 'capsule',
      title: 'Close',
      action: 'cancel'
    })
  }),

  didAppendToDocument: function() {
    this.load();
  },

  /**
   * Loads the source from the owner's editor.
   */
  load: function() {
    var editor = SC.getPath(this, 'owner.editor'),
        sourceView = this.get('sourceView');

    if (editor && sourceView) {
      sourceView.set('value', editor.getContent({ source_view: true }));
    }
  },

  /**
   * Saves the source to the owner's editor and closes the dialog.
   */
  save: function() {
    var editor = SC.getPath(this, 'owner.editor'),
        sourceView = this.get('sourceView');

    if (editor && sourceView) {
      editor.setContent(sourceView.get('value'), { source_view: true });
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
  }
})
