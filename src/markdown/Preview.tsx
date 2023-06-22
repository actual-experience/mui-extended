import {
  Alert,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme,
  Link as MuiLink,
  Box,
  IconButton,
  Tooltip,
  generateUtilityClasses
} from "@mui/material";
import { ComponentPropsWithoutRef, createContext, useContext } from "react";
import ReactMarkdown, { Components, Options } from "react-markdown";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import typescript from "refractor/lang/typescript";
import { darkThemeStyle } from "./styles/dark";
import { lightThemeStyle } from "./styles/light";
import Link from "next/link";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { combineClasses } from "../utils";

SyntaxHighlighter.registerLanguage("typescript", typescript);

const Span = styled("span")``;

export type CodeComponentContextType = {
  enableCopy?: boolean;
  maxHeight?: string;
  /** set to false to disable default styles, to allow global stylesheets instead */
  style?: any;
};
const CodeComponentContext = createContext<CodeComponentContextType>({});

export const CodeComponentContextProvider = CodeComponentContext.Provider;

const SyntaxHighLightedCodeComponent: Components["code"] = ({
  inline,
  className,
  children,
  ...props
}) => {
  const theme = useTheme();
  const codeComponentContext = useContext(CodeComponentContext);
  const style =
    theme.palette.mode == "light" ? lightThemeStyle : darkThemeStyle;
  const match = /language-(\w+)/.exec(className || "");
  return !inline ? (
    <Box
      position="relative"
      sx={{
        "& > div": {
          maxHeight: codeComponentContext.maxHeight,
          overflow: "auto"
        }
      }}
    >
      <SyntaxHighlighter
        style={codeComponentContext.style ?? style}
        language={match?.[1] ?? "javascript"}
        PreTag="div"
        wrapLongLines
        {...props}
      >
        {children}
      </SyntaxHighlighter>
      {codeComponentContext.enableCopy ? (
        <Tooltip title="Copy Contents">
          <IconButton
            sx={{ position: "absolute", top: 8, right: 16 }}
            onClick={() => {
              navigator.clipboard.writeText(children as string);
            }}
          >
            <ContentCopyIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  ) : (
    <Span
      sx={{
        paddingLeft: 1,
        paddingRight: 1,
        color: "primary.main"
      }}
    >
      <code className={className} {...props}>
        {children}
      </code>
    </Span>
  );
};

const H1: Components["h1"] = props => (
  <Typography
    {...props}
    variant="h4"
    variantMapping={{ h4: "h1" }}
    sx={{ marginTop: 2 }}
  />
);

const H2: Components["h2"] = props => (
  <Typography
    {...props}
    variant="h5"
    variantMapping={{ h5: "h2" }}
    sx={{ marginTop: 2 }}
  />
);

const H3: Components["h3"] = props => (
  <Typography
    {...props}
    variant="h6"
    variantMapping={{ h6: "h3" }}
    sx={{ marginTop: 1 }}
  />
);

const H4: Components["h4"] = props => (
  <Typography
    {...props}
    variant="subtitle1"
    variantMapping={{ subtitle1: "h4" }}
    sx={{ marginTop: 0.5, fontWeight: "bold" }}
  />
);

const H5: Components["h5"] = props => (
  <Typography
    {...props}
    variant="subtitle2"
    variantMapping={{ subtitle2: "h5" }}
    sx={{ marginTop: 0.5, fontWeight: "bold" }}
  />
);
const H6: Components["h6"] = props => (
  <Typography
    {...props}
    variant="subtitle2"
    variantMapping={{ subtitle2: "h6" }}
  />
);
const P: Components["p"] = props => (
  <Typography {...props} variant="body1" py={1} />
);
const Blockquote: Components["blockquote"] = ({ children, ...props }) => (
  <blockquote {...props} style={{ margin: "16px 0 16px 0" }}>
    <Alert icon={false} severity="info" color="info" sx={{ my: 1, py: 0 }}>
      {children}
    </Alert>
  </blockquote>
);
const TableComponent: Components["table"] = props => (
  <TableContainer component={Paper}>
    <Table {...props} size="small" />
  </TableContainer>
);
const Img: Components["img"] = props => {
  const propsFromTitle: ComponentPropsWithoutRef<"img"> = {};
  if (props.title) {
    const [title, attrs] = props.title.split("?", 2);
    propsFromTitle["title"] = title;
    Object.assign(
      propsFromTitle,
      Object.fromEntries(new URLSearchParams(attrs).entries())
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img {...props} {...propsFromTitle} alt={props.alt} />;
};

const A: Components["a"] = props => {
  return (
    <Link href={props.href ?? "#"}>
      <MuiLink {...props} />
    </Link>
  );
};

export const markdownPreviewClasses = generateUtilityClasses(
  "MuiExtendedMarkdownPreview",
  ["root"]
);

type PluggableList = NonNullable<Options["remarkPlugins"]>;

export const defaultComponents = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  p: P,
  blockquote: Blockquote,
  table: TableComponent,
  img: Img,
  thead: TableHead,
  tbody: TableBody,
  th: TableCell as unknown as Components["th"],
  tr: TableRow,
  td: TableCell as unknown as Components["td"],
  code: SyntaxHighLightedCodeComponent,
  a: A
};

export const MarkdownPreview = ({
  children,
  className,
  components,
  ReactMarkdownProps,
  includeGfm = true
}: {
  children: string;
  className?: string;
  components?: Options["components"];
  ReactMarkdownProps?: Omit<Options, "components" | "className" | "children">;
  includeGfm?: boolean;
}) => {
  const _components: Options["components"] = {
    ...defaultComponents,
    ...components
  };

  return (
    <ReactMarkdown
      {...ReactMarkdownProps}
      className={combineClasses(markdownPreviewClasses.root, className)}
      components={_components}
      remarkPlugins={([] as PluggableList).concat(
        includeGfm ? [remarkGfm] : [],
        ReactMarkdownProps?.remarkPlugins || []
      )}
    >
      {children}
    </ReactMarkdown>
  );
};
