//	function dropshipHelper() {
//		chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
//			if (request.gotInfo === true) {
//				pickedUsr = request.gotEmail;
//				start();
//			}
//		});
//
//		function start(){
//			fillText = (selector, value) => {
//				document.querySelector(selector).select();
//				document.execCommand('insertText', false, value);
//			}
//			try {
//				fillText('.SignIn-container input[type=email]', pickedUsr);
//				fillText('.SignIn-container input[type=password]', 'forte1');
//			}
//			catch(err) {
//				fillText('input[name=email]', pickedUsr);
//				fillText('input[name=password]', 'forte1');
//			}
//		}
//	}



chrome.runtime.onMessageExternal.addListener(
	function(message, sender, sendResponse, request) {
		if(sender.id !== 'ddjkkpepoiecfnljcjccknpkjlfdlfnm') return;
		if(message.gotEmail) {
			pickedUsr = request.gotEmail;
			start();
		};
	}
);

function start() {
	fillText = (selector, value) => {
		document.querySelector(selector).select();
		document.execCommand('insertText', false, value);
	}
	try {
		fillText('.SignIn-container input[type=email]', pickedUsr);
		fillText('.SignIn-container input[type=password]', 'forte1');
	}
	catch(err) {
		fillText('input[name=email]', pickedUsr);
		fillText('input[name=password]', 'forte1');
	}
}
