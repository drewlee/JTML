describe('JHTML parser', function(){
	it('should output single class name', function(){
		var tag = {'div.class1': 'Hello World!'};
		expect(JTMLparse(tag)).toEqual('<div class="class1">Hello World!</div>');
	});
	
	it('should output multiple class names', function(){
		var tag = {'div.class1.class2.class3': 'Hello World!'};
		expect(JTMLparse(tag)).toEqual('<div class="class1 class2 class3">Hello World!</div>');
	});
	
	it('should output id', function(){
		var tag = {'div#theId': 'Hello World!'};
		expect(JTMLparse(tag)).toEqual('<div id="theId">Hello World!</div>');
	});
	
	it('should ignore multiple ids', function(){
		var tag = {'div#theId1#theid2': 'Hello World!'};
		expect(JTMLparse(tag)).toEqual('<div id="theId1">Hello World!</div>');
	});
	
	it('should output single attribute', function(){
		var tag = {'a[href="http://www.google.com"]': 'Hello Google!'};
		expect(JTMLparse(tag)).toEqual('<a href="http://www.google.com">Hello Google!</a>');
	});
	
	it('should output multiple attributes', function(){
		var tag = {'a[href="http://www.google.com"][target="_blank"][title="Google"]': 'Hello Google!'};
		expect(JTMLparse(tag)).toEqual('<a href="http://www.google.com" target="_blank" title="Google">Hello Google!</a>');
	});
	
	it('should output the expected HTML', function(){
		var tag = {'a#myLink.class1.class2[href="http://www.google.com"]': "Hello World!"};
		expect(JTMLparse(tag)).toEqual('<a href="http://www.google.com" id="myLink" class="class1 class2">Hello World!</a>');
	});
	
	it('should output deeply nested structures', function(){
		var tag = {'div#id1': {'div#id2': {'div#id3': {'div#id4': {'div.message': 'Div Soup!'}}}}};
		expect(JTMLparse(tag)).toEqual('<div id="id1"><div id="id2"><div id="id3"><div id="id4"><div class="message">Div Soup!</div></div></div></div></div>');
	});
	
	it('should output single self closing tags correctly', function(){
		var tag = {'img[src="/image.jpg"][width="80"][height="80"]': ''};
		expect(JTMLparse(tag)).toEqual('<img src="/image.jpg" width="80" height="80" />');
	});
	
	it('should output multiple self closing tags correctly', function(){
		var tag = [{'hr': ''}, {'input[type="text"]': ''}, {'br': ''}, {'link[rel="stylesheet"][href="css/styles.css"]': ''}];
		expect(JTMLparse(tag)).toEqual('<hr /><input type="text" /><br /><link rel="stylesheet" href="css/styles.css" />');
	});
	
	it('should pass the ultimate test', function(){
		var tag = {
			'table#test_table.test-table[cellpadding="0"][cellspacing="0"][border="0"]': {
				'colgroup': [
					{'col[width="33%"]': ''}, {'col[width="33%"]': ''}, {'col[width="33%"]': ''}
				],
				'thead': {
					'tr': [{'th[scope="col"]': 'one'}, {'th[scope="col"]': 'two'}, {'th[scope="col"]': 'three'}]
				},
				'tfoot': {
					'tr': {'td[colspan="3"]': 'hello footer'}
				},
				'tbody': [
					{'tr': [{'td': 'one'}, {'td': 'two'}, {'td': 'three'}]},
					{'tr': [{'td': 'one'}, {'td': 'two'}, {'td': 'three'}]},
					{'tr': [{'td': 'one'}, {'td': 'two'}, {'td': 'three'}]}
				]
			}
		};
		
		expect(JTMLparse(tag)).toEqual(
			'<table cellpadding="0" cellspacing="0" border="0" id="test_table" class="test-table">' +
				'<colgroup>' +
					'<col width="33%" />' +
					'<col width="33%" />' +
					'<col width="33%" />' +
				'</colgroup>' +
				'<thead>' +
					'<tr>' +
						'<th scope="col">one</th>' +
						'<th scope="col">two</th>' +
						'<th scope="col">three</th>' +
					'</tr>' +
				'</thead>' +
				'<tfoot>' +
					'<tr>' +
						'<td colspan="3">hello footer</td>' +
					'</tr>' +
				'</tfoot>' +
				'<tbody>' +
					'<tr>' +
						'<td>one</td>' +
						'<td>two</td>' +
						'<td>three</td>' +
					'</tr>' +
 					'<tr>' +
						'<td>one</td>' +
						'<td>two</td>' +
						'<td>three</td>' +
					'</tr>' +
					'<tr>' +
						'<td>one</td>' +
						'<td>two</td>' +
						'<td>three</td>' +
					'</tr>' +
				'</tbody>' +
			  '</table>'
		);
	});
});
