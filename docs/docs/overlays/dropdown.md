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

## Styles

### **`style`**
To the main element.

## Events

### **`onClose`**

➤ Type: **`Function(Event)`** <br/>

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
