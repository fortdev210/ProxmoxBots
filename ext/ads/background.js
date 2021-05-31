// Background code. Simply used as a translator to inject JS file into active tab. Coded and created by Jordan Siegler @ STL PRO, Inc 2017.

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.executeScript(tab.id, {
		file: 'stores.js'
	});
});

chrome.tabs.executeScript(null, {file: 'steps.js'}, function() {
});

chrome.runtime.onInstalled.addListener(function(details) {
  if(details.reason == "install" || details.reason == "update") {
      localStorage.fillTax = 'enabled';
  }
});

////////////////////////////////////////////////////////
//					  Message Area			         //
//////////////////////////////////////////////////////
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.newOrderStarted !== true && request.isGetOrders == true) {
		console.log('AutoDS: !ERROR! This does not appear to be a new order.');
	} else {
		if (request.getCustomerInfo == true) {
			console.log('AutoDS: Obtaining customer info and email for order');
			// URL for Dropship Helper
			var url = "http://admin.stlpro.com/products/getdsforchrome/";
			var req = new XMLHttpRequest();
			
			req.open("GET", url, true);
			//set host to dom element
			req.onload = function (e) {
				void(0);
			};
			req.send(null);
			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					var response = req.responseText;
					if (req.status === 200) {
						if (typeof customerInfo !== "undefined") {
							delete customerInfo;
							if (typeof customerInfo == "undefined") {
								console.log('Successfully purged customer info.');
							} else {
								alert('AutoDS could not purge previous customer info!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
							}
						}
						if (typeof emailForOrder !== "undefined") {
							delete emailForOrder;
							if (typeof emailForOrder == "undefined") {
								console.log('Successfully purged email info.');
							} else {
								alert('AutoDS could not purge previous email info!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
							}
						}
						if (typeof orderItemID !== "undefined") {
							delete orderItemID;
							if (typeof orderItemID == "undefined") {
								console.log('Successfully purged Order Item ID');
							} else {
								alert('AutoDS could not purge previous order ID info!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
							}
						}
						if (typeof noteData !== "undefined") {
							delete noteData;
							if (typeof noteData == "undefined") {
								console.log('Sucessfully purged previous order\'s Note Data for WebFactional');
							} else {
								alert('AutoDS could not purge previous order Note Data!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
							}
						}
						// Parse Helper HTML
						parser = new DOMParser();
						popupHtml = parser.parseFromString(req.responseText,"text/html");
						// Grab the email from the Helper...
						emailForOrder = popupHtml.querySelector('[id="picked_email"]').innerHTML;
						// ...and append it to the customer information.
						customerInfo = popupHtml.querySelector('[id*="for_button"]').innerText + '|' + emailForOrder;
						orderItemID = popupHtml.querySelector('[id*="for_button"]').id.replace(/[^0-9]/g,'');
						sendResponse({
							obtainedInfo: true,
						});
					} else {
						console.log('Dropship Helper failed to load.');
					}
				}
			};
		}
	}
	
	if (request.harborData == true) {
		numOfItems = request.numOfItems;
		qtyToBuy = request.qtyToBuy;
		priceOnWF = request.priceOnWF;
		primaryItem = request.primaryItem;
		hasExtraItem = request.hasExtraItem;
		if (hasExtraItem == true) {
			extraItem = request.extraItem;
		}
	}
	
	if (request.determineItem == true) {
		if (hasExtraItem == true) {
			sendResponse({
				numOfItems: numOfItems,
				primaryItem: primaryItem,
				extraItem: extraItem,
			});
		} else {
			sendResponse({
				numOfItems: numOfItems,
				primaryItem: primaryItem,
			});
		}
	}
	
	if (request.addPrimaryItem == true) {
		// Had to comment out some lines here since the scraper seems to be grabbing wrong
		// item IDs from Walmart. This negates part of the confirmation that we're buying
		// the correct item, but this is an extra measure check anyway.
//		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
//			if (tabs[0].url.indexOf(primaryItem) > -1) {
				isCorrectItem = true;
				primaryItemAdded = true;
				if (hasExtraItem == false) {
					sendResponse({
						isCorrectItem: true,
						numOfItems: numOfItems,
						primaryItem: primaryItem,
						priceOnWF: priceOnWF,
						hasExtraItem: hasExtraItem,
					});
				} else {
					sendResponse({
						isCorrectItem: true,
						numOfItems: numOfItems,
						primaryItem: primaryItem,
						priceOnWF: priceOnWF,
						hasExtraItem: hasExtraItem,
						extraItem: extraItem,
					});
				}
//			}
//		});
	}
	
	if (request.addExtraItem == true) {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			if (tabs[0].url.indexOf(extraItem) > -1) {
				isCorrectItem = true;
				extraItemAdded = true;
				sendResponse({
					isCorrectItem: true,
				});
			}
		});
	}
	
	if (request.fillCustomerInfo == true) {
		console.log('Sending customer info to Walmart.');
		sendResponse({
			customerInfo: customerInfo,
		});
	}
	
	if (request.createAccount == true) {
		if (typeof customerInfo !== "undefined") {
			delete customerInfo;
			if (typeof customerInfo == "undefined") {
				console.log('Successfully purged customer info.');
			} else {
				alert('AutoDS could not purge customer info!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
			}
		}
		if (typeof emailForOrder !== "undefined") {
			delete emailForOrder;
			if (typeof emailForOrder == "undefined") {
				console.log('Successfully purged email info.');
			} else {
				alert('AutoDS could not purge email info!! Please keep a close eye on your next order to ensure the correct data is being entered and report this bug as soon as possible.');
			}
		}
		sendResponse({
			doAccountCreation: true,
			hasExtraItem: hasExtraItem,
		});
	}
	
	if (request.cancelExtraItem == true) {
		sendResponse({
			extraItem: extraItem,
			confirmCancelExtra: true,
		});
	}
	
	if (request.checkTaxFillOption == true) {
		if (localStorage.fillTax == 'enabled') {
			sendResponse({
				fillTaxEnabled: true,
			});
		} else if (localStorage.fillTax == 'disabled') {
			sendResponse({
				fillTaxEnabled: false,
			});
		}
	}
	
	if (request.sendBBY_Billing == true) {
		console.log('AutoDS: Sending Billing Info to Order Item ' + orderItemID + ' for Best Buy');
		noteData = '{"order_item_id": "' + orderItemID + '","note": "' + request.bbyBilling.replace(/"/g,"") + '"}'
		console.log(noteData);
		noteData = JSON.stringify(noteData);
		$.ajax({
			url: 'http://admin.stlpro.com/v1/order_item/' + orderItemID + '/',
			data: JSON.parse(noteData),
			dataType: 'json',
			contentType: 'application/json',
			type: 'PUT',
			success: function (data) {
				console.log(data);
				bbyBilling = data;
				noteSent = true;
				if (bbyBilling.order_item_id == orderItemID) {
					sendResponse({
						sentBillingInfo: true,
					});
				} else if (data.has_error == true) {
					for (key in JSON.parse(data.message)) {
					  errMsgWF = JSON.parse(data.message)[key]
					}
					errMsgWF = errMsgWF[0].trim();
					alert('Message from WebFactional:\n       ' + errMsgWF);
				}
				return data;
			},
			error: function (xhr, ajaxOptions, thrownError) {
				databaseError = xhr.responseText.split('\n')[0] + '\n       ' + xhr.responseText.split('\n')[1];
				alert('Message from WebFactional:\n       ' + databaseError);
			}
		});
	}
	
	return true;
});