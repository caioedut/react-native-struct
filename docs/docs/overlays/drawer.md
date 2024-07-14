# Drawer

Used do display a floating side menu on top of the current page.

## Import

```jsx
import { Drawer } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
function Home() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button onPress={() => setVisible(true)}>
        Open Drawer
      </Button>
      <Drawer visible={visible} maxw={320}>
        <Card>
          <Text variant="title" bold>Drawer is amazing!</Text>

          <Divider my={3} />

          <Button onPress={() => setVisible(false)}>
            Close
          </Button>
        </Card>
      </Drawer>
    </>
  );
}
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`placement`**

➤ Type: **`'right'` `'left'` `'top'` `'bottom'`** <br/>
➤ Default: **`'right'`** <br/>

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

### **`backdropStyle`**
To the backdrop element.

---

## Events

### **`onClose`**

➤ Type: **[`Function(RbkPointerEvent)`](/docs/type-reference/rbk-pointer-event)** <br/>

---
