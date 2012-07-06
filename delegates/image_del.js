//////////////////////////////////////////////////////////////////////////
// File: image_del.js
//
// Description:
//   Delegate for image upload functionality.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/** @namespace
 *
 * Delegate for image upload functionality.
 * You should create an object that implements these methods.
 */
TinySC.ImageDelegate = {

  /**
   * Invoked when image upload is complete.
   *
   * @param {Object} result The result from the server.
   */
  imageUploadComplete: function(result) {
    return result;
  },

  /**
   * Invoked to get the image src string to insert into the editor.
   *
   * @param {String} serverFileID Server file ID token
   */
  getImageSource: function(serverFileID) {
    return '';
  },

  /**
   * Specifies the action attribute for the image upload form.
   *
   * @property {String}
   */
  formAction: '',

  /**
   * List of hidden inputs for the image upload form.
   *
   * @property {Array}
   */
  hiddenInputs: []
};
