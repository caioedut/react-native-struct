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
const Platform_1 = __importDefault(require("./Platform"));
const ReactBulk_1 = require("./ReactBulk");
function createText(_a, ref, map) {
    var { size, color, center, bold, italic, oblique, smallCaps, invisible, transform, numberOfLines, style } = _a, rest = __rest(_a, ["size", "color", "center", "bold", "italic", "oblique", "smallCaps", "invisible", "transform", "numberOfLines", "style"]);
    const theme = (0, ReactBulk_1.useTheme)();
    const { web, native } = Platform_1.default;
    const { Box, Text } = map;
    const styleX = [
        {
            color: color !== null && color !== void 0 ? color : theme.colors.text.primary,
            fontSize: theme.rem(1),
        },
        size && { fontSize: theme.rem(size) },
        center && { textAlign: 'center' },
        bold && { fontWeight: 'bold' },
        italic && { fontStyle: 'italic' },
        oblique && { fontStyle: 'oblique' },
        smallCaps && { fontVariant: 'small-caps' },
        invisible && { opacity: 0 },
        transform && { textTransform: transform },
        numberOfLines > 0 && {
            web: {
                display: '-webkit-box',
                '-webkit-line-clamp': `${numberOfLines}`,
                '-webkit-box-orient': 'vertical',
                overflow: 'hidden',
            },
        },
        web && { display: 'inline-block' },
        style,
    ];
    const props = {};
    if (native && numberOfLines) {
        props.numberOfLines = numberOfLines;
    }
    return (0, jsx_runtime_1.jsx)(Box, Object.assign({ ref: ref, component: Text }, rest, { style: styleX }, props));
}
exports.default = createText;
