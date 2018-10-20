/*
 * waccess.js
 * 
 * Copyright 2018 Roger F. Hösl	
 * 
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
 * MA 02110-1301, USA.
 * 
 * 
 */

$waccess = window.$waccess || {};
(function acs(self) {
	
	let reverseTabbed = false;
		
	function isFocusable(element) {
		return (element.getAttribute && !(!element.getAttribute('tabindex'))) || (function() {
			switch(element.tagName.toLowerCase()) {
				case 'a':
				case 'button':
				case 'input':
				return true;
			}
			return false;
		})();
	}
	
	function findFirstFocusable(element, reverse) {
		if(isFocusable(element)) {
			return element;
		}
		const children = reverseTabbed ? Array.from(element.children).reverse() : Array.from(element.children);
		for (const ch of children) {
			const candidate = findFirstFocusable(ch);
			if(candidate) {
				return candidate;
			}
		}
	}
	
	function gotoFocusable(queries) {
		const reverse = reverseTabbed;
		const containers = queries.length === 1 ? document.querySelectorAll(queries[0]) :
			document.querySelectorAll(reverse ? queries[0] : queries[1]);
		if(containers.length > 1) {
			throw new Error('Expected one and only one container element, but found ' + containers.length);
		} else if(containers.length === 1) {
			const candidate = findFirstFocusable(containers[0], reverse);
			if(candidate) candidate.focus();	
		}
	}
	
	function scanDocument4ACS() {
		const acsBranches = document.querySelectorAll('waccess');
		acsBranches.forEach((ab) => {
			const buttons = ab.querySelectorAll('button');
			if(buttons.length === 1) {
				buttons[0].onfocus = () => {
					gotoFocusable([buttons[0].getAttribute('from'), buttons[0].getAttribute('to') ]);
				}
			} else {
				buttons.forEach((b) => {
					b.onclick = () => {
						gotoFocusable([b.getAttribute('from'), b.getAttribute('to')]);
					};
				});
			}
		});
	};
	
	function addKeyListener() {
		window.addEventListener('keydown', (evt) => {
			switch(evt.keyCode) {
				case 16:
					reverseTabbed = true;
				break;
			}
		});
		window.addEventListener('keyup', (evt) => {
			switch(evt.keyCode) {
				case 16:
					reverseTabbed = false;
				break;
			}
		});
	}
	
	function activate() {
		scanDocument4ACS();
		addKeyListener();
	}
	
	const storage = (function() {
		const KEY = '$_WACCESS';
		
		const dataObject = JSON.parse(sessionStorage.getItem(KEY)) || {
			waccessActivated: false
		};
		
		function persist() {
			sessionStorage.setItem(KEY, JSON.stringify(dataObject));
		}
		
		this.activateAcs = () => {
			dataObject.waccessActivated = true;
			persist();
		};
		
		this.isAcsActivated = () => {
			return dataObject.waccessActivated;
		}
		
		return this;
	})();
	
	window.addEventListener('load', () => {
		if(!storage.isAcsActivated()) {
			const a = document.getElementById('askWaccess');
			a.style.display = 'inline-block';
			a.focus();
		} else {
			activate();
		}
	});

	self.activateWaccess = () => {
		storage.activateAcs();
		activate();
		document.getElementById('askWaccess').style.display='none';
	}
	
	self.focusElement = (query) => {
		gotoFocusable([query]);
	}

})($waccess);
