import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CalendarViewMonthIcon from "@mui/icons-material/CalendarViewMonth";
import CodeIcon from "@mui/icons-material/Code";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatIndentDecreaseIcon from "@mui/icons-material/FormatIndentDecrease";
import FormatIndentIncreaseIcon from "@mui/icons-material/FormatIndentIncrease";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import LinkIcon from "@mui/icons-material/Link";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import StrikethroughSIcon from "@mui/icons-material/StrikethroughS";
import TitleIcon from "@mui/icons-material/Title";
import {
  Box,
  ButtonGroup,
  Divider,
  Grid,
  IconButton,
  IconButtonProps,
  Tab,
  TabProps,
  Tabs,
  TabsProps,
  TextareaAutosize,
  TextareaAutosizeProps,
  Tooltip,
  TooltipProps,
  generateUtilityClasses
} from "@mui/material";
import { format } from "prettier";
import markdownParser from "prettier/parser-markdown";
import {
  ComponentPropsWithoutRef,
  ComponentType,
  createRef,
  FocusEvent,
  FocusEventHandler,
  forwardRef,
  Fragment,
  MouseEventHandler,
  SyntheticEvent,
  useState
} from "react";
import { useMobile } from "../utils/useMobile";
import InlineCodeIcon from "./icons/inlineCode";
import { MarkdownPreview } from "./Preview";
import { combineClasses, createSyntheticEvent } from "../utils";

export type MarkdownEditorMenuButtonAction = (
  name: string,
  content: string,
  selectionStart: number,
  selectionEnd: number
) => { content: string; selectionStart: number; selectionEnd: number };

export type MarkdownEditorMenuButtonProps = IconButtonProps & {
  title: TooltipProps["title"];
  TooltipProps?: Omit<TooltipProps, "title" | "children">;
  containerProps?: ComponentPropsWithoutRef<"span">;
};

const buttonClasses = generateUtilityClasses(
  "MuiExtendedMarkdownEditorMenuButton",
  ["root", "tooltip", "button"]
);

