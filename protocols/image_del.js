//////////////////////////////////////////////////////////////////////////
// File: insert_image_delegate.js
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
TinySC.InsertImageDelegate = {

  /**
   * Invoked when image upload is complete.
   *
   * @param {Object} result The result from the server.
   */
  imageUploadComplete: function(result) {},

  /**
   * Invoked to get the image src string to insert into the editor.
   *
   * @param {String} serverFileID Server file ID token
   */
  getImageSource: function(serverFileID) {},

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
