(function(){
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
		var arr = [selector], tag, attr,
			// self closing tags
			single = /input|meta|col|br|hr/,
			isSingle = false;
        
        // determine attributes
        attr = selector.match(/(\[.[^\]]+\])/g) || [];
        if(attr.length){
			arr[0] = selector.replace(attr.join(''), '');
		}
        
        // determine classes
        if(selector.indexOf('.') > 0){
            arr = arr[0].split('.');
            attr.push('class="' + arr.slice(1).join(' ') + '"');
        }
    
        // determine id
        if(arr[0].indexOf('#') > 0){
            arr = arr[0].split('#');
            attr.push('id="' + arr[1] + '"');
        }
        
		// store html tag
        tag = arr[0];
		
		// is this a self closing tag?
		if(tag.match(single)){
			isSingle = true;
		}
    
        return {
            open: '<' + tag + (attr.length ? ' ' + attr.join(' ').replace(/\[|\]/g, '') : '') + (isSingle ? ' />' : '>') + '\n',
            close: isSingle ? '' : '</' + tag + '>\n'
        };
	}
	
	
	// PUBLIC
	this.JHTMLparse = function(json){
		return recurseObj(json);
	};
})();