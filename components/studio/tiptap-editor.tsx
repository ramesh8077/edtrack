"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function TiptapEditor({ content, onChange }: { content: string, onChange: (val: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4 text-foreground bg-card/50',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML()) // Can also be getMarkdown via extensions, but HTML is fine to map out via rehype-sanitize
    },
  })

  return (
    <div className="border border-border/50 rounded-md overflow-hidden flex flex-col">
       {/* Menu bar */}
       {editor && (
         <div className="flex items-center gap-1 border-b border-border/40 p-2 bg-muted/20">
           <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBold().run()} className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-muted' : ''}`}>
             <Bold className="w-4 h-4" />
           </Button>
           <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleItalic().run()} className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-muted' : ''}`}>
             <Italic className="w-4 h-4" />
           </Button>
           <div className="w-[1px] h-4 bg-border mx-1" />
           <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-muted' : ''}`}>
             <List className="w-4 h-4" />
           </Button>
           <Button type="button" variant="ghost" size="sm" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-muted' : ''}`}>
             <ListOrdered className="w-4 h-4" />
           </Button>
         </div>
       )}
       {/* Editor */}
       <EditorContent editor={editor} className="flex-1 bg-background overflow-y-auto max-h-[400px]" />
    </div>
  )
}
