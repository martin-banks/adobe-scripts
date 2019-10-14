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
    folder: 'png_8_256',
    type: 'PNG',
    options: [
      { key: 'PNG8', value: true },
      { key: 'colors', value: 128 },
    ],
  },
  {
    folder: 'png_24_128',
    type: 'PNG',
    options: [
      { key: 'PNG8', value: false },
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
    folder: 'jpg_100',
    type: 'JPEG',
    options: [
      { key: 'quality', value: 100 },
      { key: 'transparancy', value: false },
    ],
  },
  {
    folder: 'jpg_40',
    type: 'JPEG',
    options: [
      { key: 'blur', value: 20 },
      { key: 'quality', value: 40 },
      { key: 'transparancy', value: false },
    ],
  },
];

var allDocs = app.documents
var currentFileIndex = 0

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


function processFile (doc) {
  var exportFolder = new Folder(doc.path + '/export_test/');
  if (!exportFolder.exists) {
    alert('Folder doesn\'t exist, better make it...');
    exportFolder.create();
  };

  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    var versionFolder = new Folder(doc.path + '/export_test/' + version.folder + '/');
    if (!versionFolder.exists) {
      versionFolder.create();
    };
    var output = new File(doc.path + '/export_test/' + version.folder + '/' + doc.name + '.' + version.type.toLowerCase());
    var options = exportOptions(version);

    doc.exportDocument(output, ExportType.SAVEFORWEB, options);
    if ((i + 1) === versions.length) {
      doc.save();
      doc.close();
      if (app.activeDocument) {
        processFile(app.activeDocument)
      } else {
        alert(allDocs.length + ' files processed.')
      }
    }
  }

}

processFile(app.activeDocument)
