	function bbyWaitForPayment() {
		function checkSpinner() {
			if (document.querySelector('[class="page-spinner page-spinner--in"]') !== null && window.location.href.indexOf('checkout/r/payment') == -1) {
			   window.setTimeout(checkSpinner, 100);
			} else if (window.location.href.indexOf('checkout/r/payment') > -1) {
				setTimeout(function () {
					if (document.querySelector('[data-track="Payment Method: Enter government purchase"]').innerText == "+ Use a Best Buy Tax Exempt Quick Card") {
						addyAmt = document.querySelectorAll('[class="fulfillment-list-entry__address"]').length;
						if (addyAmt == 1) {
							submittedAddy = document.querySelector('[class="fulfillment-list-entry__address"]').innerText;
							submittedAddy = submittedAddy.substr(submittedAddy.indexOf('\n') + 1);
							submittedState = submittedAddy.split(' ').reverse()[1];
						} else if (addyAmt > 1) {
							submittedAddys = [];
							submittedStates = [];
							for (var i = 0; i < addyAmt; i++) {
								submittedAddys[i] = document.querySelectorAll('[class="fulfillment-list-entry__address"]')[i].innerText;
								submittedAddys[i] = submittedAddys[i].substr(submittedAddys[i].indexOf('\n') + 1);
								submittedStates[i] = submittedAddys[i].split(' ').reverse()[1];
							}
						}

						taxID_OK = ["AK", "AR", "AZ", "CA", "CO", "CT", "FL", "GA", "HI", "IA", "ID", "IL", "KS", "KY", "MD", "ME", "MI", "MN", "MO", "NC", "ND", "NE", "NJ", "NM", "NV", "OH", "OK", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "WA", "WI"];
						taxID_notOK = ["AL", "IN", "LA", "MA", "MS", "NY", "VA", "WV", "WY"];
						taxID_NA = ["DE", "MT", "NH", "OR"];
						
						chrome.runtime.sendMessage({
							checkTaxFillOption: true,
						}, function(response) {
							if (response.fillTaxEnabled == true) {
								if (addyAmt == 1) {
									if (taxID_OK.indexOf(submittedState) >= 0) {
										document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
										setTimeout(fillText('[id="tax-exempt-quick-check"]', '3011092248'), 300);
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
								} else if (addyAmt > 1) {
									if (addyAmt == taxID_OK.length - difference(taxID_OK, submittedStates).length) {
										document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
										setTimeout(fillText('[id="tax-exempt-quick-check"]', '3011092248'), 300);
										document.querySelector('[data-track="Tax-Exempt Quick Card: Apply"]').click();
									} else if (addyAmt > taxID_OK.length - difference(taxID_OK, submittedStates).length) {
										notOK_States = submittedStates.subtract(taxID_OK);
										notOK_StateAmt = notOK_States.length;
										if (notOK_StateAmt !== 0) {
											alert('The state(s) ' + notOK_States.toString() + ' are not eligible for tax exempt.');
											document.querySelector('[title="Use a Best Buy Tax Exempt Quick Card"]').click();
											setTimeout(fillText('[id="tax-exempt-quick-check"]', '3011092248'), 300);
											document.querySelector('[data-track="Tax-Exempt Quick Card: Apply"]').click();
										}
									}
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
				}, 550);
			}
		}
		checkSpinner();
	}