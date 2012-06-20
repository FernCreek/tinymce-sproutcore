//////////////////////////////////////////////////////////////////////////
// File: wysiwyg_vw.js
//
// Description:
//   WYSIWYG view using TinyMCE.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * SproutCore view encapsulating a TinyMCE editor.
 *
 * @extends SC.View
 * @extends SC.DelegateSupport
 * @extends TinySC.PasteDelegate
 */
TinySC.WysiwygView = SC.View.extend(SC.DelegateSupport, TinySC.PasteDelegate, {

  /**
   * Is this an expanded editor.
   *
   * @property {Boolean}
   */
  isExpanded: NO,

  /**
   * The title to use for the expanded editor.
   *
   * @property {String}
   */
  expandedEditorTitle: null,

  /**
   * Paste delegate object.
   *
   * @property {TinySC.PasteDelegate}
   */
  pasteDelegate: null,

  /**
   * The editor value.
   *
   * @property {String}
   */
  value: function(key, value) {
    if (value !== undefined) {
      this._value = value;
      this.load(value);
    }
    return this._value;
  }.property().cacheable(),

  /**
   * Is the editor dirty.
   * A dirty editor means that the user has made a change to the editor.
   *
   * @property {Boolean}
   */
  isDirty: function() {
    var ed = this.get('editor');
    return ed ? ed.isDirty() : NO;
  }.property(),

  /**
   * Loads the value into the TinyMCE editor.
   *
   * @param {String} value Value to load.
   */
  load: function(value) {
    var ed = this.get('editor');
    if (ed) {
      if (value !== undefined) {
        this.$textarea().val(value);
      }
      ed.load();
    }
  },

  /**
   * Saves the TinyMCE editor's value into our value property.
   *
   * @param {Boolean} postProcess Were we called from post process.
   */
  save: function(postProcess) {
    var ed = this.get('editor');
    if (ed) {
      ed.save({ no_events: !postProcess });
      this.propertyWillChange('value');
      this._value = this.$textarea().val();
      this.propertyDidChange('value');
    }
  },

  /**
   * Handles a paste in the editor.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @param {Object} o Paste object.
   */
  onPaste: function(ed, o) {
    this.invokeDelegateMethod(this.pasteDelegate, 'processPaste', ed, o);
  },

  /**
   * The TinyMCE editor.
   *
   * @property {tinymce.Editor}
   */
  editor: function() {
    return tinymce.get(this.get('editorID'));
  }.property('editorID').cacheable(),

  /**
   * Gets the textarea element backing the editor.
   *
   * @returns {jQuery} The textarea element.
   */
  $textarea: function() {
    return this.$('textarea');
  },

  /**
   * Initializes the view.
   */
  init: function() {
    var editorID;

    sc_super();

    this._value = '';

    editorID = SC.generateGuid(undefined, 'tinysc');
    this.set('editorID', editorID);
    TinySC.views[editorID] = this;

    this.adjust('minWidth', 740);
    this.adjust('minHeight', 60);
  },

  /**
   * Destroys the view.
   */
  destroy: function() {
    var editorID = this.get('editorID');

    sc_super();

    delete TinySC.views[editorID];
  },

  /**
   * Renders the view.
   *
   * @param {SC.RenderContext} context Render context.
   */
  render: function(context) {
    context.push('<textarea id="' + this.get('editorID') + '"></textarea>');
  },

  /**
   * Updates the view.
   *
   * @param {jQuery} jquery View element.
   */
  update: function(jquery) {
    // no-op
  },

  /**
   * Adds the TinyMCE control when the view is appended to the document.
   */
  didAppendToDocument: function() {
    tinymce.execCommand('mceAddControl', true, this.get('editorID'));
  },

  /**
   * Removes the TinyMCE control when the view is removed from the document.
   */
  willDestroyLayer: function() {
    tinymce.execCommand('mceRemoveControl', false, this.get('editorID'));
  }
});
