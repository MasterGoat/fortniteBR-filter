var resultBinary = '000000';
	var resultDec = 0;
	var referrer;
	var subdomain;
        var subname;
	var mask;
	var newMask;
	var request;
	var requestCat;
	var requestFunc;

// Thanks Tom Yandell
function pad (str, max) {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
}

function calcMask() {
	referrer = $('#ref').val();
	console.log("Referrer: " + referrer);

	subdomain = referrer.split('.')[0].replace('http://', '').replace('https://', '');
	console.log("Subdomain: " + subdomain);
	
	subname = $('#ref').val().split('/r/').replace('http://www.reddit.com/r/', '').replace('https://www.reddit.com/r/', '');
	console.log("Subname: " + subname);

	mask = subdomain.split('-')[1];
	console.log("Mask: " + mask);

	filterStatus = subdomain.split('-')[0];
	console.log("Filter Status: " + filterStatus);

	request = $('#request').val().split('#')[1];
	console.log("Request: " + request);

	if (request == 'filterToggle') {
		console.log('Filter Toggle requested. Aborting further calculations.');
		return;
	}

	requestCat = request.split('=')[1];
	console.log("Request Cat: " + requestCat);

	requestFunc = request.split('=')[0];
	console.log("Request Function: " + requestFunc);

	switch (requestCat) {
		case "a":
		request = 32;
		break;
		case "b":
		request = 16;
		break;
		case "c":
		request = 08;
		break;
		case "d":
		request = 04;
		break;
		case "e":
		request = 02;
		break;
		case "f":
		request = 01;
		break;
	}

	console.log('Request Amount: ' + request);

	if (isNaN(mask)) {
		mask = 63; // All True
		console.log('Mask is NOT a number. Setting to: ' + mask);
	} else {
		console.log('Mask is a number: ' + mask);
	}
	switch (requestFunc) {
		case "h":
		newMask = +mask - request;
		console.log('New Mask IS: ' + mask + ' - ' + request + ' = ' + newMask);
		break;
		case "s":
		newMask = +mask + request;
		console.log('New Mask IS: ' + mask + ' + ' + request + ' = ' + newMask);
		break;
	};

	newMask = pad(newMask, 2);
};

$(document).ready(function() { 
	$('input[type="checkbox"]').change(function() {
		resultBinary = '';
		$('input[type="checkbox"]').each(function() {
			if (this.checked) {
				resultBinary = resultBinary + '1';
			} else {
				resultBinary = resultBinary + '0';
			}
		})
		$('#binary').val(resultBinary);
		resultDec = parseInt(resultBinary, 2);
		if (resultDec == 63) {
			$('#mask').val('');
		} else {
			$('#mask').val(resultDec + ".");
		}
	});

	// Grab the Referrer
	$('#ref').val(document.referrer);

	//Grab the Request
	$('#request').val(location.hash);

	calcMask();

	if (request == 'filterToggle') {
		console.log('calculating filter toggle');
		if (isNaN(mask)) {
			console.log('no mask detected, toggling filter via default subreddit');
			if (filterStatus == 'fn') {
				console.log('Current Filter status read as filtered');
				window.location.replace('https://www.reddit.com/r/'+subname+'');
			}
			else {
				console.log('Current Filter status read as UNfiltered');
				window.location.replace('https://www.reddit.com/r/'+subname+'');
			}
		}
		else if (filterStatus == 'fn') {
			console.log('Current Filter status read as filtered');
			window.location.replace('https://fn-'+mask+'.reddit.com/r/'+subname+'');
		}
		else {
			console.log('Current Filter status read as UNfiltered');
			window.location.replace('https://fn-'+mask+'.reddit.com/r/'+subname+'');
		}
	}
	else {
		if (subdomain.split('-')[0] == 'fn') {
			if (newMask == '00' || newMask == 0 || newMask == 63) {
				window.location.replace('https://www.reddit.com/r/'+subname+'');
			}
			else { 	window.location.replace('https://fn-'+newMask+'.reddit.com/r/'+subname+''); }
		}
		else if (newMask == '00' || newMask == 0 || newMask == 63) {
			window.location.replace('https://www.reddit.com/r/'+subname+'');
		}
		else { 	window.location.replace('https://fn-'+newMask+'.reddit.com/r/'+subname+''); }
	}
});
