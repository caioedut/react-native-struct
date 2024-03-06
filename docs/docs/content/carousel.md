# Carousel

Used to show cycling slides like a carousel.


## Import

```jsx
import { Carousel } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Carousel xs={1} sm={1} md={2} lg={2} xl={3} gap={4}>
  {Array.from({ length: 4 }).map((i, index) => (
    <Card key={index} bg="background.secondary">
      <Text bold>
        Slide Item {index + 1}
      </Text>
      <Box aspectRatio="16/9" overflow="hidden" corners={2} my={3}>
        <Image w="100%" h="100%" source="https://i.imgur.com/HdIl3Ef.png" />
      </Box>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Text>
    </Card>
  ))}
</Carousel>
```

### Custom Nav

```jsx live
<Carousel
  xs={1} sm={1} md={2} lg={2} xl={3} gap={4}
  chevron={({ prev, onPress }) => (
    <Box h="100%" onPress={onPress} center p={2} bg="primary.main.25">
      <Text variant="caption">{prev ? 'Prev' : 'Next'}</Text>
    </Box>
  )}
>
  {Array.from({ length: 4 }).map((i, index) => (
    <Card key={index} bg="background.secondary">
      <Text bold>
        Slide Item {index + 1}
      </Text>
      <Box aspectRatio="16/9" overflow="hidden" corners={2} my={3}>
        <Image w="100%" h="100%" source="https://i.imgur.com/HdIl3Ef.png" />
      </Box>
      <Text>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit.
      </Text>
    </Card>
  ))}
</Carousel>
```

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`chevron`**

- `true` (default): display default nav buttons.
- `false`: don't display nav buttons.
- `function`: display returned custom nav buttons.


➤ Type: **`boolean` | `(options: object) => ReactElement`** <br/>

```js title="options"
{
  prev: boolean
  next: boolean
  color: RbkColor
  onPress: Function
}
```

---

### **`color`**

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`primary`**

---

### **`gap`**

Spacing (horizontal and vertical) between children. The set value will be multiplied by the `theme.typography.spacing` value.

➤ Type: **`number`** <br/>

---

### **`pagingEnabled`**

➤ Type: **`boolean`** <br/>

---

### **`pointerScroll`**

Enable/disable pointer scroll event (eg.: mouse wheel).

➤ Type: **`boolean`** <br/>
➤ Default: **`true`** <br/>

## Breakpoints

When `numeric`, defines the number of items to be shown on respective breakpoint.

When `'auto'`, does not calculate the size of items.

When `RbkStyle`, applies the style **ONLY** on respective breakpoint.

---

### **`xs`**

➤ Type: **`number` `'auto'` [`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---

### **`sm`**

➤ Type: **`number` `'auto'` [`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---

### **`md`**

➤ Type: **`number` `'auto'` [`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---

### **`lg`**

➤ Type: **`number` `'auto'` [`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---

### **`xl`**

➤ Type: **`number` `'auto'` [`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---

## Styles

### **`style`**
To the main element.

### **`itemStyle`**
To each child element.

### **`chevronStyle`**
To the chevrons.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

---
