//////////////////////////////////////////////////////////////////////////
// File: insert_link_con.js
//
// Description:
//   Controller for the Insert Link dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Insert Link dialog controller.
 *
 * @extends SC.Object
 */
TinySC.insertLinkController = SC.Object.create({

  /**
   * Initializes the controller.
   */
  init: function() {
    sc_super();
    this._selectedUrlType = 'ttstudio://';
  },

  /**
   * Clears the controller state.
   */
  clear: function() {
    this.beginPropertyChanges()
      .set('insertMode', YES)
      .set('bookmark', null)
      .set('selectedUrlType', 'ttstudio://')
      .set('url', 'ttstudio://')
      .set('displayText', '')
      .set('displayTextEditable', YES)
    .endPropertyChanges();
  },

  /**
   * Determines the url type.
   *
   * @param {String} url A URL string.
   * @returns {String} URL type or ''.
   */
  getUrlType: function(url) {
    var urlTypes = this.get('urlTypes'),
        type;

    type = urlTypes.find(function(item) {
      if (item.title.length && url.substring(0, item.title.length) === item.title) {
        return YES;
      }
    });

    return type ? type.title : '';
  },

  /**
   * Dialog mode. YES = insert, NO = edit.
   *
   * @property {Boolean}
   */
  insertMode: YES,

  /**
   * Selection bookmark.
   *
   * @property {Object}
   */
  bookmark: null,

  /**
   * Valid URL types.
   *
   * @property {Array}
   */
  urlTypes: [
    { title: '' },
    { title: 'ttstudio://' },
    { title: 'sscm://' },
    { title: 'ftp://' },
    { title: 'http://' },
    { title: 'https://' },
    { title: 'nntp://' },
    { title: 'telnet://' },
    { title: 'file://' },
    { title: 'mailto:' },
    { title: 'news://' }
  ],

  /**
   * URL.
   *
   * @property {String}
   */
  url: 'ttstudio://',

  /**
   * Display text.
   *
   * @property {String}
   */
  displayText: '',

  /**
   * Is the display text editable.
   *
   * @property {Boolean}
   */
  displayTextEditable: YES,

  /**
   * Selected URL type.
   *
   * @property {String}
   */
  selectedUrlType: function(key, value) {
    var url,
        urlType;
    if (value !== undefined) {
      this._selectedUrlType = value;
      url = this.get('url');
      urlType = this.getUrlType(url);
      url = value + url.substring(urlType.length);
      this.set('url', url);
    }
    return this._selectedUrlType;
  }.property().cacheable()
});
