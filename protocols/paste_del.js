//////////////////////////////////////////////////////////////////////////
// File: paste_delegate.js
//
// Description:
//   Delegate for paste functionality.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/** @namespace
 * Delegate for paste functionality.
 * You should create an object that implements these methods.
 */
TinySC.PasteDelegate = {

  /**
   * Invoked when pasting into the editor.
   *
   * @param {tinymce.Editor} ed Editor instance.
   * @param {Object} o Paste object.
   */
  processPaste: function(ed, o) {}

}
