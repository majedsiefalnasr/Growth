('use strict');

// Global variables
window.APPData = {
  INFO: {
    PROVIDER: 'Ultimate Solutions Egypt',
    PROVIDER_INFO: 'International leader in Enterprise Resource Solutions and Software Development',
    PROVIDER_LINK: 'https://ultimate-eg.net',
    PROJECT: 'HOLOL - Smart shopping platform',
    PROJECT_INFO:
      'Without technical experience and with ease, you can sell anywhere and anytime with your online store and with your commercial identity',
    VERSION: 'beta',
  },
  LOCAL: {
    BROWSER: {
      LANGUAGE: '',
    },
  },
  UTIL: {
    DelegatedEventHandlers: {},
  },
  ERROR: {
    HELP_CENTER: '/help-center',
    LOAD_SCRIPT: '',
  },
  LAZYLOAD_INSTANCE: '',
};

//            _____  _____    _    _ _   _ _ _ _
//      /\   |  __ \|  __ \  | |  | | | (_) (_) |
//     /  \  | |__) | |__) | | |  | | |_ _| |_| |_ _   _
//    / /\ \ |  ___/|  ___/  | |  | | __| | | | __| | | |
//   / ____ \| |    | |      | |__| | |_| | | | |_| |_| |
//  /_/    \_\_|    |_|       \____/ \__|_|_|_|\__|\__, |
//                                                  __/ |
//                                                 |___/
// APP Utility
var APPUtil = (function () {
  return {
    /**
     * Load JS script to DOM
     * @param {string} name
     * @param {string} version
     * @param {string} url
     * @param {string} integrity
     * @param {string} crossorigin
     * @param {string} type
     * @param {string} referrerpolicy
     * @returns {Promise}
     */
    loadScript: function (name, version, url, integrity, crossorigin, type, referrerpolicy) {
      if (!url) return;

      return new Promise(function (resolve, reject) {
        let comment;
        if (name && version) comment = document.createComment(name + ' v' + version);
        if (name && !version) comment = document.createComment(name);
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = url;
        if (integrity) script.integrity = integrity;
        if (crossorigin) script.setAttribute('crossorigin', crossorigin);
        if (type) script.type = type;
        if (referrerpolicy) script.setAttribute('referrerpolicy', referrerpolicy);
        script.async = false;
        script.onload = () => {
          resolve(url);
        };
        script.onerror = () => {
          reject(url);
        };

        if (comment) document.body.appendChild(comment);
        document.body.appendChild(script);
      });
    },

    /**
     * Get parameter value from URL.
     * @param {string} paramName Parameter name.
     * @returns {string}
     */
    getURLParam: function (paramName) {
      var searchString = window.location.search.substring(1),
        i,
        val,
        params = searchString.split('&');

      for (i = 0; i < params.length; i++) {
        val = params[i].split('=');
        if (val[0] == paramName) {
          return unescape(val[1]);
        }
      }

      return null;
    },

    /**
     * Checks whether current device is mobile device.
     * @returns {boolean}
     */
    isMobileDevice: function () {
      var isMobileDevice = this.getViewPort().width < this.getBreakpoint('lg') ? true : false;

      // For use within normal web clients
      if (isMobileDevice === false) isMobileDevice = navigator.userAgent.match(/iPad/i) != null;

      return isMobileDevice;
    },

    /**
     * Checks whether current device is desktop device.
     * @returns {boolean}
     */
    isDesktopDevice: function () {
      return APPUtil.isMobileDevice() ? false : true;
    },

    /**
     * Checks whether current device is touch device.
     * @returns {boolean}
     */
    isTouchDevice: function () {
      return (
        true ==
        ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch))
      );
    },

    /**
     * Gets browser window viewport size. Ref:
     * http://andylangton.co.uk/articles/javascript/get-viewport-size-javascript/
     * @returns {object}
     */
    getViewPort: function () {
      var e = window,
        a = 'inner';
      if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
      }

      return {
        width: e[a + 'Width'],
        height: e[a + 'Height'],
      };
    },

    /**
     * Gets browser window viewport width.
     * @returns {number}
     */
    getViewportWidth: function () {
      return this.getViewPort().width;
    },

    /**
     * Gets browser window viewport height.
     * @returns {number}
     */
    getViewportHeight: function () {
      return this.getViewPort().height;
    },

    /**
     * Gets window width for give breakpoint mode.
     * @param {string} breakpoint Responsive mode name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {number} (e.g: xxl: 1400)
     */
    getBreakpoint: function (breakpoint) {
      var value = this.getCssVariableValue('--breakpoint-' + breakpoint);

      if (value) {
        value = parseInt(value.trim());
      }

      return value;
    },

    /**
     * Checks whether given device breakpoint is currently activated.
     * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointUp: function (breakpoint) {
      return this.getViewPort().width >= this.getBreakpoint(breakpoint);
    },

    /**
     * Checks whether given device breakpoint is currently deactivated.
     * @param {string} breakpoint Responsive breakpoint name (e.g: xl, lg, md, sm, xs) or
     * (e.g: desktop, desktop-and-tablet, tablet, tablet-and-mobile, mobile)
     * @returns {boolean}
     */
    isBreakpointDown: function (breakpoint) {
      return this.getViewPort().width < this.getBreakpoint(breakpoint);
    },

    /**
     * Generates unique ID for give prefix & suffix.
     * @param {string} prefix Prefix for generated ID, can be empty
     * @param {string} suffix suffix for generated ID, can be empty
     * @returns {boolean}
     */
    getUniqueID: function (prefix, suffix) {
      return (prefix || '') + Math.floor(Math.random() * new Date().getTime()) + (suffix || '');
    },

    /**
     * Checks whether object has property matches given key path.
     * @param {object} obj Object contains values paired with given key path
     * @param {string} keys Keys path separated with dots
     * @returns {boolean}
     */
    isSet: function (obj, keys) {
      var stone;

      keys = keys || '';

      if (keys.indexOf('[') !== -1) throw new Error('Unsupported object path notation.');

      keys = keys.split('.');

      do {
        if (obj === undefined) return false;

        stone = keys.shift();

        if (!obj.hasOwnProperty(stone)) return false;

        obj = obj[stone];
      } while (keys.length);

      return true;
    },

    /**
     * Gets highest z-index of the given element parents
     * @param {object} el jQuery element object
     * @returns {number}
     */
    getHighestZindex: function (el) {
      var position, value;

      while (el && el !== document) {
        // Ignore z-index if position is set to a value where z-index is ignored by the browser
        // This makes behavior of this function consistent across browsers
        // WebKit always returns auto if the element is positioned
        position = APPUtil.css(el, 'position');

        if (position === 'absolute' || position === 'relative' || position === 'fixed') {
          // IE returns 0 when zIndex is not specified
          // other browsers return a string
          // we ignore the case of nested elements with an explicit value of 0
          // <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
          value = parseInt(APPUtil.css(el, 'z-index'));

          if (!isNaN(value) && value !== 0) return value;
        }

        el = el.parentNode;
      }

      return 1;
    },

    /**
     * Checks whether the element has any parent with fixed position
     * @param {object} el jQuery element object
     * @returns {boolean}
     */
    hasFixedPositionedParent: function (el) {
      var position;

      while (el && el !== document) {
        position = APPUtil.css(el, 'position');

        if (position === 'fixed') return true;

        el = el.parentNode;
      }

      return false;
    },

    /**
     * Simulates delay
     * @param {number} milliseconds Time in milliseconds
     */
    sleep: function (milliseconds) {
      return new Promise((resolve) => setTimeout(resolve, milliseconds));
    },

    /**
     * Throttle function
     * @param {function} func function which needs to be throttled
     * @param {number} delay time interval in milliseconds
     */
    throttle: function (timer, func, delay) {
      // If setTimeout is already scheduled, no need to do anything
      if (timer) return;

      // Schedule a setTimeout after delay seconds
      timer = setTimeout(function () {
        func();

        // Once setTimeout function execution is finished, timerId = undefined so that in <br>
        // the next scroll event function execution can be scheduled by the setTimeout
        timer = undefined;
      }, delay);
    },

    /**
     * Debounce function
     * @param {function} func function which needs to be debounced
     * @param {number} delay debounced time in milliseconds
     */
    debounce: function (timer, func, delay) {
      // Cancels the setTimeout method execution
      clearTimeout(timer);

      // Executes the func after delay time.
      timer = setTimeout(func, delay);
    },

    /**
     * Get Body object
     * @returns {object}
     */
    getBodyTag: function () {
      return document.getElementsByTagName('body')[0];
    },

    /**
     * Get HTML object
     * @returns {object}
     */
    getHTMLTag: function () {
      return document.getElementsByTagName('html')[0];
    },

    /**
     * Gets randomly generated integer value within given min and max range
     * @param {number} min Range start value, default: -1000
     * @param {number} max Range end value, default: 1000
     * @returns {number}
     */
    getRandomInt: function (min, max) {
      return Math.floor(Math.random() * ((max || 1000) - (min || -1000) + 1)) + (min || -1000);
    },

    /**
     * Checks whether the element has given classes
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name for multi classes
     * @returns {boolean}
     */
    hasClass: function (element, className) {
      if (!element || typeof className === 'undefined') return;

      var classesArr = className.split(' ');

      for (var i = 0; i < classesArr.length; i++) {
        let classNew = APPUtil.trim(classesArr[i]),
          hasClass = element.classList
            ? element.classList.contains(classNew)
            : new RegExp('\\b' + classNew + '\\b').test(element.classNew);

        if (!hasClass) return false;
      }

      return true;
    },

    /**
     * Add class to the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    addClass: function (element, className) {
      if (!element || typeof className === 'undefined') return;

      var classNames = className.split(' ');

      if (element.classList) {
        for (var i = 0; i < classNames.length; i++)
          if (classNames[i] && classNames[i].length > 0)
            element.classList.add(APPUtil.trim(classNames[i]));
      } else if (!APPUtil.hasClass(element, className)) {
        for (var x = 0; x < classNames.length; x++)
          element.className += ' ' + APPUtil.trim(classNames[x]);
      }
    },

    /**
     * Remove class from the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to remove multi classes
     */
    removeClass: function (element, className) {
      if (!element || typeof className === 'undefined') return;

      var classNames = className.split(' ');

      if (element.classList)
        for (var i = 0; i < classNames.length; i++)
          element.classList.remove(APPUtil.trim(classNames[i]));
      else if (APPUtil.hasClass(element, className))
        for (var x = 0; x < classNames.length; x++)
          element.className = element.className.replace(
            new RegExp('\\b' + APPUtil.trim(classNames[x]) + '\\b', 'g'),
            ''
          );
    },

    /**
     * Toggle class off the given element
     * @param {object} element jQuery element object
     * @param {string} className string with spaces between every class name to add multi classes
     */
    toggleClass: function (element, className) {
      if (!element || typeof className === 'undefined') return;

      var classNames = className.split(' ');

      if (element.classList) {
        for (var i = 0; i < classNames.length; i++)
          if (classNames[i] && classNames[i].length > 0)
            element.classList.toggle(APPUtil.trim(classNames[i]));
      } else if (!APPUtil.hasClass(element, className)) {
        for (var x = 0; x < classNames.length; x++)
          element.className += ' ' + APPUtil.trim(classNames[x]);
      }
    },

    /**
     * Add Event to the given element
     * @param {object} element jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    addEvent: function (element, type, handler) {
      if (typeof element !== 'undefined' && element !== null)
        element.addEventListener(type, handler);
    },

    /**
     * Remove Event from the given element
     * @param {object} element jQuery element object
     * @param {string} type string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    removeEvent: function (element, type, handler) {
      if (element !== null) element.removeEventListener(type, handler);
    },

    /**
     * Add Event to the given element inner selector
     * @param {object} element jQuery element object
     * @param {string} selector selector string
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {object} handler what run on event (e.g: function)
     */
    on: function (element, selector, event, handler) {
      if (element === null) return;

      var eventId = APPUtil.getUniqueID('event');

      window.APPData.UTIL.DelegatedEventHandlers[eventId] = function (e) {
        var targets = element.querySelectorAll(selector);
        var target = e.target;

        while (target && target !== element) {
          for (var i = 0, j = targets.length; i < j; i++)
            if (target === targets[i]) handler.call(target, e);

          target = target.parentNode;
        }
      };

      APPUtil.addEvent(element, event, window.APPData.UTIL.DelegatedEventHandlers[eventId]);

      return eventId;
    },

    /**
     * Remove Event from the given element inner event ID
     * @param {object} element jQuery element object
     * @param {string} event string for event type (e.g: click, mouseover, ...)
     * @param {string} eventId
     */
    off: function (element, event, eventId) {
      if (!element || !window.APPData.UTIL.DelegatedEventHandlers[eventId]) return;

      APPUtil.removeEvent(element, event, window.APPData.UTIL.DelegatedEventHandlers[eventId]);

      delete window.APPData.UTIL.DelegatedEventHandlers[eventId];
    },

    /**
     * Exchange data to/from a web server.
     * When receiving data from a web server, the data is always a string.
     * Parse the data with parseJson(), and the data becomes a JavaScript object
     * @param {string} value (e.g: Web server data)
     * @returns {object} Data after parsing
     */
    parseJson: function (value) {
      if (typeof value === 'string') {
        value = value.replace(/'/g, '"');

        var jsonStr = value.replace(/(\w+:)|(\w+ :)/g, function (matched) {
          return '"' + matched.substring(0, matched.length - 1) + '":';
        });

        try {
          value = JSON.parse(jsonStr);
        } catch (e) {}
      }

      return value;
    },

    /**
     * Get responsive value from array of values according to breakpoints
     * @param {object} value responsive values (e.g: {default: '100px', lg: '150px', sm: '100px'})
     * default for breakpoint 0
     * @returns {string}
     */
    getResponsiveValue: function (value) {
      var width = this.getViewPort().width;
      var result;

      value = APPUtil.parseJson(value);

      if (typeof value === 'object') {
        var resultKey;
        var resultBreakpoint = -1;
        var breakpoint;

        for (var key in value) {
          if (key === 'default') breakpoint = 0;
          else breakpoint = this.getBreakpoint(key) ? this.getBreakpoint(key) : parseInt(key);

          if (breakpoint <= width && breakpoint > resultBreakpoint) {
            resultKey = key;
            resultBreakpoint = breakpoint;
          }
        }

        if (resultKey) result = value[resultKey];
        else return;
      } else return;

      return result;
    },

    /**
     * Get index of element according to parentNode
     * @param {object} element jQuery element object
     * @returns {number}
     */
    index: function (element) {
      if (!element) return;

      var c = element.parentNode.children,
        i = 0;
      for (; i < c.length; i++) if (c[i] == element) return i;
    },

    /**
     * Removes whitespace from both sides of a string.
     * @param {string} string String to trim
     * @returns {string}
     */
    trim: function (string) {
      return string.trim();
    },

    /**
     * Convert string to legal DOM ID
     * @param {string} string String to convert
     * @param {string} validation (eg: h: for HTML, h5: for HTML5, base64: for base64 ) default: base64
     * @returns {string}
     */
    stringToID: function (string, validation) {
      if (!string) return;

      var newString;

      // base64
      if (!validation || validation === 'base64') {
        string = btoa(string);
        // Check exist
        return document.getElementById(string) ? APPUtil.getUniqueID(string + '_') : string;
      }

      // Remove white spaces from begin & end
      newString = APPUtil.trim(string);

      // Replace inner white spaces to "_"
      newString = string.replace(/ /g, '_');

      // Remove illegal characters from DOM ID for HTML standards
      if (validation === 'h') {
        newString = newString.replace(/[^a-z0-9\-_:\.]|^[^a-z]+/gi, '');
        // Check exist
        return document.getElementById(newString)
          ? APPUtil.getUniqueID(newString + '_')
          : newString;
      }

      // Remove illegal characters from DOM ID for HTML5 standards
      if (validation === 'h5') {
        newString = newString.replace(/\s+/g, '');
        // Check exist
        return document.getElementById(newString)
          ? APPUtil.getUniqueID(newString + '_')
          : newString;
      }

      // base64 (default)
      string = btoa(string);
      // Check exist
      return document.getElementById(string) ? APPUtil.getUniqueID(string + '_') : string;
    },

    /**
     * Removes element from DOM.
     * @param {object} element jQuery element object
     */
    remove: function (element) {
      if (element && element.parentNode) element.parentNode.removeChild(element);
    },

    /**
     * Fid element inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object}
     */
    find: function (parent, query) {
      if (parent !== null) return parent.querySelector(query);
      else return null;
    },

    /**
     * Fid elements inside parent DOM.
     * @param {object} parent jQuery element object
     * @param {string} query selector string
     * @returns {object} Array of objects
     */
    findAll: function (parent, query) {
      if (parent !== null) return parent.querySelectorAll(query);
      else return null;
    },

    /**
     * Insert element after referenceNode inside DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    insertAfter: function (element, referenceNode) {
      return referenceNode.parentNode.insertBefore(element, referenceNode.nextSibling);
    },

    /**
     * Insert element before referenceNode inside DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    insertBefore: function (element, referenceNode) {
      return referenceNode.parentNode.insertBefore(element, referenceNode);
    },

    /**
     * Insert element last on referenceNode DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    append: function (element, referenceNode) {
      return referenceNode.append(element);
    },

    /**
     * Insert element first on referenceNode DOM.
     * @param {object} element jQuery element object
     * @param {object} referenceNode jQuery reference node object
     * @returns {object}
     */
    prepend: function (element, referenceNode) {
      return referenceNode.prepend(element);
    },

    /**
     * Get the offset width & height of element
     * @param {object} element jQuery element object
     * @returns {number}
     */
    offset: function (element) {
      var rect, win;

      if (!element) return;

      // Return zeros for disconnected and hidden (display: none) elements (gh-2310)
      // Support: IE <=11 only
      // Running getBoundingClientRect on a
      // disconnected node in IE throws an error
      if (!element.getClientRects().length) return { top: 0, left: 0 };

      // Get document-relative position by adding viewport scroll to viewport-relative gBCR
      rect = element.getBoundingClientRect();
      win = element.ownerDocument.defaultView;

      return {
        top: rect.top + win.pageYOffset,
        Bottom: element.offsetTop + element.offsetHeight,
        left: rect.left + win.pageXOffset,
        right: window.innerWidth - (element.offsetLeft + element.offsetWidth),
      };
    },

    /**
     * Get the outer width of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerWidth: function (element, withMargin) {
      if (!element) return;

      var width = element.offsetWidth;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(element);
        width += parseInt(style.marginLeft) + parseInt(style.marginRight);

        return width;
      } else return width;
    },

    /**
     * Get the outer height of element
     * @param {object} element jQuery element object
     * @param {boolean} withMargin (e.g: true: if has margin)
     * @returns {number}
     */
    outerHeight: function (element, withMargin) {
      if (!element) return;

      var height = element.offsetHeight;
      var style;

      if (typeof withMargin !== 'undefined' && withMargin === true) {
        style = getComputedStyle(element);
        height += parseInt(style.marginTop) + parseInt(style.marginBottom);

        return height;
      } else return height;
    },

    /**
     * Get Document width
     * @returns {number}
     */
    getDocumentWidth: function () {
      var body = document.body;
      var html = document.documentElement;

      return Math.max(
        body.scrollWidth,
        body.offsetWidth,
        html.clientWidth,
        html.scrollWidth,
        html.offsetWidth
      );
    },

    /**
     * Get Document height
     * @returns {number}
     */
    getDocumentHeight: function () {
      var body = document.body;
      var html = document.documentElement;

      return Math.max(
        body.scrollHeight,
        body.offsetHeight,
        html.clientHeight,
        html.scrollHeight,
        html.offsetHeight
      );
    },

    /**
     * Check if element is visible
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    visible: function (element) {
      if (!element) return;

      return !(element.offsetWidth === 0 && element.offsetHeight === 0);
    },

    /**
     * Show element
     * @param {object} element jQuery element object
     * @param {string} display display type (e.g: block, inline, none ...)
     */
    show: function (element, display) {
      if (typeof element !== 'undefined') element.style.display = display ? display : 'block';
    },

    /**
     * Hide element
     * @param {object} element jQuery element object
     */
    hide: function (el) {
      if (typeof el !== 'undefined') el.style.display = 'none';
    },

    /**
     * Check if element is in viewport
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    isInViewport: function (element) {
      if (!element) return;

      var rect = element.getBoundingClientRect();

      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Check if part of element is in viewport
     * @param {object} element jQuery element object
     * @returns {boolean}
     */
    isPartInViewport: function (element) {
      if (!element) return;

      var rect = element.getBoundingClientRect();

      return (
        rect.bottom > 0 &&
        rect.right > 0 &&
        rect.top < (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left < (window.innerWidth || document.documentElement.clientWidth)
      );
    },

    /**
     * Run callback on DOM content loaded
     * @param {function} callback (e.g: function)
     */
    onDOMContentLoaded: function (callback) {
      if (typeof callback !== 'function') return;

      if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', callback);
      else callback();
    },

    /**
     * Check if loaded in Iframe
     * @returns {boolean}
     */
    inIframe: function () {
      try {
        return window.self !== window.top;
      } catch (e) {
        return true;
      }
    },

    /**
     * Set / Get attribute
     * @param {object} element jQuery element object
     * @param {string} attribute attribute name
     * @param {string} value attribute value (remove if want to get attribute value)
     */
    attr: function (element, attribute, value) {
      if (!element) return;

      if (value !== undefined && value !== null) element.setAttribute(attribute, value);
      else if (!attribute && attribute !== null) return;
      else if (element.getAttribute(attribute) == '') return true;
      else return element.getAttribute(attribute);
    },

    /**
     * Set multiple attributes
     * @param {object} element jQuery element object
     * @param {object} attributes Array of attributes (e.g: {name: value, name2: value2})
     */
    attrs: function (element, attributes) {
      if (!element || !attributes) return;

      Object.keys(attributes).forEach((attr) => {
        APPUtil.attr(element, attr, attributes[attr]);
      });
    },

    /**
     * Check if element has attribute
     * @param {object} element jQuery element object
     * @param {string} attributes attribute name (e.g: {name: value, name2: value2})
     * @returns {boolean}
     */
    hasAttr: function (element, attribute) {
      if (!element || !attribute) return;

      return element.hasAttribute(attribute) ? true : false;
    },

    /**
     * Remove element with attribute
     * @param {object} element jQuery element object
     * @param {string} attribute attribute name
     * @returns {boolean}
     */
    removeAttr: function (element, attribute) {
      if (!element || !attribute) return;

      element.removeAttribute(attribute);
    },

    /**
     * Get/Set inline style to element
     * @param {object} element jQuery element object
     * @param {string} styleProp style properties name
     * @param {string} value style properties value
     * Don't add if you want to get style
     * or add empty string to remove style property
     * @param {boolean} important Important status (true, false), add if required
     * @returns {string} In get case
     */
    css: function (element, styleProp, value, important) {
      if (!element || !styleProp) return;

      if (value !== undefined)
        if (important === true) element.style.setProperty(styleProp, value, 'important');
        else element.style[styleProp] = value;
      else {
        var defaultView = (element.ownerDocument || document).defaultView;

        // W3C standard way:
        if (defaultView && defaultView.getComputedStyle) {
          // sanitize property name to css notation
          // (hyphen separated words eg. font-Size)
          styleProp = styleProp.replace(/([A-Z])/g, '-$1').toLowerCase();

          return defaultView.getComputedStyle(element, null).getPropertyValue(styleProp);
        } else if (element.currentStyle) {
          // IE
          // sanitize property name to camelCase
          styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
            return letter.toUpperCase();
          });

          value = element.currentStyle[styleProp];

          // convert other units to pixels on IE
          if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
            return (function (value) {
              var oldLeft = element.style.left,
                oldRsLeft = element.runtimeStyle.left;

              element.runtimeStyle.left = element.currentStyle.left;
              element.style.left = value || 0;
              value = element.style.pixelLeft + 'px';
              element.style.left = oldLeft;
              element.runtimeStyle.left = oldRsLeft;

              return value;
            })(value);
          }

          return value;
        }
      }
    },

    /**
     * Get CSS Variable value
     * @param {string} variableName required variable name
     * @returns {string} variable value
     */
    getCssVariableValue: function (variableName) {
      if (!variableName) return;

      var hex = getComputedStyle(document.documentElement).getPropertyValue(variableName);
      if (hex && hex.length > 0) hex = hex.trim();

      return hex;
    },

    /**
     * Get CSS height value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    height: function (element) {
      if (!element) return;

      return APPUtil.css(element, 'height');
    },

    /**
     * Get CSS width value
     * @param {object} element jQuery element object
     * @returns {string} variable value
     */
    width: function (element) {
      if (!element) return;

      return APPUtil.css(element, 'width');
    },

    /**
     * Get scrolled element value
     * @param {object} element jQuery element object
     * @param {string} method The passed in `method` value should be 'Top' or 'Left'
     * @returns {number}
     */
    getScroll: function (element, method) {
      if (!element || !method || method !== 'Top' || method !== 'Left') return;

      method = 'scroll' + method;
      return element == window || element == document
        ? self[method == 'scrollTop' ? 'pageYOffset' : 'pageXOffset'] ||
            (browserSupportsBoxModel && document.documentElement[method]) ||
            document.body[method]
        : element[method];
    },

    /**
     * Scroll to element
     * @param {object} target jQuery element object
     * @param {number} offset Offset value (e.g: 100)
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     * @param {string | function} easing Optional: A string when the easing function is
     * available in TinyAnimate.easings, or a function with the signature: function(t, b, c, d) {...}
     */
    scrollTo: function (target, offset) {
      if (typeof target === undefined) return;

      var targetPos = target ? APPUtil.offset(target).top : 0;

      if (typeof offset === 'number') targetPos = targetPos - offset;

      window.scroll({
        top: targetPos,
        behavior: 'smooth',
      });
    },

    /**
     * Scroll to Top
     * @param {number} offset Offset value (e.g: 100)
     * @param {number} duration Duration in milliseconds (e.g: 2000 - for 2 seconds)
     */
    scrollTop: function (offset) {
      offset = typeof offset === 'number' ? offset * -1 : 0;

      APPUtil.scrollTo(null, offset);
    },

    /**
     * Get document scroll top
     * @returns {number}
     */
    getScrollTop: function () {
      return (document.scrollingElement || document.documentElement).scrollTop;
    },

    /**
     * Get site direction
     * @returns {string}
     */
    getDir: function () {
      if (APPUtil.attr(document.querySelector('html'), 'dir'))
        return APPUtil.attr(document.querySelector('html'), 'dir');
      return 'ltr';
    },

    /**
     * Check if Site is RTL (Right to Left view)
     * @returns {boolean}
     */
    isRTL: function () {
      return APPUtil.getDir() === 'rtl' ? true : false;
    },

    /**
     * Set / Remove inner element HTML
     * @param {object} element jQuery element object
     * @param {object, string} html leave empty or don't enter to remove element content
     */
    setHTML: function (element, html) {
      if (!element) return;

      html = html ? html : '';
      element.innerHTML = html;
    },

    /**
     * Get inner element HTML
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getHTML: function (element) {
      if (element) return element.innerHTML;
    },

    /**
     * Set / Remove inner element Text
     * @param {object} element jQuery element object
     * @param {string} text leave empty or don't enter to remove element text
     */
    setTEXT: function (element, text) {
      if (!element) return;

      text = text ? text : '';
      element.innerText = text;
    },

    /**
     * Set inner element Text
     * @param {object} element jQuery element object
     * @returns {string}
     */
    getTEXT: function (element) {
      if (element) return element.innerText;
    },

    /**
     * Loop multi elements
     * @param {object} array Array of objects
     * @param {function} callback Function call
     */
    each: function (array, callback) {
      return [].slice.call(array).map(callback);
    },

    /**
     * Set app color mode
     * @param {string} mode The passed in `mode` value must be 'light' or 'dark'
     */
    setColorMode: function (mode) {
      if (['light', 'dark'].includes(mode))
        APPUtil.attr(document.querySelector('html'), 'data-color-mode', mode);
    },

    /**
     * Get app color mode
     * @returns {string}
     */
    getColorMode: function () {
      return APPUtil.attr(document.querySelector('html'), 'data-color-mode');
    },

    /**
     * Set app theme
     * @param {string} theme The passed in `mode` value must be
     *     'regular' or 'high_contrast' or 'colorblind'
     */
    setTheme: function (theme) {
      if (['regular', 'high_contrast', 'colorblind'].includes(theme))
        APPUtil.attr(document.querySelector('html'), 'data-theme', theme);
    },

    /**
     * Get app theme
     * @returns {string}
     */
    getTheme: function () {
      return APPUtil.attr(document.querySelector('html'), 'data-theme');
    },

    /**
     * Get Site language
     * @returns {string}
     */
    getSiteLanguage: function () {
      if (APPUtil.attr(document.querySelector('html'), 'lang'))
        return APPUtil.attr(document.querySelector('html'), 'lang');
      return 'en';
    },

    /**
     * Get browser
     * @returns {object}
     */
    getBrowser: function () {
      const data = {
        header: [
          navigator.platform,
          navigator.userAgent,
          navigator.appVersion,
          navigator.vendor,
          window.opera,
        ],
        browser: [
          { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
          { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
          { name: 'Safari', value: 'Safari', version: 'Version' },
          { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
          { name: 'Opera', value: 'Opera', version: 'Opera' },
          { name: 'BlackBerry', value: 'CLDC', version: 'CLDC' },
          { name: 'Mozilla', value: 'Mozilla', version: 'Mozilla' },
        ],
      };

      var matchItem = function (string, data) {
        var i = 0,
          j = 0,
          html = '',
          regex,
          regexv,
          match,
          matches,
          version;

        for (i = 0; i < data.length; i += 1) {
          regex = new RegExp(data[i].value, 'i');
          match = regex.test(string);
          if (match) {
            regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
            matches = string.match(regexv);
            version = '';
            if (matches) {
              if (matches[1]) {
                matches = matches[1];
              }
            }
            if (matches) {
              matches = matches.split(/[._]+/);
              for (j = 0; j < matches.length; j += 1) {
                if (j === 0) {
                  version += matches[j] + '.';
                } else {
                  version += matches[j];
                }
              }
            } else {
              version = '0';
            }
            return {
              name: data[i].name,
              version: parseFloat(version),
            };
          }
        }
        return { name: 'unknown', version: 0 };
      };

      var agent = data.header.join(' '),
        browser = matchItem(agent, data.browser);

      return {
        name: browser.name,
        version: browser.version,
        language:
          (
            window.navigator.userLanguage ||
            window.navigator.language ||
            window.navigator.browserLanguage ||
            window.navigator.systemLanguage
          ).slice(0, 2) || '',
      };
    },

    /**
     * Get OS
     * @returns {object}
     */
    getOS: function () {
      const data = {
        header: [
          navigator.platform,
          navigator.userAgent,
          navigator.appVersion,
          navigator.vendor,
          window.opera,
        ],
        os: [
          { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
          { name: 'Windows', value: 'Win', version: 'NT' },
          { name: 'iPhone', value: 'iPhone', version: 'OS' },
          { name: 'iPad', value: 'iPad', version: 'OS' },
          { name: 'Kindle', value: 'Silk', version: 'Silk' },
          { name: 'Android', value: 'Android', version: 'Android' },
          { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
          { name: 'BlackBerry', value: 'BlackBerry', version: '/' },
          { name: 'Macintosh', value: 'Mac', version: 'OS X' },
          { name: 'Linux', value: 'Linux', version: 'rv' },
          { name: 'Palm', value: 'Palm', version: 'PalmOS' },
        ],
      };

      var matchItem = function (string, data) {
        var i = 0,
          j = 0,
          html = '',
          regex,
          regexv,
          match,
          matches,
          version;

        for (i = 0; i < data.length; i += 1) {
          regex = new RegExp(data[i].value, 'i');
          match = regex.test(string);
          if (match) {
            regexv = new RegExp(data[i].version + '[- /:;]([\\d._]+)', 'i');
            matches = string.match(regexv);
            version = '';
            if (matches) {
              if (matches[1]) {
                matches = matches[1];
              }
            }
            if (matches) {
              matches = matches.split(/[._]+/);
              for (j = 0; j < matches.length; j += 1) {
                if (j === 0) {
                  version += matches[j] + '.';
                } else {
                  version += matches[j];
                }
              }
            } else {
              version = '0';
            }
            return {
              name: data[i].name,
              version: parseFloat(version),
            };
          }
        }
        return { name: 'unknown', version: 0 };
      };

      var agent = data.header.join(' '),
        os = matchItem(agent, data.os);

      return {
        name: os.name,
        version: os.version,
      };
    },

    /**
     * Get Mutation Observer
     * @param {object} element jQuery element object
     * @param {object} options Array of options
     * @param {function} callback Function call
     */
    mutationObserver: function (element, options, callback) {
      const mutationObserver = new MutationObserver(function (mutationsList, observer) {
        callback();
      });
      mutationObserver.observe(element, options);
    },
  };
})();

('use strict');

// App
// Class definition
var APP = (function () {
  var initHello = function () {
    const PROVIDER = window.APPData.INFO.PROVIDER,
      PROVIDER_INFO = window.APPData.INFO.PROVIDER_INFO,
      PROVIDER_LINK = window.APPData.INFO.PROVIDER_LINK,
      PROJECT = window.APPData.INFO.PROJECT,
      PROJECT_INFO = window.APPData.INFO.PROJECT_INFO,
      VERSION = window.APPData.INFO.VERSION;

    // Check if Chrome
    if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
      // Message
      const _log = [
        `\n%c  ${PROVIDER}  %c \n${PROVIDER_INFO} \n${PROVIDER_LINK}  \n\n${PROJECT} - ${VERSION} %c  \n${PROJECT_INFO}`,
        'color: #fff; border: 1px solid #22447B; background: #22447B; padding:5px;',
        'border: none; padding:5px 5px 0;',
        'border: none; padding:0 5px 5px;',
      ];

      // View message in console log
      setTimeout(console.log.bind(console, ..._log));
    } else if (window.console)
      setTimeout(
        console.log.bind(
          console,
          `\n  ${PROVIDER}  \n ${PROVIDER_INFO}  \n ${PROVIDER_LINK} \n ${PROJECT}  \n ${PROJECT_INFO}\n`
        )
      );
  };

  var initPageLoader = function () {
    // On window load
    window.addEventListener('load', () => {
      APPUtil.removeClass(document.body, 'page-loading');
    });

    // On page before unload
    window.addEventListener('beforeunload', () => {
      APPUtil.addClass(document.body, 'page-loading');
      // return document.body.classList.add('page-loading');
    });
  };

  var initBootstrapTooltip = function (el, options) {
    var delay = {};

    // Return if element is undefined or null
    if (!el) return;

    // Set options if is undefined of null
    if (!options) options = {};

    // Handle delay options
    if (el.hasAttribute('data-bs-delay-hide')) {
      delay['hide'] = el.getAttribute('data-bs-delay-hide');
    }

    if (el.hasAttribute('data-bs-delay-show')) {
      delay['show'] = el.getAttribute('data-bs-delay-show');
    }

    if (delay) {
      options['delay'] = delay;
    }

    // Check dismiss options
    if (el.hasAttribute('data-bs-dismiss') && el.getAttribute('data-bs-dismiss') == 'click') {
      options['dismiss'] = 'click';
    }

    // Initialize popover
    var tp = new bootstrap.Tooltip(el, options);

    // Handle dismiss
    if (options['dismiss'] && options['dismiss'] === 'click') {
      // Hide popover on element click
      el.addEventListener('click', function (e) {
        tp.hide();
      });
    }

    return tp;
  };

  var initBootstrapTooltips = function (options) {
    APPUtil.each(
      document.querySelectorAll('[data-bs-toggle="tooltip"]'),
      function (tooltipTriggerEl) {
        if (!APPUtil.isTouchDevice())
          if (options) initBootstrapTooltip(tooltipTriggerEl, options);
          else initBootstrapTooltip(tooltipTriggerEl, {});
      }
    );
  };

  var initBootstrapPopover = function (el, options) {
    var delay = {};

    // Return if element is undefined or null
    if (!el) return;

    // Set options if is undefined of null
    if (!options) options = {};

    // Handle delay options
    if (el.hasAttribute('data-bs-delay-hide')) {
      delay['hide'] = el.getAttribute('data-bs-delay-hide');
    }

    if (el.hasAttribute('data-bs-delay-show')) {
      delay['show'] = el.getAttribute('data-bs-delay-show');
    }

    if (delay) {
      options['delay'] = delay;
    }

    // Handle dismiss option
    if (el.getAttribute('data-bs-dismiss') == 'true') {
      options['dismiss'] = true;
    }

    if (options['dismiss'] === true) {
      options['template'] =
        '<div class="popover" role="tooltip"><div class="popover-arrow"></div><span class="popover-dismiss btn btn-icon"><i class="bi bi-x fs-2"></i></span><h3 class="popover-header"></h3><div class="popover-body"></div></div>';
    }

    // Initialize popover
    var popover = new bootstrap.Popover(el, options);

    // Handle dismiss click
    if (options['dismiss'] === true) {
      var dismissHandler = function (e) {
        popover.hide();
      };

      el.addEventListener('shown.bs.popover', function () {
        var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
        dismissEl.addEventListener('click', dismissHandler);
      });

      el.addEventListener('hide.bs.popover', function () {
        var dismissEl = document.getElementById(el.getAttribute('aria-describedby'));
        dismissEl.removeEventListener('click', dismissHandler);
      });
    }

    return popover;
  };

  var initBootstrapPopovers = function (options) {
    APPUtil.each(
      document.querySelectorAll('[data-bs-toggle="popover"]'),
      function (popoverTrigger) {
        if (options) initBootstrapPopover(popoverTrigger, options);
        else initBootstrapPopover(popoverTrigger, {});
      }
    );
  };

  var initScrollSpy = function () {
    APPUtil.each(document.querySelectorAll('[data-bs-spy="scroll"]'), function (element) {
      var sel = element.getAttribute('data-bs-target');
      var scrollContent = document.querySelector(sel);
      var scrollSpy = bootstrap.ScrollSpy.getInstance(scrollContent);
      if (scrollSpy) {
        scrollSpy.refresh();
      }
    });
  };

  var initMainNav = function () {
    const mainNavToggler = document.querySelector('#mainNavToggler');
    const mainNav = document.querySelector('.navbar .main-navbar > .navbar-nav.main');
    const mainNavOverlay = document.querySelector('.navbar .main-navbar > .overlay');

    APPUtil.addEvent(mainNavToggler, 'click', function (e) {
      APPUtil.toggleClass(mainNavToggler, 'show');
      APPUtil.toggleClass(mainNav, 'show');
      APPUtil.toggleClass(mainNavOverlay, 'show');
      APPUtil.toggleClass(document.body, 'overflow-hidden');
    });

    APPUtil.addEvent(mainNavOverlay, 'click', function (e) {
      APPUtil.toggleClass(mainNavToggler, 'show');
      APPUtil.toggleClass(mainNav, 'show');
      APPUtil.toggleClass(mainNavOverlay, 'show');
      APPUtil.toggleClass(document.body, 'overflow-hidden');
    });
  };

  var initSplide = function () {
    const splideContainer = document.querySelectorAll('[data-holol-carousel]');
    APPUtil.each(splideContainer, (splide) => {
      var splideEl;
      var type = APPUtil.attr(splide, 'data-holol-carousel-type');
      if (type === 'master')
        splideEl = new Splide(splide, {
          direction: 'rtl',
          arrows: true,
          pagination: false,
          drag: 'free',
          snap: true,
          trimSpace: false,
          gap: '3rem',
          perPage: 3,
          perMove: 1,
          breakpoints: {
            992: { perPage: 2 },
            768: { perPage: 1 },
          },
        });
      else splideEl = new Splide(splide);
      splideEl.mount();
    });
  };

  var initScrollTop = function () {
    const scrollElement = document.querySelector('[data-holol-scroll-top]');

    if (scrollElement) {
      // scroll to view
      APPUtil.addEvent(document, 'scroll', function (e) {
        if (window.scrollY > 200) APPUtil.addClass(scrollElement, 'show');
        else APPUtil.removeClass(scrollElement, 'show');
      });

      APPUtil.addEvent(scrollElement, 'click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  var initLazyLoad = function () {
    window.APPData.LAZYLOAD_INSTANCE = new LazyLoad({
      // Your custom settings go here
    });
  };

  var initAnimationOnScroll = function () {
    const animationOnScroll = document.querySelectorAll('.aos');

    APPUtil.each(animationOnScroll, (el) => {
      if (!APPUtil.hasClass(el, 'aos-show')) {
        if (APPUtil.isPartInViewport(el)) APPUtil.addClass(el, 'aos-show');

        window.addEventListener('scroll', viewElement);

        function viewElement() {
          if (APPUtil.isPartInViewport(el)) {
            APPUtil.addClass(el, 'aos-show');

            window.removeEventListener('scroll', viewElement);
          }
        }
      }
    });
  };

  // Public methods
  return {
    init: function () {
      console.log('App initialize');
      this.initHello(window.APPData.PROVIDER, window.APPData.VERSION, window.APPData.LINK);
      this.initPageLoader();
      this.initBootstrapTooltip();
      this.initBootstrapTooltips();
      this.initBootstrapPopover();
      this.initBootstrapPopovers();
      this.initScrollSpy();
      this.initMainNav();
      this.initSplide();
      this.initScrollTop();
      this.initLazyLoad();
      this.initAnimationOnScroll();
    },

    initHello: function (provider, version, link) {
      initHello(provider, version, link);
    },

    initPageLoader: function () {
      initPageLoader();
    },

    initBootstrapTooltip: function (el, options) {
      return initBootstrapTooltip(el, options);
    },

    initBootstrapTooltips: function () {
      initBootstrapTooltips();
    },

    initBootstrapPopovers: function () {
      initBootstrapPopovers();
    },

    initBootstrapPopover: function (el, options) {
      return initBootstrapPopover(el, options);
    },

    initScrollSpy: function () {
      initScrollSpy();
    },

    initMainNav: function () {
      initMainNav();
    },

    initSplide: function () {
      initSplide();
    },

    initScrollTop: function () {
      initScrollTop();
    },

    initLazyLoad: function () {
      initLazyLoad();
    },

    initAnimationOnScroll: function () {
      initAnimationOnScroll();
    },
  };
})();

//                         __          ___     _            _
//      /\                 \ \        / (_)   | |          | |
//     /  \   _ __  _ __    \ \  /\  / / _  __| | __ _  ___| |_ ___
//    / /\ \ | '_ \| '_ \    \ \/  \/ / | |/ _` |/ _` |/ _ \ __/ __|
//   / ____ \| |_) | |_) |    \  /\  /  | | (_| | (_| |  __/ |_\__ \
//  /_/    \_\ .__/| .__/      \/  \/   |_|\__,_|\__, |\___|\__|___/
//           | |   | |                            __/ |
//           |_|   |_|                           |___/
// App Widgets
('use strict');

// Class definition
var APPWidgets = (function () {
  // Public methods
  return {
    init: function () {
      console.log('Widgets initialize');
    },
  };
})();

// On document ready
APPUtil.onDOMContentLoaded(() => {
  // App initialize
  APP.init();

  // Widgets initialize
  APPWidgets.init();
});
