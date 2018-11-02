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
 * Anything left unclear after reading the code (RTFC)? Please let me know, once you are sure it is my fault.
 * 
 * This small script was animated by Mr. Marcus Antonius Paulinus. It is dedicated to him as well.
 */
(function wcs(self) {
    
    Array.from = Array.from || function (collection) {
        var result = new Array(); // :O
        for (var i = 0; i < collection.length; i++) {
            result.push(collection[i]);
        }
        return result;
    }

    var WACCESS_ELEMENT = 'waccess';
    var WACCESS_ELEMENT_ATT_WELCOME = 'welcome';
    var WACCESS_ELEMENT_ATT_ACTIVATED = 'activated';
    var WACCESS_INNER_ELEMENT = 'button';
    var ATT_AUTO_FORWARD = 'autoforward';
    var ATT_FROM = 'from';
    var ATT_TO = 'to';
    var ATT_VAL_DISABLE_AUTO_FORWARD = 'false';

    var currentFocussedElement = null;
    var shiftKeyDown = false;
    var warningsEnabled = false;

    function isFocusable(element) {
        return !!element.getAttribute('tabindex') || function () {
            switch (element.tagName.toLowerCase()) {
                case 'a':
                case 'button':
                case 'input':
                case 'textarea':
                case 'select':
                    return true;
            }
            return false;
        }();
    }

    function findFirstFocusable(element, reverse) {
        if (isFocusable(element)) {
            return element;
        }
        var children = reverse ? Array.from(element.children).reverse() : Array.from(element.children);
        for (var i = 0; i < children.length; i++) {
            var candidate = findFirstFocusable(children[i], reverse);
            if (candidate) {
                return candidate;
            }   
        }
    }

    function gotoFocusable(queries, singleQCondition, dryRun) {
        var reverse = shiftKeyDown;
        var containers = queries.length === 1 && singleQCondition ? document.querySelectorAll(queries[0]) : document.querySelectorAll(reverse ? queries[0] : queries[1]);
        if (containers.length === 1) {
            var candidate = findFirstFocusable(containers[0], reverse);
            if (candidate && !dryRun) {
                candidate.focus();
            } else if (!candidate && dryRun && warningsEnabled) {
                console.warn('No focusable element found in container so far. Query is: ' + queries[0]);
            }
        } else if (dryRun) {
            console.error('Expected one and only one container element, but found ' + containers.length + '. Query is: ' + queries[0]);
        }
    }

    function hasEqualEntries(arr) {
        for (var i = 1; i < arr.length; i++) {
            if (arr[i] !== arr[0]) {
                return false;
            }
        }
        return true;
    }

    function validateWaccessButton(button) {
        if (!button.getAttribute(ATT_FROM) || !button.getAttribute(ATT_TO)) {
            throw new Error('Not enough arguments for button inside ' + WACCESS_ELEMENT + 
                ' element.\nPlease specify attributes "from" and "to". ' + WACCESS_INNER_ELEMENT + 
                ' is logged above.');
        }
        gotoFocusable([button.getAttribute(ATT_FROM)], true, true);
        gotoFocusable([button.getAttribute(ATT_TO)], true, true);
    }

    function scanDocument4Waccess(activate) {
        Array.from(document.querySelectorAll(WACCESS_ELEMENT)).forEach(function (container) {
            var buttons = Array.from(container.querySelectorAll(WACCESS_INNER_ELEMENT));
            activate ? activateButtons(buttons, container) : deactivateButtons(buttons);
        });
        
    };

    function isWaccessElementFocussed() {
        return currentFocussedElement !== null && currentFocussedElement.parentElement.nodeName.toLowerCase() === WACCESS_ELEMENT;
    }

    function deactivateButtons(buttons) {
        buttons.forEach(function (b) {
            b.setAttribute('tabindex', '-1');
        });
    }

    function forward(buttons) {
        if (buttons.length === 1) {
            buttons[0].onfocus = function () {
                gotoFocusable([buttons[0].getAttribute(ATT_FROM), buttons[0].getAttribute(ATT_TO)]);
            };
        } else {
            var froms = buttons.map(function (b) {
                return b.getAttribute(ATT_FROM);
            });
            var tos = buttons.map(function (b) {
                return b.getAttribute(ATT_TO);
            });
            buttons.forEach(function (b) {
                if (hasEqualEntries(froms)) {
                    b.onfocus = function () {
                        if (!isWaccessElementFocussed()) {
                            gotoFocusable([b.getAttribute(ATT_FROM)], shiftKeyDown === true);
                        }
                    };
                } else if (hasEqualEntries(tos)) {
                    b.onfocus = function () {
                        if (!isWaccessElementFocussed()) {
                            gotoFocusable([b.getAttribute(ATT_TO)], shiftKeyDown === false);
                        }
                    };
                }
            });
        }
    }

    function activateButtons(buttons, container) {
        buttons.forEach(function (b) {
            b.removeAttribute('tabindex');
            validateWaccessButton(b);
            b.onclick = function () {
                gotoFocusable([b.getAttribute(ATT_FROM), b.getAttribute(ATT_TO)]);
            };
        });
        if (!(ATT_VAL_DISABLE_AUTO_FORWARD === container.getAttribute(ATT_AUTO_FORWARD))) {
            forward(buttons);
        }
    }

    function addKeyListeners() {
        window.addEventListener('keydown', function (evt) {
            switch (evt.keyCode) {// we leave it like this for the moment.
                case 16:
                    shiftKeyDown = true;
                    break;
            }
        });
        window.addEventListener('keyup', function (evt) {
            switch (evt.keyCode) {
                case 16:
                    shiftKeyDown = false;
                    break;
                case 9:
                case 13:
                    currentFocussedElement = document.activeElement;
                    break;
            }
        });
    }

    function activate(activate) {
        scanDocument4Waccess(activate);
        addKeyListeners();
    }

    var storage = function () {
        var KEY = '$_WACCESS__-__';

        var dataObject = JSON.parse(sessionStorage.getItem(KEY)) || {
            waccessActivated: false,
            warningsEnabled: false
        };

        function persist() {
            sessionStorage.setItem(KEY, JSON.stringify(dataObject));
        }

        this.activateWaccess = function (warningsEnabled) {
            dataObject.waccessActivated = true;
            dataObject.warningsEnabled = warningsEnabled;
            persist();
        };

        this.isWaccessActivated = function () {
            return dataObject.waccessActivated;
        };

        this.isWarningsEnabled = function () {
            return dataObject.warningsEnabled;
        };

        return this;
    }();

    window.addEventListener('load', function () {
        if (!storage.isWaccessActivated()) {
            var a = document.querySelector(WACCESS_ELEMENT + ' .' + WACCESS_ELEMENT_ATT_WELCOME);
            a.style.display = 'inline-block';
            a.focus();
            activate(false);
        } else {
            warningsEnabled = storage.isWarningsEnabled;
            activate(true);
        }
    });

    self.activateWaccess = function (enableWarnings) {
        var eW = !enableWarnings ? false : true;
        warningsEnabled = eW;
        storage.activateWaccess(eW);
        activate(true);
        document.querySelector(WACCESS_ELEMENT + ' .' + WACCESS_ELEMENT_ATT_WELCOME).style.display = 'none';
        var confirmationElement = document.querySelector(WACCESS_ELEMENT + ' .' + WACCESS_ELEMENT_ATT_ACTIVATED);
        confirmationElement.style.display = 'inline-block';
        confirmationElement.focus();
        currentFocussedElement = null;
    };

    self.focusElement = function (query, force) {
        if (force || storage.isWaccessActivated()) {
            gotoFocusable([query], true);
        }
    };
})($waccess);
