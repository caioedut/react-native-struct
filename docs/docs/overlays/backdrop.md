# Backdrop

Backdrop is a box the size of the viewport which is rendered immediately beneath any element being presented in fullscreen mode.

## Import

```jsx
import { Backdrop } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>
        Show Backdrop
      </Button>
      <Backdrop visible={visible} onPress={() => setVisible(false)}>
        <Card>
          <Text center>
            Children do not fire "Backdrop.onPress".
          </Text>
          <Text center>
            Click on backdrop to close.
          </Text>
        </Card>
      </Backdrop>
    </>
  );
}
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`visible`**

➤ Type: **`boolean`** <br/>

---

### **`keepMounted`**

`true`: the content remains mounted (rendered) even when it is not visible. This can be useful in situations where you want to preserve the internal state of the content, such as form values or other component states, while it is hidden.

`false`: the content is unmounted when it is not visible. This means that the elements are removed, which can help improve performance, especially in applications with heavy components.

:::note
A dynamic portal is created and rendered at the root of the `ReactBulk` provider when the value is `true`. Be mindful of organizing your React Contexts.
:::

➤ Type: **`boolean`** <br/>
➤ Default: **`false`** <br/>

## Styles

### **`style`**
To the main element.

## Events

### **`onPress`**

When the backdrop is pressed directly. Children do not fire it.

➤ Type: **[`Function(RbkPointerEvent)`](/docs/type-reference/rbk-pointer-event)** <br/>

---
