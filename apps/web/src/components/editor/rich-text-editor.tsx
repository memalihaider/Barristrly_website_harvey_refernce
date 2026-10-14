"use client";

import { useEffect, type ReactNode } from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import { CharacterCount, Placeholder } from "@tiptap/extensions";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Columns3,
  Heading2,
  Heading3,
  Heading4,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  RemoveFormatting,
  Rows3,
  SquareCode,
  Strikethrough,
  Table2,
  Trash2,
  Underline as UnderlineIcon,
  Undo2,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

function ToolButton({
  label,
  active,
  disabled,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={active}
      disabled={disabled}
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors disabled:opacity-30 ${
        active ? "bg-primary text-on-primary" : "text-ink/70 hover:bg-black/5 hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="mx-1 h-6 w-px bg-black/10" aria-hidden />;

function Toolbar({ editor }: { editor: Editor }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive("bold"),
      italic: e.isActive("italic"),
      underline: e.isActive("underline"),
      strike: e.isActive("strike"),
      highlight: e.isActive("highlight"),
      code: e.isActive("code"),
      paragraph: e.isActive("paragraph"),
      h2: e.isActive("heading", { level: 2 }),
      h3: e.isActive("heading", { level: 3 }),
      h4: e.isActive("heading", { level: 4 }),
      bullet: e.isActive("bulletList"),
      ordered: e.isActive("orderedList"),
      quote: e.isActive("blockquote"),
      codeBlock: e.isActive("codeBlock"),
      link: e.isActive("link"),
      table: e.isActive("table"),
      left: e.isActive({ textAlign: "left" }),
      center: e.isActive({ textAlign: "center" }),
      right: e.isActive({ textAlign: "right" }),
      justify: e.isActive({ textAlign: "justify" }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  });
  const c = () => editor.chain().focus();

  function setLink() {
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL (https://…, mailto:…)", prev ?? "https://");
    if (url === null) return;
    if (url.trim() === "") {
      c().extendMarkRange("link").unsetLink().run();
      return;
    }
    c().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }

  function addImage() {
    const url = window.prompt("Image URL (https://…)");
    if (!url?.trim()) return;
    const alt = window.prompt("Alt text (describes the image)") ?? "";
    c().setImage({ src: url.trim(), alt }).run();
  }

  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-black/10 bg-[#faf9f6] px-2 py-1.5">
      <ToolButton label="Undo" disabled={!s.canUndo} onClick={() => c().undo().run()}><Undo2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Redo" disabled={!s.canRedo} onClick={() => c().redo().run()}><Redo2 className="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Paragraph" active={s.paragraph} onClick={() => c().setParagraph().run()}><Pilcrow className="h-4 w-4" /></ToolButton>
      <ToolButton label="Heading 2" active={s.h2} onClick={() => c().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Heading 3" active={s.h3} onClick={() => c().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Heading 4" active={s.h4} onClick={() => c().toggleHeading({ level: 4 }).run()}><Heading4 className="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Bold" active={s.bold} onClick={() => c().toggleBold().run()}><Bold className="h-4 w-4" /></ToolButton>
      <ToolButton label="Italic" active={s.italic} onClick={() => c().toggleItalic().run()}><Italic className="h-4 w-4" /></ToolButton>
      <ToolButton label="Underline" active={s.underline} onClick={() => c().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></ToolButton>
      <ToolButton label="Strikethrough" active={s.strike} onClick={() => c().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></ToolButton>
      <ToolButton label="Highlight" active={s.highlight} onClick={() => c().toggleHighlight().run()}><Highlighter className="h-4 w-4" /></ToolButton>
      <ToolButton label="Inline code" active={s.code} onClick={() => c().toggleCode().run()}><Code className="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Bullet list" active={s.bullet} onClick={() => c().toggleBulletList().run()}><List className="h-4 w-4" /></ToolButton>
      <ToolButton label="Numbered list" active={s.ordered} onClick={() => c().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></ToolButton>
      <ToolButton label="Quote" active={s.quote} onClick={() => c().toggleBlockquote().run()}><Quote className="h-4 w-4" /></ToolButton>
      <ToolButton label="Code block" active={s.codeBlock} onClick={() => c().toggleCodeBlock().run()}><SquareCode className="h-4 w-4" /></ToolButton>
      <ToolButton label="Divider line" onClick={() => c().setHorizontalRule().run()}><Minus className="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Align left" active={s.left} onClick={() => c().setTextAlign("left").run()}><AlignLeft className="h-4 w-4" /></ToolButton>
      <ToolButton label="Align center" active={s.center} onClick={() => c().setTextAlign("center").run()}><AlignCenter className="h-4 w-4" /></ToolButton>
      <ToolButton label="Align right" active={s.right} onClick={() => c().setTextAlign("right").run()}><AlignRight className="h-4 w-4" /></ToolButton>
      <ToolButton label="Justify" active={s.justify} onClick={() => c().setTextAlign("justify").run()}><AlignJustify className="h-4 w-4" /></ToolButton>
      <Divider />
      <ToolButton label="Add or edit link" active={s.link} onClick={setLink}><Link2 className="h-4 w-4" /></ToolButton>
      <ToolButton label="Remove link" disabled={!s.link} onClick={() => c().unsetLink().run()}><Link2Off className="h-4 w-4" /></ToolButton>
      <ToolButton label="Insert image" onClick={addImage}><ImagePlus className="h-4 w-4" /></ToolButton>
      <ToolButton
        label="Insert table"
        onClick={() => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <Table2 className="h-4 w-4" />
      </ToolButton>
      {s.table ? (
        <>
          <ToolButton label="Add row below" onClick={() => c().addRowAfter().run()}><Rows3 className="h-4 w-4" /></ToolButton>
          <ToolButton label="Add column right" onClick={() => c().addColumnAfter().run()}><Columns3 className="h-4 w-4" /></ToolButton>
          <ToolButton label="Delete row" onClick={() => c().deleteRow().run()}><span className="text-[10px] font-bold">−R</span></ToolButton>
          <ToolButton label="Delete column" onClick={() => c().deleteColumn().run()}><span className="text-[10px] font-bold">−C</span></ToolButton>
          <ToolButton label="Delete table" onClick={() => c().deleteTable().run()}><Trash2 className="h-4 w-4" /></ToolButton>
        </>
      ) : null}
      <Divider />
      <ToolButton
        label="Clear formatting"
        onClick={() => c().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting className="h-4 w-4" />
      </ToolButton>
    </div>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: { openOnClick: false, autolink: true, defaultProtocol: "https" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Image.configure({ inline: false }),
      Highlight,
      TableKit.configure({ table: { resizable: true } }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      CharacterCount,
    ],
    content: value,
    editorProps: {
      attributes: { class: "rich-content px-6 py-5 md:px-10 md:py-8" },
    },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  });

  // Load new content when the source changes (e.g. after fetch/reset).
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  const wordCount = useEditorState({
    editor,
    selector: ({ editor: e }) => e?.storage.characterCount.words() ?? 0,
  });
  const words = wordCount ?? 0;

  return (
    <div className="rich-editor overflow-hidden rounded-2xl border border-black/10 bg-white">
      {editor ? <Toolbar editor={editor} /> : <div className="h-11 border-b border-black/10 bg-[#faf9f6]" />}
      <EditorContent editor={editor} />
      <div className="flex justify-end border-t border-black/5 px-4 py-2 text-[11px] text-gray-500">
        {words} words · ~{Math.max(1, Math.round(words / 200))} min read
      </div>
    </div>
  );
}
