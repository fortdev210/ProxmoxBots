"use strict";

(function() {
	const pageElements = {
		buttons: {
			blacklist: document.getElementById("blacklistButton"),
			whitelist: document.getElementById("whitelistButton"),
			cancel: document.getElementById("cancelButton")
		},
		hostnameInput: document.getElementById("hostnameInput")
	};

	const events = {
		input: function({target}) {
			enableButtons(target.validity.valid);
		},

		click: function({target}) {
			switch(target) {
			case pageElements.buttons.blacklist:
				addToList("blacklist");
				break;
			case pageElements.buttons.whitelist:
				addToList("whitelist");
				break;
			case pageElements.buttons.cancel:
				window.close();
				break;
			}
		},

		keydown: function({key}) {
			if (key !== "Escape") return;
			window.close();
		}
	};

	function enableButtons(enable) {
		pageElements.buttons.blacklist.disabled = !enable;
		pageElements.buttons.whitelist.disabled = !enable;
	}

	function windowClose() {
		window.close();
	}

	function addListeners(key) {
		key = key ? "addEventListener" : "removeEventListener";
		pageElements.hostnameInput[key]("input", events.input);
		document[key]("click", events.click);
		window[key]("keydown", events.keydown);
	}

	function addToList(key) {
		function doStoreList(items) {
			storeList(hostname, items, key);
		}
		let hostname;

		hostname = pageElements.hostnameInput.value.trim();
		if (!hostname) {
			pageElements.hostnameInput.value = "";
			return;
		}
		addListeners(false);
		pageElements.hostnameInput.disabled = true;
		for (let node of Object.entries(pageElements.buttons)) {
			node.diabled = true;
		}
		chrome.storage.local.get(["settingsInitialized", key], doStoreList);
	}

	function showMessage(message, closeWindow) {
		let body, div;

		body = document.createElement("body");
		div = document.createElement("div");
		div.id = "messageDiv";
		div.textContent = message;
		body.appendChild(div);
		document.documentElement.id = "messagePage";
		document.documentElement.replaceChild(body, document.body);
		if (!closeWindow) return;
		setTimeout(windowClose, 1300);
	}

	function storeList(hostname, items, key) {
		let indx, list;
		const newItems = {};

		if (!items.settingsInitialized) {
			showMessage(chrome.i18n.getMessage("missing_data"), false);
			return;
		}
		list = items[key];
		indx = list.findIndex(item => item >= hostname);
		if (indx == -1) {
			list.push(hostname);
		} else if (list[indx] === hostname) {
			showMessage(chrome.i18n.getMessage(key === "blacklist" ?
				"already_blacklisted" : "already_whitelisted"), true);
			return;
		} else {
			list.splice(indx, 0, hostname);
		}
		newItems[key] = list;
		chrome.storage.local.set(newItems);
		showMessage(chrome.i18n.getMessage(key === "blacklist" ?
			"blacklist_add" : "whitelist_add"), true);
	}

	function i18nInsertText() {
		for (let node of document.querySelectorAll("[data-i18n-text]")) {
			node.textContent = chrome.i18n.getMessage(node.dataset.i18nText);
		}
	}

	i18nInsertText();
	addListeners(true);
	pageElements.hostnameInput.value = chrome.extension.getBackgroundPage().globalStore.hostname;
	pageElements.hostnameInput.disabled = false;
	enableButtons(pageElements.hostnameInput.validity.valid);
}());