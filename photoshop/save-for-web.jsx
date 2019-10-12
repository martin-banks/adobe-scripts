// DOCS: Official Adobe JSX docs
// DOCS: https://www.adobe.com/content/dam/acom/en/devnet/photoshop/pdfs/photoshop-cc-javascript-ref-2019.pdf


function init () {
  var doc = app.activeDocument
  var allDocs = app.documents
  alert(allDocs.length)

  var layers = doc.layers
  alert('Layers: ' + layers.length)

  var exportFolder = new Folder(doc.path + '/export_test/');
  if (!exportFolder.exists) {
    alert('Folder doesn\'t exist, better make it...');
    exportFolder.create();
  };
  var exportTargets = [
    'png_8_128',
    'png_8_256',
    'png_24_128',
    'png_24_256',
  ]

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

  for (var i = 0; i < versions.length; i++) {
    var version = versions[i];
    var newFolder = new Folder(doc.path + '/export_test/' + version.folder + '/');
    if (!newFolder.exists) {
      newFolder.create();
    };
    var output = new File(doc.path + '/export_test/' + version.folder + '/' + doc.name + '.' + version.type.toLowerCase());
    var options = new ExportOptionsSaveForWeb();
    options.format = SaveDocumentType[version.type];

    // ! ES3 only supported by adobe scripting
    // ! Either configure a transpiler or reqrite options
    // var versionOptions = Object.keys(version.options);
    for (var opt = 0; opt < version.options.length; opt ++) {
      var optionObj = version.options[opt]
      options[optionObj.key] = optionObj.value;
    };

    doc.exportDocument(output, ExportType.SAVEFORWEB, options);
  }

  doc.close()


  // for (var i = 0; i < exportTargets.length; i++) {
  //   var target = exportTargets[i]
  //   var newFolder = new Folder(doc.path + '/export_test/' + target + '/');
  //   if (!newFolder.exists) {
  //     alert(target + ' doesn\'t exist, better make it...');
  //     newFolder.create();
  //   };
  // };


  // var exportFolderPNG_8_128 = new Folder()
  // var output = new File(doc.path + '/export_test/' + 'test-03.png');

  // var options = new ExportOptionsSaveForWeb();
  // options.format = SaveDocumentType.PNG;
  // options.colors = 128;
  // options.PNG8 = true;

  // doc.exportDocument(output, ExportType.SAVEFORWEB, options);

}

init()
