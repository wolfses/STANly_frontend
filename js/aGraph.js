function truncate(_value)
{
	if (_value<0) return Math.ceil(_value);
	else return Math.floor(_value);
}

function makeGraph(info)
{
	/*
		{
			objectName = "#overview div.pollution-graph",
			width = 202,
			height = 72,
			color = "#de6264",
			background = "#ffffff",
			interval = 5,
			data = {
				{ name = "6/16", value = 17 },
				{ name = "6/18", value = 33 },
				{ name = "6/20", value = 13 },
				{ name = "6/22", value = 16 },
				{ name = "6/24", value = 30 },
			},
			setFont = function(object) {
				object.css("font", "700 'Helvetica' 10px");
				object.css("color", "#b1ad94");
			},
			setInfoLine = function(object, type, index, count) {
				object.css("background-color", "#a8a795");
			},
			setPoint = function(object, value, index, count) { },
			setBar = function(object, index, count) { },
			setArea = function(object) { },
		}
	*/
	$(info.objectName).html("<div></div>");

	var dv = $(info.objectName + " div");
	dv.addClass("agraph");
	dv.css("width", info.width + "px");
	dv.css("height", info.height + "px");
	if(info.background)
		dv.css("background-color", info.background);

	var min = info.data[0].value;
	var max = info.data[0].value;
	var sum = 0;
	for(var i in info.data)
	{
		if(min > info.data[i].value)
			min = info.data[i].value;
		if(max < info.data[i].value)
			max = info.data[i].value;
		sum += info.data[i].value;
	}

	info.interval = 10;
	var rmin = truncate(min / info.interval - 1) * info.interval;
	var rmax = truncate(max / info.interval + 1) * info.interval;
	var rdist = rmax - rmin;

	info.interval = truncate(truncate(rdist / 3) / 5 + 0.5) * 5;
	rmin = truncate(min / info.interval - 1) * info.interval;
	rmax = truncate(max / info.interval) * info.interval < max ? (truncate(max / info.interval) + 1) * info.interval : max;
	rdist = rmax - rmin;

	// colume bottom line
	var minusXCount = 0;
	for(var i = 0; i <= info.data.length; i ++)
	{
		dv.html(dv.html() + "<hr id=\"col-bottom" + i + "\"></hr>");
		var obj = $(info.objectName + " .agraph hr#col-bottom" + i);

		obj.css("width", "0px");
		obj.css("height", "6px");
		obj.css("border", "0px");
		obj.css("border-left", "1px solid");
		obj.css("top", (info.height - 13) + "px");
		obj.css("left", ( (info.width - 35) * i / (info.data.length) + 28 - minusXCount) + "px");
		obj.addClass("col-bottom");

		info.setInfoLine(obj, "xAxis", i, info.data.length - 1);

		minusXCount += 1;
	}

	// colume labels
	minusXCount = 0;
	var minusYCount = 0;
	for(var i = 0; i < info.data.length; i ++)
	{
		dv.html(dv.html() + "<div id=\"col-labels" + i + "\"></div>");
		var obj = $(info.objectName + " .agraph div#col-labels" + i);

		obj.css("width", "32px");
		obj.css("height", "20px");
		obj.css("top", (info.height - 11) + "px");
		obj.css("left", ( (info.width - 70) * i / (info.data.length - 1) + 23 - minusXCount) + "px");
		obj.css("float", "left");
		obj.addClass("col-labels");

		obj.html(info.data[i].name);

		obj.css("text-align", "center");

		info.setFont(obj);

		minusXCount += 32;
		minusYCount = obj.height();
	}

	// row line
	var index = 0;
	for(var i = rmin; i <= rmax; i += info.interval)
	{
		dv.html(dv.html() + "<hr id=\"row" + i + "\"></hr>");
		var obj = $(info.objectName + " .agraph hr#row" + i);

		if(i == rmin)
		{
			obj.css("width", (info.width - 24) + "px");
			obj.css("left", "24px");
		}
		else
		{
			obj.css("width", (info.width - 30) + "px");
			obj.css("left", "27px");
		}
		obj.css("height", "0px");
		obj.css("border", "0px");
		obj.css("border-bottom", "1px solid");
		obj.css("top", ( (info.height - 19) * (1.0 - ( (i - rmin) / rdist) ) + 6 - minusYCount) + "px");
		obj.addClass("row-line");

		info.setInfoLine(obj, "y", index, rdist / info.interval);

		minusYCount += 1;
		index ++;
	}

	// row labels
	index = 0;
	for(var i = rmin; i <= rmax; i += info.interval)
	{
		dv.html(dv.html() + "<div id=\"row-label" + i + "\"></div>");
		var obj = $(info.objectName + " .agraph div#row-label" + i);

		obj.css("width", "27px");
		obj.css("top", ( (info.height - 19) * (1.0 - ( (i - rmin) / rdist) ) - minusYCount) + "px");
		obj.css("left", "0px");
		obj.addClass("row-labels");

		obj.html(i + info.formatter);

		info.setFont(obj);

		minusYCount += obj.height();
		index ++;
	}

	// colume line
	var minusXCount = 0;
	var minusCount = 0;
	var polygons = "";
	for(var i = 0; i < info.data.length; i ++)
	{
		info.data[i].fper = (info.data[i].value - rmin) / rdist;

		dv.html(dv.html() + "<hr id=\"col" + i + "\"></hr>");
		var obj = $(info.objectName + " .agraph hr#col" + i);

		var h = (info.height - 13) * info.data[i].fper;
//,45px 67px,36px 100px,19px 134px
		obj.css("width", "0px");
		obj.css("height", h + "px");
		obj.css("border", "0px");
		obj.css("border-left", "1px solid");
		obj.css("top", (info.height - 13) - h - minusYCount + "px");
		obj.css("left", ( (info.width - 70) * i / (info.data.length - 1) + 46 - minusXCount) + "px");
		obj.addClass("col-line");

		polygons += (info.height - 13) - h + "px " + (info.width - 68) * i / (info.data.length - 1) + "px";
		if(i != info.data.length - 1)
			polygons += ",";

		info.setInfoLine(obj, "x", i, info.data.length - 1);

		minusCount += h;
		minusXCount += 1;
	}

	/*
	alert(polygons);
	dv.html(dv.html() + "<div id=\"bgslider\"></div>");
	var obj = $(info.objectName + " .agraph div#bgslider");
	obj.css("top", -minusYCount + 2 + "px");
	obj.css("left", "46px");
	obj.css("width", info.width - 68 + "px");
	obj.css("height", info.height - 13 + "px");
	obj.attr("data", "polygon(" + polygons + ")");
	minusYCount += info.height - 13;
	*/

	// data point
	minusXCount = 0;
	for(var i = 0; i < info.data.length; i ++)
	{
		dv.html(dv.html() + "<div id=\"point" + i + "\"></div>");
		var obj = $(info.objectName + " .agraph div#point" + i);
		
		obj.css("width", "3px");
		obj.css("height", "3px");
		obj.css("background-color", info.color);
		obj.addClass("point");

		info.setPoint(obj, info.data[i].value, i, info.data.length - 1);

		obj.css("top", ( (info.height - 19) * (1.0 - info.data[i].fper) + 5 - minusYCount - parseInt(obj.css("height")) / 2.0) + "px");
		obj.css("left", ( (info.width - 70) * i / (info.data.length - 1) + 46 - parseInt(obj.css("width")) / 2.0) + "px");
		minusYCount += parseInt(obj.css("height"));
	}

	// link bar
	minusXCount = 0;
	for(var i = 1; i < info.data.length; i ++)
	{
		dv.html(dv.html() + "<div id=\"bar" + i + "\"></div>");
		var obj = $(info.objectName + " .agraph div#bar" + i);
		
		var w = $(info.objectName + " .agraph div#point" + i).position().left + ($(info.objectName + " .agraph div#point" + i).width() / 2) - $(info.objectName + " .agraph div#point" + (i - 1) ).position().left - ($(info.objectName + " .agraph div#point" + (i - 1) ).width() / 2);
		var h = $(info.objectName + " .agraph div#point" + i).position().top + ($(info.objectName + " .agraph div#point" + i).height() / 2) - $(info.objectName + " .agraph div#point" + (i - 1) ).position().top - ($(info.objectName + " .agraph div#point" + (i - 1) ).height() / 2);
		var r = Math.sqrt(w*w+h*h) - 5;
		var deg = Math.atan2(h, w) * 180 / 3.14 + 90;

		obj.css("width", "2px");
		obj.css("height", r + "px");
		obj.css("background-color", info.color);
		obj.addClass("bar");

		info.setBar(obj, i - 1, info.data.length - 1);

		obj.css("top", ( (info.height - 19) * (1.0 - info.data[(i-1)].fper) + 5 + truncate(h / 2.0+0.5) - minusYCount - parseInt(obj.css("height")) / 2.0) + "px");
		obj.css("left", ( (info.width - 70) * (i - 1) / (info.data.length - 1) + truncate(w / 2.0+0.5) + 46 - parseInt(obj.css("width")) / 2.0) + "px");
		obj.css("transform", "rotate("+deg+"deg)");
		obj.css("-moz-transform", "rotate("+deg+"deg)");
		obj.css("-webkit-transform", "rotate("+deg+"deg)");
		obj.css("-ms-transform", "rotate("+deg+"deg)");
		obj.css("-o-transform", "rotate("+deg+"deg)");
		minusYCount += parseInt(obj.css("height")) + 1;
	}
}

