# useAnimation

Used to programatically animate an item.

## Import

```jsx
import { useAnimation } from '@react-bulk/core'; // OR @react-bulk/native
```

## Usage

```jsx live
function App() {
  const sizeAnim = useAnimation({ width: 10, height: 10 });

  const from = { width: 40, height: 40 };
  const to = { width: 200, height: 200 };

  return (
    <Grid gap>
      <Box>
        <Button onPress={() => sizeAnim.start(to)}>Forward</Button>
      </Box>
      <Box>
        <Button onPress={() => sizeAnim.start(from)}>Backward</Button>
      </Box>
      <Box>
        <Button onPress={() => sizeAnim.start(to, { iterations: 3 })}>Repeat 3x</Button>
      </Box>
      <Box>
        <Button onPress={() => sizeAnim.start(to, { boomerang: true })}>Boomerang</Button>
      </Box>
      <Box>
        <Button onPress={() => sizeAnim.start(to, { boomerang: true, iterations: 3 })}>3x Boomerang</Button>
      </Box>
      <Box>
        <Button onPress={() => sizeAnim.start(to, { boomerang: true, iterations: 'infinite' })}>Infinite</Button>
      </Box>
      <Box>
        <Button color="warning" onPress={() => sizeAnim.stop()}>
          Stop
        </Button>
      </Box>
      <Box>
        <Button color="error" onPress={() => sizeAnim.reset()}>
          Reset
        </Button>
      </Box>
      <Box xs={12}>
        <Box border="1px solid primary" align="start">
          <sizeAnim.Component style={sizeAnim.style} />
        </Box>
      </Box>
    </Grid>
  );
}
```

## Options

**`boomerang`**

For web only. <br/>

➤ Type: **`boolean`** <br/>

---

**`delay`**

Delay in milliseconds to start the animation.

➤ Type: **`number`** <br/>

---

**`duration`**

Animation duration in milliseconds.

➤ Type: **`number`** <br/>

---

**`timing`**

➤ Type: **`'ease'` `'linear'` `'ease-in'` `'ease-out'` `'ease-in-out'`** <br/>

---

**`iterations`**

➤ Type: **`number` `'infinite'`** <br/>

---
