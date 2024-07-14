# Modal

A modal is a dialog box/popup window that is displayed on top of the current page.

`Modal` just wraps a [`Card`](/docs/contents/card) in a [`Backdrop`](/docs/overlays/backdrop).

## Import

```jsx
import { Modal } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>
        Open Modal
      </Button>
      <Modal visible={visible}>
        <Text>Modal is amazing!</Text>

        <Button mt={3} onPress={() => setVisible(false)}>
          Close
        </Button>
      </Modal>
    </>
  );
}
```

### Composition

```jsx live
function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>
        Open Modal
      </Button>
      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Text variant="title" bold>
          React Bulk
        </Text>
        <Divider my={3} mx={-3}/>
        <Text>
          Complete and uniform UI for React Web and Native
        </Text>
        <Divider my={3} mx={-3}/>
        <Button onPress={() => setVisible(false)}>
          Close
        </Button>
      </Modal>
    </>
  );
}
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`halign`**

Horizontal alignment.

➤ Type: **`'center'` `'left'` `'right'`** <br/>
➤ Default: **`'center'`** <br/>

---

### **`valign`**

Vertical alignment.

➤ Type: **`'center'` `'top'` `'bottom'`** <br/>
➤ Default: **`'center'`** <br/>

---

### **`visible`**

➤ Type: **`boolean`** <br/>

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
    Modal: {
      defaultStyles: {
        root: { /* ...styles */ },
        backdrop: { /* ...styles */ },
      }
    }
  }
}
```
