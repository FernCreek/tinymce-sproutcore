//////////////////////////////////////////////////////////////////////////
// File: insertImage_con.js
//
// Description:
//   Controller for the Insert Image dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

sc_require('delegates/image_del');

/**
 * @class
 *
 * Insert Image dialog controller.
 *
 * @extends SC.Object
 * @extends SC.DelegateSupport
 * @extends TinySC.InsertImageDelegate
 */
TinySC.insertImageController = SC.Object.create(SC.DelegateSupport, TinySC.ImageDelegate, {

  /**
   * Initializes the controller.
   */
  init: function() {
    sc_super();
    this._originalWidth = 0;
    this._originalHeight = 0;
    this._scaledPercentWidth = 0;
    this._scaledPercentHeight = 0;
    this._scaledPixelWidth = 0;
    this._scaledPixelHeight = 0;
  },

  /**
   * Clears the controller state.
   */
  clear: function() {
    this.beginPropertyChanges()
      .set('insertMode', YES)
      .set('node', null)
      .set('fileSelected', NO)
      .set('uploadInProgress', NO)
      .set('fileName', '')
      .set('fileSize', 0)
      .set('imageType', 'none')
      .set('originalWidth', 0)
      .set('originalHeight', 0)
      .set('scaledPixelWidth', 0)
      .set('scaledPixelHeight', 0)
      .set('maintainAspectRatio', NO)
    .endPropertyChanges();
  },

  /**
   * Dialog mode. YES = insert, NO = edit.
   *
   * @property {Boolean}
   */
  insertMode: YES,

  /**
   * Selected node.
   *
   * @property {DOMElement}
   */
  node: null,

  /**
   * Insert image delegate.
   *
   * @property {TinySC.ImageDelegate}
   */
  delegate: null,

  /**
   * Is a file selected.
   *
   * @property {Boolean}
   */
  fileSelected: NO,

  /**
   * Is an upload in progress.
   *
   * @property {Boolean}
   */
  uploadInProgress: NO,

  /**
   * Selected file name.
   *
   * @property {String}
   */
  fileName: '',

  /**
   * Server file ID token.
   *
   * @property {String}
   */
  serverFileID: '',

  /**
   * File size in bytes.
   *
   * @property {Number}
   */
  fileSize: 0,

  /**
   * Image type.
   *
   * Possible values are 'none', 'png', 'gif', 'bmp', 'jpg'.
   *
   * @property {String}
   */
  imageType: 'none',

  /**
   * Original image width.
   *
   * @property {Number}
   */
  originalWidth: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._originalWidth = value;
      tmp = Math.round(value * this._scaledPercentWidth / 100);
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPixelWidth');
        this._scaledPixelWidth = tmp;
        this.propertyDidChange('scaledPixelWidth');
      }
    }
    return this._originalWidth;
  }.property(),

  /**
   * Original image height.
   *
   * @property {Number}
   */
  originalHeight: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._originalHeight = value;
      tmp = Math.round(value * this._scaledPercentHeight / 100);
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPixelHeight');
        this._scaledPixelHeight = tmp;
        this.propertyDidChange('scaledPixelHeight');
      }
    }
    return this._originalHeight;
  }.property(),

  /**
   * Percentage to scale the image width.
   *
   * @property {Number}
   */
  scaledPercentWidth: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._scaledPercentWidth = value;
      tmp = Math.round(this.get('originalWidth') * value / 100);
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPixelWidth');
        this._scaledPixelWidth = tmp;
        this.propertyDidChange('scaledPixelWidth');
      }
      if (this._maintainAspectRatio) {
        tmp = this._scaledPercentWidth;
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPercentHeight');
          this._scaledPercentHeight = tmp;
          this.propertyDidChange('scaledPercentHeight');
        }
        tmp = Math.round(this.get('originalHeight') * this._scaledPercentHeight / 100);
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPixelHeight');
          this._scaledPixelHeight = tmp;
          this.propertyDidChange('scaledPixelHeight');
        }
      }
    }
    return this._scaledPercentWidth;
  }.property(),

  /**
   * Percentage to scale the image height.
   */
  scaledPercentHeight: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._scaledPercentHeight = value;
      tmp = Math.round(this.get('originalHeight') * value / 100);
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPixelHeight');
        this._scaledPixelHeight = tmp;
        this.propertyDidChange('scaledPixelHeight');
      }
      if (this._maintainAspectRatio) {
        tmp = this._scaledPercentHeight;
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPercentWidth');
          this._scaledPercentWidth = tmp;
          this.propertyDidChange('scaledPercentWidth');
        }
        tmp = Math.round(this.get('originalWidth') * this._scaledPercentWidth / 100);
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPixelWidth');
          this._scaledPixelWidth = tmp;
          this.propertyDidChange('scaledPixelWidth');
        }
      }
    }
    return this._scaledPercentHeight;
  }.property(),

  /**
   * Pixel width to scale image to.
   *
   * @property {Number}
   */
  scaledPixelWidth: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._scaledPixelWidth = value;
      tmp = Math.round(value * 100 / this.get('originalWidth'));
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPercentWidth');
        this._scaledPercentWidth = tmp;
        this.propertyDidChange('scaledPercentWidth');
      }
      if (this._maintainAspectRatio) {
        tmp = this._scaledPercentWidth;
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPercentHeight');
          this._scaledPercentHeight = tmp;
          this.propertyDidChange('scaledPercentHeight');
        }
        tmp = Math.round(this.get('originalHeight') * this._scaledPercentHeight / 100);
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPixelHeight');
          this._scaledPixelHeight = tmp;
          this.propertyDidChange('scaledPixelHeight');
        }
      }
    }
    return this._scaledPixelWidth;
  }.property(),

  /**
   * Pixel height to scale image to.
   *
   * @property {Number}
   */
  scaledPixelHeight: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._scaledPixelHeight = value;
      tmp = Math.round(value * 100 / this.get('originalHeight'));
      if (isFinite(tmp)) {
        this.propertyWillChange('scaledPercentHeight');
        this._scaledPercentHeight = tmp;
        this.propertyDidChange('scaledPercentHeight');
      }
      if (this._maintainAspectRatio) {
        tmp = this._scaledPercentHeight;
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPercentWidth');
          this._scaledPercentWidth = tmp;
          this.propertyDidChange('scaledPercentWidth');
        }
        tmp = Math.round(this.get('originalWidth') * this._scaledPercentWidth / 100);
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPixelWidth');
          this._scaledPixelWidth = tmp;
          this.propertyDidChange('scaledPixelWidth');
        }
      }
    }
    return this._scaledPixelHeight;
  }.property(),

  /**
   * Should the image's aspect ration be preserved.
   *
   * @property {Boolean}
   */
  maintainAspectRatio: function(key, value) {
    var tmp;
    if (value !== undefined) {
      this._maintainAspectRatio = value;
      if (value) {
        tmp = this._scaledPercentWidth;
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPercentHeight');
          this._scaledPercentHeight = tmp;
          this.propertyDidChange('scaledPercentHeight');
        }
        tmp = Math.round(this.get('originalHeight') * this._scaledPercentHeight / 100);
        if (isFinite(tmp)) {
          this.propertyWillChange('scaledPixelHeight');
          this._scaledPixelHeight = tmp;
          this.propertyDidChange('scaledPixelHeight');
        }
      }
    }
    return this._maintainAspectRatio;
  }.property(),

  /**
   * Called when the file field value changes.
   *
   * @param {SC.FileFieldView} fileFieldView FileFieldView instance.
   * @param {String} value New value.
   * @param {String} previousValue Previous value.
   */
  fileFieldValueDidChange: function(fileFieldView, value, previousValue) {
    this.beginPropertyChanges()
      .set('fileSelected', YES)
      .set('fileName', value)
    .endPropertyChanges();
  },

  /**
   * Called when the file field is submitted.
   *
   * @param {SC.FileFieldView} fileFieldView FileFieldView instance.
   * @param {String} uuid Upload UUID.
   */
  fileFieldViewDidSubmit: function(fileFieldView, uuid) {
    this.set('uploadInProgress', YES);
  },

  /**
   * Called when file field upload is completed.
   *
   * @param {SC.FileFieldView} fileFieldView FileFieldView instance.
   * @param {Object} result Result from server.
   */
  fileFieldViewDidComplete: function(fileFieldView, result) {
    result = this.invokeDelegateMethod(this.delegate, 'imageUploadComplete', result);

    if (!SC.none(result)) {
      this.beginPropertyChanges()
        .set('serverFileID', result.serverFileID)
        .set('originalWidth', result.imageWidth)
        .set('originalHeight', result.imageHeight)
        .set('fileSize', result.fileSize)
        .set('imageType', result.imageType)
        .set('scaledPercentWidth', 100)
        .set('scaledPercentHeight', 100)
        .set('maintainAspectRatio', YES)
      .endPropertyChanges();
    }

    this.set('uploadInProgress', NO);
  },

  /**
   * Gets the form action string from the delegate.
   *
   * @returns {String} Form action.
   */
  fileFieldFormAction: function() {
    return this.getDelegateProperty('formAction', this.get('delegate'));
  }.property('delegate'),

  /**
   * Gets the hidden inputs from the delegate.
   *
   * @returns {Array} Hidden inputs.
   */
  fileFieldHiddenInputs: function() {
    return this.getDelegateProperty('hiddenInputs', this.get('delegate'));
  }.property('delegate'),

  /**
   * Gets the image src string from the delegate.
   *
   * @param {String} serverFileID Server file ID token.
   * @returns {String} Image src.
   */
  getImgSrc: function(serverFileID) {
    return this.invokeDelegateMethod(this.get('delegate'), 'getImageSource', serverFileID);
  }
});
