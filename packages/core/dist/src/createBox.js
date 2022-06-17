"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const ReactBulk_1 = require("./ReactBulk");
const createStyle_1 = __importDefault(require("./createStyle"));
const bindings_1 = __importDefault(require("./props/bindings"));
const get_1 = __importDefault(require("./props/get"));
const clsx_1 = __importDefault(require("./utils/clsx"));
function createBox(_a, ref, map, defaultComponent) {
    var { component, className, flexbox, direction, wrap, flow, justifyContent, alignContent, justifyItems, alignItems, center, gap, flex, order, grow, shrink, basis, align, justify, style, children } = _a, props = __rest(_a, ["component", "className", "flexbox", "direction", "wrap", "flow", "justifyContent", "alignContent", "justifyItems", "alignItems", "center", "gap", "flex", "order", "grow", "shrink", "basis", "align", "justify", "style", "children"]);
    if (defaultComponent === void 0) { defaultComponent = null; }
    const theme = (0, ReactBulk_1.useTheme)();
    const { web, native, dimensions } = map;
    style = [
        // Flex Container
        flexbox && {
            display: `${typeof flexbox === 'boolean' ? 'flex' : flexbox}`,
            flexDirection: 'row',
        },
        direction && { flexDirection: direction },
        wrap && { flexWrap: typeof wrap === 'boolean' ? (wrap ? 'wrap' : 'nowrap') : wrap },
        flow && { flexFlow: flow },
        justifyContent && { justifyContent },
        justifyItems && { alignItems },
        alignContent && { alignContent },
        alignItems && { alignItems },
        center && {
            justifyContent: 'center',
            justifyItems: 'center',
            alignContent: 'center',
            alignItems: 'center',
        },
        web && gap && { gap: theme.spacing(Number(gap)) },
        // Flex Item
        flex && { flex: 1 },
        order && { order },
        grow && { grow },
        shrink && { shrink },
        basis && { basis },
        align && { alignSelf: align },
        justify && { justifySelf: justify },
        style,
    ];
    // Apply responsive styles
    for (const breakpoint of Object.entries(theme.breakpoints)) {
        const [name, minWidth] = breakpoint;
        const ptStyle = (0, get_1.default)(name, style);
        if (ptStyle && dimensions.width >= minWidth) {
            style.push(ptStyle);
        }
    }
    const processed = (0, createStyle_1.default)({ style: style });
    if (processed) {
        // Web: CSS Class Name
        if (typeof processed === 'string') {
            className = (0, clsx_1.default)(processed, className);
        }
        // Native: Style Object
        if (typeof processed === 'object') {
            props.style = processed;
        }
    }
    if (className) {
        props.className = (0, clsx_1.default)(className);
    }
    props = (0, bindings_1.default)(props);
    const Component = component || defaultComponent;
    // TODO: recursive children
    // Gap simulation
    if (native && gap && Array.isArray(children) && (children === null || children === void 0 ? void 0 : children.length)) {
        return ((0, jsx_runtime_1.jsx)(Component, Object.assign({}, props, { ref: ref }, { children: children.map((child, key) => ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [key > 0 &&
                        createBox({ style: { width: theme.spacing(Number(gap)), height: theme.spacing(Number(gap)) } }, null, map, defaultComponent), child] }, key))) })));
    }
    return ((0, jsx_runtime_1.jsx)(Component, Object.assign({}, props, { ref: ref }, { children: children })));
}
exports.default = createBox;
