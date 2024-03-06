import React, { useReducer, useRef, useState } from 'react';

import { AnyObject, FormRef, RbkInputEvent, unstable_useTransition, useAnimation, useToaster } from '@react-bulk/core';
import {
  Animation,
  Avatar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  Calendar,
  Card,
  Carousel,
  Checkbox,
  Collapse,
  Divider,
  Drawer,
  Dropdown,
  Form,
  Grid,
  Image,
  Input,
  InputDate,
  InputPin,
  Label,
  List,
  ListItem,
  Loading,
  Modal,
  Progress,
  Scrollable,
  Select,
  Slider,
  Table,
  Tabs,
  Terminal,
  Text,
  Tooltip,
  useTheme,
} from '@react-bulk/native';

export default function Main() {
  const theme = useTheme();

  return (
    <Scrollable bg="background.secondary" contentInset={theme.shape.gap}>
      <Card>
        <Text variant="title">React Bulk</Text>
        <Text mt={theme.shape.gap}>Open up App.tsx to start working on your app!</Text>
      </Card>

      <Card mt={theme.shape.gap}>
        <ThemeExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <BreakpointExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <GridExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <TypographyExample />
      </Card>

      <ListItemExample />

      <Card mt={theme.shape.gap}>
        <ButtonExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <FormExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <BadgeExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <TableExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <ListExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <ImageExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <AvatarExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <DividerExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <ModalExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <ToasterExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <CollapseExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <DrawerExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <DropdownExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <TabsExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <ProgressExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <CalendarExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <TooltipExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <CarouselExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <TerminalExample />
      </Card>

      <Card mt={theme.shape.gap}>
        <AnimationExample />
      </Card>
    </Scrollable>
  );
}

function ThemeExample() {
  const theme = useTheme();

  const timeoutRef = useRef<any>({});

  function handleChangeTheme(e: RbkInputEvent, value: number) {
    const prop = e.name as string;
    const split = prop.split('.');
    const last = split.pop() as string;

    const data: AnyObject = {};
    let ref = data;

    for (const attr of split) {
      ref[attr] = {};
      ref = ref[attr];
    }

    ref[last] = value;

    if (timeoutRef.current[prop]) {
      clearTimeout(timeoutRef.current[prop]);
    }

    timeoutRef.current[prop] = setTimeout(() => {
      theme.setTheme(data);
    }, 500);
  }

  return (
    <>
      <Text variant="title">Theme</Text>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" my={theme.shape.gap}>
        Mode
      </Text>

      <ButtonGroup>
        <Button variant={theme.mode === 'light' ? 'solid' : 'outline'} onPress={() => theme.setTheme('light')}>
          Light
        </Button>
        <Button variant={theme.mode === 'dark' ? 'solid' : 'outline'} onPress={() => theme.setTheme('dark')}>
          Dark
        </Button>
      </ButtonGroup>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" my={theme.shape.gap}>
        Shape
      </Text>
      <Grid gap>
        <Box xs={6} md={theme.shape.gap}>
          <Input
            type="number"
            min={0}
            max={16}
            name="shape.spacing"
            label="Spacing"
            endAddon="px"
            value={`${theme.shape.spacing}`}
            onChange={handleChangeTheme}
          />
        </Box>
        <Box xs={6} md={theme.shape.gap}>
          <Input
            type="number"
            min={0}
            max={16}
            name="shape.borderRadius"
            label="Border Radius"
            endAddon="px"
            value={`${theme.shape.borderRadius}`}
            onChange={handleChangeTheme}
          />
        </Box>
      </Grid>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" my={theme.shape.gap}>
        Typography
      </Text>
      <Grid gap>
        <Box xs={6} md={theme.shape.gap}>
          <Input
            type="number"
            min={8}
            max={32}
            name="typography.fontSize"
            label="Font Size"
            endAddon="px"
            value={`${theme.typography.fontSize}`}
            onChange={handleChangeTheme}
          />
        </Box>
        <Box xs={6} md={theme.shape.gap}>
          <Input
            type="number"
            min={0}
            max={4.15}
            name="typography.lineHeight"
            label="Line Height"
            endAddon="float"
            value={`${theme.typography.lineHeight}`}
            onChange={handleChangeTheme}
          />
        </Box>
      </Grid>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" my={theme.shape.gap}>
        Colors
      </Text>

      <Grid gap>
        {colors.map((color) => (
          <Box key={color}>
            <Card bg={color}>
              <Text color={theme.contrast(color)}>Color: {color}</Text>
              <Text color={theme.contrast(color)}>Contrast: {theme.contrast(color)}</Text>
            </Card>
          </Box>
        ))}
      </Grid>

      <Grid gap mt={2}>
        {Object.keys(theme.colors)
          .filter((item) => !['common', 'text', 'background'].includes(item))
          .map((color) => (
            <Box key={color} xs={12} sm={4} xxl={2}>
              <Input
                color={color}
                label={getLabel(color)}
                labelStyle={{ color }}
                name="colors.primary.main"
                value={theme.colors[color]?.main ?? theme.colors[color]?.primary}
                onChange={handleChangeTheme}
              />
            </Box>
          ))}
      </Grid>
    </>
  );
}

function BreakpointExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title">Breakpoints</Text>

      <Grid gap mt={theme.shape.gap}>
        {breakpoints.map((bkp, index) => {
          const bg = theme.color('primary', (index + 1) / breakpoints.length);
          const color = theme.contrast(bg);

          // @ts-ignore
          const value = theme.breakpoints[bkp];

          return (
            <Box key={bkp}>
              <Card bg={bg} style={{ display: 'none', [bkp]: { display: 'flex' } }}>
                <Text color={color}>
                  Visible on {bkp.toUpperCase()}+ ({value}px or higher)
                </Text>
              </Card>
            </Box>
          );
        })}
      </Grid>
    </>
  );
}

function GridExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Grid
      </Text>
      <Text variant="subtitle" mb={theme.shape.gap}>
        size={5}
      </Text>
      <Grid size={5}>
        <Box xs={5} md={1}>
          <Text>
            Column 1 xs={5} md={1}
          </Text>
        </Box>
        <Box xs={5} md={3}>
          <Text>
            Column 2 xs={5} md={3}
          </Text>
        </Box>
        <Box xs={5} md="auto">
          <Text>Column 3 xs={5} md=&quot;flex&quot;</Text>
        </Box>
      </Grid>
    </>
  );
}

function TypographyExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title">Typography</Text>

      <Grid alignItems="baseline" gap mt={theme.shape.gap}>
        <Box>
          <Text variant="h1">H1</Text>
        </Box>
        <Box>
          <Text variant="h2">H2</Text>
        </Box>
        <Box>
          <Text variant="h3">H3</Text>
        </Box>
        <Box>
          <Text variant="h4">H4</Text>
        </Box>
        <Box>
          <Text variant="h5">H5</Text>
        </Box>
        <Box>
          <Text variant="h6">H6</Text>
        </Box>
        <Box>
          <Text variant="title">Title</Text>
        </Box>
        <Box>
          <Text variant="subtitle">Subtitle</Text>
        </Box>
        <Box>
          <Text variant="caption">Caption</Text>
        </Box>
        <Box>
          <Text>Text</Text>
        </Box>
      </Grid>
    </>
  );
}

function ListItemExample() {
  const theme = useTheme();

  return (
    <ListItem startAddon="❤" endAddon="⚙" chevron mt={theme.shape.gap}>
      <Box>
        <Text bold>List Item</Text>
        <Text>Lorem ipsum dolor sit amet</Text>
      </Box>
    </ListItem>
  );
}

