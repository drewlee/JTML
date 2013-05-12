(function(namespace){
  'use strict';

  // quit if function name already exists
  if (namespace.JTMLparse){
    return;
  }

  // check if obj is true array
  function isArray(a){
    return ({}).toString.call(a) === '[object Array]';
  }
  
  // deep level object parsing
  function recurseObj(obj){
    var tag,
        str = '';
    
    // if array
    if (isArray(obj)){
      for (var i=0, lgth=obj.length; i<lgth; i++){
        str += recurseObj(obj[i]);
      }
      
    // if object
    } else if (typeof obj === 'object'){
      for (var prop in obj){
        tag = parseAttr(prop);
        
        str += tag.open;
        str += recurseObj(obj[prop]);
        str += tag.close;
      }
    
    // if string
    } else if (typeof obj === 'string'){
      str += obj;
      
    // else some invalid value
    } else {
      str += '';
    }
        
    return str;
  }
  
  // parse 
  function parseAttr(selector){
    var arr = [],
        single = /^(input|meta|col|br|hr|img|link)$/i,
        isSingle = false;
    
    // match attributes and remove them
    var aReg = /\[[^\]]+\]/g,
        attr = selector.match(aReg);

    if (attr){
      attr = attr.join(' ');
      attr = attr.replace(/\[|\]/g, '');
      arr.push(attr);
      selector = selector.replace(aReg, '');
    }
    
    // match tag name
    var tag = selector.match(/^[^#. ]+/);

    if (tag){
      tag = tag[0];
    }
    
    // match id
    var id = selector.match(/#([^.# ]+)/);

    if (id){
      arr.push('id="' + id.pop() + '"');
    }
    
    // match classes
    var cls = selector.match(/\.[^.# ]+/g);

    if (cls){
      cls = cls.join(' ');
      cls = cls.replace(/\./g, '');
      arr.push('class="' + cls + '"');
    }
    
    if (tag.match(single)){
      isSingle = true;
    }
    
    return {
      open: '<' + tag + (arr.length ? ' ' + arr.join(' ') : '') + (isSingle ? ' />' : '>'),
      close: isSingle ? '' : '</' + tag + '>'
    };
  }
  
  namespace.JTMLparse = function(json){
    return recurseObj(json);
  };
})(window);