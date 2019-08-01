const schema = {
  "author": "TamTam Team",
  "colors": {
    "accent": "#697CFF",
    "accentText": "#FFFFFF",
    "background": "#262626",
    "bubbleBorder": "#FFFFFF",
    "bubbleBorderHighLight": "#6988E0",
    "bubbleClickableBackground": "#2D2D2D",
    "bubbleControlBackground": "#626262",
    "bubbleControlsText": "#FFFFFF",
    "bubbleDecoratorBackground": "#232323",
    "bubbleDecoratorText": "#FFFFFF",
    "bubbleOuterBorder": "#000000",
    "bubbleSecondaryText": "#848484",
    "buttonTint": "#FFFFFF",
    "chatBackground": "#1C1C1C",
    "destructive": "#FF3F3F",
    "fileBadgeBackground": "#FBC03D",
    "highlightBackground": "#2D2D2D",
    "incomingBubbleBackground": "#262626",
    "incomingBubbleBackgroundHighlighted": "#2D2D2D",
    "outgoingBubbleBackground": "#262626",
    "outgoingBubbleBackgroundHighlighted": "#2D2D2D",
    "primaryText": "#FFFFFF",
    "profileBackground": "#1C1C1C",
    "secondaryBackground": "#1C1C1C",
    "secondaryButton": "#2D2D2D",
    "secondaryText": "#AAAAAA",
    "separatorBackground": "#333333",
    "statusBarBackground": "#2D2D2D",
    "switchThumb": "#848484",
    "switchThumbChecked": "#E4E4E4",
    "switchTrack": "#444444",
    "switchTrackChecked": "#848484",
    "switchTint": "#626262",
    "tertiaryText": "#AAAAAA",
    "toolBarBackground": "#262626",
    "unreadBackground": "#28972B",
    "unreadBackgroundMuted": "#848484",
    "unreadText": "#FFFFFF"
  },
  "night": true,
  "title": "TamTam Dark Contrast",
  "version": 1
}

const cssToProperty = {
  background: ['--c-bg', '--ui-titlebar-bg', '--c-aside-bg', '--c-bubble-search-bg', '--c-input'],
  chatBackground: ['--c-chat-bg', '--c-chat-bg-default'],
  highlightBackground: ['--c-active', '--c-active-chat-item', '--c-btn-active', '--c-global-search'],
  separatorBackground: '--c-delimiter',
  secondaryBackground: '--c-delimiter-fat',
  drawer: '--c-drawer',
  accent: '--c-highlight',
  destructive: '--c-error',
  favorite: '--c-favorite',
  primaryText: ['--c-text', '--c-link-hover', '--c-btn-text', '--c-msg-text'],
  secondaryText: ['--c-text-sub', '--c-link', '--c-msg-mine-sub', '--c-aside-text'],
  incomingBubbleBackground: '--c-msg',
  outgoingBubbleBackground: '--c-msg-mine',
  unreadBackground: '--c-bubble-bg',
  unreadBackgroundMuted: '--c-bubble-muted-bg',
  unreadText: '--c-bubble-text',
  secondaryButton: '--c-btn',
  tertiaryText: ['--c-btn-tertiary', '--c-input-border'],
  accentText: '--c-btn-tertiary-text',
}

export const events = {
  change(component, event) {
    applyColor(event.target.name, event.target.value);
  }
};

export function state() {
  return {
    colorKeys: Object.keys(cssToProperty),
    schema
  };
}

export function onChangeColor(colorName, component) {
  // console.log(colorName, getComputedStyle(document.body).getPropertyValue(cssToProperty[colorName]));
  // console.log(schema.colors[colorName], colorName);
}

export function didMount(component) {
  component.state.colorKeys.forEach(colorName => {
    const color = schema.colors[colorName];

    applyColor(colorName, color);
  });
}

function toArray(item) {
  return [].concat(item);
}

function applyColor(colorName, color) {
  const cssVars = toArray(cssToProperty[colorName]);

  cssVars.forEach(cssVar => {
    document.documentElement.style.setProperty(cssVar, color);
  });
}