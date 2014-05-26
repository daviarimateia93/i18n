//Created by Davi de Sousa Arimateia, daviarimateia93@gmail.com

var i18n = {

	__language: null,
	__data: null,
	__preferences: null,
	__baseDir: 'path/to/baseDir/',
	
	getLanguage: function()
	{
		return this.__language;
	},
	
	setLanguage: function(language)
	{
		this.init({ language: language });
	},

	init: function(arg)
	{
		var self = this;

		var options = {

			baseDir: self.__baseDir,
			language: 'en',
			defaultLanguage: 'en',
			auto: false
		};

		options = Utils.inherit(options, arg);
		
		this.__baseDir = options.baseDir;

		if(options.baseDir.charAt(options.baseDir.length - 1) !== '/')
		{
			options.baseDir += '/';
		}

		if(options.auto === true)
		{
			options.language = navigator.language || navigator.userLanguage;
		}

		var fileName = this.__getFileName(options.language);
		var defaultFileName = this.__getFileName(options.defaultLanguage);

		var data = this.__load(options.baseDir + fileName);
		
		this.__language = options.language;

		if(data === null && fileName !== defaultFileName)
		{
			data = this.__load(options.baseDir + defaultFileName);
			
			this.__language = options.defaultLanguage;
		}

		this.__data = data;
		this.__preferences = this.__load(options.baseDir + 'preferences.i18n');
	},

	__getFileName: function(language)
	{
		return 'resource.' + language + '.i18n';
	},

	__load: function(file)
	{
		var content = null;

		$.ajax(
		{
			async: false,
			url: file,
			dataType: 'JSON',
			success: function(data)
			{
				content = data;
			}
		});

		return content;
	},

	get: function(key)
	{
		var undefined;

		if(this.__data !== null && key !== null && key !== undefined)
		{
			var text = eval('this.__data.' + key);
			
			if(text !== undefined)
			{
				return this.__preferencesReplace(text);
			}
			else
			{
				return null;
			}
		}

		return null;
	},
	
	__preferencesReplace: function(data)
	{
		var undefined;
		
		if(this.__preferences !== null)
		{
			var replacements = [];
			
			for(var i = 0, iLen = this.__preferences.length; i < iLen; i++)
			{
				var preference = this.__preferences[i][this.__language];
				
				if(preference !== undefined)
				{
					var target = null;
					
					for(var index in this.__preferences[i])
					{
						if(data.indexOf(this.__preferences[i][index]) > -1 && index !== this.__language)
						{
							replacements.push({ replacement: this.__preferences[i][index], preference: preference });
						}
					}
				}
			}
			
			if(replacements.length > 0)
			{
				var chosen = replacements[0];
				
				for(var j = 1, jLen = replacements.length; j < jLen; j++)
				{
					if(replacements[j].replacement.length > chosen.replacement.length)
					{
						chosen = replacements[j];
				
						break;
					}
				}
				
				data = Utils.string.replaceAll(chosen.replacement, chosen.preference, data);
			}
		}
		
		return data;
	},

	applyOnDocument: function()
	{
		var undefined;
		
		var self = this;

		$('.i18n').each(function()
		{
			var text = self.get($(this).attr('i18n-key'));
			var render = $(this).attr('i18n-render');

			if(text !== null)
			{
				if(render !== undefined)
				{
					$(this).attr(render, text);
				}
				else
				{
					$(this).html(text);
				}
			}
		});
		
		$('*').each(function()
		{
			if(!$(this).hasClass('i18n-preferences-disabled') && $(this).parents('.i18n-preferences-disabled').length === 0)
			{
				var nodeTexts = Utils.getNodeTexts($(this));
				
				if(nodeTexts !== null)
				{
					for(var i = 0, len = nodeTexts.length; i < len; i++)
					{
						Utils.replaceText(nodeTexts[i], self.__preferencesReplace(nodeTexts[i]), this);
					}
				}
			}
		});
	}
};