import React, { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import { Extension } from "@tiptap/core";

/* 🔹 Custom Font Size Extension */
const FontSize = Extension.create({
  name: "fontSize",

  addGlobalAttributes() {
    return [
      {
        types: ["textStyle"],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => {
              const parent = element.parentElement?.tagName?.toLowerCase();
              if (["h1", "h2", "h3", "ul", "ol", "li"].includes(parent)) {
                return null;
              }
              return element.style.fontSize;
            },
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      setFontSize:
        (size) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: size }).run(),

      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).run(),
    };
  },
});

export default function TiptapEditor({ content = "", onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      FontSize,
      Underline,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph","listItem"],
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
    ],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content || "", false);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-md bg-white shadow-sm">
      {/* 🔹 TOOLBAR */}
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-100">
        {/* Headings */}
        <button
          type="button"
          className="btn"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetFontSize()
              .toggleHeading({ level: 1 })
              .run()
          }
        >
          H1
        </button>

        <button
          type="button"
          className="btn"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetFontSize()
              .toggleHeading({ level: 2 })
              .run()
          }
        >
          H2
        </button>

        <button
          type="button"
          className="btn"
          onClick={() =>
            editor
              .chain()
              .focus()
              .unsetFontSize()
              .toggleHeading({ level: 3 })
              .run()
          }
        >
          H3
        </button>

        {/* Text Styles */}
        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          U
        </button>

        {/* Alignment */}
        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          ⬅
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          ⬆
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          ➡
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
        >
          ☰
        </button>

        {/* Lists */}
        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </button>

        {/* Font Size */}
        <select
          className="border px-2"
          defaultValue=""
          onChange={(e) =>
            editor.chain().focus().setFontSize(e.target.value).run()
          }
        >
          <option value="" disabled>
            Font
          </option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="22px">22</option>
          <option value="26px">26</option>
        </select>

        {/* Color */}
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />

        {/* Link */}
        <button
          type="button"
          className="btn"
          onClick={() => {
            const url = prompt("Enter URL");
            if (!url) return;
            editor
              .chain()
              .focus()
              .extendMarkRange("link")
              .setLink({ href: url })
              .run();
          }}
        >
          🔗
        </button>

        {/* Image */}
        <button
          type="button"
          className="btn"
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
        >
          🖼️
        </button>

        {/* Undo / Redo */}
        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().undo().run()}
        >
          ↩
        </button>

        <button
          type="button"
          className="btn"
          onClick={() => editor.chain().focus().redo().run()}
        >
          ↪
        </button>
      </div>

      {/* 🔹 EDITOR */}
      {/* changes */}
      <EditorContent
        editor={editor}
        className="editor-content min-h-[300px] p-4 focus:outline-none"
      />
    </div>
  );
}