function ButtonExample() {
  const theme = useTheme();

  const [loading, toggleLoading] = useReducer((state) => !state, true);

  return (
    <>
      <Text variant="title">Buttons</Text>

      {variants.map((variant) => (
        <Box key={variant}>
          <Text variant="subtitle" transform="capitalize" mt={theme.shape.gap}>
            {variant}
          </Text>
          <Grid alignItems="center" gap mt={theme.shape.gap}>
            <Box>
              <Button variant={variant}>Button</Button>
            </Box>
            <Box>
              <Button variant={variant} disabled>
                Disabled
              </Button>
            </Box>
            <Box>
              <Button variant={variant} loading={loading} onPress={toggleLoading}>
                Loading
              </Button>
            </Box>
            <Box>
              <Button variant={variant} circular px={theme.shape.gap}>
                Circular
              </Button>
            </Box>
            <Box>
              <Button variant={variant} startAddon="⚙" circular />
            </Box>
            <Box>
              <Button variant={variant} startAddon="⚙">
                Start Icon
              </Button>
            </Box>
            <Box>
              <Button variant={variant} endAddon="⚙">
                End Icon
              </Button>
            </Box>
            <Box>
              <Button variant={variant} transform="none">
                No Transform
              </Button>
            </Box>
            <Box xs={12} />
            {sizes.map((size) => (
              <Box key={size}>
                <Button variant={variant} size={size}>
                  {getLabel(size)}
                </Button>
              </Box>
            ))}
          </Grid>
          <Divider mx={-theme.shape.gap} my={theme.shape.gap} />
        </Box>
      ))}

      <Text mt={theme.shape.gap} variant="subtitle">
        Group
      </Text>
      <ButtonGroup mt={theme.shape.gap} variant="outline">
        <Button>Button</Button>
        <Button disabled>Disabled</Button>
        <Button loading={loading} onPress={toggleLoading}>
          Loading
        </Button>
        <Button startAddon="⚙" circular />
        <Button startAddon="⚙">Start Icon</Button>
        <Button endAddon="⚙">End Icon</Button>
      </ButtonGroup>
    </>
  );
}

function FormExample() {
  const theme = useTheme();

  const [radio, setRadio] = useState('medium');
  const [checkbox, toggleCheckbox] = useReducer((state) => !state, true);

  function handleSubmitForm(_: FormRef, data: AnyObject) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <>
      <Text variant="title">Forms</Text>

      <Text mt={theme.shape.gap} variant="subtitle">
        Text Field
      </Text>

      <Input mt={theme.shape.gap} label="Default Input" placeholder="This is the default input" />
      <Input mt={theme.shape.gap} label="Secure" placeholder="Secure input" secure />
      <Input mt={theme.shape.gap} label="Read Only" placeholder="Read only input" readOnly />
      <Input mt={theme.shape.gap} label="Disabled" placeholder="Disabled input" disabled />
      <Input mt={theme.shape.gap} label="Invalid" placeholder="Input with error" error="Value is invalid!" />
      <Input mt={theme.shape.gap} label="Icons" placeholder="Input with icons" startAddon="$" endAddon="💳" />

      {sizes.map((size) => (
        <Input
          key={size}
          mt={theme.shape.gap}
          size={size}
          label={getLabel(size)}
          placeholder={`This is a ${size} input`}
        />
      ))}

      <Input mt={theme.shape.gap} label="Multiline" placeholder="Multiline input" multiline />

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text mt={theme.shape.gap} variant="subtitle">
        Input Pin
      </Text>

      <Grid gap mt={theme.shape.gap}>
        <Box xs={12}>
          <Label mb={1}>ALPHANUMERIC</Label>
          <InputPin length={4} />
        </Box>
        <Box xs={12}>
          <Label mb={1}>ALPHABETIC</Label>
          <InputPin length={4} type="alphabetic" />
        </Box>
        <Box xs={12}>
          <Label mb={1}>NUMERIC</Label>
          <InputPin length={4} type="numeric" />
        </Box>
      </Grid>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text mt={theme.shape.gap} variant="subtitle">
        Combobox
      </Text>

      <Select
        mt={theme.shape.gap}
        label="City"
        placeholder="[Select]"
        options={[
          { label: 'Option 1', value: 1 },
          { label: 'Option 2', value: 2 },
          { label: 'Option 3', value: 3 },
        ]}
      />

      <Select
        mt={theme.shape.gap}
        label="Payment"
        placeholder="[Select]"
        startAddon="💳"
        defaultValue="2"
        options={[
          { label: 'Money', value: '1' },
          { label: 'Credit Card', value: '2' },
          { label: 'Free', value: '3' },
        ]}
      />

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" mt={theme.shape.gap}>
        Checkbox / Radio Button
      </Text>

      <Grid alignItems="center" gap>
        {sizes.map((size) => (
          <Box key={size}>
            <Checkbox size={size} label={getLabel(size)} checked={checkbox} onChange={toggleCheckbox} />
          </Box>
        ))}
      </Grid>

      <Grid alignItems="center" gap>
        {sizes.map((size) => (
          <Box key={size}>
            <Checkbox
              key={size}
              size={size}
              label={getLabel(size)}
              unique
              checked={radio === size}
              onChange={() => setRadio(size)}
            />
          </Box>
        ))}
      </Grid>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" mt={theme.shape.gap}>
        Slider
      </Text>
      <Box p={theme.shape.gap}>
        {sizes.map((size) => (
          <Slider key={size} size={size} defaultValue={Math.random() * 100} mt={theme.shape.gap} />
        ))}
      </Box>

      <Divider mt={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" mt={theme.shape.gap}>
        Serializable
      </Text>
      <Form onSubmit={handleSubmitForm} data={formData} mt={theme.shape.gap}>
        <Grid size={6} gap>
          <Box xs={6} md={4}>
            <Input name="firstName" label="First Name" />
          </Box>
          <Box xs={6} md={4}>
            <Input name="lastName" label="Last Name" />
          </Box>
          <Box xs={6} md={4}>
            <Select
              name="size"
              label="Size"
              defaultValue="small"
              options={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
            />
          </Box>
          <Box xs={6} md={4}>
            <Text>Rating</Text>
            <Slider name="rating" min={1} max={5} />
          </Box>
          <Box xs={6} md={4}>
            <Checkbox name="acceptTerms" label="I accept the terms of use." />
          </Box>
          <Box xs={6} md={4}>
            <Button type="submit">Submit</Button>
          </Box>
        </Grid>
      </Form>
    </>
  );
}

function BadgeExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title">Badge</Text>
      <Grid alignItems="center" gap mt={theme.shape.gap}>
        <Box>
          <Badge dot />
        </Box>
        <Box>
          <Badge color="warning">2</Badge>
        </Box>
        <Box>
          <Badge color="primary">30</Badge>
        </Box>
        <Box>
          <Badge color="success">99+</Badge>
        </Box>
        <Box>
          <Badge>Large Badge</Badge>
        </Box>
        <Box>
          <Button badge={1}>Notifications</Button>
        </Box>
      </Grid>
    </>
  );
}

function TableExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Tables
      </Text>
      <Table
        border
        rows={table}
        columns={[
          {
            header: 'Dessert',
            content: ({ dessert }) => dessert,
          },
          {
            header: 'Calories',
            content: ({ calories }) => calories,
          },
          {
            header: 'Fat (g)',
            content: ({ fat }) => fat,
          },
          {
            header: 'Carbs (g)',
            content: ({ carbs }) => carbs,
          },
        ]}
      />
    </>
  );
}

function ListExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Lists
      </Text>

      <List h={240} border="primary">
        <Text height={36} bg="background.secondary">
          Header
        </Text>
        {Array.from({ length: 1000 }).map((_, index) => (
          <Text key={index} height={18}>
            Item Child {index + 1}
          </Text>
        ))}
      </List>
    </>
  );
}

function ImageExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Images
      </Text>
      <Box row center>
        <Image mr={2} w={120} source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg" />
        <Image mr={2} w="15%" source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg" />
        <Image
          mr={2}
          h={80}
          corners={3}
          source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg"
        />
        <Image
          mr={2}
          w={80}
          h={80}
          circular
          source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg"
        />
      </Box>
    </>
  );
}

function AvatarExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Avatar
      </Text>
      <Grid gap>
        <Box>
          <Avatar
            size={100}
            placeholder={
              <Text size={2} color="white">
                RW
              </Text>
            }
          />
        </Box>
        <Box>
          <Avatar
            border="3px solid red"
            size={100}
            color="primary"
            placeholder={
              <Text size={2} color="white">
                RW
              </Text>
            }
          />
        </Box>
        <Box>
          <Avatar size={100} source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg">
            <Button circular color="secondary" position="absolute" b={0} r={0}>
              ↺
            </Button>
          </Avatar>
        </Box>
      </Grid>
    </>
  );
}

function DividerExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Dividers
      </Text>
      <Box row center>
        <Box flex>
          <Text>Horizontal</Text>
          <Divider mt={theme.shape.gap} />
          <Divider mt={theme.shape.gap} color="primary" />
          <Divider mt={theme.shape.gap} color="secondary" />
        </Box>
        <Box row center w="50%" h={100}>
          <Text my={theme.shape.gap}>Vertical</Text>
          <Divider ml={theme.shape.gap} vertical />
          <Divider ml={theme.shape.gap} color="primary" vertical />
          <Divider ml={theme.shape.gap} color="secondary" vertical />
        </Box>
      </Box>
    </>
  );
}

function ModalExample() {
  const theme = useTheme();

  const [modal, setModal] = useState({});

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Modals
      </Text>

      <Grid gap>
        <Box>
          <Button onPress={() => setModal({ visible: true, valign: 'top' })}>Top</Button>
        </Box>
        <Box>
          <Button onPress={() => setModal({ visible: true, valign: 'bottom' })}>Bottom</Button>
        </Box>
        <Box>
          <Button onPress={() => setModal({ visible: true, valign: 'center' })}>Center</Button>
        </Box>
        <Box>
          <Button onPress={() => setModal({ visible: true, halign: 'left' })}>Left</Button>
        </Box>
        <Box>
          <Button onPress={() => setModal({ visible: true, halign: 'right' })}>Right</Button>
        </Box>
      </Grid>
      <Modal {...modal} onBackdropPress={() => setModal((current) => ({ ...current, visible: false }))}>
        <Box maxw={300}>
          <Text bold size={1.25}>
            My Modal
          </Text>
          <Divider my={theme.shape.gap} mx={-theme.shape.gap} />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur cupiditate deserunt dolorum
            eius et expedita qui repellendus voluptatibus! Accusamus consectetur deleniti fuga iure laborum quam
            quisquam quo ut, velit!
          </Text>
          <Button mt={theme.shape.gap} onPress={() => setModal((current) => ({ ...current, visible: false }))}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

function ToasterExample() {
  const theme = useTheme();

  const toaster = useToaster();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Toaster
      </Text>
      <Grid gap>
        <Box>
          <Button onPress={() => toaster.open('Hello world!')}>Default</Button>
        </Box>
        {colors.map((color) => (
          <Box key={color}>
            <Button onPress={() => toaster[color]('Hello world!')}>{getLabel(color)}</Button>
          </Box>
        ))}
        <Box>
          <Button
            onPress={() =>
              toaster.open({
                content: (
                  <>
                    <Text>⚠</Text>
                    <Text color="warning" mx={theme.shape.gap}>
                      Hello world!
                    </Text>
                    <Button variant="text" size="small">
                      Undo
                    </Button>
                  </>
                ),
              })
            }
          >
            Custom
          </Button>
        </Box>
      </Grid>
    </>
  );
}

function CollapseExample() {
  const theme = useTheme();

  const [collpase, toggleCollapse] = useReducer((state) => !state, false);

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Collapse
      </Text>
      <Box row>
        <Button onPress={toggleCollapse}>Toggle Collapse</Button>
      </Box>
      <Collapse visible={collpase} mt={theme.shape.gap}>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Atque autem consectetur consequuntur corporis,
          dignissimos distinctio earum error ex facere hic ipsum nam necessitatibus neque pariatur quasi quibusdam
          recusandae suscipit, tempora.
        </Text>
      </Collapse>
    </>
  );
}

function DrawerExample() {
  const theme = useTheme();

  const [drawer, setDrawer] = useState(false);
  const [placement, setPlacement] = useState('right');
  const [style, setStyle] = useState({});

  const handleOpen = (placement: string) => {
    setDrawer(true);
    setPlacement(placement);
    setStyle(placement === 'top' || placement === 'bottom' ? {} : { w: 320 });
  };

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Drawer
      </Text>
      <Grid gap>
        {placements.map((item) => (
          <Box key={item}>
            <Button onPress={() => handleOpen(item)}>{getLabel(item)}</Button>
          </Box>
        ))}
      </Grid>
      <Drawer visible={drawer} placement={placement as any} style={style} onBackdropPress={() => setDrawer(false)}>
        <Card>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
          <Text mt={theme.shape.gap}>
            A adipisci aliquid aspernatur, at autem deleniti dolorum, maiores nihil numquam officia omnis recusandae
            soluta. Incidunt labore laboriosam maiores, praesentium quia tempore!
          </Text>
          <Button mt={theme.shape.gap} onPress={() => setDrawer(false)}>
            Close
          </Button>
        </Card>
      </Drawer>
    </>
  );
}

