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

(function wcs(self) {

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

    function gotoFocusable(queries, condition) {
        const reverse = shiftKeyDown;
        const containers = (queries.length === 1 && condition) ? document.querySelectorAll(queries[0]) :
            document.querySelectorAll(reverse ? queries[0] : queries[1]);
        if (containers.length > 1) {
            throw new Error('Expected one and only one container element, but found ' + containers.length);
        } else if (containers.length === 1) {
            const candidate = findFirstFocusable(containers[0], reverse);
            if (candidate) candidate.focus();
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

    function scanDocument4Waccess() {
        document.querySelectorAll('waccess').forEach((ab) => {
            const buttons = ab.querySelectorAll('button');
            if (buttons.length === 1) {
                buttons[0].onfocus = () => 
                    gotoFocusable([buttons[0].getAttribute('from'), buttons[0].getAttribute('to')]);
            } else {
                const buttonsArr = Array.from(buttons);
                const froms = buttonsArr.map(b => b.getAttribute('from'));
                const tos = buttonsArr.map(b => b.getAttribute('to'));
                buttons.forEach((b) => {
                    b.onclick = () => gotoFocusable([b.getAttribute('from'), b.getAttribute('to')]);
                    if (hasEqualEntries(froms)) {
                        b.onfocus = () => gotoFocusable([b.getAttribute('from')], shiftKeyDown === true);
                    }
                    if (hasEqualEntries(tos)) {
                        b.onfocus = () => gotoFocusable([b.getAttribute('to')], shiftKeyDown === false);
                    }
                });
            }
        });
    };

    function addKeyListeners() {
        window.addEventListener('keydown', (evt) => {
            switch (evt.keyCode) { // we leave it like this at the moment.
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
