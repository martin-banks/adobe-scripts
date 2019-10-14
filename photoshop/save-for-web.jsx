// DOCS: Official Adobe JSX docs
// DOCS: https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2019.pdf


var versions = [
  {
    folder: 'png_8_128',
    type: 'PNG',
    options: [
      { key: 'PNG8', value: true },
      { key: 'colors', value: 128 },
    ],
  },
  {
    folder: 'png_24_256',
    type: 'PNG',
    options: [
      { key: 'PNG8', value: false },
      { key: 'colors', value: 128 },
    ],
  },
  {
    folder: 'jpg_60',
    type: 'JPEG',
    options: [
      { key: 'quality', value: 60 },
      { key: 'transparancy', value: false },
    ],
  },
  {
    folder: 'jpg_40',
    type: 'JPEG',
    options: [
      { key: 'quality', value: 40 },
      { key: 'transparancy', value: false },
    ],
  },
  {
    folder: 'jpg_20',
    type: 'JPEG',
    options: [
      { key: 'quality', value: 20 },
      { key: 'transparancy', value: false },
    ],
  },
];


var allDocs = app.documents
var activeDoc = -1
var totalVersions = allDocs.length * versions.length

function createProgressWindow(title, min, max, parent, useCancel) {
  var win = new Window('palette', title);
  win.bar = win.add('progressbar', undefined, min, max);
  win.bar.preferredSize = [300, 20];

  win.parent = undefined;

  if (parent) {
    if (parent instanceof Window) {
      win.parent = parent;
    } else if (useCancel == undefined) {
      useCancel = parent;
    }
  }

  if (useCancel) {
    win.cancel = win.add('button', undefined, 'Cancel');
    win.cancel.onClick = function() {
      try {
        if (win.onCancel) {
          var rc = win.onCancel();
          if (rc || rc == undefined) {
            win.close();
          }
        } else {
          win.close();
        }
      } catch (e) {
        alert(e);
      }
    }
  }

  win.updateProgress = function(val) {
    var win = this;
    win.bar.value = val;
    // recenter the progressWindow if desired
    // win.center(win.parent);
    // win.show();
    // win.hide();
    // win.show();
  }
  win.center(win.parent);
  win.show()
  return win;
};

function exportOptions (version) {
  // * Create the export options from the settings in the main config object
  var options = new ExportOptionsSaveForWeb();
  options.format = SaveDocumentType[version.type];
  for (var opt = 0; opt < version.options.length; opt ++) {
    var optionObj = version.options[opt]
    options[optionObj.key] = optionObj.value;
  };
  return options
}

var progressWindow = createProgressWindow("Progress...", 0, totalVersions, true);
progressWindow.isDone = false;
progressWindow.onCancel = function () {
  this.isDone = true;
  return true; // return 'true' to close the window
}


function processFile (doc) {
  activeDoc++
  var exportFolder = new Folder(doc.path + '/__export/');
  if (!exportFolder.exists) {
    exportFolder.create();
  };

  try {
    for (var i = 0; i < versions.length; i++) {
      var processTick = (activeDoc * versions.length) + i
      progressWindow.text = ("Processing file " + processTick + " of " + totalVersions);
      progressWindow.updateProgress(processTick);
      var version = versions[i];
      var versionFolder = new Folder(doc.path + '/__export/' + version.folder + '/');
      if (!versionFolder.exists) {
        versionFolder.create();
      };
      var newFileName = doc.name.split('.').slice(0, -1).join('') + '.' + version.type.toLowerCase()
      var output = new File(doc.path + '/__export/' + version.folder + '/' + newFileName);
      var options = exportOptions(version);
  
      doc.exportDocument(output, ExportType.SAVEFORWEB, options);
      if ((i + 1) === versions.length) {
        doc.save();
        doc.close();
        try {
          if (app.documents.length) {
            processFile(app.activeDocument)
          } else {
            progressWindow.close();
          }
        } catch (err) {
          alert('ERROR starting next file:\n' + err)
        } finally {
          alert(doc.name + ' complete')
        }
      }
    }

  } catch (e) {
    // alert('Processing file error', + e);

  } finally {
    alert('Process complete')
  }

}


try {
  var answer = confirm('WARNING\nThis script will prpcess multiple versions of all open images, save and close them.\nDo you wish to proceed?')
  if (answer) {
    processFile(app.activeDocument)
  } else {
    alert('Process aborted')
  }
} catch (err) {
  alert(err)
}
