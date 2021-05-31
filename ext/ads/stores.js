// Inject JS onto store pages. Each page identified through unique classnames. Developed by Jordan Siegler @ STL PRO, Inc 2018.

(function() {
	
function fillText(selector, value) {
	document.querySelector(selector).select();
	document.execCommand('insertText', false, value);
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
	if ((new Date().getTime() - start) > milliseconds){
	  break;
	}
  }
}

function contains(selector, text) {
	var elements = document.querySelectorAll(selector);
	return Array.prototype.filter.call(elements, function (element) {
	return RegExp(text).test(element.textContent);
	});
}

function isEmpty(obj) {
	for (var key in obj) {
		if (obj.hasOwnProperty(key))
		return false;
	}
		return true;
}

function callNTimes(func, num, delay) {
	if (!num) return;
	func();
	setTimeout(function() { callNTimes(func, num - 1, delay); }, delay);
}

function difference(a1, a2) {
	var result = [];
	for (var i = 0; i < a1.length; i++) {
		if (a2.indexOf(a1[i]) === -1) {
			result.push(a1[i]);
		}
	}
	return result;
}


//               .-:/+++oooo++//:-.`
//           .:oyyyhhhhhhhhhhhhhhyyyys+/-`     
//         :syhhhhhhhhhhhhhhhhhhhhhhhhhhyys+:.     
//       .syhhhhhhhhhhhhhhhhy/shhhhhhhhhhhhhhys:    
//      :yhhhhhhhhhhhhhhhhy+` .yhhhhhhhhhhhhhhhy.   
//     .yhhhhhhhhhysosssso-    /hhhhhhhhhhhhhhhh-   
//     ohhhhhhhhhhy-`````       -+osyhhhhhhhhhhh.   
//     yhhhhhhhhhhhy/`             ``-yhhhhhhhhh`   
//     shhhhhhhhhhhhhs`            ./syhhhhhhhhh    
//     :hhhhhhhhhhhhhs`          :syhhhhhhhhhhhy    
//      /yhhhhhhhhhhy.    ``     yhhhhhhhhhhhhho    
//       :shhhhhhhhh+`.:+oss/.  `hhhhhhhhhhhhhh/    
//        `/syhhhhhhyyyhhhhhhy+-:hhhhhhhhhhhhhh-    
//          `:hhhhhhhhhhhhhhhhhhyhhhhhhhhhhhhhh`    
//          `ohhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhs     
//         .shhhhhhhhhhhhhhyyyhhhhhhhhhhhhhhhh/     
//        -yhhhhhhhhhhhhhhs-`.shhhhhhhhhhhhhhh.     
//      .ohhhhhhhhhhhhhhho`   /hhhhhhhhhhhhhhs      
//   `-oyhhhhhhhhhhhhhhy/     +hhhhhhhhhhhhhh:    
//  -shhhhhhhhhhhhhhhhs-      shhhhhhhhhhhhhy`    
//  -shhhhhhhhhhhhhhy+`      `hhhhhhhhhhhhhh:     
//    :syhhhhhhhhhhs-        -hhhhhhhhhhhhho     
//      -+yyhhhhhy/`         .syyyyyyyysso/`    
//         .:+++-              ````            
//                Toys'R'Us Codes
	
					// R.I.P.

//	             ..............
//           ..OZZZZZZZZZZZZZZZZO..
//         .ZZZZZZZZZZZZZZZZZZZZZZZZ.
//       .OZZZZZZZZZZZZZZZZZZZZZZZZZZO.
//     .ZZZZZZZZZO           OZZZZZZZZZ.
//    OZZZZZZZO.               .OZZZZZZZO
//   OZZZZZZZ.        ...        .ZZZZZZZO
//  .ZZZZZZZ.     ..ZZZZZZZ..     .OZZZZZZ.
//  ZZZZZZZ.     .ZZZZZZZZZZZ.      OZZZZZZ.
//  ZZZZZZ~     .ZZZZZZZZZZZZZ.     ~ZZZZZZ.
//  ZZZZZZ..    .ZZZZZZZZZZZZZ.     .ZZZZZZ,
//  ZZZZZZ,.    .OZZZZZZZZZZZZ.     ,ZZZZZZ.
//  ZZZZZZZ.     .ZZZZZZZZZZZ.     .OZZZZZZ.
//  .ZZZZZZO..    ..OZZZZZO..    ..OZZZZZZZ.
//   OZZZZZZZ...    +++++++    ...ZZZZZZZO.
//    OZZZZZZZO..             ..OZZZZZZZO
//     .ZZZZZZZZZO.         .OZZZZZZZZZ.
//      .OZZZZZZZZZZZZZZZZZZZZZZZZZZZO.
//         .ZZZZZZZZZZZZZZZZZZZZZZZ.
//             OZZZZZZZZZZZZZZZO
//               +++++++++++++
//
//               Target Codes	
	
	    // Target variables
	if (window.location.href.indexOf('target') > -1) {
	var targFreeShip = document.querySelector('[data-test="cart-summary-delivery"]');
	var isItemPage2 = document.getElementsByClassName('CarouselWrapper-s9zgt9n-0 dMNoUr sc-eNQAEJ hVaSEp');
	var isAdded = document.getElementsByClassName('cart-ATC btn btn-primary btn-lg');
	var isTargLogin = document.getElementsByClassName('card login-form card-form card-full card-signin interstitial-login');
	var targAddyForm = document.getElementsByClassName('btn btn-default btn-sm editShippingAddr');
	var targAddyForm2 = document.getElementById('fullName');
	var targPayment = document.getElementsByClassName('form--subElements h-collapsible');
	var targGotoReview = document.getElementsByClassName('js-removeGC');
	
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

	    // Target functions	
	
	function injectContains() {
		var gotContains = "function contains(selector,text){var elements=document.querySelectorAll(selector);return Array.prototype.filter.call(elements,function(element){return RegExp(text).test(element.textContent);});};";
		var containsTag = document.createElement("script");
		containsTag.innerHTML = gotContains;
		document.head.appendChild(containsTag);
	}	
	
	function injectSleep() {
		var gotSleep = "function sleep(milliseconds){var start=new Date().getTime();for(var i=0;i<1e7;i++){if((new Date().getTime()-start)>milliseconds){break;}}}";
		var sleepTag = document.createElement("script");
		sleepTag.innerHTML = gotSleep;
		document.head.appendChild(sleepTag);
	}
	
	function checkForPrice(callback) {
		if (document.querySelector('[class="h-text-xl h-text-bold"]') !== null) {
			salePrice = document.querySelector('[class="h-text-xl h-text-bold"]').innerText.replace('$','');
			callback && callback();
		} else {
			console.log('Can\'t find the price. Trying again...');
			setTimeout(checkForPrice, 1000, callback);
		}
	}
	
	function determineItem() {
		chrome.runtime.sendMessage({
			determineItem: true,
		}, function(response) {
			if (response.numOfItems == 1) {
				if (window.location.href.indexOf(response.primaryItem) > -1) {
					buyPrimaryItem();
				} else if (window.location.href.indexOf(response.extraItem) > -1) {
					buyExtraItem();
				}
			} else if (response.numOfItems > 1) {
				for (var i = 0; i < response.numOfItems; i++) {
					if (window.location.href.indexOf(response.primaryItem[i]) > -1) {
						buyPrimaryItem();
					} else if (window.location.href.indexOf(response.extraItem) > -1) {
						buyExtraItem();
					}
				}
			}	
		});
	}

	function buyPrimaryItem() {
		console.log('Sending message to buy primary item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addPrimaryItem: true,
			}, function(response) {
				if (window.location.href.indexOf('target.com/p/') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					if (response.isCorrectItem === true) {
						checkForPrice(function () {
							if (salePrice == response.priceOnWF) {
								console.log('Price on page matches Database');
								addTargCart();
								if (response.hasExtraItem == true) {
									setTimeout(actualCartPage, 2000);
								} else {
									setTimeout(actualCartPage, 2000);
								}
							} else {
								alert('Database Price: ' + response.priceOnWF + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
							}
						});
					}
				}
			});
		}, 200);
	}

	function buyExtraItem() {
		console.log('Sending message to buy extra item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addExtraItem: true,
			}, function(response) {
				if (window.location.href.indexOf('target.com/p/') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					
					if (response.isCorrectItem === true) {
						console.log('AutoDS: This is the correct freeship item.');
						addTargCart();
						setTimeout(actualCartPage, 2000);
					} else {
						alert('AutoDS: This does not appear to be the correct freeship item. If you believe you received this message in error, please post in #bug_reporting on Slack');
					}
				}
			});
		}, 200);
	}
	
    function addTargCart() {
		var gotTargItem = "document.querySelector('button[data-test=\"shippingATCButton\"]').click();";
		var targItemTag = document.createElement("script");
		targItemTag.innerHTML = gotTargItem;
		document.head.appendChild(targItemTag);
	}
	
	function actualCartPage() {
		var interval = setInterval(function() {
			// make sure it's added to cart
			if (document.querySelector('[class="h-text-hd2"][tabindex="-1"]') == null) return;
			clearInterval(interval);
			// initial calculations
			window.location.href = 'https://www.target.com/co-cart';
		}, 10);	
	}
	
	function startTargCheckout1() {
		var gotTargCart = "document.querySelector('[data-test=\"giftOptionCheckbox\"]').click();";
        var targCartTag = document.createElement("script");
        targCartTag.innerHTML = gotTargCart;
        document.head.appendChild(targCartTag);
	}
	
	function startTargCheckout2() {
		if (document.querySelector('button[data-test="checkout-link"]') !== null) {
			var gotTargCart = "document.querySelector('button[data-test=\"checkout-link\"]').click();";
		} else {
			var gotTargCart = "document.querySelector('button[data-test=\"checkout-button\"]').click();";
		}
        var targCartTag = document.createElement("script");
        targCartTag.innerHTML = gotTargCart;
        document.head.appendChild(targCartTag);
	}
	
	function targSaveCont() {
		document.querySelector('[data-test="save-and-continue-button"]').click();
	}

	function targAddy() {
		amt = document.querySelectorAll('[data-test="deleteButton"]').length
		addycount = document.querySelectorAll('[data-test="editButton"]').length

		if (addycount > 1) {
			console.log(addycount);
			for (var i = 0; i < amt; i++) {
				document.querySelectorAll('[data-test="deleteButton"]')[i].click();
				addycount = addycount - 1;
			}
		}

		//modify remaining addy
		if (addycount == 1 || document.querySelector('[data-test="editButton"]') !== null) {
			targHintBox.textContent = '\n Use Dropship Helper to fill address info. \n Press ALT+X to save and continue. \n\n';
			document.querySelectorAll('[data-test="deleteButton"]')[0].click();
			addycount = null;
			console.log(addycount);
		}
		
		if (document.getElementById('fullName') !== null && document.getElementById('STEP_SHIPPING').querySelector('[data-test="BarWithCaret"]').innerText.substr(0,6) == "2 of 6") {
			document.querySelector('[data-test="saveButton"]').click();
			targHintBox.textContent = '\n Press ALT+X to save pickup name and continue. \n\n';
		} else {
			if (document.getElementById('fullName') !== null && document.getElementById('STEP_SHIPPING').querySelector('[data-test="BarWithCaret"]').innerText.substr(0,6) == "2 of 5") {
				document.querySelector('[data-test="saveButton"]').click();
				targHintBox.textContent = '\n Press ALT+X to fill gift options and continue. \n\n';
			}
		}
	}

	function targGiftFill() {
		var giftFill = "gftMsgAmt=document.querySelectorAll('[name=\"giftMessage\"]').length;for(var i=0;i<gftMsgAmt;i++){document.querySelectorAll('[name=\"giftMessage\"]')[i].select();document.execCommand('insertText',false,'..........');}";
		var giftScript = document.createElement("script");
        giftScript.innerHTML = giftFill;
        document.head.appendChild(giftScript);
		bypassReady = false;
		callNTimes(removeBypassContent, 5, 1000);
	}
	
	function removeBypassContent() {
		if (document.querySelector('[data-test="verify-card-form"]') !== null) {
			bypassReady = true;
			document.querySelector('[aria-label="add new credit card"]').parentElement.remove();
			document.querySelector('[data-test="verify-card-form"]').previousElementSibling.remove();
			document.querySelector('[data-test="verify-card-form"]').remove();
		} else {
			bypassReady = false;
		}
	}
	
	function targPaidInFull() {
		if (document.querySelector('[data-test="giftCardPaymentPaidFull"]') == null || document.querySelector('[data-test="giftCardPaymentRemainingAmount"]').innerText == "Remaining payment due: $0.00") {
			if (document.querySelector('[data-test="payment-card-form-submit"]') !== null) {
				document.querySelector('[data-test="payment-card-form-submit"]').click();
			} else if (document.querySelector('[data-test="save-and-continue-button"]') !== null) {
				document.querySelector('[data-test="save-and-continue-button"]').click();
			}
			targHintBox.textContent = '\n Press ALT+X to place order and move to order confirmation screen. \n\n';
		}
	}
	
	
	function targPass() {
		if (document.querySelector('[class="gsp-errorMsg gsp-errorMsg danger"]') === null) {
			document.getElementById('password').select();
			document.execCommand('insertText', false, 'forte1long');
			if (document.querySelector('h2').innerText == "Sign in") {
				document.getElementById('login').click();
				targHintBox.textContent = '\n Please ensure if you have a pickup item, it is marked as such here. \n Press ALT+X to continue. \n\n';
			} else if (document.querySelector('h2').innerText == "Create account") {
				document.getElementById('createAccount').click();
				targHintBox.textContent = '\n Please ensure if you have a pickup item, it is marked as such here. \n Press ALT+X to continue. \n\n';
			}
		} else {
			//
		}
	}
	
	function targPayFunc() {
		if (document.querySelector('[class="h-margin-t-wide styles__PaymentBorderTop-nnx2i2-0 iDsLNs"]') == null) {
			document.querySelector('[name="payment-gift-card-checkbox"]').click();
			if (document.querySelectorAll('[class="h-padding-a-tight h-margin-l-tiny h-text-bs h-display-inline-block h-text-black"]')[2].innerText == "3 of 5 | Gift options" || document.querySelectorAll('[class="h-padding-a-tight h-margin-l-tiny h-text-bs h-display-inline-block h-text-black"]')[2].innerText == "3 of 6 | Order pickup info") {
				if (bypassReady == false) {
					ccBypass();
				}
			}
		}
	}
	
	function ccBypass() {
		rng = Math.floor((Math.random() * 10) + 1);
		if (rng == 1) {
			ccArr = "4574893779316823||09/20||837";
			ccArr = ccArr.split('||');
		} else if (rng == 2) {
			ccArr = "4294582382593642||02/22||210";
			ccArr = ccArr.split('||');
		} else if (rng == 3) {
			ccArr = "4811321937818723||06/25||643";
			ccArr = ccArr.split('||');
		} else if (rng == 4) {
			ccArr = "4062813704514622||12/27||204";
			ccArr = ccArr.split('||');
		} else if (rng == 5) {
			ccArr = "4614924560092091||09/22||894";
			ccArr = ccArr.split('||');
		} else if (rng == 6) {
			ccArr = "4485260277933681||02/24||273";
			ccArr = ccArr.split('||');
		} else if (rng == 7) {
			ccArr = "4984501746616076||10/28||181";
			ccArr = ccArr.split('||');
		} else if (rng == 8) {
			ccArr = "4623491485681951||07/23||111";
			ccArr = ccArr.split('||');
		} else if (rng == 9) {
			ccArr = "4784631629250354||08/22||847";
			ccArr = ccArr.split('||');
		} else if (rng == 10) {
			ccArr = "4941336194476380||06/28||664";
			ccArr = ccArr.split('||');
		}
		// Fill generated CC
		fillText('[id="creditCardInput-cardNumber"]', ccArr[0]);
		fillText('[id="creditCardInput-expiration"]', ccArr[1]);
		fillText('[id="creditCardInput-cvv"]', ccArr[2]);
		fillText('[id="creditCardInput-cardName"]', document.querySelector('[aria-label="edit billing address"]').parentElement.firstElementChild.firstElementChild.innerText);
		// Submit CC
		if (document.querySelector('[data-test="payment-card-form-submit"]') !== null) {
			document.querySelector('[data-test="payment-card-form-submit"]').click();
			setTimeout(goBackForGC, 1500);
		} else {
			document.querySelector('[data-test="save-and-continue-button"]').click();
			setTimeout(goBackForGC, 1500);
		}

		function goBackForGC() {
			normalOrder = contains('h2','1 of 6');
			normalOrder = isEmpty(normalOrder);
			function targ_CCAppliedCheck() {
				if (normalOrder == false) {
					appliedCC = contains('[class="h-padding-a-tight h-margin-l-tiny h-text-bs h-display-inline-block h-text-black"]','5 of 6');
				} else {
					appliedCC = contains('[class="h-padding-a-tight h-margin-l-tiny h-text-bs h-display-inline-block h-text-black"]','4 of 5');
				}
				if (isEmpty(appliedCC) == true) {
					setTimeout(targ_CCAppliedCheck, 100);
					console.log('wait in goBackForGC');
				} else {
					if (isEmpty(appliedCC) == false) {
						document.querySelector('[aria-label=" Payment edit"]').click();
						setTimeout(finalBypass, 800);
					}
				}
			}
			targ_CCAppliedCheck();
		}

		function finalBypass() {
			function targReadyForGC_Check() {
				ccCVV = document.querySelector('[id="creditCardInput-cvv"]');
				if (ccCVV === null) {
					setTimeout(targReadyForGC_Check, 100);
					console.log('wait in finalBypass');
				} else {
					if (ccCVV !== null) {
						document.querySelector('[id="creditCardInput-cvv"]').hidden = true;
						document.querySelector('[class*="ChosenPaymentCard"]').parentElement.hidden = true;
						document.querySelector('[aria-label="add new credit card"]').parentElement.remove();
					}
				}
			}
			targReadyForGC_Check();
		}
	}
		
	
	function targReview() {
		document.getElementsByClassName('form--subElements h-collapsible')[0].className = 'bye';
		document.getElementsByClassName('bye')[0].hidden = 'true';
		var targReviewBtn = "document.getElementById('payment_save').click();";
		var targReviewTag = document.createElement("script");
        targReviewTag.innerHTML = targReviewBtn;
        document.head.appendChild(targReviewTag);		
	}	
	
	function targPlaceOrd() {
		document.querySelector('[data-test="placeOrderButton"]').click();
	}
	
	function targPickupCancel() {
		document.querySelector('[data-test="viewOrderDetailsBtn"]').click();
		setTimeout(targCancelMsg, 1900);
	}
	
	function targCancelMsg() {
		targHintBox.textContent = '\n ALT+X to go to GiftCards page after canceling the pickup item. \n\n';
	}

	function targCopyOrd() {
		var targOrderIt = "var gotOrdNum=document.querySelector('[data-test=\"viewOrderDetailsBtn\"]').href.substr(38,500); !function (a) { var b = document.createElement('textarea'), c = document.getSelection(); b.textContent = a, document.body.appendChild(b), c.removeAllRanges(), b.select(), document.execCommand('copy'), c.removeAllRanges(), document.body.removeChild(b) } (gotOrdNum);";
		var targOrderTag = document.createElement("script");
		targOrderTag.innerHTML = targOrderIt;
		document.head.appendChild(targOrderTag);
		cancelItem = '';
		if (document.querySelector('[data-test="pickup-delivery-header"]') !== null) {
			cancelItem = "Y";
		}
	}	
	
	function errorMsg() {
		alert('Oops! Something went wrong! Make sure everything is filled out.\nIf you have received this message in error, please contact Jordan via Slack or text.');
	}
	
	function targFreeShipCheck() {
		if (targFreeShip.firstChild.lastChild.innerText == "Free" || targFreeShip.firstChild.lastChild.innerText == "free") {
			inclGift = document.querySelector('[data-test="giftOptionCheckbox"]').lastChild;
			if (window.getComputedStyle(inclGift, ':after').content !== '""') {
				startTargCheckout1();
				setTimeout(startTargCheckout2, 800);
				targHintBox.textContent = '\n Use Dropship Helper to fill email, then \n press ALT+X to fill password and continue \n\n';
			} else {
				if (window.getComputedStyle(inclGift, ':after').content == '""') {
					setTimeout(startTargCheckout2, 800);
					targHintBox.textContent = '\n Use Dropship Helper to fill email, then \n press ALT+X to fill password and continue \n\n';
				}
			}
		} else {
			alert('You do not have free shipping! \n Click "I\'m ready to check out" to manually override');
		}
	}
	
	function targDelAddMsg() {
		targHintBox.textContent = '\n Press ALT+X to delete any saved addresses. Press again to add new address. \n\n';
	}
	
	function targDelGCs() {
		if (window.location.href.indexOf('/account/orders/') > -1) {
			if (isEmpty(contains('h2[color="grayDarkest"]','canceled')) == false || document.querySelectorAll('[class*="ShipmentHeading__Container"]').length == 1) {
				contains('a[href="/account/giftcards"]','GiftCards')[0].click();
			} else {
				alert('AutoDS couldn\'t tell if there was a canceled freeship item or if there was only one item on the order.\nYou may still click the GiftCards link in the left pane to try deleting Gift Cards.\nPlease post this in #bug_reporting.');
			}
		}

		setTimeout(function () {
			if (window.location.href.indexOf('/account/giftcards') > -1) {
				if (document.querySelector('a[href*="/delete"]') !== null) {
					document.querySelectorAll('a[href*="/delete"]')[0].click();
					setTimeout(function() {contains('button','yes')[0].click();}, 1000);
				} else {
					alert('AutoDS couldn\'t find any Gift Cards to delete, or they have all been deleted already.\nIf there are Gift Cards to delete and you see this error, please post this in #bug_reporting.');
				}
			}
		}, 1500);
	}
	
	function targCancelFreeship1() {
		pickupItem = contains('[class*="ShipmentHeading__Element-s1yx3vzf-1"][color="greenDark"]','pickup')[0].parentElement.parentElement;
		piButtons = pickupItem.querySelectorAll('button');
		piCancelBtn = Array.prototype.filter.call(piButtons, function (element) {
				return RegExp('cancel').test(element.textContent);
		});
		piCancelBtn[0].click();
		setTimeout(targCancelFreeship2, 500);
	}
	
	function targCancelFreeship2() {
		contains('button','yes')[0].click();
		setTimeout(targCancelFreeship3, 500);
	}
	
	function targCancelFreeship3() {
		contains('[data-test="radioComponentLabel"]','no longer want the item')[0].click();
		contains('button','cancel this item')[0].click();
	}
	
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

	    // Target Magic Code
	function autoTarg() {
		if (window.location.href.indexOf('target.com/p/') > -1) {
			determineItem();
		} else {
			if (window.location.href.indexOf('target.com/co-cart') > -1) {
				injectSleep();
				targFreeShipCheck();
			} else {
				if (window.location.href.indexOf('co-login') > -1) {
					targPass();
				} else {
					if (window.location.href.indexOf('co-deliverymethod') > -1) {
						targSaveCont();
						targDelAddMsg();
					} else {
						if (window.location.href.indexOf('co-delivery') > -1) {
							targAddy();
						} else {
							if (window.location.href.indexOf('co-pickupdelivery') > -1) {
								document.querySelector('[data-test="SaveAndContinue"]').click();
								targHintBox.textContent = '\n Press ALT+X to fill gift options and continue. \n\n';
							} else {
								if (window.location.href.indexOf('co-giftoption') > -1) {
									targGiftFill();
									setTimeout(targSaveCont, 1000);
									targHintBox.textContent = '\n Press ALT+X to choose gift card for payment. \n Press ALT+X after the order has been paid in full. \n\n';
								} else {
									if (window.location.href.indexOf('co-payment') > -1) {
										targPayFunc();
										targPaidInFull();
									} else {
										if (window.location.href.indexOf('co-review') > -1) {
											targPlaceOrd();
											targHintBox.textContent = '\n ALT+X to copy order number \n If pickup item is detected, you will be redirected \n to the order details page so you may cancel \n\n';
										} else {
											if (window.location.href.indexOf('co-thankyou') > -1) {
												var cancelItem;
												targCopyOrd();
												setTimeout(targPickupCancel, 1000);
											} else {
												if (window.location.href.indexOf('co-thankyou') > -1 && cancelItem == "Y") {
													document.querySelector('[data-test="viewOrderDetailsBtn"]').click();
													injectContains();
												} else {
													if (window.location.href.indexOf('target.com/account/orders/') > -1) {
														injectContains();
														targDelGCs();
													} else {
														if (window.location.href.indexOf('/account/giftcards') > -1) {
															if (document.querySelector('a[href*="/delete"]') !== null) {
																document.querySelectorAll('a[href*="/delete"]')[0].click();
																setTimeout(function() {contains('button','yes')[0].click();}, 1000);
															} else {
																alert('AutoDS couldn\'t find any Gift Cards to delete, or they have all been deleted already.\nIf there are Gift Cards to delete and you see this error, please post this in #bug_reporting.');
															}
														} else {
															errorMsg();
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	autoTarg();
	}

	
//	 ....................  ......................
//   -++++++++++++++++/.    ./+++++++++++++++++++
//   -++++++++++++++/.        ./+++++++++++++++++
//   -++++++++++++/.            ./+++++++++++++++
//   -++++++++++++:`              ./+++++++++++++
//   -++++++++++++++:`              ./+++++++++++
//   -++++++++++++++++:`              ./+++++++++
//   -++++/..:++++++++++:`              ./+++++++
//   -++/.    .:+++++++++/.               ./+++++
//   -/.        .:+++++/-`                  ./+++
//   .            .:++:                       ./+
//   '              .:+:                        .
//   -/.              .:+:    ,`:/:`            '
//   -++/.              .:+:``:+++++:`         ./
//   -++++/.              .:++++++++++:`     ./++
//   -++++++/.              .:++++++++++:` ./++++
//   -++++++++:.              .:++++++++++/++++++
//   -++++++++++:.              .:+++++++++++++++
//   -++++++++++++/.              .:+++++++++++++
//   -++++++++++++++/.             ./++++++++++++
//   -++++++++++++++++/.         ./++++++++++++++
//   -++++++++++++++++++/.     ./++++++++++++++++
//   .....................`   ...................
//                  Home Depot Codes
	
		// Home Depot Variables
	if (window.location.href.indexOf('homedepot') > -1) {
	var hdShipable = document.getElementsByClassName('bttn bttn--atc express_delivery_CTA');
	var hdItemPage = document.getElementsByClassName('brandModelInfo');
	var hdFirstName = document.getElementById('firstName');
	var hdFreeShipChk = document.getElementsByClassName('message__text');
	 
	
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 	
	
		// Home Depot Functions
	
	function injectContains() {
		var gotContains = "function contains(selector,text){var elements=document.querySelectorAll(selector);return Array.prototype.filter.call(elements,function(element){return RegExp(text).test(element.textContent);});};";
		var containsTag = document.createElement("script");
		containsTag.innerHTML = gotContains;
		document.head.appendChild(containsTag);
	}
	
	function determineItem() {
		chrome.runtime.sendMessage({
			determineItem: true,
		}, function(response) {
			if (response.numOfItems == 1) {
				if (window.location.href.indexOf(response.primaryItem) > -1) {
					buyPrimaryItem();
				}
			} else if (response.numOfItems > 1) {
				for (var i = 0; i < response.numOfItems; i++) {
					if (window.location.href.indexOf(response.primaryItem[i]) > -1) {
						itemNum = i;
						buyPrimaryItem();
					}
				}
			}	
		});
	}
	
	function clickAddToCart() {
		if (document.querySelector('[class="buybelt-wrapper"]') === null) {
			if (document.getElementById('atc_shipIt') === null) {
				console.log('Can\'t find Add to Cart button. Trying again...');
				setTimeout(clickAddToCart, 100);
			} else {
				setTimeout(function() { 
					document.getElementById('atc_shipIt').click();
				}, 600);
			}
		} else if (document.querySelector('[class="buybelt-wrapper"]') !== null) {
			if (document.querySelector('[class="bttn bttn--primary"]') === null) {
				console.log('Can\'t find Add to Cart button. Trying again...');
				setTimeout(clickAddToCart, 100);
			} else {
				setTimeout(function() { 
					document.querySelector('[class="bttn bttn--primary"]').click();
				}, 600);
			}
		}
	}
	
	function checkForPrice(callback) {
		if (document.getElementById('ajaxPrice').getAttribute('content') !== null) {
			salePrice = document.getElementById('ajaxPrice').getAttribute('content').replace('$','');
			callback && callback();
		} else if (document.getElementById('ajaxPrice').getAttribute('content') === null) {
			salePrice = document.getElementById('ajaxPrice').innerHTML.replace('$','').trim();
			callback && callback();
		} else {
			console.log('Can\'t find the price. Trying again...');
			setTimeout(checkForPrice, 1000, callback);
		}
	}
	
	function buyPrimaryItem() {
		console.log('Sending message to buy primary item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addPrimaryItem: true,
			}, function(response) {
				if (window.location.href.indexOf('homedepot.com/p/') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					if (response.isCorrectItem === true) {
						checkForPrice(function () {
							if (response.numOfItems == 1) {
								if (salePrice == +response.priceOnWF || +salePrice < +response.priceOnWF) {
									console.log('Price on page matches Database');
									clickAddToCart();
									if (response.hasExtraItem == true) {
										setTimeout(checkForModalHD, 1000);
									} else {
										setTimeout(checkForModalHD, 1000);
									}
								} else {
									alert('Database Price: ' + response.priceOnWF + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
								}
							} else if (response.numOfItems > 1) {
								if (+salePrice == +response.priceOnWF[itemNum] || +salePrice < +response.priceOnWF[itemNum]) {
									console.log('Price on page matches Database');
									clickAddToCart();
									if (response.hasExtraItem == true) {
										setTimeout(checkForModalHD, 1000);
									} else {
										setTimeout(checkForModalHD, 1000);
									}
								} else {
									alert('Database Price: ' + response.priceOnWF[itemNum] + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
								}
							}
						});
					}
				}
			});
		}, 200);
	}
	
	function checkForModalHD() {
		if (document.querySelectorAll('[class*="thd-overlay-desktop"]')[1].querySelector('iframe').contentDocument.querySelector('[class="u__husky"]') === null) {
			console.log('AutoDS: Haven\'t found iframe yet, checking again.');
			setTimeout(checkForModalHD, 500);
		} else {
			if (document.querySelectorAll('[class*="thd-overlay-desktop"]')[1].querySelector('iframe').contentDocument.querySelector('[class="u__husky"]').innerHTML.indexOf('Added to Cart') > -1) {
				console.log('AutoDS: iframe text "Added to Cart" detected. Going to cart.');
				window.location.href = 'https://www.homedepot.com/mycart/home';
			} else {
				console.log('AutoDS: iframe text "Added to Cart" not found. Potential error, will not redirect to cart.');
				document.querySelectorAll('[class*="thd-overlay-desktop"]')[1].querySelector('iframe').contentDocument.querySelector('[class="u__husky"]').parentElement.parentElement.parentElement.remove();
				document.querySelectorAll('[class*="thd-overlay-desktop"]')[1].querySelector('iframe').contentDocument.querySelector('[data-automation-id="inlineMessageerrorText"]').className = "u__husky";
				document.querySelectorAll('[class*="thd-overlay-desktop"]')[1].querySelector('iframe').contentDocument.querySelector('[data-automation-id="inlineMessageerrorText"]').innerText = 'AutoDS: Click outside of this box and press ALT+X again to add the item to cart.';
			}
		}
	}
	
	function hdCompareCartToWebF() {
		chrome.runtime.sendMessage({
			addPrimaryItem: true,
		}, function(response) {
			if (window.location.href.indexOf('homedepot.com/mycart/home') > -1) {
				console.log('AutoDS: Response is:');
				console.log(response);
				if (response.numOfItems) {
					hdProducts = document.querySelectorAll('[class="cartItem"]');
					hdProductLinks = [];
					hdProductNames = [];
					for (var i = 0; i < hdProducts.length; i++) {
						hdProductLinks.push(hdProducts[i].querySelector('[class="cartImage"]').querySelector('a').href.split("/").pop());
						hdProductNames.push(hdProducts[i].querySelector('[data-automation-id="productDesktopItemBrandLink"]').innerText);
					}
					
					if (response.numOfItems > 1) {
						helperProductLinks = response.primaryItem;
						helperProductLinks.reverse();
					} else {
						helperProductLinks = [];
						helperProductLinks.push(response.primaryItem);
					}
					
					checkItemIdDifferences = difference(helperProductLinks, hdProductLinks);
					
					if (isEmpty(checkItemIdDifferences) == true) {
						
						pricesTheyHave = [];
						for (var i = 0; i < hdProducts.length; i++) {
							pricesTheyHave.push(contains('div[class*="col"][class*="--none"]:not([class*="wasPrice"])','/Item')[i].innerText.replace('$','').replace('/Item',''));
						}
						
						if (response.priceOnWF.constructor === Array) {
							pricesWeHave = response.priceOnWF;
							pricesWeHave.reverse();
						} else {
							pricesWeHave = [];
							pricesWeHave.push(response.priceOnWF);
						}
						
						checkItemPriceDifferences = difference(pricesTheyHave, pricesWeHave);
						if (isEmpty(checkItemPriceDifferences) == true) {
							console.log('Prices passed Database Checker');
							setTimeout(hdFreeShipErr,500);
						} else {
							hdPassedDatabaseCheck = [];
							for (var i = 0; i < pricesWeHave.length; i++) {
								if (+pricesTheyHave[i] > +pricesWeHave[i]) {
									alert('Database Price: ' + pricesWeHave[i] + '\nSupplier Price: ' + pricesTheyHave[i] + '\n\nThe price of: ' + hdProductNames[i] + '\n\nis higher than expected. Do not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
									hdPassedDatabaseCheck.push('didNotPass');
								} else if (+pricesTheyHave[i] < +pricesWeHave[i]) {
									console.log('Database Price: ' + pricesWeHave[i] + '\nSupplier Price: ' + pricesTheyHave[i] + '\n\nPrice on Supplier is lower than Database');
									hdPassedDatabaseCheck.push('didPass');
								}
							}
							if (hdPassedDatabaseCheck.includes('didNotPass') == false) {
								setTimeout(hdFreeShipErr,500);
							}
						}
					} else {
						alert('AutoDS: Items do not appear to match those which should be bought.\nCompare Item IDs below to see if any are different.\n\nNOTENOTENOTE: Item IDs may be in a different order, do not compare symmetrically.\n\nHome Depot Item IDs: ' + hdProductLinks.toString() + '\nDatabase Item IDs: ' + helperProductLinks.toString());
					}
				}
			}
		});
	}
	
	function hdCheckout() {
		window.location.href = 'https://secure2.homedepot.com/mycheckout/signin#/signin';
	}	
	
	function hdDoMultiShip() {
		var gotMultiShip = "var multiShipLink=contains('span','Ship to Multiple Addresses');multiShipLink[0].click();";
		var multiShipTag = document.createElement("script");
		multiShipTag.innerHTML = gotMultiShip;
		document.head.appendChild(multiShipTag);
	}
	
	function hdUnCheckBilling() {
		var gotBillingBox = "var hdUAB=contains('label','Use as Billing Address');hdUAB[0].click();";
		var billingBoxTag = document.createElement("script");
		billingBoxTag.innerHTML = gotBillingBox;
		document.head.appendChild(billingBoxTag);
	}
	
	function hdTrick() {
		var firstNameTrick = document.createElement("span");
		firstNameTrick.setAttribute("id","firstName");
		firstNameTrick.setAttribute("value","multiShipStart");
		document.head.appendChild(firstNameTrick);
	}
	
	function hdTrickSingle() {
		var singShipTrick = document.createElement("span");
		singShipTrick.setAttribute("id","helpEle");
		singShipTrick.setAttribute("name","shipSing");
		document.head.appendChild(singShipTrick);
	}
	
	function hdTrickMulti() {
		var multiShipTrick = document.createElement("span");
		multiShipTrick.setAttribute("id","helpMult");
		multiShipTrick.setAttribute("name","shipMulti1");
		multiShipTrick.innerHTML = 'FRIG';
		document.head.appendChild(multiShipTrick);
	}
	
	function taxClick() {
		if (document.querySelector('[id="emailInput"]').value == "") {
			chrome.runtime.sendMessage({
				fillCustomerInfo: true,
			}, function(response) {
				fillText('[id="emailInput"]', response.customerInfo.split('|')[11])
			});
		}
		document.querySelectorAll('[data-automation-id=taxExempt_applyTaxExemptIdLink]')[1].click();
		sleep(500);
		var selector = 'input[name="taxExemptId"]';
		var el;
		el = document.querySelector(selector);
		el.value = "1808421833";
		el.dispatchEvent(new Event('input'));
		sleep(100);
		document.querySelectorAll('[data-automation-id=taxExempt_applyButton]')[0].click();
	}
	
	function hdAddy() {
		var gotAddAddy = "document.querySelector('[label^=\"STL Pro\"][selected=\"selected\"]').parentNode.offsetParent.offsetParent.children[1].children[1].click();";
		var addAddyTag = document.createElement("script");
		addAddyTag.innerHTML = gotAddAddy;
		document.head.appendChild(addAddyTag);
	}
	
	function hdAddyOne() {
		var gotFirstAddy = "var addyLinks=contains('span','Add New');addyLinks[0].click();";
		var firstAddyTag = document.createElement("script");
		firstAddyTag.innerHTML = gotFirstAddy;
		document.head.appendChild(firstAddyTag);
		hdFirstName.value = 'firstAddress';
	}
	
	function hdAddyTwo() {
		var gotSecondAddy = "var addyLinks=contains('span','Add New');addyLinks[1].click();";
		var secondAddyTag = document.createElement("script");
		secondAddyTag.innerHTML = gotSecondAddy;
		document.head.appendChild(secondAddyTag);
	}
	
	function hdGetOrderNumber() {
		var hdOrderIt = "var hdURL=window.location.href;var hdGetOrd=hdURL.search('orderId');var hdOrdClip=hdURL.substr(hdGetOrd,18);var hdOrdId=hdOrdClip.replace('orderId=','');!function(a){var b=document.createElement('textarea'),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand('copy'),c.removeAllRanges(),document.body.removeChild(b)}(hdOrdId);";
		var hdOrderTag = document.createElement("script");
		hdOrderTag.innerHTML = hdOrderIt;
		document.head.appendChild(hdOrderTag);
	}	
	
	function errorMsg() {
		alert('ADS_ERR \n Oops! Something went wrong! Make sure everything is filled out.\nIf you have received this message in error, please contact Jordan via Slack or text.');
	}
	
	function hdFreeShipErr() {
		if (hdFreeShipChk[0].innerText !== 'FREE Shipping on eligible items. See Details') {
			alert('You do not have Free Shipping!\nIf you are approved to continue, please click "Checkout Now" manually.\n\nIf you have received this message in error, please contact Jordan via Slack or text.');
		} else {
			if (hdFreeShipChk[0].innerText == 'FREE Shipping on eligible items. See Details') {
				console.log('Has Free Shipping');
				hdCheckout();
			}
		}
	}
	
	function hdGetOrderNumber() {
		var hdOrderIt = "var hdURL=window.location.href;var hdGetOrd=hdURL.search('orderId');var hdOrdClip=hdURL.substr(hdGetOrd,18);var hdOrdId=hdOrdClip.replace('orderId=','');!function(a){var b=document.createElement('textarea'),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand('copy'),c.removeAllRanges(),document.body.removeChild(b)}(hdOrdId);";
		var hdOrderTag = document.createElement("script");
		hdOrderTag.innerHTML = hdOrderIt;
		document.head.appendChild(hdOrderTag);
	}
	
	function hdPriceMutationObserver() {
		hdPrices = [];
		hdPricesArray = document.querySelector('[data-automation-id="sthPod"][ng-if="checkoutFlags.isSTH"][class="col__12-12 u__p-top-large u__m-top-small u__bottom-padding-off u__background-white ng-scope"]').querySelectorAll('[data-automation-id="itemPrice"]');

		observer = new MutationObserver(function (mutations) {
				mutations.forEach(function (mutation) {
					alert("WARNING: An item's price has just changed from " + mutation.oldValue + " to " + mutation.target.textContent + ".\n\nIf the item's price has increased, do not buy it! Flag the item as \"Regional Price Change\" on WebFactional.");
					console.log(mutation.target.data);
				});
			});

		hdPriceConfig = {
			characterData: true,
			attributes: true,
			characterDataOldValue: true,
			childList: false,
			subtree: true
		};

		for (var i = 0; i < hdPricesArray.length; i++) {
			hdPrices[i] = document.querySelector('[data-automation-id="sthPod"][ng-if="checkoutFlags.isSTH"][class="col__12-12 u__p-top-large u__m-top-small u__bottom-padding-off u__background-white ng-scope"]').querySelectorAll('[data-automation-id="itemPrice"]')[i];
			
			observer.observe(hdPrices[i], hdPriceConfig);
		}
	}
	
	function hdFreeShippingRemains() {
		if (document.querySelectorAll('[data-automation-id="shippingCost"]')[1].innerText !== "FREE") {
			hdHintBoxMove.textContent = '\n AutoDS has detected shipping has been added to your order. \n\n';
			alert('AutoDS has detected shipping has been added to your order.');
		} else {
			hdHintBoxMove.textContent = '\n Order processing. Please wait. \n\n';
			document.getElementById('placeOrderButtonSpan').click();
		}
	}
	
	function hdTrick1() {
		var autoDS_id = document.createElement("div");
		autoDS_id.setAttribute("id", "autoDS");
		autoDS_id.className = "autoDS_class";
		autoDS_id.innerHTML = "multiShipStart";
		document.head.appendChild(autoDS_id);
	}
	
	function hdTrick2() {
		hdFirstName = document.createElement("div");
		hdFirstName.setAttribute("id", "fnTrk");
		hdFirstName.className = "fnTrk_class";
		hdFirstName.innerHTML = "fnTrk";
		hdFirstName.setAttribute("value", " ");
		document.head.appendChild(hdFirstName);
	}
	
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // 

		// Home Depot Magic Code
	function autoHD() {
		if (typeof hdFnTrack == "undefined") {
			hdFnTrack = "begin";
		}
		if (hdShipable.length == 1) {
			alert('Item not eligible to ship');
		} else if (hdItemPage.length > 0) {
			determineItem();
		} else if (window.location.href.indexOf('mycart/home') > -1) {
			//hdCompareCartToWebF();
			setTimeout(hdFreeShipErr,500);
		} else if (window.location.href.indexOf('signin#/signin') > -1) {
			if (contains('span','Continue')[0] !== undefined) {
				contains('span','Continue')[0].click();
			} else {
				document.querySelector('[ng-click="continueAsGuest()"]').click();
			}
		} else if (window.location.href.indexOf('/checkout') > -1 && hdFnTrack == 'begin') {
			hdFnTrack = "doMultiShip";
			console.log(hdFnTrack);
			taxClick();
			hdPriceMutationObserver();
			hdHintBoxMove.textContent = '\n Press ALT+Z and choose HomeDepot (M) Billing \n Afterwards, press ALT+X. \n\n';
			hdHintBoxMove.value = 'chooseAdventure';
			document.getElementById('shippingAddress').id = "shipAddress";
			var isSingle = document.getElementById('shippingAddress');
			document.getElementById('firstName').value = ' ';
			hdTrick1();
			hdTrick2();
		} else if (hdFnTrack == "doMultiShip") {
			if (shipAddress.value.indexOf('1380') > -1) {
				var autoDSHelp = document.getElementById('autoDS');
				injectContains();
				hdDoMultiShip();
				hdHintBoxMove.textContent = '\n ALT+X to open shipping info for first item. \n Use Dropship Helper to fill fields. \n Repeat for each address until this box changes. \n\n';
				addNews = contains('span', 'Add New');
				multAmt = addNews.length;
				autoDSHelp.innerHTML = 'doingIt';
				hdFnTrack = "nextOne";
			}
		} else if (window.location.href.indexOf('/checkout') > -1 && multAmt > 1) {
			if (document.querySelector('[label="Use as Billing Address"]').getAttribute('checked') == 'checked') {
				hdUnCheckBilling();
			}
			hdAddy();
			hdHintBoxMove.textContent = '\n ALT+X to open shipping info for first item. \n Use Dropship Helper to fill fields. \n Repeat for each address until this box changes. \n\n';
			multAmt = multAmt - 1;
		} else if (window.location.href.indexOf('/checkout') > -1 && multAmt == 1) {
			hdAddy();
			hdHintBoxMove.textContent = '\n Click the Use Card button in Dropship Helper to fill Payment Info. \n Afterwards, press ALT+X to complete order. \n\n';
			multAmt = multAmt - 1;
		} else if (window.location.href.indexOf('/checkout') > -1 && multAmt < 1) {
			hdFreeShippingRemains();
		} else if (window.location.href.indexOf('/thankyou') > -1) {
			hdGetOrderNumber();
		} else {
			errorMsg();
		}
	}
	autoHD();
	}
	
	
//  .dddddddhyo.   .hmmmmmmmmms.  ,+hmmmmmmhs. mmmmmmmmmmmmm
//  .mmmmyhdmmmmo  .hmmmmmmmmms. .dmmmmhyydms. mmmmmmmmmmmmm
//  .mmmm   mmmmo  .hmmm:        +mmmms`           mmmmm
//  .mmmmsshmmm:   .hmmmmmmmmm.  :mmmmmdhso:.      mmmmm
//  .mmmmdddmmmhs. .hmmmmmmmmm.   -ohddmmmmmdo.    mmmmm
//  .mmmm+ .ohmmmm .hmmm:               +mmmmm.    mmmmm
//  .mmmmo  ydmmmm .hmmmmmmmmms. .mmmmmmmdmmmd.    mmmmm
//  .mmmmmmmmmmmho .hmmmmmmmmms.  .mmmmmmmmmm.     mmmmm
//
//     hhhhhhhhhhh.  .mmmm.     .mmmm..hhhhy.   .shhhh.
//    .mmmmhyhmmmmo  .mmmm.     .mmmm. .dmmmd\ /dmmmd.
//    .mmmm   ymmmy  .mmmm.     .mmmm.  .smmmmhmmmmy.
//    .mmmmhshmmmh:  .mmmm.     .mmmm.   .dmmmmmmmd.
//    .mmmmdddmmmdh. .mmmm.     .mmmm.    *.dmmmm.*
//    .mmmm+  .ommmm .mmmm..   ..mmmm.     .hmmmd.
//    .mmmmo   ommmm .mmmmbo:.:odmmmm.     .hmmmd.
//    .mmmmmmmmmmmdo  .hmmmmmmmmmmmh.      .hmmmd.
//
//					Best Buy Codes


	if (window.location.href.indexOf('bestbuy.com') > -1) {
	
	function injectContains() {
		var gotContains = "function contains(selector,text){var elements=document.querySelectorAll(selector);return Array.prototype.filter.call(elements,function(element){return RegExp(text).test(element.textContent);});};";
		var containsTag = document.createElement("script");
		containsTag.innerHTML = gotContains;
		document.head.appendChild(containsTag);
	}
	
	function injectEmpty() {
		var gotEmpty = "function isEmpty(obj){for(var key in obj){if(obj.hasOwnProperty(key))return false;}return true;}";
		var emptyTag = document.createElement("script");
		emptyTag.innerHTML = gotEmpty;
		document.head.appendChild(emptyTag);
	}
	
	function determineItem() {
		chrome.runtime.sendMessage({
			determineItem: true,
		}, function(response) {
			if (response.numOfItems == 1) {
				if (window.location.href.indexOf(response.primaryItem) > -1) {
					buyPrimaryItem();
				}
			} else if (response.numOfItems > 1) {
				for (var i = 0; i < response.numOfItems; i++) {
					if (window.location.href.indexOf(response.primaryItem[i]) > -1) {
						itemNum = i;
						buyPrimaryItem();
					}
				}
			}	
		});
	}
	
	
	
	function checkForPrice(callback) {
		if (document.querySelector('span[aria-label*="Your price for this item"]') !== null) {
			salePrice = document.querySelector('span[aria-label*="Your price for this item"]').innerText.replace('$','');
			callback && callback();
		} else if (document.querySelector('span[aria-label*="Your price for this item"]') === null) {
			salePrice = document.getElementById('passedPrice').innerText;
			callback && callback();
		} else {
			console.log('Can\'t find the price. Trying again...');
			setTimeout(checkForPrice, 1000, callback);
		}
	}
	
	function buyPrimaryItem() {
		console.log('Sending message to buy primary item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addPrimaryItem: true,
			}, function(response) {
				if (window.location.href.indexOf('.p') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					if (response.isCorrectItem === true) {
						checkForPrice(function () {
							if (response.numOfItems == 1) {
								if (+salePrice == +response.priceOnWF || +salePrice < +response.priceOnWF) {
									console.log('Price on page matches Database');
									setTimeout(function() { document.getElementById('priceblock-wrapper').querySelector('[class="ficon-cart"]').parentElement.click(); }, 600);
									if (response.hasExtraItem == true) {
										//
									} else {
										setTimeout(function() { document.getElementById('priceblock-wrapper').querySelector('[class="ficon-cart"]').parentElement.click(); }, 600);
									}
								} else {
									alert('Database Price: ' + response.priceOnWF + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
								}
							} else if (response.numOfItems > 1) {
								if (+salePrice == +response.priceOnWF[itemNum] || +salePrice < +response.priceOnWF[itemNum]) {
									console.log('Price on page matches Database');
									setTimeout(function() { document.getElementById('priceblock-wrapper').querySelector('[class="ficon-cart"]').parentElement.click(); }, 600);
									if (response.hasExtraItem == true) {
										//
									} else {
										setTimeout(function() { document.getElementById('priceblock-wrapper').querySelector('[class="ficon-cart"]').parentElement.click(); }, 600);
									}
								} else {
									alert('Database Price: ' + response.priceOnWF[itemNum] + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
								}
							}
						});
					}
				}
			});
		}, 200);
	}
	
	/*
	function bbyAddCart() {
		if (document.getElementById('helperInfoHidden').innerText == "...") {
			console.log('Database checker not loaded yet, trying again before adding to cart');
			setTimeout(bbyAddCart, 500);
		} else {
			helperRows = document.getElementById('helperInfoHidden').querySelectorAll('tr');
			helperProductLinks = [];
			for (var i = 0; i < helperRows.length; i++) {
				helperProductLinks.push(helperRows[i].querySelectorAll('td')[8].innerText.trim());
			}
			for (var i = 0; i < helperProductLinks.length; i++) {
				if (window.location.href.indexOf(helperProductLinks[i]) > -1) {
					priceWeHave = helperRows[i].querySelectorAll('td')[4].innerText.trim();
					priceTheyHave = document.getElementById('passedPrice').innerHTML;
					
					if (+priceTheyHave > +priceWeHave) {
						alert('Database Price: ' + priceWeHave + '\nSupplier Price: ' + priceTheyHave + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
					} else {
						console.log('Price passed database check.\nDatabase Price: ' + priceWeHave + '\nSupplier Price: ' + priceTheyHave);
						setTimeout(function() { document.getElementById('priceblock-wrapper').querySelector('[class="ficon-cart"]').parentElement.click(); }, 600);
					}
				}
			}
		}
	}
	*/
	
	function bbyCompareCartToWebF() {
		chrome.runtime.sendMessage({
			addPrimaryItem: true,
		}, function(response) {
			if (window.location.href.indexOf('bestbuy.com/cart') > -1) {
				console.log('AutoDS: Response is:');
				console.log(response);
				if (response.numOfItems) {
					bbyProducts = document.querySelectorAll('[class="cart-item"]');
					bbyProductLinks = [];
					bbyProductNames = [];
					for (var i = 0; i < bbyProducts.length; i++) {
						bbyProductLinks.push(bbyProducts[i].querySelector('[class="cart-item__title"]').href.split("=").pop());
						bbyProductNames.push(bbyProducts[i].querySelector('[class="cart-item__title"]').innerText);
					}
					
					if (response.numOfItems > 1) {
						helperProductLinks = response.primaryItem;
						helperProductLinks.reverse();
					} else {
						helperProductLinks = [];
						helperProductLinks.push(response.primaryItem);
					}
					
					checkItemIdDifferences = difference(helperProductLinks, bbyProductLinks);
					
					if (isEmpty(checkItemIdDifferences) == true) {
						
						pricesTheyHave = [];
						for (var i = 0; i < bbyProducts.length; i++) {
							if (bbyProducts[i].querySelector('[class="priceblock"]').querySelector('[class="each-price"]') !== null) {
								pricesTheyHave.push(bbyProducts[i].querySelector('[class="priceblock"]').querySelector('[class="each-price"]').innerText.replace(/[^0-9.]/g, ""));
							} else {
								pricesTheyHave.push(bbyProducts[i].querySelector('[class="priceblock"]').querySelector('[class="priceblock__primary-price"]').innerText.replace(/[^0-9.]/g, ""));
							}
						}
						
						if (response.priceOnWF.constructor === Array) {
							pricesWeHave = response.priceOnWF;
							pricesWeHave.reverse();
						} else {
							pricesWeHave = [];
							pricesWeHave.push(response.priceOnWF);
						}
						
						checkItemPriceDifferences = difference(pricesTheyHave, pricesWeHave);
						if (isEmpty(checkItemPriceDifferences) == true) {
							console.log('Prices passed Database Checker');
							setTimeout(bbyBeginCheckout, 700);
						} else {
							bbyPassedDatabaseCheck = [];
							for (var i = 0; i < pricesWeHave.length; i++) {
								if (+pricesTheyHave[i] > +pricesWeHave[i]) {
									alert('Database Price: ' + pricesWeHave[i] + '\nSupplier Price: ' + pricesTheyHave[i] + '\n\nThe price of: ' + bbyProductNames[i] + '\n\nis higher than expected. Do not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
									bbyPassedDatabaseCheck.push('didNotPass');
								} else if (+pricesTheyHave[i] < +pricesWeHave[i]) {
									console.log('Database Price: ' + pricesWeHave[i] + '\nSupplier Price: ' + pricesTheyHave[i] + '\n\nPrice on Supplier is lower than Database');
									bbyPassedDatabaseCheck.push('didPass');
								}
							}
							if (bbyPassedDatabaseCheck.includes('didNotPass') == false) {
								setTimeout(bbyBeginCheckout, 700);
							}
						}
					} else {
						alert('AutoDS: Items do not appear to match those which should be bought.\nCompare Item IDs below to see if any are different.\n\nNOTE: Item IDs may be in a different order, do not compare symmetrically.\n\nHome Depot Item IDs: ' + bbyProductLinks.toString() + '\nDatabase Item IDs: ' + helperProductLinks.toString());
					}
				}
			}
		});
	}
	
	function bbySelectShipping() {
		var bbyNoPickup = contains('[class="availability__body"]','FREE Shipping');
		for (var i = 0; i < bbyNoPickup.length; i++) {
			bbyNoPickup[i].children[0].click();
		}
	}
	
	function bbyBeginCheckout() { 
	   for (var i = 0; i < document.querySelectorAll('[class="availability__entry availability--unselected"]').length; i++) {
			if (document.querySelectorAll('[class="availability__entry availability--unselected"]')[i].innerText.trim().indexOf("FREE") > -1) {
				document.querySelectorAll('[class="availability__entry availability--unselected"]')[i].querySelector('input').click();
			} else {
				if (i == document.querySelectorAll('[class="availability__entry availability--unselected"]').length-1) {
					document.querySelector('[data-track="Checkout - Top"]').click();
				}
			}
		}
	}
	
	function bbyGotoBilling() {
		document.querySelector('[class="button--continue"]').children[0].click();
		setTimeout(bbyWaitForPayment, 1000);
	}
	
	function bbyWaitForPayment() {
		function checkSpinner() {
			if (document.querySelector('[class="page-spinner page-spinner--in"]') !== null && window.location.href.indexOf('checkout/r/payment') == -1) {
			   window.setTimeout(checkSpinner, 100);
			} else if (window.location.href.indexOf('checkout/r/payment') > -1) {
				setTimeout(function () {
					if (document.querySelector('[data-track="Payment Method: Enter government purchase"]').innerText == "+ Use a Best Buy Tax Exempt Quick Card") {
						chrome.runtime.sendMessage({
							checkTaxFillOption: true,
						}, function(response) {
							if (response.fillTaxEnabled == true) {
								document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
								setTimeout(fillText('[id="tax-exempt-quick-check"]', '3010324630'), 300);
								document.querySelector('[data-track="Tax-Exempt Quick Card: Apply"]').click();
							} else if (response.fillTaxEnabled == false) {
								document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
								setTimeout(function() {
									document.querySelector('h3[class="tax-exempt-quick-card__title"]').innerText = "AutoDS: Tax ID fill has been disabled in Options.";
								}, 500);
								console.log('AutoDS: Tax ID filling is disabled in Options.');
							}
						});
					}
				}, 550);
			}
		}
		checkSpinner();
	}
	
	function bbyBillingAddy() {
		if (document.querySelector('[id=optAddy0]').value == "") {
			var bbyBilling = document.querySelector('[id=fnameFilled]').value 
			+ ' ' + document.querySelector('[id=lnameFilled]').value + '\r\n' 
			+ document.querySelector('[id=addyFilled0]').value + '\r\n' 
			+ document.querySelector('[id=citFilled]').value + ', ' 
			+ document.querySelector('[id=statFilled]').value + ' '
			+ document.querySelector('[id=zcodeFilled]').value + '\r\n' 
			+ document.querySelector('[id=foneFilled]').value + '\r\n' 
			+ document.querySelector('[id="user.emailAddress"]').value;
			bbyBilling = "...\r\n...\r\n" + bbyBilling;
			bbyBilling = JSON.stringify(bbyBilling);
		} else {
			var bbyBilling = document.querySelector('[id=fnameFilled]').value 
			+ ' ' + document.querySelector('[id=lnameFilled]').value + '\r\n' 
			+ document.querySelector('[id=addyFilled0]').value + '\r\n' 
			+ document.querySelector('[id=optAddy0]').value + '\r\n' 
			+ document.querySelector('[id=citFilled]').value + ', ' 
			+ document.querySelector('[id=statFilled]').value + ' '
			+ document.querySelector('[id=zcodeFilled]').value + '\r\n' 
			+ document.querySelector('[id=foneFilled]').value + '\r\n' 
			+ document.querySelector('[id="user.emailAddress"]').value;
			bbyBilling = "...\r\n...\r\n" + bbyBilling;
			bbyBilling = JSON.stringify(bbyBilling);
		}
		console.log(bbyBilling);
		chrome.runtime.sendMessage({
			sendBBY_Billing: true,
			bbyBilling: bbyBilling,
		}, function(response) {
			if (response.sentBillingInfo == true) {
				bbyGotoBilling();
			}
		});
		
	}	
	
	function bbyGetOrderNumber() {
		var bbyOrderIt = "ordNumTX=contains('span','BBYTX');var ordNum1=contains('script','var orderData')[0].innerText.search('\"customerOrderId\":\"');ordNum1=contains('script','var orderData')[0].innerText.substr(ordNum1+19,21);var ordNum2=ordNum1.search('\",\"');ordNum1=ordNum1.substr(0,ordNum2);if(isEmpty(ordNumTX)==false){ordNum1=ordNum1.replace('BBY01','BBYTX');}!function(a){var b=document.createElement('textarea'),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand('copy'),c.removeAllRanges(),document.body.removeChild(b)}(ordNum1);";
		var bbyOrderTag = document.createElement("script");
		bbyOrderTag.innerHTML = bbyOrderIt;
		document.head.appendChild(bbyOrderTag);
	}
	
	function bbyAddyExpand() {
		addyFields = document.querySelectorAll('[data-track="Billing: Add a new Address"]').length - 1
		for (var i = 0; i < addyFields; i++) {
			if (document.querySelectorAll('[data-track="Billing: Add a new Address"]') !== undefined) {
				document.querySelectorAll('[data-track="Billing: Add a new Address"]')[0].click();
				document.querySelectorAll('[data-track="Billing: Add a new Address"]')[i].click();
			}
		}
	}
	
	function scrollUp () {
		window.scrollTo(0, 0);
	}
	
	function autoBBY() {
		if (window.location.href.indexOf('.p') > -1) {
			determineItem();
		} else {
			if (window.location.href.indexOf('bestbuy.com/cart') > -1) {
				injectContains();
				setTimeout(bbyCompareCartToWebF, 400);
			} else {
				if (window.location.href.indexOf('bestbuy.com/identity/signin') > -1) {
					document.querySelector('[class="cia-guest-content__continue js-cia-submit-button"]').click();
				} else {
					if (window.location.href.indexOf('checkout/r/fulfillment') > -1) {
						if (document.querySelector('[class="streamlined__pickup-person"]') !== null) {
							document.querySelector('[class="streamlined__pickup-person"]').nextElementSibling.querySelector('a').click();
						} else {
							if (document.querySelector('[data-track="Ship to multiple addresses"]') !== null) {
								document.querySelector('[data-track="Ship to multiple addresses"]').click();
								setTimeout(bbyAddyExpand, 100);
								setTimeout(scrollUp, 500);
							} else {
								if (document.querySelector('[data-track="Billing: Add a new Address"]') !== null) {
									document.querySelector('[data-track="Billing: Add a new Address"]').click();
								} else {
									if (document.querySelector('[id="user.emailAddress"]').value !== "") {
										bbyBillingAddy();
									}
								}
							}
						}
					} else {
						if (window.location.href.indexOf('checkout/r/payment') > -1) {
							if (document.querySelector('[data-track="Payment Method: Enter government purchase"]').innerText == "+ Use a Best Buy Tax Exempt Quick Card") {
								submittedAddy = document.querySelector('[class="fulfillment-list-entry__address"]').innerText;
								submittedAddy = submittedAddy.substr(submittedAddy.indexOf('\n') + 1);
								submittedState = submittedAddy.split(' ').reverse()[1];

								taxID_OK = ["AK", "AR", "AZ", "CA", "CO", "CT", "FL", "GA", "HI", "IA", "ID", "IL", "KS", "KY", "MD", "ME", "MI", "MN", "MO", "NC", "ND", "NE", "NJ", "NM", "NV", "OH", "OK", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "WA", "WI"];
								taxID_notOK = ["AL", "IN", "LA", "MA", "MS", "NY", "VA", "WV", "WY"];
								taxID_NA = ["DE", "MT", "NH", "OR"];
								
								chrome.runtime.sendMessage({
									checkTaxFillOption: true,
								}, function(response) {
									if (response.fillTaxEnabled == true) {
										console.log('ok');
										console.log(submittedState);
										if (taxID_OK.indexOf(submittedState) >= 0) {
											document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
											setTimeout(fillText('[id="tax-exempt-quick-check"]', '3010324630'), 300);
											document.querySelector('[data-track="Tax-Exempt Quick Card: Apply"]').click();
										} else if (taxID_notOK.indexOf(submittedState) >= 0) {
											document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
											setTimeout(function() {
												document.querySelector('h3[class="tax-exempt-quick-card__title"]').innerText = "AutoDS: Tax ID Does Not Work For This State.";
												document.querySelector('h3[class="tax-exempt-quick-card__title"]').nextElementSibling.remove();
											}, 500);
											console.log('Tax ID cannot be applied for this state.');
										} else if (taxID_NA.indexOf(submittedState) >= 0) {
											document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
											setTimeout(function() {
												document.querySelector('h3[class="tax-exempt-quick-card__title"]').innerText = "AutoDS: State does not require Tax ID.";
												document.querySelector('h3[class="tax-exempt-quick-card__title"]').nextElementSibling.remove();
											}, 500);
											console.log('Tax ID cannot be applied for this state.');
										}
									} else if (response.fillTaxEnabled == false) {
										document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
										setTimeout(function() {
											document.querySelector('h3[class="tax-exempt-quick-card__title"]').innerText = "AutoDS: Tax ID fill has been disabled in Options.";
										}, 500);
										console.log('Tax ID filling is disabled in Options.');
									}
								});
							}
							if (document.querySelector('[class="tax-exempt-quick-card__applied"]') !== null) {
								if (document.querySelector('[class="gift-cards__text-success"]') !== null && document.querySelector('[class="tax-exempt-quick-card__applied"]').querySelector('strong').innerHTML == "Customer ID Applied") {
									document.querySelector('[data-track*="Place your Order"]').click();
								}
							}
							
							if (document.querySelector('[class="tax-exempt-quick-card__error"]') !== null) {
								if (document.querySelector('[class="gift-cards__text-success"]') !== null && document.querySelector('[class="tax-exempt-quick-card__error"]').innerText.substr(0,81) == "The Tax Exempt Card you entered is not valid for one or more items on this order.") {
									document.querySelector('[data-track*="Place your Order"]').click();
								}
							}
							
						} else {
							if (window.location.href.indexOf('checkout/r/thank-you') > -1) {
								injectContains();
								injectEmpty();
								bbyGetOrderNumber();
							}
						}
					}
				}
			}
		}
	}
	autoBBY();
	}
	
// ####                            #####                                                                                                                          
//  (##                             (###                                                                                                                          
//  (############  ########## ##### (#############  ######### ######   %%%%%,   %%%%%%%% #%%%%%%%        %%%%%,        #%    %%%%%%%% %%       %#       %%%%%     
//  (##    ### ##    ##  ###  ###   (###   ### ###   ###  ###  ###     %%   %%  %%       #%      %%      %%   %%      #%%%      %%    %%       %#      %%   %     
//  (##    ### ##    ##   ### ##    (###   ### ###   ###   ## ###      %%   %%  %%       #%       %%     %%   %%     %%  %%     %%    %%       %#      *%%%%*     
//  (########  ##########  #####    (######### ########### #####       %%%%%%(  %%%%%%%% #%        %     %%%%%%(    %%%%%%%%    %%    %%%%%%%%%%#     ,%%%%*      
//      ###     ###*        ###          ###     ###*       ###        %%    %% %%       #%       %%     %%    %%   %%    %%    %%    %%       %#    #%*   %% ,%  
//                     ######/                         ######/         %%    %% %%       #%      %%      %%     %  %%      #%   %%    %%       %#    %%     (%%   
//                                                                     %%%%%%%* %%%%%%%% #%%%%%%%        %%%%%%%* %%        #%  %%    %%       %#     %%%%%%% %%  
// ##############        ######     ###################### #########                                                                                              
//   #####   ######     ########      ####    ##### #####   #####                                                                                                 
//   *####    #####    ####  ###      ####    (####  ####   ####       %%%%%%%%%  %%%%%%%%% %%%%%   %%%%  %%%%%%%%%%%%   %%%%%%%    %%%%%% %%%%%%%%%%%%%%%%%%%   
//   *##########       ####  ####     ###########     #########        %%%%  %%%  %%%%        %%%% %%%% %%%%%%    %%%%%% %%%%%%%%%  %%%%%% %%%%%%%%     %%%%%%%%% 
//   *####  #######   ###########     #############     #####          %%%%%%%%%  %%%%%%%%     %%%%%%  %%%%%%      %%%%% %%%%%%%%%%%%%%%%% %%%%%%%%      %%%%%%%%%
//   *####     ####  #############    ####     #####    #####          %%%%  %%%% %%%%          %%%%%   %%%%%%%#%%%%%%%% %%%%%%  %%%%%%%%% %%%%%%%%##%%%%%%%%%%%% 
//   #####    ##### #####     #####   #####   #####     #####          %%%%%%%%%  %%%%%%%%%     %%%%%      %%%%%%%%%%    %%%%%%    %%%%%%% %%%%%%%%%%%%%%%%%#     
// ######################## ######################   ###########                                                                                                  
//
//			Buy Buy Baby / Bed Bath and Beyond Codes	
	
	if (window.location.href.indexOf('buybuybaby.com') > -1 || window.location.href.indexOf('bedbathandbeyond.com') > -1) {
		
	function bbbCart() {
		function checkForModal() {
			if (document.querySelector('span[class="modalHead"]') == null) {
				window.setTimeout(checkForModal, 100);
			} else {
				window.location.href = '/store/cart/cart.jsp';
			}
		}
		checkForModal();
	}
	
	function bbbFreeShip() {
		if (document.querySelector('[class="messageFreeShipping"]').innerText !== " Your order qualifies for free shipping!*") {
			alert('You do not have free shipping');
		} else {
			window.location.href = '/store/checkout/shipping/shipping.jsp?shippingGr=multi';
		}
	}
	
	function bbbOrderNum() {
		var hdOrderIt = "bbbNum=document.querySelector('[class=\"marBottom_5 lblOrderId\"]').nextElementSibling.innerText;!function(a){var b=document.createElement('textarea'),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand('copy'),c.removeAllRanges(),document.body.removeChild(b)}(bbbNum);";
		var hdOrderTag = document.createElement("script");
		hdOrderTag.innerHTML = hdOrderIt;
		document.head.appendChild(hdOrderTag);
	}
	
	function autoBBB() {
		if (window.location.href.indexOf('/store/product/') > -1) {
			document.querySelector('[name="btnAddToCart"]').click();
			setTimeout(bbbCart, 1234);
		} else {
			if (window.location.href.indexOf('/store/cart/cart.jsp') > -1) {
				bbbFreeShip();
			} else {
				if (window.location.href.indexOf('shipping.jsp?shippingGr=multi') > -1) {
					if (document.querySelector('[class="ui-selectmenu-status"]').innerText == "Select an address") {
						alert('Fill address(es) with Dropship Helper, then press ALT+X to continue to billing');
					} else {
						document.querySelector('[name="orderIncludesGifts"]').click();
						document.querySelector('[value="Continue to Billing"]').click();
					}
				} else {
					if (window.location.href.indexOf('checkout/gifting/gifting.jsp') > -1) {
						if (document.querySelector('[name^="shippingOption"]') !== null) {
							document.querySelector('[name^="shippingOption"]').click();
							document.querySelector('[name^="shippingGiftMessage"]').select();
							document.execCommand('insertText', false, '..........');
							document.querySelector('[name^="shippingOption"]').setAttribute('name','shipingOption');
							document.querySelector('[name^="shippingGiftMessage"]').setAttribute('name','shipingGiftMessage');
						} else {
							document.querySelector('[value="Continue to Billing"]').click();
						}
					} else {
						if (window.location.href.indexOf('/checkout/billing/billing.jsp') > -1) {
							if (document.querySelector('[name="basePhoneFull"]').value == '') {
								alert('Use Dropship Helper to fill billing email and phone number');
							} else {
								document.querySelector('[name="emailSignUp"]').click();
								document.querySelector('[value="Continue to Payment"]').click();
							}
						} else {
							if (window.location.href.indexOf('checkout/coupons/coupon.jsp') > -1) {
								document.querySelector('[value="Continue to Payment"]').click();
							} else {
								if (window.location.href.indexOf('checkout/payment/billing_payment.jsp') > -1) {
									if (document.querySelector('[name="payWith"]') !== null && document.querySelector('[name="payWith"]').parentElement.className !== 'checked') {
										document.querySelector('[name="payWith"]').click();
									}
									else if (document.querySelector('dd[class="grid_1 textRight"]').innerText !== "$0.00" && document.querySelector('[name="payWith"]').parentElement.className == 'checked') {
										alert('Use gift cards until amount is paid in full');
									} else {
										document.querySelector('[value="Preview Order"]').click();
									}
								} else {
									if (window.location.href.indexOf('checkout/preview/review_cart.jsp') > -1) {
										document.querySelector('[value="Place Order"]').click();
									} else {
										if (window.location.href.indexOf('checkout/checkout_confirmation.jsp') > -1) {
											bbbOrderNum();
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	autoBBB();
	}
	
	
//                         .---.                             
//                        .:::::.                             
//                        .:::::.                             
//                        `:::::.                             
//                         :::::`                             
//       `---.             :::::             .---`            
//      `::::::-.          -::::          `-::::::`           
//      `:::::::::-`       .:::.       `-:::::::::.           
//        `.-::::::::-`      `      `.::::::::-.`             
//            `.-::::::`            ::::::-.`                 
//                `.--`             `--.`                     
//                                                            
//                                                            
//                `.--`             `--.`                     
//            `.-::::::`            ::::::-.`                 
//        `.-::::::::-`      `      `.::::::::-.`             
//      `:::::::::-`       .:::.       `-:::::::::.           
//      `::::::-.          -::::          `-::::::`           
//       `---.             :::::             .---`            
//                         :::::`                             
//                        `:::::.                             
//                        .:::::.                             
//                        .:::::-                             
//                         .---.`                     
//
//				    	Walmart Codes
	
	if (window.location.href.indexOf('walmart.com') > -1) {
		
		
	// REGISTRY STUFF
	
	if (window.location.href.indexOf('create-events-registry') > -1 && window.location.href.indexOf('account/signup') > -1) {
		document.querySelector('[data-automation-id="signup-submit-btn"]').click();
	} else if (window.location.href.indexOf('/lists/create-events-registry') > -1) {
		if (document.querySelector('[data-tl-id="COAC2ShpAddrUseThisAddrBtn"]') !== null) {
			document.querySelector('[data-tl-id="COAC2ShpAddrUseThisAddrBtn"]').click();
		} else if (document.querySelector('[class="button-save-address btn-block-max-m btn"') !== null) {
			document.querySelector('[class="button-save-address btn-block-max-m btn"').click();
		} else if (document.querySelector('[data-tl-id="COAC2ShpAddrUseThisAddrBtn"]') === null || document.querySelector('[class="button-save-address btn-block-max-m btn"') === null) {
			document.querySelector('[class="btn btn-block-max-m"]').click();
		}
	} else if (window.location.href.indexOf('/lists/manage-events-registry-items') > -1) {
		document.querySelector('[data-tl-id="cta_add_to_cart_button"]').click();
		setTimeout(checkoutFromRegistry, 750);
	}
	
	function checkoutFromRegistry() {
		if (document.querySelector('[class="flyout-modal flyout-basic flyout-modal-wide"]') === null) {
			console.log('Waiting until item is added to cart...');
			setTimeout(checkoutFromRegistry, 1000);
		} else {
			setTimeout(function() { 
				window.location.href = 'https://walmart.com/checkout';
			}, 600);
		}
	}
	

	// Keep checking for the price until it exists. This is kept as a separate function
	// in order to utilize a callback for buyPrimaryItem without executing that entire
	// function recursively when only this part is needed.
	function checkForPrice(callback) {
		if (document.querySelectorAll('[class="Price-characteristic"][itemprop="price"]')[0] !== undefined) {
			salePrice = document.querySelectorAll('[class="Price-characteristic"][itemprop="price"]')[0].parentElement.innerText;
			callback && callback();
		} else if (document.querySelector('[class="prod-PriceHero"]') !== null) {
			salePrice = document.querySelector('[class="prod-PriceHero"]').innerText.substr(1,8);
			callback && callback();
		} else {
			console.log('Can\'t find the price. Trying again...');
			setTimeout(checkForPrice, 1000, callback);
		}
	}

	// Check for popup modal that appears after adding an item to the cart. After it
	// loads, it will check to see if the order so far is eligible for free shipping.
	function checkForModalWM(checkExtra) {
		if (document.querySelector('[class="modal-content"]') === null) {
			window.setTimeout(checkForModalWM, 100);
		} else {
			if (document.querySelector('[class="shipping-threshold-bar-messages threshold-full"]') === null) {
				// do nothing
			} else {
				window.location.href = 'https://www.walmart.com/checkout/';
			}
		}
	}

	// Click the Add To Cart button
	function clickAddToCart() {
		if (isEmpty(contains('button','Add to Cart'))) {
			console.log('Can\'t find Add to Cart button. Trying again...');
			setTimeout(clickAddToCart, 100);
		} else {
			setTimeout(function () { contains('button','Add to Cart')[0].click(); }, 150);
		}
	}
	
	function clickAddToRegistry() {
		if (document.querySelector('[class="AddToRegistry-text xs-margin-left valign-top"]') === null) {
			console.log('Can\'t find Add to Registry button. Trying again...');
			setTimeout(clickAddToRegistry, 100);
		} else {
			setTimeout(function() { 
				document.querySelector('[class="AddToRegistry-text xs-margin-left valign-top"]').click();
				setTimeout(waitForRegistryPopup, 1000);
			}, 600);
		}
	}
	
	function waitForRegistryPopup() {
		if (document.querySelector('[class="Registry-btn-row"]') === null) {
			console.log('Can\'t find Registry Popup. Trying again...');
			setTimeout(waitForRegistryPopup, 100);
		} else {
			setTimeout(function() { 
				document.querySelector('[class="Registry-btn-row"]').children[0].click();
			}, 600);
		}
	}
	
	function determineItem() {
		chrome.runtime.sendMessage({
			determineItem: true,
		}, function(response) {
			if (response.numOfItems == 1) {
				if (window.location.href.indexOf(response.primaryItem || document.querySelectorAll('[productid]')[0].getAttribute('productid') == response.primaryItem) > -1) {
					buyPrimaryItem();
				} else if (window.location.href.indexOf(response.extraItem) > -1) {
					buyExtraItem();
				}
			} else if (response.numOfItems > 1) {
				for (var i = 0; i < response.numOfItems; i++) {
					if (window.location.href.indexOf(response.primaryItem[i] || document.querySelectorAll('[productid]')[0].getAttribute('productid') == response.primaryItem[i]) > -1) {
						buyPrimaryItem();
					} else if (window.location.href.indexOf(response.extraItem) > -1) {
						buyExtraItem();
					}
				}
			}	
		});
	}

	// Buy the main item needed for the order. 
	// Includes functions: checkForPrice, clickAddToCart, checkForModalWM
	// Sends messages: addPrimaryItem, openExtraItem (if one is supplied).
	function buyPrimaryItem() {
		console.log('Sending message to buy primary item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addPrimaryItem: true,
			}, function(response) {
				if (window.location.href.indexOf('walmart.com/ip/') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					if (response.isCorrectItem === true) {
						checkForPrice(function () {
							if (salePrice == response.priceOnWF) {
								console.log('Price on page matches Database');
								clickAddToRegistry();
								setTimeout(function() { waitForRegistryPopup }, 1000);
								if (response.hasExtraItem == true) {
									setTimeout(function() { waitForRegistryPopup }, 1000);
								} else {
									setTimeout(function() { waitForRegistryPopup }, 1000);
								}
							} else {
								alert('Database Price: ' + response.priceOnWF + '\nSupplier Price: ' + salePrice + '\n\nThe price of this item is higher than expected.\nDo not buy this item. Please flag the order to Negative Profit and Slack the manager on duty');
							}
						});
					}
				}
			});
		}, 200);
	}

	// Buy the secondary item that is to be canceled in order to obtain free shipping. 
	// Includes functions: clickAddToCart, checkForModalWM
	// Sends messages: addExtraItem
	function buyExtraItem() {
		console.log('Sending message to buy extra item.');
		setTimeout(function () {
			chrome.runtime.sendMessage({
				addExtraItem: true,
			}, function(response) {
				if (window.location.href.indexOf('walmart.com/ip/') > -1) {
					console.log('AutoDS: Response is:');
					console.log(response);
					
					if (response.isCorrectItem === true) {
						console.log('AutoDS: This is the correct freeship item.');
						clickAddToCart();
						setTimeout(checkForModalWM, 1000);
					} else {
						alert('AutoDS: This does not appear to be the correct freeship item. If you believe you received this message in error, please post in #bug_reporting on Slack');
					}
				}
			});
		}, 200);
	}
	
	function wmOrderNum() {
		capturedOrdNum = document.querySelector('[class="thankyou-main-heading"]').innerText.split('#')[1];
		var hdOrderIt = "wmNum=document.querySelector('[data-automation-id=\"thank-you-heading-main\"]').innerText.substr(27,500);!function(a){var b=document.createElement('textarea'),c=document.getSelection();b.textContent=a,document.body.appendChild(b),c.removeAllRanges(),b.select(),document.execCommand('copy'),c.removeAllRanges(),document.body.removeChild(b)}(wmNum);";
		var hdOrderTag = document.createElement("script");
		hdOrderTag.innerHTML = hdOrderIt;
		document.head.appendChild(hdOrderTag);
		setTimeout(takeMeToCancelItems(capturedOrdNum), 500);
		chrome.runtime.sendMessage({
			createAccount: true,
		}, function(response) {
			if (response.doAccountCreation == true) {
				hasExtraItem = response.hasExtraItem;
				if (typeof triedAcctCreate == "undefined") {
					doAccountCreation();
					triedAcctCreate = true;
				} else {
					console.log("AutoDS: Already attempted account creation. Not trying again in an effort to prevent \"Account not created\" bug.");
				}
			}
		});
	}
	
	// Perform account creation and move to item cancellation page if necessary.
	// Includes functions: takeMeToCancelItems, endTheOrder (if there is no freeship item)
	function doAccountCreation() {
		if (document.querySelector('[data-tl-id="Guest_signup_btn"]') === null) {
			setTimeout(doAccountCreation, 100);
		} else {
			setTimeout(function () {
				fillText('[autocomplete="new-password"]', 'forte1');
				contains('span', 'Set Password')[0].click();
				if (hasExtraItem == true) {
					setTimeout(takeMeToCancelItems, 500);
				}
			}, 100);
		}
	}

	// Go to item cancellation page in the event of a freeship item being on the order.
	function takeMeToCancelItems(ordnum) {
		if (document.querySelector('[class="thankyou-main-heading"]') === null) {
			setTimeout(takeMeToCancelItems, 100);
		} else {
			setTimeout(function () {
				window.location.href = "https://www.walmart.com/account/order/" + ordnum + "/cancel"
			}, 900);
		}
	}

	// Cancel the freeship item.
	// Sends message: cancelExtraItem
	function cancelFreeship() {
		if (document.querySelector('[href*="/ip/"') === null) {
			setTimeout(cancelFreeship, 100);
		} else {
			setTimeout(function () {
				chrome.runtime.sendMessage({
					cancelExtraItem: true,
				}, function(response) {
					if (response.confirmCancelExtra == true) {
						document.querySelector('[href*="' + response.extraItem + '"').parentElement.parentElement.querySelector('input[type="checkbox"]').click();
						setTimeout(function () { document.querySelector('[data-automation-id="request-cancel-form-submit"]').click(); }, 666);
					}
				});
			}, 500);
		}
	}
	
	function enterShipping() {
		function checkForShippingWM() {
			if (document.querySelector('[data-automation-id="shipping-heading"]').innerText == "Enter shipping address\n") {
				window.setTimeout(checkForShippingWM, 100);
			} else {
				if (document.querySelector('[data-automation-id="shipping-heading"]').innerText !== "Confirm shipping address\n") {
					console.log(null);
				} else {
					document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
				}
			}
		}
		checkForShippingWM();
	}
	
	function msgCustomerInfo() {
		console.log('AutoDS: Fetching Customer Info.');
		chrome.runtime.sendMessage({
			fillCustomerInfo: true,
		}, function(response) {
			console.log('AutoDS: Customer Info Received. Applying...');
			addCustomerInfo(response.customerInfo);
		});
	}
	
	function addCustomerInfo(customerInfo) {
		// Take Customer Info from parameter "customerInfo" passed from background.js...
		if (typeof customerInfoSplit == "undefined") {
			// ...and split it into an array.
			customerInfoSplit = customerInfo.split('|');
		}
		if (document.querySelector('[id="firstName"]') === null) {
			setTimeout(addCustomerInfo, 200);
		} else {
			setTimeout(function () {
				// If no address has been entered on account previously OR if using Guest Checkout
				if (document.querySelector('[id="firstName"]').value == "") {
					console.log('Obtained customer info');
					
					// fillText on all required fields
					fillText('[id="firstName"]', customerInfoSplit[2]);
					fillText('[id="lastName"]', customerInfoSplit[3]);
					fillText('[id="addressLineOne"]', customerInfoSplit[4]);
					fillText('[id="addressLineTwo"]', customerInfoSplit[5]);
					fillText('[id="city"]', customerInfoSplit[6]);
					fillText('[id="postalCode"]', customerInfoSplit[7].substring(0,5));
					customerInfoSplit[8] = customerInfoSplit[8].replace(/[^0-9.]/g, "");
					if (customerInfoSplit[8].substr(0,1) == "1" && customerInfoSplit[8].substr(0,3) !== "111") {
						customerInfoSplit[8] = customerInfoSplit[8].substr(1,10);
					} else if (customerInfoSplit[8].substr(0,1) == "1" && customerInfoSplit[8].substr(0,3) == "111") {
						rngAC = Math.floor((Math.random()*30)+1);
						rngPre = Math.floor((Math.random()*30)+1);
						rngLine = Math.floor((Math.random()*30)+1);

						if(rngAC==1){rngAreaCode=214;}else if(rngAC==2){rngAreaCode=585;}else if(rngAC==3){rngAreaCode=417;}else if(rngAC==4){rngAreaCode=337;}else if(rngAC==5){rngAreaCode=269;}else if(rngAC==6){rngAreaCode=430;}else if(rngAC==7){rngAreaCode=405;}else if(rngAC==8){rngAreaCode=316;}else if(rngAC==9){rngAreaCode=541;}else if(rngAC==10){rngAreaCode=202;}else if(rngAC==11){rngAreaCode=401;}else if(rngAC==12){rngAreaCode=386;}else if(rngAC==13){rngAreaCode=406;}else if(rngAC==14){rngAreaCode=530;}else if(rngAC==15){rngAreaCode=320;}else if(rngAC==16){rngAreaCode=480;}else if(rngAC==17){rngAreaCode=605;}else if(rngAC==18){rngAreaCode=508;}else if(rngAC==19){rngAreaCode=423;}else if(rngAC==20){rngAreaCode=316;}else if(rngAC==21){rngAreaCode=343;}else if(rngAC==22){rngAreaCode=254;}else if(rngAC==23){rngAreaCode=304;}else if(rngAC==24){rngAreaCode=415;}else if(rngAC==25){rngAreaCode=401;}else if(rngAC==26){rngAreaCode=331;}else if(rngAC==27){rngAreaCode=616;}else if(rngAC==28){rngAreaCode=252;}else if(rngAC==29){rngAreaCode=314;}else if(rngAC==30){rngAreaCode=608;}
						if(rngPre==1){rngPrefix=935;}else if(rngPre==2){rngPrefix=332;}else if(rngPre==3){rngPrefix=621;}else if(rngPre==4){rngPrefix=480;}else if(rngPre==5){rngPrefix=699;}else if(rngPre==6){rngPrefix=993;}else if(rngPre==7){rngPrefix=301;}else if(rngPre==8){rngPrefix=880;}else if(rngPre==9){rngPrefix=248;}else if(rngPre==10){rngPrefix=898;}else if(rngPre==11){rngPrefix=479;}else if(rngPre==12){rngPrefix=447;}else if(rngPre==13){rngPrefix=310;}else if(rngPre==14){rngPrefix=253;}else if(rngPre==15){rngPrefix=583;}else if(rngPre==16){rngPrefix=551;}else if(rngPre==17){rngPrefix=794;}else if(rngPre==18){rngPrefix=904;}else if(rngPre==19){rngPrefix=584;}else if(rngPre==20){rngPrefix=444;}else if(rngPre==21){rngPrefix=361;}else if(rngPre==22){rngPrefix=522;}else if(rngPre==23){rngPrefix=808;}else if(rngPre==24){rngPrefix=384;}else if(rngPre==25){rngPrefix=846;}else if(rngPre==26){rngPrefix=425;}else if(rngPre==27){rngPrefix=291;}else if(rngPre==28){rngPrefix=712;}else if(rngPre==29){rngPrefix=951;}else if(rngPre==30){rngPrefix=277;}
						if(rngLine==1){rngLineCode=8679;}else if(rngLine==2){rngLineCode=3062;}else if(rngLine==3){rngLineCode=2952;}else if(rngLine==4){rngLineCode=1767;}else if(rngLine==5){rngLineCode=4923;}else if(rngLine==6){rngLineCode=5610;}else if(rngLine==7){rngLineCode=5211;}else if(rngLine==8){rngLineCode=7289;}else if(rngLine==9){rngLineCode=9687;}else if(rngLine==10){rngLineCode=5167;}else if(rngLine==11){rngLineCode=3910;}else if(rngLine==12){rngLineCode=4307;}else if(rngLine==13){rngLineCode=6071;}else if(rngLine==14){rngLineCode=6083;}else if(rngLine==15){rngLineCode=8925;}else if(rngLine==16){rngLineCode=4152;}else if(rngLine==17){rngLineCode=3197;}else if(rngLine==18){rngLineCode=2671;}else if(rngLine==19){rngLineCode=9192;}else if(rngLine==20){rngLineCode=6723;}else if(rngLine==21){rngLineCode=7724;}else if(rngLine==22){rngLineCode=7748;}else if(rngLine==23){rngLineCode=4785;}else if(rngLine==24){rngLineCode=8688;}else if(rngLine==25){rngLineCode=5101;}else if(rngLine==26){rngLineCode=7948;}else if(rngLine==27){rngLineCode=7275;}else if(rngLine==28){rngLineCode=2659;}else if(rngLine==29){rngLineCode=7906;}else if(rngLine==30){rngLineCode=5965;}

						customerInfoSplit[8] = rngAreaCode.toString()+rngPrefix.toString()+rngLineCode.toString();
					}
					if (customerInfoSplit[8].length !== 10) {
						if (customerInfoSplit[8].length < 10) {
							missingDigitsAmt = 10 - customerInfoSplit[8].length;
							customerInfoSplit[8] = customerInfoSplit[8] + "0".repeat(missingDigitsAmt);
						} else if (customerInfoSplit[8].length > 10) {
							customerInfoSplit[8] = customerInfoSplit[8].substr(0,10);
						}
					}
					fillText('[id="phone"]', customerInfoSplit[8]);
					if (document.querySelector('[id="email"]') !== null) {
						fillText('[id="email"]', customerInfoSplit[11]);
					}
					
					// Select the correct state
					var e = new Event("Event");
					e.initEvent("input", true, true);
					el = document.querySelector('select[data-tl-id=COAC2ShpAddrState]');
					if (el === null) {
						el = document.querySelector('select[tealeafid=COAC2ShpAddrState]');
					}
					el.value = customerInfoSplit[9];
					el.dispatchEvent(e);
					
					setTimeout(function() {
						document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
						// "We've updated your state from __ to __" ... so we gotta click this again.
						setTimeout(function() {
							if (document.querySelector('[alerttype="error"]') !== null && document.querySelector('[alerttype="error"]').innerText.indexOf('Please select a new option') > -1) {
								document.querySelector('[data-automation-id="fulfillment-continue"]').click();
							} else {
								document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
							}
						}, 1000);
					}, 500);
				} else {
					document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
					// "We've updated your state from __ to __" ... so we gotta click this again.
					setTimeout(function() {
						if (document.querySelector('[alerttype="error"]') !== null && document.querySelector('[alerttype="error"]').innerText.indexOf('Please select a new option') > -1) {
							document.querySelector('[data-automation-id="fulfillment-continue"]').click();
						} else {
							document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
						}
					}, 1000);
				}
			}, 400);
		}
	}
	
	function autoWM() {
		if (window.location.href.indexOf('/ip/') > -1) {
			determineItem();
		} else {
			if (window.location.href.indexOf('/cart') > -1) {
				if (document.querySelector('[class="congrats-message"]') !== null) {
					document.querySelector('[data-tl-id="CartCheckOutBtnBottom"]').click();
				}
			} else {
				if (window.location.href.indexOf('/account/login') > -1) {
					document.querySelector('[data-automation-id="signin-submit-btn"]').click();
				} else {
					if (window.location.href.indexOf('sign-in') > -1) {
						// document.querySelector('[data-automation-id="signin-submit-btn"]').click();
						document.querySelector('[arialabel="Continue to checkout without an account."]').click();
					} else {
						if (window.location.href.indexOf('fulfillment') > -1) {
							document.querySelector('[data-automation-id="fulfillment-continue"]').click();
						} else {
							if (window.location.href.indexOf('shipping-address') > -1 && document.querySelector('[data-automation-id="address-form-submit"]') == null && document.querySelector('[data-automation-id="shipping-heading"]').innerText == "Confirm shipping address\n") {
								if (document.querySelector('[aria-label="Edit Shipping Address"]') !== null) {
									document.querySelector('[aria-label="Edit Shipping Address"]').click();
								} else {
									if (document.querySelector('[tealeafid="COAC2ShpSelAddrEditBtn"]') !== null) {
										document.querySelector('[tealeafid="COAC2ShpSelAddrEditBtn"]').click();
									} else {
										document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
									}
								}
							} else {
								if (window.location.href.indexOf('shipping-address') > -1 && document.querySelector('[data-automation-id="address-form-submit"]') !== null) {
									document.querySelector('[data-automation-id="address-form-submit"]').click();
									document.querySelector('[data-automation-id="shipping-heading"]').innerText = "Confirm shipping address";
								} else {
									if (window.location.href.indexOf('shipping-address') > -1 && document.querySelector('[data-automation-id="shipping-heading"]').innerText == "Confirm shipping address") {
										document.querySelector('[data-tl-id="COAC2ShpContBtn"]').click();
									} else {
										if (window.location.href.indexOf('shipping-address') > -1 && document.querySelector('[data-automation-id="shipping-heading"]').innerText == "Enter shipping address\n") {
											msgCustomerInfo();
											enterShipping();
										} else {
											if (window.location.href.indexOf('payment') > -1 && document.querySelector('[class="payment-type-selector-option"][data-tl-id="COAC3PayMoreBtn"]') !== null) {
												document.querySelector('[class="payment-type-selector-option"][data-tl-id="COAC3PayMoreBtn"]').click();
											} else if (window.location.href.indexOf('payment') > -1 && document.querySelector('[class="other-payment-methods-expander-copy"]') !== null) {
												document.querySelector('[class="other-payment-methods-expander-copy"]').click();
											} else {
												if (window.location.href.indexOf('payment') > -1 && document.querySelector('form[id="cash-modal-form"]') == null) {
													document.querySelector('[data-tl-id="COAC3PayCashBtn"]').click();
												} else {
													if (window.location.href.indexOf('payment') > -1 && document.querySelector('form[id="cash-modal-form"]') !== null) {
														document.querySelector('[data-automation-id="review-your-order-cash"]').click();
													} else {
														if (window.location.href.indexOf('review') > -1) {
															document.querySelector('[data-tl-id="COPlaceOrderBtn"]').click();
														} else {
															if (window.location.href.indexOf('/thankyou') > -1) {
																wmOrderNum();
															} else {
																if (window.location.href.indexOf('/cancel') > -1) {
																	cancelFreeship();
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	if (window.location.href.indexOf('create-events-registry') > -1 == false) {
		autoWM();
	}
	}
	
	if (window.location.href.indexOf('kohls.com') > -1) {
		
	function kohlsCart() {
		function checkForModal() {
			if (document.querySelector('[class="mini-cart-header loaded loadedNewPB"]') == null) {
				window.setTimeout(checkForModal, 100);
			} else {
				document.getElementById('checkout-container').click();
			}
		}
		checkForModal();
	}
	
	function kohlsFillGiftText() {
		function checkForTextarea() {
			if (document.querySelector('[id="message_txt"]') == null) {
				window.setTimeout(checkForTextarea, 100)
			} else {
				setTimeout(function() {
					if (document.querySelector('[id="message_txt"]') !== null) {
						setTimeout(function() { fillText('[id="message_txt"]', '.............'); }, 800);
						setTimeout(function() {
							document.querySelector('[class="button_continueToPayment_gift  boss_button_continueToPayment "]').dispatchEvent(new Event('blur'));
							document.querySelector('[value="Continue to Payment"]').click();
						}, 950);
					} else {
						setTimeout(function() { fillText('[id="dynamic_message_txt10"]', '.............'); }, 800);
						setTimeout(function() {
							document.querySelector('[class="button_continueToPayment_gift  boss_button_continueToPayment "]').dispatchEvent(new Event('blur'));
							document.querySelector('[class="button_continueToPayment_gift  boss_button_continueToPayment "]').click();
						}, 1250);
					}
				}, 1000);
			}
		}
		checkForTextarea();
	}
	
	function kohlsFreeShip() {
		if (document.querySelector('[class="free_ship"]').innerText !== "FREE") {
			alert('AutoDS: You do not have free shipping.');
		} else {
			document.getElementById('button_checkout_sb_top').click();
		}
	}
	
	function kohlsOrderNum() {
		var hdOrderIt = "kohlsNum=document.querySelector(\'[id=\"orderConfirm\"]\').getElementsByTagName(\"h1\")[0].innerText.replace(\/[^0-9.]\/g,\"\");!function(e){var d=document.createElement(\"textarea\"),f=document.getSelection();d.textContent=e,document.body.appendChild(d),f.removeAllRanges(),d.select(),document.execCommand(\"copy\"),f.removeAllRanges(),document.body.removeChild(d)}(kohlsNum);";
		var hdOrderTag = document.createElement("script");
		hdOrderTag.innerHTML = hdOrderIt;
		document.head.appendChild(hdOrderTag);
	}
	
	function autoKohls() {
		if (window.location.href.indexOf('/product/') > -1) {
			document.getElementById('addtobagID').click();
			setTimeout(kohlsCart, 1234);
		} else if (window.location.href.indexOf('/myaccount/') > -1) {
			document.getElementById('LPGuestCheckout').click();
		} else if (window.location.href.indexOf('/checkout/shopping_cart.jsp') > -1) {
			kohlsFreeShip();
		} else if (window.location.href.indexOf('checkout/v2/checkout.jsp') > -1) {
			if (document.getElementById('shipping_link').className == "selected opened") {
				document.querySelector('[class="view_gift_options_label n_bold tr_chkbox"]').click();
				setTimeout(function () { document.querySelector('[value="Continue to Gift Options"]').click(); }, 500);
			} else if (document.getElementById('giftOptions_link').className == "selected opened") {
				document.querySelector('[type="checkbox"][id*="gift_"][name*="isItemGift"]').click();
				kohlsFillGiftText();
			} else if (document.getElementById('payment_link').className == "selected opened") {
				rngKohls = Math.floor((Math.random()*9999)+1);
				fillText('[id="payment_information"]', '07798438' + rngKohls);
				setTimeout(function() { document.querySelector('[class="keyPlaceOrder"]').click(); }, 500);
			} else if (document.getElementById('review_link').className.indexOf("selected opened") > -1) {
				if (document.querySelector('[class="paymentMothodContainer"]').children[0].children.length == 1) {
					document.getElementById('payment_link').click();
				} else {
					document.querySelector('input[value="place order"]').click();
				}
			} else if (window.location.href.indexOf('checkout/v2/order_confirm.jsp') > -1) {
				kohlsOrderNum();
			}
		}
	}
	autoKohls();
	}
	
})();