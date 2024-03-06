---
sidebar_position: 2
---

# Text

Used to display texts and customize them according to the theme.

## Import

```jsx
import { Text } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<Box center>
  <Text bold>Hello World!</Text>
  <Text color="primary">Primary Color</Text>
  <Text color="secondary">Secondary Color</Text>
  <Text color="text.primary">Primary Text Color</Text>
  <Text color="text.secondary">Secondary Text Color</Text>
  <Text color="#ff0000">Hex Color</Text>
</Box>
```

### Variants

```jsx live
<Box center>
  <Text variant="h1">H1</Text>
  <Text variant="h2">H2</Text>
  <Text variant="h3">H3</Text>
  <Text variant="h4">H4</Text>
  <Text variant="h5">H5</Text>
  <Text variant="h6">H6</Text>
  <Text variant="title">Title</Text>
  <Text variant="subtitle">Subtitle</Text>
  <Text variant="primary">Primary</Text>
  <Text variant="secondary">Secondary</Text>
  <Text variant="caption">Caption</Text>
</Box>
```

### Sizes

The set value will be multiplied by the `theme.typography.fontSize` value.

```jsx live
<Box center>
  <Text size={1}>Default Size</Text>
  <Text size={2}>Double</Text>
  <Text size={1.5}>One and a half</Text>
</Box>
```

## Styles

### **`style`**
To the text element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Props

Extends all [`Box`](/docs/core/box#props) props.

### **`bold`**

Sets `fontWeight` style to `bold`.

➤ Type: **`boolean`** <br/>

---

### **`color`**

Sets `color` style.

➤ Type: **`string` [`RbkColor`](/docs/type-reference/rbk-color)** <br/>
➤ Default: **`'primary'`** <br/>

---

### **`center`**

Sets `textAlign` style to `center`.

➤ Type: **`boolean`** <br/>

---

### **`italic`**

Sets `fontStyle` style to `italic`.

➤ Type: **`boolean`** <br/>

---

### **`justify`**

Sets `textAlign` style to `justify`.

➤ Type: **`boolean`** <br/>

---

### **`left`**

Sets `textAlign` style to `left`.

➤ Type: **`boolean`** <br/>

---

### **`numberOfLines`**

Sets the maximun lines of text.

➤ Type: **`number`** <br/>

---

### **`right`**

Sets `textAlign` style to `right`.

➤ Type: **`boolean`** <br/>

---

### **`selectable`**

Lets the user select text.

By default, the web allows selection and native does not.

➤ Type: **`boolean`** <br/>

---

### **`smallCaps`**

Sets `fontVariant` style to `small-caps`.

➤ Type: **`boolean`** <br/>

---

### **`size`**

Sets `fontSize` style. The set value will be multiplied by the `theme.typography.fontSize` value.

➤ Type: **`number`** <br/>

---

### **`transform`**

Sets `textTransform` style.

➤ Type: **`'none'` `'captalize'` `'uppercase'` `'lowercase'` `'full-width'`** <br/>

---

### **`variant`**

➤ Type: **`'h1'` `'h2'` `'h3'` `'h4'` `'h5'` `'h6'` `'title'` `'subtitle'` `'primary'` `'secondary'` `'caption'`** <br/>

---

### **`weight`**

Sets `fontWeight` style.

➤ Type: **`'normal'` `'bold'` `'100'` `'200'` `'300'` `'400'` `'500'` `'600'` `'700'` `'800'` `'900'`** <br/>
