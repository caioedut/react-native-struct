import React, { useReducer, useRef, useState } from 'react';

import {
  AnyObject,
  DrawerProps,
  ModalProps,
  RbkFormEvent,
  RbkInputEvent,
  useAnimation,
  useToaster,
} from '@react-bulk/core';
import {
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
  GrowBox,
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
  Resizable,
  Scrollable,
  Select,
  Switch,
  Table,
  Tabs,
  Terminal,
  Text,
  Tooltip,
  useTheme,
} from '@react-bulk/web';

export default function Main() {
  return (
    <Scrollable bg="background.secondary" contentInset="1gap">
      <Card>
        <Text variant="title">React Bulk</Text>
        <Text mt="1gap">Open up App.tsx to start working on your app!</Text>
      </Card>

      <Card mt="1gap">
        <ThemeExample />
      </Card>

      <Card mt="1gap">
        <BreakpointExample />
      </Card>

      <Card mt="1gap">
        <GridExample />
      </Card>

      <Card mt="1gap">
        <TypographyExample />
      </Card>

      <ListItemExample />

      <Card mt="1gap">
        <ButtonExample />
      </Card>

      <Card mt="1gap">
        <FormExample />
      </Card>

      <Card mt="1gap">
        <BadgeExample />
      </Card>

      <Card mt="1gap">
        <TableExample />
      </Card>

      <Card mt="1gap">
        <ListExample />
      </Card>

      <Card mt="1gap">
        <ResizableExample />
      </Card>

      <Card mt="1gap">
        <ImageExample />
      </Card>

      <Card mt="1gap">
        <AvatarExample />
      </Card>

      <Card mt="1gap">
        <DividerExample />
      </Card>

      <Card mt="1gap">
        <TabsExample />
      </Card>

      <Card mt="1gap">
        <ToasterExample />
      </Card>

      <Card mt="1gap">
        <CollapseExample />
      </Card>

      <Card mt="1gap">
        <DropdownExample />
      </Card>

      <Card mt="1gap">
        <ModalExample />
      </Card>

      <Card mt="1gap">
        <DrawerExample />
      </Card>

      <Card mt="1gap">
        <ProgressExample />
      </Card>

      <Card mt="1gap">
        <CalendarExample />
      </Card>

      <Card mt="1gap">
        <TooltipExample />
      </Card>

      <Card mt="1gap">
        <CarouselExample />
      </Card>

      <Card mt="1gap">
        <GrowBoxExample />
      </Card>

      <Card mt="1gap">
        <TerminalExample />
      </Card>

      <Card mt="1gap">
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

    for (const attr of split) {
      // @ts-ignore
      theme[attr][last] = value;
    }

    timeoutRef.current[prop] = setTimeout(() => {
      theme.setTheme(theme);
    }, 500);
  }

  return (
    <>
      <Text variant="title">Theme</Text>

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" my="1gap">
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

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" my="1gap">
        Shape
      </Text>
      <Grid gap>
        <Box xs={6} md={3}>
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
        <Box xs={6} md={3}>
          <Input
            type="number"
            min={0}
            max={16}
            name="shape.gap"
            label="Gap"
            endAddon="px"
            value={`${theme.shape.gap}`}
            onChange={handleChangeTheme}
          />
        </Box>
        <Box xs={6} md={3}>
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

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" my="1gap">
        Typography
      </Text>
      <Grid gap>
        <Box xs={6} md={3}>
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
        <Box xs={6} md={3}>
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

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" my="1gap">
        Colors
      </Text>

      <Grid gap>
        {colors.map((color) => (
          <Box key={color}>
            <Card bg={color}>
              <Text color={theme.contrast(color)}>Name: {color}</Text>
              <Text color={theme.contrast(color)}>Color: {theme.color(color)}</Text>
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
                colorful
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

      <Grid gap mt="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
        Grid
      </Text>
      <Text variant="subtitle" mb="1gap">
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
  return (
    <>
      <Text variant="title">Typography</Text>

      <Grid alignItems="baseline" gap mt="1gap">
        {texts.map((text) => (
          <Box key={text}>
            <Text key={text} variant={text}>
              {getLabel(text)}
            </Text>
          </Box>
        ))}
      </Grid>
    </>
  );
}

function ListItemExample() {
  return (
    <ListItem startAddon="❤" endAddon="⚙" chevron mt="1gap">
      <Box>
        <Text bold>List Item</Text>
        <Text>Lorem ipsum dolor sit amet</Text>
      </Box>
    </ListItem>
  );
}

function ButtonExample() {
  const [loading, toggleLoading] = useReducer((state) => !state, true);

  return (
    <>
      <Text variant="title">Buttons</Text>

      {variants.map((variant) => (
        <Box key={variant}>
          <Text variant="subtitle" transform="capitalize" mt="1gap">
            {variant}
          </Text>
          <Grid alignItems="center" gap mt="1gap">
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
              <Button variant={variant} circular px="1gap">
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
          <Divider mx="-1gap" my="1gap" />
        </Box>
      ))}

      <Text mt="1gap" variant="subtitle">
        Group
      </Text>
      <ButtonGroup mt="1gap" variant="outline">
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
  const [radio, setRadio] = useState('medium');
  const [checkbox, toggleCheckbox] = useReducer((state) => !state, true);
  const [switx, toggleSwitx] = useReducer((state) => !state, true);

  function handleSubmitForm(_: RbkFormEvent, data: AnyObject) {
    alert(JSON.stringify(data, null, 2));
  }

  return (
    <>
      <Text variant="title">Forms</Text>

      <Text mt="1gap" variant="subtitle">
        Text Field
      </Text>

      <Input mt="1gap" label="Default Input" placeholder="This is the default input" />
      <Input mt="1gap" label="Secure" placeholder="Secure input" secure />
      <Input mt="1gap" label="Read Only" placeholder="Read only input" readOnly />
      <Input mt="1gap" label="Disabled" placeholder="Disabled input" disabled />
      <Input mt="1gap" label="Invalid" placeholder="Input with error" error="Value is invalid!" />
      <Input mt="1gap" label="Icons" placeholder="Input with icons" startAddon="$" endAddon="💳" />

      {sizes.map((size) => (
        <Input key={size} mt="1gap" size={size} label={getLabel(size)} placeholder={`This is a ${size} input`} />
      ))}

      <Input mt="1gap" label="Multiline" placeholder="Multiline input" multiline />

      <Divider mt="1gap" mx="-1gap" />

      <Text mt="1gap" variant="subtitle">
        Input Pin
      </Text>

      <Grid gap mt="1gap">
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

      <Divider mt="1gap" mx="-1gap" />

      <Text mt="1gap" variant="subtitle">
        Combobox
      </Text>

      <Select
        mt="1gap"
        label="City"
        placeholder="[Select]"
        options={[
          { label: 'Option 1', value: 1 },
          { label: 'Option 2', value: 2 },
          { label: 'Option 3', value: 3 },
        ]}
      />

      <Select
        mt="1gap"
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

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" mt="1gap">
        Checkbox / Radio Button / Switch
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

      <Grid alignItems="center" gap>
        {sizes.map((size) => (
          <Box key={size}>
            <Switch size={size} label={getLabel(size)} checked={switx === true} onChange={toggleSwitx} />
          </Box>
        ))}
      </Grid>

      <Divider mt="1gap" mx="-1gap" />

      <Text variant="subtitle" mt="1gap">
        Serializable
      </Text>
      <Form onSubmit={handleSubmitForm} data={formData} mt="1gap">
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
            <Checkbox name="acceptTerms" label="I accept the terms of use." />
          </Box>
          <Box xs={6} md={4}>
            <Switch name="sendReport" label="Send report." />
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
  return (
    <>
      <Text variant="title">Badge</Text>
      <Grid alignItems="center" gap mt="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
        Lists
      </Text>

      <List h={240} border="primary">
        <Text sticky height={36} bg="background.secondary">
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

function ResizableExample() {
  const theme = useTheme();

  return (
    <>
      <Text variant="title" mb={theme.shape.gap}>
        Resizable
      </Text>

      <Resizable w={100} h={100}>
        <Box flex border bg="background.secondary" w="100%" h="100%" />
      </Resizable>
    </>
  );
}

function ImageExample() {
  return (
    <>
      <Text variant="title" mb="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
        Dividers
      </Text>
      <Box row center>
        <Box flex>
          <Text>Horizontal</Text>
          <Divider mt="1gap" />
          <Divider mt="1gap" color="primary" />
          <Divider mt="1gap" color="secondary" />
        </Box>
        <Box row center w="50%" h={100}>
          <Text my="1gap">Vertical</Text>
          <Divider ml="1gap" vertical />
          <Divider ml="1gap" color="primary" vertical />
          <Divider ml="1gap" color="secondary" vertical />
        </Box>
      </Box>
    </>
  );
}

function ModalExample() {
  const [isVisible, setIsVisible] = useState(false);
  const [valign, setValign] = useState<ModalProps['valign']>('center');
  const [halign, setHalign] = useState<ModalProps['halign']>('center');
  const [animation, setAnimation] = useState<ModalProps['animation']>('fade');

  return (
    <>
      <Text variant="title" mb="1gap">
        Modal
      </Text>

      <Grid gap>
        <Box>
          <Select
            minw={160}
            label="Animation"
            value={animation}
            onChange={(_, value: any) => setAnimation(value)}
            options={[
              { value: 'fade', label: 'Fade' },
              { value: 'zoom-in', label: 'Zoom In' },
              { value: 'zoom-out', label: 'Zoom Out' },
              { value: 'slide-bottom', label: 'Slide Bottom' },
              { value: 'slide-top', label: 'Slide Top' },
              { value: 'slide-left', label: 'Slide Left' },
              { value: 'slide-right', label: 'Slide Right' },
            ]}
          />
        </Box>
        <Box>
          <Select
            minw={160}
            label="Vertical Align"
            value={valign}
            onChange={(_, value: any) => setValign(value)}
            options={[
              { value: 'center', label: 'Center' },
              { value: 'top', label: 'Top' },
              { value: 'bottom', label: 'Bottom' },
            ]}
          />
        </Box>
        <Box>
          <Select
            minw={160}
            label="Horizontal Align"
            value={halign}
            onChange={(_, value: any) => setHalign(value)}
            options={[
              { value: 'center', label: 'Center' },
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
          />
        </Box>
        <Box xs={12}>
          <Button align="start" onPress={() => setIsVisible(true)}>
            Show Modal
          </Button>
        </Box>
      </Grid>

      <Modal
        visible={isVisible}
        animation={animation}
        valign={valign}
        halign={halign}
        onClose={() => setIsVisible(false)}
      >
        <Box maxw={300}>
          <Text bold size={1.25}>
            My Modal
          </Text>
          <Divider my="1gap" mx="-1gap" />
          <Text>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam consectetur cupiditate deserunt dolorum
            eius et expedita qui repellendus voluptatibus! Accusamus consectetur deleniti fuga iure laborum quam
            quisquam quo ut, velit!
          </Text>
          <Button mt="1gap" onPress={() => setIsVisible(false)}>
            Close
          </Button>
        </Box>
      </Modal>
    </>
  );
}

function ToasterExample() {
  const toaster = useToaster();

  return (
    <>
      <Text variant="title" mb="1gap">
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
                    <Text color="warning" mx="1gap">
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
  const [collpase, toggleCollapse] = useReducer((state) => !state, false);

  return (
    <>
      <Text variant="title" mb="1gap">
        Collapse
      </Text>
      <Box row>
        <Button onPress={toggleCollapse}>Toggle Collapse</Button>
      </Box>
      <Collapse visible={collpase} mt="1gap">
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
  const [isVisible, setIsVisible] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');

  return (
    <>
      <Text variant="title" mb="1gap">
        Drawer
      </Text>

      <Grid gap>
        <Box>
          <Select
            minw={160}
            label="Placement"
            value={placement}
            onChange={(_, value: any) => setPlacement(value)}
            options={placements.map((placement) => ({
              value: placement,
              label: getLabel(placement),
            }))}
          />
        </Box>
        <Box xs={12}>
          <Button align="start" onPress={() => setIsVisible(true)}>
            Show Drawer
          </Button>
        </Box>
      </Grid>

      <Drawer
        visible={isVisible}
        placement={placement as any}
        onClose={() => setIsVisible(false)}
        style={placement === 'top' || placement === 'bottom' ? {} : { w: 320 }}
      >
        <Card>
          <Text>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</Text>
          <Text mt="1gap">
            A adipisci aliquid aspernatur, at autem deleniti dolorum, maiores nihil numquam officia omnis recusandae
            soluta. Incidunt labore laboriosam maiores, praesentium quia tempore!
          </Text>
          <Button mt="1gap" onPress={() => setIsVisible(false)}>
            Close
          </Button>
        </Card>
      </Drawer>
    </>
  );
}

function DropdownExample() {
  const [dropdown, toggleDropdown] = useReducer((state) => !state, false);

  return (
    <>
      <Text variant="title" mb="1gap">
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
  const [tab, setTab] = useState<number | string>(1);

  return (
    <>
      <Text variant="title">Tabs</Text>

      <Card bg="background.secondary" mt="1gap">
        <Tabs
          variant="group"
          value={tab}
          onChange={(_, value) => setTab(value)}
          tabs={[{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }, { label: 'Tab 4' }, { label: 'Tab 6' }]}
        />
      </Card>

      <Card bg="background.secondary" mt="1gap">
        <Tabs
          variant="card"
          value={tab}
          onChange={(_, value) => setTab(value)}
          tabs={[{ label: 'Tab 1' }, { label: 'Tab 2' }, { label: 'Tab 3' }, { label: 'Tab 4' }, { label: 'Tab 6' }]}
        />
      </Card>

      <Card bg="background.secondary" mt="1gap">
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
  const [percent, randomPercent] = useReducer(() => Math.random() * 100, 50);

  return (
    <>
      <Text variant="title">Progress</Text>
      <Divider my="1gap" mx="-1gap" />

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

      <Divider my="1gap" mx="-1gap" />

      <Text variant="subtitle">Bar indeterminate</Text>
      <Progress mt="1gap" />

      <Divider my="1gap" mx="-1gap" />

      <Text variant="subtitle">Bar with value</Text>
      <Progress value={percent} mt="1gap" />

      <Button align="start" mt={4} onPress={randomPercent}>
        Random Percent
      </Button>
    </>
  );
}

function CalendarExample() {
  const [date, setDate] = useState(new Date());

  return (
    <>
      <Text variant="title">Calendar</Text>
      <Divider my="1gap" mx="-1gap" />

      <Text variant="subtitle">Component</Text>
      <Box maxw={360} mx="-1gap">
        <Calendar />
      </Box>

      <Divider my="1gap" mx="-1gap" />

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
  return (
    <>
      <Text variant="title" mb="1gap">
        Tooltip
      </Text>
      <Text variant="subtitle" mb="1gap">
        Hover/press texts below
      </Text>
      <Box row center>
        {placements.map((pos) => (
          <Box key={pos} p="1gap">
            <Tooltip title="My tooltip" position={pos}>
              <Text>{getLabel(pos)}</Text>
            </Tooltip>
          </Box>
        ))}
        {colors.map((color) => (
          <Box key={color} p="1gap">
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
  return (
    <>
      <Text variant="title" mb="1gap">
        Carousel
      </Text>
      <Carousel xs={1} sm={2} md={3} lg={4} xl={5} gap>
        {Array.from({ length: 11 }).map((_, index) => (
          <Card key={index} corners={3} bg="background.secondary">
            <Text bold>Item {index + 1}</Text>
            <Image
              w="100%"
              corners={3}
              my="1gap"
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

function GrowBoxExample() {
  const [length, incLength] = useReducer((current: number, incValue: number) => {
    return Math.max(0, current + incValue);
  }, 0);

  return (
    <>
      <Text variant="title" mb="1gap">
        Grow Box
      </Text>

      <ButtonGroup>
        <Button onPress={() => incLength(1)}>+1</Button>
        <Button onPress={() => incLength(+10)}>+10</Button>
        <Button onPress={() => incLength(-1)}>-1</Button>
        <Button onPress={() => incLength(-10)}>-10</Button>
        <Button onPress={() => incLength(-length)}>Reset</Button>
      </ButtonGroup>

      <GrowBox row mt={4} align="start" border="1px solid primary">
        {Array.from({ length }).map((_, index) => (
          <Box key={index} w={100} p={2}>
            <Card bg="background.secondary">
              <Text center>{index + 1}</Text>
            </Card>
          </Box>
        ))}
      </GrowBox>
    </>
  );
}

function TerminalExample() {
  return (
    <>
      <Text variant="title" mb="1gap">
        Terminal
      </Text>
      <Terminal h={240} />
    </>
  );
}

function AnimationExample() {
  const small = { width: 40, height: 40 };
  const big = { width: 200, height: 200 };

  const transition = useAnimation(small);

  return (
    <>
      <Text variant="title" mb="1gap">
        Animations
      </Text>

      <Text variant="subtitle" mb="1gap">
        useAnimation
      </Text>

      <Grid gap>
        <Box>
          <Button onPress={() => transition.start({ to: big })}>Forward</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: small })}>Backward</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: big, iterations: 3 })}>Repeat 3x</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: big, boomerang: true })}>Boomerang</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: big, iterations: -1 })}>Infinite</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: big, boomerang: true, iterations: 3 })}>Boomerang 3x</Button>
        </Box>
        <Box>
          <Button onPress={() => transition.start({ to: big, boomerang: true, iterations: -1 })}>
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
    </>
  );
}

const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const variants = ['solid', 'outline', 'text'] as const;
const sizes = ['xsmall', 'small', 'medium', 'large', 'xlarge'] as const;
const placements = ['top', 'bottom', 'left', 'right'] as const;
const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const;
const texts = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'title', 'subtitle', 'primary', 'secondary', 'caption'] as const;

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