function DropdownExample() {
  const theme = useTheme();

  const [dropdown, toggleDropdown] = useReducer((state) => !state, false);

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Dropdown
      </Text>
      <Box row>
        <Button onPress={toggleDropdown}>Toggle Dropdown</Button>
      </Box>
      <Dropdown visible={dropdown} onClose={toggleDropdown}>
        <Card>
          <Text>Lorem ipsum dolor sit amet</Text>
        </Card>
      </Dropdown>
    </>
  );
}

function TabsExample() {
  const theme = useTheme();

  const [tab, setTab] = useState<number | string>(1);

  return (
    <>
      <Text variant="title">Tabs</Text>

      <Card bg="background.secondary" mt={theme.shape.gap}>
        <Tabs
          variant="group"
          value={tab}
          onChange={(_, value) => setTab(value)}
          tabs={[{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }, { label: 'Tab 4' }, { label: 'Tab 6' }]}
        />
      </Card>

      <Card bg="background.secondary" mt={theme.shape.gap}>
        <Tabs
          variant="card"
          value={tab}
          onChange={(_, value) => setTab(value)}
          tabs={[{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }, { label: 'Tab 4' }, { label: 'Tab 6' }]}
        />
      </Card>

      <Card bg="background.secondary" mt={theme.shape.gap}>
        <Tabs
          variant="nav"
          value={tab}
          onChange={(_, value) => setTab(value)}
          tabs={[{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }, { label: 'Tab 4' }, { label: 'Tab 6' }]}
        />
      </Card>
    </>
  );
}

function ProgressExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title">Progress</Text>
      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Box row noWrap>
        <Grid gap>
          <Box xs={12}>
            <Text variant="subtitle">Loading</Text>
          </Box>
          <Box>
            <Loading align="start" />
          </Box>
          <Box>
            <Loading align="start" label="Fetching data..." />
          </Box>
        </Grid>
      </Box>

      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle">Bar indeterminate</Text>
      <Progress mt={theme.shape.gap} />

      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle">Bar with value</Text>
      <Progress value={Math.random() * 100} mt={theme.shape.gap} />
    </>
  );
}

function CalendarExample() {
  const theme = useTheme();

  const [date, setDate] = useState(new Date());

  return (
    <>
      <Text variant="title">Calendar</Text>
      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle">Component</Text>
      <Box maxw={360} mx={-theme.shape.gap}>
        <Calendar />
      </Box>

      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Grid gap maxw={360}>
        <Box xs={12}>
          <Text variant="subtitle">Date Picker</Text>
        </Box>
        <Box xs={12}>
          <InputDate name="calendar" label="Variant Modal (Default)" value={date} />
        </Box>
        <Box xs={12}>
          <InputDate variant="dropdown" name="calendar" label="Variant Dropdown" value={date} />
        </Box>
        <Box xs={12}>
          <InputDate variant="inline" name="calendar" label="Variant Inline" value={date} />
        </Box>
        <Box xs={12}>
          <Button
            onPress={() => {
              const from = new Date('2020-01-01T12:00:00');
              const to = new Date();
              setDate(new Date(from.getTime() + Math.random() * (to.getTime() - from.getTime())));
            }}
          >
            Random Date
          </Button>
        </Box>
      </Grid>
    </>
  );
}

function TooltipExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Tooltip
      </Text>
      <Text variant="subtitle" mb={theme.shape.gap}>
        Hover/press texts below
      </Text>
      <Box row center>
        {placements.map((pos) => (
          <Box key={pos} p={theme.shape.gap}>
            <Tooltip title="My tooltip" position={pos}>
              <Text>{getLabel(pos)}</Text>
            </Tooltip>
          </Box>
        ))}
        {colors.map((color) => (
          <Box key={color} p={theme.shape.gap}>
            <Tooltip title="My tooltip" color={color}>
              <Text>{getLabel(color)}</Text>
            </Tooltip>
          </Box>
        ))}
      </Box>
    </>
  );
}

function CarouselExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Carousel
      </Text>
      <Carousel xs={1} sm={2} md={3} lg={4} xl={5} gap>
        {Array.from({ length: 11 }).map((_, index) => (
          <Card key={index} corners={3} bg="background.secondary">
            <Text bold>Item {index + 1}</Text>
            <Image
              w="100%"
              corners={3}
              my={theme.shape.gap}
              source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg"
            />
            <Text>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos recusandae suscipit velit voluptate.
            </Text>
          </Card>
        ))}
      </Carousel>
    </>
  );
}

function TerminalExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Terminal
      </Text>
      <Terminal h={240} />
    </>
  );
}

function AnimationExample() {
  const theme = useTheme();

  const from = { width: 40, height: 40 };
  const to = { width: 200, height: 200 };

  const sizeAnim = useAnimation(from);
  const transition = unstable_useTransition(from);

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Animations (Beta)
      </Text>

      <Text variant="subtitle" mb={theme.shape.gap}>
        useAnimation
      </Text>

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
          <Button onPress={() => sizeAnim.start(to, { iterations: 'infinite' })}>Infinite</Button>
        </Box>
        <Box>
          <Button onPress={() => sizeAnim.start(to, { boomerang: true, iterations: 3 })}>Boomerang 3x</Button>
        </Box>
        <Box>
          <Button onPress={() => sizeAnim.start(to, { boomerang: true, iterations: 'infinite' })}>
            Boomerang Infinite
          </Button>
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

      <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

      <Text variant="subtitle" mb={theme.shape.gap}>
        unstable_useTransition
      </Text>
      <Grid gap>
        <Box>
          <Button onPress={() => transition.start({ to, from })}>Forward</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: from, from: to })}>Backward</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to, from, iterations: 3 })}>Repeat 3x</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to, from, boomerang: true })}>Boomerang</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to, from, iterations: -1 })}>Infinite</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to, from, boomerang: true, iterations: 3 })}>Boomerang 3x</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to, from, boomerang: true, iterations: -1 })}>
            Boomerang Infinite
          </Button>
        </Box>
        <Box>
          <Button color="warning" onPress={() => transition.stop()}>
            Stop
          </Button>
        </Box>
        <Box>
          <Button color="error" onPress={() => transition.reset()}>
            Reset
          </Button>
        </Box>
        <Box xs={12}>
          <Box border="1px solid primary" align="start" {...transition.props} />
        </Box>
      </Grid>

      {animations.map((animation, key) => {
        const label = typeof animation === 'string' ? getLabel(animation) : 'Custom';
        const props = typeof animation === 'string' ? { [animation]: true } : animation;

        return (
          <React.Fragment key={key}>
            <Divider my={theme.shape.gap} mx={-theme.shape.gap} />

            <Box>
              <Text variant="subtitle" mb={theme.shape.gap}>
                {label}
              </Text>
              <Grid noWrap alignItems="center" gap={6}>
                <Box>
                  <Animation loop in {...props} duration={1000}>
                    <Image w={40} source="https://lirp.cdn-website.com/dbd26f15/dms3rep/multi/opt/fdd-640w.jpg" />
                  </Animation>
                </Box>
                <Box>
                  <Animation loop in {...props} duration={1000}>
                    <Text>Anything</Text>
                  </Animation>
                </Box>
              </Grid>
            </Box>
          </React.Fragment>
        );
      })}
    </>
  );
}

const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const variants = ['solid', 'outline', 'text'] as const;
const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const placements = ['top', 'bottom', 'left', 'right'] as const;
const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
const animations = ['spin', 'fade', 'zoom', { from: { opacity: 0, ml: -4 }, to: { opacity: 1, ml: 0 } }] as const;

const formData = {
  firstName: 'Richard',
  lastName: 'William',
};

const table = [
  { dessert: 'Frozen yogurt', calories: '159', fat: '6.0', carbs: '24' },
  { dessert: 'Ice cream sandwich', calories: '237', fat: '9.0', carbs: '37' },
  { dessert: 'Eclair', calories: '262', fat: '16.0', carbs: '24' },
];

const getLabel = (str: string) => `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
