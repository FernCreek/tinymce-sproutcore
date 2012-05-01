//////////////////////////////////////////////////////////////////////////
// File: core.js
//
// Description:
//   Framework for integrating TinyMCE into a SproutCore app.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

sc_require('lib/tiny_mce_combined');

/** @namespace

 Framework for integrating TinyMCE into a SproutCore app.
  
  @extends SC.Object
*/
TinySC = SC.Object.create({

  NAMESPACE: 'TinySC',
  VERSION: '0.1.0',

  /**
   * Holds a mapping of TinyMCE editorID to WysiwygView.
   *
   * @property {Object}
   */
  views: {}
});

/** @namespace
 *
 * TinyMCE callbacks.
 */
TinySC.Callbacks = {

  /**
   * Called when the content of the TinyMCE editor changes, so the
   * WysiwygView's value can be updated.
   *
   * @param {tinymce.Editor} ed Editor instance.
   */
  contentChanged: function(ed) {
    var view = TinySC.Utils.getOwnerView(ed);
    if (view) {
      view.save();
    }
  },

  /**
   * Called on key down. If the key pressed was tab, 4 spaces will be inserted
   * into the TinyMCE editor.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @param {KeyboardEvent} evt Keydown event.
   */
  insertTab: function(ed, evt) {
    if (evt.keyCode === 9 && !evt.shiftKey && !evt.ctrlKey) {
      ed.execCommand('mceInsertContent', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
      tinymce.dom.Event.cancel(evt);
    }
  },

  /**
   * Called on double click. If the click target was an anchor tag,
   * the link is opened in a new window/tab.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @param {MouseEvent} e Doubleclick event.
   */
  activateLink: function(ed, e) {
    var el = TinySC.Utils.findClosestAnchorNode(SC.$(e.target));

    if (el) {
      window.open(el);
    }
  },

  /**
   * Called when the TinyMCE editor preprocesses the content.
   * Does any required cleaning of the content.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @param {Object} o Content object
   */
  clean: function(ed, o) {
    var $node = ed.$(o.node);
    $node.find('li:empty').append('\u00a0');
  }
};

/** @namespace
 *
 * TinyMCE related utility functions.
 */
TinySC.Utils = {

  /**
   * Gets the WysiwygView that owns the TinyMCE editor.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @returns {TinySC.WysiwygView} The owning WysiwygView.
   */
  getOwnerView: function(ed) {
    return TinySC.views[ed.id];
  },

  /**
   * Stores the editor's selection so it can be restored later.
   * On IE, interacting with one of the dialogs will clear the
   * selection. We need to store it when the dialog opens,
   * and restore it before inserting the dialog's content.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @returns {Object} Selection bookmark.
   */
  storeSelection: function(ed) {
    return ed.selection.getBookmark(1);
  },

  /**
   * Restores the editor's selection.
   *
   * @see TinySC.Utils.storeSelection
   * @param {tinymce.Editor} ed Editor instance.
   * @param {Object} bookmark Selection bookmark.
   */
  restoreSelection: function(ed, bookmark) {
    if (bookmark) {
      ed.selection.moveToBookmark(bookmark);
    }
  },

  /**
   * Finds the closest parent anchor node of the element,
   * which could be the element itself.
   *
   * @param {jQuery} $el Element to begin search at.
   * @returns {DOMElement} Closest anchor node, or null if none found.
   */
  findClosestAnchorNode: function($el) {
    var q = $el.closest('a');
    return (q && q.length) ? q[0] : null;
  },

  /**
   * Finds an anchor node that is a child of the element.
   *
   * @param {jQuery} $el Element to begin search at.
   * @returns {DOMElement} Child anchor node, or null if none found.
   */
  findChildAnchorNode: function($el) {
    var childAnchors = $el.find('a'),
        foundAnchor = null;

    if (childAnchors && childAnchors.length) {
      foundAnchor = childAnchors[0];
    }

    return foundAnchor;
  },

  /**
   * Counts the number of rows in a table.
   *
   * @param {jQuery} $table Table element.
   * @returns {Number} Count of table rows.
   */
  countTableRows: function($table) {
    return $table.find('tr').length;
  },

  /**
   * Counts the number of columns in a table.
   * This takes into account colSpan.
   *
   * @param {jQuery} $table Table element.
   * @returns {Number} Count of table columns.
   */
  countTableColumns: function($table) {
    var self = this,
        numColumns = 0;

    $table.find('tr').each(function() {
      numColumns = Math.max(self.countRowColumns(SC.$(this)), numColumns);
    });

    return numColumns;
  },

  /**
   * Counts the number of columns in a table row.
   * This takes into account colSpan.
   *
   * @param {jQuery} $row Row element.
   * @returns {Number} Count of row columns.
   */
  countRowColumns: function($row) {
    var numColumns = 0;

    $row.find('td').each(function() {
      numColumns += SC.$(this).prop('colSpan');
    });

    return numColumns;
  }
};

// Initialize the TinyMCE library.
tinymce.init({
  // Do not automatically create editors, we will add them when a WysiwygView is created.
  mode: 'none',
  theme: 'advanced',
  inline_styles: false,
  // Load our plugins, but ensure that TinyMCE does not try to load the JS files for them.
  plugins: '-contextmenu,-paste,-table,-seapine,-sproutcore,-seapine_sproutcore',

  theme_advanced_buttons1: '', // buttons are set in setup, depending on type of editor
  theme_advanced_buttons2: '',
  theme_advanced_buttons3: '',
  theme_advanced_toolbar_location: 'top',
  theme_advanced_toolbar_align: 'left',
  // Override the set of available fonts.
  theme_advanced_fonts: "Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva",

  paste_retain_style_properties: 'font-family,font-size,font-weight,font-style,color,background-color,text-align',
  paste_convert_middot_lists: false,
  paste_block_drop: true,
  content_css: false, // content_css is contained in tiny_mce_combined.js
  // Expand to fit the container.
  width: '100%',
  height: '100%',

  /**
   * Registers our callbacks on a newly created editor.
   *
   * @param {tinymce.Editor} ed Editor instance.
   */
  setup: function(ed) {
    var view = TinySC.Utils.getOwnerView(ed),
        normalEditorToolbarButtons = 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,fontselect,fontsizeselect,|,forecolor,backcolor,|,bullist,numlist,|,link,unlink,image,|,hr,|,table,|,spellcheck,expanded_editor,|,code',
        expandedEditorToolbarButtons = 'bold,italic,underline,strikethrough,|,justifyleft,justifycenter,justifyright,justifyfull,|,fontselect,fontsizeselect,|,forecolor,backcolor,|,bullist,numlist,|,link,unlink,image,|,hr,|,table,|,spellcheck,|,code';

    // Handle settings the toolbar buttons depending on whether we are expanded or not.
    if (view && view.get('isExpanded')) {
      ed.settings.theme_advanced_buttons1 = expandedEditorToolbarButtons;
    } else {
      ed.settings.theme_advanced_buttons1 = normalEditorToolbarButtons;
    }

    // Handle updating the value property on the WysiwygView associated with this editor.
    ed.onKeyUp.add(function(ed, e) {
      TinySC.Callbacks.contentChanged(ed);
    });
    ed.onExecCommand.add(function(ed, cmd, ui, val) {
      TinySC.Callbacks.contentChanged(ed);
    });

    // Handle inserting a 'tab' (4x &nbsp;) when the tab key is pressed.
    // This will override tab focus.
    ed.onKeyDown.add(TinySC.Callbacks.insertTab);

    // Handle activating links when double clicking on them.
    ed.onDblClick.add(TinySC.Callbacks.activateLink);

    // Handle cleaning the content.
    ed.onPreProcess.add(TinySC.Callbacks.clean);
  }
});
