//////////////////////////////////////////////////////////////////////////
// File: expandedEditor_vw.js
//
// Description:
//   Expanded editor dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

sc_require('views/wysiwyg_vw.js');

/**
 * @class
 *
 * Expanded Editor dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.ExpandedEditorPane = SC.PanelPane.extend({
  layout: { left: 20, right: 20, top: 20, bottom: 20 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  /** @private */
  wysiwygView: SC.outlet('contentView.wysiwygView'),

  /** @private */
  titleLabel: SC.outlet('contentView.titleBar.titleLabel'),

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider wysiwygView closeButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),
        value: 'Expanded Editor'
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    wysiwygView: TinySC.WysiwygView.extend({
      layout: { left: 20, right: 20, top: 68, bottom: 50 },
      isExpanded: YES
    }),

    closeButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, right: 20, bottom: 10 },
      theme: 'capsule',
      title: 'Close',
      action: 'saveContents'
    })
  }),

  /**
   * Saves the expanded editor contents to the owner view and closes the dialog.
   */
  saveContents: function() {
    var owner = this.get('owner'),
        wysiwygView = this.get('wysiwygView');

    if (owner && wysiwygView) {
      owner.set('value', wysiwygView.get('value'));
    }

    this.close();
  },

  /**
   * Loads the expanded editor contents from the owner view.
   */
  load: function() {
    var owner = this.get('owner'),
        wysiwygView = this.get('wysiwygView'),
        titleLabel = this.get('titleLabel'),
        title;

    if (owner && wysiwygView && titleLabel) {
      wysiwygView.set('value', owner.get('value'));
      wysiwygView.set('entityType', owner.get('entityType'));
      wysiwygView.set('entityID', owner.get('entityID'));
      wysiwygView.set('fieldID', owner.get('fieldID'));
      wysiwygView.set('reportedBy', owner.get('reportedBy'));
      title = owner.get('expandedEditorTitle');
      titleLabel.set('value', title ? title : 'Expanded Editor');
    }
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
});
