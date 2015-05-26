var oldUnits = app.preferences.typeUnits;
app.preferences.typeUnits = TypeUnits.POINTS

try {

var keepPrompting = confirm("Wait on each page?", true, "User Input Needed");

function trim (string)
{
  var ln
  var whitestringBegin = /^\s+/  
  var whitestringEnd = /\s+$/  
  if (ln = whitestringBegin.exec(string)) 
  {
    string = string.slice(ln.length);
  }
  if (ln = whitestringEnd.exec(string)) 
  {
    string = string.slice(0, string.length - ln.length);
  }
 
  return string  
}

var defaultColor =  new SolidColor
defaultColor.rgb.red = 0
defaultColor.rgb.green = 0
defaultColor.rgb.blue = 0

var defaultFont = "WildWordsRoman"
var defaultSize = 16;
var defaultsSet = false;

function setTextItemDefaults(textItemRef)
{
    textItemRef.kind = TextType.PARAGRAPHTEXT
    textItemRef.antiAliasMethod = AntiAlias.SMOOTH
    textItemRef.hyphenation = true;
    textItemRef.justification = Justification.CENTER;
    textItemRef.fauxItalic = false;
    textItemRef.fauxBold = false;
    textItemRef.underline = UnderlineType.UNDERLINEOFF;
    textItemRef.direction = Direction.HORIZONTAL;
    textItemRef.color = defaultColor;
    textItemRef.language = Language.ENGLISHUSA;
    textItemRef.size = defaultSize;    
    textItemRef.font = defaultFont;    
    
    return textItemRef;
}

var folder = Folder.selectDialog (prompt);
if (!folder) throw "no folder selected";

var script = folder.getFiles('*.txt');
if (!script || script.length != 1) throw "no txt file found in specified folder; please add exactly one txt file to folder";
script = script[0];

var psdFiles = folder.getFiles('*.psd');
if (!psdFiles || psdFiles == '') throw "no PSD files in that folder";

if (!script.open('r:')) throw "Failed to read script";

var ln;
var rePage = /^[-?\d]+$/

var translationScript = 
{
  pages: []    
};

var currentPage = { page: 0, lines:[] }

while (!script.eof)
{
  ln = script.readln()
  ln = trim(ln);
  if(!(ln))
  {
    continue
  }
  
  if (rePage.exec(ln))
  {
    if (currentPage != null) 
    {
      currentPage.lines.reverse();
      translationScript.pages.push(currentPage)
    }
    currentPage = { page: ln, lines:[] }
    continue
  }
  var ar = ln.split("//");
  for (var i = 0; i < ar.length; ++i) {
    ar[i] = trim(ar[i]);
    if (ar[i].length > 0)
      currentPage.lines.push(ar[i])  
  }
}
translationScript.pages.push(currentPage)

if (translationScript.pages.length != psdFiles.length) {
  var shouldContinue = confirm("PSD count does not match pages in script. Got "  + psdFiles.length + ", expecting " + translationScript.pages.length + ". Continue?", false, "User Input Needed");
  if (!shouldContinue) throw "Done.";
}

for (var i = 0; i < psdFiles.length && i < translationScript.pages.length; ++i)
{
  var psdFile = new File(psdFiles[i]);  
  var docRef = app.open(psdFile);    
  var page = translationScript.pages[i];  
  if (!page) throw 'error';
  var textLayers = 0; 
  
  for (var j = 0; !defaultsSet && j < docRef.artLayers.length; ++j)
  {
    var artLayer = docRef.artLayers[j];
    if (artLayer.kind != LayerKind.TEXT) continue;
    var textItemRef = artLayer.textItem;
    
    // use first bubble with text to override defaults
    if (!defaultsSet && textItemRef.contents != '')
    {
      defaultFont = textItemRef.font;
      defaultSize = textItemRef.size;
      defaultColor = textItemRef.color;
      defaultsSet = true;
    }
  }
  
  for (var j = 0; j < docRef.artLayers.length; ++j)
  {
    var artLayer = docRef.artLayers[j];
    if (artLayer.kind != LayerKind.TEXT) continue;
    var textItemRef = artLayer.textItem;
    
    if (page.lines[textLayers])
      textItemRef.contents = page.lines[textLayers];
    else
      textItemRef.contents = "<NO TEXT>";               

    textItemRef = setTextItemDefaults(textItemRef);  
    ++textLayers;
  }
  if (textLayers != page.lines.length) alert ('Warning: mismatch between lines  in script(' +  page.lines.length + ') and layers in PSD(' + textLayers + ')');

  if (keepPrompting)
  {
    var shouldContinue = confirm("Continue?", false, "User Input Needed");
    if (!shouldContinue) throw "Done.";
  } 
  docRef.close(SaveOptions.SAVECHANGES);
}
throw "Done.";
}
catch (e) { alert(e); }

app.preferences.typeUnits = oldUnits;