import { TextProps } from '../types';
import Platform from './Platform';
import { useTheme } from './ReactBulk';

export default function createText(
  { size, bold, italic, oblique, smallCaps, invisible, transform, numberOfLines, style, ...rest }: TextProps | any,
  ref: any,
  map: any,
) {
  const theme = useTheme();

  const { web, native } = Platform;
  const { Box, Text } = map;

  const styleX = [
    {
      color: theme.colors.text.primary,
      fontSize: theme.rem(1),
    },

    size && { fontSize: size },
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

  const props: any = {};
  if (native && numberOfLines) {
    props.numberOfLines = numberOfLines;
  }

  return <Box ref={ref} component={Text} {...rest} style={styleX} {...props} />;
}
