var GameReg = {
	
	basePath: "https://gamereg.nexon.com/",
	
	api: function(apiPath, apiParam, onSuccess, onError)
	{
		$.ajax({
			type: 'POST',
			url: this.basePath + apiPath,
			dataType: "json",
			data: apiParam,
			success: onSuccess,
			error: onError
		});
	},
	
	//registerPhoneAddress: function(_eventName, _phoneNumber, _address, _extraOption, onSuccess, onError)
	//{
	//	var apiParam = {
	//		eventName: _eventName,
	//		phoneNumber: _phoneNumber,
	//		address: _address,
	//		extraOption: _extraOption,
	//		channel: this.parseChannel(),
	//	}
	//	this.api("/RegisterPhoneAddress", apiParam, onSuccess, onError);
	//},
	
	registerPhoneAddress: function (_eventName, _phoneNumber, _address, _extraOption, onSuccess, onError, _msmsPromotionId)
	{
	    var apiParam = {
	        eventName: _eventName,
	        phoneNumber: _phoneNumber,
	        address: _address,
	        extraOption: _extraOption,
	        msmsPromotionId: typeof _msmsPromotionId !== 'undefined' ? _msmsPromotionId : '',
	        channel: this.parseChannel(),
	    }
	    this.api("/RegisterPhoneAddress", apiParam, onSuccess, onError);
	},

	getParamMap: function() {
		var urlParams = {};
		{
			var queryString = window.location.search.substring(1);
			var regex = /([^&=]+)=?([^&]*)/g;
			var match;
			while (match = regex.exec(queryString))
			{
				var paramName = decodeURIComponent(match[1].replace(/\+/g, " ")); 
				var paramValue = decodeURIComponent(match[2].replace(/\+/g, " ")); 
				urlParams[paramName] = paramValue;
			}
		}
		return urlParams;
	},
	
	parseChannel: function() {
		var urlParams = this.getParamMap();
		var channelString = urlParams["channel"] || "";
		if (/^\d+$/.test(channelString) == false)
			return 1;
		return parseInt(channelString);
	},

	registerTotalCount: function (_eventName, onSuccess, onError)
	{
	    var apiParam = {
	        eventName: _eventName
	    }
	    this.api("/RegisterTotalCount", apiParam, onSuccess, onError);
	},
};


