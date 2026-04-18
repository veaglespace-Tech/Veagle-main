"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import PageBuilder from "@/components/portal/PageBuilder";
import { Save } from "lucide-react";

import {
  Card,
  DashboardIntro,
  FileField,
  GridList,
  InputField,
  ItemCard,
  ListEditor,
  MetricTile,
  portalButtonPrimaryClass,
  portalButtonSecondaryClass,
  portalSelectClass,
  portalSubcardClass,
  portalTableClass,
  portalTableShellClass,
  SelectField,
  StringListEditor,
  StatusBadge,
  TextAreaField,
} from "@/components/portal/PortalFields";
import { backendAssetUrl } from "@/lib/backend";
import { cn, formatDate } from "@/lib/utils";
import { useSaveServiceMutation } from "@/store/api/services.api";
import { getErrorMessage } from "@/store/api/baseApi";

export function OverviewPanel({ metrics, leads, visibleTasks }) {
  const newLeadCount = leads.filter((lead) => lead.status === "new").length;
  const openTaskCount = visibleTasks.filter((task) => task.status !== "done").length;

  return (
    <div className="space-y-4">
      <DashboardIntro
        title="Command center"
        description="Public content, entities, leads and assignments are all visible here."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.2rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] p-4 text-white shadow-[color:var(--shadow-accent)] sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Systems Status
          </p>
          <h2 className="mt-2.5 font-headline text-2xl font-black tracking-tighter text-white">
            Maintain deployment integrity across all channels.
          </h2>
          <p className="mt-2.5 max-w-2xl text-[11px] leading-5 text-blue-50/90">
            Current operational picture for website updates, lead qualification and admin tasking.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              New leads
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {newLeadCount}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Contact requests waiting for follow-up.
            </p>
          </div>
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              Open allocations
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {openTaskCount}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Website or content actions in progress.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-3.5 md:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => (
          <MetricTile key={metric.label} label={metric.label} value={metric.value} />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
        <Card title="Latest leads">
          <div className="space-y-2.5">
            {leads.slice(0, 4).map((lead) => (
              <div key={lead.id} className={portalSubcardClass}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{lead.name}</p>
                    <p className="break-all text-[11px] text-[color:var(--text-muted)]">{lead.email}</p>
                  </div>
                  <StatusBadge value={lead.status} />
                </div>
                <p className="mt-2 line-clamp-1 text-[11px] leading-5 text-[color:var(--text-secondary)]">{lead.message}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card title="My allocations">
          <div className="space-y-2.5">
            {visibleTasks.slice(0, 4).map((task) => (
              <div key={task.id} className={portalSubcardClass}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{task.title}</p>
                    <p className="break-words text-[11px] text-[color:var(--text-muted)]">
                      {task.section} / {task.assignedTo || "Unassigned"}
                    </p>
                  </div>
                  <StatusBadge value={task.status} />
                </div>
                <p className="mt-2 line-clamp-1 text-[11px] leading-5 text-[color:var(--text-secondary)]">
                  {task.summary || "No summary added yet."}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export function ContentPanel({
  content,
  busyAction,
  updateContentField,
  updateContentList,
  addContentListItem,
  removeContentListItem,
  updateNestedContentField,
  updateNestedContentList,
  addNestedContentListItem,
  removeNestedContentListItem,
  updateNestedStringListItem,
  addNestedStringListItem,
  removeNestedStringListItem,
  saveContent,
}) {
  const contentBlockCount =
    (content.stats?.length || 0) +
    (content.differentiators?.length || 0) +
    (content.process?.length || 0) +
    (content.about?.milestones?.length || 0) +
    (content.clients?.logos?.length || 0) +
    (content.about?.pillars?.length || 0) +
    (content.clients?.segments?.length || 0) +
    (content.career?.highlights?.length || 0) +
    (content.portfolio?.projects?.length || 0);

  const proofBlockCount =
    (content.testimonials?.length || 0) +
    (content.faq?.length || 0) +
    (content.clients?.proof?.length || 0) +
    (content.clients?.marquee?.length || 0);

  return (
    <div className="space-y-5">
      <DashboardIntro
        title="Public content manager"
        description="Unified CMS for homepage, about, clients, career, services, products and portfolio content."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] p-5 text-white shadow-[color:var(--shadow-accent)] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Deployment Hub
          </p>
          <h2 className="mt-3 font-headline text-2xl font-black tracking-tighter text-white">
            Centralized content architecture.
          </h2>
          <p className="mt-2.5 max-w-2xl text-[11px] leading-6 text-blue-50/80">
            Control messaging, client proof and public-facing content from one secure administrative layer.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              Content blocks
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {contentBlockCount}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Managed frontend modules.
            </p>
          </div>
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              Proof blocks
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {proofBlockCount}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Testimonials and trust assets.
            </p>
          </div>
        </div>
      </div>

      <Card title="Hero section">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Label" value={content.hero.label} onChange={(value) => updateContentField("hero", "label", value)} />
          <InputField label="Highlight" value={content.hero.highlight} onChange={(value) => updateContentField("hero", "highlight", value)} />
          <InputField label="Primary CTA label" value={content.hero.primaryCtaLabel} onChange={(value) => updateContentField("hero", "primaryCtaLabel", value)} />
          <InputField label="Primary CTA link" value={content.hero.primaryCtaHref} onChange={(value) => updateContentField("hero", "primaryCtaHref", value)} />
          <InputField label="Secondary CTA label" value={content.hero.secondaryCtaLabel} onChange={(value) => updateContentField("hero", "secondaryCtaLabel", value)} />
          <InputField label="Secondary CTA link" value={content.hero.secondaryCtaHref} onChange={(value) => updateContentField("hero", "secondaryCtaHref", value)} />
        </div>
        <div className="mt-4">
          <InputField label="Title" value={content.hero.title} onChange={(value) => updateContentField("hero", "title", value)} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Description" value={content.hero.description} onChange={(value) => updateContentField("hero", "description", value)} />
        </div>
      </Card>

      <ListEditor
        title="Stats"
        items={content.stats}
        fields={[{ key: "value", label: "Value" }, { key: "label", label: "Label" }]}
        onAdd={() => addContentListItem("stats")}
        onRemove={(index) => removeContentListItem("stats", index)}
        onChange={(index, key, value) => updateContentList("stats", index, key, value)}
      />
      <ListEditor
        title="Differentiators"
        items={content.differentiators}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        onAdd={() => addContentListItem("differentiators")}
        onRemove={(index) => removeContentListItem("differentiators", index)}
        onChange={(index, key, value) => updateContentList("differentiators", index, key, value)}
      />
      <ListEditor
        title="Process"
        items={content.process}
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        onAdd={() => addContentListItem("process")}
        onRemove={(index) => removeContentListItem("process", index)}
        onChange={(index, key, value) => updateContentList("process", index, key, value)}
      />
      <ListEditor
        title="Testimonials"
        items={content.testimonials}
        fields={[
          { key: "quote", label: "Quote", multiline: true },
          { key: "name", label: "Name" },
          { key: "role", label: "Role" },
        ]}
        onAdd={() => addContentListItem("testimonials")}
        onRemove={(index) => removeContentListItem("testimonials", index)}
        onChange={(index, key, value) => updateContentList("testimonials", index, key, value)}
      />
      <ListEditor
        title="FAQ"
        items={content.faq}
        fields={[
          { key: "question", label: "Question" },
          { key: "answer", label: "Answer", multiline: true },
        ]}
        onAdd={() => addContentListItem("faq")}
        onRemove={(index) => removeContentListItem("faq", index)}
        onChange={(index, key, value) => updateContentList("faq", index, key, value)}
      />

      <Card title="Final CTA and contact">
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="CTA title" value={content.finalCta.title} onChange={(value) => updateContentField("finalCta", "title", value)} />
          <InputField label="Primary CTA label" value={content.finalCta.primaryLabel} onChange={(value) => updateContentField("finalCta", "primaryLabel", value)} />
          <InputField label="Primary CTA link" value={content.finalCta.primaryHref} onChange={(value) => updateContentField("finalCta", "primaryHref", value)} />
          <InputField label="Secondary CTA label" value={content.finalCta.secondaryLabel} onChange={(value) => updateContentField("finalCta", "secondaryLabel", value)} />
          <InputField label="Secondary CTA link" value={content.finalCta.secondaryHref} onChange={(value) => updateContentField("finalCta", "secondaryHref", value)} />
          <InputField label="Contact title" value={content.contact.title} onChange={(value) => updateContentField("contact", "title", value)} />
          <InputField label="Contact email" value={content.contact.email} onChange={(value) => updateContentField("contact", "email", value)} />
          <InputField label="Contact phone" value={content.contact.phone} onChange={(value) => updateContentField("contact", "phone", value)} />
        </div>
        <div className="mt-4">
          <TextAreaField label="CTA description" value={content.finalCta.description} onChange={(value) => updateContentField("finalCta", "description", value)} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Contact description" value={content.contact.description} onChange={(value) => updateContentField("contact", "description", value)} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Contact address" value={content.contact.address} onChange={(value) => updateContentField("contact", "address", value)} />
        </div>
      </Card>

      <NestedTextSectionCard
        title="About page overview"
        content={content}
        sectionKey="about"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "story", label: "Story", multiline: true },
          { key: "background", label: "Background", multiline: true },
          { key: "ctaTitle", label: "CTA title" },
          { key: "ctaDescription", label: "CTA description", multiline: true },
        ]}
      />
      <NestedObjectListSection
        title="About milestones"
        items={content.about.milestones}
        sectionKey="about"
        listKey="milestones"
        fields={[
          { key: "label", label: "Label" },
          { key: "value", label: "Value" },
          { key: "detail", label: "Detail", multiline: true },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />
      <NestedObjectListSection
        title="About pillars"
        items={content.about.pillars}
        sectionKey="about"
        listKey="pillars"
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />
      <NestedStringListSection
        title="About working model"
        items={content.about.workingModel}
        sectionKey="about"
        listKey="workingModel"
        label="Point"
        updateNestedStringListItem={updateNestedStringListItem}
        addNestedStringListItem={addNestedStringListItem}
        removeNestedStringListItem={removeNestedStringListItem}
      />

      <NestedTextSectionCard
        title="Clients page overview"
        content={content}
        sectionKey="clients"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "ctaTitle", label: "CTA title" },
          { key: "ctaDescription", label: "CTA description", multiline: true },
        ]}
      />
      <NestedObjectListSection
        title="Client logos and links"
        items={content.clients.logos}
        sectionKey="clients"
        listKey="logos"
        fields={[
          { key: "name", label: "Client name" },
          { key: "href", label: "Link URL" },
          { key: "image", label: "Logo image URL" },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />
      <NestedStringListSection
        title="Client marquee"
        items={content.clients.marquee}
        sectionKey="clients"
        listKey="marquee"
        label="Client / sector"
        updateNestedStringListItem={updateNestedStringListItem}
        addNestedStringListItem={addNestedStringListItem}
        removeNestedStringListItem={removeNestedStringListItem}
      />
      <NestedObjectListSection
        title="Client segments"
        items={content.clients.segments}
        sectionKey="clients"
        listKey="segments"
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />
      <NestedObjectListSection
        title="Client proof cards"
        items={content.clients.proof}
        sectionKey="clients"
        listKey="proof"
        fields={[
          { key: "label", label: "Label" },
          { key: "value", label: "Value" },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />

      <NestedTextSectionCard
        title="Career page overview"
        content={content}
        sectionKey="career"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "applyTitle", label: "Apply section title" },
          { key: "applyDescription", label: "Apply section description", multiline: true },
        ]}
      />
      <NestedObjectListSection
        title="Career highlights"
        items={content.career.highlights}
        sectionKey="career"
        listKey="highlights"
        fields={[
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />
      <NestedStringListSection
        title="Career reasons"
        items={content.career.reasons}
        sectionKey="career"
        listKey="reasons"
        label="Reason"
        updateNestedStringListItem={updateNestedStringListItem}
        addNestedStringListItem={addNestedStringListItem}
        removeNestedStringListItem={removeNestedStringListItem}
      />

      <NestedTextSectionCard
        title="Services page overview"
        content={content}
        sectionKey="servicesPage"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "ctaTitle", label: "CTA title" },
          { key: "ctaDescription", label: "CTA description", multiline: true },
        ]}
      />
      <NestedStringListSection
        title="Services page highlights"
        items={content.servicesPage.highlights}
        sectionKey="servicesPage"
        listKey="highlights"
        label="Highlight"
        updateNestedStringListItem={updateNestedStringListItem}
        addNestedStringListItem={addNestedStringListItem}
        removeNestedStringListItem={removeNestedStringListItem}
      />

      <NestedTextSectionCard
        title="Products page overview"
        content={content}
        sectionKey="productsPage"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "ctaTitle", label: "CTA title" },
          { key: "ctaDescription", label: "CTA description", multiline: true },
        ]}
      />
      <NestedStringListSection
        title="Products page highlights"
        items={content.productsPage.highlights}
        sectionKey="productsPage"
        listKey="highlights"
        label="Highlight"
        updateNestedStringListItem={updateNestedStringListItem}
        addNestedStringListItem={addNestedStringListItem}
        removeNestedStringListItem={removeNestedStringListItem}
      />

      <NestedTextSectionCard
        title="Portfolio page overview"
        content={content}
        sectionKey="portfolio"
        updateNestedContentField={updateNestedContentField}
        fields={[
          { key: "eyebrow", label: "Eyebrow" },
          { key: "title", label: "Title" },
          { key: "description", label: "Description", multiline: true },
          { key: "ctaTitle", label: "CTA title" },
          { key: "ctaDescription", label: "CTA description", multiline: true },
        ]}
      />
      <NestedObjectListSection
        title="Portfolio projects"
        items={content.portfolio.projects}
        sectionKey="portfolio"
        listKey="projects"
        fields={[
          { key: "title", label: "Title" },
          { key: "category", label: "Category" },
          { key: "subtitle", label: "Subtitle" },
          { key: "result", label: "Result" },
          { key: "imageUrl", label: "Image URL" },
          { key: "tags", label: "Tags (comma separated)" },
          { key: "summary", label: "Summary", multiline: true },
        ]}
        updateNestedContentList={updateNestedContentList}
        addNestedContentListItem={addNestedContentListItem}
        removeNestedContentListItem={removeNestedContentListItem}
      />

      <button type="button" className={`${portalButtonPrimaryClass} w-full sm:w-auto`} onClick={saveContent} disabled={busyAction === "content"}>
        <Save className="h-4 w-4" />
        {busyAction === "content" ? "Saving..." : "Save content"}
      </button>
    </div>
  );
}

