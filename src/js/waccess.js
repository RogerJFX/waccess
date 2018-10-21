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

/**
 * Programmer's Politeness Policy (PPP)
 * 
 * Anything left unclear after reading the code (RTFC)? Please let us know, if you are sure it is our fault.
 */
(function wcs(self) {
    
    const WACCESS_ELEMENT = 'waccess';
    const WACCESS_INNER_ELEMENT = 'button';
    const ATT_FROM = 'from';
    const ATT_TO = 'to';

    let shiftKeyDown = false;

    function isFocusable(element) {
        return !(!element.getAttribute('tabindex')) || (() => {
            switch (element.tagName.toLowerCase()) {
                case 'a':
                case 'button':
                case 'input':
                case 'textarea':
                case 'select':
                    return true;
            }
            return false;
        })();
    }

    function findFirstFocusable(element, reverse) {
        if (isFocusable(element)) {
            return element;
        }
        const children = reverse ? Array.from(element.children).reverse() : Array.from(element.children);
        for (const ch of children) {
            const candidate = findFirstFocusable(ch, reverse);
            if (candidate) {
                return candidate;
            }
        }
    }

    function gotoFocusable(queries, singleQCondition, dryRun) {
        const reverse = shiftKeyDown;
        const containers = (queries.length === 1 && singleQCondition) ? document.querySelectorAll(queries[0]) :
            document.querySelectorAll(reverse ? queries[0] : queries[1]);
        if (containers.length === 1) {
            const candidate = findFirstFocusable(containers[0], reverse);
            if (candidate && !dryRun) {
                candidate.focus();
            } else if(!candidate && dryRun) {
                console.error('No focusable element found in container. Query is: ' + queries[0]);
            }
        } else if(dryRun) {
            console.error('Expected one and only one container element, but found ' + containers.length + 
                '. Query is: ' + queries[0]);
        }
    }

    function hasEqualEntries(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] !== arr[0]) {
                return false;
            }
        }
        return true;
    }
    
    function validateWaccessButton(button) {
        if(!button.getAttribute(ATT_FROM) || !button.getAttribute(ATT_TO)) {
            console.error(button);
            throw new Error('Not enough arguments for button inside waccess element. ' + 
                'Please specify attributes "from" and "to". Button is logged above.');
        }
        gotoFocusable([button.getAttribute(ATT_FROM)], true, true);
        gotoFocusable([button.getAttribute(ATT_TO)], true, true);
    }

    function scanDocument4Waccess() {
        document.querySelectorAll(WACCESS_ELEMENT).forEach((ab) => {
            const buttons = ab.querySelectorAll(WACCESS_INNER_ELEMENT);
            if (buttons.length === 1) {
                validateWaccessButton(buttons[0]);
                buttons[0].onfocus = () => 
                    gotoFocusable([buttons[0].getAttribute(ATT_FROM), buttons[0].getAttribute(ATT_TO)]);
            } else {
                const buttonsArr = Array.from(buttons);
                const froms = buttonsArr.map(b => b.getAttribute(ATT_FROM));
                const tos = buttonsArr.map(b => b.getAttribute(ATT_TO));
                buttons.forEach((b) => {
                    validateWaccessButton(b);
                    b.onclick = () => gotoFocusable([b.getAttribute(ATT_FROM), b.getAttribute(ATT_TO)]);
                    if (hasEqualEntries(froms)) {
                        b.onfocus = () => gotoFocusable([b.getAttribute(ATT_FROM)], shiftKeyDown === true);
                    }
                    if (hasEqualEntries(tos)) {
                        b.onfocus = () => gotoFocusable([b.getAttribute(ATT_TO)], shiftKeyDown === false);
                    }
                });
            }
        });
    };

    function addKeyListeners() {
        window.addEventListener('keydown', (evt) => {
            switch (evt.keyCode) { // we leave it like this for the moment.
                case 16:
                    shiftKeyDown = true;
                    break;
            }
        });
        window.addEventListener('keyup', (evt) => {
            switch (evt.keyCode) {
                case 16:
                    shiftKeyDown = false;
                    break;
            }
        });
    }

    function activate() {
        scanDocument4Waccess();
        addKeyListeners();
    }

    const storage = (() => {
        const KEY = '$_WACCESS__-__';

        const dataObject = JSON.parse(sessionStorage.getItem(KEY)) || {
            waccessActivated: false
        };

        function persist() {
            sessionStorage.setItem(KEY, JSON.stringify(dataObject));
        }

        this.activateWaccess = () => {
            dataObject.waccessActivated = true;
            persist();
        };

        this.isWaccessActivated = () => {
            return dataObject.waccessActivated;
        }

        return this;
    })();

    window.addEventListener('load', () => {
        if (!storage.isWaccessActivated()) {
            const a = document.getElementById('askWaccess');
            a.style.display = 'inline-block';
            a.focus();
        } else {
            activate();
        }
    });

    self.activateWaccess = () => {
        storage.activateWaccess();
        activate();
        document.getElementById('askWaccess').style.display = 'none';
    }

    self.focusElement = (query) => gotoFocusable([query], true);

})($waccess);