function makeAGraph(dataValue)
{
	makeGraph({
		objectName: "#overview .pollution-graph",
		width: 202,
		height: 72,
		color: "#f7f6f2",
		formatter: "%",
		interval: 15,
		data: dataValue,
		setFont: function(object) {
			object.css("font", "700 10px \"Helvetica\"");
			object.css("letter-spacing", "-1px");
			object.css("color", "#9e9c8a");
		},
		setInfoLine: function(object, type, index, count) {
			if(type == "y" && index == 0)
			{
				object.css("border-color", "#a8a795");
			}
			else if (type == "xAxis")
			{
				object.css("border-color", "#c4c5bf");
			}
			else
			{
				object.css("border-color", "#d7d7d5");
				object.css("border-style", "dotted");
			}
		},
		setPoint: function(object, value, index, count) {
			object.css("border-radius", "50%");

			if(index == count)
			{
				object.css("width", "15px");
				object.css("height", "15px");
				object.css("box-shadow", "inset 0px 0px 0px 5px #de6264");
				object.css("-moz-box-shadow", "inset 0px 0px 0px 5px #de6264");
				object.css("-webkit-box-shadow", "inset 0px 0px 0px 5px #de6264");
				object.css("-o-box-shadow", "inset 0px 0px 0px 5px #de6264");

				object.html("<div name=\"box\"><div name=\"left\"><hr></hr></div><div name=\"right\"><div name=\"top\"></div><div name=\"bottom\"></div></div></div>");
				var fbox = object.find("div[name=box]");
				fbox.css("position", "relative");
				fbox.css("left", "13px");
				fbox.css("width", "150px")
				fbox.css("height", "46px");
				var fleft = fbox.find("div[name=left]");
				fleft.css("width", "37px");
				fleft.css("height", "1px");
				fleft.css("float", "left");
				var fhr = fleft.find("hr");
				fhr.css("position", "relative");
				fhr.css("top", "7px");
				fhr.css("width", "35px");
				fhr.css("height", "0px");
				fhr.css("border", "0px");
				fhr.css("border-bottom", "1px solid #df645f");
				var fright = fbox.find("div[name=right]");
				fright.css("width", "111px");
				fright.css("height", "46px");
				fright.css("float", "right");
				var ftop = fright.find("div[name=top]");
				ftop.css("font", "800 14px \"Helvetica\"");
				ftop.css("color", "#df645f");
				ftop.html("<b>Total Pollution</b>");
				var fbot = fright.find("div[name=bottom]");
				fbot.css("position", "relative");
				fbot.css("top", "-7px");
				fbot.css("font", "800 36px \"Helvetica\"");
				fbot.css("color", "#df645f");
				fbot.html(value + "<span>%</span>");
				var fspan = fbot.find("span");
				fspan.css("font", "800 18px \"Helvetica\"");
			}
			else
			{
				object.css("width", "11px");
				object.css("height", "11px");
				object.css("box-shadow", "inset 0px 0px 0px 3px #de6264");
				object.css("-moz-box-shadow", "inset 0px 0px 0px 3px #de6264");
				object.css("-webkit-box-shadow", "inset 0px 0px 0px 3px #de6264");
				object.css("-o-box-shadow", "inset 0px 0px 0px 3px #de6264");
			}
		},
		setBar: function(object, index, count) {
			object.css("height", parseInt(object.css("height")) - 12 + "px");
			object.css("background-color", "#df645f");
		},
		setArea: function(object) { },
	});
}