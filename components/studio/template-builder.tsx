"use client";

import { useState } from "react";
import { updateTemplate, publishTemplate } from "@/server/actions/templates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from "@/components/studio/sortable-item";
import { TiptapEditor } from "@/components/studio/tiptap-editor";
import { Save, Globe, Plus, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface BuilderLesson {
  id: string;
  title: string;
  contentMd: string;
}

interface BuilderModule {
  id: string;
  title: string;
  description: string;
  lessons: BuilderLesson[];
}

export function TemplateBuilder({ initialData }: { initialData: any }) { // eslint-disable-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState({
    title: initialData.title || "",
    goal: initialData.goal || "",
    level: initialData.level || "INTERMEDIATE",
  });
  
  const [modules, setModules] = useState<BuilderModule[]>(
    Array.isArray(initialData.structure?.modules) ? initialData.structure.modules : []
  );

  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setModules((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addModule = () => {
    setModules([...modules, { id: crypto.randomUUID(), title: "New Module", description: "", lessons: [] }]);
  };

  const sync = async (showToast = true) => {
    setSaving(true);
    const res = await updateTemplate(initialData.id, { ...data, structure: { modules } });
    if (res.success && showToast) toast.success("Draft saved gracefully.");
    else if (!res.success && showToast) toast.error("Failed to commit draft.");
    setSaving(false);
  };

  const togglePublish = async () => {
    setPublishing(true);
    await sync(false); // save latest
    const res = await publishTemplate(initialData.id, !initialData.isPublished);
    if (res.success) toast.success(`Template ${!initialData.isPublished ? 'Published! Live on marketplace.' : 'Unpublished.'}`);
    else toast.error("Failed to align publishing mechanisms.");
    setPublishing(false);
    if (res.success) window.location.reload(); // Refresh to catch status update server-side securely
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 py-4 bg-background/95 backdrop-blur z-20 border-b border-border/40">
        <div className="flex gap-4 items-center">
           <Button variant="ghost" size="icon" asChild className="rounded-full h-8 w-8">
             <Link href="/studio"><ArrowLeft className="h-4 w-4" /></Link>
           </Button>
           <div>
             <h1 className="text-xl font-bold line-clamp-1">{data.title || "Untitled Draft"}</h1>
             <span className="text-xs text-muted-foreground uppercase">{initialData.isPublished ? "Published" : "Draft Mode"}</span>
           </div>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => sync()} disabled={saving} className="shadow-sm">
            <Save className="w-4 h-4 mr-2" /> {saving ? "Auto-saving..." : "Save Draft"}
          </Button>
          <Button onClick={togglePublish} disabled={publishing} variant={initialData.isPublished ? "destructive" : "default"} className="shadow-sm">
            <Globe className="w-4 h-4 mr-2" /> {publishing ? "Toggling..." : (initialData.isPublished ? "Unpublish" : "Publish to Marketplace")}
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="space-y-4 md:col-span-1 border-r border-border/40 pr-6">
           <h2 className="text-lg font-semibold border-b pb-2">Meta Settings</h2>
           <Input value={data.title} onChange={(e) => setData({...data, title: e.target.value})} placeholder="Template Title" className="font-semibold" />
           <Textarea value={data.goal} onChange={(e) => setData({...data, goal: e.target.value})} placeholder="Curriculum Goal & Syllabus details..." className="min-h-[120px]" />
           <select 
              value={data.level} 
              onChange={(e) => setData({...data, level: e.target.value})}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="BEGINNER">Beginner Segment</option>
              <option value="INTERMEDIATE">Intermediate Track</option>
              <option value="ADVANCED">Advanced Mastery</option>
            </select>
        </div>
        
        <div className="md:col-span-2 space-y-6">
           <div className="flex items-center justify-between border-b pb-2">
             <h2 className="text-xl font-semibold">Curriculum Architect</h2>
             <Button onClick={addModule} size="sm" variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
               <Plus className="w-4 h-4 mr-1"/> Add Module
             </Button>
           </div>
           
           <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={modules.map(m => m.id)} strategy={verticalListSortingStrategy}>
                 <div className="space-y-4">
                   {modules.map((module, mIndex) => (
                      <SortableItem key={module.id} id={module.id} className="rounded-md border border-border/60 bg-card overflow-hidden shadow-sm">
                         <div className="flex flex-col w-full">
                            <div className="p-3 bg-muted/20 border-b border-border/40 flex items-center justify-between gap-4">
                               <Input 
                                 value={module.title} 
                                 onChange={(e) => setModules(prev => prev.map(p => p.id === module.id ? {...p, title: e.target.value} : p))} 
                                 className="h-8 font-semibold w-full max-w-[250px] bg-transparent border-transparent hover:border-input focus:border-input"
                               />
                               <Button size="icon" variant="ghost" className="text-destructive h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive" onClick={() => setModules(prev => prev.filter(p => p.id !== module.id))}>
                                  <Trash2 className="w-4 h-4" />
                               </Button>
                            </div>
                            <div className="p-4 space-y-4 shadow-inner bg-background/50">
                              {module.lessons.map((lesson: BuilderLesson, lIndex: number) => (
                                 <Card key={lesson.id} className="border-border/60 overflow-hidden">
                                     <div className="bg-muted/10 p-2 border-b flex justify-between">
                                        <Input 
                                          value={lesson.title} 
                                          onChange={(e) => setModules(prev => {
                                             const newM = [...prev];
                                             newM[mIndex].lessons[lIndex].title = e.target.value;
                                             return newM;
                                          })}
                                          className="h-8 border-none bg-transparent shadow-none w-2/3 text-sm font-medium"
                                          placeholder="Lesson Title"
                                        />
                                        <Button size="sm" variant="ghost" className="text-destructive h-7 px-2 hover:bg-destructive/10" onClick={() => {
                                           setModules(prev => {
                                             const newM = [...prev];
                                             newM[mIndex].lessons = newM[mIndex].lessons.filter((_, i: number) => i !== lIndex);
                                             return newM;
                                           })
                                        }}>Remove</Button>
                                     </div>
                                     <TiptapEditor 
                                        content={lesson.contentMd} 
                                        onChange={(html) => {
                                           setModules(prev => {
                                             const newM = [...prev];
                                             newM[mIndex].lessons[lIndex].contentMd = html;
                                             return newM;
                                           })
                                        }} 
                                     />
                                 </Card>
                               ))}
                               <Button size="sm" variant="outline" className="w-full border-dashed" onClick={() => {
                                  setModules(prev => {
                                     const newM = [...prev];
                                     newM[mIndex].lessons.push({ id: crypto.randomUUID(), title: "New Resource", contentMd: "<p>Start writing here...</p>" });
                                     return newM;
                                  })
                               }}>
                                  <Plus className="w-4 h-4 mr-2" /> Attach Lesson
                               </Button>
                            </div>
                         </div>
                      </SortableItem>
                   ))}
                 </div>
              </SortableContext>
           </DndContext>
        </div>
      </div>
    </div>
  );
}
