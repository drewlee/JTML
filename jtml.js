(function(factory){
  if (typeof define === 'function' && define.amd){
    define(factory);
  } else if (typeof module === 'object' && typeof module.exports === 'object'){
    module.exports = factory();
  } else {
    this.parseJTML = factory();
  }
}).call(this, function(){
  'use strict';

  var SELF_CLOSING_TAGS = [
        'input',
        'meta',
        'col',
        'br',
        'hr',
        'img',
        'link'
      ],
      REGEX = {
        SELF_CLOSING_TAGS: new RegExp('^(' + SELF_CLOSING_TAGS.join('|') + ')$', 'i'),
        ATTRS: /\[[^\]]+\]/g,
        ATTRS_QUOTE: /=([^\s]+)/g,
        BRACKETS: /\[|\]/g,
        TAGS: /^[^#.\s]+/,
        ID: /#([^.#\s]+)/,
        CLASSNAMES: /\.[^.#\s]+/g,
        DOTS: /\./g
      },
      ATTRS = {
        ID: 'id="%s"',
        CLASSNAME: 'class="%s"'
      };
  
  function isArray(arr){
    return ({}).toString.call(arr) === '[object Array]';
  }

  function isObject(obj){
    return ({}).toString.call(obj) === '[object Object]';
  }

  function format(str, val){
    return str.replace('%s', val);
  }

  // deep level object parsing
  function parse(obj){
    var str = '',
        tag;
    
    if ( isArray(obj) ){
      for (var i=0, lgth=obj.length; i<lgth; i++){
        str += parse( obj[i] );
      }
    } else if ( isObject(obj) ){
      for (var prop in obj){
        tag = parseAttr(prop);
        
        str += tag.open + parse( obj[prop] ) + tag.close;
      }
    } else if (typeof obj === 'string'){
      str += obj;
    } else {
      str += '';
    }
        
    return str;
  }
  
  function getAttributes(selector, output){
    var attr = selector.match(REGEX.ATTRS) || [];

    if (attr.length){
      attr = attr.join(' ');
      attr = attr.replace(REGEX.BRACKETS, '');
      attr = attr.replace(REGEX.ATTRS_QUOTE, function(match){
        return '="' + match.substr(1) + '"';
      });

      output.push(attr);
    }

    return output;
  }

  function stripAttributes(selector){
    return selector.replace(REGEX.ATTRS, '');
  }

  function getTagName(selector){
    var tag = selector.match(REGEX.TAGS) || '';

    if (tag){
      tag = tag[0];
    }

    return tag;
  }

  function getID(selector, output){
    var id = selector.match(REGEX.ID);

    if (id){
      output.push( format(ATTRS.ID, id.pop()) );
    }

    return output;
  }

  function getClassNames(selector, output){
    var cls = selector.match(REGEX.CLASSNAMES);

    if (cls){
      cls = cls.join(' ');
      cls = cls.replace(REGEX.DOTS, '');
      output.push( format(ATTRS.CLASSNAME, cls) );
    }

    return output;
  }

  function isSingleTag(tag){
    return tag.match(REGEX.SELF_CLOSING_TAGS);
  }

  function parseAttr(selector){
    var output = [],
        isSingle,
        tag;

    output = getAttributes(selector, output);
    selector = stripAttributes(selector);
    tag = getTagName(selector);
    isSingle = isSingleTag(tag);
    output = getID(selector, output);
    output = getClassNames(selector, output);
    
    return {
      open: '<' + tag + (output.length ? ' ' + output.join(' ') : '') + (isSingle ? ' />' : '>'),
      close: isSingle ? '' : '</' + tag + '>'
    };
  }
  
  function parseJTML(json){
    return parse(json);
  }

  return parseJTML;
});