# Dropdown

Used to display floating additional content or actions related to another element on the screen.

## Import

```jsx
import { Dropdown } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>
        Open Dropdown
      </Button>
      <Dropdown visible={visible} w={400} onClose={() => setVisible(false)}>
        <Card>
          <Text>Dropdown is amazing!</Text>
        </Card>
      </Dropdown>
    </>
  );
}
```

### Position

You can use styles `top`, `bottom`, `left` and `right` as you want.

```jsx live
function Home() {
  const triggerRef = useRef();
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button ref={triggerRef} onPress={() => setVisible(true)}>
        Open to Right
      </Button>
      <Dropdown visible={visible} triggerRef={triggerRef} t={0} b="auto" l="100%" onClose={() => setVisible(false)}>
        <Card>
          <Text>Dropdown is amazing!</Text>
        </Card>
      </Dropdown>
    </>
  );
}
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`placement`**

➤ Type: **`'top'` `'bottom'`** <br/>
➤ Default: **`'bottom'`** <br/>

---

### **`visible`**

➤ Type: **`boolean`** <br/>

---

### **`triggerRef`**

Used to accurately calculate the `Dropdown` position.

➤ Type: **`RefObject<ReactNode>`** <br/>

---

### **`keepMounted`**

`true`: the content remains mounted (rendered) even when it is not visible. This can be useful in situations where you want to preserve the internal state of the content, such as form values or other component states, while it is hidden.

`false`: the content is unmounted when it is not visible. This means that the elements are removed, which can help improve performance, especially in applications with heavy components.

:::note
A dynamic portal is created and rendered at the root of the `ReactBulk` provider when the value is `true`. Be mindful of organizing your React Contexts.
:::

## Styles

### **`style`**
To the main element.

## Events

### **`onClose`**

➤ Type: **[`Function(RbkPointerEvent)`](/docs/type-reference/rbk-pointer-event)** <br/>

## Theming

See [`Theme`](/docs/layout/theme#props).

```jsx
const theme = {
  components: {
    Dropdown: {
      defaultProps: {
        /* ...props */
      },
      defaultStyles: {
        root: { /* ...styles */ },
        backdrop: { /* ...styles */ },
      }
    }
  }
}
```
