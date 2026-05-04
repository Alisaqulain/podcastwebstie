"use client";

import { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link as LinkIcon,
  ImageIcon,
  Quote,
} from "lucide-react";

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export function RichTextEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false }),
      Placeholder.configure({
        placeholder: "Headings, paragraphs, quotes, images, links…",
      }),
    ],
    content: value || "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[260px] max-w-none rounded-xl border border-brand-gold/15 bg-white/90 px-4 py-3 text-sm text-brand-dark outline-none focus:ring-2 focus:ring-brand-gold/30 prose-blog",
      },
    },
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = value || "";
    if (next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="min-h-[260px] animate-pulse rounded-xl bg-brand-cream/80" />
    );
  }

  function setLink() {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const btn =
    "rounded-lg border border-brand-gold/20 bg-white/80 p-2 text-brand-dark hover:bg-brand-gold/10 disabled:opacity-40";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1 rounded-xl border border-brand-gold/15 bg-white/60 p-2">
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Ordered list"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={setLink}
          aria-label="Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => {
            const url = window.prompt("Image URL (https://)", "https://");
            if (!url?.trim()) return;
            editor.chain().focus().setImage({ src: url.trim() }).run();
          }}
          aria-label="Image"
        >
          <ImageIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={btn}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Quote"
        >
          <Quote className="h-4 w-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
