//Created by Davi de Sousa Arimateia, daviarimateia93@gmail.com

var Utils = {
		
	map: function ()
	{
		this.__map = {};
		
		this.add = function(key, value)
		{
			this.__map[key] = value;
			
			return this;
		};
		
		this.remove = function(key)
		{
			delete this.__map[key];
			
			return this;
		}
		
		this.removeAll = function()
		{
			this.__map = {};
			
			return this;
		};
		
		this.get = function(key)
		{
			return this.__map[key];
		};
		
		this.getAll = function()
		{
			return this.__map;
		};
		
		this.getAllKeys = function()
		{
			var indexes = [];
			
			for(index in this.__map)
			{
				indexes.push(index);	
			}
			
			return indexes;
		};
		
		this.each = function(callback)
		{
			if(typeof callback === 'function')
			{
				for(index in this.__map)
				{
					if(callback(index, this.__map[index]) === false)
					{
						break;	
					}
				}
			}
		};
		
		this.size = function()
		{
			return this.getAllKeys().length;
		};
	},

	history: {

		back: function()
		{
			window.history.back(-1);
		}
	},
	
	hashUrl: {

		removeVariable: function(name)
		{
			if(this.getVariable(name) !== null)
			{
				var hash = window.location.hash.substring(1, window.location.hash.length);
			
				var hashFragments = hash.split('&');
			
				var newHash = '';

				for(var i = 0; i < hashFragments.length; i++)
				{
					if(hashFragments[i].indexOf('=') > -1)
					{
						var variableFragments = hashFragments[i].split('=');
						var variableName = variableFragments[0];
						var variableValue = variableFragments[1];
	
						if(variableName !== name)
						{
							newHash += variableName + '=' + variableValue;
							newHash += ((i < hashFragments.length - 1 && hashFragments[i + 1].split('=')[0] !== name)? '&' : '');
						}
					}
				}

				window.location = '#' + newHash;
			}
		},

		removeAllVariables: function(name)
		{
			var variables = this.getVariables();

			if(variables !== null)
			{
				for(var i = 0, len = variables.length; i < len; i++)
				{
					if(variables[i].name !== name)
					{
						this.removeVariable(variables[i].name);
					}
				}
			}
		},
		
		setVariable: function(name, value)
		{
			var hash = window.location.hash.substring(1, window.location.hash.length);
			
			var hashFragments = hash.split('&');
			
			var newHash = '';
			
			if(this.getVariable(name) !== null)
			{
				for(var i = 0; i < hashFragments.length; i++)
				{
					if(hashFragments[i].indexOf('=') > -1)
					{
						var variableFragments = hashFragments[i].split('=');
						var variableName = variableFragments[0];
						var variableValue = ((variableName === name)? value: variableFragments[1]);
	
						newHash += variableName + '=' + variableValue;
						newHash += ((i < hashFragments.length - 1)? '&' : '');
					}
				}
			}
			else
			{
				newHash += hash;
				newHash += ((this.getVariables().length > 0)? '&' + name + '=' + value : name + '=' + value);
			}
			
			window.location = '#' + newHash;
		},
				
		getVariable: function(name)
		{   
			var hash = window.location.hash.substring(1, window.location.hash.length);
			
			var hashFragments = hash.split('&');
			
			for(var i = 0; i < hashFragments.length; i++)
			{
				if(hashFragments[i].indexOf('=') > -1)
				{
					var variableFragments = hashFragments[i].split('=');
					var variableName = variableFragments[0];
					var variableValue = variableFragments[1];
					
					if(variableName === name)
					{
						return variableValue;
					}
				}
			}
			
			return null;
		},
				
		getVariables: function(name)
		{
			var undefined;
			
			var variables = [];
			
			var hash = window.location.hash.substring(1, window.location.hash.length);
			
			var hashFragments = hash.split('&');
			
			for(var i = 0; i < hashFragments.length; i++)
			{
				if(hashFragments[i].indexOf('=') > -1)
				{
					var variableFragments = hashFragments[i].split('=');
					var variableName = variableFragments[0];
					var variableValue = variableFragments[1];
					
					var push = false;
					
					if(name !== undefined)
					{
						if(name === variableName)
						{
							push = true;
						}
					}
					else
					{
						push = true;
					}
					
					if(push)
					{
						variables.push({name: variableName, value: variableValue});
					}
				}
			}
			
			return variables;
		}	
	},

	inherit: function(defaults, options, copy)
	{
		var newObject;

		if(copy === true)
		{
			newObject = {};

			for(var index in defaults)
			{
				newObject[index] = defaults[index];
			}
		}
		else
		{
			newObject = defaults;
		}

		for(var index in options)
		{
			newObject[index] = options[index];
		}

		return newObject;
	},

	textSelection: {

		disable: function($el)
		{
			$el
				.css({ 'MozUserSelect': 'none', 'webkitUserSelect': 'none' })
				.attr('unselectable','on')
				.bind('selectstart.utils', function()
				{
					return false;
				});
		},

		enable: function($el)
		{
			$el
				.css({ 'MozUserSelect': '', 'webkitUserSelect': '' })
				.attr('unselectable','off')
				.unbind('selectstart.utils');
		}
	},

	fillLeftZero: function(numberDesiredLength, number)
	{
		number = '' + number;

		if(number.length < numberDesiredLength)
		{
			for(var i = number.length; i < numberDesiredLength; i++)
			{
				number = '0' + number;
			}
		}

		return number;
	},
	
	loadRemote: function(url)
	{
		var source = null;
        
        $.ajax(
        {
            url: url,
            async: false,
            success: function(data)
            {
                source = data;
            }
        });
		
		return source;
	},
	
	string: {
	
		replaceAll: function(find, replace, string)
		{
			return string.replace(new RegExp(find.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'g'), replace);
		}
	},
	
	getNodeTexts: function(node, trim)
	{
		var undefined;
		
		var texts = null;
		
		if(node instanceof jQuery)
		{
			node = node[0];
		}
		
		var childs = node.childNodes, i = 0;
		
		if(node.childNodes !== undefined)
		{
			while(node = childs[i])
			{
				if(node.nodeType == 3)
				{
					if(texts === null)
					{
						texts = [];
					}
					
					var text = node.textContent? node.textContent : node.nodeValue;
					
					if(trim)
					{
						text = $.trim(text);
						text = text.replace(/[\r\n]/g, '');
					}
					
					texts.push(text);
				}
				
				i++;
			}
		}
		
		return texts;
	},
	
	replaceText: function(oldText, newText, node)
	{
		var undefined;
		
		node = node || document.body;
		
		if(node instanceof jQuery)
		{
			var self = this;
			
			node.each(function()
			{
				self.replaceText(oldText, newText, this);
			});
		}
		
		var childs = node.childNodes, i = 0;
		
		if(node.childNodes !== undefined)
		{
			while(node = childs[i])
			{ 
				if(node.nodeType == 3)
				{
					if(node.textContent)
					{
						node.textContent = this.string.replaceAll(oldText, newText, node.textContent);
					}
					else
					{
						node.nodeValue = this.string.replaceAll(oldText, newText, node.nodeValue);
					}
				}
				else
				{ 
					this.replaceText(oldText, newText, node); 
				} 
				
				i++; 
			}
		}
	}
};