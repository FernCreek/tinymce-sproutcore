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

      // Clear the undo stack first, then start a new level AFTER the text has been set
      ed.undoManager.clear();
      ed.execCommand('mceAddUndoLevel');
    }
  },

  /**
   * Reloads the value into the WYSIWYG editor. This is solving a problem where the value of the
   * editor was being set before the editor was actually displayed on the screen, so in the load()
   * function above this.$textarea() was null, and therefore was never populated with a value.
   */
  reload: function() {
    var ed = this.get('editor');
    if (ed) {
      if (this.get('value') !== undefined) {
        // Set the textarea value if it is not already
        if(this.$textarea().val() !== this.get('value')) {
          this.$textarea().val(this.get('value'));
        }
      }
      ed.load();

      // Clear the undo stack first, then start a new level AFTER the text has been set
      ed.undoManager.clear();
      ed.execCommand('mceAddUndoLevel');
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

  /** @private */
  acceptsFirstResponder: function() {
    if (SC.FOCUS_ALL_CONTROLS) { return this.get('isEnabled'); }
    return NO;
  }.property('isEnabled'),

  /**
   * Gets the textarea element backing the editor.
   *
   * @returns {jQuery} The textarea element.
   *
   * @private
   */
  $textarea: function() {
    return this.$('textarea');
  },

  /**
   * Gets the TinyMCE editor's toolbar.
   *
   * @returns {jQuery} TinyMCE toolbar.
   *
   * @private
   */
  $toolbar: function() {
    return this.$('#%@_toolbargroup'.fmt(this.get('editorID')));
  },

  /**
   * Gets the TinyMCE editor's toolbar buttons.
   *
   * @returns {jQuery} TinyMCE toolbar buttons.
   *
   * @private
   */
  $toolbarButtons: function() {
    return this.$('#%@_toolbargroup a'.fmt(this.get('editorID')));
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
    // invokeLast so the editor is displayed in the DOM before calling the reload() function
    var that = this;
    this.invokeLast(function() {
      that.reload();
    });

    tinymce.execCommand('mceAddControl', true, this.get('editorID'));
  },

  /**
   * Removes the TinyMCE control when the view is removed from the document.
   */
  willDestroyLayer: function() {
    tinymce.execCommand('mceRemoveControl', false, this.get('editorID'));
  },

  /**
   * Handle moving focus around the control. Since the editor has an iframe,
   * this only handles events that happen outside of the iframe. A tinymce
   * event handler handles the other half of the work.
   *
   * @param {KeyboardEvent} evt Keydown event.
   *
   * @see TinySC.Callbacks.moveFocus
   */
  keyDown: function(evt) {
    var handled = NO,
        ed,
        curIdx = -1,
        newIdx,
        foundNextButton = NO,
        $buttons,
        $button,
        nextValidKeyView;

    if (evt.which === 9 || evt.keyCode === 9) {
      $buttons = this.$toolbarButtons();
      if ($buttons.length) {
        $buttons.each(function(index) {
          if ($(this).attr('data-tinysc-focus') === 'true') {
            curIdx = index;
            return false;
          }
        });

        if (curIdx > -1) {
          $buttons.eq(curIdx).removeAttr('data-tinysc-focus');
          newIdx = curIdx;
          do {
            newIdx += evt.shiftKey ? -1 : 1;
            $button = $buttons.eq(newIdx);

            if (newIdx >= 0 && newIdx < $buttons.length && $button.attr('aria-disabled') !== 'true') {
              foundNextButton = YES;
            }
          } while ((evt.shiftKey ? newIdx > 0 : newIdx < $buttons.length - 1) && !foundNextButton);

          if (foundNextButton) {
            $button.attr('data-tinysc-focus', 'true');
            $button[0].focus();
            handled = YES;
          }
        }
      }

      if (!handled) {
        if (evt.shiftKey) {
          nextValidKeyView = this.get('previousValidKeyView');
          if (nextValidKeyView) {
            nextValidKeyView.becomeFirstResponder();
            handled = YES;
          }
        } else {
          ed = this.get('editor');
          if (ed) {
            ed.focus();
            handled = YES;
          }
        }
      }
    }

    return handled;
  },

  /**
   * Handles setting initial focus when this control becomes the firstResponder.
   *
   * @param {SC.Responder} responder The responder that changed.
   */
  didBecomeFirstResponder: function(responder) {
    var $buttons = this.$toolbarButtons(),
        $button = $buttons.filter(':first');

    $buttons.removeAttr('data-tinysc-focus');

    if ($button.length) {
      $button.attr('data-tinysc-focus', 'true');
      $button[0].focus();
    }
  },

  /**
   * Handles clearing focus when this control loses firstResponder status.
   *
   * @param {SC.Responder} responder The responder that is about to change.
   */
  willLoseFirstResponder: function(responder) {
    var $buttons = this.$toolbarButtons();
    $buttons.removeAttr('data-tinysc-focus');
  }
});
