function trim(str) {
  if (str && typeof(str.replace) == 'function') {
    return str.replace(/^\s+|\s+$/g, '');
  }
  return "";
}
function isEmptyObject(o) {
  var properties = []
  if (Object.keys) {
    properties = Object.keys(o);
  } else { // all this to support IE 8
      for (var p in o) if (Object.prototype.hasOwnProperty.call(o,p)) properties.push(p);
  }
  for (var i = 0; i < properties.length; i++) {
    var k = properties[i];
    if (o[k] != null && typeof o[k] != "string") return false;
    if (trim(o[k]).length != 0) return false;
  }
  return true;
}
function parseGoogleSpreadsheetURL(url) {
  parts = {
    key: null,
    worksheet: 0 // not really sure how to use this to get the feed for that sheet, so this is not ready except for first sheet right now
  }
  // key as url parameter (old-fashioned)
  var key_pat = /\bkey=([-_A-Za-z0-9]+)&?/i;
  var url_pat = /docs.google.com\/spreadsheets(.*?)\/d\//; // fixing issue of URLs with u/0/d

  if (url.match(key_pat)) {
    parts.key = url.match(key_pat)[1];
    // can we get a worksheet from this form?
  } else if (url.match(url_pat)) {
    var pos = url.search(url_pat) + url.match(url_pat)[0].length;
    var tail = url.substr(pos);
    parts.key = tail.split('/')[0]
    if (url.match(/\?gid=(\d+)/)) {
      parts.worksheet = url.match(/\?gid=(\d+)/)[1];
    }
  } else if (url.match(/^\b[-_A-Za-z0-9]+$/)) {
    parts.key = url;
  }

  if (parts.key) {
    return parts;
  } else {
    return null;
  }
}
function buildGoogleFeedURL(parts,sheet) {

  return "https://spreadsheets.google.com/feeds/list/" + parts + "/"+sheet+"/public/values?alt=json";
}