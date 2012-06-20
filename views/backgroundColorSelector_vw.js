//////////////////////////////////////////////////////////////////////////
// File: backgroundColorSelector_vw.js
//
// Description:
//   Control that contains a color selector and a square displaying
//   the currently selected color.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Background color selector. Includes a square displaying the current color.
 *
 * @extends SC.View
 */
TinySC.BackgroundColorSelector = SC.View.extend({
  childViews: 'colorSelector colorDisplay'.w(),

  colorSelector: SP.ColorSelector.extend({
    layout: { width: 180 },
    defaultColor: '#FFFFFF',
    valueBinding: '.parentView.value'
  }),

  colorDisplay: SC.View.extend({
    layout: { width: 20, height: 20, left: 190, top: 2 },
    displayProperties: ['color'],
    colorBinding: '.parentView.colorSelector.value',

    render: function(context) {
      context.addStyle({
        border: '1px solid black',
        backgroundColor: this.get('color')
      });
    },

    update: function(jquery) {
      jquery.css({
        border: '1px solid black',
        backgroundColor: this.get('color')
      });
    }
  })
});
