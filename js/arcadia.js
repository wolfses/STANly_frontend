function supportsSVG() {
	return !!document.createElementNS && !!document.createElementNS('http://www.w3.org/2000/svg', "svg").createSVGRect && !!(window.SVGSVGElement);
}

function resizeEvent(obj)
{
	$("#content").css("min-height", "0px");
	$("#content").css("width", $(window).width() - 143);
	if($("#content").height() > $(window).height() - 74)
	{
		$("#sidebar-container").css("min-height", $("#content").height() );
	}
	else
	{
		$("#content").css("min-height", $(window).height() - 74);
		$("#sidebar-container").css("min-height", $(window).height() - 74);
	}
}

window.onload = resizeEvent;
$(document).ready(function() {
	resizeEvent();

	$("#user-container").hover(function(){$(this).addClass("up")}, function(){$(this).removeClass("up")});
	
	$("#container").addClass("container-js");
	if(supportsSVG()) $("#container").addClass("svg");
	if(navigator.userAgent.match(/applewebkit/i))
	{
		if(!navigator.geolocation)
		{
			$("#container").addClass("decelerate");
		}
		else
		{
			if (navigator.platform.match(/ipad/i) ||
				navigator.platform.match(/iphone/i) ||
				navigator.platform.match(/ipod/i) ) $("#container").addClass("ios");
		}
		if (navigator.userAgent.match(/chrome/i) &&
			navigator.userAgent.match(/windows/i) ) $("#container").addClass("noinset");
	}
	window.onresize = resizeEvent;
});