function NestedTextSectionCard({
  title,
  content,
  sectionKey,
  fields,
  updateNestedContentField,
}) {
  return (
    <Card title={title}>
      <div className="grid gap-4 md:grid-cols-2">
        {fields.map((field) =>
          field.multiline ? (
            <div key={field.key} className="md:col-span-2">
              <TextAreaField
                label={field.label}
                value={content[sectionKey][field.key]}
                onChange={(value) => updateNestedContentField(sectionKey, field.key, value)}
              />
            </div>
          ) : (
            <InputField
              key={field.key}
              label={field.label}
              value={content[sectionKey][field.key]}
              onChange={(value) => updateNestedContentField(sectionKey, field.key, value)}
            />
          )
        )}
      </div>
    </Card>
  );
}

function NestedObjectListSection({
  title,
  items,
  sectionKey,
  listKey,
  fields,
  updateNestedContentList,
  addNestedContentListItem,
  removeNestedContentListItem,
}) {
  return (
    <ListEditor
      title={title}
      items={items}
      fields={fields}
      onAdd={() => addNestedContentListItem(sectionKey, listKey)}
      onRemove={(index) => removeNestedContentListItem(sectionKey, listKey, index)}
      onChange={(index, key, value) =>
        updateNestedContentList(sectionKey, listKey, index, key, value)
      }
    />
  );
}

