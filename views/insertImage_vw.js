//////////////////////////////////////////////////////////////////////////
// File: insertImage_vw.js
//
// Description:
//   Insert Image dialog.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

/**
 * @class
 *
 * Insert Image dialog.
 *
 * @extends SC.PanelPane
 */
TinySC.InsertImagePane = SC.PanelPane.extend({
  layout: { width: 500, height: 324, centerX: 0, centerY: 0 },
  classNames: 'modalDialog'.w(),

  /**
   * Owner view.
   *
   * @property {TinySC.WysiwygView}
   */
  owner: null,

  contentView: SC.View.extend({
    layout: { left: 0, right: 0, top: 0, bottom: 0 },
    childViews: 'titleBar titleDivider imageView dimensionsView insertButton cancelButton'.w(),

    titleBar: SC.View.extend({
      layout: { height: 42, top: 0 },
      childViews: 'titleLabel spinner'.w(),

      titleLabel: SC.LabelView.extend({
        layout: { left: 20, top: 22 },
        classNames: 'dialogTitleLabel'.w(),
        insertModeBinding: 'TinySC.insertImageController.insertMode',

        /**
         * Dialog title.
         *
         * @property {String}
         */
        value: function() {
          var title;

          if (this.get('insertMode')) {
            title = 'Insert Image';
          } else {
            title = 'Edit Image Size';
          }

          return title;
        }.property('insertMode').cacheable()
      }),

      spinner: RJS.SpinnerView.extend({
        layout: { width: 36, height: 36, right: 20, top: 10 },
        color: '#3873A9',
        isVisibleBinding: 'TinySC.insertImageController.uploadInProgress'
      })
    }),

    titleDivider: SC.View.extend({
      layout: { height: 1, left: 20, right: 20, top: 50 },
      classNames: 'dialogTitleDivider'.w()
    }),

    imageView: SC.View.extend({
      layout: { left: 20, right: 20, top: 68 },
      childViews: ['fileView', 'widthLabel', 'widthValueLabel', 'sizeLabel', 'sizeValueLabel',
        'heightLabel', 'heightValueLabel', 'typeLabel', 'typeValueLabel'],

      fileView: SC.ContainerView.extend({
        layout: { height: 24, top: 0 },
        insertModeBinding: 'TinySC.insertImageController.insertMode',

        nowShowing: function() {
          return this.get('insertMode') ? 'fileUploadView' : 'fileNameView';
        }.property('insertMode').cacheable(),

        fileUploadView: SC.FileFieldView.extend({
          inputName: 'file',
          delegate: TinySC.insertImageController,

          /**
           * Initializes the view.
           * This is necessary to ensure the delegate has a chance to be set.
           */
          init: function() {
            sc_super();
            this.set('formAction', TinySC.insertImageController.get('fileFieldFormAction'));
            this.set('hiddenInputs', TinySC.insertImageController.get('hiddenInputs'));
          }
        }),

        fileNameView: SC.View.extend({
          childViews: 'fileLabel fileNameLabel'.w(),

          fileLabel: SC.LabelView.extend({
            layout: { width: 50, height: 20 },
            classNames: 'dialogLabel rightAlignText'.w(),
            value: 'File'
          }),

          fileNameLabel: SC.LabelView.extend({
            layout: { left: 60 },
            valueBinding: 'TinySC.insertImageController.fileName'
          })
        })
      }),

      widthLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 0, top: 50 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Width'
      }),

      widthValueLabel: SC.LabelView.extend({
        layout: { width: 150, height: 20, left: 60, top: 50 },
        isVisibleBinding: 'TinySC.insertImageController.fileSelected',
        originalWidthBinding: 'TinySC.insertImageController.originalWidth',
        value: function() {
          return this.get('originalWidth') + ' pixels';
        }.property('originalWidth').cacheable()
      }),

      sizeLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 250, top: 50 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Size'
      }),

      sizeValueLabel: SC.LabelView.extend({
        layout: { height: 20, left: 310, right: 0, top: 50 },
        isVisibleBinding: 'TinySC.insertImageController.fileSelected',
        fileSizeBinding: 'TinySC.insertImageController.fileSize',
        value: function() {
          return this.get('fileSize') + ' bytes';
        }.property('fileSize').cacheable()
      }),

      heightLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 0, top: 80 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Height'
      }),

      heightValueLabel: SC.LabelView.extend({
        layout: { width: 150, height: 20, left: 60, top: 80 },
        isVisibleBinding: 'TinySC.insertImageController.fileSelected',
        originalHeightBinding: 'TinySC.insertImageController.originalHeight',
        value: function() {
          return this.get('originalHeight') + ' pixels';
        }.property('originalHeight').cacheable()
      }),

      typeLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 250, top: 80 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Type'
      }),

      typeValueLabel: SC.LabelView.extend({
        layout: { height: 20, left: 310, right: 0, top: 80 },
        isVisibleBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.imageType'
      })
    }),

    dimensionsView: SC.View.extend({
      layout: { left: 20, right: 20, top: 200 },
      childViews: ['percentWidthLabel', 'percentWidthValueTextField', 'percentWidthUnitLabel',
        'percentHeightLabel', 'percentHeightValueTextField', 'percentHeightUnitLabel',
        'pixelWidthLabel', 'pixelWidthValueTextField', 'pixelWidthUnitLabel',
        'pixelHeightLabel', 'pixelHeightValueTextField', 'pixelHeightUnitLabel', 'maintainAspectRatioCheckbox'],

      percentWidthLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 0, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Width'
      }),

      percentWidthValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 60, top: 0 },
        isEnabledBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.scaledPercentWidth'
      }),

      percentWidthUnitLabel: SC.LabelView.extend({
        layout: { width: 20, height: 20, left: 115, top: 0 },
        classNames: 'dialogLabel'.w(),
        value: '%'
      }),

      percentHeightLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 250, top: 0 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Height'
      }),

      percentHeightValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 310, top: 0 },
        isEnabledBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.scaledPercentHeight'
      }),

      percentHeightUnitLabel: SC.LabelView.extend({
        layout: { width: 20, height: 20, left: 365, top: 0 },
        classNames: 'dialogLabel'.w(),
        value: '%'
      }),

      pixelWidthLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 0, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Width'
      }),

      pixelWidthValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 60, top: 30 },
        isEnabledBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.scaledPixelWidth'
      }),

      pixelWidthUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 115, top: 30 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      pixelHeightLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 250, top: 30 },
        classNames: 'dialogLabel rightAlignText'.w(),
        value: 'Height'
      }),

      pixelHeightValueTextField: SC.TextFieldView.extend({
        layout: { width: 50, height: 20, left: 310, top: 30 },
        isEnabledBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.scaledPixelHeight'
      }),

      pixelHeightUnitLabel: SC.LabelView.extend({
        layout: { width: 50, height: 20, left: 365, top: 30 },
        classNames: 'dialogLabel'.w(),
        value: 'pixels'
      }),

      maintainAspectRatioCheckbox: SC.CheckboxView.extend({
        layout: { width: 200, height: 20, left: 0, top: 60 },
        classNames: 'dialogLabel'.w(),
        title: 'Maintain Aspect Ratio',
        isEnabledBinding: 'TinySC.insertImageController.fileSelected',
        valueBinding: 'TinySC.insertImageController.maintainAspectRatio'
      })
    }),

    insertButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, bottom: 20, right: 110 },
      theme: 'capsule',
      isDefault: YES,
      action: 'save',
      insertModeBinding: 'TinySC.insertImageController.insertMode',

      title: function() {
        return this.get('insertMode') ? 'Insert' : 'Save'
      }.property('insertMode')
    }),

    cancelButton: SC.ButtonView.extend({
      layout: { width: 80, height: 24, bottom: 20, right: 20 },
      theme: 'capsule',
      title: 'Cancel',
      action: 'cancel'
    })
  }),

  /**
   * Saves the link to the editor and closes the dialog.
   */
  save: function() {
    var owner = this.get('owner'),
        ed,
        imgHTML,
        node;

    if (owner) {
      ed = owner.get('editor');
    }

    node = TinySC.insertImageController.get('node');

    if (ed) {
      ed.makeReadOnly(false);

      imgHTML = ed.dom.createHTML('img', {
        src: TinySC.insertImageController.getImgSrc(TinySC.insertImageController.get('serverFileID')),
        width: TinySC.insertImageController.get('scaledPixelWidth'),
        height: TinySC.insertImageController.get('scaledPixelHeight'),
        'data-tinysc-file-name': TinySC.insertImageController.get('fileName'),
        'data-tinysc-server-file-id': TinySC.insertImageController.get('serverFileID'),
        'data-tinysc-original-width': TinySC.insertImageController.get('originalWidth'),
        'data-tinysc-original-height': TinySC.insertImageController.get('originalHeight'),
        'data-tinysc-file-size': TinySC.insertImageController.get('fileSize'),
        'data-tinysc-image-type': TinySC.insertImageController.get('imageType')
      });

      ed.execCommand('mceInsertContent', false, imgHTML);
    }

    this.close();
  },

  /**
   * Cancels and closes the dialog.
   */
  cancel: function() {
    this.close();
  },

  /**
   * Closes the dialog.
   */
  close: function() {
    var owner = this.get('owner'),
        ed;

    if (owner) {
      ed = owner.get('editor');
    }

    if (ed) {
      TinySC.Utils.closeDialog(ed, this);
    }

    TinySC.insertImageController.clear();
  }
});
