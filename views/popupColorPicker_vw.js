//////////////////////////////////////////////////////////////////////////
// File: popupColorPicker_vw.js
//
// Description:
//   Color picker popup.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Simple subclass of the color picker that can be opened from TinyMCE's
 * foreground/background color pickers.
 *
 * @extends SP.ColorPickerPane
 */
TinySC.PopupColorPicker = SP.ColorPickerPane.extend({

  /**
   * Indicates that the editor should not be made readonly while this pane is open.
   *
   * @property {Boolean}
   */
  editorEnabledWhileOpen: YES,

  /**
   * Override apply to call the function that was provided by TinyMCE to set the new color.
   */
  apply: function() {
    var applyFunction = this.get('applyFunction');

    sc_super();

    if (applyFunction) {
      applyFunction(this.get('appliedValue'))
    }
  }
});
