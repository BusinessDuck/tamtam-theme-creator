(function () {
    'use strict';

    /**
     * Shorthand for `elem.appendChild()` for better minification
     */
    function appendChild(element, node) {
        return element.appendChild(node);
    }
    /**
     * Creates element with given tag name
     * @param cssScope Scope for CSS isolation
     */
    function elem(tagName, cssScope) {
        return isolateElement(document.createElement(tagName), cssScope);
    }
    /**
     * Isolates given element with CSS scope
     */
    function isolateElement(el, cssScope) {
        cssScope && el.setAttribute(cssScope, '');
        return el;
    }
    /**
     * @returns Inserted item
     */
    function domInsert(node, parent, anchor) {
        return anchor
            ? parent.insertBefore(node, anchor)
            : parent.appendChild(node);
    }
    /**
     * Removes given DOM node from its tree
     * @param {Node} node
     */
    function domRemove(node) {
        const { parentNode } = node;
        parentNode && parentNode.removeChild(node);
    }
    /**
     * Returns textual representation of given `value` object
     */
    // function textValue(value: any): string {
    // 	return value != null ? value : '';
    // }

    const animatingKey = '$$animating';
    /**
     * Creates fast object
     */
    function obj(proto = null) {
        return Object.create(proto);
    }
    /**
     * Check if given value id defined, e.g. not `null`, `undefined` or `NaN`
     */
    function isDefined(value) {
        return value != null && value === value;
    }
    // tslint:disable-next-line:only-arrow-functions
    const assign = Object.assign || function (target) {
        for (let i = 1, source; i < arguments.length; i++) {
            source = arguments[i];
            for (const p in source) {
                if (source.hasOwnProperty(p)) {
                    target[p] = source[p];
                }
            }
        }
        return target;
    };
    /**
     * Returns property descriptors from given object
     */
    // tslint:disable-next-line:only-arrow-functions
    const getObjectDescriptors = Object['getOwnPropertyDescriptors'] || function (source) {
        const descriptors = obj();
        const props = Object.getOwnPropertyNames(source);
        for (let i = 0, prop, descriptor; i < props.length; i++) {
            prop = props[i];
            descriptor = Object.getOwnPropertyDescriptor(source, prop);
            if (descriptor != null) {
                descriptors[prop] = descriptor;
            }
        }
        return descriptors;
    };
    /**
     * Represents given attribute value in element
     * @param {Element} elem
     * @param {string} name
     * @param {*} value
     */
    function representAttributeValue(elem, name, value) {
        const type = typeof (value);
        if (type === 'boolean') {
            value = value ? '' : null;
        }
        else if (type === 'function') {
            value = '𝑓';
        }
        else if (Array.isArray(value)) {
            value = '[]';
        }
        else if (isDefined(value) && type === 'object') {
            value = '{}';
        }
        isDefined(value) ? elem.setAttribute(name, value) : elem.removeAttribute(name);
    }
    function captureError(host, fn, arg1, arg2) {
        try {
            return fn && fn(arg1, arg2);
        }
        catch (error) {
            runtimeError(host, error);
            // tslint:disable-next-line:no-console
            console.error(error);
        }
    }
    function runtimeError(host, error) {
        if (typeof CustomEvent !== 'undefined') {
            host.dispatchEvent(new CustomEvent('runtime-error', {
                bubbles: true,
                cancelable: true,
                detail: { error, host }
            }));
        }
        else {
            throw error;
        }
    }
    function safeEventListener(host, handler) {
        // tslint:disable-next-line:only-arrow-functions
        return function (event) {
            try {
                handler.call(this, event);
            }
            catch (error) {
                runtimeError(host, error);
                // tslint:disable-next-line:no-console
                console.error(error);
            }
        };
    }
    /**
     * Alias for `elem.setAttribute`
     */
    function setAttribute(elem, name, value) {
        elem.setAttribute(name, value);
        return value;
    }
    /**
     * Alias for `elem.className`
     */
    function setClass(elem, value) {
        elem.className = value;
        return value;
    }
    /**
     * Sets attribute value as expression. Unlike regular primitive attributes,
     * expression values must be represented, e.g. non-primitive values must be
     * converted to string representations. Also, expression resolved to `false`,
     * `null` or `undefined` will remove attribute from element
     */
    function setAttributeExpression(elem, name, value) {
        const primitive = representedValue(value);
        primitive === null
            ? elem.removeAttribute(name)
            : setAttribute(elem, name, primitive);
        return value;
    }
    /**
     * Updates attribute value only if it’s not equal to previous value
     */
    function updateAttributeExpression(elem, name, value, prevValue) {
        return prevValue !== value
            ? setAttributeExpression(elem, name, value)
            : value;
    }
    /**
     * Returns normalized list of class names from given string
     */
    function classNames(str) {
        const out = [];
        if (isDefined(str)) {
            const parts = String(str).split(/\s+/);
            for (let i = 0, cl; i < parts.length; i++) {
                cl = parts[i];
                if (cl && out.indexOf(cl) === -1) {
                    out.push(cl);
                }
            }
        }
        return out;
    }
    /**
     * Returns represented attribute value for given data
     */
    function representedValue(value) {
        if (value === false || !isDefined(value)) {
            return null;
        }
        if (value === true) {
            return '';
        }
        if (Array.isArray(value)) {
            return '[]';
        }
        if (typeof value === 'function') {
            return '𝑓';
        }
        if (typeof value === 'object') {
            return '{}';
        }
        return value;
    }

    /**
     * Creates linted list
     */
    /**
     * Creates linked list item
     */
    function createListItem(value) {
        return { value, next: null, prev: null };
    }
    /**
     * Prepends given value to linked list
     */
    function listPrependValue(list, value) {
        const item = createListItem(value);
        if (item.next = list.head) {
            item.next.prev = item;
        }
        return list.head = item;
    }
    /**
     * Inserts given value after given `ref` item
     */
    function listInsertValueAfter(value, ref) {
        const item = createListItem(value);
        const { next } = ref;
        ref.next = item;
        item.prev = ref;
        if (item.next = next) {
            next.prev = item;
        }
        return item;
    }
    /**
     * Detaches list fragment with `start` and `end` from list
     */
    function listDetachFragment(list, start, end) {
        const { prev } = start;
        const { next } = end;
        if (prev) {
            prev.next = next;
        }
        else {
            list.head = next;
        }
        if (next) {
            next.prev = prev;
        }
        start.prev = end.next = null;
    }

    /**
     * Creates injector instance for given target, if required
     */
    function createInjector(target) {
        return {
            parentNode: target,
            head: null,
            ptr: null,
            // NB create `slots` placeholder to promote object to hidden class.
            // Do not use any additional function argument for adding value to `slots`
            // to reduce runtime checks and keep functions in monomorphic state
            slots: null
        };
    }
    /**
     * Inserts given node into current context
     */
    function insert(injector, node, slotName = '') {
        const { slots, ptr } = injector;
        const target = slots
            ? getSlotContext(injector, slotName).element
            : injector.parentNode;
        domInsert(node, target, ptr ? getAnchorNode(ptr.next, target) : void 0);
        injector.ptr = ptr ? listInsertValueAfter(node, ptr) : listPrependValue(injector, node);
        return node;
    }
    /**
     * Injects given block
     */
    function injectBlock(injector, block) {
        const { ptr } = injector;
        if (ptr) {
            block.end = listInsertValueAfter(block, ptr);
            block.start = listInsertValueAfter(block, ptr);
        }
        else {
            block.end = listPrependValue(injector, block);
            block.start = listPrependValue(injector, block);
        }
        block.$$block = true;
        injector.ptr = block.end;
        return block;
    }
    /**
     * Returns named slot context from given component input’s injector. If slot context
     * doesn’t exists, it will be created
     */
    function getSlotContext(injector, name) {
        const slots = injector.slots;
        return slots[name] || (slots[name] = createSlotContext(name));
    }
    /**
     * Empties content of given block
     */
    function emptyBlockContent(block) {
        const unmount = block.mount && block.mount.dispose;
        if (unmount) {
            unmount(block.scope, block.host);
        }
        let item = block.start.next;
        while (item && item !== block.end) {
            // tslint:disable-next-line:prefer-const
            let { value, next, prev } = item;
            if (isBlock(value)) {
                next = value.end.next;
                disposeBlock(value);
            }
            else if (!value[animatingKey]) {
                domRemove(value);
            }
            // NB: Block always contains `.next` and `.prev` items which are block
            // bounds so we can safely skip null check here
            prev.next = next;
            next.prev = prev;
            item = next;
        }
    }
    /**
     * Disposes given block
     */
    function disposeBlock(block) {
        emptyBlockContent(block);
        listDetachFragment(block.injector, block.start, block.end);
        // @ts-ignore: Nulling disposed object
        block.start = block.end = null;
    }
    /**
     * Check if given value is a block
     */
    function isBlock(obj) {
        return '$$block' in obj;
    }
    /**
     * Get DOM node nearest to given position of items list
     */
    function getAnchorNode(item, parent) {
        while (item) {
            if (item.value.parentNode === parent) {
                return item.value;
            }
            item = item.next;
        }
    }
    /**
     * Creates context for given slot
     */
    function createSlotContext(name) {
        const element = document.createElement('slot');
        name && element.setAttribute('name', name);
        return {
            name,
            element,
            isDefault: false,
            defaultContent: null
        };
    }

    /**
     * Walks over each definition (including given one) and runs callback on it
     */
    function walkDefinitions(component, definition, fn) {
        captureError(component, fn, definition);
        const { plugins } = definition;
        if (plugins) {
            for (let i = 0; i < plugins.length; i++) {
                walkDefinitions(component, plugins[i], fn);
            }
        }
    }
    /**
     * Same as `walkDefinitions` but runs in reverse order
     */
    function reverseWalkDefinitions(component, definition, fn) {
        const { plugins } = definition;
        if (plugins) {
            let i = plugins.length;
            while (i--) {
                reverseWalkDefinitions(component, plugins[i], fn);
            }
        }
        captureError(component, fn, definition);
    }
    /**
     * Invokes `name` hook for given component definition
     */
    function runHook(component, name, arg1, arg2) {
        walkDefinitions(component, component.componentModel.definition, dfn => {
            const hook = dfn[name];
            if (typeof hook === 'function') {
                hook(component, arg1, arg2);
            }
        });
    }
    /**
     * Sets given object as current component scope
     */
    function setScope(host, scope) {
        return host.componentModel.vars = scope;
    }
    /**
     * Returns current variable scope
     */
    function getScope(elem) {
        return elem.componentModel.vars;
    }
    function notifySlotUpdate(host, ctx) {
        runHook(host, 'didSlotUpdate', ctx.name, ctx.element);
    }

    let renderQueue = null;
    /**
     * Creates Endorphin DOM component with given definition
     */
    function createComponent(name, definition, host) {
        let cssScope;
        let root;
        if (host && 'componentModel' in host) {
            cssScope = host.componentModel.definition.cssScope;
            root = host.root || host;
        }
        const element = elem(name, cssScope);
        // Add host scope marker: we can’t rely on tag name since component
        // definition is bound to element in runtime, not compile time
        if (definition.cssScope) {
            element.setAttribute(definition.cssScope + '-host', '');
        }
        const { props, state, extend, events } = prepare(element, definition);
        element.refs = obj();
        element.props = obj();
        element.state = state;
        element.componentView = element; // XXX Should point to Shadow Root in Web Components
        root && (element.root = root);
        addPropsState(element);
        if (extend) {
            Object.defineProperties(element, extend);
        }
        if (definition.store) {
            element.store = definition.store();
        }
        else if (root && root.store) {
            element.store = root.store;
        }
        // Create slotted input
        const input = createInjector(element.componentView);
        input.slots = obj();
        element.componentModel = {
            definition,
            input,
            vars: obj(),
            mounted: false,
            rendering: false,
            update: void 0,
            queued: false,
            events,
            defaultProps: props
        };
        runHook(element, 'init');
        return element;
    }
    /**
     * Mounts given component
     */
    function mountComponent(component, props) {
        const { componentModel } = component;
        const { input, definition } = componentModel;
        const changes = setPropsInternal(component, props || componentModel.defaultProps);
        const arg = changes || {};
        componentModel.rendering = true;
        // Notify slot status
        for (const p in input.slots) {
            notifySlotUpdate(component, input.slots[p]);
        }
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willMount', arg);
        runHook(component, 'willRender', arg);
        componentModel.update = captureError(component, definition.default, component, getScope(component));
        componentModel.mounted = true;
        componentModel.rendering = false;
        runHook(component, 'didRender', arg);
        runHook(component, 'didMount', arg);
    }
    /**
     * Queues next component render
     */
    function renderNext(component, changes) {
        if (!component.componentModel.rendering) {
            renderComponent(component, changes);
        }
        else {
            scheduleRender(component, changes);
        }
    }
    /**
     * Schedules render of given component on next tick
     */
    function scheduleRender(component, changes) {
        if (!component.componentModel.queued) {
            component.componentModel.queued = true;
            if (renderQueue) {
                renderQueue.push(component, changes);
            }
            else {
                renderQueue = [component, changes];
                requestAnimationFrame(drainQueue);
            }
        }
    }
    /**
     * Renders given component
     */
    function renderComponent(component, changes) {
        const { componentModel } = component;
        const arg = changes || {};
        componentModel.queued = false;
        componentModel.rendering = true;
        if (changes) {
            runHook(component, 'didChange', arg);
        }
        runHook(component, 'willUpdate', arg);
        runHook(component, 'willRender', arg);
        captureError(component, componentModel.update, component, getScope(component));
        componentModel.rendering = false;
        runHook(component, 'didRender', arg);
        runHook(component, 'didUpdate', arg);
    }
    function kebabCase(ch) {
        return '-' + ch.toLowerCase();
    }
    function setPropsInternal(component, nextProps) {
        let changes;
        const { props } = component;
        const { defaultProps } = component.componentModel;
        for (const p in nextProps) {
            const prev = props[p];
            let current = nextProps[p];
            if (current == null) {
                nextProps[p] = current = defaultProps[p];
            }
            if (p === 'class' && current != null) {
                current = classNames(current).join(' ');
            }
            if (current !== prev) {
                if (!changes) {
                    changes = obj();
                }
                props[p] = current;
                changes[p] = { current, prev };
                if (!/^partial:/.test(p)) {
                    representAttributeValue(component, p.replace(/[A-Z]/g, kebabCase), current);
                }
            }
        }
        return changes;
    }
    /**
     * Check if `next` contains value that differs from one in `prev`
     */
    function hasChanges(prev, next) {
        for (const p in next) {
            if (next[p] !== prev[p]) {
                return true;
            }
        }
        return false;
    }
    /**
     * Prepares internal data for given component
     */
    function prepare(component, definition) {
        const props = obj();
        const state = obj();
        let events;
        let extend;
        reverseWalkDefinitions(component, definition, dfn => {
            dfn.props && assign(props, dfn.props(component));
            dfn.state && assign(state, dfn.state(component));
            // NB: backward compatibility with previous implementation
            if (dfn.methods) {
                extend = getDescriptors(dfn.methods, extend);
            }
            if (dfn.extend) {
                extend = getDescriptors(dfn.extend, extend);
            }
            if (dfn.events) {
                if (!events) {
                    events = createEventsMap(component);
                }
                attachEventHandlers(component, dfn.events, events);
            }
        });
        return { props, state, extend, events };
    }
    /**
     * Extracts property descriptors from given source object and merges it with `prev`
     * descriptor map, if given
     */
    function getDescriptors(source, prev) {
        const descriptors = getObjectDescriptors(source);
        return prev ? assign(prev, descriptors) : descriptors;
    }
    function createEventsMap(component) {
        const listeners = obj();
        const handler = function (evt) {
            if (component.componentModel) {
                const handlers = listeners[evt.type];
                for (let i = 0; i < handlers.length; i++) {
                    handlers[i](component, evt, this);
                }
            }
        };
        return { handler: safeEventListener(component, handler), listeners };
    }
    function attachEventHandlers(component, events, eventMap) {
        const names = Object.keys(events);
        const { listeners } = eventMap;
        for (let i = 0, name; i < names.length; i++) {
            name = names[i];
            if (name in listeners) {
                listeners[name].push(events[name]);
            }
            else {
                component.addEventListener(name, eventMap.handler);
                listeners[name] = [events[name]];
            }
        }
    }
    function addPropsState(element) {
        element.setProps = function setProps(value) {
            const { componentModel } = element;
            // In case of calling `setProps` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && componentModel.mounted) {
                const changes = setPropsInternal(element, assign(obj(), value));
                changes && renderNext(element, changes);
                return changes;
            }
        };
        element.setState = function setState(value) {
            const { componentModel } = element;
            // In case of calling `setState` after component was unmounted,
            // check if `componentModel` is available
            if (value != null && componentModel && hasChanges(element.state, value)) {
                assign(element.state, value);
                // If we’re in rendering state than current `setState()` is caused by
                // one of the `will*` hooks, which means applied changes will be automatically
                // applied during rendering stage.
                // If called outside of rendering state we should schedule render
                // on next tick
                if (componentModel.mounted && !componentModel.rendering) {
                    scheduleRender(element);
                }
            }
        };
    }
    function drainQueue() {
        const pending = renderQueue;
        renderQueue = null;
        for (let i = 0, component; i < pending.length; i += 2) {
            component = pending[i];
            // It’s possible that a component can be rendered before next tick
            // (for example, if parent node updated component props).
            // Check if it’s still queued then render.
            // Also, component can be unmounted after it’s rendering was scheduled
            if (component.componentModel && component.componentModel.queued) {
                renderComponent(component, pending[i + 1]);
            }
        }
    }

    /**
     * Mounts iterator block
     * @param get A function that returns collection to iterate
     * @param body A function that renders item of iterated collection
     */
    function mountIterator(host, injector, get, body) {
        const block = injectBlock(injector, {
            host,
            injector,
            scope: getScope(host),
            get,
            body,
            index: 0,
            updated: 0
        });
        updateIterator(block);
        return block;
    }
    /**
     * Updates iterator block defined in `ctx`
     * @returns Returns `1` if iterator was updated, `0` otherwise
     */
    function updateIterator(block) {
        const { injector } = block;
        injector.ptr = block.start;
        block.index = block.updated = 0;
        const collection = block.get(block.host, block.scope);
        if (collection && typeof collection.forEach === 'function') {
            collection.forEach(iterator, block);
        }
        trimIteratorItems(block, injector.ptr.next);
        injector.ptr = block.end;
        return block.updated;
    }
    function unmountIterator(block) {
        disposeBlock(block);
    }
    function prepareScope(scope, index, key, value) {
        scope.index = index;
        scope.key = key;
        scope.value = value;
        return scope;
    }
    /**
     * Removes remaining iterator items from current context
     */
    function trimIteratorItems(block, start) {
        let listItem;
        while (start !== block.end) {
            block.updated = 1;
            listItem = start.value;
            start = listItem.end.next;
            disposeBlock(listItem);
        }
    }
    function iterator(value, key) {
        const { host, injector, index, body, end } = this;
        const { next } = injector.ptr;
        const prevScope = getScope(host);
        let rendered;
        if (next !== end) {
            rendered = next.value;
            // We have rendered item, update it
            if (rendered.update) {
                const scope = prepareScope(rendered.scope, index, key, value);
                setScope(host, scope);
                if (rendered.update(host, scope)) {
                    this.updated = 1;
                }
                setScope(host, prevScope);
            }
        }
        else {
            // Create & render new block
            const scope = prepareScope(obj(prevScope), index, key, value);
            rendered = injectBlock(injector, {
                host,
                injector,
                scope,
                mount: body,
                update: undefined,
            });
            setScope(host, scope);
            injector.ptr = rendered.start;
            rendered.update = body(host, injector, scope);
            setScope(host, prevScope);
            this.updated = 1;
        }
        injector.ptr = rendered.end;
        this.index++;
    }

    /**
     * Creates Endorphin component and mounts it into given `options.target` container
     */
    function endorphin(name, definition, options = {}) {
        const component = createComponent(name, definition, options.target);
        if (options.store) {
            component.store = options.store;
        }
        if (options.target && !options.detached) {
            options.target.appendChild(component);
        }
        mountComponent(component, options.props);
        return component;
    }
    /**
     * Safe property getter
     * @param {*} ctx
     * @param {*} ...args
     * @returns {*}
     */
    function get(ctx) {
        const hasMap = typeof Map !== 'undefined';
        for (let i = 1, il = arguments.length, arg; ctx != null && i < il; i++) {
            arg = arguments[i];
            if (hasMap && ctx instanceof Map) {
                ctx = ctx.get(arg);
            }
            else {
                ctx = ctx[arg];
            }
        }
        return ctx;
    }
    //# sourceMappingURL=runtime.es.js.map

    const schema = {
      "author": "TamTam Team",
      "colors": {
        "accent": "#697CFF",
        "accentText": "#FFFFFF",
        "background": "#262626",
        "bubbleBorder": "#FFFFFF",
        "bubbleBorderHighLight": "#6988E0",
        "bubbleClickableBackground": "#2D2D2D",
        "bubbleControlBackground": "#626262",
        "bubbleControlsText": "#FFFFFF",
        "bubbleDecoratorBackground": "#232323",
        "bubbleDecoratorText": "#FFFFFF",
        "bubbleOuterBorder": "#000000",
        "bubbleSecondaryText": "#848484",
        "buttonTint": "#FFFFFF",
        "chatBackground": "#1C1C1C",
        "destructive": "#FF3F3F",
        "fileBadgeBackground": "#FBC03D",
        "highlightBackground": "#2D2D2D",
        "incomingBubbleBackground": "#262626",
        "incomingBubbleBackgroundHighlighted": "#2D2D2D",
        "outgoingBubbleBackground": "#262626",
        "outgoingBubbleBackgroundHighlighted": "#2D2D2D",
        "primaryText": "#FFFFFF",
        "profileBackground": "#1C1C1C",
        "secondaryBackground": "#1C1C1C",
        "secondaryButton": "#2D2D2D",
        "secondaryText": "#AAAAAA",
        "separatorBackground": "#333333",
        "statusBarBackground": "#2D2D2D",
        "switchThumb": "#848484",
        "switchThumbChecked": "#E4E4E4",
        "switchTrack": "#444444",
        "switchTrackChecked": "#848484",
        "switchTint": "#626262",
        "tertiaryText": "#AAAAAA",
        "toolBarBackground": "#262626",
        "unreadBackground": "#28972B",
        "unreadBackgroundMuted": "#848484",
        "unreadText": "#FFFFFF"
      },
      "night": true,
      "title": "TamTam Dark Contrast",
      "version": 1
    };

    const cssToProperty = {
      background: ['--c-bg', '--ui-titlebar-bg', '--c-aside-bg', '--c-bubble-search-bg', '--c-input'],
      chatBackground: ['--c-chat-bg', '--c-chat-bg-default'],
      highlightBackground: ['--c-active', '--c-active-chat-item', '--c-btn-active', '--c-global-search'],
      separatorBackground: '--c-delimiter',
      secondaryBackground: '--c-delimiter-fat',
      drawer: '--c-drawer',
      accent: '--c-highlight',
      destructive: '--c-error',
      favorite: '--c-favorite',
      primaryText: ['--c-text', '--c-link-hover', '--c-btn-text', '--c-msg-text'],
      secondaryText: ['--c-text-sub', '--c-link', '--c-msg-mine-sub', '--c-aside-text'],
      incomingBubbleBackground: '--c-msg',
      outgoingBubbleBackground: '--c-msg-mine',
      unreadBackground: '--c-bubble-bg',
      unreadBackgroundMuted: '--c-bubble-muted-bg',
      unreadText: '--c-bubble-text',
      secondaryButton: '--c-btn',
      tertiaryText: ['--c-btn-tertiary', '--c-input-border'],
      accentText: '--c-btn-tertiary-text',
    };

    const events = {
      change(component, event) {
        applyColor(event.target.name, event.target.value);
      }
    };

    function state() {
      return {
        colorKeys: Object.keys(cssToProperty),
        schema
      };
    }

    function onChangeColor(colorName, component) {
      // console.log(colorName, getComputedStyle(document.body).getPropertyValue(cssToProperty[colorName]));
      // console.log(schema.colors[colorName], colorName);
    }

    function didMount(component) {
      component.state.colorKeys.forEach(colorName => {
        const color = schema.colors[colorName];

        applyColor(colorName, color);
      });
    }

    function toArray(item) {
      return [].concat(item);
    }

    function applyColor(colorName, color) {
      const cssVars = toArray(cssToProperty[colorName]);

      cssVars.forEach(cssVar => {
        document.documentElement.style.setProperty(cssVar, color);
      });
    }

    const cssScope = "e62qnlu";

    function forSelect$0(host) {
    	return host.state.colorKeys;
    }

    function forContent$0(host, injector, scope) {
    	const div$1 = insert(injector, elem("div", cssScope));
    	setClass(div$1, "circle");
    	const input$0 = scope.input$0 = appendChild(div$1, elem("input", cssScope));
    	setAttribute(input$0, "type", "color");
    	scope.valueAttr$0 = setAttributeExpression(input$0, "value", get(host.state.schema, "colors", scope.value));
    	scope.nameAttr$0 = setAttributeExpression(input$0, "name", scope.value);
    	return forContent$0Update;
    }

    forContent$0.dispose = forContent$0Unmount;

    function forContent$0Update(host, scope) {
    	const { input$0 } = scope;
    	scope.valueAttr$0 = updateAttributeExpression(input$0, "value", get(host.state.schema, "colors", scope.value), scope.valueAttr$0);
    	scope.nameAttr$0 = updateAttributeExpression(input$0, "name", scope.value, scope.nameAttr$0);
    }

    function forContent$0Unmount(scope) {
    	scope.valueAttr$0 = scope.nameAttr$0 = scope.input$0 = null;
    }

    function template$0(host, scope) {
    	const target$0 = host.componentView;
    	const div$0 = appendChild(target$0, elem("div", cssScope));
    	const inj$0 = createInjector(div$0);
    	setClass(div$0, "circle-container");
    	scope.for$0 = mountIterator(host, inj$0, forSelect$0, forContent$0);
    	return template$0Update;
    }

    template$0.dispose = template$0Unmount;

    function template$0Update(host, scope) {
    	updateIterator(scope.for$0);
    }

    function template$0Unmount(scope) {
    	scope.for$0 = unmountIterator(scope.for$0);
    }

    var Colors = /*#__PURE__*/Object.freeze({
        cssScope: cssScope,
        'default': template$0,
        events: events,
        state: state,
        onChangeColor: onChangeColor,
        didMount: didMount
    });

    endorphin('colors', Colors, {
    	target: document.getElementById('colors')
    });

}());
//# sourceMappingURL=app.js.map