export const MarkdownEditorMenuButton = ({
  children,
  title,
  TooltipProps,
  containerProps,
  ...props
}: MarkdownEditorMenuButtonProps) => {
  return (
    <Tooltip
      arrow
      placement="top"
      {...TooltipProps}
      className={combineClasses(buttonClasses.tooltip, TooltipProps?.className)}
      title={title}
    >
      <span
        {...containerProps}
        className={combineClasses(
          buttonClasses.root,
          containerProps?.className
        )}
      >
        <IconButton
          {...props}
          className={combineClasses(buttonClasses.button, props.className)}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
};

const defaultMenu: string[][] = [
  ["bold", "italic", "strikethrough"],
  ["title", "quote"],
  ["link", "image"],
  ["code", "inlineCode"],
  ["unorderedList", "orderedList", "taskList"],
  ["indentIncrease", "indentDecrease"],
  ["table"],
  ["format"]
];

const DefaultButtons: Record<
  string,
  ComponentType<Omit<MarkdownEditorMenuButtonProps, "title">>
> = {
  bold: props => (
    <MarkdownEditorMenuButton title="Bold" {...props}>
      <FormatBoldIcon />
    </MarkdownEditorMenuButton>
  ),
  italic: props => (
    <MarkdownEditorMenuButton title="Italic" {...props}>
      <FormatItalicIcon />
    </MarkdownEditorMenuButton>
  ),
  strikethrough: props => (
    <MarkdownEditorMenuButton title="Strikethrough" {...props}>
      <StrikethroughSIcon />
    </MarkdownEditorMenuButton>
  ),
  quote: props => (
    <MarkdownEditorMenuButton title="Quote" {...props}>
      <FormatQuoteIcon />
    </MarkdownEditorMenuButton>
  ),
  link: props => (
    <MarkdownEditorMenuButton title="Link" {...props}>
      <LinkIcon />
    </MarkdownEditorMenuButton>
  ),
  image: props => (
    <MarkdownEditorMenuButton title="Image" {...props}>
      <AddPhotoAlternateIcon />
    </MarkdownEditorMenuButton>
  ),
  code: props => (
    <MarkdownEditorMenuButton title="Code" {...props}>
      <CodeIcon />
    </MarkdownEditorMenuButton>
  ),
  inlineCode: props => (
    <MarkdownEditorMenuButton title="Inline Code" {...props}>
      <InlineCodeIcon />
    </MarkdownEditorMenuButton>
  ),
  title: props => (
    <MarkdownEditorMenuButton title="Title" {...props}>
      <TitleIcon />
    </MarkdownEditorMenuButton>
  ),
  unorderedList: props => (
    <MarkdownEditorMenuButton title="Unordered List" {...props}>
      <FormatListBulletedIcon />
    </MarkdownEditorMenuButton>
  ),
  orderedList: props => (
    <MarkdownEditorMenuButton title="Ordered List" {...props}>
      <FormatListNumberedIcon />
    </MarkdownEditorMenuButton>
  ),
  taskList: props => (
    <MarkdownEditorMenuButton title="Task List" {...props}>
      <PlaylistAddCheckIcon />
    </MarkdownEditorMenuButton>
  ),
  indentIncrease: props => (
    <MarkdownEditorMenuButton title="Increase Indent" {...props}>
      <FormatIndentIncreaseIcon />
    </MarkdownEditorMenuButton>
  ),
  indentDecrease: props => (
    <MarkdownEditorMenuButton title="Decrease Indent" {...props}>
      <FormatIndentDecreaseIcon />
    </MarkdownEditorMenuButton>
  ),
  table: props => (
    <MarkdownEditorMenuButton title="Table" {...props}>
      <CalendarViewMonthIcon />
    </MarkdownEditorMenuButton>
  ),
  format: props => (
    <MarkdownEditorMenuButton title="Format" {...props}>
      <AutoFixHighIcon />
    </MarkdownEditorMenuButton>
  )
};

const getSelectedChunk = (
  content: string,
  selectionStart: number,
  selectionEnd: number
): { start: string; selected: string; end: string } => {
  const start = content.substring(0, selectionStart);
  const selected = content.substring(selectionStart, selectionEnd);
  const end = content.substring(selectionEnd);

  return { start, selected, end };
};

const getSelectedLines = (
  content: string,
  selectionStart: number,
  selectionEnd: number
): { start: string[]; selected: string[]; end: string[] } => {
  const { start, selected, end } = getSelectedChunk(
    content,
    selectionStart,
    selectionEnd
  );

  const startLines = start.split("\n");
  const selectedLines = selected.split("\n");
  const endLines = end.split("\n");

  const unselectedStart = startLines.pop();
  const unselectedEnd = endLines.shift();

  selectedLines[0] = unselectedStart + selectedLines[0];

  const lastSelectedLineIndex = selectedLines.length - 1;

  selectedLines[lastSelectedLineIndex] =
    selectedLines[lastSelectedLineIndex] + unselectedEnd;

  return { start: startLines, selected: selectedLines, end: endLines };
};

const defaultActions: Record<string, MarkdownEditorMenuButtonAction> = {
  bold: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );

    return {
      content: `${start}**${selected}**${end}`,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + 2
    };
  },
  italic: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );
    return {
      content: `${start}_${selected}_${end}`,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1
    };
  },
  strikethrough: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );

    return {
      content: `${start}~~${selected}~~${end}`,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + 2
    };
  },
  quote: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [...start, ...selected.map(l => "> " + l), ...end].join(
      "\n"
    );

    return {
      content: newContent,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + selected.length * 2
    };
  },
  link: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );

    return {
      content: `${start}[${selected}]()${end}`,
      selectionStart: selectionEnd + 3,
      selectionEnd: selectionEnd + 3
    };
  },
  image: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );

    return {
      content: `${start}![${selected}]()${end}`,
      selectionStart: selectionEnd + 4,
      selectionEnd: selectionEnd + 4
    };
  },
  code: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [
      ...start,
      "```",
      ...selected.map(l => "  " + l),
      "```",
      ...end
    ].join("\n");

    return {
      content: newContent,
      selectionStart: selectionStart + 6,
      selectionEnd: selectionEnd + selected.length * 2 + 4
    };
  },
  inlineCode: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedChunk(
      content,
      selectionStart,
      selectionEnd
    );

    return {
      content: `${start}\`${selected}\`${end}`,
      selectionStart: selectionStart + 1,
      selectionEnd: selectionEnd + 1
    };
  },
  title: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    selected[0] = (selected[0].startsWith("#") ? "#" : "# ") + selected[0];

    return {
      content: [...start, ...selected, ...end].join("\n"),
      selectionStart: selectionStart + (selected[0].startsWith("##") ? 1 : 2),
      selectionEnd: selectionEnd + (selected[0].startsWith("##") ? 1 : 2)
    };
  },
  unorderedList: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [...start, ...selected.map(l => "- " + l), ...end].join(
      "\n"
    );

    return {
      content: newContent,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + selected.length * 2
    };
  },
  orderedList: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [
      ...start,
      ...selected.map((l, i) => i + 1 + (". " + l)),
      ...end
    ].join("\n");

    return {
      content: newContent,
      selectionStart: selectionStart + 3,
      selectionEnd: selectionEnd + selected.length * 3
    };
  },
  taskList: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [
      ...start,
      ...selected.map(l => "- [ ] " + l),
      ...end
    ].join("\n");

    return {
      content: newContent,
      selectionStart: selectionStart + 6,
      selectionEnd: selectionEnd + selected.length * 6
    };
  },
  indentIncrease: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const newContent = [...start, ...selected.map(l => "  " + l), ...end].join(
      "\n"
    );

    return {
      content: newContent,
      selectionStart: selectionStart + 2,
      selectionEnd: selectionEnd + selected.length * 2
    };
  },
  indentDecrease: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    let noOfDeletedSpaces = 0;
    let noOfDeletedSpacesInFirstLine = 0;

    const newContent = [
      ...start,
      ...selected.map((l, i) => {
        if (l.startsWith("  ")) {
          l = l.substring(2);
          noOfDeletedSpaces += 2;
          if (i == 0) {
            noOfDeletedSpacesInFirstLine = 2;
          }
        }
        return l;
      }),
      ...end
    ].join("\n");

    return {
      content: newContent,
      selectionStart: selectionStart + noOfDeletedSpacesInFirstLine,
      selectionEnd: selectionEnd + noOfDeletedSpaces
    };
  },
  table: (name, content, selectionStart, selectionEnd) => {
    const { start, selected, end } = getSelectedLines(
      content,
      selectionStart,
      selectionEnd
    );

    const firstSelectedLine = selected.shift();

    const newContent = [
      ...start,
      firstSelectedLine,
      "| Column1 | Column2 |",
      "| -------------- | -------------- |",
      "| value 1    | value2     |",
      ...selected,
      ...end
    ].join("\n");

    return {
      content: newContent,
      selectionStart: selectionStart,
      selectionEnd: selectionStart
    };
  },
  format: (name, content) => {
    const newContent = format(content, {
      parser: "markdown",
      plugins: [markdownParser],
      arrowParens: "avoid",
      endOfLine: "lf",
      trailingComma: "none",
      tabWidth: 2
    });

    return {
      content: newContent,
      selectionStart: 0,
      selectionEnd: 0
    };
  }
};