function NestedStringListSection({
  title,
  items,
  sectionKey,
  listKey,
  label,
  updateNestedStringListItem,
  addNestedStringListItem,
  removeNestedStringListItem,
}) {
  return (
    <StringListEditor
      title={title}
      items={items}
      label={label}
      onAdd={() => addNestedStringListItem(sectionKey, listKey)}
      onRemove={(index) => removeNestedStringListItem(sectionKey, listKey, index)}
      onChange={(index, value) =>
        updateNestedStringListItem(sectionKey, listKey, index, value)
      }
    />
  );
}

export function ServicesPanel({
  session,
  services,
  serviceForm,
  setServiceForm,
  saveService,
  beginServiceEdit,
  deleteService,
  busyAction,
}) {
  const [activeBuilderService, setActiveBuilderService] = useState(null);
  const [saveBuiltService] = useSaveServiceMutation();

  const previewUrl = useMemo(
    () => (serviceForm.file ? URL.createObjectURL(serviceForm.file) : ""),
    [serviceForm.file]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleBuilderSave = async (serviceItem, pageContentJson) => {
    try {
      await saveBuiltService({
        token: session.token,
        id: serviceItem.id,
        title: serviceItem.title,
        description: serviceItem.description,
        detailTitle: serviceItem.detailTitle,
        detailDescription: serviceItem.detailDescription,
        pageContent: pageContentJson,
        features: serviceItem.features || [],
      }).unwrap();
      setActiveBuilderService(null);
    } catch (error) {
      console.error("Save failed", getErrorMessage(error, "Unable to save service page."));
    }
  };

  if (activeBuilderService) {
    return (
      <PageBuilder 
        service={activeBuilderService} 
        onCancel={() => setActiveBuilderService(null)} 
        onSave={handleBuilderSave}
      />
    );
  }

  const detailCopy =
    serviceForm.detailDescription?.trim() ||
    serviceForm.description ||
    "Add detail-page copy from the dashboard so the opened page shows your actual service message.";

  return (
    <div className="space-y-6">
      <DashboardIntro
        title="Manage services"
        description="Public cards for service delivery. Use the Builder for custom detail layouts."
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[1.4rem] border border-[color:var(--border)] bg-[linear-gradient(135deg,var(--accent),var(--accent-strong))] p-5 text-white shadow-[color:var(--shadow-accent)] sm:p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            Delivery workspace
          </p>
          <h2 className="mt-3 font-headline text-2xl font-black tracking-tighter text-white">
            Architect your public service presence.
          </h2>
          <p className="mt-2.5 max-w-2xl text-[11px] leading-6 text-blue-50/80">
            Define entry points and deep layout architectures for each service module.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              Live services
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {services.length}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Public service modules.
            </p>
          </div>
          <div className={portalSubcardClass}>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
              Detail Status
            </p>
            <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
              {detailCopy.trim() ? "Active" : "Null"}
            </p>
            <p className="mt-1.5 text-[11px] leading-5 text-[color:var(--text-secondary)]">
              Primary content node.
            </p>
          </div>
        </div>
      </div>

      <Card title={serviceForm.id ? "Edit service" : "Add new service"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField
            label="Title"
            value={serviceForm.title}
            onChange={(value) => setServiceForm((current) => ({ ...current, title: value }))}
          />
          <FileField
            label="Service image"
            onChange={(file) => setServiceForm((current) => ({ ...current, file }))}
          />
        </div>
        <div className="mt-4">
          <TextAreaField
            label="Description"
            value={serviceForm.description}
            onChange={(value) => setServiceForm((current) => ({ ...current, description: value }))}
          />
        </div>
        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--text-muted)]">
                Bullet points
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--text-secondary)]">
                Service highlights for cards and detail page.
              </p>
            </div>
            <button
              type="button"
              className={cn(portalButtonSecondaryClass, "min-h-0 py-1.5 text-[10px]")}
              onClick={() =>
                setServiceForm((current) => ({
                  ...current,
                  features: [...(current.features || []), ""],
                }))
              }
            >
              Add point
            </button>
          </div>

          <div className="space-y-2.5">
            {(serviceForm.features || []).map((feature, index) => (
              <div key={`service-feature-${index}`} className={portalSubcardClass}>
                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <InputField
                      label={`Point ${index + 1}`}
                      value={feature}
                      onChange={(value) =>
                        setServiceForm((current) => ({
                          ...current,
                          features: (current.features || []).map((item, itemIndex) =>
                            itemIndex === index ? value : item
                          ),
                        }))
                      }
                    />
                  </div>
                  <button
                    type="button"
                    className={cn(portalButtonSecondaryClass, "min-h-0 py-2 text-[10px] text-rose-400 hover:bg-rose-500/10")}
                    onClick={() =>
                      setServiceForm((current) => {
                        const nextFeatures = (current.features || []).filter(
                          (_, itemIndex) => itemIndex !== index
                        );

                        return {
                          ...current,
                          features: nextFeatures.length ? nextFeatures : [""],
                        };
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            className={portalButtonPrimaryClass}
            onClick={saveService}
            disabled={busyAction === "service"}
          >
            {busyAction === "service" ? "Saving..." : "Save service"}
          </button>
          <button
            type="button"
            className={portalButtonSecondaryClass}
            onClick={() =>
              setServiceForm({
                id: "",
                title: "",
                description: "",
                detailTitle: "",
                detailDescription: "",
                features: [""],
                file: null,
                imageUrl: "",
              })
            }
          >
            Reset
          </button>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {services.map((item, index) => {
          const cardImage = backendAssetUrl(item.imageUrl);

          return (
            <article
              key={item.id}
              className="overflow-hidden rounded-[1.2rem] border border-[color:var(--border)] bg-[linear-gradient(180deg,#171b24,#1d222d)] shadow-[color:var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-[color:var(--border-strong)]"
            >
              <div className="p-2.5">
                <div className="relative overflow-hidden rounded-[1rem] border border-[rgba(93,126,194,0.18)] bg-[#101622] p-2.5">
                  <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-[rgba(43,98,237,0.22)] blur-[1px]" />
                  <div className="relative rounded-[0.8rem] border border-[rgba(93,126,194,0.14)] bg-[#0d1420] p-2.5">
                    <div className="relative flex min-h-[110px] items-center justify-center overflow-hidden rounded-[0.7rem] border border-[rgba(93,126,194,0.1)] bg-[linear-gradient(180deg,#0f1724,#111b29)]">
                      {cardImage ? (
                        <Image
                          alt={item.title}
                          className="object-cover transition duration-700 hover:scale-105"
                          fill
                          sizes="(max-width: 1280px) 100vw, 33vw"
                          src={cardImage}
                          unoptimized
                        />
                      ) : (
                        <div className="h-14 w-18 rounded-[0.6rem] border border-[rgba(93,126,194,0.15)] bg-[rgba(255,255,255,0.02)]" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 px-3.5 pb-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[9px] font-bold uppercase tracking-[0.22em] text-[#8ba8ff]">
                    ID 0{index + 1}
                  </span>
                  <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-200">
                    Live
                  </span>
                </div>

                <div>
                  <h3 className="font-headline text-base font-black tracking-tight text-white leading-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[12px] leading-6 text-[#d6e0f3]">
                    {item.description}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(item.features || []).slice(0, 3).map((feature) => (
                    <span
                      key={`${item.id}-${feature.id || feature.name}`}
                      className="rounded-full border border-[color:var(--border)] bg-[rgba(255,255,255,0.03)] px-2.5 py-0.5 text-[10px] font-semibold text-[color:var(--text-secondary)]"
                    >
                      {feature.name}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    className={`${portalButtonSecondaryClass} bg-[#2051db] text-white border-transparent hover:bg-[#2860f0] min-h-0 py-1.5 text-[10px]`}
                    onClick={() => setActiveBuilderService(item)}
                  >
                    Builder
                  </button>
                  <button
                    type="button"
                    className={cn(portalButtonSecondaryClass, "min-h-0 py-1.5 text-[10px]")}
                    onClick={() => beginServiceEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={cn(portalButtonSecondaryClass, "min-h-0 py-1.5 text-[10px] text-rose-400")}
                    onClick={() => deleteService(item.id)}
                    disabled={busyAction === `service-delete-${item.id}`}
                  >
                    {busyAction === `service-delete-${item.id}` ? "..." : "Delete"}
                  </button>
                </div>

                <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  Review module
                  <span className="text-sm">→</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {!services.length ? (
        <div className={portalSubcardClass}>
          <p className="font-headline text-xl font-black tracking-tight text-[color:var(--text-primary)]">
            No services added yet
          </p>
          <p className="mt-2 text-sm leading-7 text-[color:var(--text-secondary)]">
            Add your first service and it will start showing as a compact visual card on the public website.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export function ProductsPanel({
  products,
  categories,
  productForm,
  setProductForm,
  saveProduct,
  beginProductEdit,
  toggleProductStatus,
  deleteProduct,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Product catalog" description="Manage entities and categories exported to the public showcase." />

      <Card title={productForm.id ? "Edit product" : "New product"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Title" value={productForm.title} onChange={(value) => setProductForm((current) => ({ ...current, title: value }))} />
          <SelectField label="Category" value={productForm.categoryId} options={categories.map((item) => ({ label: item.name, value: String(item.id) }))} onChange={(value) => setProductForm((current) => ({ ...current, categoryId: value }))} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Description" value={productForm.description} onChange={(value) => setProductForm((current) => ({ ...current, description: value }))} />
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FileField label="Visual asset" onChange={(file) => setProductForm((current) => ({ ...current, file }))} />
          <SelectField label="Deployment status" value={String(productForm.isActive)} options={[{ label: "Active", value: "true" }, { label: "Inactive", value: "false" }]} onChange={(value) => setProductForm((current) => ({ ...current, isActive: value === "true" }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={saveProduct} disabled={busyAction === "product"}>
            {busyAction === "product" ? "Saving..." : "Save product"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setProductForm({ id: "", title: "", description: "", categoryId: "", isActive: true, file: null })}>
            Reset
          </button>
        </div>
      </Card>

      <GridList
        items={products}
        renderItem={(item) => (
          <ItemCard
            title={item.title}
            imageUrl={backendAssetUrl(item.imageUrl)}
            subtitle={item.categoryName}
            description={item.description}
            tags={[item.isActive ? "Active" : "Inactive"]}
            extraActionLabel={item.isActive ? "Deactivate" : "Activate"}
            onExtraAction={() => toggleProductStatus(item)}
            onEdit={() => beginProductEdit(item)}
            onDelete={() => deleteProduct(item.id)}
            busyDelete={busyAction === `product-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function CategoriesPanel({
  categories,
  categoryForm,
  setCategoryForm,
  saveCategory,
  beginCategoryEdit,
  deleteCategory,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Taxonomy control" description="Manage grouping logic for the product showcase." />

      <Card title={categoryForm.id ? "Edit category" : "New category"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Name" value={categoryForm.name} onChange={(value) => setCategoryForm((current) => ({ ...current, name: value }))} />
          <TextAreaField label="Context" value={categoryForm.description} onChange={(value) => setCategoryForm((current) => ({ ...current, description: value }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={saveCategory} disabled={busyAction === "category"}>
            {busyAction === "category" ? "Saving..." : "Save category"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setCategoryForm({ id: "", name: "", description: "" })}>
            Reset
          </button>
        </div>
      </Card>

      <GridList
        items={categories}
        renderItem={(item) => (
          <ItemCard
            title={item.name}
            description={item.description}
            onEdit={() => beginCategoryEdit(item)}
            onDelete={() => deleteCategory(item.id)}
            busyDelete={busyAction === `category-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function JobsPanel({ jobs, jobForm, setJobForm, saveJob, beginJobEdit, deleteJob, busyAction }) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Talent acquisition" description="Maintain recruitment pipeline openings." />

      <Card title={jobForm.id ? "Edit post" : "New post"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Job title" value={jobForm.title} onChange={(value) => setJobForm((current) => ({ ...current, title: value }))} />
          <InputField label="Location" value={jobForm.location} onChange={(value) => setJobForm((current) => ({ ...current, location: value }))} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Description" value={jobForm.description} onChange={(value) => setJobForm((current) => ({ ...current, description: value }))} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Primary skills" value={jobForm.skills} onChange={(value) => setJobForm((current) => ({ ...current, skills: value }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={saveJob} disabled={busyAction === "job"}>
            {busyAction === "job" ? "Saving..." : "Save post"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setJobForm({ id: "", title: "", description: "", location: "", skills: "" })}>
            Reset
          </button>
        </div>
      </Card>

      <GridList
        items={jobs}
        renderItem={(item) => (
          <ItemCard
            title={item.title}
            subtitle={`${item.location} / ${formatDate(item.createdAt)}`}
            description={item.description}
            tags={item.skills ? [item.skills] : []}
            onEdit={() => beginJobEdit(item)}
            onDelete={() => deleteJob(item.id)}
            busyDelete={busyAction === `job-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function LeadsPanel({ leads, busyAction, updateLeadStatus }) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Capture inbox" description="Contact-form leads qualifying pipeline." />

      <Card title="Operational leads">
        <div className="space-y-3.5 md:hidden">
          {leads.map((lead) => (
            <div key={lead.id} className={portalSubcardClass}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{lead.name}</p>
                  <p className="break-all text-[11px] text-[color:var(--text-muted)]">{lead.email}</p>
                </div>
                <StatusBadge value={lead.status} />
              </div>

              <div className="mt-3 text-[12px] text-[color:var(--text-secondary)]">
                <p>{lead.serviceInterest || "General enquiry"}</p>
                <p className="mt-1 text-[10px] text-[color:var(--text-muted)]">{formatDate(lead.createdAt)}</p>
              </div>

              <p className="mt-3 text-[12px] leading-6 text-[color:var(--text-secondary)]">{lead.message} </p>

              <div className="mt-4">
                <select
                  className={portalSelectClass}
                  value={lead.status}
                  onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                  disabled={busyAction === `lead-status-${lead.id}`}
                >
                  <option value="new">New</option>
                  <option value="qualified">Qualified</option>
                  <option value="contacted">Contacted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className={`${portalTableShellClass} hidden md:block`}>
          <table className={portalTableClass}>
            <thead>
              <tr>
                <th>Lead</th>
                <th>Context</th>
                <th>Requirement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{lead.name}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">{lead.email}</p>
                  </td>
                  <td>
                    <p className="text-[12px] text-[color:var(--text-secondary)]">{lead.serviceInterest || "General enquiry"}</p>
                    <p className="text-[10px] text-[color:var(--text-muted)]">{formatDate(lead.createdAt)}</p>
                  </td>
                  <td className="max-w-md text-[12px] leading-6 text-[color:var(--text-secondary)]">{lead.message}</td>
                  <td>
                    <select
                      className={portalSelectClass}
                      value={lead.status}
                      onChange={(event) => updateLeadStatus(lead.id, event.target.value)}
                      disabled={busyAction === `lead-status-${lead.id}`}
                    >
                      <option value="new">New</option>
                      <option value="qualified">Qualified</option>
                      <option value="contacted">Contacted</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function TasksPanel({
  sessionRole,
  users,
  visibleTasks,
  taskForm,
  setTaskForm,
  saveTask,
  beginTaskEdit,
  updateTaskStatus,
  deleteTaskEntry,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Admin allocations" description="Superadmin assignment flow and tracking." />

      {sessionRole === "SADMIN" ? (
        <Card title={taskForm.id ? "Update allocation" : "New allocation"}>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Task title" value={taskForm.title} onChange={(value) => setTaskForm((current) => ({ ...current, title: value }))} />
            <InputField label="Section" value={taskForm.section} onChange={(value) => setTaskForm((current) => ({ ...current, section: value }))} />
            <SelectField label="Priority" value={taskForm.priority} options={[{ label: "Low", value: "low" }, { label: "Medium", value: "medium" }, { label: "High", value: "high" }]} onChange={(value) => setTaskForm((current) => ({ ...current, priority: value }))} />
            <SelectField label="Assign to" value={taskForm.assignedTo} options={[{ label: "Unassigned", value: "" }, ...users.filter((user) => user.role === "ADMIN").map((user) => ({ label: `${user.username} (${user.email})`, value: user.email }))]} onChange={(value) => setTaskForm((current) => ({ ...current, assignedTo: value }))} />
          </div>
          <div className="mt-4">
            <TextAreaField label="Summary" value={taskForm.summary} onChange={(value) => setTaskForm((current) => ({ ...current, summary: value }))} />
          </div>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="button" className={portalButtonPrimaryClass} onClick={saveTask} disabled={busyAction === "task"}>
              {busyAction === "task" ? "Saving..." : "Save task"}
            </button>
            <button type="button" className={portalButtonSecondaryClass} onClick={() => setTaskForm({ id: "", title: "", section: "Homepage", priority: "medium", assignedTo: "", summary: "" })}>
              Reset
            </button>
          </div>
        </Card>
      ) : null}

      <GridList
        items={visibleTasks}
        renderItem={(item) => (
          <ItemCard
            title={item.title}
            subtitle={`${item.section} / ${item.assignedTo || "Unassigned"}`}
            description={item.summary}
            tags={[item.priority, item.status]}
            extraActionLabel="Update status"
            onExtraAction={() =>
              updateTaskStatus(
                item.id,
                item.status === "done"
                  ? "todo"
                  : item.status === "todo"
                    ? "in-progress"
                    : "done"
              )
            }
            onEdit={sessionRole === "SADMIN" ? () => beginTaskEdit(item) : null}
            onDelete={sessionRole === "SADMIN" ? () => deleteTaskEntry(item.id) : null}
            busyDelete={busyAction === `task-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function TeamPanel({
  users,
  userForm,
  setUserForm,
  saveUser,
  beginUserEdit,
  toggleUserStatus,
  deleteUser,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Access control" description="Manage administrative privileges and user status." />

      <Card title={userForm.id ? "Edit user" : "New user"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Username" value={userForm.username} onChange={(value) => setUserForm((current) => ({ ...current, username: value }))} />
          <InputField label="Email" value={userForm.email} onChange={(value) => setUserForm((current) => ({ ...current, email: value }))} />
          <InputField label="Contact" value={userForm.contact} onChange={(value) => setUserForm((current) => ({ ...current, contact: value }))} />
          <SelectField label="Role" value={userForm.role} options={[{ label: "Admin", value: "ADMIN" }, { label: "User", value: "USER" }]} onChange={(value) => setUserForm((current) => ({ ...current, role: value }))} />
        </div>
        <div className="mt-4">
          <InputField label={userForm.id ? "Password override" : "Password"} type="password" value={userForm.password} onChange={(value) => setUserForm((current) => ({ ...current, password: value }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={saveUser} disabled={busyAction === "user"}>
            {busyAction === "user" ? "Saving..." : "Save user"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setUserForm({ id: "", username: "", email: "", contact: "", password: "", role: "ADMIN" })}>
            Reset
          </button>
        </div>
      </Card>

      <Card title="Team roster">
        <div className="space-y-3.5 md:hidden">
          {users.map((user) => (
            <div key={user.id} className={portalSubcardClass}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{user.username}</p>
                  <p className="break-all text-[11px] text-[color:var(--text-muted)]">{user.email}</p>
                </div>
                <StatusBadge value={user.status || "active"} />
              </div>
              <p className="mt-2 text-[11px] text-[color:var(--text-secondary)]">{user.role}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" className={`${portalButtonSecondaryClass} py-1.5 text-[10px] w-full sm:w-auto`} onClick={() => beginUserEdit(user)}>
                  Edit
                </button>
                <button type="button" className={`${portalButtonSecondaryClass} py-1.5 text-[10px] w-full sm:w-auto`} onClick={() => toggleUserStatus(user.id)} disabled={busyAction === `user-status-${user.id}`}>
                  Status
                </button>
                <button type="button" className={`${portalButtonSecondaryClass} py-1.5 text-[10px] w-full sm:w-auto text-rose-400`} onClick={() => deleteUser(user.id)} disabled={busyAction === `user-delete-${user.id}`}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={`${portalTableShellClass} hidden md:block`}>
          <table className={portalTableClass}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{user.username}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">{user.email}</p>
                  </td>
                  <td className="text-[12px]">{user.role}</td>
                  <td>
                    <StatusBadge value={user.status || "active"} />
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-1.5">
                      <button type="button" className={`${portalButtonSecondaryClass} py-1 text-[10px]`} onClick={() => beginUserEdit(user)}>
                        Edit
                      </button>
                      <button type="button" className={`${portalButtonSecondaryClass} py-1 text-[10px]`} onClick={() => toggleUserStatus(user.id)} disabled={busyAction === `user-status-${user.id}`}>
                        Status
                      </button>
                      <button type="button" className={`${portalButtonSecondaryClass} py-1 text-[10px] text-rose-400`} onClick={() => deleteUser(user.id)} disabled={busyAction === `user-delete-${user.id}`}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

export function ClientsPanel({
  clients,
  clientForm,
  setClientForm,
  saveClient,
  beginClientEdit,
  deleteClient,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Trust management" description="Control client logos and portfolio references." />

      <Card title={clientForm.id ? "Update client" : "New client"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Client name" value={clientForm.name} onChange={(value) => setClientForm((current) => ({ ...current, name: value }))} />
          <InputField label="Website URL" value={clientForm.websiteUrl} onChange={(value) => setClientForm((current) => ({ ...current, websiteUrl: value }))} />
          <InputField label="Order" value={clientForm.displayOrder} onChange={(value) => setClientForm((current) => ({ ...current, displayOrder: value.replace(/\D/g, "") }))} />
          <FileField label="Asset logo" onChange={(file) => setClientForm((current) => ({ ...current, file }))} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Description" value={clientForm.description} onChange={(value) => setClientForm((current) => ({ ...current, description: value }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={saveClient} disabled={busyAction === "client"}>
            {busyAction === "client" ? "Saving..." : "Save client"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setClientForm({ id: "", name: "", websiteUrl: "", description: "", displayOrder: "", file: null })}>
            Reset
          </button>
        </div>
      </Card>

      <GridList
        items={clients}
        renderItem={(item) => (
          <ItemCard
            title={item.name}
            subtitle={item.websiteUrl || "External"}
            description={item.description}
            tags={item.logoUrl ? ["Asset active"] : []}
            onEdit={() => beginClientEdit(item)}
            onDelete={() => deleteClient(item.id)}
            busyDelete={busyAction === `client-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function PortfolioPanel({
  portfolio,
  portfolioForm,
  setPortfolioForm,
  savePortfolio,
  beginPortfolioEdit,
  deletePortfolio,
  busyAction,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Project showcase" description="Publish technical work samples and GitHub repositories." />

      <Card title={portfolioForm.id ? "Update project" : "New project"}>
        <div className="grid gap-4 md:grid-cols-2">
          <InputField label="Title" value={portfolioForm.title} onChange={(value) => setPortfolioForm((current) => ({ ...current, title: value }))} />
          <InputField label="Deployment URL" value={portfolioForm.projectUrl} onChange={(value) => setPortfolioForm((current) => ({ ...current, projectUrl: value }))} />
          <InputField label="Repository URL" value={portfolioForm.githubUrl} onChange={(value) => setPortfolioForm((current) => ({ ...current, githubUrl: value }))} />
          <FileField label="Visual asset" onChange={(file) => setPortfolioForm((current) => ({ ...current, file }))} />
        </div>
        <div className="mt-4">
          <TextAreaField label="Context" value={portfolioForm.description} onChange={(value) => setPortfolioForm((current) => ({ ...current, description: value }))} />
        </div>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button type="button" className={portalButtonPrimaryClass} onClick={savePortfolio} disabled={busyAction === "portfolio"}>
            {busyAction === "portfolio" ? "Saving..." : "Save project"}
          </button>
          <button type="button" className={portalButtonSecondaryClass} onClick={() => setPortfolioForm({ id: "", title: "", description: "", projectUrl: "", githubUrl: "", file: null })}>
            Reset
          </button>
        </div>
      </Card>

      <GridList
        items={portfolio}
        renderItem={(item) => (
          <ItemCard
            title={item.title}
            imageUrl={backendAssetUrl(item.imageUrl)}
            subtitle={item.projectUrl || item.githubUrl || "No target"}
            description={item.description}
            tags={[
              ...(item.projectUrl ? ["Live"] : []),
              ...(item.githubUrl ? ["Repo"] : []),
            ]}
            onEdit={() => beginPortfolioEdit(item)}
            onDelete={() => deletePortfolio(item.id)}
            busyDelete={busyAction === `portfolio-delete-${item.id}`}
          />
        )}
      />
    </div>
  );
}

export function ApplicationsPanel({
  applications,
  busyAction,
  updateApplicationStatus,
}) {
  return (
    <div className="space-y-5">
      <DashboardIntro title="Recruitment tracking" description="Manage job candidate applications and status." />

      <Card title="Candidate pipeline">
        <div className="space-y-3.5 md:hidden">
          {applications.map((application) => (
            <div key={application.id} className={portalSubcardClass}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{application.name}</p>
                  <p className="break-all text-[11px] text-[color:var(--text-muted)]">{application.email}</p>
                </div>
                <StatusBadge value={application.status} />
              </div>

              <div className="mt-3 space-y-1 text-[12px] text-[color:var(--text-secondary)]">
                <p>{application.jobTitle || "General application"}</p>
                <p className="text-[10px] text-[color:var(--text-muted)]">{formatDate(application.createdAt)}</p>
              </div>

              {application.resumeUrl ? (
                <div className="mt-4">
                  <a
                    href={backendAssetUrl(application.resumeUrl) || application.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[12px] font-bold text-[color:var(--accent)] hover:underline"
                  >
                    Review Resume
                  </a>
                </div>
              ) : null}

              <div className="mt-4">
                <select
                  className={portalSelectClass}
                  value={application.status}
                  onChange={(event) => updateApplicationStatus(application.id, event.target.value)}
                  disabled={busyAction === `application-status-${application.id}`}
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className={`${portalTableShellClass} hidden md:block`}>
          <table className={portalTableClass}>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Target Post</th>
                <th>Asset</th>
                <th>Protocol</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application.id}>
                  <td>
                    <p className="text-[13px] font-bold text-[color:var(--text-primary)]">{application.name}</p>
                    <p className="text-[11px] text-[color:var(--text-muted)]">{application.email}</p>
                    <p className="text-[10px] font-semibold text-[color:var(--text-muted)] mt-1">{application.phone || "No contact shared"}</p>
                  </td>
                  <td>
                    <p className="text-[12px] text-[color:var(--text-secondary)]">{application.jobTitle || "General application"}</p>
                    <p className="text-[10px] text-[color:var(--text-muted)] mt-1">{formatDate(application.createdAt)}</p>
                  </td>
                  <td>
                    {application.resumeUrl ? (
                      <a
                        href={backendAssetUrl(application.resumeUrl) || application.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[12px] font-bold text-[color:var(--accent)] hover:underline"
                      >
                        Launch Resume
                      </a>
                    ) : (
                      <span className="text-[11px] font-bold text-[color:var(--text-muted)] opacity-50 uppercase tracking-widest">Missing</span>
                    )}
                  </td>
                  <td>
                    <select
                      className={portalSelectClass}
                      value={application.status}
                      onChange={(event) => updateApplicationStatus(application.id, event.target.value)}
                      disabled={busyAction === `application-status-${application.id}`}
                    >
                      <option value="APPLIED">Applied</option>
                      <option value="SELECTED">Selected</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
