---
sidebar_position: 6
---

# Input Date

Used to display input with calendar (date picker).

## Import

```jsx
import { InputDate } from '@react-bulk/web'; // OR @react-bulk/native
```

## Examples

### Basic

```jsx live
<InputDate value={new Date()} />
```

### Variants

#### Modal

```jsx live
<InputDate variant="modal" />
```

#### Dropdown

```jsx live
<InputDate variant="dropdown" />
```

#### Inline

```jsx live
<InputDate variant="inline" />
```

### Min / Max

```jsx live
<InputDate
  variant="inline"
  min="2024-01-01"
  max="2024-12-31"
/>
```

### Format

#### Default ISO

```jsx live
<InputDate value={Date.now()} />
```

#### Locale

```jsx live
<InputDate locale="en-US" value={Date.now()} />
```

### Translation

```jsx live
<InputDate
  variant="inline"
  translate={{
    cancel: 'Cancelar',
    clear: 'Limpar',
    today: 'Hoje'
  }}
/>
```

## Styles

### **`style`**
To the outer wrapper.

### **`contentStyle`**
To the inner wrapper.

### **`errorStyle`**
To the error element when has [`error`](#error) prop.

### **`inputStyle`**
To the input element.

### **`labelStyle`**
To the label element.

➤ Type: **[`RbkStyle`](/docs/type-reference/rbk-style)** <br/>

## Props

Extends all [`Input`](/docs/forms/input#props) props.

### **`locale`**

➤ Type: **`string`** <br/>

---

### **`max`**

➤ Type: **`Date` `string`** <br/>

---

### **`min`**

➤ Type: **`Date` `string`** <br/>

---

### **`value`**

➤ Type: **`Date` `string`** <br/>

---

### **`variant`**

➤ Type: **`'modal'` `'dropdown'` `'inline'`** <br/>

---

### **`translate`**

➤ Type: **`object`** <br/>

```js
{
  cancel: string
  clear: string
  today: string
}
```

## Events

### **`onChange`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onSubmit`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onFocus`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onBlur`**

➤ Type: **`Function`([`RbkInputEvent`](/docs/type-reference/rbk-input-event))** <br/>

---

### **`onFormChange`**

Combined with [Form](/docs/forms/form), triggers every time when form data changes.
Eg.: [Input](/docs/forms/input), [Select](/docs/forms/select), [Checkbox](/docs/forms/checkbox).

➤ Type: **`Function`([`RbkFormEvent`](/docs/type-reference/rbk-form-event))** <br/>

## Theming

See [`Theme`](/docs/layout/theme#props).

```jsx
const theme = {
  components: {
    InputDate: {
      defaultProps: {
        /* ...props */
      },
      defaultStyles: {
        root: { /* ...styles */ },
      }
    }
  }
}
```
