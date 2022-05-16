
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.47.0' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );
    const { navigate } = globalHistory;

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules\svelte-navigator\src\Router.svelte generated by Svelte v3.47.0 */

    const file$j = "node_modules\\svelte-navigator\\src\\Router.svelte";

    // (195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$3(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$j, 195, 1, 5906);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(195:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$j, 190, 0, 5750);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty[0] & /*$$scope*/ 524288)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[19],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[19])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[19], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId$1 = createCounter();
    const defaultBasepath = "/";

    function instance$l($$self, $$props, $$invalidate) {
    	let $location;
    	let $activeRoute;
    	let $prevLocation;
    	let $routes;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Router', slots, ['default']);
    	let { basepath = defaultBasepath } = $$props;
    	let { url = null } = $$props;
    	let { history = globalHistory } = $$props;
    	let { primary = true } = $$props;
    	let { a11y = {} } = $$props;

    	const a11yConfig = {
    		createAnnouncement: route => `Navigated to ${route.uri}`,
    		announcements: true,
    		...a11y
    	};

    	// Remember the initial `basepath`, so we can fire a warning
    	// when the user changes it later
    	const initialBasepath = basepath;

    	const normalizedBasepath = normalizePath(basepath);
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const isTopLevelRouter = !locationContext;
    	const routerId = createId$1();
    	const manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	const announcementText = writable("");
    	validate_store(announcementText, 'announcementText');
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	const routes = writable([]);
    	validate_store(routes, 'routes');
    	component_subscribe($$self, routes, value => $$invalidate(18, $routes = value));
    	const activeRoute = writable(null);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));

    	// Used in SSR to synchronously set that a Route is active.
    	let hasActiveRoute = false;

    	// Nesting level of router.
    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	const level = isTopLevelRouter ? 0 : routerContext.level + 1;

    	// If we're running an SSR we force the location to the `url` prop
    	const getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	const location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	const prevLocation = writable($location);
    	validate_store(prevLocation, 'prevLocation');
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	const triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	const createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true;

    				// Return the match in SSR mode, so the matched Route can use it immediatly.
    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				const nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, 'Only top-level Routers can have a "basepath" prop. It is ignored.', { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = history.listen(changedHistory => {
    				const normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ['basepath', 'url', 'history', 'primary', 'a11y'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('$$scope' in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ('basepath' in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ('url' in $$props) $$invalidate(11, url = $$props.url);
    		if ('history' in $$props) $$invalidate(12, history = $$props.history);
    		if ('primary' in $$props) $$invalidate(13, primary = $$props.primary);
    		if ('a11y' in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ('hasActiveRoute' in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, 'You cannot change the "basepath" prop. It is ignored.');
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 294912) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			// Manage focus and announce navigation to screen reader users
    			{
    				if (isTopLevelRouter) {
    					const hasHash = !!$location.hash;

    					// When a hash is present in the url, we skip focus management, because
    					// focusing a different element will prevent in-page jumps (See #3)
    					const shouldManageFocus = !hasHash && manageFocus;

    					// We don't want to make an announcement, when the hash changes,
    					// but the active route stays the same
    					const announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 65536) {
    			// Queue matched Route, so top level Router can decide which Route to focus.
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$activeRoute,
    		$prevLocation,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$l.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Router$1 = Router;

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules\svelte-navigator\src\Route.svelte generated by Svelte v3.47.0 */
    const file$i = "node_modules\\svelte-navigator\\src\\Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 8
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[3],
    	navigate: /*navigate*/ ctx[10]
    });

    // (97:0) {#if isActive}
    function create_if_block$2(ctx) {
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264217) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(97:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (113:2) {:else}
    function create_else_block$1(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, $params, $location*/ 262168)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[18],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[18])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[18], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(113:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (105:2) {#if component !== null}
    function create_if_block_1$2(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[3] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3608)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 8 && { location: /*$location*/ ctx[3] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(105:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (98:1) <Router {primary}>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1$2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(98:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$i, 95, 0, 2622);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$i, 121, 0, 3295);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 4) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const createId = createCounter();

    function instance$k($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $activeRoute;
    	let $location;
    	let $parentBase;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	let { meta = {} } = $$props;
    	let { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	const id = createId();
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, 'activeRoute');
    	component_subscribe($$self, activeRoute, value => $$invalidate(15, $activeRoute = value));
    	const parentBase = useRouteBase();
    	validate_store(parentBase, 'parentBase');
    	component_subscribe($$self, parentBase, value => $$invalidate(16, $parentBase = value));
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	const focusElement = writable(null);

    	// In SSR we cannot wait for $activeRoute to update,
    	// so we use the match returned from `registerRoute` instead
    	let ssrMatch;

    	const route = writable();
    	const params = writable({});
    	validate_store(params, 'params');
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement);

    	// We need to call useNavigate after the route is set,
    	// so we can use the routes path for link resolution
    	const navigate = useNavigate();

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('path' in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ('$$scope' in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router: Router$1,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		params,
    		navigate,
    		isActive,
    		$activeRoute,
    		$location,
    		$parentBase,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(23, $$props = assign(assign({}, $$props), $$new_props));
    		if ('path' in $$props) $$invalidate(12, path = $$new_props.path);
    		if ('component' in $$props) $$invalidate(0, component = $$new_props.component);
    		if ('meta' in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ('primary' in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ('ssrMatch' in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ('isActive' in $$props) $$invalidate(2, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 77834) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				const isDefault = path === "";

    				const rawBase = join($parentBase, path);

    				const updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute);

    				// If we're in SSR mode and the Route matches,
    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 49152) {
    			$$invalidate(2, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 49156) {
    			if (isActive) {
    				const { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		isActive,
    		$location,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$activeRoute,
    		$parentBase,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Route$1 = Route;

    /* node_modules\svelte-navigator\src\Link.svelte generated by Svelte v3.47.0 */
    const file$h = "node_modules\\svelte-navigator\\src\\Link.svelte";

    function create_fragment$j(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[13].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[12], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[2], /*props*/ ctx[1]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$h, 63, 0, 1735);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4096)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[12],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[12])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[12], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 4 && /*ariaCurrent*/ ctx[2],
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Link', slots, ['default']);
    	let { to } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	const location = useLocation();
    	validate_store(location, 'location');
    	component_subscribe($$self, location, value => $$invalidate(11, $location = value));
    	const dispatch = createEventDispatcher();
    	const resolve = useResolve();
    	const { navigate } = useHistory();

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(17, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('to' in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('$$scope' in $$new_props) $$invalidate(12, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		isCurrent,
    		isPartiallyCurrent,
    		props,
    		ariaCurrent,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ('to' in $$props) $$invalidate(5, to = $$new_props.to);
    		if ('replace' in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ('state' in $$props) $$invalidate(7, state = $$new_props.state);
    		if ('getProps' in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ('href' in $$props) $$invalidate(0, href = $$new_props.href);
    		if ('isCurrent' in $$props) $$invalidate(9, isCurrent = $$new_props.isCurrent);
    		if ('isPartiallyCurrent' in $$props) $$invalidate(10, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ('props' in $$props) $$invalidate(1, props = $$new_props.props);
    		if ('ariaCurrent' in $$props) $$invalidate(2, ariaCurrent = $$new_props.ariaCurrent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 2080) {
    			// We need to pass location here to force re-resolution of the link,
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 2049) {
    			$$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 2049) {
    			$$invalidate(9, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 512) {
    			$$invalidate(2, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(1, props = (() => {
    			if (isFunction(getProps)) {
    				const dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return { ...$$restProps, ...dynamicProps };
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		props,
    		ariaCurrent,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isCurrent,
    		isPartiallyCurrent,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$j.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !('to' in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Link$1 = Link;

    const themeId = writable(1);
    const articleId = writable(0);
    const article = writable("");
    const title = writable("");
    const comments = writable([]);
    const category = writable("");
    const newTheme = writable({
        block: 0,
        fontSize: 0,
        fontFamily: "",
        fontColor: "",
        mainColor: ""
    });

    const id = writable("1");

    let addId = writable("5");

    const articles = writable({
        articles: [
            {
                id: "1",
                category: "kategoria3",
                title: "News 1",
                text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit et, commodi tempore similique accusamus, eius doloribus voluptates ex consectetur vel distinctio rem cum id suscipit quae illum atque molestias in?",
                comments: []
            },
            {
                id: "2",
                category: "kategoria4",
                title: "News 2",
                text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
                comments: []
            },
            {
                id: "3",
                category: "kategoria1",
                title: "News 3",
                text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
                comments: []
            },
            {
                id: "4",
                category: "kategoria2",
                title: "News 4",
                text: "No jest wszystko w porządku, jest dobrze, dobrze robią, dobrze wszystko jest w porządku. Jest git, pozdrawiam całą Legnicę, dobrych chłopaków i niech się to trzyma. Dobry przekaz leci.",
                comments: []
            }
        ]
    });

    const bigArticle = writable({
        title: "Big News",
        text: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Fugit et, commodi tempore similique accusamus, eius doloribus voluptates ex consectetur vel distinctio rem cum id suscipit quae illum atque molestias in?"
    });

    const topMenu = writable(1);
    const topMenuSettings = writable({
        fontSize: 0,
        fontFamily: "",
        fontColor: "",
        mainColor: ""
    });
    const topMenuOption = writable(true);

    const sliderImages = writable(["sentino.png", "sentino2.jpg", "sentino3.jpg"]);
    const sliderTime = writable(2000);
    const sliderDescription = writable("");

    const images = writable(["sentino.png", "sentino2.jpg", "sentino3.jpg", "malik.jpg"]);

    const Footer = writable(1);
    const FooterSettings = writable({
        fontSize: 0,
        fontFamily: "",
        fontColor: "",
        mainColor: ""
    });

    /* src\components\Navigation.svelte generated by Svelte v3.47.0 */

    const file$g = "src\\components\\Navigation.svelte";

    // (200:0) {:else}
    function create_else_block_2(ctx) {
    	let div12;
    	let div3;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let t2;
    	let nav;
    	let div10;
    	let img;
    	let img_src_value;
    	let t3;
    	let div9;
    	let div7;
    	let div4;
    	let link0;
    	let t4;
    	let div5;
    	let link1;
    	let t5;
    	let div6;
    	let link2;
    	let t6;
    	let t7;
    	let div8;
    	let t8;
    	let div11;
    	let current;
    	let mounted;
    	let dispose;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_17] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/articles",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/gallery",
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*login*/ ctx[0] != "" && create_if_block_7(ctx);
    	let if_block1 = /*login*/ ctx[0] != "" && create_if_block_6(ctx);

    	function select_block_type_4(ctx, dirty) {
    		if (/*login*/ ctx[0] != "") return create_if_block_5;
    		return create_else_block_3;
    	}

    	let current_block_type = select_block_type_4(ctx);
    	let if_block2 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div12 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			t2 = space();
    			nav = element("nav");
    			div10 = element("div");
    			img = element("img");
    			t3 = space();
    			div9 = element("div");
    			div7 = element("div");
    			div4 = element("div");
    			create_component(link0.$$.fragment);
    			t4 = space();
    			div5 = element("div");
    			create_component(link1.$$.fragment);
    			t5 = space();
    			div6 = element("div");
    			create_component(link2.$$.fragment);
    			t6 = space();
    			if (if_block0) if_block0.c();
    			t7 = space();
    			div8 = element("div");
    			if (if_block1) if_block1.c();
    			t8 = space();
    			div11 = element("div");
    			if_block2.c();
    			attr_dev(div0, "class", "h svelte-iraluf");
    			add_location(div0, file$g, 202, 12, 7179);
    			attr_dev(div1, "class", "h svelte-iraluf");
    			add_location(div1, file$g, 203, 12, 7210);
    			attr_dev(div2, "class", "h svelte-iraluf");
    			add_location(div2, file$g, 204, 12, 7241);
    			attr_dev(div3, "class", "hamburger svelte-iraluf");
    			add_location(div3, file$g, 201, 8, 7112);
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "img svelte-iraluf");
    			add_location(img, file$g, 212, 16, 7554);
    			attr_dev(div4, "class", "links svelte-iraluf");
    			add_location(div4, file$g, 215, 24, 7683);
    			attr_dev(div5, "class", "links svelte-iraluf");
    			add_location(div5, file$g, 218, 24, 7814);
    			attr_dev(div6, "class", "links svelte-iraluf");
    			add_location(div6, file$g, 221, 24, 7957);
    			attr_dev(div7, "class", "top svelte-iraluf");
    			add_location(div7, file$g, 214, 20, 7640);
    			attr_dev(div8, "class", "bottom svelte-iraluf");
    			add_location(div8, file$g, 241, 20, 8913);
    			add_location(div9, file$g, 213, 16, 7613);
    			attr_dev(div10, "class", "navigation_left svelte-iraluf");
    			add_location(div10, file$g, 211, 12, 7507);
    			add_location(div11, file$g, 273, 12, 10400);
    			attr_dev(nav, "id", "navigation");
    			attr_dev(nav, "class", "" + (null_to_empty(/*navigation2*/ ctx[6]) + " svelte-iraluf"));
    			set_style(nav, "--bgColor", /*mainColor*/ ctx[10]);
    			set_style(nav, "--fontFamily", /*fontFamily*/ ctx[8]);
    			set_style(nav, "--color", /*fontColor*/ ctx[9]);
    			set_style(nav, "--fontSize", /*fontSize*/ ctx[7] + "px");
    			set_style(nav, "display", "none");
    			add_location(nav, file$g, 206, 8, 7284);
    			add_location(div12, file$g, 200, 4, 7097);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div12, anchor);
    			append_dev(div12, div3);
    			append_dev(div3, div0);
    			append_dev(div3, t0);
    			append_dev(div3, div1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div12, t2);
    			append_dev(div12, nav);
    			append_dev(nav, div10);
    			append_dev(div10, img);
    			append_dev(div10, t3);
    			append_dev(div10, div9);
    			append_dev(div9, div7);
    			append_dev(div7, div4);
    			mount_component(link0, div4, null);
    			append_dev(div7, t4);
    			append_dev(div7, div5);
    			mount_component(link1, div5, null);
    			append_dev(div7, t5);
    			append_dev(div7, div6);
    			mount_component(link2, div6, null);
    			append_dev(div7, t6);
    			if (if_block0) if_block0.m(div7, null);
    			append_dev(div9, t7);
    			append_dev(div9, div8);
    			if (if_block1) if_block1.m(div8, null);
    			append_dev(nav, t8);
    			append_dev(nav, div11);
    			if_block2.m(div11, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", /*click_handler_1*/ ctx[13], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);

    			if (/*login*/ ctx[0] != "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_7(ctx);
    					if_block0.c();
    					if_block0.m(div7, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*login*/ ctx[0] != "") {
    				if (if_block1) {
    					if (dirty & /*login*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div8, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type_4(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div11, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div12);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(200:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (113:0) {#if $topMenuOption}
    function create_if_block$1(ctx) {
    	let nav;
    	let div6;
    	let img;
    	let img_src_value;
    	let t0;
    	let div5;
    	let div3;
    	let div0;
    	let link0;
    	let t1;
    	let div1;
    	let link1;
    	let t2;
    	let div2;
    	let link2;
    	let t3;
    	let t4;
    	let div4;
    	let t5;
    	let div7;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/articles",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/gallery",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = /*login*/ ctx[0] != "" && create_if_block_3(ctx);
    	let if_block1 = /*login*/ ctx[0] != "" && create_if_block_2(ctx);

    	function select_block_type_2(ctx, dirty) {
    		if (/*login*/ ctx[0] != "") return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block2 = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			div6 = element("div");
    			img = element("img");
    			t0 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(link1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(link2.$$.fragment);
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			div4 = element("div");
    			if (if_block1) if_block1.c();
    			t5 = space();
    			div7 = element("div");
    			if_block2.c();
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[4])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "img svelte-iraluf");
    			add_location(img, file$g, 118, 12, 3894);
    			attr_dev(div0, "class", "links svelte-iraluf");
    			add_location(div0, file$g, 121, 20, 4011);
    			attr_dev(div1, "class", "links svelte-iraluf");
    			add_location(div1, file$g, 124, 20, 4130);
    			attr_dev(div2, "class", "links svelte-iraluf");
    			add_location(div2, file$g, 127, 20, 4261);
    			attr_dev(div3, "class", "top svelte-iraluf");
    			add_location(div3, file$g, 120, 16, 3972);
    			attr_dev(div4, "class", "bottom svelte-iraluf");
    			add_location(div4, file$g, 148, 16, 5139);
    			add_location(div5, file$g, 119, 12, 3949);
    			attr_dev(div6, "class", "navigation_left svelte-iraluf");
    			add_location(div6, file$g, 117, 8, 3851);
    			add_location(div7, file$g, 178, 8, 6434);
    			attr_dev(nav, "class", "" + (null_to_empty(/*navigation*/ ctx[5]) + " svelte-iraluf"));
    			set_style(nav, "--bgColor", /*mainColor*/ ctx[10]);
    			set_style(nav, "--fontFamily", /*fontFamily*/ ctx[8]);
    			set_style(nav, "--color", /*fontColor*/ ctx[9]);
    			set_style(nav, "--fontSize", /*fontSize*/ ctx[7] + "px");
    			add_location(nav, file$g, 113, 4, 3689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			append_dev(nav, div6);
    			append_dev(div6, img);
    			append_dev(div6, t0);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, div0);
    			mount_component(link0, div0, null);
    			append_dev(div3, t1);
    			append_dev(div3, div1);
    			mount_component(link1, div1, null);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			mount_component(link2, div2, null);
    			append_dev(div3, t3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			if (if_block1) if_block1.m(div4, null);
    			append_dev(nav, t5);
    			append_dev(nav, div7);
    			if_block2.m(div7, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 262144) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);

    			if (/*login*/ ctx[0] != "") {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_3(ctx);
    					if_block0.c();
    					if_block0.m(div3, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*login*/ ctx[0] != "") {
    				if (if_block1) {
    					if (dirty & /*login*/ 1) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div4, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block2) {
    				if_block2.p(ctx, dirty);
    			} else {
    				if_block2.d(1);
    				if_block2 = current_block_type(ctx);

    				if (if_block2) {
    					if_block2.c();
    					if_block2.m(div7, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if_block2.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(113:0) {#if $topMenuOption}",
    		ctx
    	});

    	return block;
    }

    // (217:28) <Link to="/">
    function create_default_slot_17(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_17.name,
    		type: "slot",
    		source: "(217:28) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (220:28) <Link to="/articles">
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Artykuły");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(220:28) <Link to=\\\"/articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (223:28) <Link to="/gallery">
    function create_default_slot_15(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Galeria");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(223:28) <Link to=\\\"/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (225:24) {#if login != ""}
    function create_if_block_7(ctx) {
    	let if_block_anchor;

    	function select_block_type_3(ctx, dirty) {
    		if (/*login*/ ctx[0] == "admin") return create_if_block_8;
    		return create_else_block_4;
    	}

    	let current_block_type = select_block_type_3(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_3(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(225:24) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (232:28) {:else}
    function create_else_block_4(ctx) {
    	let div;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("Ustawienia użytkownika");
    			attr_dev(a, "href", a_href_value = "/user?login=" + /*login*/ ctx[0] + "&password=" + /*password*/ ctx[2]);
    			add_location(a, file$g, 233, 36, 8560);
    			attr_dev(div, "class", "links svelte-iraluf");
    			add_location(div, file$g, 232, 32, 8503);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*login, password*/ 5 && a_href_value !== (a_href_value = "/user?login=" + /*login*/ ctx[0] + "&password=" + /*password*/ ctx[2])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_4.name,
    		type: "else",
    		source: "(232:28) {:else}",
    		ctx
    	});

    	return block;
    }

    // (226:28) {#if login == "admin"}
    function create_if_block_8(ctx) {
    	let div;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = "Zarządzanie użytkownikami";
    			attr_dev(a, "href", "/userssettings");
    			add_location(a, file$g, 227, 36, 8258);
    			attr_dev(div, "class", "links svelte-iraluf");
    			add_location(div, file$g, 226, 32, 8201);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(226:28) {#if login == \\\"admin\\\"}",
    		ctx
    	});

    	return block;
    }

    // (243:24) {#if login != ""}
    function create_if_block_6(ctx) {
    	let div0;
    	let link0;
    	let t0;
    	let div1;
    	let link1;
    	let t1;
    	let div2;
    	let link2;
    	let t2;
    	let div3;
    	let link3;
    	let t3;
    	let div4;
    	let link4;
    	let t4;
    	let div5;
    	let link5;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/theme",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/newTheme",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/menuSettings",
    				$$slots: { default: [create_default_slot_12$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/sliderSettings",
    				$$slots: { default: [create_default_slot_11$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/footerSettings",
    				$$slots: { default: [create_default_slot_10$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "/importExport",
    				$$slots: { default: [create_default_slot_9$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(link2.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(link3.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			create_component(link4.$$.fragment);
    			t4 = space();
    			div5 = element("div");
    			create_component(link5.$$.fragment);
    			attr_dev(div0, "class", "links svelte-iraluf");
    			add_location(div0, file$g, 243, 28, 9006);
    			attr_dev(div1, "class", "links svelte-iraluf");
    			add_location(div1, file$g, 246, 28, 9170);
    			attr_dev(div2, "class", "links svelte-iraluf");
    			add_location(div2, file$g, 249, 28, 9334);
    			attr_dev(div3, "class", "links svelte-iraluf");
    			add_location(div3, file$g, 254, 28, 9580);
    			attr_dev(div4, "class", "links svelte-iraluf");
    			add_location(div4, file$g, 259, 28, 9825);
    			attr_dev(div5, "class", "links svelte-iraluf");
    			add_location(div5, file$g, 264, 28, 10068);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link0, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(link1, div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(link2, div2, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(link3, div3, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(link4, div4, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(link5, div5, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(link1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_component(link2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			destroy_component(link3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div4);
    			destroy_component(link4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div5);
    			destroy_component(link5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(243:24) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (245:32) <Link to="/theme">
    function create_default_slot_14(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Wybierz gotowy motyw");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(245:32) <Link to=\\\"/theme\\\">",
    		ctx
    	});

    	return block;
    }

    // (248:32) <Link to="/newTheme">
    function create_default_slot_13(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Stwórz nowy motyw");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(248:32) <Link to=\\\"/newTheme\\\">",
    		ctx
    	});

    	return block;
    }

    // (251:32) <Link to="/menuSettings"                                      >
    function create_default_slot_12$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie menu górnym");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12$1.name,
    		type: "slot",
    		source: "(251:32) <Link to=\\\"/menuSettings\\\"                                      >",
    		ctx
    	});

    	return block;
    }

    // (256:32) <Link to="/sliderSettings"                                      >
    function create_default_slot_11$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie sliderem");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11$1.name,
    		type: "slot",
    		source: "(256:32) <Link to=\\\"/sliderSettings\\\"                                      >",
    		ctx
    	});

    	return block;
    }

    // (261:32) <Link to="/footerSettings"                                      >
    function create_default_slot_10$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie stopką");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10$1.name,
    		type: "slot",
    		source: "(261:32) <Link to=\\\"/footerSettings\\\"                                      >",
    		ctx
    	});

    	return block;
    }

    // (266:32) <Link to="/importExport"                                      >
    function create_default_slot_9$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("import/export ustawień");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9$1.name,
    		type: "slot",
    		source: "(266:32) <Link to=\\\"/importExport\\\"                                      >",
    		ctx
    	});

    	return block;
    }

    // (285:16) {:else}
    function create_else_block_3(ctx) {
    	let button0;
    	let a0;
    	let t1;
    	let button1;
    	let a1;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "Logowanie";
    			t1 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "Rejestracja";
    			attr_dev(a0, "href", "/logowanie");
    			add_location(a0, file$g, 286, 24, 10869);
    			attr_dev(button0, "class", "green svelte-iraluf");
    			add_location(button0, file$g, 285, 20, 10821);
    			attr_dev(a1, "href", "/register");
    			add_location(a1, file$g, 289, 24, 11003);
    			attr_dev(button1, "class", "blue svelte-iraluf");
    			add_location(button1, file$g, 288, 20, 10956);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, a1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_3.name,
    		type: "else",
    		source: "(285:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (275:16) {#if login != ""}
    function create_if_block_5(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Konto: ");
    			t1 = text(/*login*/ ctx[0]);
    			t2 = text("\r\n                    Poziom: ");
    			t3 = text(/*poziom*/ ctx[1]);
    			t4 = space();
    			button = element("button");
    			button.textContent = "Wyloguj";
    			attr_dev(button, "class", "blue svelte-iraluf");
    			add_location(button, file$g, 277, 20, 10536);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_2*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*login*/ 1) set_data_dev(t1, /*login*/ ctx[0]);
    			if (dirty & /*poziom*/ 2) set_data_dev(t3, /*poziom*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(275:16) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (123:24) <Link to="/">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(123:24) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (126:24) <Link to="/articles">
    function create_default_slot_7$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Artykuły");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(126:24) <Link to=\\\"/articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (129:24) <Link to="/gallery">
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Galeria");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(129:24) <Link to=\\\"/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (132:20) {#if login != ""}
    function create_if_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*login*/ ctx[0] == "admin") return create_if_block_4;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_1(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(132:20) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (139:24) {:else}
    function create_else_block_1(ctx) {
    	let div;
    	let a;
    	let t;
    	let a_href_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			t = text("Ustawienia użytkownika");
    			attr_dev(a, "href", a_href_value = "/user?login=" + /*login*/ ctx[0] + "&password=" + /*password*/ ctx[2]);
    			add_location(a, file$g, 140, 32, 4818);
    			attr_dev(div, "class", "links svelte-iraluf");
    			add_location(div, file$g, 139, 28, 4765);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    			append_dev(a, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*login, password*/ 5 && a_href_value !== (a_href_value = "/user?login=" + /*login*/ ctx[0] + "&password=" + /*password*/ ctx[2])) {
    				attr_dev(a, "href", a_href_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(139:24) {:else}",
    		ctx
    	});

    	return block;
    }

    // (133:24) {#if login == "admin"}
    function create_if_block_4(ctx) {
    	let div;
    	let a;

    	const block = {
    		c: function create() {
    			div = element("div");
    			a = element("a");
    			a.textContent = "Zarządzanie użytkownikami";
    			attr_dev(a, "href", "/userssettings");
    			add_location(a, file$g, 134, 32, 4540);
    			attr_dev(div, "class", "links svelte-iraluf");
    			add_location(div, file$g, 133, 28, 4487);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, a);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(133:24) {#if login == \\\"admin\\\"}",
    		ctx
    	});

    	return block;
    }

    // (150:20) {#if login != ""}
    function create_if_block_2(ctx) {
    	let div0;
    	let link0;
    	let t0;
    	let div1;
    	let link1;
    	let t1;
    	let div2;
    	let link2;
    	let t2;
    	let div3;
    	let link3;
    	let t3;
    	let div4;
    	let link4;
    	let t4;
    	let div5;
    	let link5;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/theme",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/newTheme",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/menuSettings",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link3 = new Link$1({
    			props: {
    				to: "/sliderSettings",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link4 = new Link$1({
    			props: {
    				to: "/footerSettings",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link5 = new Link$1({
    			props: {
    				to: "/importExport",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(link1.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(link2.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(link3.$$.fragment);
    			t3 = space();
    			div4 = element("div");
    			create_component(link4.$$.fragment);
    			t4 = space();
    			div5 = element("div");
    			create_component(link5.$$.fragment);
    			attr_dev(div0, "class", "links svelte-iraluf");
    			add_location(div0, file$g, 150, 24, 5224);
    			attr_dev(div1, "class", "links svelte-iraluf");
    			add_location(div1, file$g, 153, 24, 5376);
    			attr_dev(div2, "class", "links svelte-iraluf");
    			add_location(div2, file$g, 156, 24, 5528);
    			attr_dev(div3, "class", "links svelte-iraluf");
    			add_location(div3, file$g, 161, 24, 5754);
    			attr_dev(div4, "class", "links svelte-iraluf");
    			add_location(div4, file$g, 166, 24, 5979);
    			attr_dev(div5, "class", "links svelte-iraluf");
    			add_location(div5, file$g, 169, 24, 6138);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(link0, div0, null);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(link1, div1, null);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(link2, div2, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div3, anchor);
    			mount_component(link3, div3, null);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(link4, div4, null);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(link5, div5, null);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(link3.$$.fragment, local);
    			transition_in(link4.$$.fragment, local);
    			transition_in(link5.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(link3.$$.fragment, local);
    			transition_out(link4.$$.fragment, local);
    			transition_out(link5.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(link0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			destroy_component(link1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			destroy_component(link2);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div3);
    			destroy_component(link3);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div4);
    			destroy_component(link4);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div5);
    			destroy_component(link5);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(150:20) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (152:28) <Link to="/theme">
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Wybierz gotowy motyw");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(152:28) <Link to=\\\"/theme\\\">",
    		ctx
    	});

    	return block;
    }

    // (155:28) <Link to="/newTheme">
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Stwórz nowy motyw");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(155:28) <Link to=\\\"/newTheme\\\">",
    		ctx
    	});

    	return block;
    }

    // (158:28) <Link to="/menuSettings"                                  >
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie menu górnym");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(158:28) <Link to=\\\"/menuSettings\\\"                                  >",
    		ctx
    	});

    	return block;
    }

    // (163:28) <Link to="/sliderSettings"                                  >
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie sliderem");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(163:28) <Link to=\\\"/sliderSettings\\\"                                  >",
    		ctx
    	});

    	return block;
    }

    // (168:28) <Link to="/footerSettings">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Zarządzanie stopką");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(168:28) <Link to=\\\"/footerSettings\\\">",
    		ctx
    	});

    	return block;
    }

    // (171:28) <Link to="/importExport"                                  >
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("import/export ustawień");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(171:28) <Link to=\\\"/importExport\\\"                                  >",
    		ctx
    	});

    	return block;
    }

    // (190:12) {:else}
    function create_else_block(ctx) {
    	let button0;
    	let a0;
    	let t1;
    	let button1;
    	let a1;

    	const block = {
    		c: function create() {
    			button0 = element("button");
    			a0 = element("a");
    			a0.textContent = "Logowanie";
    			t1 = space();
    			button1 = element("button");
    			a1 = element("a");
    			a1.textContent = "Rejestracja";
    			attr_dev(a0, "href", "/logowanie");
    			add_location(a0, file$g, 191, 20, 6851);
    			attr_dev(button0, "class", "green svelte-iraluf");
    			add_location(button0, file$g, 190, 16, 6807);
    			attr_dev(a1, "href", "/register");
    			add_location(a1, file$g, 194, 20, 6973);
    			attr_dev(button1, "class", "blue svelte-iraluf");
    			add_location(button1, file$g, 193, 16, 6930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, a0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, a1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(190:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (180:12) {#if login != ""}
    function create_if_block_1$1(ctx) {
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			t0 = text("Konto: ");
    			t1 = text(/*login*/ ctx[0]);
    			t2 = text("\r\n                Poziom: ");
    			t3 = text(/*poziom*/ ctx[1]);
    			t4 = space();
    			button = element("button");
    			button.textContent = "Wyloguj";
    			attr_dev(button, "class", "blue svelte-iraluf");
    			add_location(button, file$g, 182, 16, 6554);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*login*/ 1) set_data_dev(t1, /*login*/ ctx[0]);
    			if (dirty & /*poziom*/ 2) set_data_dev(t3, /*poziom*/ ctx[1]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(180:12) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$topMenuOption*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $articles;
    	let $topMenuSettings;
    	let $topMenu;
    	let $topMenuOption;
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(15, $articles = $$value));
    	validate_store(topMenuSettings, 'topMenuSettings');
    	component_subscribe($$self, topMenuSettings, $$value => $$invalidate(16, $topMenuSettings = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(17, $topMenu = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(3, $topMenuOption = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Navigation', slots, []);
    	let logo = "sentino.png";
    	let login = "";
    	let poziom = "";
    	let password = "";
    	const navigation = `navigation${$topMenu}`;
    	const navigation2 = `navigation2${$topMenu}`;
    	const fontSize = $topMenuSettings.fontSize;
    	const fontFamily = $topMenuSettings.fontFamily;
    	const fontColor = $topMenuSettings.fontColor;
    	const mainColor = $topMenuSettings.mainColor;

    	fetch("/all").then(response => response.json()).then(data => {
    		themeId.set(data.variables[0][0]);
    		category.set(data.variables[0][4]);
    		topMenu.set(data.variables[0][5]);
    		if (data.variables[0][6] == 1) topMenuOption.set(true); else topMenuOption.set(false);
    		sliderTime.set(data.variables[0][7]);
    		sliderDescription.set(data.variables[0][8]);
    		Footer.set(data.variables[0][9]);

    		newTheme.set({
    			block: data.newTheme[0][0],
    			fontSize: data.newTheme[0][1],
    			fontFamily: data.newTheme[0][2],
    			fontColor: data.newTheme[0][3],
    			mainColor: data.newTheme[0][4]
    		});

    		topMenuSettings.set({
    			fontSize: data.topMenuSettings[0][0],
    			fontFamily: data.topMenuSettings[0][1],
    			fontColor: data.topMenuSettings[0][2],
    			mainColor: data.topMenuSettings[0][3]
    		});

    		FooterSettings.set({
    			fontSize: data.FooterSettings[0][0],
    			fontFamily: data.FooterSettings[0][1],
    			fontColor: data.FooterSettings[0][2],
    			mainColor: data.FooterSettings[0][3]
    		});

    		set_store_value(articles, $articles.articles.length = 0, $articles);

    		data.articles.forEach(e => {
    			$articles.articles.push({
    				id: e[0],
    				category: e[1],
    				title: e[2],
    				text: e[3],
    				comments: []
    			});
    		});

    		$articles.articles.forEach(k => {
    			k.comments.length = 0;

    			data.comments.forEach(e => {
    				if (e[1] == k.id) {
    					k.comments.push(e[0]);
    				}
    			});
    		});
    	});

    	fetch("/login").then(response => response.json()).then(data => {
    		if (!(data.poziom == "admin" && data.login != "admin" && data.password != "admin")) {
    			$$invalidate(0, login = data.login);
    			$$invalidate(2, password = data.password);
    			$$invalidate(1, poziom = data.poziom);
    		} else {
    			$$invalidate(0, login = "admin");
    			$$invalidate(2, password = "admin");
    			$$invalidate(1, poziom = "admin");
    		}
    	});

    	const changeMenu = () => {
    		const nav = document.getElementById("navigation");
    		if (nav.style.display == "none") nav.style.display = "flex"; else nav.style.display = "none";
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Navigation> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(0, login = "");
    		$$invalidate(1, poziom = "");
    	};

    	const click_handler_1 = () => changeMenu();

    	const click_handler_2 = () => {
    		$$invalidate(0, login = "");
    		$$invalidate(1, poziom = "");
    	};

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		logo,
    		login,
    		poziom,
    		password,
    		navigation,
    		navigation2,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		changeMenu,
    		$articles,
    		$topMenuSettings,
    		$topMenu,
    		$topMenuOption
    	});

    	$$self.$inject_state = $$props => {
    		if ('logo' in $$props) $$invalidate(4, logo = $$props.logo);
    		if ('login' in $$props) $$invalidate(0, login = $$props.login);
    		if ('poziom' in $$props) $$invalidate(1, poziom = $$props.poziom);
    		if ('password' in $$props) $$invalidate(2, password = $$props.password);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		login,
    		poziom,
    		password,
    		$topMenuOption,
    		logo,
    		navigation,
    		navigation2,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		changeMenu,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Navigation extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Navigation",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    /* src\components\Footer.svelte generated by Svelte v3.47.0 */
    const file$f = "src\\components\\Footer.svelte";

    // (18:8) <Link to="/">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Home");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(18:8) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (21:8) <Link to="/second">
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Artykuły");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(21:8) <Link to=\\\"/second\\\">",
    		ctx
    	});

    	return block;
    }

    // (24:8) <Link to="/gallery">
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Galeria");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(24:8) <Link to=\\\"/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let footer;
    	let img;
    	let img_src_value;
    	let t0;
    	let div0;
    	let link0;
    	let t1;
    	let div1;
    	let link1;
    	let t2;
    	let div2;
    	let link2;
    	let t3;
    	let div3;
    	let current;

    	link0 = new Link$1({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link$1({
    			props: {
    				to: "/second",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link$1({
    			props: {
    				to: "/gallery",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			footer = element("footer");
    			img = element("img");
    			t0 = space();
    			div0 = element("div");
    			create_component(link0.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(link1.$$.fragment);
    			t2 = space();
    			div2 = element("div");
    			create_component(link2.$$.fragment);
    			t3 = space();
    			div3 = element("div");
    			div3.textContent = "Autorzy: Maciej Dzierwa, Piotr Sarna";
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[0])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "logo");
    			attr_dev(img, "class", "img svelte-1ut8wnm");
    			add_location(img, file$f, 15, 4, 555);
    			attr_dev(div0, "class", "links");
    			add_location(div0, file$f, 16, 4, 602);
    			attr_dev(div1, "class", "links");
    			add_location(div1, file$f, 19, 4, 673);
    			attr_dev(div2, "class", "links");
    			add_location(div2, file$f, 22, 4, 754);
    			add_location(div3, file$f, 25, 4, 835);
    			attr_dev(footer, "class", "" + (null_to_empty(/*footerClass*/ ctx[1]) + " svelte-1ut8wnm"));
    			set_style(footer, "--bgColor", /*mainColor*/ ctx[5]);
    			set_style(footer, "--color", /*fontColor*/ ctx[4]);
    			set_style(footer, "--fontFamily", /*fontFamily*/ ctx[3]);
    			set_style(footer, "--fontSize", /*fontSize*/ ctx[2] + "px");
    			add_location(footer, file$f, 11, 0, 405);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, footer, anchor);
    			append_dev(footer, img);
    			append_dev(footer, t0);
    			append_dev(footer, div0);
    			mount_component(link0, div0, null);
    			append_dev(footer, t1);
    			append_dev(footer, div1);
    			mount_component(link1, div1, null);
    			append_dev(footer, t2);
    			append_dev(footer, div2);
    			mount_component(link2, div2, null);
    			append_dev(footer, t3);
    			append_dev(footer, div3);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(footer);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $FooterSettings;
    	let $Footer;
    	validate_store(FooterSettings, 'FooterSettings');
    	component_subscribe($$self, FooterSettings, $$value => $$invalidate(6, $FooterSettings = $$value));
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(7, $Footer = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footer', slots, []);
    	let logo = "sentino.png";
    	const footerClass = `footer${$Footer}`;
    	const fontSize = $FooterSettings.fontSize;
    	const fontFamily = $FooterSettings.fontFamily;
    	const fontColor = $FooterSettings.fontColor;
    	const mainColor = $FooterSettings.mainColor;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Footer> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		Footer,
    		FooterSettings,
    		logo,
    		footerClass,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		$FooterSettings,
    		$Footer
    	});

    	$$self.$inject_state = $$props => {
    		if ('logo' in $$props) $$invalidate(0, logo = $$props.logo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [logo, footerClass, fontSize, fontFamily, fontColor, mainColor];
    }

    class Footer_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footer_1",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\components\Slider.svelte generated by Svelte v3.47.0 */
    const file$e = "src\\components\\Slider.svelte";

    function get_each_context$4(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[7] = list[i];
    	child_ctx[9] = i;
    	return child_ctx;
    }

    // (27:4) {#each imgs as img, i}
    function create_each_block$4(ctx) {
    	let div2;
    	let div0;
    	let t0_value = /*i*/ ctx[9] + 1 + "";
    	let t0;
    	let t1;
    	let img;
    	let img_src_value;
    	let t2;
    	let div1;
    	let t3;
    	let t4;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text(t0_value);
    			t1 = space();
    			img = element("img");
    			t2 = space();
    			div1 = element("div");
    			t3 = text(/*$sliderDescription*/ ctx[0]);
    			t4 = space();
    			attr_dev(div0, "class", "numbertext svelte-1uin78m");
    			add_location(div0, file$e, 28, 12, 792);
    			if (!src_url_equal(img.src, img_src_value = /*img*/ ctx[7])) attr_dev(img, "src", img_src_value);
    			set_style(img, "width", "1200px");
    			set_style(img, "height", "500px");
    			attr_dev(img, "alt", "img");
    			attr_dev(img, "class", "svelte-1uin78m");
    			add_location(img, file$e, 29, 12, 843);
    			attr_dev(div1, "class", "text svelte-1uin78m");
    			add_location(div1, file$e, 30, 12, 921);
    			attr_dev(div2, "class", "mySlides fade svelte-1uin78m");
    			add_location(div2, file$e, 27, 8, 751);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div2, t1);
    			append_dev(div2, img);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, t3);
    			append_dev(div2, t4);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$sliderDescription*/ 1) set_data_dev(t3, /*$sliderDescription*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$4.name,
    		type: "each",
    		source: "(27:4) {#each imgs as img, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div;
    	let each_value = /*imgs*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$4(get_each_context$4(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "slideshow-container svelte-1uin78m");
    			add_location(div, file$e, 25, 0, 680);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$sliderDescription, imgs*/ 3) {
    				each_value = /*imgs*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$4(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$4(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let $sliderTime;
    	let $sliderImages;
    	let $sliderDescription;
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(3, $sliderTime = $$value));
    	validate_store(sliderImages, 'sliderImages');
    	component_subscribe($$self, sliderImages, $$value => $$invalidate(4, $sliderImages = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(0, $sliderDescription = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slider', slots, []);
    	let imgs = $sliderImages;
    	let time = $sliderTime;
    	let slideIndex = 0;
    	showSlides();

    	function showSlides() {
    		let slides = document.getElementsByClassName("mySlides");

    		for (let i = 0; i < slides.length; i++) {
    			slides[i].style.display = "none";
    		}

    		slideIndex++;

    		if (slideIndex > slides.length) {
    			slideIndex = 1;
    		}

    		setTimeout(
    			() => {
    				slides[slideIndex - 1].style.display = "block";
    				setTimeout(showSlides, time);
    			},
    			0
    		);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		imgs,
    		time,
    		slideIndex,
    		showSlides,
    		$sliderTime,
    		$sliderImages,
    		$sliderDescription
    	});

    	$$self.$inject_state = $$props => {
    		if ('imgs' in $$props) $$invalidate(1, imgs = $$props.imgs);
    		if ('time' in $$props) time = $$props.time;
    		if ('slideIndex' in $$props) slideIndex = $$props.slideIndex;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [$sliderDescription, imgs];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\News.svelte generated by Svelte v3.47.0 */

    const file$d = "src\\components\\News.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[18] = i;
    	return child_ctx;
    }

    // (64:20) <Link to="/second" on:click={() => setArticle(i)}                          >
    function create_default_slot$2(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text("Read more");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(64:20) <Link to=\\\"/second\\\" on:click={() => setArticle(i)}                          >",
    		ctx
    	});

    	return block_1;
    }

    // (56:8) {#each $articles.articles as art, i}
    function create_each_block$3(ctx) {
    	let div2;
    	let h1;
    	let t0_value = /*art*/ ctx[16].title + "";
    	let t0;
    	let t1;
    	let h3;
    	let t2_value = /*art*/ ctx[16].category + "";
    	let t2;
    	let t3;
    	let div0;
    	let t4_value = /*art*/ ctx[16].text + "";
    	let t4;
    	let t5;
    	let div1;
    	let link;
    	let t6;
    	let div2_class_value;
    	let current;

    	function click_handler() {
    		return /*click_handler*/ ctx[12](/*i*/ ctx[18]);
    	}

    	link = new Link$1({
    			props: {
    				to: "/second",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link.$on("click", click_handler);

    	const block_1 = {
    		c: function create() {
    			div2 = element("div");
    			h1 = element("h1");
    			t0 = text(t0_value);
    			t1 = space();
    			h3 = element("h3");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			t4 = text(t4_value);
    			t5 = space();
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t6 = space();
    			add_location(h1, file$d, 57, 16, 1688);
    			add_location(h3, file$d, 58, 16, 1726);
    			add_location(div0, file$d, 59, 16, 1767);
    			attr_dev(div1, "class", "bt svelte-dpib64");
    			add_location(div1, file$d, 62, 16, 1846);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*news*/ ctx[1]) + " svelte-dpib64"));
    			add_location(div2, file$d, 56, 12, 1652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, h3);
    			append_dev(h3, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div0);
    			append_dev(div0, t4);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(link, div1, null);
    			append_dev(div2, t6);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty & /*$articles*/ 8) && t0_value !== (t0_value = /*art*/ ctx[16].title + "")) set_data_dev(t0, t0_value);
    			if ((!current || dirty & /*$articles*/ 8) && t2_value !== (t2_value = /*art*/ ctx[16].category + "")) set_data_dev(t2, t2_value);
    			if ((!current || dirty & /*$articles*/ 8) && t4_value !== (t4_value = /*art*/ ctx[16].text + "")) set_data_dev(t4, t4_value);
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 524288) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty & /*news*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*news*/ ctx[1]) + " svelte-dpib64"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(56:8) {#each $articles.articles as art, i}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$f(ctx) {
    	let main_1;
    	let div0;
    	let div0_class_value;
    	let t0;
    	let div2;
    	let div1;
    	let h1;
    	let t1_value = /*$bigArticle*/ ctx[4].title + "";
    	let t1;
    	let t2;
    	let t3_value = /*$bigArticle*/ ctx[4].text + "";
    	let t3;
    	let t4;
    	let img;
    	let img_src_value;
    	let div2_class_value;
    	let current;
    	let each_value = /*$articles*/ ctx[3].articles;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block_1 = {
    		c: function create() {
    			main_1 = element("main");
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div2 = element("div");
    			div1 = element("div");
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			t3 = text(t3_value);
    			t4 = space();
    			img = element("img");
    			attr_dev(div0, "class", div0_class_value = "" + (null_to_empty(/*smallNews*/ ctx[0]) + " svelte-dpib64"));
    			add_location(div0, file$d, 54, 4, 1569);
    			add_location(h1, file$d, 72, 12, 2127);
    			add_location(div1, file$d, 71, 8, 2108);
    			if (!src_url_equal(img.src, img_src_value = /*logo*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "ok");
    			attr_dev(img, "class", "logo svelte-dpib64");
    			add_location(img, file$d, 75, 8, 2213);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*bigNews*/ ctx[2]) + " svelte-dpib64"));
    			add_location(div2, file$d, 70, 4, 2077);
    			attr_dev(main_1, "class", "" + (null_to_empty(/*main*/ ctx[6]) + " svelte-dpib64"));
    			set_style(main_1, "--fontSize", /*fontSize*/ ctx[7] + "px");
    			set_style(main_1, "--fontFamily", /*fontFamily*/ ctx[8]);
    			set_style(main_1, "--bgColor", /*mainColor*/ ctx[10]);
    			set_style(main_1, "--color", /*fontColor*/ ctx[9]);
    			add_location(main_1, file$d, 50, 0, 1428);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main_1, anchor);
    			append_dev(main_1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			append_dev(main_1, t0);
    			append_dev(main_1, div2);
    			append_dev(div2, div1);
    			append_dev(div1, h1);
    			append_dev(h1, t1);
    			append_dev(div1, t2);
    			append_dev(div1, t3);
    			append_dev(div2, t4);
    			append_dev(div2, img);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*news, setArticle, $articles*/ 2058) {
    				each_value = /*$articles*/ ctx[3].articles;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div0, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*smallNews*/ 1 && div0_class_value !== (div0_class_value = "" + (null_to_empty(/*smallNews*/ ctx[0]) + " svelte-dpib64"))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if ((!current || dirty & /*$bigArticle*/ 16) && t1_value !== (t1_value = /*$bigArticle*/ ctx[4].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*$bigArticle*/ 16) && t3_value !== (t3_value = /*$bigArticle*/ ctx[4].text + "")) set_data_dev(t3, t3_value);

    			if (!current || dirty & /*bigNews*/ 4 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*bigNews*/ ctx[2]) + " svelte-dpib64"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main_1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let $articles;
    	let $newTheme;
    	let $themeId;
    	let $bigArticle;
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(3, $articles = $$value));
    	validate_store(newTheme, 'newTheme');
    	component_subscribe($$self, newTheme, $$value => $$invalidate(13, $newTheme = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(14, $themeId = $$value));
    	validate_store(bigArticle, 'bigArticle');
    	component_subscribe($$self, bigArticle, $$value => $$invalidate(4, $bigArticle = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News', slots, []);
    	let logo = "sentino.png";
    	let smallNews = `smallNews${$themeId}`;
    	let news = `news${$themeId}`;
    	let bigNews = `bigNews${$themeId}`;
    	let main = `main${$themeId}`;
    	const block = $newTheme.block;
    	const fontSize = $newTheme.fontSize;
    	const fontFamily = $newTheme.fontFamily;
    	const fontColor = $newTheme.fontColor;
    	const mainColor = $newTheme.mainColor;

    	if (main === "main4") {
    		if (block == 1) {
    			smallNews = "smallNews1";
    			news = "news1";
    			bigNews = "bigNews1";
    		} else if (block == 2) {
    			smallNews = "smallNews2";
    			news = "news2";
    			bigNews = "bigNews2";
    		} else if (block == 3) {
    			smallNews = "smallNews3";
    			news = "news3";
    			bigNews = "bigNews3";
    		}
    	}

    	const setArticle = x => {
    		articleId.set(x);
    		article.set($articles.articles[x].text);
    		title.set($articles.articles[x].title);
    		category.set($articles.articles[x].category);
    		comments.set($articles.articles[x].comments);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<News> was created with unknown prop '${key}'`);
    	});

    	const click_handler = i => setArticle(i);

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		logo,
    		themeId,
    		article,
    		newTheme,
    		articles,
    		bigArticle,
    		title,
    		category,
    		comments,
    		articleId,
    		smallNews,
    		news,
    		bigNews,
    		main,
    		block,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		setArticle,
    		$articles,
    		$newTheme,
    		$themeId,
    		$bigArticle
    	});

    	$$self.$inject_state = $$props => {
    		if ('logo' in $$props) $$invalidate(5, logo = $$props.logo);
    		if ('smallNews' in $$props) $$invalidate(0, smallNews = $$props.smallNews);
    		if ('news' in $$props) $$invalidate(1, news = $$props.news);
    		if ('bigNews' in $$props) $$invalidate(2, bigNews = $$props.bigNews);
    		if ('main' in $$props) $$invalidate(6, main = $$props.main);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		smallNews,
    		news,
    		bigNews,
    		$articles,
    		$bigArticle,
    		logo,
    		main,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		setArticle,
    		click_handler
    	];
    }

    class News extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\routes\Home.svelte generated by Svelte v3.47.0 */

    function create_fragment$e(ctx) {
    	let navigation;
    	let t0;
    	let slider;
    	let t1;
    	let news;
    	let t2;
    	let footer;
    	let current;
    	navigation = new Navigation({ $$inline: true });
    	slider = new Slider({ $$inline: true });
    	news = new News({ $$inline: true });
    	footer = new Footer_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			create_component(slider.$$.fragment);
    			t1 = space();
    			create_component(news.$$.fragment);
    			t2 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(slider, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(news, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(slider.$$.fragment, local);
    			transition_in(news.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(slider.$$.fragment, local);
    			transition_out(news.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(slider, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(news, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navigation, Footer: Footer_1, Slider, News });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$e.name
    		});
    	}
    }

    /* src\routes\Theme.svelte generated by Svelte v3.47.0 */

    const { console: console_1$8 } = globals;

    const file$c = "src\\routes\\Theme.svelte";

    function create_fragment$d(ctx) {
    	let navigation;
    	let t0;
    	let div18;
    	let div5;
    	let h10;
    	let t2;
    	let h20;
    	let t4;
    	let div4;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let div2;
    	let t7;
    	let div3;
    	let t8;
    	let h21;
    	let t10;
    	let h30;
    	let t12;
    	let h22;
    	let t14;
    	let h31;
    	let t16;
    	let h32;
    	let t18;
    	let button0;
    	let div5_class_value;
    	let t20;
    	let div11;
    	let h11;
    	let t22;
    	let h23;
    	let t24;
    	let div10;
    	let div6;
    	let t25;
    	let div7;
    	let t26;
    	let div8;
    	let t27;
    	let div9;
    	let t28;
    	let h24;
    	let t30;
    	let h33;
    	let t32;
    	let h25;
    	let t34;
    	let h34;
    	let t36;
    	let h35;
    	let t38;
    	let button1;
    	let div11_class_value;
    	let t40;
    	let div17;
    	let h12;
    	let t42;
    	let h26;
    	let t44;
    	let div16;
    	let div12;
    	let t45;
    	let div13;
    	let t46;
    	let div14;
    	let t47;
    	let div15;
    	let t48;
    	let h27;
    	let t50;
    	let h36;
    	let t52;
    	let h28;
    	let t54;
    	let h37;
    	let t56;
    	let h38;
    	let t58;
    	let button2;
    	let div17_class_value;
    	let div18_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block_1 = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			div18 = element("div");
    			div5 = element("div");
    			h10 = element("h1");
    			h10.textContent = "Motyw 1";
    			t2 = space();
    			h20 = element("h2");
    			h20.textContent = "Układ bloków:";
    			t4 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			div3 = element("div");
    			t8 = space();
    			h21 = element("h2");
    			h21.textContent = "Czcionka:";
    			t10 = space();
    			h30 = element("h3");
    			h30.textContent = "Arial 18px";
    			t12 = space();
    			h22 = element("h2");
    			h22.textContent = "Kolory:";
    			t14 = space();
    			h31 = element("h3");
    			h31.textContent = "Kolor tekstu: czarny";
    			t16 = space();
    			h32 = element("h3");
    			h32.textContent = "Kolor głowny: biały";
    			t18 = space();
    			button0 = element("button");
    			button0.textContent = "Wybierz";
    			t20 = space();
    			div11 = element("div");
    			h11 = element("h1");
    			h11.textContent = "Motyw 2";
    			t22 = space();
    			h23 = element("h2");
    			h23.textContent = "Układ bloków:";
    			t24 = space();
    			div10 = element("div");
    			div6 = element("div");
    			t25 = space();
    			div7 = element("div");
    			t26 = space();
    			div8 = element("div");
    			t27 = space();
    			div9 = element("div");
    			t28 = space();
    			h24 = element("h2");
    			h24.textContent = "Czcionka:";
    			t30 = space();
    			h33 = element("h3");
    			h33.textContent = "Georgia 18px";
    			t32 = space();
    			h25 = element("h2");
    			h25.textContent = "Kolory:";
    			t34 = space();
    			h34 = element("h3");
    			h34.textContent = "Kolor tekstu: czerwony";
    			t36 = space();
    			h35 = element("h3");
    			h35.textContent = "Kolor głowny: zielony";
    			t38 = space();
    			button1 = element("button");
    			button1.textContent = "Wybierz";
    			t40 = space();
    			div17 = element("div");
    			h12 = element("h1");
    			h12.textContent = "Motyw 3";
    			t42 = space();
    			h26 = element("h2");
    			h26.textContent = "Układ bloków:";
    			t44 = space();
    			div16 = element("div");
    			div12 = element("div");
    			t45 = space();
    			div13 = element("div");
    			t46 = space();
    			div14 = element("div");
    			t47 = space();
    			div15 = element("div");
    			t48 = space();
    			h27 = element("h2");
    			h27.textContent = "Czcionka:";
    			t50 = space();
    			h36 = element("h3");
    			h36.textContent = "Times New Roman 18px";
    			t52 = space();
    			h28 = element("h2");
    			h28.textContent = "Kolory:";
    			t54 = space();
    			h37 = element("h3");
    			h37.textContent = "Kolor tekstu: niebieski";
    			t56 = space();
    			h38 = element("h3");
    			h38.textContent = "Kolor głowny: jasny niebieski";
    			t58 = space();
    			button2 = element("button");
    			button2.textContent = "Wybierz";
    			add_location(h10, file$c, 79, 8, 2302);
    			add_location(h20, file$c, 80, 8, 2328);
    			attr_dev(div0, "class", "block11 svelte-ufqho6");
    			add_location(div0, file$c, 82, 12, 2394);
    			attr_dev(div1, "class", "block11 svelte-ufqho6");
    			add_location(div1, file$c, 83, 12, 2431);
    			attr_dev(div2, "class", "block11 svelte-ufqho6");
    			add_location(div2, file$c, 84, 12, 2468);
    			attr_dev(div3, "class", "block11 svelte-ufqho6");
    			add_location(div3, file$c, 85, 12, 2505);
    			attr_dev(div4, "class", "block1 svelte-ufqho6");
    			add_location(div4, file$c, 81, 8, 2360);
    			add_location(h21, file$c, 87, 8, 2554);
    			add_location(h30, file$c, 88, 8, 2582);
    			add_location(h22, file$c, 89, 8, 2611);
    			add_location(h31, file$c, 90, 8, 2637);
    			add_location(h32, file$c, 91, 8, 2676);
    			add_location(button0, file$c, 92, 8, 2714);
    			attr_dev(div5, "class", div5_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"));
    			set_style(div5, "--bgColor", /*mainColor*/ ctx[9]);
    			set_style(div5, "--width", /*width*/ ctx[2] + "%");
    			add_location(div5, file$c, 78, 4, 2224);
    			add_location(h11, file$c, 95, 8, 2864);
    			add_location(h23, file$c, 96, 8, 2890);
    			attr_dev(div6, "class", "block22 svelte-ufqho6");
    			add_location(div6, file$c, 98, 12, 2956);
    			attr_dev(div7, "class", "block22 svelte-ufqho6");
    			add_location(div7, file$c, 99, 12, 2993);
    			attr_dev(div8, "class", "block22 svelte-ufqho6");
    			add_location(div8, file$c, 100, 12, 3030);
    			attr_dev(div9, "class", "block22 svelte-ufqho6");
    			add_location(div9, file$c, 101, 12, 3067);
    			attr_dev(div10, "class", "block2 svelte-ufqho6");
    			add_location(div10, file$c, 97, 8, 2922);
    			add_location(h24, file$c, 103, 8, 3116);
    			add_location(h33, file$c, 104, 8, 3144);
    			add_location(h25, file$c, 105, 8, 3175);
    			add_location(h34, file$c, 106, 8, 3201);
    			add_location(h35, file$c, 107, 8, 3242);
    			add_location(button1, file$c, 108, 8, 3282);
    			attr_dev(div11, "class", div11_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"));
    			set_style(div11, "--bgColor", /*mainColor*/ ctx[9]);
    			set_style(div11, "--width", /*width*/ ctx[2] + "%");
    			add_location(div11, file$c, 94, 4, 2786);
    			add_location(h12, file$c, 111, 8, 3432);
    			add_location(h26, file$c, 112, 8, 3458);
    			attr_dev(div12, "class", "block33 svelte-ufqho6");
    			add_location(div12, file$c, 114, 12, 3524);
    			attr_dev(div13, "class", "block33 svelte-ufqho6");
    			add_location(div13, file$c, 115, 12, 3561);
    			attr_dev(div14, "class", "block33 svelte-ufqho6");
    			add_location(div14, file$c, 116, 12, 3598);
    			attr_dev(div15, "class", "block33 svelte-ufqho6");
    			add_location(div15, file$c, 117, 12, 3635);
    			attr_dev(div16, "class", "block3 svelte-ufqho6");
    			add_location(div16, file$c, 113, 8, 3490);
    			add_location(h27, file$c, 119, 8, 3684);
    			add_location(h36, file$c, 120, 8, 3712);
    			add_location(h28, file$c, 121, 8, 3751);
    			add_location(h37, file$c, 122, 8, 3777);
    			add_location(h38, file$c, 123, 8, 3819);
    			add_location(button2, file$c, 124, 8, 3867);
    			attr_dev(div17, "class", div17_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"));
    			set_style(div17, "--bgColor", /*mainColor*/ ctx[9]);
    			set_style(div17, "--width", /*width*/ ctx[2] + "%");
    			add_location(div17, file$c, 110, 4, 3354);
    			attr_dev(div18, "class", div18_class_value = "" + (null_to_empty(/*main*/ ctx[1]) + " svelte-ufqho6"));
    			set_style(div18, "--fontSize", /*fontSize*/ ctx[6] + "px");
    			set_style(div18, "--fontFamily", /*fontFamily*/ ctx[7]);
    			set_style(div18, "--color", /*fontColor*/ ctx[8]);
    			set_style(div18, "--flex", /*flex*/ ctx[3]);
    			set_style(div18, "--wrap", /*wrap*/ ctx[4]);
    			add_location(div18, file$c, 74, 0, 2077);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div18, anchor);
    			append_dev(div18, div5);
    			append_dev(div5, h10);
    			append_dev(div5, t2);
    			append_dev(div5, h20);
    			append_dev(div5, t4);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div5, t8);
    			append_dev(div5, h21);
    			append_dev(div5, t10);
    			append_dev(div5, h30);
    			append_dev(div5, t12);
    			append_dev(div5, h22);
    			append_dev(div5, t14);
    			append_dev(div5, h31);
    			append_dev(div5, t16);
    			append_dev(div5, h32);
    			append_dev(div5, t18);
    			append_dev(div5, button0);
    			append_dev(div18, t20);
    			append_dev(div18, div11);
    			append_dev(div11, h11);
    			append_dev(div11, t22);
    			append_dev(div11, h23);
    			append_dev(div11, t24);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div10, t25);
    			append_dev(div10, div7);
    			append_dev(div10, t26);
    			append_dev(div10, div8);
    			append_dev(div10, t27);
    			append_dev(div10, div9);
    			append_dev(div11, t28);
    			append_dev(div11, h24);
    			append_dev(div11, t30);
    			append_dev(div11, h33);
    			append_dev(div11, t32);
    			append_dev(div11, h25);
    			append_dev(div11, t34);
    			append_dev(div11, h34);
    			append_dev(div11, t36);
    			append_dev(div11, h35);
    			append_dev(div11, t38);
    			append_dev(div11, button1);
    			append_dev(div18, t40);
    			append_dev(div18, div17);
    			append_dev(div17, h12);
    			append_dev(div17, t42);
    			append_dev(div17, h26);
    			append_dev(div17, t44);
    			append_dev(div17, div16);
    			append_dev(div16, div12);
    			append_dev(div16, t45);
    			append_dev(div16, div13);
    			append_dev(div16, t46);
    			append_dev(div16, div14);
    			append_dev(div16, t47);
    			append_dev(div16, div15);
    			append_dev(div17, t48);
    			append_dev(div17, h27);
    			append_dev(div17, t50);
    			append_dev(div17, h36);
    			append_dev(div17, t52);
    			append_dev(div17, h28);
    			append_dev(div17, t54);
    			append_dev(div17, h37);
    			append_dev(div17, t56);
    			append_dev(div17, h38);
    			append_dev(div17, t58);
    			append_dev(div17, button2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[10], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[11], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*theme*/ 1 && div5_class_value !== (div5_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"))) {
    				attr_dev(div5, "class", div5_class_value);
    			}

    			if (!current || dirty & /*width*/ 4) {
    				set_style(div5, "--width", /*width*/ ctx[2] + "%");
    			}

    			if (!current || dirty & /*theme*/ 1 && div11_class_value !== (div11_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"))) {
    				attr_dev(div11, "class", div11_class_value);
    			}

    			if (!current || dirty & /*width*/ 4) {
    				set_style(div11, "--width", /*width*/ ctx[2] + "%");
    			}

    			if (!current || dirty & /*theme*/ 1 && div17_class_value !== (div17_class_value = "" + (null_to_empty(/*theme*/ ctx[0]) + " svelte-ufqho6"))) {
    				attr_dev(div17, "class", div17_class_value);
    			}

    			if (!current || dirty & /*width*/ 4) {
    				set_style(div17, "--width", /*width*/ ctx[2] + "%");
    			}

    			if (!current || dirty & /*main*/ 2 && div18_class_value !== (div18_class_value = "" + (null_to_empty(/*main*/ ctx[1]) + " svelte-ufqho6"))) {
    				attr_dev(div18, "class", div18_class_value);
    			}

    			if (!current || dirty & /*flex*/ 8) {
    				set_style(div18, "--flex", /*flex*/ ctx[3]);
    			}

    			if (!current || dirty & /*wrap*/ 16) {
    				set_style(div18, "--wrap", /*wrap*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div18);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let $newTheme;
    	let $themeId;
    	let $Footer;
    	let $sliderDescription;
    	let $sliderTime;
    	let $topMenuOption;
    	let $topMenu;
    	let $category;
    	let $title;
    	let $article;
    	let $articleId;
    	validate_store(newTheme, 'newTheme');
    	component_subscribe($$self, newTheme, $$value => $$invalidate(13, $newTheme = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(14, $themeId = $$value));
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(15, $Footer = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(16, $sliderDescription = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(17, $sliderTime = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(18, $topMenuOption = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(19, $topMenu = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(20, $category = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(21, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(22, $article = $$value));
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(23, $articleId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Theme', slots, []);
    	let theme = `theme${$themeId}`;
    	let main = `main${$themeId}`;

    	const sendFetch = id => {
    		themeId.set(id);

    		const body = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer
    		};

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		fetch(`/motyw?id=${id}`, { method: "post" }).then(response => response.json()).then(data => {
    			themeId.set(data.id);
    			$$invalidate(0, theme = `theme${$themeId}`);
    			$$invalidate(1, main = `main${$themeId}`);
    		});
    	};

    	const block = $newTheme.block;
    	const fontSize = $newTheme.fontSize;
    	const fontFamily = $newTheme.fontFamily;
    	const fontColor = $newTheme.fontColor;
    	const mainColor = $newTheme.mainColor;
    	let width = 0;
    	let flex = "";
    	let wrap = "";

    	if (block == 1) {
    		width = 30;
    	} else if (block == 2) {
    		width = 40;
    		flex = "space-beetwen";
    		wrap = "wrap";
    	} else {
    		width = 100;
    		flex = "center";
    		wrap = "wrap";
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$8.warn(`<Theme> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => sendFetch(1);
    	const click_handler_1 = () => sendFetch(2);
    	const click_handler_2 = () => sendFetch(3);

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		articleId,
    		article,
    		title,
    		category,
    		newTheme,
    		topMenu,
    		topMenuOption,
    		sliderTime,
    		sliderDescription,
    		Footer,
    		theme,
    		main,
    		sendFetch,
    		block,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		width,
    		flex,
    		wrap,
    		$newTheme,
    		$themeId,
    		$Footer,
    		$sliderDescription,
    		$sliderTime,
    		$topMenuOption,
    		$topMenu,
    		$category,
    		$title,
    		$article,
    		$articleId
    	});

    	$$self.$inject_state = $$props => {
    		if ('theme' in $$props) $$invalidate(0, theme = $$props.theme);
    		if ('main' in $$props) $$invalidate(1, main = $$props.main);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('flex' in $$props) $$invalidate(3, flex = $$props.flex);
    		if ('wrap' in $$props) $$invalidate(4, wrap = $$props.wrap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		theme,
    		main,
    		width,
    		flex,
    		wrap,
    		sendFetch,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Theme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Theme",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src\routes\Newtheme.svelte generated by Svelte v3.47.0 */

    const { console: console_1$7 } = globals;

    const file$b = "src\\routes\\Newtheme.svelte";

    function create_fragment$c(ctx) {
    	let navigation;
    	let t0;
    	let div17;
    	let h1;
    	let t2;
    	let div16;
    	let div15;
    	let t3;
    	let input0;
    	let t4;
    	let div4;
    	let div0;
    	let t5;
    	let div1;
    	let t6;
    	let div2;
    	let t7;
    	let div3;
    	let t8;
    	let input1;
    	let t9;
    	let div9;
    	let div5;
    	let t10;
    	let div6;
    	let t11;
    	let div7;
    	let t12;
    	let div8;
    	let t13;
    	let input2;
    	let t14;
    	let div14;
    	let div10;
    	let t15;
    	let div11;
    	let t16;
    	let div12;
    	let t17;
    	let div13;
    	let t18;
    	let p0;
    	let t19;
    	let input3;
    	let t20;
    	let p1;
    	let t21;
    	let input4;
    	let t22;
    	let p2;
    	let t23;
    	let input5;
    	let t24;
    	let p3;
    	let t25;
    	let input6;
    	let t26;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			div17 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Nowy motyw";
    			t2 = space();
    			div16 = element("div");
    			div15 = element("div");
    			t3 = text("Układ bloków\r\n            ");
    			input0 = element("input");
    			t4 = space();
    			div4 = element("div");
    			div0 = element("div");
    			t5 = space();
    			div1 = element("div");
    			t6 = space();
    			div2 = element("div");
    			t7 = space();
    			div3 = element("div");
    			t8 = space();
    			input1 = element("input");
    			t9 = space();
    			div9 = element("div");
    			div5 = element("div");
    			t10 = space();
    			div6 = element("div");
    			t11 = space();
    			div7 = element("div");
    			t12 = space();
    			div8 = element("div");
    			t13 = space();
    			input2 = element("input");
    			t14 = space();
    			div14 = element("div");
    			div10 = element("div");
    			t15 = space();
    			div11 = element("div");
    			t16 = space();
    			div12 = element("div");
    			t17 = space();
    			div13 = element("div");
    			t18 = space();
    			p0 = element("p");
    			t19 = text("Wielkość czcionki");
    			input3 = element("input");
    			t20 = space();
    			p1 = element("p");
    			t21 = text("Rodzaj czcionki");
    			input4 = element("input");
    			t22 = space();
    			p2 = element("p");
    			t23 = text("Kolor tekstu");
    			input5 = element("input");
    			t24 = space();
    			p3 = element("p");
    			t25 = text("Kolor główny");
    			input6 = element("input");
    			t26 = space();
    			button = element("button");
    			button.textContent = "Ustaw";
    			add_location(h1, file$b, 91, 4, 2818);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "block");
    			input0.value = "1";
    			add_location(input0, file$b, 95, 12, 2918);
    			attr_dev(div0, "class", "block11 svelte-3524y4");
    			add_location(div0, file$b, 97, 16, 3015);
    			attr_dev(div1, "class", "block11 svelte-3524y4");
    			add_location(div1, file$b, 98, 16, 3056);
    			attr_dev(div2, "class", "block11 svelte-3524y4");
    			add_location(div2, file$b, 99, 16, 3097);
    			attr_dev(div3, "class", "block11 svelte-3524y4");
    			add_location(div3, file$b, 100, 16, 3138);
    			attr_dev(div4, "class", "block1 svelte-3524y4");
    			add_location(div4, file$b, 96, 12, 2977);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "block");
    			input1.value = "2";
    			add_location(input1, file$b, 102, 12, 3195);
    			attr_dev(div5, "class", "block22 svelte-3524y4");
    			add_location(div5, file$b, 104, 16, 3292);
    			attr_dev(div6, "class", "block22 svelte-3524y4");
    			add_location(div6, file$b, 105, 16, 3333);
    			attr_dev(div7, "class", "block22 svelte-3524y4");
    			add_location(div7, file$b, 106, 16, 3374);
    			attr_dev(div8, "class", "block22 svelte-3524y4");
    			add_location(div8, file$b, 107, 16, 3415);
    			attr_dev(div9, "class", "block2 svelte-3524y4");
    			add_location(div9, file$b, 103, 12, 3254);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "block");
    			input2.value = "3";
    			add_location(input2, file$b, 109, 12, 3472);
    			attr_dev(div10, "class", "block33 svelte-3524y4");
    			add_location(div10, file$b, 111, 16, 3569);
    			attr_dev(div11, "class", "block33 svelte-3524y4");
    			add_location(div11, file$b, 112, 16, 3610);
    			attr_dev(div12, "class", "block33 svelte-3524y4");
    			add_location(div12, file$b, 113, 16, 3651);
    			attr_dev(div13, "class", "block33 svelte-3524y4");
    			add_location(div13, file$b, 114, 16, 3692);
    			attr_dev(div14, "class", "block3 svelte-3524y4");
    			add_location(div14, file$b, 110, 12, 3531);
    			attr_dev(div15, "class", "svelte-3524y4");
    			add_location(div15, file$b, 93, 8, 2873);
    			attr_dev(input3, "type", "number");
    			attr_dev(input3, "id", "fontSize");
    			add_location(input3, file$b, 117, 28, 3781);
    			attr_dev(p0, "class", "svelte-3524y4");
    			add_location(p0, file$b, 117, 8, 3761);
    			attr_dev(input4, "type", "text");
    			attr_dev(input4, "id", "fontFamily");
    			add_location(input4, file$b, 118, 26, 3850);
    			attr_dev(p1, "class", "svelte-3524y4");
    			add_location(p1, file$b, 118, 8, 3832);
    			attr_dev(input5, "type", "color");
    			attr_dev(input5, "id", "fontColor");
    			add_location(input5, file$b, 119, 23, 3916);
    			attr_dev(p2, "class", "svelte-3524y4");
    			add_location(p2, file$b, 119, 8, 3901);
    			attr_dev(input6, "type", "color");
    			attr_dev(input6, "id", "mainColor");
    			add_location(input6, file$b, 120, 23, 3982);
    			attr_dev(p3, "class", "svelte-3524y4");
    			add_location(p3, file$b, 120, 8, 3967);
    			add_location(button, file$b, 121, 8, 4033);
    			attr_dev(div16, "class", "inputs svelte-3524y4");
    			add_location(div16, file$b, 92, 4, 2843);
    			attr_dev(div17, "class", "main svelte-3524y4");
    			add_location(div17, file$b, 90, 0, 2794);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div17, anchor);
    			append_dev(div17, h1);
    			append_dev(div17, t2);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, t3);
    			append_dev(div15, input0);
    			append_dev(div15, t4);
    			append_dev(div15, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t5);
    			append_dev(div4, div1);
    			append_dev(div4, t6);
    			append_dev(div4, div2);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div15, t8);
    			append_dev(div15, input1);
    			append_dev(div15, t9);
    			append_dev(div15, div9);
    			append_dev(div9, div5);
    			append_dev(div9, t10);
    			append_dev(div9, div6);
    			append_dev(div9, t11);
    			append_dev(div9, div7);
    			append_dev(div9, t12);
    			append_dev(div9, div8);
    			append_dev(div15, t13);
    			append_dev(div15, input2);
    			append_dev(div15, t14);
    			append_dev(div15, div14);
    			append_dev(div14, div10);
    			append_dev(div14, t15);
    			append_dev(div14, div11);
    			append_dev(div14, t16);
    			append_dev(div14, div12);
    			append_dev(div14, t17);
    			append_dev(div14, div13);
    			append_dev(div16, t18);
    			append_dev(div16, p0);
    			append_dev(p0, t19);
    			append_dev(p0, input3);
    			append_dev(div16, t20);
    			append_dev(div16, p1);
    			append_dev(p1, t21);
    			append_dev(p1, input4);
    			append_dev(div16, t22);
    			append_dev(div16, p2);
    			append_dev(p2, t23);
    			append_dev(p2, input5);
    			append_dev(div16, t24);
    			append_dev(div16, p3);
    			append_dev(p3, t25);
    			append_dev(p3, input6);
    			append_dev(div16, t26);
    			append_dev(div16, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div17);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $Footer;
    	let $sliderDescription;
    	let $sliderTime;
    	let $topMenuOption;
    	let $topMenu;
    	let $category;
    	let $title;
    	let $article;
    	let $articleId;
    	let $themeId;
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(2, $Footer = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(3, $sliderDescription = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(4, $sliderTime = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(5, $topMenuOption = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(6, $topMenu = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(7, $category = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(8, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(9, $article = $$value));
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(10, $articleId = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(11, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Newtheme', slots, []);

    	const sendFetch = async id => {
    		themeId.set(id);

    		const body2 = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer
    		};

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body2),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		const block = document.querySelector('input[name="block"]:checked').value;
    		const fontSize = document.getElementById("fontSize").value;
    		const fontFamily = document.getElementById("fontFamily").value;
    		const fontColor = document.getElementById("fontColor").value;
    		const mainColor = document.getElementById("mainColor").value;

    		const body = {
    			block,
    			fontSize,
    			fontFamily,
    			fontColor,
    			mainColor
    		};

    		fetch("http://127.0.0.1:5000/newTheme", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		fetch(`/motyw?id=${id}`, { method: "post" }).then(response => response.json()).then(data => {
    			themeId.set(data.id);

    			newTheme.set({
    				block,
    				fontSize,
    				fontFamily,
    				fontColor,
    				mainColor
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$7.warn(`<Newtheme> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => sendFetch(4);

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		sendFetch,
    		$Footer,
    		$sliderDescription,
    		$sliderTime,
    		$topMenuOption,
    		$topMenu,
    		$category,
    		$title,
    		$article,
    		$articleId,
    		$themeId
    	});

    	return [sendFetch, click_handler];
    }

    class Newtheme extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Newtheme",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\routes\Menusettings.svelte generated by Svelte v3.47.0 */

    const { console: console_1$6 } = globals;

    const file$a = "src\\routes\\Menusettings.svelte";

    function create_fragment$b(ctx) {
    	let navigation;
    	let t0;
    	let div2;
    	let h1;
    	let t2;
    	let div0;
    	let p0;
    	let t3;
    	let input0;
    	let t4;
    	let p1;
    	let t5;
    	let input1;
    	let t6;
    	let p2;
    	let t7;
    	let input2;
    	let t8;
    	let p3;
    	let t9;
    	let input3;
    	let t10;
    	let button0;
    	let t12;
    	let div1;
    	let h2;
    	let t13;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Ustawienia menu górnego";
    			t2 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t3 = text("Wielkość czcionki");
    			input0 = element("input");
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Rodzaj czcionki");
    			input1 = element("input");
    			t6 = space();
    			p2 = element("p");
    			t7 = text("Kolor tekstu");
    			input2 = element("input");
    			t8 = space();
    			p3 = element("p");
    			t9 = text("Kolor główny");
    			input3 = element("input");
    			t10 = space();
    			button0 = element("button");
    			button0.textContent = "Ustaw";
    			t12 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t13 = text("Zmień opcje wyświetlanie menu ");
    			button1 = element("button");
    			button1.textContent = "Zmień";
    			add_location(h1, file$a, 119, 4, 3659);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "id", "fontSize");
    			add_location(input0, file$a, 121, 28, 3747);
    			attr_dev(p0, "class", "svelte-1nqyhj8");
    			add_location(p0, file$a, 121, 8, 3727);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "fontFamily");
    			add_location(input1, file$a, 122, 26, 3816);
    			attr_dev(p1, "class", "svelte-1nqyhj8");
    			add_location(p1, file$a, 122, 8, 3798);
    			attr_dev(input2, "type", "color");
    			attr_dev(input2, "id", "fontColor");
    			add_location(input2, file$a, 123, 23, 3882);
    			attr_dev(p2, "class", "svelte-1nqyhj8");
    			add_location(p2, file$a, 123, 8, 3867);
    			attr_dev(input3, "type", "color");
    			attr_dev(input3, "id", "mainColor");
    			add_location(input3, file$a, 124, 23, 3948);
    			attr_dev(p3, "class", "svelte-1nqyhj8");
    			add_location(p3, file$a, 124, 8, 3933);
    			add_location(button0, file$a, 125, 8, 3999);
    			attr_dev(div0, "class", "inputs svelte-1nqyhj8");
    			add_location(div0, file$a, 120, 4, 3697);
    			add_location(button1, file$a, 129, 42, 4132);
    			add_location(h2, file$a, 128, 8, 4084);
    			add_location(div1, file$a, 127, 4, 4069);
    			attr_dev(div2, "class", "main svelte-1nqyhj8");
    			add_location(div2, file$a, 118, 0, 3635);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, h1);
    			append_dev(div2, t2);
    			append_dev(div2, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, input0);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, input1);
    			append_dev(div0, t6);
    			append_dev(div0, p2);
    			append_dev(p2, t7);
    			append_dev(p2, input2);
    			append_dev(div0, t8);
    			append_dev(div0, p3);
    			append_dev(p3, t9);
    			append_dev(p3, input3);
    			append_dev(div0, t10);
    			append_dev(div0, button0);
    			append_dev(div2, t12);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t13);
    			append_dev(h2, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[2], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[3], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div2);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $topMenuOption;
    	let $Footer;
    	let $sliderDescription;
    	let $sliderTime;
    	let $topMenu;
    	let $category;
    	let $title;
    	let $article;
    	let $articleId;
    	let $themeId;
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(4, $topMenuOption = $$value));
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(5, $Footer = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(6, $sliderDescription = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(7, $sliderTime = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(8, $topMenu = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(9, $category = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(10, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(11, $article = $$value));
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(12, $articleId = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(13, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Menusettings', slots, []);

    	const sendFetch = id => {
    		topMenu.set(id);

    		const body2 = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer
    		};

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body2),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		const fontSize = document.getElementById("fontSize").value;
    		const fontFamily = document.getElementById("fontFamily").value;
    		const fontColor = document.getElementById("fontColor").value;
    		const mainColor = document.getElementById("mainColor").value;

    		const body = {
    			fontSize,
    			fontFamily,
    			fontColor,
    			mainColor
    		};

    		fetch("http://127.0.0.1:5000/topMenuSettings", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		fetch(`/motyw?id=${id}`, { method: "post" }).then(response => response.json()).then(data => {
    			topMenu.set(data.id);

    			topMenuSettings.set({
    				fontSize,
    				fontFamily,
    				fontColor,
    				mainColor
    			});
    		});
    	};

    	const setTopMenuOption = () => {
    		if ($topMenuOption) {
    			topMenuOption.set(false);
    		} else {
    			topMenuOption.set(true);
    		}

    		const body2 = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer
    		};

    		console.log($topMenuOption);

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body2),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$6.warn(`<Menusettings> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => sendFetch(4);
    	const click_handler_1 = () => setTopMenuOption();

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		sendFetch,
    		setTopMenuOption,
    		$topMenuOption,
    		$Footer,
    		$sliderDescription,
    		$sliderTime,
    		$topMenu,
    		$category,
    		$title,
    		$article,
    		$articleId,
    		$themeId
    	});

    	return [sendFetch, setTopMenuOption, click_handler, click_handler_1];
    }

    class Menusettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menusettings",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\Comments.svelte generated by Svelte v3.47.0 */

    const { console: console_1$5 } = globals;

    const file$9 = "src\\components\\Comments.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	child_ctx[8] = i;
    	return child_ctx;
    }

    // (68:8) {#each addedComments as comment, i}
    function create_each_block$2(ctx) {
    	let div;
    	let t0_value = /*i*/ ctx[8] + 1 + "";
    	let t0;
    	let t1;
    	let t2_value = /*comment*/ ctx[6] + "";
    	let t2;
    	let t3;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = text(t0_value);
    			t1 = text(". ");
    			t2 = text(t2_value);
    			t3 = space();
    			attr_dev(div, "class", "comment svelte-8kjayc");
    			add_location(div, file$9, 68, 12, 1932);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t0);
    			append_dev(div, t1);
    			append_dev(div, t2);
    			append_dev(div, t3);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*addedComments*/ 1 && t2_value !== (t2_value = /*comment*/ ctx[6] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(68:8) {#each addedComments as comment, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let h1;
    	let t1;
    	let div1;
    	let input;
    	let t2;
    	let button;
    	let t4;
    	let div0;
    	let mounted;
    	let dispose;
    	let each_value = /*addedComments*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Komentarze";
    			t1 = space();
    			div1 = element("div");
    			input = element("input");
    			t2 = space();
    			button = element("button");
    			button.textContent = "Dodaj komentarz";
    			t4 = space();
    			div0 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$9, 62, 0, 1699);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "id", "comment");
    			add_location(input, file$9, 64, 4, 1748);
    			add_location(button, file$9, 65, 4, 1788);
    			attr_dev(div0, "id", "added comments");
    			add_location(div0, file$9, 66, 4, 1848);
    			attr_dev(div1, "class", "comments");
    			add_location(div1, file$9, 63, 0, 1720);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, input);
    			append_dev(div1, t2);
    			append_dev(div1, button);
    			append_dev(div1, t4);
    			append_dev(div1, div0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div0, null);
    			}

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addComment*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*addedComments*/ 1) {
    				each_value = /*addedComments*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $articleId;
    	let $articles;
    	let $comments;
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(3, $articleId = $$value));
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(4, $articles = $$value));
    	validate_store(comments, 'comments');
    	component_subscribe($$self, comments, $$value => $$invalidate(5, $comments = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Comments', slots, []);
    	let login = "";

    	fetch("/login").then(response => response.json()).then(data => {
    		if (!(data.poziom == "admin" && data.login != "admin" && data.password != "admin")) {
    			login = data.login;
    		} else {
    			login = "admin";
    		}
    	});

    	let addedComments = [...$comments];

    	const addComment = () => {
    		const newComment = document.getElementById("comment").value;
    		$$invalidate(0, addedComments = [...addedComments, newComment]);
    		set_store_value(articles, $articles.articles[$articleId].comments = addedComments, $articles);

    		const body = {
    			comment: newComment,
    			articleId: $articles.articles[$articleId].id
    		};

    		console.log(body);

    		fetch("http://127.0.0.1:5000/addComments", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$5.warn(`<Comments> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		login,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		addedComments,
    		addComment,
    		$articleId,
    		$articles,
    		$comments
    	});

    	$$self.$inject_state = $$props => {
    		if ('login' in $$props) login = $$props.login;
    		if ('addedComments' in $$props) $$invalidate(0, addedComments = $$props.addedComments);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [addedComments, addComment];
    }

    class Comments extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Comments",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\News2.svelte generated by Svelte v3.47.0 */
    const file$8 = "src\\components\\News2.svelte";

    function create_fragment$9(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let comments;
    	let current;
    	comments = new Comments({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*$title*/ ctx[0]);
    			t1 = space();
    			t2 = text(/*$article*/ ctx[1]);
    			t3 = space();
    			create_component(comments.$$.fragment);
    			add_location(h1, file$8, 17, 12, 563);
    			add_location(div0, file$8, 16, 8, 544);
    			attr_dev(div1, "class", "" + (null_to_empty(/*bigNews*/ ctx[2]) + " svelte-177s7ju"));
    			add_location(div1, file$8, 15, 4, 513);
    			attr_dev(main, "class", "main svelte-177s7ju");
    			set_style(main, "--fontSize", /*fontSize*/ ctx[3] + "px");
    			set_style(main, "--fontFamily", /*fontFamily*/ ctx[4]);
    			set_style(main, "--bgColor", /*mainColor*/ ctx[6]);
    			set_style(main, "--color", /*fontColor*/ ctx[5]);
    			add_location(main, file$8, 11, 0, 372);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(main, t3);
    			mount_component(comments, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$title*/ 1) set_data_dev(t0, /*$title*/ ctx[0]);
    			if (!current || dirty & /*$article*/ 2) set_data_dev(t2, /*$article*/ ctx[1]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(comments.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(comments.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(comments);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let $newTheme;
    	let $themeId;
    	let $title;
    	let $article;
    	validate_store(newTheme, 'newTheme');
    	component_subscribe($$self, newTheme, $$value => $$invalidate(7, $newTheme = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(8, $themeId = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(0, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(1, $article = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('News2', slots, []);
    	const bigNews = `bigNews${$themeId}`;
    	const fontSize = $newTheme.fontSize;
    	const fontFamily = $newTheme.fontFamily;
    	const fontColor = $newTheme.fontColor;
    	const mainColor = $newTheme.mainColor;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<News2> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Comments,
    		themeId,
    		article,
    		newTheme,
    		title,
    		category,
    		bigNews,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		$newTheme,
    		$themeId,
    		$title,
    		$article
    	});

    	return [$title, $article, bigNews, fontSize, fontFamily, fontColor, mainColor];
    }

    class News2 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "News2",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\routes\Second.svelte generated by Svelte v3.47.0 */

    function create_fragment$8(ctx) {
    	let navigation;
    	let t0;
    	let news2;
    	let t1;
    	let footer;
    	let current;
    	navigation = new Navigation({ $$inline: true });
    	news2 = new News2({ $$inline: true });
    	footer = new Footer_1({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			create_component(news2.$$.fragment);
    			t1 = space();
    			create_component(footer.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(news2, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(footer, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			transition_in(news2.$$.fragment, local);
    			transition_in(footer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			transition_out(news2.$$.fragment, local);
    			transition_out(footer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(news2, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(footer, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Second', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Second> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Navigation, Footer: Footer_1, Slider, News2 });
    	return [];
    }

    class Second extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Second",
    			options,
    			id: create_fragment$8.name
    		});
    	}
    }

    /* src\routes\Articles.svelte generated by Svelte v3.47.0 */

    const { console: console_1$4 } = globals;
    const file$7 = "src\\routes\\Articles.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[34] = list[i];
    	child_ctx[36] = i;
    	return child_ctx;
    }

    // (192:16) {#if login != ""}
    function create_if_block_1(ctx) {
    	let button0;
    	let t0;
    	let button0_value_value;
    	let t1;
    	let button1;
    	let t2;
    	let button1_value_value;
    	let mounted;
    	let dispose;

    	const block_1 = {
    		c: function create() {
    			button0 = element("button");
    			t0 = text("Edytuj");
    			t1 = space();
    			button1 = element("button");
    			t2 = text("Usuń");
    			button0.value = button0_value_value = /*art*/ ctx[34].id;
    			add_location(button0, file$7, 192, 20, 5623);
    			button1.value = button1_value_value = /*art*/ ctx[34].id;
    			add_location(button1, file$7, 194, 20, 5728);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button0, anchor);
    			append_dev(button0, t0);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, button1, anchor);
    			append_dev(button1, t2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*editArticle*/ ctx[13], false, false, false),
    					listen_dev(button1, "click", /*deleteArticle*/ ctx[12], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*articlesTable*/ 4 && button0_value_value !== (button0_value_value = /*art*/ ctx[34].id)) {
    				prop_dev(button0, "value", button0_value_value);
    			}

    			if (dirty[0] & /*articlesTable*/ 4 && button1_value_value !== (button1_value_value = /*art*/ ctx[34].id)) {
    				prop_dev(button1, "value", button1_value_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(button1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(192:16) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block_1;
    }

    // (204:20) <Link to="/second" on:click={() => setArticle(i)}                          >
    function create_default_slot$1(ctx) {
    	let t;

    	const block_1 = {
    		c: function create() {
    			t = text("Read more");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(204:20) <Link to=\\\"/second\\\" on:click={() => setArticle(i)}                          >",
    		ctx
    	});

    	return block_1;
    }

    // (190:8) {#each articlesTable as art, i}
    function create_each_block$1(ctx) {
    	let div2;
    	let t0;
    	let h1;
    	let t1_value = /*art*/ ctx[34].title + "";
    	let t1;
    	let t2;
    	let h3;
    	let t3_value = /*art*/ ctx[34].category + "";
    	let t3;
    	let t4;
    	let div0;
    	let t5_value = /*art*/ ctx[34].text + "";
    	let t5;
    	let t6;
    	let div1;
    	let link;
    	let t7;
    	let div2_class_value;
    	let current;
    	let if_block = /*login*/ ctx[5] != "" && create_if_block_1(ctx);

    	function click_handler_5() {
    		return /*click_handler_5*/ ctx[27](/*i*/ ctx[36]);
    	}

    	link = new Link$1({
    			props: {
    				to: "/second",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link.$on("click", click_handler_5);

    	const block_1 = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block) if_block.c();
    			t0 = space();
    			h1 = element("h1");
    			t1 = text(t1_value);
    			t2 = space();
    			h3 = element("h3");
    			t3 = text(t3_value);
    			t4 = space();
    			div0 = element("div");
    			t5 = text(t5_value);
    			t6 = space();
    			div1 = element("div");
    			create_component(link.$$.fragment);
    			t7 = space();
    			add_location(h1, file$7, 197, 16, 5852);
    			add_location(h3, file$7, 198, 16, 5890);
    			attr_dev(div0, "id", "text1");
    			add_location(div0, file$7, 199, 16, 5931);
    			attr_dev(div1, "class", "bt svelte-dpib64");
    			add_location(div1, file$7, 202, 16, 6021);
    			attr_dev(div2, "class", div2_class_value = "" + (null_to_empty(/*news*/ ctx[1]) + " svelte-dpib64"));
    			add_location(div2, file$7, 190, 12, 5548);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block) if_block.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, h1);
    			append_dev(h1, t1);
    			append_dev(div2, t2);
    			append_dev(div2, h3);
    			append_dev(h3, t3);
    			append_dev(div2, t4);
    			append_dev(div2, div0);
    			append_dev(div0, t5);
    			append_dev(div2, t6);
    			append_dev(div2, div1);
    			mount_component(link, div1, null);
    			append_dev(div2, t7);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*login*/ ctx[5] != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(div2, t0);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if ((!current || dirty[0] & /*articlesTable*/ 4) && t1_value !== (t1_value = /*art*/ ctx[34].title + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*articlesTable*/ 4) && t3_value !== (t3_value = /*art*/ ctx[34].category + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty[0] & /*articlesTable*/ 4) && t5_value !== (t5_value = /*art*/ ctx[34].text + "")) set_data_dev(t5, t5_value);
    			const link_changes = {};

    			if (dirty[1] & /*$$scope*/ 64) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (!current || dirty[0] & /*news*/ 2 && div2_class_value !== (div2_class_value = "" + (null_to_empty(/*news*/ ctx[1]) + " svelte-dpib64"))) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block) if_block.d();
    			destroy_component(link);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(190:8) {#each articlesTable as art, i}",
    		ctx
    	});

    	return block_1;
    }

    // (211:4) {#if login != ""}
    function create_if_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Dodaj";
    			add_location(button, file$7, 211, 8, 6279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addArticles*/ ctx[14], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_if_block.name,
    		type: "if",
    		source: "(211:4) {#if login != \\\"\\\"}",
    		ctx
    	});

    	return block_1;
    }

    function create_fragment$7(ctx) {
    	let navigation;
    	let t0;
    	let main_1;
    	let div0;
    	let t1;
    	let input0;
    	let button0;
    	let t3;
    	let button1;
    	let t5;
    	let div1;
    	let t6;
    	let input1;
    	let button2;
    	let t8;
    	let div2;
    	let button3;
    	let t10;
    	let button4;
    	let t12;
    	let div3;
    	let div3_class_value;
    	let t13;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });
    	let each_value = /*articlesTable*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	let if_block = /*login*/ ctx[5] != "" && create_if_block(ctx);

    	const block_1 = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			main_1 = element("main");
    			div0 = element("div");
    			t1 = text("Wyszukaj tytuł ");
    			input0 = element("input");
    			button0 = element("button");
    			button0.textContent = "Filtruj";
    			t3 = space();
    			button1 = element("button");
    			button1.textContent = "Pokaż wszystkie";
    			t5 = space();
    			div1 = element("div");
    			t6 = text("Wyszukaj kategorie ");
    			input1 = element("input");
    			button2 = element("button");
    			button2.textContent = "Filtruj";
    			t8 = space();
    			div2 = element("div");
    			button3 = element("button");
    			button3.textContent = "Sortuj po kategoriach";
    			t10 = space();
    			button4 = element("button");
    			button4.textContent = "Sortuj po tytułach";
    			t12 = space();
    			div3 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t13 = space();
    			if (if_block) if_block.c();
    			attr_dev(input0, "type", "text");
    			add_location(input0, file$7, 165, 23, 4699);
    			add_location(button0, file$7, 165, 67, 4743);
    			add_location(button1, file$7, 168, 8, 4838);
    			add_location(div0, file$7, 164, 4, 4669);
    			attr_dev(input1, "type", "text");
    			add_location(input1, file$7, 171, 27, 4950);
    			add_location(button2, file$7, 174, 10, 5032);
    			add_location(div1, file$7, 170, 4, 4916);
    			add_location(button3, file$7, 177, 8, 5130);
    			add_location(button4, file$7, 182, 8, 5297);
    			add_location(div2, file$7, 176, 4, 5115);
    			attr_dev(div3, "class", div3_class_value = "" + (null_to_empty(/*smallNews*/ ctx[0]) + " svelte-dpib64"));
    			add_location(div3, file$7, 188, 4, 5470);
    			attr_dev(main_1, "class", "" + (null_to_empty(/*main*/ ctx[6]) + " svelte-dpib64"));
    			set_style(main_1, "--fontSize", /*fontSize*/ ctx[7] + "px");
    			set_style(main_1, "--fontFamily", /*fontFamily*/ ctx[8]);
    			set_style(main_1, "--bgColor", /*mainColor*/ ctx[10]);
    			set_style(main_1, "--color", /*fontColor*/ ctx[9]);
    			add_location(main_1, file$7, 160, 0, 4528);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main_1, anchor);
    			append_dev(main_1, div0);
    			append_dev(div0, t1);
    			append_dev(div0, input0);
    			/*input0_binding*/ ctx[20](input0);
    			append_dev(div0, button0);
    			append_dev(div0, t3);
    			append_dev(div0, button1);
    			append_dev(main_1, t5);
    			append_dev(main_1, div1);
    			append_dev(div1, t6);
    			append_dev(div1, input1);
    			/*input1_binding*/ ctx[23](input1);
    			append_dev(div1, button2);
    			append_dev(main_1, t8);
    			append_dev(main_1, div2);
    			append_dev(div2, button3);
    			append_dev(div2, t10);
    			append_dev(div2, button4);
    			append_dev(main_1, t12);
    			append_dev(main_1, div3);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div3, null);
    			}

    			append_dev(main_1, t13);
    			if (if_block) if_block.m(main_1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[21], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[22], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[24], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[25], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[26], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*news, setArticle, articlesTable, deleteArticle, editArticle, login*/ 14374) {
    				each_value = /*articlesTable*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div3, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty[0] & /*smallNews*/ 1 && div3_class_value !== (div3_class_value = "" + (null_to_empty(/*smallNews*/ ctx[0]) + " svelte-dpib64"))) {
    				attr_dev(div3, "class", div3_class_value);
    			}

    			if (/*login*/ ctx[5] != "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(main_1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main_1);
    			/*input0_binding*/ ctx[20](null);
    			/*input1_binding*/ ctx[23](null);
    			destroy_each(each_blocks, detaching);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $articles;
    	let $newTheme;
    	let $themeId;
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(30, $articles = $$value));
    	validate_store(newTheme, 'newTheme');
    	component_subscribe($$self, newTheme, $$value => $$invalidate(31, $newTheme = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(32, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Articles', slots, []);
    	let smallNews = `smallNews${$themeId}`;
    	let news = `news${$themeId}`;
    	let main = `main${$themeId}`;
    	const block = $newTheme.block;
    	const fontSize = $newTheme.fontSize;
    	const fontFamily = $newTheme.fontFamily;
    	const fontColor = $newTheme.fontColor;
    	const mainColor = $newTheme.mainColor;
    	let articlesTable = [...$articles.articles];

    	if (main === "main4") {
    		if (block == 1) {
    			smallNews = "smallNews1";
    			news = "news1";
    		} else if (block == 2) {
    			smallNews = "smallNews2";
    			news = "news2";
    		} else if (block == 3) {
    			smallNews = "smallNews3";
    			news = "news3";
    		}
    	}

    	const setArticle = x => {
    		articleId.set(x);
    		comments.set(articlesTable[x].comments);
    		article.set(articlesTable[x].text);
    		title.set(articlesTable[x].title);
    		category.set(articlesTable[x].category);
    	};

    	const deleteArticle = e => {
    		let id = e.target.value;
    		let obj = { id };

    		fetch("http://127.0.0.1:5000/deleteArticles", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(obj),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		articles.update(x => {
    			let obj = x;

    			obj.articles = x.articles.filter(l => {
    				return l.id != id;
    			});

    			return obj;
    		});

    		$$invalidate(2, articlesTable = [...$articles.articles]);
    		console.log($articles);
    	};

    	const editArticle = e => {
    		let idd = e.target.value;
    		id.set(idd);
    		navigate("/editArticles/" + idd);
    	};

    	const addArticles = e => {
    		navigate("/addArticles/");
    	};

    	let filtrTitle = "";
    	let filtrCategory = "";

    	const filtrTitleFunction = () => {
    		$$invalidate(2, articlesTable.length = 0, articlesTable);

    		if (filtrTitle.value != "") {
    			$articles.articles.forEach(e => {
    				if (e.title.toLowerCase() == filtrTitle.value.toLowerCase()) {
    					articlesTable.push(e);
    				}
    			});
    		}
    	};

    	const allTitle = () => {
    		$$invalidate(2, articlesTable = [...$articles.articles]);
    	};

    	const filtrCategoryFunction = () => {
    		$$invalidate(2, articlesTable.length = 0, articlesTable);

    		if (filtrCategory.value != "") {
    			$articles.articles.forEach(e => {
    				if (e.category.toLowerCase() == filtrCategory.value.toLowerCase()) {
    					articlesTable.push(e);
    				}
    			});
    		}
    	};

    	const sortStr = (a, b) => {
    		const tmpA = a.category.toLowerCase();
    		const tmpB = b.category.toLowerCase();

    		if (tmpA > tmpB) {
    			return 1;
    		} else if (tmpA < tmpB) {
    			return -1;
    		} else {
    			return 0;
    		}
    	};

    	const sortStr2 = (a, b) => {
    		const tmpA = a.title.toLowerCase();
    		const tmpB = b.title.toLowerCase();

    		if (tmpA > tmpB) {
    			return 1;
    		} else if (tmpA < tmpB) {
    			return -1;
    		} else {
    			return 0;
    		}
    	};

    	let login = "";
    	let password = "";
    	let poziom = "";

    	fetch("/login").then(response => response.json()).then(data => {
    		if (!(data.poziom == "admin" && data.login != "admin" && data.password != "admin")) {
    			$$invalidate(5, login = data.login);
    			password = data.password;
    			poziom = data.poziom;
    		} else {
    			$$invalidate(5, login = "admin");
    			password = "admin";
    			poziom = "admin";
    		}
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$4.warn(`<Articles> was created with unknown prop '${key}'`);
    	});

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			filtrTitle = $$value;
    			$$invalidate(3, filtrTitle);
    		});
    	}

    	const click_handler = () => filtrTitleFunction();
    	const click_handler_1 = () => allTitle();

    	function input1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			filtrCategory = $$value;
    			$$invalidate(4, filtrCategory);
    		});
    	}

    	const click_handler_2 = () => filtrCategoryFunction();

    	const click_handler_3 = () => {
    		$$invalidate(2, articlesTable = articlesTable.sort(sortStr));
    	};

    	const click_handler_4 = () => {
    		$$invalidate(2, articlesTable = articlesTable.sort(sortStr2));
    	};

    	const click_handler_5 = i => setArticle(i);

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		navigate,
    		id,
    		themeId,
    		article,
    		newTheme,
    		articles,
    		category,
    		title,
    		articleId,
    		comments,
    		Navigation,
    		smallNews,
    		news,
    		main,
    		block,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		articlesTable,
    		setArticle,
    		deleteArticle,
    		editArticle,
    		addArticles,
    		filtrTitle,
    		filtrCategory,
    		filtrTitleFunction,
    		allTitle,
    		filtrCategoryFunction,
    		sortStr,
    		sortStr2,
    		login,
    		password,
    		poziom,
    		$articles,
    		$newTheme,
    		$themeId
    	});

    	$$self.$inject_state = $$props => {
    		if ('smallNews' in $$props) $$invalidate(0, smallNews = $$props.smallNews);
    		if ('news' in $$props) $$invalidate(1, news = $$props.news);
    		if ('main' in $$props) $$invalidate(6, main = $$props.main);
    		if ('articlesTable' in $$props) $$invalidate(2, articlesTable = $$props.articlesTable);
    		if ('filtrTitle' in $$props) $$invalidate(3, filtrTitle = $$props.filtrTitle);
    		if ('filtrCategory' in $$props) $$invalidate(4, filtrCategory = $$props.filtrCategory);
    		if ('login' in $$props) $$invalidate(5, login = $$props.login);
    		if ('password' in $$props) password = $$props.password;
    		if ('poziom' in $$props) poziom = $$props.poziom;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		smallNews,
    		news,
    		articlesTable,
    		filtrTitle,
    		filtrCategory,
    		login,
    		main,
    		fontSize,
    		fontFamily,
    		fontColor,
    		mainColor,
    		setArticle,
    		deleteArticle,
    		editArticle,
    		addArticles,
    		filtrTitleFunction,
    		allTitle,
    		filtrCategoryFunction,
    		sortStr,
    		sortStr2,
    		input0_binding,
    		click_handler,
    		click_handler_1,
    		input1_binding,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5
    	];
    }

    class Articles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Articles",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src\routes\Slidersettings.svelte generated by Svelte v3.47.0 */

    const { console: console_1$3 } = globals;

    const file$6 = "src\\routes\\Slidersettings.svelte";

    function create_fragment$6(ctx) {
    	let navigation;
    	let t0;
    	let main;
    	let h1;
    	let t2;
    	let div0;
    	let t3;
    	let input0;
    	let t4;
    	let div1;
    	let t5;
    	let input1;
    	let t6;
    	let div2;
    	let t7;
    	let input2;
    	let t8;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Ustawienia slidera";
    			t2 = space();
    			div0 = element("div");
    			t3 = text("Dodaj zdjęcie");
    			input0 = element("input");
    			t4 = space();
    			div1 = element("div");
    			t5 = text("Ustaw opis");
    			input1 = element("input");
    			t6 = space();
    			div2 = element("div");
    			t7 = text("Ustaw czas przejścia");
    			input2 = element("input");
    			t8 = space();
    			button = element("button");
    			button.textContent = "Ustaw";
    			add_location(h1, file$6, 64, 4, 1757);
    			attr_dev(input0, "type", "file");
    			attr_dev(input0, "accept", ".jpg, .jpeg, .png");
    			add_location(input0, file$6, 66, 21, 1818);
    			attr_dev(div0, "class", "svelte-8l058b");
    			add_location(div0, file$6, 65, 4, 1790);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "description");
    			add_location(input1, file$6, 73, 19, 2019);
    			attr_dev(div1, "class", "svelte-8l058b");
    			add_location(div1, file$6, 73, 4, 2004);
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "id", "time");
    			add_location(input2, file$6, 74, 29, 2094);
    			attr_dev(div2, "class", "svelte-8l058b");
    			add_location(div2, file$6, 74, 4, 2069);
    			add_location(button, file$6, 75, 4, 2139);
    			attr_dev(main, "class", "svelte-8l058b");
    			add_location(main, file$6, 63, 0, 1745);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, div0);
    			append_dev(div0, t3);
    			append_dev(div0, input0);
    			/*input0_binding*/ ctx[4](input0);
    			append_dev(main, t4);
    			append_dev(main, div1);
    			append_dev(div1, t5);
    			append_dev(div1, input1);
    			append_dev(main, t6);
    			append_dev(main, div2);
    			append_dev(div2, t7);
    			append_dev(div2, input2);
    			append_dev(main, t8);
    			append_dev(main, button);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[3], false, false, false),
    					listen_dev(button, "click", /*click_handler*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			/*input0_binding*/ ctx[4](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $sliderImages;
    	let $Footer;
    	let $sliderTime;
    	let $topMenuOption;
    	let $topMenu;
    	let $category;
    	let $title;
    	let $article;
    	let $articleId;
    	let $themeId;
    	validate_store(sliderImages, 'sliderImages');
    	component_subscribe($$self, sliderImages, $$value => $$invalidate(6, $sliderImages = $$value));
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(7, $Footer = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(8, $sliderTime = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(9, $topMenuOption = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(10, $topMenu = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(11, $category = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(12, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(13, $article = $$value));
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(14, $articleId = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(15, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Slidersettings', slots, []);
    	let fileinput;

    	const onFileSelected = e => {
    		let image = e.target.files[0];
    		$$invalidate(0, fileinput = image);
    	};

    	const setSettings = () => {
    		const time = document.getElementById("time").value;
    		const description = document.getElementById("description").value;

    		const body2 = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: description,
    			Footer: $Footer
    		};

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body2),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		sliderImages.set([...$sliderImages, fileinput.name]);
    		sliderTime.set(time * 1000);
    		sliderDescription.set(description);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$3.warn(`<Slidersettings> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => onFileSelected(e);

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(0, fileinput);
    		});
    	}

    	const click_handler = () => setSettings();

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		fileinput,
    		onFileSelected,
    		setSettings,
    		$sliderImages,
    		$Footer,
    		$sliderTime,
    		$topMenuOption,
    		$topMenu,
    		$category,
    		$title,
    		$article,
    		$articleId,
    		$themeId
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileinput' in $$props) $$invalidate(0, fileinput = $$props.fileinput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileinput,
    		onFileSelected,
    		setSettings,
    		change_handler,
    		input0_binding,
    		click_handler
    	];
    }

    class Slidersettings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slidersettings",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\routes\Gallery.svelte generated by Svelte v3.47.0 */
    const file$5 = "src\\routes\\Gallery.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	return child_ctx;
    }

    // (81:8) {#each $images as image}
    function create_each_block(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (!src_url_equal(img.src, img_src_value = /*image*/ ctx[9])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "ok");
    			attr_dev(img, "class", "photo svelte-conumh");
    			set_style(img, "--width", /*width*/ ctx[0] + "px");
    			set_style(img, "--height", /*height*/ ctx[1] + "px");
    			add_location(img, file$5, 82, 16, 2380);
    			add_location(div, file$5, 81, 12, 2357);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$images*/ 16 && !src_url_equal(img.src, img_src_value = /*image*/ ctx[9])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*width*/ 1) {
    				set_style(img, "--width", /*width*/ ctx[0] + "px");
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(img, "--height", /*height*/ ctx[1] + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(81:8) {#each $images as image}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let navigation;
    	let t0;
    	let main;
    	let h1;
    	let t2;
    	let div18;
    	let div5;
    	let div4;
    	let div0;
    	let t3;
    	let div1;
    	let t4;
    	let div2;
    	let t5;
    	let div3;
    	let t6;
    	let input0;
    	let t7;
    	let div11;
    	let div10;
    	let div6;
    	let t8;
    	let div7;
    	let t9;
    	let div8;
    	let t10;
    	let div9;
    	let t11;
    	let input1;
    	let t12;
    	let div17;
    	let div16;
    	let div12;
    	let t13;
    	let div13;
    	let t14;
    	let div14;
    	let t15;
    	let div15;
    	let t16;
    	let input2;
    	let t17;
    	let div19;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });
    	let each_value = /*$images*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Galeria";
    			t2 = space();
    			div18 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			div0 = element("div");
    			t3 = space();
    			div1 = element("div");
    			t4 = space();
    			div2 = element("div");
    			t5 = space();
    			div3 = element("div");
    			t6 = space();
    			input0 = element("input");
    			t7 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div6 = element("div");
    			t8 = space();
    			div7 = element("div");
    			t9 = space();
    			div8 = element("div");
    			t10 = space();
    			div9 = element("div");
    			t11 = space();
    			input1 = element("input");
    			t12 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div12 = element("div");
    			t13 = space();
    			div13 = element("div");
    			t14 = space();
    			div14 = element("div");
    			t15 = space();
    			div15 = element("div");
    			t16 = space();
    			input2 = element("input");
    			t17 = space();
    			div19 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h1, file$5, 33, 4, 864);
    			attr_dev(div0, "class", "block11 svelte-conumh");
    			add_location(div0, file$5, 37, 16, 987);
    			attr_dev(div1, "class", "block11 svelte-conumh");
    			add_location(div1, file$5, 38, 16, 1028);
    			attr_dev(div2, "class", "block11 svelte-conumh");
    			add_location(div2, file$5, 39, 16, 1069);
    			attr_dev(div3, "class", "block11 svelte-conumh");
    			add_location(div3, file$5, 40, 16, 1110);
    			attr_dev(div4, "class", "block1 svelte-conumh");
    			add_location(div4, file$5, 36, 12, 949);
    			attr_dev(input0, "type", "radio");
    			attr_dev(input0, "name", "block");
    			input0.value = "1";
    			input0.checked = true;
    			add_location(input0, file$5, 42, 12, 1167);
    			attr_dev(div5, "class", "block");
    			add_location(div5, file$5, 35, 8, 916);
    			attr_dev(div6, "class", "block22 svelte-conumh");
    			add_location(div6, file$5, 52, 16, 1442);
    			attr_dev(div7, "class", "block22 svelte-conumh");
    			add_location(div7, file$5, 53, 16, 1483);
    			attr_dev(div8, "class", "block22 svelte-conumh");
    			add_location(div8, file$5, 54, 16, 1524);
    			attr_dev(div9, "class", "block22 svelte-conumh");
    			add_location(div9, file$5, 55, 16, 1565);
    			attr_dev(div10, "class", "block2 svelte-conumh");
    			add_location(div10, file$5, 51, 12, 1404);
    			attr_dev(input1, "type", "radio");
    			attr_dev(input1, "name", "block");
    			input1.value = "2";
    			add_location(input1, file$5, 57, 12, 1622);
    			attr_dev(div11, "class", "block");
    			add_location(div11, file$5, 50, 8, 1371);
    			attr_dev(div12, "class", "block33 svelte-conumh");
    			add_location(div12, file$5, 66, 16, 1872);
    			attr_dev(div13, "class", "block33 svelte-conumh");
    			add_location(div13, file$5, 67, 16, 1913);
    			attr_dev(div14, "class", "block33 svelte-conumh");
    			add_location(div14, file$5, 68, 16, 1954);
    			attr_dev(div15, "class", "block33 svelte-conumh");
    			add_location(div15, file$5, 69, 16, 1995);
    			attr_dev(div16, "class", "block3 svelte-conumh");
    			add_location(div16, file$5, 65, 12, 1834);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "block");
    			input2.value = "3";
    			add_location(input2, file$5, 71, 12, 2052);
    			attr_dev(div17, "class", "block");
    			add_location(div17, file$5, 64, 8, 1801);
    			attr_dev(div18, "class", "blocks svelte-conumh");
    			add_location(div18, file$5, 34, 4, 886);
    			attr_dev(div19, "class", "gallery svelte-conumh");
    			set_style(div19, "--display", /*flex*/ ctx[2]);
    			set_style(div19, "--flexWrap", /*flexWrap*/ ctx[3]);
    			add_location(div19, file$5, 79, 4, 2239);
    			attr_dev(main, "class", "svelte-conumh");
    			add_location(main, file$5, 32, 0, 852);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, div18);
    			append_dev(div18, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div0);
    			append_dev(div4, t3);
    			append_dev(div4, div1);
    			append_dev(div4, t4);
    			append_dev(div4, div2);
    			append_dev(div4, t5);
    			append_dev(div4, div3);
    			append_dev(div5, t6);
    			append_dev(div5, input0);
    			append_dev(div18, t7);
    			append_dev(div18, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div6);
    			append_dev(div10, t8);
    			append_dev(div10, div7);
    			append_dev(div10, t9);
    			append_dev(div10, div8);
    			append_dev(div10, t10);
    			append_dev(div10, div9);
    			append_dev(div11, t11);
    			append_dev(div11, input1);
    			append_dev(div18, t12);
    			append_dev(div18, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div12);
    			append_dev(div16, t13);
    			append_dev(div16, div13);
    			append_dev(div16, t14);
    			append_dev(div16, div14);
    			append_dev(div16, t15);
    			append_dev(div16, div15);
    			append_dev(div17, t16);
    			append_dev(div17, input2);
    			append_dev(main, t17);
    			append_dev(main, div19);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div19, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", /*change_handler*/ ctx[6], false, false, false),
    					listen_dev(input1, "change", /*change_handler_1*/ ctx[7], false, false, false),
    					listen_dev(input2, "change", /*change_handler_2*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$images, width, height*/ 19) {
    				each_value = /*$images*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div19, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (!current || dirty & /*flex*/ 4) {
    				set_style(div19, "--display", /*flex*/ ctx[2]);
    			}

    			if (!current || dirty & /*flexWrap*/ 8) {
    				set_style(div19, "--flexWrap", /*flexWrap*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $images;
    	validate_store(images, 'images');
    	component_subscribe($$self, images, $$value => $$invalidate(4, $images = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Gallery', slots, []);
    	let width = 200;
    	let height = 200;
    	let flex = "flex";
    	let flexWrap = "wrap";

    	const change = () => {
    		const blockValue = document.querySelector('input[name="block"]:checked').value;

    		if (blockValue == 1) {
    			$$invalidate(0, width = 200);
    			$$invalidate(1, height = 200);
    			$$invalidate(2, flex = "flex");
    			$$invalidate(3, flexWrap = "wrap");
    		} else if (blockValue == 2) {
    			$$invalidate(2, flex = "flex");
    			$$invalidate(0, width = 450);
    			$$invalidate(1, height = 450);
    			$$invalidate(3, flexWrap = "wrap");
    		} else if (blockValue == 3) {
    			$$invalidate(2, flex = "");
    			$$invalidate(0, width = 600);
    			$$invalidate(1, height = 600);
    			$$invalidate(3, flexWrap = "nowrap");
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Gallery> was created with unknown prop '${key}'`);
    	});

    	const change_handler = () => change();
    	const change_handler_1 = () => change();
    	const change_handler_2 = () => change();

    	$$self.$capture_state = () => ({
    		Navigation,
    		images,
    		width,
    		height,
    		flex,
    		flexWrap,
    		change,
    		$images
    	});

    	$$self.$inject_state = $$props => {
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('flex' in $$props) $$invalidate(2, flex = $$props.flex);
    		if ('flexWrap' in $$props) $$invalidate(3, flexWrap = $$props.flexWrap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		height,
    		flex,
    		flexWrap,
    		$images,
    		change,
    		change_handler,
    		change_handler_1,
    		change_handler_2
    	];
    }

    class Gallery extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Gallery",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src\routes\Footersettins.svelte generated by Svelte v3.47.0 */

    const { console: console_1$2 } = globals;

    const file$4 = "src\\routes\\Footersettins.svelte";

    function create_fragment$4(ctx) {
    	let navigation;
    	let t0;
    	let div1;
    	let h1;
    	let t2;
    	let div0;
    	let p0;
    	let t3;
    	let input0;
    	let t4;
    	let p1;
    	let t5;
    	let input1;
    	let t6;
    	let p2;
    	let t7;
    	let input2;
    	let t8;
    	let p3;
    	let t9;
    	let input3;
    	let t10;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Ustawienia stopki";
    			t2 = space();
    			div0 = element("div");
    			p0 = element("p");
    			t3 = text("Wielkość czcionki");
    			input0 = element("input");
    			t4 = space();
    			p1 = element("p");
    			t5 = text("Rodzaj czcionki");
    			input1 = element("input");
    			t6 = space();
    			p2 = element("p");
    			t7 = text("Kolor tekstu");
    			input2 = element("input");
    			t8 = space();
    			p3 = element("p");
    			t9 = text("Kolor główny");
    			input3 = element("input");
    			t10 = space();
    			button = element("button");
    			button.textContent = "Ustaw";
    			add_location(h1, file$4, 87, 4, 2654);
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "id", "fontSize");
    			add_location(input0, file$4, 89, 28, 2736);
    			attr_dev(p0, "class", "svelte-1nqyhj8");
    			add_location(p0, file$4, 89, 8, 2716);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "fontFamily");
    			add_location(input1, file$4, 90, 26, 2805);
    			attr_dev(p1, "class", "svelte-1nqyhj8");
    			add_location(p1, file$4, 90, 8, 2787);
    			attr_dev(input2, "type", "color");
    			attr_dev(input2, "id", "fontColor");
    			add_location(input2, file$4, 91, 23, 2871);
    			attr_dev(p2, "class", "svelte-1nqyhj8");
    			add_location(p2, file$4, 91, 8, 2856);
    			attr_dev(input3, "type", "color");
    			attr_dev(input3, "id", "mainColor");
    			add_location(input3, file$4, 92, 23, 2937);
    			attr_dev(p3, "class", "svelte-1nqyhj8");
    			add_location(p3, file$4, 92, 8, 2922);
    			add_location(button, file$4, 93, 8, 2988);
    			attr_dev(div0, "class", "inputs svelte-1nqyhj8");
    			add_location(div0, file$4, 88, 4, 2686);
    			attr_dev(div1, "class", "main svelte-1nqyhj8");
    			add_location(div1, file$4, 86, 0, 2630);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, h1);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			append_dev(div0, p0);
    			append_dev(p0, t3);
    			append_dev(p0, input0);
    			append_dev(div0, t4);
    			append_dev(div0, p1);
    			append_dev(p1, t5);
    			append_dev(p1, input1);
    			append_dev(div0, t6);
    			append_dev(div0, p2);
    			append_dev(p2, t7);
    			append_dev(p2, input2);
    			append_dev(div0, t8);
    			append_dev(div0, p3);
    			append_dev(p3, t9);
    			append_dev(p3, input3);
    			append_dev(div0, t10);
    			append_dev(div0, button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $Footer;
    	let $sliderDescription;
    	let $sliderTime;
    	let $topMenuOption;
    	let $topMenu;
    	let $category;
    	let $title;
    	let $article;
    	let $articleId;
    	let $themeId;
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(2, $Footer = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(3, $sliderDescription = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(4, $sliderTime = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(5, $topMenuOption = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(6, $topMenu = $$value));
    	validate_store(category, 'category');
    	component_subscribe($$self, category, $$value => $$invalidate(7, $category = $$value));
    	validate_store(title, 'title');
    	component_subscribe($$self, title, $$value => $$invalidate(8, $title = $$value));
    	validate_store(article, 'article');
    	component_subscribe($$self, article, $$value => $$invalidate(9, $article = $$value));
    	validate_store(articleId, 'articleId');
    	component_subscribe($$self, articleId, $$value => $$invalidate(10, $articleId = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(11, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Footersettins', slots, []);

    	const sendFetch = id => {
    		Footer.set(id);

    		const body2 = {
    			themeId: $themeId,
    			articleId: $articleId,
    			article: $article,
    			title: $title,
    			category: $category,
    			topMenu: $topMenu,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer
    		};

    		fetch("http://127.0.0.1:5000/variables", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body2),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		const fontSize = document.getElementById("fontSize").value;
    		const fontFamily = document.getElementById("fontFamily").value;
    		const fontColor = document.getElementById("fontColor").value;
    		const mainColor = document.getElementById("mainColor").value;

    		const body = {
    			fontSize,
    			fontFamily,
    			fontColor,
    			mainColor
    		};

    		fetch("http://127.0.0.1:5000/FooterSettings", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(body),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		fetch(`/motyw?id=${id}`, { method: "post" }).then(response => response.json()).then(data => {
    			Footer.set(data.id);

    			FooterSettings.set({
    				fontSize,
    				fontFamily,
    				fontColor,
    				mainColor
    			});
    		});
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$2.warn(`<Footersettins> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => sendFetch(4);

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		articleId,
    		article,
    		title,
    		comments,
    		category,
    		newTheme,
    		articles,
    		bigArticle,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderImages,
    		sliderTime,
    		sliderDescription,
    		images,
    		Footer,
    		FooterSettings,
    		sendFetch,
    		$Footer,
    		$sliderDescription,
    		$sliderTime,
    		$topMenuOption,
    		$topMenu,
    		$category,
    		$title,
    		$article,
    		$articleId,
    		$themeId
    	});

    	return [sendFetch, click_handler];
    }

    class Footersettins extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Footersettins",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src\routes\EditArticles.svelte generated by Svelte v3.47.0 */

    const { console: console_1$1 } = globals;
    const file$3 = "src\\routes\\EditArticles.svelte";

    function create_fragment$3(ctx) {
    	let main;
    	let div;
    	let t0;
    	let input0;
    	let br0;
    	let t1;
    	let input1;
    	let br1;
    	let t2;
    	let input2;
    	let br2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = text("Edytuj kategorię");
    			input0 = element("input");
    			br0 = element("br");
    			t1 = text("\r\n        Edytuj tytuł");
    			input1 = element("input");
    			br1 = element("br");
    			t2 = text("\r\n        Edytuj tekst");
    			input2 = element("input");
    			br2 = element("br");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Zapisz";
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "category");
    			attr_dev(input0, "class", "svelte-yjkzy7");
    			add_location(input0, file$3, 43, 24, 1520);
    			add_location(br0, file$3, 43, 59, 1555);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "title");
    			attr_dev(input1, "class", "svelte-yjkzy7");
    			add_location(input1, file$3, 44, 20, 1583);
    			add_location(br1, file$3, 44, 52, 1615);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "tekst");
    			attr_dev(input2, "class", "svelte-yjkzy7");
    			add_location(input2, file$3, 45, 20, 1643);
    			add_location(br2, file$3, 45, 52, 1675);
    			add_location(button, file$3, 46, 8, 1691);
    			attr_dev(div, "class", "edit svelte-yjkzy7");
    			add_location(div, file$3, 42, 4, 1476);
    			add_location(main, file$3, 41, 0, 1464);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, t0);
    			append_dev(div, input0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, input1);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			append_dev(div, input2);
    			append_dev(div, br2);
    			append_dev(div, t3);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*editArticle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $id;
    	let $articles;
    	validate_store(id, 'id');
    	component_subscribe($$self, id, $$value => $$invalidate(1, $id = $$value));
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(2, $articles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('EditArticles', slots, []);

    	const editArticle = e => {
    		let szukaneId = 0;

    		for (let i = 0; i < $articles.articles.length; i++) {
    			if ($articles.articles.id == $id) {
    				break;
    			} else {
    				szukaneId++;
    			}
    		}

    		console.log($articles.articles);
    		set_store_value(articles, $articles.articles[szukaneId - 1].category = document.getElementById("category").value, $articles);
    		set_store_value(articles, $articles.articles[szukaneId - 1].title = document.getElementById("title").value, $articles);
    		set_store_value(articles, $articles.articles[szukaneId - 1].text = document.getElementById("tekst").value, $articles);

    		let obj = {
    			id: $id,
    			category: document.getElementById("category").value,
    			title: document.getElementById("title").value,
    			text: document.getElementById("tekst").value,
    			comments: []
    		};

    		fetch("http://127.0.0.1:5000/editArticles", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(obj),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		navigate("/articles");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1$1.warn(`<EditArticles> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		navigate,
    		article,
    		articles,
    		id,
    		editArticle,
    		$id,
    		$articles
    	});

    	return [editArticle];
    }

    class EditArticles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EditArticles",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\routes\AddArticles.svelte generated by Svelte v3.47.0 */

    const { console: console_1 } = globals;
    const file$2 = "src\\routes\\AddArticles.svelte";

    function create_fragment$2(ctx) {
    	let main;
    	let div;
    	let t0;
    	let input0;
    	let br0;
    	let t1;
    	let input1;
    	let br1;
    	let t2;
    	let input2;
    	let br2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div = element("div");
    			t0 = text("Podaj kategorię");
    			input0 = element("input");
    			br0 = element("br");
    			t1 = text("\r\n        Podaj tytuł");
    			input1 = element("input");
    			br1 = element("br");
    			t2 = text("\r\n        Podaj tekst");
    			input2 = element("input");
    			br2 = element("br");
    			t3 = space();
    			button = element("button");
    			button.textContent = "Zapisz";
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "id", "category");
    			attr_dev(input0, "class", "svelte-yjkzy7");
    			add_location(input0, file$2, 31, 23, 1031);
    			add_location(br0, file$2, 31, 58, 1066);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "id", "title");
    			attr_dev(input1, "class", "svelte-yjkzy7");
    			add_location(input1, file$2, 32, 19, 1093);
    			add_location(br1, file$2, 32, 51, 1125);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "id", "tekst");
    			attr_dev(input2, "class", "svelte-yjkzy7");
    			add_location(input2, file$2, 33, 19, 1152);
    			add_location(br2, file$2, 33, 51, 1184);
    			add_location(button, file$2, 34, 8, 1200);
    			attr_dev(div, "class", "edit svelte-yjkzy7");
    			add_location(div, file$2, 30, 4, 988);
    			add_location(main, file$2, 29, 0, 976);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div);
    			append_dev(div, t0);
    			append_dev(div, input0);
    			append_dev(div, br0);
    			append_dev(div, t1);
    			append_dev(div, input1);
    			append_dev(div, br1);
    			append_dev(div, t2);
    			append_dev(div, input2);
    			append_dev(div, br2);
    			append_dev(div, t3);
    			append_dev(div, button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*addArticle*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $addId;
    	let $articles;
    	validate_store(addId, 'addId');
    	component_subscribe($$self, addId, $$value => $$invalidate(1, $addId = $$value));
    	validate_store(articles, 'articles');
    	component_subscribe($$self, articles, $$value => $$invalidate(2, $articles = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AddArticles', slots, []);

    	const addArticle = e => {
    		const id = $articles.articles.length;

    		let obj = {
    			id: id + 1,
    			category: document.getElementById("category").value,
    			title: document.getElementById("title").value,
    			text: document.getElementById("tekst").value,
    			comments: []
    		};

    		$articles.articles.push(obj);

    		fetch("http://127.0.0.1:5000/addArticles", {
    			method: "POST",
    			credentials: "include",
    			body: JSON.stringify(obj),
    			headers: new Headers({ "content-type": "application/json" })
    		}).then(response => response.json()).then(data => {
    			console.log(data);
    		});

    		navigate("/articles");
    		set_store_value(addId, $addId++, $addId);
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<AddArticles> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Link: Link$1,
    		navigate,
    		article,
    		articles,
    		id,
    		addId,
    		addArticle,
    		$addId,
    		$articles
    	});

    	return [addArticle];
    }

    class AddArticles extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AddArticles",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\routes\ImportExport.svelte generated by Svelte v3.47.0 */

    const file$1 = "src\\routes\\ImportExport.svelte";

    function create_fragment$1(ctx) {
    	let navigation;
    	let t0;
    	let main;
    	let h1;
    	let t2;
    	let div;
    	let t3;
    	let input;
    	let t4;
    	let button0;
    	let t6;
    	let button1;
    	let current;
    	let mounted;
    	let dispose;
    	navigation = new Navigation({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(navigation.$$.fragment);
    			t0 = space();
    			main = element("main");
    			h1 = element("h1");
    			h1.textContent = "Import/Export ustawień";
    			t2 = space();
    			div = element("div");
    			t3 = text("Dodaj zdjęcie");
    			input = element("input");
    			t4 = space();
    			button0 = element("button");
    			button0.textContent = "Importuj";
    			t6 = space();
    			button1 = element("button");
    			button1.textContent = "Eksportuj";
    			add_location(h1, file$1, 77, 4, 2588);
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", ".json");
    			add_location(input, file$1, 79, 21, 2653);
    			add_location(div, file$1, 78, 4, 2625);
    			add_location(button0, file$1, 86, 4, 2827);
    			add_location(button1, file$1, 87, 4, 2888);
    			attr_dev(main, "class", "svelte-1g02far");
    			add_location(main, file$1, 76, 0, 2576);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(navigation, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, h1);
    			append_dev(main, t2);
    			append_dev(main, div);
    			append_dev(div, t3);
    			append_dev(div, input);
    			/*input_binding*/ ctx[5](input);
    			append_dev(main, t4);
    			append_dev(main, button0);
    			append_dev(main, t6);
    			append_dev(main, button1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input, "change", /*change_handler*/ ctx[4], false, false, false),
    					listen_dev(button0, "click", /*click_handler*/ ctx[6], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(navigation.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(navigation.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(navigation, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(main);
    			/*input_binding*/ ctx[5](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $FooterSettings;
    	let $Footer;
    	let $sliderDescription;
    	let $sliderTime;
    	let $topMenuOption;
    	let $topMenuSettings;
    	let $topMenu;
    	let $newTheme;
    	let $themeId;
    	validate_store(FooterSettings, 'FooterSettings');
    	component_subscribe($$self, FooterSettings, $$value => $$invalidate(8, $FooterSettings = $$value));
    	validate_store(Footer, 'Footer');
    	component_subscribe($$self, Footer, $$value => $$invalidate(9, $Footer = $$value));
    	validate_store(sliderDescription, 'sliderDescription');
    	component_subscribe($$self, sliderDescription, $$value => $$invalidate(10, $sliderDescription = $$value));
    	validate_store(sliderTime, 'sliderTime');
    	component_subscribe($$self, sliderTime, $$value => $$invalidate(11, $sliderTime = $$value));
    	validate_store(topMenuOption, 'topMenuOption');
    	component_subscribe($$self, topMenuOption, $$value => $$invalidate(12, $topMenuOption = $$value));
    	validate_store(topMenuSettings, 'topMenuSettings');
    	component_subscribe($$self, topMenuSettings, $$value => $$invalidate(13, $topMenuSettings = $$value));
    	validate_store(topMenu, 'topMenu');
    	component_subscribe($$self, topMenu, $$value => $$invalidate(14, $topMenu = $$value));
    	validate_store(newTheme, 'newTheme');
    	component_subscribe($$self, newTheme, $$value => $$invalidate(15, $newTheme = $$value));
    	validate_store(themeId, 'themeId');
    	component_subscribe($$self, themeId, $$value => $$invalidate(16, $themeId = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ImportExport', slots, []);
    	let fileinput;

    	const onFileSelected = e => {
    		let file = e.target.files[0];
    		$$invalidate(0, fileinput = file);
    	};

    	const importFile = async () => {
    		let response = await fetch(fileinput.name);
    		let data = await response.json();
    		const obj = JSON.parse(JSON.stringify(data));
    		themeId.set(obj.themeId);

    		newTheme.set({
    			block: obj.newTheme.block,
    			fontSize: obj.newTheme.fontSize,
    			fontFamily: obj.newTheme.fontFamily,
    			fontColor: obj.newTheme.fontColor,
    			mainColor: obj.newTheme.mainColor
    		});

    		topMenu.set(obj.topMenu);

    		topMenuSettings.set({
    			fontSize: obj.topMenuSettings.fontSize,
    			fontFamily: obj.topMenuSettings.fontFamily,
    			fontColor: obj.topMenuSettings.fontColor,
    			mainColor: obj.topMenuSettings.mainColor
    		});

    		topMenuOption.set(obj.topMenuOption);
    		sliderTime.set(obj.sliderTime);
    		sliderDescription.set(obj.sliderDescription);
    		Footer.set(obj.Footer);

    		FooterSettings.set({
    			fontSize: obj.FooterSettings.fontSize,
    			fontFamily: obj.FooterSettings.fontFamily,
    			fontFamily: obj.FooterSettings.fontFamily,
    			mainColor: obj.FooterSettings.mainColor
    		});
    	};

    	const exportFile = () => {
    		const jsonData = {
    			themeId: $themeId,
    			newTheme: $newTheme,
    			topMenu: $topMenu,
    			topMenuSettings: $topMenuSettings,
    			topMenuOption: $topMenuOption,
    			sliderTime: $sliderTime,
    			sliderDescription: $sliderDescription,
    			Footer: $Footer,
    			FooterSettings: $FooterSettings
    		};

    		let dataStr = JSON.stringify(jsonData);
    		let dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    		let exportFileDefaultName = "data.json";
    		let linkElement = document.createElement("a");
    		linkElement.setAttribute("href", dataUri);
    		linkElement.setAttribute("download", exportFileDefaultName);
    		linkElement.click();
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ImportExport> was created with unknown prop '${key}'`);
    	});

    	const change_handler = e => onFileSelected(e);

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			fileinput = $$value;
    			$$invalidate(0, fileinput);
    		});
    	}

    	const click_handler = () => importFile();
    	const click_handler_1 = () => exportFile();

    	$$self.$capture_state = () => ({
    		Navigation,
    		themeId,
    		newTheme,
    		topMenu,
    		topMenuSettings,
    		topMenuOption,
    		sliderTime,
    		sliderDescription,
    		Footer,
    		FooterSettings,
    		fileinput,
    		onFileSelected,
    		importFile,
    		exportFile,
    		$FooterSettings,
    		$Footer,
    		$sliderDescription,
    		$sliderTime,
    		$topMenuOption,
    		$topMenuSettings,
    		$topMenu,
    		$newTheme,
    		$themeId
    	});

    	$$self.$inject_state = $$props => {
    		if ('fileinput' in $$props) $$invalidate(0, fileinput = $$props.fileinput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		fileinput,
    		onFileSelected,
    		importFile,
    		exportFile,
    		change_handler,
    		input_binding,
    		click_handler,
    		click_handler_1
    	];
    }

    class ImportExport extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ImportExport",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.47.0 */
    const file = "src\\App.svelte";

    // (19:4) <Route path="/">
    function create_default_slot_12(ctx) {
    	let home;
    	let current;
    	home = new Home({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(home.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(home, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(home.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(home.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(home, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(19:4) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Route path="/second">
    function create_default_slot_11(ctx) {
    	let second;
    	let current;
    	second = new Second({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(second.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(second, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(second.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(second.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(second, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(22:4) <Route path=\\\"/second\\\">",
    		ctx
    	});

    	return block;
    }

    // (25:4) <Route path="/articles">
    function create_default_slot_10(ctx) {
    	let articles;
    	let current;
    	articles = new Articles({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(articles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(articles, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(articles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(articles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(articles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(25:4) <Route path=\\\"/articles\\\">",
    		ctx
    	});

    	return block;
    }

    // (28:4) <Route path="/newTheme">
    function create_default_slot_9(ctx) {
    	let newtheme;
    	let current;
    	newtheme = new Newtheme({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(newtheme.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(newtheme, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(newtheme.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(newtheme.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(newtheme, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(28:4) <Route path=\\\"/newTheme\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:4) <Route path="/theme">
    function create_default_slot_8(ctx) {
    	let theme;
    	let current;
    	theme = new Theme({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(theme.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(theme, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(theme.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(theme.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(theme, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(31:4) <Route path=\\\"/theme\\\">",
    		ctx
    	});

    	return block;
    }

    // (34:4) <Route path="/menuSettings">
    function create_default_slot_7(ctx) {
    	let menusettings;
    	let current;
    	menusettings = new Menusettings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(menusettings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(menusettings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menusettings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menusettings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(menusettings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(34:4) <Route path=\\\"/menuSettings\\\">",
    		ctx
    	});

    	return block;
    }

    // (37:4) <Route path="/sliderSettings">
    function create_default_slot_6(ctx) {
    	let slidersettings;
    	let current;
    	slidersettings = new Slidersettings({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(slidersettings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(slidersettings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(slidersettings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(slidersettings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(slidersettings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(37:4) <Route path=\\\"/sliderSettings\\\">",
    		ctx
    	});

    	return block;
    }

    // (40:4) <Route path="/gallery">
    function create_default_slot_5(ctx) {
    	let gallery;
    	let current;
    	gallery = new Gallery({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(gallery.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(gallery, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(gallery.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(gallery.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(gallery, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(40:4) <Route path=\\\"/gallery\\\">",
    		ctx
    	});

    	return block;
    }

    // (43:4) <Route path="/footerSettings">
    function create_default_slot_4(ctx) {
    	let footersettings;
    	let current;
    	footersettings = new Footersettins({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(footersettings.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(footersettings, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(footersettings.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(footersettings.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(footersettings, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(43:4) <Route path=\\\"/footerSettings\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:4) <Route path="/editArticles/:id">
    function create_default_slot_3(ctx) {
    	let editarticles;
    	let current;
    	editarticles = new EditArticles({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(editarticles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(editarticles, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(editarticles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(editarticles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(editarticles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(46:4) <Route path=\\\"/editArticles/:id\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:4) <Route path="/addArticles">
    function create_default_slot_2(ctx) {
    	let addarticles;
    	let current;
    	addarticles = new AddArticles({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(addarticles.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addarticles, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addarticles.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addarticles.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addarticles, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(49:4) <Route path=\\\"/addArticles\\\">",
    		ctx
    	});

    	return block;
    }

    // (52:4) <Route path="/importExport">
    function create_default_slot_1(ctx) {
    	let importexport;
    	let current;
    	importexport = new ImportExport({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(importexport.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(importexport, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(importexport.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(importexport.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(importexport, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(52:4) <Route path=\\\"/importExport\\\">",
    		ctx
    	});

    	return block;
    }

    // (18:2) <Router>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let route1;
    	let t1;
    	let route2;
    	let t2;
    	let route3;
    	let t3;
    	let route4;
    	let t4;
    	let route5;
    	let t5;
    	let route6;
    	let t6;
    	let route7;
    	let t7;
    	let route8;
    	let t8;
    	let route9;
    	let t9;
    	let route10;
    	let t10;
    	let route11;
    	let current;

    	route0 = new Route$1({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route$1({
    			props: {
    				path: "/second",
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route$1({
    			props: {
    				path: "/articles",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route$1({
    			props: {
    				path: "/newTheme",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route$1({
    			props: {
    				path: "/theme",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route$1({
    			props: {
    				path: "/menuSettings",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route$1({
    			props: {
    				path: "/sliderSettings",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route7 = new Route$1({
    			props: {
    				path: "/gallery",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route8 = new Route$1({
    			props: {
    				path: "/footerSettings",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route9 = new Route$1({
    			props: {
    				path: "/editArticles/:id",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route10 = new Route$1({
    			props: {
    				path: "/addArticles",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route11 = new Route$1({
    			props: {
    				path: "/importExport",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(route1.$$.fragment);
    			t1 = space();
    			create_component(route2.$$.fragment);
    			t2 = space();
    			create_component(route3.$$.fragment);
    			t3 = space();
    			create_component(route4.$$.fragment);
    			t4 = space();
    			create_component(route5.$$.fragment);
    			t5 = space();
    			create_component(route6.$$.fragment);
    			t6 = space();
    			create_component(route7.$$.fragment);
    			t7 = space();
    			create_component(route8.$$.fragment);
    			t8 = space();
    			create_component(route9.$$.fragment);
    			t9 = space();
    			create_component(route10.$$.fragment);
    			t10 = space();
    			create_component(route11.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(route1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route2, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(route3, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(route4, target, anchor);
    			insert_dev(target, t4, anchor);
    			mount_component(route5, target, anchor);
    			insert_dev(target, t5, anchor);
    			mount_component(route6, target, anchor);
    			insert_dev(target, t6, anchor);
    			mount_component(route7, target, anchor);
    			insert_dev(target, t7, anchor);
    			mount_component(route8, target, anchor);
    			insert_dev(target, t8, anchor);
    			mount_component(route9, target, anchor);
    			insert_dev(target, t9, anchor);
    			mount_component(route10, target, anchor);
    			insert_dev(target, t10, anchor);
    			mount_component(route11, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    			const route7_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route7_changes.$$scope = { dirty, ctx };
    			}

    			route7.$set(route7_changes);
    			const route8_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route8_changes.$$scope = { dirty, ctx };
    			}

    			route8.$set(route8_changes);
    			const route9_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route9_changes.$$scope = { dirty, ctx };
    			}

    			route9.$set(route9_changes);
    			const route10_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route10_changes.$$scope = { dirty, ctx };
    			}

    			route10.$set(route10_changes);
    			const route11_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				route11_changes.$$scope = { dirty, ctx };
    			}

    			route11.$set(route11_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			transition_in(route7.$$.fragment, local);
    			transition_in(route8.$$.fragment, local);
    			transition_in(route9.$$.fragment, local);
    			transition_in(route10.$$.fragment, local);
    			transition_in(route11.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			transition_out(route7.$$.fragment, local);
    			transition_out(route8.$$.fragment, local);
    			transition_out(route9.$$.fragment, local);
    			transition_out(route10.$$.fragment, local);
    			transition_out(route11.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(route1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route2, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(route3, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(route4, detaching);
    			if (detaching) detach_dev(t4);
    			destroy_component(route5, detaching);
    			if (detaching) detach_dev(t5);
    			destroy_component(route6, detaching);
    			if (detaching) detach_dev(t6);
    			destroy_component(route7, detaching);
    			if (detaching) detach_dev(t7);
    			destroy_component(route8, detaching);
    			if (detaching) detach_dev(t8);
    			destroy_component(route9, detaching);
    			if (detaching) detach_dev(t9);
    			destroy_component(route10, detaching);
    			if (detaching) detach_dev(t10);
    			destroy_component(route11, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(18:2) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div;
    	let router;
    	let current;

    	router = new Router$1({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(router.$$.fragment);
    			add_location(div, file, 16, 0, 723);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(router, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(router);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Router: Router$1,
    		Route: Route$1,
    		Link: Link$1,
    		Home,
    		Theme,
    		Newtheme,
    		Menusettings,
    		Second,
    		Articles,
    		Slidersettings,
    		Gallery,
    		Footersettings: Footersettins,
    		EditArticles,
    		AddArticles,
    		ImportExport
    	});

    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'world'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
