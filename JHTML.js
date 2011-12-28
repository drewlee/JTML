(function(w){
	// quit if function name already exists
	if(typeof JHTMLparse !== 'undefined'){return;}
	
	
	// PRIVATE
	// check if obj is true array
	function isArray(a){
		return Object.prototype.toString.call(a) === '[object Array]';
	}
	
	// deep level object parsing
	function recurseObj(obj){
		var tag, str = '';
		
		// if array
		if(isArray(obj)){
			for(var i=0, lgth=obj.length; i<lgth; i++){
				str += recurseObj(obj[i]);
			}
			
		// if object
		}else if(typeof obj == 'object'){
			for(var prop in obj){
				tag = parseAttr(prop);
				
				str += tag.open;
				str += recurseObj(obj[prop]);
				str += tag.close;
			}
		
		// if string
		}else if(typeof obj == 'string'){
			str += obj + '\n';
			
		// else some invalid value
		}else{
			str += '\n';
		}
        
        return str;
	}
	
	// parse 
	function parseAttr(selector){
		var single   = /input|meta|col|br|hr/,
			isSingle = false,
			arr  = [],
			tag  = selector.match(/^[^#.[\]]+/),
			id   = selector.match(/#([^.\[]+)/),
			cls  = selector.match(/\.([^#.\[])+/g),
			attr = selector.match(/(\[.[^\]]+\])/g);
		
		if(tag){tag = tag[0];}
		if(id){arr.push('id="' + id.pop() + '"');}
		if(cls){
			cls = cls.join(' ');
			cls = cls.replace(/\./g, '');
			arr.push('class="' + cls + '"');
		}
		if(attr){
			attr = attr.join(' ');
			attr = attr.replace(/\[|\]/g, '');
			arr.push(attr);
		}
		
		if(tag.match(single)){
			isSingle = true;
		}
		
        return {
            open: '<' + tag + (arr.length ? ' ' + arr.join(' ') : '') + (isSingle ? ' />' : '>') + '\n',
            close: isSingle ? '' : '</' + tag + '>\n'
        };
	}
	
	
	// PUBLIC
	w.JHTMLparse = function(json){
		return recurseObj(json);
	};
})(window);