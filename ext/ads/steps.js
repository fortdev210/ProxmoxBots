if (window.location.href == "http://admin.stlpro.com/products/getdsorders/") {
	function checkDropshipHelper(callback) {
		if (document.querySelector('[id="chrome-ext"]') !== null) {
			console.log("Get Order Page is formatted");
			callback && callback();
		} else {
			setTimeout(checkDropshipHelper, 1000, callback);
		}
	}
	
	checkDropshipHelper(function() {
		isGetOrders = true;
		if (document.getElementsByClassName("info")[0].innerText == "All Order Items are updated successfully") {
			chrome.runtime.sendMessage({
				newOrderStarted: false,
				getCustomerInfo: false,
				isGetOrders: isGetOrders,
			});
		} else {
			chrome.runtime.sendMessage({
				newOrderStarted: true,
				getCustomerInfo: true,
				isGetOrders: isGetOrders,
			}, function(response) {
				resp = response;
				console.log(resp);
				if (response.obtainedInfo == true) {
					document.querySelector('[class="info"]').outerHTML = document.querySelector('[class="info"]').outerHTML + '<li id="autods_alert" class="info"><b>AutoDS: Obtained customer info. Use ALT+X during checkout to fill customer info (WALMART ONLY).</b></li>'
				}
			});
		}
		
		if (document.querySelector('[class="info"]') !== null) {
			var ths = document.getElementsByTagName('th');
			var trs = document.getElementsByTagName('tr');
			qtyColumn = [];
			supplierPriceCol = [];
			itemNumCol = [];
			extraItemCol = [];
			orderStatusColumn = [];
			supplierColumn = [];
			
			// Identify Quantity
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('QTY') !== -1) {
					var qtyId = i;
					break;
				}
			}
			for (var i = 0; i < trs.length; i++) {
				qtyColumn.push(trs[i].children[qtyId]);
			}
			
			// Identify Price on Database
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('Supplier Price') !== -1) {
					var supPriceId = i;
					break;
				}
			}
			for (var i = 0; i < trs.length; i++) {
				supplierPriceCol.push(trs[i].children[supPriceId]);
			}
			
			// Identify Item Number
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('Item #') !== -1) {
					var icId = i;
					break;
				}
			}
			for (var i = 0; i < trs.length; i++) {
				itemNumCol.push(trs[i].children[icId]);
			}
			
			// Identify Extra Item Number
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('Extra Item') !== -1) {
					var extraItemId = i;
					break;
				}
			}
			for (var i = 0; i < trs.length; i++) {
				extraItemCol.push(trs[i].children[extraItemId]);
			}
			
			// Identify Order Status
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('Order Status') !== -1) {
					var oscId = i;
					break;
				}
			}
			for (var i = 0; i < trs.length; i++) {
				orderStatusColumn.push(trs[i].children[oscId]);
			}
			
			// Identify Supplier
			for (var i = 0; i < ths.length; i++) {
				if (ths[i].innerHTML.indexOf('Supplier') !== -1) {
					if (ths[i].innerHTML == "Supplier Price") {
						// do nothing
					} else {
						var scId = i;
						break;
					}
				}
			}
			for (var i = 0; i < trs.length; i++) {
				supplierColumn.push(trs[i].children[scId]);
			}
			
			// Store needed information into variables
			numOfItems = document.querySelectorAll('tbody')[1].querySelectorAll('tr').length;
			
			if (numOfItems == 1) {
				primaryItem = itemNumCol[itemNumCol.length-1].innerText;
				extraItem = extraItemCol[extraItemCol.length-1].innerText;
				qtyToBuy = qtyColumn[qtyColumn.length-1].innerText;
				priceOnWF = supplierPriceCol[supplierPriceCol.length-1].innerText;
				wfOrderStatus = orderStatusColumn[orderStatusColumn.length-1].innerText;
				supplierOfProduct = supplierColumn[supplierColumn.length-1].innerText;
			} else if (numOfItems > 1) {
				primaryItem = [];
				extraItem = extraItemCol[extraItemCol.length-1].innerText;
				qtyToBuy = [];
				priceOnWF = [];
				wfOrderStatus = orderStatusColumn[orderStatusColumn.length-1].innerText;
				supplierOfProduct = supplierColumn[supplierColumn.length-1].innerText;
				for (var i = 0; i < trs.length; i++) {
					if (itemNumCol[i] !== undefined && itemNumCol[i].innerText.indexOf('Open') == -1 && itemNumCol[i].tagName == "TD") {
						primaryItem.push(itemNumCol[i].innerText);
					}
					if (qtyColumn[i] !== undefined && qtyColumn[i].textContent !== '' && qtyColumn[i].tagName == "TD") {
						qtyToBuy.push(qtyColumn[i].innerText);
					}
					if (supplierPriceCol[i] !== undefined && supplierPriceCol[i].textContent !== '' && supplierPriceCol[i].tagName == "TD") {
						priceOnWF.push(supplierPriceCol[i].innerText);
					}
				}
				extraItem = extraItemCol[extraItemCol.length-1].innerText;
			}

			// Decisions, decisions...
			if (wfOrderStatus == "New Order") {
				if (extraItem == "") {
					extraItemStatus = false;
				} else {
					extraItemStatus = true;
				}
				setTimeout(function() {
					chrome.runtime.sendMessage({
						harborData: true,
						qtyToBuy: qtyToBuy,
						priceOnWF: priceOnWF,
						primaryItem: primaryItem,
						extraItem: extraItem,
						hasExtraItem: extraItemStatus,
						numOfItems: numOfItems,
					});
				}, 3000);
			}
		}
	});
}

