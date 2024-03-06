import createStyle from './createStyle';
import extract from './props/extract';
import base from './themes/base';
import dark from './themes/dark';
import light from './themes/light';
import { ThemeEditProps, ThemeProps } from './types';
import deepmerge from './utils/deepmerge';
import global from './utils/global';

export default function createTheme(options?: ThemeEditProps, extendsTo?: ThemeEditProps): ThemeProps | any {
  options = options || {};
  extendsTo = extendsTo || {};

  const mode = options?.mode || extendsTo?.mode || 'light';
  const reference = mode === 'dark' ? dark : light;

  // @ts-ignore
  const newTheme: ThemeProps = deepmerge(base, extendsTo, reference, options, { mode });

  // Parse colors
  if (newTheme.colors) {
    for (const prop in newTheme.colors) {
      const color = newTheme.colors[prop];

      if (typeof color === 'string') {
        newTheme.colors[prop] = { main: color };
      }

      const main = newTheme.colors?.[prop]?.main;

      if (!main) {
        continue;
      }

      const light = newTheme.colors?.[prop]?.light;
      const lighter = newTheme.colors?.[prop]?.lighter;
      const dark = newTheme.colors?.[prop]?.dark;
      const darker = newTheme.colors?.[prop]?.darker;
      const contrast = newTheme.colors?.[prop]?.contrast;

      if (!light) {
        newTheme.colors[prop].light = newTheme.color(main, null, '50%');
      }

      if (!lighter) {
        newTheme.colors[prop].lighter = newTheme.color(main, null, '100%');
      }

      if (!dark) {
        newTheme.colors[prop].dark = newTheme.color(main, null, '-50%');
      }

      if (!darker) {
        newTheme.colors[prop].darker = newTheme.color(main, null, '-100%');
      }

      if (!contrast) {
        newTheme.colors[prop].contrast = newTheme.contrast(main);
      }
    }
  }

  const components = { ...newTheme.components };

  const ordered = extract(
    ['Box', 'Text', 'Outline', 'Label', 'Backdrop', 'Scrollable', 'Card', 'Dropdown', 'Button', 'ButtonGroup'],
    components,
  );

  const list = [...Object.values(ordered), ...Object.values(components)];

  list.forEach((component: any) => {
    const componentName = component?.name;
    const styles = component?.defaultStyles || {};

    if (!componentName) return;

    for (const prop in styles) {
      const style = styles?.[prop];
      const name = componentName + (prop === 'root' ? '' : `-${prop}`);
      global.styles[name] = createStyle({ name, style, theme: newTheme });
    }

    // Generate variant styles
    Object.entries(component?.variants || {}).forEach(([varAttr, varOptions]: any) => {
      Object.entries(varOptions).map(([optionKey, optionVal]: any) => {
        Object.entries(optionVal || {}).forEach(([styleId, style]: any) => {
          const name = `${componentName}-${varAttr}-${optionKey}` + (styleId === 'root' ? '' : `-${styleId}`);
          global.styles[name] = createStyle({ name, style, theme: newTheme });
        });
      });
    });
  });

  global.theme = newTheme;

  return newTheme;
}
