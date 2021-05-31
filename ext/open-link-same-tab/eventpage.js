"use strict";

(function() {
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

	const eventPage = {
		initContextMenu: function({convertLinks, showMenuItem}) {
			const menus = [{
				id: "convert_links",
				type: "checkbox",
				checked: convertLinks,
				title: chrome.i18n.getMessage("convert_checkbox_cm"),
				contexts: ["browser_action"],
			}];
			const menuItem = {};

			common.setIcon(convertLinks);
			for (let item of menus) {
				chrome.contextMenus.create(item);
			}
			if (!showMenuItem) return;
			for (let [key, value] of Object.entries(common.linkMenuItem)) {
				menuItem[key] = value;
			}
			chrome.contextMenus.create(menuItem);
		},

		doContextMenu: function({menuItemId, linkUrl, checked}, tab) {
			function updateContextMenu() {
				common.updateContextMenu(checked);
			}

			switch (menuItemId) {
			case "open_link":
				chrome.tabs.update(tab.id, {url: linkUrl});
				break;
			case "convert_links":
				chrome.storage.local.set({convertLinks: checked}, updateContextMenu);
				break;
			default:
				console.error("Error");
				break;
			}
		},

		getHostname: function(url) {
			let protocol, hostname, pathname;

			({protocol, hostname, pathname} = new URL(url));
			switch (protocol) {
			case "file:":
				return `file://${hostname}${pathname}`;
				break;
			case "http:":
			case "https:":
				return hostname;
				break;
			}
			return null;
		},

		blacklistSite: function(tab) {
			const that = eventPage.blacklistSite;
			const pWidth = 500, pHeight = 194;
			let hostname;
			function promptClosed(windowId) {
				if (windowId !== that.promptWindow.id) return;
				that.promptWindow = null;
				chrome.windows.onRemoved.removeListener(promptClosed);
			}
			function promptOpened(win) {
				that.openingWindow = false;
				that.promptWindow = win;
				chrome.windows.onRemoved.addListener(promptClosed
//					, {windowTypes: ["popup"]}
				);
			}

			if (!that.hasOwnProperty("openingWindow")) {
				that.openingWindow = false;
				that.promptWindow = null;
			}
			if (that.openingWindow) return;
			hostname = eventPage.getHostname(tab.url);
			if (!hostname) return;
			window.globalStore = {hostname: hostname};
			if (that.promptWindow) {
				chrome.tabs.update(that.promptWindow.tabs[0].id, {
					url: "prompt.html", active: true
				});
				chrome.windows.update(that.promptWindow.id, {
					top: (screen.height - pHeight) / 2,
					left: (screen.width - pWidth) / 2,
					width: pWidth,
					height: pHeight,
					focused: true
				});
				return;
			}
			that.openingWindow = true;
			chrome.windows.create({
				top: (screen.height - pHeight) / 2,
				left: (screen.width - pWidth) / 2,
				width: pWidth,
				height: pHeight,
				url: "prompt.html",
				type: "popup"
			}, promptOpened);
		},

		doBrowserAction: function(tab) {
			eventPage.blacklistSite(tab);
		},

		checkList: function(list) {
			if (!(list instanceof Array)) return [];
			list = list.map(item => (typeof item === "string") ?
				item.trim() : null);
			list.sort();
			return list.filter((item, indx, items) => item &&
				item !== items[indx + 1]);
		},

		checkStoredItems: function(items) {
			function initContextMenu() {
				eventPage.initContextMenu(newItems);
			}
			let newItems;

			if (items.settingsInitialized) {
				newItems = {
					settingsInitialized: true,
					blacklist: eventPage.checkList(items.blacklist),
					whitelist: eventPage.checkList(items.whitelist)
				};
				for (let [key, value] of Object.entries(common.defaultValues)) {
					newItems[key] = (typeof items[key] === "boolean") ?
						items[key] : value;
				}
			} else {
				newItems = {
					settingsInitialized: true,
					blacklist: [],
					whitelist: []
				};
				for (let [key, value] of Object.entries(common.defaultValues)) {
					newItems[key] = value;
				}
			}
			chrome.storage.local.set(newItems, initContextMenu);
		},

		onInstalled: function({reason}) {
			function initContextMenu() {
				eventPage.initContextMenu(items);
			}
			let items;

			switch (reason) {
			case "install":
				items = {
					settingsInitialized: true,
					blacklist: [],
					whitelist: []
				};
				for (let [key, value] of Object.entries(common.defaultValues)) {
					items[key] = value;
				}
				chrome.storage.local.set(items, initContextMenu);
				break;
			case "update":
				chrome.storage.local.get(null, eventPage.checkStoredItems);
				break;
			case "chrome_update":
				break;
			case "shared_module_update":
				break;
			}
		}
	};

	chrome.runtime.onInstalled.addListener(eventPage.onInstalled);
	chrome.browserAction.onClicked.addListener(eventPage.doBrowserAction);
	chrome.contextMenus.onClicked.addListener(eventPage.doContextMenu);
}());