const menuClasses = generateUtilityClasses("MuiExtendedMarkdownEditorMenu", [
  "root",
  "group",
  "divider",
  "disabled"
]);

export type MarkdownEditorMenuProps = {
  onClick: (name: string) => void;
  menu?: string[][];
  menuButtons?: Record<
    string,
    ComponentType<{
      onClick: () => void;
      disabled?: boolean;
    }>
  >;
  MenuButtonProps?: Omit<
    MarkdownEditorMenuButtonProps,
    "title" | "onClick" | "children"
  >;
  disabled?: boolean;
};

export const MarkdownEditorMenu = ({
  onClick,
  menu,
  menuButtons,
  MenuButtonProps,
  disabled
}: MarkdownEditorMenuProps) => {
  const _menu = menu || defaultMenu;
  const _menuButtons = { ...DefaultButtons, ...menuButtons };
  return (
    <Box
      className={combineClasses(
        menuClasses.root,
        disabled ? menuClasses.disabled : ""
      )}
      sx={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
    >
      {_menu.map((menuGroup, i) => (
        <Fragment key={i}>
          {i != 0 ? (
            <Divider
              className={menuClasses.divider}
              orientation="vertical"
              flexItem
              variant="middle"
            />
          ) : null}
          <ButtonGroup className={menuClasses.group}>
            {menuGroup.map((menuItem, j) => {
              const MenuItemComponent = _menuButtons[menuItem];
              const _onClick = () => {
                if (!disabled) {
                  onClick(menuItem);
                }
              };
              return (
                <MenuItemComponent
                  key={j}
                  {...MenuButtonProps}
                  onClick={_onClick}
                  disabled={disabled}
                />
              );
            })}
          </ButtonGroup>
        </Fragment>
      ))}
    </Box>
  );
};

export type MarkdownEditorViewType = "write" | "preview";

export type MarkdownEditorHeaderProps = MarkdownEditorMenuProps & {
  hideTabs: boolean;
  selectedView: MarkdownEditorViewType;
  onViewChange: (selected: MarkdownEditorViewType) => void;
  TabsProps?: Omit<TabsProps, "onChange" | "value">;
  TabProps?: Omit<TabProps, "label">;
};

const headerClasses = generateUtilityClasses(
  "MuiExtendedMarkdownEditorHeader",
  ["root", "tabsContainer", "tabs", "tab", "menu"]
);

export const MarkdownEditorHeader = ({
  hideTabs,
  selectedView,
  onViewChange,
  TabsProps,
  TabProps,
  ...menuProps
}: MarkdownEditorHeaderProps) => {
  const handleChange = (event: SyntheticEvent, newValue: number) => {
    onViewChange(newValue == 0 ? "write" : "preview");
  };
  return (
    <Grid container className={headerClasses.root}>
      {!hideTabs ? (
        <Grid className={headerClasses.tabsContainer} item flexGrow={1}>
          <Tabs
            {...TabsProps}
            className={combineClasses(headerClasses.tabs, TabsProps?.className)}
            value={selectedView == "write" ? 0 : 1}
            onChange={handleChange}
            sx={[{ minHeight: 36 }, TabsProps?.sx || {}].flat()}
          >
            <Tab
              {...TabProps}
              className={combineClasses(headerClasses.tab, TabProps?.className)}
              label="Write"
              sx={[{ minHeight: 36, p: 1 }, TabProps?.sx || {}].flat()}
            />
            <Tab
              {...TabProps}
              className={combineClasses(headerClasses.tab, TabProps?.className)}
              label="Preview"
              sx={[{ minHeight: 36, p: 1 }, TabProps?.sx || {}].flat()}
            />
          </Tabs>
        </Grid>
      ) : null}
      {hideTabs || selectedView == "write" ? (
        <Grid item className={headerClasses.menu}>
          <MarkdownEditorMenu {...menuProps} />
        </Grid>
      ) : null}
    </Grid>
  );
};

const contentClasses = generateUtilityClasses(
  "MuiExtendedMarkdownEditorContent",
  ["root", "textarea", "textareaContainer", "preview", "previewContainer"]
);

export type MarkdownEditorContentProps = TextareaAutosizeProps & {
  write: boolean;
  preview: boolean;
  PreviewProps?: Omit<
    ComponentPropsWithoutRef<typeof MarkdownPreview>,
    "children"
  >;
};

export const MarkdownEditorContent = forwardRef<
  HTMLTextAreaElement,
  MarkdownEditorContentProps
>(function MarkdownEditorContent(
  { write, preview, value, PreviewProps, ...props },
  ref
) {
  const style = {
    ...props.style,
    width: "100%",
    resize: "none",
    boxSizing: "border-box"
  } as TextareaAutosizeProps["style"];
  const stringChild = value?.toString() || "";
  return (
    <Grid container className={contentClasses.root}>
      <Grid
        className={contentClasses.textareaContainer}
        item
        xs={12}
        sx={{ display: write ? "initial" : "none" }}
      >
        <TextareaAutosize
          minRows={10}
          maxRows={20}
          {...props}
          className={combineClasses(contentClasses.textarea, props.className)}
          value={value}
          style={style}
          ref={ref}
        />
      </Grid>
      {preview ? (
        <Grid className={contentClasses.previewContainer} item xs={12}>
          <MarkdownPreview
            {...PreviewProps}
            className={combineClasses(
              contentClasses.preview,
              PreviewProps?.className
            )}
          >
            {stringChild}
          </MarkdownPreview>
        </Grid>
      ) : null}
    </Grid>
  );
});

const createChangeEvent = (
  target: HTMLTextAreaElement
): React.ChangeEvent<HTMLTextAreaElement> => {
  let event: Event;
  if (typeof InputEvent == "function") {
    event = new InputEvent("change", { bubbles: true });
  } else {
    event = document.createEvent("InputEvent");
    event.initEvent("change", true, true);
  }
  Object.defineProperty(event, "target", { writable: false, value: target });
  const syntheticEvent = createSyntheticEvent(
    event
  ) as React.ChangeEvent<HTMLTextAreaElement>;
  return syntheticEvent;
};

export type MarkdownEditorProps = TextareaAutosizeProps & {
  inlinePreview?: boolean;
  menuActions?: Record<string, MarkdownEditorMenuButtonAction>;
  HeaderProps?: Omit<
    MarkdownEditorHeaderProps,
    | "onClick"
    | "hideTabs"
    | "selectedView"
    | "onViewChange"
    | "menu"
    | "menuButtons"
    | "disabled"
  >;
  PreviewProps?: MarkdownEditorContentProps["PreviewProps"];
} & Pick<MarkdownEditorHeaderProps, "menu" | "menuButtons">;

const editorClasses = generateUtilityClasses("MuiExtendedMarkdownEditor", [
  "root",
  "header",
  "disabled",
  "contentContainer",
  "content"
]);

/**
 * RTE editor for markdown content
 *
 * can be used safely within the TextField
 *   - set `fullWidth` TextField to true
 *   - `shrink` label in TextField
 *   - inputRef points to Grid
 *
 * ```
 * <TextField
 *   InputProps={{ inputComponent: MarkdownEditor }}
 *   InputLabelProps={{ shrink: true }}
 *   fullWidth
 * />
 * ```
 *
 */
export const MarkdownEditor = forwardRef<HTMLDivElement, MarkdownEditorProps>(
  function MarkdownEditor(
    {
      menu,
      menuButtons,
      menuActions,
      inlinePreview: alwaysPreview = false,
      onBlur,
      HeaderProps,
      ...props
    },
    ref
  ) {
    const [selectedView, setSelectedView] =
      useState<MarkdownEditorViewType>("write");

    const textareaRef = createRef<HTMLTextAreaElement>();

    const isMobile = useMobile();

    const _menuActions = { ...defaultActions, ...menuActions };

    const onMenuButtonClick = (name: string) => {
      if (textareaRef.current) {
        const action = _menuActions[name];
        const { content, selectionStart, selectionEnd } = action(
          name,
          textareaRef.current.value,
          textareaRef.current.selectionStart,
          textareaRef.current.selectionEnd
        );

        textareaRef.current.value = content;
        textareaRef.current.setSelectionRange(selectionStart, selectionEnd);
        if (props.onChange) {
          const changeEvent = createChangeEvent(textareaRef.current);
          props.onChange(changeEvent);
        }
      }
    };

    const _onBlur: FocusEventHandler<
      HTMLDivElement | HTMLTextAreaElement
    > = event => {
      if (!props.disabled) {
        let propagate = true;
        let relatedTarget = event.relatedTarget;
        while (relatedTarget && relatedTarget.tagName != "BODY") {
          relatedTarget = relatedTarget?.parentElement ?? null;
          if (relatedTarget == event.currentTarget) {
            propagate = false; // don't propagate blur event , if clicked within the editor widget
            break;
          }
        }

        if (propagate) {
          if (event.target != textareaRef.current && textareaRef.current) {
            event.target = textareaRef.current;
          }
          onMenuButtonClick("format");
          if (onBlur) {
            onBlur(event as FocusEvent<HTMLTextAreaElement>);
          }
        }
      }
    };

    const _onClick: MouseEventHandler<HTMLDivElement> = event => {
      event.preventDefault();
      event.stopPropagation();
      if (!props.disabled) {
        textareaRef.current?.focus(); // keep textarea focused , when clicked within markdown widget
      }
    };

    return (
      <Grid
        container
        sx={{ p: 1 }}
        ref={ref}
        onBlur={_onBlur}
        onClick={_onClick}
        className={combineClasses(
          editorClasses.root,
          props.disabled ? editorClasses.disabled : ""
        )}
      >
        <Grid className={editorClasses.header} item xs={12}>
          <MarkdownEditorHeader
            {...HeaderProps}
            onClick={onMenuButtonClick}
            hideTabs={isMobile || alwaysPreview}
            selectedView={selectedView}
            onViewChange={setSelectedView}
            menu={menu}
            menuButtons={menuButtons}
            disabled={props.disabled}
          />
        </Grid>
        <Grid className={editorClasses.contentContainer} item xs={12}>
          <MarkdownEditorContent
            {...props}
            className={combineClasses(editorClasses.content, props.className)}
            write={isMobile || alwaysPreview || selectedView == "write"}
            preview={isMobile || alwaysPreview || selectedView == "preview"}
            ref={textareaRef}
          />
        </Grid>
      </Grid>
    );
  }
);

export {
  buttonClasses as markdownEditorMenuButtonClasses,
  menuClasses as markdownEditorMenuClasses,
  headerClasses as markdownEditorHeaderClasses,
  contentClasses as markdownEditorContentClasses,
  editorClasses as markdownEditorClasses
};
