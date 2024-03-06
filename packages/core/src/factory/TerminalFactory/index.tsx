import React, { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import scrollToEnd from '../../element/scrollToEnd';
import useTheme from '../../hooks/useTheme';
import factory2 from '../../props/factory2';
import { AnyObject, RbkColor, TerminalProps } from '../../types';
import global from '../../utils/global';
import BoxFactory from '../BoxFactory';
import ScrollableFactory from '../ScrollableFactory';
import TextFactory from '../TextFactory';

function postScroll($el: any) {
  scrollToEnd($el, false);
  setTimeout(() => scrollToEnd($el, false), 100);
}

function postFocus($el: any) {
  $el?.focus();
  setTimeout(() => $el?.focus(), 100);
}

const TerminalFactory = React.memo<TerminalProps>(
  forwardRef(({ stylist, ...props }, ref) => {
    const theme = useTheme();
    const options = theme.components.Terminal;
    const { web, native, ios, Input } = global.mapping;

    // Extends from default props
    const {
      prompt,
      commands: commandsProp,
      version,
      welcomeMessage,
      // Styles
      variants,
      ...rest
    } = factory2<TerminalProps>(props, options);

    const defaultRef = useRef();
    const scrollRef = (ref ?? defaultRef) as React.MutableRefObject<any>;
    const inputRef = useRef<any>();

    const [isLocked, setIsLocked] = useState(false);
    const [arrowIndex, setArrowIndex] = useState<number>(0);
    const [text, setText] = useState('');

    const [messages, setMessages] = useState<{ body: string; prompt?: string; color?: RbkColor }[]>(
      welcomeMessage ? [{ body: welcomeMessage }] : [],
    );

    if (native) {
      rest.onContentSizeChange = () => postScroll(scrollRef.current);
    }

    useEffect(() => {
      postScroll(scrollRef.current);
    }, [scrollRef, messages, isLocked]);

    const addMessage = useCallback((message: string, options: AnyObject = {}) => {
      setMessages((current) => [...current, { ...options, body: `${message ?? ''}` }]);
    }, []);

    const terminal = useMemo(
      () => ({
        // exec: (command) => execCommand(command),
        lock: () => setIsLocked(true),
        unlock: () => setIsLocked(false),
        focus: () => inputRef.current?.focus(),
        // Messages
        clear: () => setMessages([]),
        log: (message: string) => addMessage(message),
        info: (message: string) => addMessage(message, { color: 'info' }),
        warning: (message: string) => addMessage(message, { color: 'warning' }),
        success: (message: string) => addMessage(message, { color: 'success' }),
        error: (message: string) => addMessage(message, { color: 'error' }),
      }),
      [inputRef, addMessage],
    );

    const commands = useMemo(() => {
      const allCommands: AnyObject = {
        cls: 'clear',
        clear: () => setMessages([]),
        date: () => new Date().toString(),
        ping: () => 'pong',
        echo: ({ args }) => args ?? '',
        version: () => version,
        sleep: ({ args }) => new Promise((resolve) => setTimeout(resolve, args)),
        history: ({ args }) => {
          addMessage('');
          addMessage('  Id CommandLine', { color: 'success' });
          addMessage('---- -----------', { color: 'success' });

          messages
            .slice(0, -1)
            .filter(({ prompt }) => prompt)
            .filter((_, index) => !args || Number(args) === index + 1)
            .forEach(({ body }, index) => {
              addMessage(`${args || index + 1}`.padStart(4, ' ') + ' ' + body);
            });

          addMessage('');
        },
        ...commandsProp,
      };

      allCommands.help = () => {
        addMessage(``);
        addMessage(`Running version ${version ?? '?'}`);
        addMessage(``);
        addMessage(`Available commands:`);
        addMessage(``);

        Object.keys(allCommands)
          .sort()
          .forEach((cmd) => addMessage(`  ${cmd}`));

        addMessage(``);
      };

      return allCommands;
    }, [commandsProp, version, addMessage, messages]);

    const execCommand = useCallback(
      async (command: string) => {
        const split = command.split(' ');
        command = split.shift() ?? '';
        const args = split.join(' ');

        let callback = commands?.[command];

        if (typeof callback === 'string') {
          callback = commands?.[callback];
        }

        if (typeof callback === 'function') {
          try {
            const response = await callback({ command, args, ...terminal });

            if (['number', 'string'].includes(typeof response)) {
              addMessage(response);
            }
          } catch (err) {
            addMessage(`Error: ${(err as Error).message}`, { color: 'error' });
          }
        } else {
          addMessage(`Unknown command: ${command}`, { color: 'error' });
        }
      },
      [commands, terminal, addMessage],
    );

    const handleChange = useCallback(
      (event) => {
        setText(`${event?.value ?? event?.target?.value ?? event?.nativeEvent?.text ?? ''}`);
        postScroll(scrollRef.current);
      },
      [scrollRef],
    );

    const handleKeyDown = useCallback(
      async (event) => {
        postFocus(inputRef.current);

        const value = `${event?.target?.value ?? event?.nativeEvent?.text ?? event?.value ?? ''}`.trim();

        // Navigate UP
        if (event.key === 'ArrowUp') {
          const prevIndex = arrowIndex - 1;
          const prevMessage = messages.filter(({ prompt, body }) => prompt && body).at(prevIndex);

          if (typeof prevMessage !== 'undefined') {
            setText(prevMessage.body);
            setArrowIndex(prevIndex);
          }
        }

        // Navigate Down
        if (event.key === 'ArrowDown') {
          const nextIndex = arrowIndex + 1;
          const nextMessage = messages.filter(({ prompt, body }) => prompt && body).at(nextIndex);

          if (typeof nextMessage !== 'undefined') {
            setText(nextMessage.body);
            setArrowIndex(nextIndex);
          }
        }

        if (event.ctrlKey) {
          // CTRL + L
          if (event.key.toLowerCase() === 'l') {
            event.preventDefault();
            setMessages([]);
            setIsLocked(false);
          }

          // CTRL + C
          if (event.key.toLowerCase() === 'c' && isLocked) {
            addMessage('^C', { prompt });
            setIsLocked(false);
          }
        }

        // Send Command
        if ((event.key === 'Enter' || event.keyCode === 13) && !isLocked) {
          addMessage(value, { prompt });
          setArrowIndex(0);
          setText('');

          if (value) {
            setIsLocked(true);
            await execCommand(value);
            setIsLocked(false);
          }
        }

        postFocus(inputRef.current);
      },
      [isLocked, arrowIndex, messages, addMessage, prompt, execCommand],
    );

    const handleSubmit = useCallback(
      async (event) => handleKeyDown({ ...event, key: 'Enter', value: text }),
      [text, handleKeyDown],
    );

    const textStyle = {
      fontFamily: web ? '"Courier New", monospace' : ios ? 'Courier New' : 'monospace',
      fontSize: '1rem',
      lineHeight: '1rem',
    };

    return (
      <ScrollableFactory ref={scrollRef} stylist={[variants.root, stylist]} {...rest} contentStyle={{ minh: '100%' }}>
        <BoxFactory
          flex
          p={2}
          onPress={() => postFocus(inputRef.current)}
          platform={{
            native: { activeOpacity: 1 },
          }}
        >
          {messages.map((message, index) => (
            <BoxFactory key={index} mb={1}>
              <TextFactory color={message.color ?? 'text'} style={textStyle}>
                {message.prompt ? `${message.prompt.replace(/ /g, '\u00A0')} ` : ''}
                {message.body?.replace(/ /g, '\u00A0')}
                {'\u00A0'}
              </TextFactory>
            </BoxFactory>
          ))}

          <BoxFactory row noWrap invisible={isLocked}>
            <TextFactory style={textStyle}>
              {prompt ? prompt.replace(/ /g, '\u00A0') : ''}
              {'\u00A0'}
            </TextFactory>

            <BoxFactory flex>
              <BoxFactory
                noRootStyles
                ref={inputRef}
                component={Input}
                readOnly={isLocked}
                value={text}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect={web ? 'off' : false}
                platform={{
                  web: {
                    enterKeyHint: 'send',
                  },
                  native: {
                    returnKeyType: 'send',
                    blurOnSubmit: false,
                    onSubmitEditing: handleSubmit,
                  },
                }}
                style={{
                  ...textStyle,

                  backgroundColor: 'trans',
                  borderWidth: 0,
                  color: 'text.primary',
                  height: '1rem',
                  margin: 0,
                  padding: 0,
                  textDecorationLine: 'none',
                  width: '100%',

                  web: {
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    outline: '0 !important',
                    '-moz-appearance': 'textfield',
                    appearance: 'none',
                    '&::-webkit-outer-spin-button,::-webkit-inner-spin-button': {
                      '-webkit-appearance': 'none',
                      appearance: 'none',
                    },
                  },
                }}
              />
            </BoxFactory>
          </BoxFactory>
        </BoxFactory>
      </ScrollableFactory>
    );
  }),
);

TerminalFactory.displayName = 'TerminalFactory';

export default TerminalFactory;
