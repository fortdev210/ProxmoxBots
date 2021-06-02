"use strict";

(function() {
	const storedItems = {
		blacklist: [],
		whitelist: []
	};

	const pageElements = {
		form: document.getElementById("form"),
		checkboxes: {
			convertLinks: document.getElementById("convertLinksCheckbox"),
			showMenuItem: document.getElementById("menuItemCheckbox"),
			useWhitelist: document.getElementById("whitelistCheckbox")
		},
		selects: {
			blacklist: document.getElementById("blacklist"),
			whitelist: document.getElementById("whitelist")
		},
		deleteButtons: {
			blacklist: document.getElementById("blacklistDeleteButton"),
			whitelist: document.getElementById("whitelistDeleteButton")
		},
		resetButton: document.getElementById("resetButton")
	};

	const common = {
		defaultValues: {
			convertLinks: true,
			showMenuItem: true,
			useWhitelist: false
		},

		urlList: ["*://*/*", "file:///*"],

		setIcon: function(convertLinks) {
			let path;

			path = (convertLinks) ? {
				"19": "icons/pa_icon19.png",
				"38": "icons/pa_icon38.png"
			} : {
				"19": "icons/disabled_icon19.png",
				"38": "icons/disabled_icon38.png"
			};
			chrome.browserAction.setIcon({path: path});
		},

		updateContextMenu: function(convertLinks) {
			chrome.contextMenus.update("convert_links", {checked: convertLinks});
			common.setIcon(convertLinks);
		}
	};

	common.linkMenuItem = {
		id: "open_link",
		type: "normal",
		title: chrome.i18n.getMessage("context_menu_label"),
		contexts: ["link"],
		documentUrlPatterns: common.urlList
	};

	const events = {
		click: function({target}) {
			if (target.name === "deleteButton") {
				optionPage.deleteSelectedItems(target.dataset.key);
				return;
			}
			switch (target.id) {
			case "resetButton":
				optionPage.restoreDefaults();
				break;
			case "closeButton":
				window.close();
				break;
			}
		},

		change: function({target}) {
			let doUpdate, items = {};

			switch (target.name) {
			case "optionCheckbox":
				switch (target.value) {
				case "convertLinks":
					doUpdate = function() {
						common.updateContextMenu(items.convertLinks);
					};
					break;
				case "showMenuItem":
					doUpdate = function() {
						optionPage.updateLinkMenu(items.showMenuItem);
					};
					break;
				default:
					doUpdate = function() {};
					break;
				}
				items[target.value] = target.checked;
				chrome.storage.local.set(items, doUpdate);
				break;
			case "select":
				optionPage.enableDeleteButton(target.dataset.key);
				break;
			}
		},

		submit: function(evnt) {
			evnt.preventDefault();
		}
	};

	const optionPage = {
		disableCheckbox: function(node, disable) {
			node.disabled = disable;
			node.parentNode.classList[disable ? "add" : "remove"]("disabled");
		},

		addPageEventListeners: function() {
			document.body.addEventListener("click", events.click);
			document.body.addEventListener("change", events.change);
			pageElements.form.addEventListener("submit", events.submit);
		},

		enableResetButton: function() {
			pageElements.resetButton.disabled =
				[...pageElements.form.elements.optionCheckbox].every(item =>
				item.checked == common.defaultValues[item.value]);
		},

		enableDeleteButton: function(key) {
			pageElements.deleteButtons[key].disabled =
				(pageElements.selects[key].selectedIndex == -1);
		},

		enableWhitelistChexkbox: function() {
			optionPage.disableCheckbox(pageElements.checkboxes.useWhitelist,
				!pageElements.checkboxes.convertLinks.checked);
		},

		enablePageItems: function() {
			optionPage.disableCheckbox(pageElements.checkboxes.convertLinks, false);
			optionPage.disableCheckbox(pageElements.checkboxes.showMenuItem, false);
			optionPage.enableWhitelistChexkbox();
			for (let node of pageElements.form.elements.select) {
				node.disabled = false;
			}
		},

		updateList: function(key, list) {
			let option, selectElement;

			storedItems[key] = list;
			selectElement = pageElements.selects[key];
			selectElement.selectedIndex = -1;
			selectElement.options.length = list.length;
			for (let indx = 0; indx < list.length; indx++) {
				option = selectElement.options[indx];
				option.text = list[indx];
				option.value = list[indx];
			}
			optionPage.enableDeleteButton(key);
		},

		updatePageItems: function(changes, area) {
			let key, resetButton = false;

			if (area !== "local") return;
			for (let node of pageElements.form.elements.optionCheckbox) {
				key = node.value;
				if (!changes.hasOwnProperty(key)) continue;
				node.checked = changes[key].newValue;
				resetButton = true;
				if (key !== "convertLinks") continue;
				optionPage.enableWhitelistChexkbox();
			}
			for (let node of pageElements.form.elements.select) {
				key = node.dataset.key;
				if (!changes.hasOwnProperty(key)) continue;
				optionPage.updateList(key, changes[key].newValue);
			}
			if (!resetButton) return;
			optionPage.enableResetButton();
		},

		setPageItems: function(items) {
			if (!items.settingsInitialized) {
				console.warn("Stored data missing.");
				return;
			}
			chrome.storage.onChanged.addListener(optionPage.updatePageItems);
			for (let node of pageElements.form.elements.optionCheckbox) {
				node.checked = items[node.value];
			}
			optionPage.enableResetButton();
			for (let node of pageElements.form.elements.select) {
				optionPage.updateList(node.dataset.key, items[node.dataset.key]);
			}
			optionPage.enablePageItems();
			optionPage.addPageEventListeners();
		},

		restoreDefaults: function() {
			function doUpdate() {
				common.updateContextMenu(items.convertLinks);
				optionPage.updateLinkMenu(items.showMenuItem);
			}
			const items = {};

			for (let [key, value] of Object.entries(common.defaultValues)) {
				items[key] = value;
			}
			chrome.storage.local.set(items, doUpdate);
		},

		deleteSelectedItems: function(key) {
			let list, indx, selectedOptions, items = {};

			list = storedItems[key];
			selectedOptions = pageElements.selects[key].selectedOptions;
			indx = selectedOptions.length;
			if (!indx) return;
			while (indx--) {
				list.splice(selectedOptions[indx].index, 1);
			}
			items[key] = list;
			chrome.storage.local.set(items);
		},

		updateLinkMenu: function(showMenuItem) {
			function warnError() {
				if (!chrome.runtime.lastError) return;
				console.warn(chrome.runtime.lastError.message);
			}
			const item = {};

			if (showMenuItem) {
				for (let [key, value] of Object.entries(common.linkMenuItem)) {
					item[key] = value;
				}
				chrome.contextMenus.create(item, warnError);
			} else {
				chrome.contextMenus.remove("open_link", warnError);
			}
		},

		i18nInsertText: function() {
			for (let item of document.querySelectorAll("[data-i18n-text]")) {
				item.textContent = chrome.i18n.getMessage(item.dataset.i18nText);
			}
		}
	};

	document.documentElement.dir = chrome.i18n.getMessage("bidi_dir");
	optionPage.i18nInsertText();
	chrome.storage.local.get(null, optionPage.setPageItems);
}());