if (window.location.href.indexOf('https://secure2.homedepot.com/mycheckout/checkout#/checkout') > -1) {
	
	function sleep(milliseconds) {
	  var start = new Date().getTime();
	  for (var i = 0; i < 1e7; i++) {
		if ((new Date().getTime() - start) > milliseconds){
		  break;
		}
	  }
	}

	function hdHint() {
		
		var hdHintBox = document.createElement('div');
		hdHintBox.setAttribute('style', 'white-space: pre;');
		hdHintBox.style.position = 'fixed';
		hdHintBox.style.top = 0;
		hdHintBox.style.left = '25%';
		hdHintBox.style.zIndex = 2147483647;
		hdHintBox.style.backgroundColor = '#F96302';
		hdHintBox.style.fontSize = '19px';
		hdHintBox.style.color = 'black';
		hdHintBox.textContent = '\n\n Click a blank spot on the page,\nthen press ALT+X to begin. \n\n\n';
		hdHintBox.id = 'hdHintBoxMove';
		document.body.appendChild(hdHintBox);
		
		function addListeners() {
			document.getElementById('hdHintBoxMove').addEventListener('mousedown', mouseDown, false);
			window.addEventListener('mouseup', mouseUp, false);
		}

		function mouseUp() {
			window.removeEventListener('mousemove', divMove, true);
		}

		function mouseDown(e) {
			var div = document.getElementById('hdHintBoxMove');
			x_pos = e.clientX - div.offsetLeft;
			y_pos = e.clientY - div.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}

		function divMove(e) {
			var div = document.getElementById('hdHintBoxMove');
			div.style.position = 'absolute';
			div.style.top = (e.clientY - y_pos) + 'px';
			div.style.left = (e.clientX - x_pos) + 'px';
		}

		function chngCrsr() {
			var gotQtyBox = "$('#hdHintBoxMove').css('cursor', 'move');";
			var qtyBoxTag = document.createElement("script");
			qtyBoxTag.innerHTML = gotQtyBox;
			document.head.appendChild(qtyBoxTag);
		}

		addListeners();
		chngCrsr();
		
		hdHintBoxMove.value = 'doingTax';
	}

	hdHint();
	
	function taxCheck() {
		if (document.querySelector('[data-automation-id="taxExempt_applyTaxExemptIdLink"]').innerText == "Apply Tax Exempt ID" && document.querySelector('[ng-if*="multiShipModeOn()"]') !== null) {
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
	}
	setTimeout(taxCheck, 4000);

}

if (window.location.href.indexOf('homedepot.com/p/') > -1 || window.location.href.indexOf('homedepot.com/mycart/') > -1) {
	// product page injections go here
}


if (window.location.href.indexOf('walmart.com/ip/') > -1) {
	// product page injections go here
}


if (window.location.href.indexOf('bestbuy.com') > -1 && window.location.href.indexOf('.p') > -1 || window.location.href.indexOf('bestbuy.com/cart') > -1) {
	function bbyPrice() {
		var gotInfo = 'var priceGot = window.pdp.priceBlock.price.customerPrice;';
		var priceTag = document.createElement("script");
		priceTag.innerHTML = gotInfo;
		document.head.appendChild(priceTag);
		if (typeof passedPrice == "undefined") {
			console.log('Sending price to element passedPrice');
			window.location.href = "javascript:var pricePass=document.createElement('div');pricePass.innerHTML=priceGot;pricePass.id='passedPrice';document.head.appendChild(pricePass);";
		}
	}
	bbyPrice();
}

if (window.location.href.indexOf('target.com') > -1) {
	
	var targFreeShip = document.querySelector('[data-test="cart-summary-delivery"]');

	function targHint() {
		targHintBox = document.createElement('div');
		targHintBox.setAttribute('style', 'white-space: pre;');
		targHintBox.style.position = 'fixed';
		targHintBox.style.top = 0;
		targHintBox.style.left = '37%';
		targHintBox.style.zIndex = 2147483647;
		targHintBox.style.backgroundColor = '#AA0000';
		targHintBox.style.fontSize = '13px';
		targHintBox.style.color = 'white';
		//targHintBox.textContent = '\n\n Click a blank spot on the page,\nthen press ALT+X to begin. \n\n\n';
		targHintBox.id = 'targHintBoxMove';
		document.body.appendChild(targHintBox);
		
		function addListeners() {
			document.getElementById('targHintBoxMove').addEventListener('mousedown', mouseDown, false);
			window.addEventListener('mouseup', mouseUp, false);
		}

		function mouseUp() {
			window.removeEventListener('mousemove', divMove, true);
		}

		function mouseDown(e) {
			var div = document.getElementById('targHintBoxMove');
			x_pos = e.clientX - div.offsetLeft;
			y_pos = e.clientY - div.offsetTop;
			window.addEventListener('mousemove', divMove, true);
		}

		function divMove(e) {
			var div = document.getElementById('targHintBoxMove');
			div.style.position = 'absolute';
			div.style.top = (e.clientY - y_pos) + 'px';
			div.style.left = (e.clientX - x_pos) + 'px';
		}

		function chngCrsr() {
			var gotQtyBox = "$('#targHintBoxMove').css('cursor', 'move');";
			var qtyBoxTag = document.createElement("script");
			qtyBoxTag.innerHTML = gotQtyBox;
			document.head.appendChild(qtyBoxTag);
		}

		addListeners();
		chngCrsr();
		
	}
	
	function ensurepickupmsg() {
		targHintBox.textContent = '\n Please ensure if you have a pickup item, it is marked as such here. \n Press ALT+X to continue. \n\n';
	}
	
	if (window.location.href.indexOf('target.com/co-cart') > -1) {
		targHint();
		targHintBox.textContent = '\n If using a pickup item, please mark the item \n as "order pickup" below. \n If you have a coupon code, please enter it below, then \n press ALT+X to continue \n\n';
	}
	
	if (window.location.href.indexOf('co-login') > -1) {
		targHint();
		targHintBox.textContent = '\n Use Dropship Helper to fill email, then \n press ALT+X to fill password and continue \n\n';
	}
	
	if (window.location.href.indexOf('co-deliverymethod') > -1) {
		targHint();
		targHintBox.textContent = '\n Please ensure if you have a pickup item, it is marked as such here. \n Press ALT+X to continue. \n\n';
		setTimeout(ensurepickupmsg, 400);
	}
	
	if (window.location.href.indexOf('co-delivery') > -1) {
		targHintBox.textContent = '\n Press ALT+X to delete any saved addresses. Press again to add new address. \n\n';
	}
	
	if (window.location.href.indexOf('co-pickupdelivery') > -1) {
		targHintBox.textContent = '\n Press ALT+X to save pickup name and continue. \n\n';
	}
	
	if (window.location.href.indexOf('co-giftoption') > -1) {
		targHintBox.textContent = '\n Press ALT+X to fill gift options and continue. \n\n';
	}
	
	if (window.location.href.indexOf('co-payment') > -1) {
		targHintBox.textContent = '\n Press ALT+X to choose gift card for payment. \n Press ALT+X after the order has been paid in full. \n\n';
	}
	
	if (window.location.href.indexOf('co-review') > -1) {
		targHintBox.textContent = '\n Press ALT+X to place order and move to order confirmation screen. \n\n';
	}
	
	if (window.location.href.indexOf('co-thankyou') > -1) {
		targHint();
		targHintBox.textContent = '\n ALT+X to copy order number \n If pickup item is detected, you will be redirected \n to the order details page so you \n may cancel \n\n';
	}

	if (window.location.href.indexOf('target.com/account/orders/') > -1) {
		targHint();
		targHintBox.textContent = '\n ALT+X to cancel pickup item. \n\n';
	}
}