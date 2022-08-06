// @ts-nocheck
import Platform from '../Platform';

export default function ({ ...props }: any) {
  const { web, native } = Platform;

  if (web) {
    if (props.onPress) {
      props.onClick = props.onPress;
    }

    if (props.onPressIn) {
      props.onMouseDown = props.onPressIn;
    }

    if (props.onPressOut) {
      props.onMouseUp = props.onPressOut;
    }

    // if (props.onChange) {
    //   const onChangeProp = props.onChange;
    //   props.onChange = (e: any) => onChangeProp(e, e?.target?.value ?? e?.target?.checked);
    // }

    delete props.onPress;
    delete props.onPressIn;
    delete props.onPressOut;
  }

  if (native) {
    if (props.onClick) {
      props.onPress = props.onClick;
    }

    // if (props.onChange) {
    //   const onChangeProp = props.onChange;
    //   props.onChange = (e: any) => onChangeProp(e, e?.nativeEvent?.text);
    // }

    delete props.onClick;
  }

  if (props.disabled) {
    delete props.onClick;
    delete props.onPress;
  }

  return props;
}
