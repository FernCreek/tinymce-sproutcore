//////////////////////////////////////////////////////////////////////////
// File: wysiwyg_vw.js
//
// Description:
//   Wysiwyg tests.
//
// Copyright:
//   Copyright © 2012 Seapine Software, Inc.
//   Licensed under MIT license (see license.js)
//////////////////////////////////////////////////////////////////////////
/*globals TinySC */

var pane = SP.ControlTestPane.extend()
  .add('wysiwygView', TinySC.WysiwygView, {
    layout: { width: 800, height: 100 },
    expandedEditorTitle: 'Description'
  });

describe('TinySC.WysiwygView', function() {
  var testHtml = '<p><a href="http://www.google.com">Google</a></p><p><table><tr><td>Cell</td></tr></table></p><p><img src="12345678.dat" width="25" height="75" data-tinysc-file-name="cat.png" data-tinysc-server-file-id="12345678.dat" data-tinysc-original-width="100" data-tinysc-original-height="200" data-tinysc-file-size="456789" data-tinysc-image-type="png"></p>';

  pane.standardSetup();

  beforeEach(function() {
    this.addMatchers({
      toExist: function() {
        return this.actual !== undefined && this.actual !== null;
      },

      toBeShown: function() {
        return this.actual && this.actual.get('isVisibleInWindow');
      }
    });
  });

  it('should handle tab focus', function() {
    var view = pane.view('wysiwygView'),
        i;

    expect(view.$('a.mce_bold').attr('data-tinysc-focus')).toEqual('true');

    SP.TestUtils.keyPressOn(view, SC.Event.KEY_TAB);

    expect(view.$('a.mce_italic').attr('data-tinysc-focus')).toEqual('true');

    for (i = 0; i < 23; ++i) {
      SP.TestUtils.keyPressOn(view, SC.Event.KEY_TAB);
    }

    expect(view.$('a.mce_removeformat').attr('data-tinysc-focus')).toEqual('true');
    expect(view.$('iframe')[0].contentDocument.hasFocus()).toBeFalsy();

    SP.TestUtils.keyPressOn(view, SC.Event.KEY_TAB);

    expect(view.$('iframe')[0].contentDocument.hasFocus()).toBeTruthy();
  });

  it('should make the link bold', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('bold', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    $a = ed.$('a');
    expect($a.prop('href')).toEqual('http://www.google.com/');
    expect($a.text()).toEqual('Google');
    expect($a.parent().is('strong')).toBeTruthy();
  });

  it('should make the link italic', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('italic', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    $a = ed.$('a');
    expect($a.prop('href')).toEqual('http://www.google.com/');
    expect($a.text()).toEqual('Google');
    expect($a.parent().is('em')).toBeTruthy();
  });

  it('should make the link underlined', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('underline', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    $a = ed.$('a');
    expect($a.prop('href')).toEqual('http://www.google.com/');
    expect($a.text()).toEqual('Google');
    expect($a.parent().css('text-decoration')).toEqual('underline');
  });

  it('should make the link strikethrough', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('strikethrough', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    $a = ed.$('a');
    expect($a.prop('href')).toEqual('http://www.google.com/');
    expect($a.text()).toEqual('Google');
    expect($a.parent().css('text-decoration')).toEqual('line-through');
  });

  it('should edit link', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('mceLink', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    expect(dialog.getPath('contentView.mainContentView.urlValueTextField.value')).toEqual('http://www.google.com/');
    expect(dialog.getPath('contentView.mainContentView.displayTextValueTextField.value')).toEqual('Google');

    dialog.setPath('contentView.mainContentView.urlValueTextField.value', 'http://www.slashdot.org');
    dialog.setPath('contentView.mainContentView.displayTextValueTextField.value', 'Slashdot');
    button = dialog.getPath('contentView.saveButton');
    SP.TestUtils.clickOn(button);
    expect(dialog).not.toBeShown();

    $a = ed.$('a');
    expect($a.prop('href')).toEqual('http://www.slashdot.org/');
    expect($a.text()).toEqual('Slashdot');
  });

  it('should remove link', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $a,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('a')[0]);
    ed.execCommand('unlink', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    $a = ed.$("p:contains('Google')");
    expect($a.prop('href')).toEqual(undefined);
    expect($a.text()).toEqual('Google');
  });

  it('should edit table', function() {
    var view = pane.view('wysiwygView'),
        ed = view.get('editor'),
        $table,
        dialog,
        button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('table')[0]);
    ed.execCommand('mceInsertTable', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    dialog.setPath('contentView.tableOptionsView.value', YES);
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    expect(dialog.getPath('contentView.tableSizeView.rowsValueTextField.value')).toEqual(1);
    expect(dialog.getPath('contentView.tableSizeView.columnsValueTextField.value')).toEqual(1);
    expect(dialog.getPath('contentView.tableOptionsView.contentView.widthValueTextField.value')).toEqual($(view.$('iframe')[0].contentDocument).find('.mceItemTable').outerWidth());
    expect(dialog.getPath('contentView.tableOptionsView.contentView.cellPaddingValueTextField.value')).toEqual(0);
    expect(dialog.getPath('contentView.tableOptionsView.contentView.cellSpacingValueTextField.value')).toEqual(0);
    expect(dialog.getPath('contentView.tableOptionsView.contentView.frameButton.value')).toEqual('off');
    expect(dialog.getPath('contentView.tableOptionsView.contentView.frameWidthValueTextField.value')).toEqual(0);
    expect(dialog.getPath('contentView.tableOptionsView.contentView.alignmentButton.value')).toEqual('left');
    expect(dialog.getPath('contentView.tableOptionsView.contentView.backgroundColorPicker.value')).toEqual('#ffffff');

    dialog.setPath('contentView.tableSizeView.rowsValueTextField.value', 10);
    dialog.setPath('contentView.tableSizeView.columnsValueTextField.value', 5);
    dialog.setPath('contentView.tableOptionsView.contentView.widthValueTextField.value', 200);
    dialog.setPath('contentView.tableOptionsView.contentView.cellPaddingValueTextField.value', 3);
    dialog.setPath('contentView.tableOptionsView.contentView.cellSpacingValueTextField.value', 2);
    dialog.setPath('contentView.tableOptionsView.contentView.frameButton.value', 'on');
    dialog.setPath('contentView.tableOptionsView.contentView.frameWidthValueTextField.value', 6);
    dialog.setPath('contentView.tableOptionsView.contentView.alignmentButton.value', 'right');
    dialog.setPath('contentView.tableOptionsView.contentView.backgroundColorPicker.value', '#334455');

    button = dialog.getPath('contentView.saveButton');
    SP.TestUtils.clickOn(button);
    expect(dialog).not.toBeShown();

    $table = ed.$('table');
    expect($table.find('tr').length).toEqual(10);
    expect($table.find('tr:first > td').length).toEqual(5);
    expect($table.prop('width')).toEqual('200');
    expect($table.prop('cellPadding')).toEqual('3');
    expect($table.prop('cellSpacing')).toEqual('2');
    expect($table.prop('border')).toEqual('6');
    expect($table.prop('align')).toEqual('right');
    expect($table.prop('bgColor')).toEqual('#334455');
  });

  it('should edit image', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $img,
      dialog,
      button;

    view.set('value', testHtml);

    ed.selection.select(ed.$('img')[0]);
    ed.execCommand('mceImage', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.RunLoop.begin();
    SC.RunLoop.end();
    SC.Binding.flushPendingChanges();

    expect(dialog.getPath('contentView.imageView.fileView.contentView.fileNameLabel.value')).toEqual('cat.png');
    expect(dialog.getPath('contentView.imageView.widthValueLabel.value')).toEqual('100 pixels');
    expect(dialog.getPath('contentView.imageView.heightValueLabel.value')).toEqual('200 pixels');
    expect(dialog.getPath('contentView.imageView.sizeValueLabel.value')).toEqual('456789 bytes');
    expect(dialog.getPath('contentView.imageView.typeValueLabel.value')).toEqual('png');
    expect(dialog.getPath('contentView.dimensionsView.percentWidthValueTextField.value')).toEqual(25);
    expect(dialog.getPath('contentView.dimensionsView.pixelWidthValueTextField.value')).toEqual('25');
    expect(dialog.getPath('contentView.dimensionsView.percentHeightValueTextField.value')).toEqual(38);
    expect(dialog.getPath('contentView.dimensionsView.pixelHeightValueTextField.value')).toEqual('75');
    expect(dialog.getPath('contentView.dimensionsView.maintainAspectRatioCheckbox.value')).toEqual(NO);

    dialog.setPath('contentView.dimensionsView.percentWidthValueTextField.value', 300);
    dialog.setPath('contentView.dimensionsView.percentHeightValueTextField.value', 500);
    SC.RunLoop.begin();
    SC.RunLoop.end();
    SC.Binding.flushPendingChanges();

    expect(dialog.getPath('contentView.dimensionsView.pixelWidthValueTextField.value')).toEqual(300);
    expect(dialog.getPath('contentView.dimensionsView.pixelHeightValueTextField.value')).toEqual(1000);

    button = dialog.getPath('contentView.saveButton');
    SP.TestUtils.clickOn(button);
    expect(dialog).not.toBeShown();

    $img = ed.$('img');
    expect($img.attr('width')).toEqual('300');
    expect($img.attr('height')).toEqual('1000');
    expect($img.attr('data-tinysc-file-name')).toEqual('cat.png');
    expect($img.attr('data-tinysc-original-width')).toEqual('100');
    expect($img.attr('data-tinysc-original-height')).toEqual('200');
    expect($img.attr('data-tinysc-file-size')).toEqual('456789');
    expect($img.attr('data-tinysc-image-type')).toEqual('png');
  });

  it('should show/hide the popout editor', function() {
    var view = pane.view('wysiwygView'),
      ed = view.get('editor'),
      $expDialog,
      dialog,
      button;

    view.set('value', testHtml);

    ed.execCommand('scOpenExpandedEditor', true);

    dialog = SC.RootResponder.responder.get('keyPane');
    expect(dialog).toBeShown();
    SC.Binding.flushPendingChanges();

    // Check that this is the expanded dialog
    $expDialog = $('.modalDialog');
    expect($expDialog.find('.dialogTitleLabel').text()).toEqual('Expanded Editor');

    // Check that the expand dialog button is hidden from the user
    expect($expDialog.find('.mce_expanded_editor').length).toEqual(0);
    expect($expDialog.find('a .mce_code').length).toEqual(1);

    // Close the dialog
    button = dialog.getPath('contentView.closeButton');
    SP.TestUtils.clickOn(button);
    expect(dialog).not.toBeShown();
  });
});
