import Image from "next/image";
import { useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, GripVertical, Image as ImageIcon, Type, List } from "lucide-react";

import { 
  portalButtonSecondaryClass,
  InputField, 
  TextAreaField 
} from "@/components/portal/PortalFields";

const availableBlocks = [
  { type: "hero", label: "Hero Banner", icon: ImageIcon },
  { type: "image", label: "Image Block", icon: ImageIcon },
  { type: "text", label: "Text Block", icon: Type },
  { type: "features", label: "Feature List", icon: List },
];

export default function PageBuilder({ service, onSave, onCancel }) {
  const [blocks, setBlocks] = useState(() => {
    try {
      if (service.pageContent) {
        const parsed = JSON.parse(service.pageContent);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore
    }
    
    // Default fallback blocks if nothing is set
    return [
      {
        id: crypto.randomUUID(),
        type: "hero",
        content: { 
          title: service.title || "Hero Title", 
          description: service.description || "Hero description",
          imageUrl: service.imageUrl || ""
        }
      }
    ];
  });

  const [saving, setSaving] = useState(false);

  function addBlock(type) {
    const newBlock = { id: crypto.randomUUID(), type, content: {} };
    if (type === "hero") newBlock.content = { title: "New Hero section", description: "Hero description here", imageUrl: "" };
    if (type === "image") newBlock.content = { imageUrl: "", caption: "Image Description" };
    if (type === "text") newBlock.content = { heading: "Section Heading", text: "Paragraph text here." };
    if (type === "features") newBlock.content = { title: "Features", points: ["First feature point"] };
    
    setBlocks([...blocks, newBlock]);
  }

  function removeBlock(id) {
    setBlocks(blocks.filter(b => b.id !== id));
  }

  function updateBlock(id, newContent) {
    setBlocks(blocks.map(b => b.id === id ? { ...b, content: newContent } : b));
  }

  async function handleSave() {
    setSaving(true);
    await onSave(service, JSON.stringify(blocks));
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0d1017]">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-[color:var(--border)] bg-[#11151d] px-6">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="text-[#8795ad] transition hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-headline font-bold text-white uppercase tracking-widest text-sm">Design Detail Page</h1>
            <p className="text-[10px] text-[#6e7d96] font-bold uppercase tracking-widest">Editing: {service.title}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onCancel} className={portalButtonSecondaryClass}>Discard</button>
          <button 
            onClick={handleSave} 
            disabled={saving}
            className="inline-flex h-9 items-center justify-center gap-2 rounded-full bg-[#2051db] px-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#2860f0] disabled:opacity-50"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? "Deploying..." : "Apply Changes"}
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left Sidebar - Canvas */}
        <div className="flex-1 overflow-y-auto bg-[#090b0f] p-8">
          <div className="mx-auto max-w-4xl space-y-6 pb-24">
            
            {blocks.map((block, index) => (
              <div key={block.id} className="group relative rounded-[1.4rem] border border-[color:var(--border)] bg-[#10141d] p-6 shadow-[color:var(--shadow-card)] transition focus-within:border-[#2051db] focus-within:ring-4 focus-within:ring-[#2051db]/5">
                <div className="absolute -left-3 top-7 cursor-grab rounded-md bg-[#191d26] p-1.5 text-[#54627d] opacity-0 shadow-sm transition group-hover:opacity-100 active:cursor-grabbing">
                  <GripVertical className="h-4 w-4" />
                </div>
                
                <div className="mb-5 flex items-center justify-between border-b border-white/[0.04] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2051db]/10 text-[#2051db]">
                      {block.type === 'hero' && <ImageIcon className="h-4 w-4" />}
                      {block.type === 'image' && <ImageIcon className="h-4 w-4" />}
                      {block.type === 'text' && <Type className="h-4 w-4" />}
                      {block.type === 'features' && <List className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/80">{block.type} Module</h3>
                      <p className="text-[9px] font-bold text-[#6e7d96]">Protocol Node {index + 1}</p>
                    </div>
                  </div>
                  <button onClick={() => removeBlock(block.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64718c] transition hover:bg-red-500/10 hover:text-red-400">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Editor Content Area */}
                <div className="rounded-xl bg-[#0a0d12] p-5">
                  {block.type === "hero" && (
                    <div className="grid gap-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <InputField 
                          label="Title override" 
                          value={block.content.title || ""} 
                          onChange={(v) => updateBlock(block.id, { ...block.content, title: v })} 
                        />
                        <InputField 
                          label="Background Image URL" 
                          value={block.content.imageUrl || ""} 
                          onChange={(v) => updateBlock(block.id, { ...block.content, imageUrl: v })} 
                          placeholder="https://..."
                        />
                      </div>
                      <TextAreaField 
                        label="Hero messaging" 
                        value={block.content.description || ""} 
                        onChange={(v) => updateBlock(block.id, { ...block.content, description: v })} 
                      />
                    </div>
                  )}

                  {block.type === "image" && (
                    <div className="grid gap-5 md:grid-cols-2">
                      <div className="space-y-4">
                        <InputField 
                          label="Image source URL" 
                          value={block.content.imageUrl || ""} 
                          onChange={(v) => updateBlock(block.id, { ...block.content, imageUrl: v })} 
                          placeholder="https://..."
                        />
                        <InputField 
                          label="Status caption" 
                          value={block.content.caption || ""} 
                          onChange={(v) => updateBlock(block.id, { ...block.content, caption: v })} 
                        />
                      </div>
                      <div className="flex min-h-[120px] items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0d1017]">
                        {block.content.imageUrl ? (
                          <Image
                            src={block.content.imageUrl}
                            alt="Preview"
                            width={240}
                            height={100}
                            className="max-h-[100px] rounded-lg object-contain shadow-2xl"
                            unoptimized
                          />
                        ) : (
                          <div className="text-center">
                            <ImageIcon className="mx-auto h-6 w-6 text-white/10" />
                            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-[#4a5873]">Visual Preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {block.type === "text" && (
                    <div className="space-y-5">
                      <InputField 
                        label="Structural Heading" 
                        value={block.content.heading || ""} 
                        onChange={(v) => updateBlock(block.id, { ...block.content, heading: v })} 
                      />
                      <TextAreaField 
                        label="Body copy content" 
                        value={block.content.text || ""} 
                        onChange={(v) => updateBlock(block.id, { ...block.content, text: v })} 
                      />
                    </div>
                  )}

                  {block.type === "features" && (
                    <div className="space-y-5">
                      <InputField 
                        label="Capabilities Title" 
                        value={block.content.title || ""} 
                        onChange={(v) => updateBlock(block.id, { ...block.content, title: v })} 
                      />
                      <div className="rounded-xl border border-white/[0.03] bg-[#0d1117] p-5">
                        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#697996]">Component nodes</p>
                        <div className="space-y-2.5">
                          {(block.content.points || []).map((pt, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/[0.03] text-[9px] font-bold text-[#4a5873]">
                                {i + 1}
                              </div>
                              <input 
                                value={pt} 
                                onChange={(e) => {
                                  const newPts = [...block.content.points];
                                  newPts[i] = e.target.value;
                                  updateBlock(block.id, { ...block.content, points: newPts });
                                }}
                                className="flex-1 rounded-xl border border-white/[0.05] bg-[#080a0f] px-4 py-2.5 text-sm text-white focus:border-[#2051db] outline-none transition" 
                                placeholder="Define capability..."
                              />
                              <button 
                                onClick={() => {
                                  const newPts = block.content.points.filter((_, idx) => idx !== i);
                                  updateBlock(block.id, { ...block.content, points: newPts });
                                }}
                                className="text-[#54627d] hover:text-red-400 p-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => updateBlock(block.id, { ...block.content, points: [...(block.content.points || []), ""] })}
                          className="mt-5 inline-flex h-9 items-center gap-2 rounded-xl bg-white/[0.03] px-4 text-[10px] font-black uppercase tracking-widest text-[#2051db] transition hover:bg-white/[0.06]"
                        >
                          <Plus className="h-3 w-3" />
                          Add Node
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {blocks.length === 0 && (
              <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-[color:var(--border)] text-[#5c6a85]">
                <p>No blocks added yet. Use the sidebar to add layout blocks.</p>
              </div>
            )}
            
          </div>
        </div>

        {/* Right Sidebar - Toolbox */}
        <div className="w-80 shrink-0 border-l border-[color:var(--border)] bg-[#11151d] p-6">
          <h2 className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-[#8192af]">Add Modules</h2>
          
          <div className="grid gap-3">
            {availableBlocks.map(b => (
              <button
                key={b.type}
                onClick={() => addBlock(b.type)}
                className="flex items-center gap-3 rounded-xl border border-[color:var(--border)] bg-[#151a24] p-4 text-left transition hover:border-[#386df2] hover:bg-[#1a2130]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[rgba(255,255,255,0.03)] text-[#7b8cb0]">
                  <b.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{b.label}</p>
                </div>
                <Plus className="ml-auto h-4 w-4 text-[#4a5873]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
