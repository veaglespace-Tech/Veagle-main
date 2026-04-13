"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useCallback, useEffect, useMemo, useState } from "react";
import {
  Building2,
  BriefcaseBusiness,
  ClipboardList,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  Mail,
  PackageSearch,
  PanelsTopLeft,
  RefreshCcw,
  Sparkles,
  Tags,
  Users,
} from "lucide-react";

import {
  ApplicationsPanel,
  CategoriesPanel,
  ClientsPanel,
  ContentPanel,
  JobsPanel,
  LeadsPanel,
  OverviewPanel,
  PortfolioPanel,
  ProductsPanel,
  ServicesPanel,
  TasksPanel,
  TeamPanel,
} from "@/components/portal/PortalPanels";
import BrandMark from "@/components/BrandMark";
import {
  portalButtonSecondaryClass,
  portalCardClass,
  portalLayoutClass,
  portalShellClass,
  portalSidebarClass,
  portalTabClass,
  portalTabListClass,
} from "@/components/portal/PortalFields";
import { Eyebrow } from "@/components/site/UiBits";
import { PORTAL_STORAGE_KEY, authHeaders, requestJson } from "@/lib/portal-api";
import { API_BASE_URL } from "@/lib/site";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addContentListItem as addContentListItemAction,
  addNestedContentListItem as addNestedContentListItemAction,
  addNestedStringListItem as addNestedStringListItemAction,
  clearSession,
  loadPortalDashboard,
  removeContentListItem as removeContentListItemAction,
  removeNestedContentListItem as removeNestedContentListItemAction,
  removeNestedStringListItem as removeNestedStringListItemAction,
  resetPortalState,
  setActiveTab as setActiveTabAction,
  setBusyAction as setBusyActionAction,
  setContent as setPortalContent,
  setPortalError,
  setPortalNotice,
  setSession,
  setSessionReady,
  updateContentField as updateContentFieldAction,
  updateContentList as updateContentListAction,
  updateNestedContentField as updateNestedContentFieldAction,
  updateNestedContentList as updateNestedContentListAction,
  updateNestedStringListItem as updateNestedStringListItemAction,
} from "@/store/portalSlice";
import { cn } from "@/lib/utils";

const contentTemplates = {
  stats: { value: "", label: "" },
  differentiators: { title: "", description: "" },
  process: { title: "", description: "" },
  testimonials: { quote: "", name: "", role: "" },
  faq: { question: "", answer: "" },
};

const nestedContentObjectTemplates = {
  about: {
    milestones: { label: "", value: "", detail: "" },
    pillars: { title: "", description: "" },
  },
  clients: {
    logos: { name: "", href: "", image: "" },
    segments: { title: "", description: "" },
    proof: { label: "", value: "" },
  },
  career: {
    highlights: { title: "", description: "" },
  },
  portfolio: {
    projects: {
      title: "",
      category: "",
      subtitle: "",
      result: "",
      imageUrl: "",
      tags: "",
      summary: "",
    },
  },
  university: {
    benefits: { title: "", description: "" },
  },
};

const tabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "content", label: "Content CMS", icon: PanelsTopLeft },
  { id: "services", label: "Services", icon: Sparkles },
  { id: "products", label: "Products", icon: PackageSearch },
  { id: "categories", label: "Categories", icon: Tags },
  { id: "jobs", label: "Jobs", icon: BriefcaseBusiness },
  { id: "clients", label: "Clients", icon: Building2 },
  { id: "portfolio", label: "Portfolio", icon: FolderOpen },
  { id: "leads", label: "Leads", icon: Mail },
  { id: "applications", label: "Applications", icon: FileText },
  { id: "tasks", label: "Allocations", icon: ClipboardList },
  { id: "team", label: "Team", icon: Users, superadminOnly: true },
];

const tabDescriptions = {
  overview: "Monitor leads, allocations and entity counts from one admin-grade control center.",
  content: "Update homepage marketing content and public website blocks through the backend-backed CMS.",
  services: "Manage dynamic service content that powers both list pages and detail pages.",
  products: "Organize the product showcase with better grouping and status control.",
  categories: "Keep product categories clean so the public catalog remains structured.",
  jobs: "Maintain career openings and hiring information for the public site.",
  clients: "Manage client proof, brand logos and website links shown on the public clients page.",
  portfolio: "Publish project case studies with live links and backend-hosted visuals.",
  leads: "Review, qualify and update enquiry flow from contact forms.",
  applications: "Track job applications and move candidates through the shortlist pipeline.",
  tasks: "Assign website and content updates when superadmin or admins need to coordinate work.",
  team: "Control user access, roles and update responsibility inside the portal.",
};

const initialTaskForm = {
  id: "",
  title: "",
  section: "Homepage",
  priority: "medium",
  assignedTo: "",
  summary: "",
};

const initialServiceForm = {
  id: "",
  title: "",
  description: "",
  featuresText: "",
  file: null,
};

const initialProductForm = {
  id: "",
  title: "",
  description: "",
  categoryId: "",
  isActive: true,
  file: null,
};

const initialCategoryForm = {
  id: "",
  name: "",
  description: "",
};

const initialJobForm = {
  id: "",
  title: "",
  description: "",
  location: "",
  skills: "",
};

const initialClientForm = {
  id: "",
  name: "",
  websiteUrl: "",
  description: "",
  displayOrder: "",
  file: null,
};

const initialPortfolioForm = {
  id: "",
  title: "",
  description: "",
  projectUrl: "",
  githubUrl: "",
  file: null,
};

const initialUserForm = {
  id: "",
  username: "",
  email: "",
  contact: "",
  password: "",
  role: "ADMIN",
};

export default function PortalApp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    session,
    sessionReady,
    loading,
    busyAction,
    error,
    notice,
    activeTab,
    content,
    services,
    products,
    categories,
    jobs,
    clients,
    portfolio,
    applications,
    users,
    leads,
    tasks,
  } = useAppSelector((state) => state.portal);

  const [taskForm, setTaskForm] = useState(initialTaskForm);
  const [serviceForm, setServiceForm] = useState(initialServiceForm);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [jobForm, setJobForm] = useState(initialJobForm);
  const [clientForm, setClientForm] = useState(initialClientForm);
  const [portfolioForm, setPortfolioForm] = useState(initialPortfolioForm);
  const [userForm, setUserForm] = useState(initialUserForm);

  const visibleTabs = useMemo(
    () => tabs.filter((tab) => !tab.superadminOnly || session?.role === "SADMIN"),
    [session?.role]
  );

  const visibleTasks = useMemo(() => {
    if (session?.role === "SADMIN") {
      return tasks;
    }

    return tasks.filter(
      (task) => !task.assignedTo || task.assignedTo === session?.email
    );
  }, [session?.email, session?.role, tasks]);

  const metrics = useMemo(
    () => [
      { label: "Services", value: services.length },
      { label: "Products", value: products.length },
      { label: "Categories", value: categories.length },
      { label: "Jobs", value: jobs.length },
      { label: "Clients", value: clients.length },
      { label: "Portfolio", value: portfolio.length },
      { label: "Leads", value: leads.length },
      { label: "Applications", value: applications.length },
    ],
    [
      applications.length,
      categories.length,
      clients.length,
      jobs.length,
      leads.length,
      portfolio.length,
      products.length,
      services.length,
    ]
  );

  const activeTabMeta = useMemo(
    () => visibleTabs.find((tab) => tab.id === activeTab) || visibleTabs[0],
    [activeTab, visibleTabs]
  );

  const quickStats = useMemo(
    () => [
      {
        label: "New Leads",
        value: leads.filter((lead) => lead.status === "new").length,
      },
      {
        label: "New Applications",
        value: applications.filter(
          (application) => String(application.status).toUpperCase() === "APPLIED"
        ).length,
      },
      {
        label: "Live Jobs",
        value: jobs.length,
      },
      {
        label: session?.role === "SADMIN" ? "Admins" : "Access",
        value:
          session?.role === "SADMIN"
            ? users.filter((user) => user.role === "ADMIN").length
            : session?.role || "ADMIN",
      },
    ],
    [applications, jobs.length, leads, session?.role, users]
  );

  const CurrentTabIcon = activeTabMeta?.icon || LayoutDashboard;

  const setActiveTab = useCallback(
    (value) => {
      dispatch(setActiveTabAction(value));
    },
    [dispatch]
  );

  const pushNotice = useCallback(
    (message) => {
      dispatch(setPortalNotice(message));
    },
    [dispatch]
  );

  const pushError = useCallback(
    (message) => {
      dispatch(setPortalError(message));
    },
    [dispatch]
  );

  const hydrate = useCallback(
    async (currentSession) => {
      if (!currentSession?.token) {
        return;
      }

      const result = await dispatch(loadPortalDashboard(currentSession));

      if (loadPortalDashboard.rejected.match(result)) {
        throw new Error(result.payload || result.error.message || "Failed to load portal data.");
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const saved =
      typeof window !== "undefined"
        ? window.localStorage.getItem(PORTAL_STORAGE_KEY)
        : null;

    if (!saved) {
      dispatch(resetPortalState());
      dispatch(setSessionReady(true));
      router.replace("/portal/admin-login");
      return;
    }

    try {
      const nextSession = JSON.parse(saved);

      if (nextSession.role === "USER") {
        dispatch(resetPortalState());
        dispatch(setSessionReady(true));
        router.replace("/");
        return;
      }

      dispatch(setSession(nextSession));
      dispatch(setSessionReady(true));
      startTransition(() => {
        hydrate(nextSession).catch(() => {});
      });
    } catch {
      window.localStorage.removeItem(PORTAL_STORAGE_KEY);
      dispatch(resetPortalState());
      dispatch(setSessionReady(true));
      router.replace("/portal/admin-login");
    }
  }, [dispatch, hydrate, router]);

  function resetForms() {
    setTaskForm(initialTaskForm);
    setServiceForm(initialServiceForm);
    setProductForm(initialProductForm);
    setCategoryForm(initialCategoryForm);
    setJobForm(initialJobForm);
    setClientForm(initialClientForm);
    setPortfolioForm(initialPortfolioForm);
    setUserForm(initialUserForm);
  }

  function updateContentField(section, key, value) {
    dispatch(updateContentFieldAction({ section, key, value }));
  }

  function updateContentList(section, index, key, value) {
    dispatch(updateContentListAction({ section, index, key, value }));
  }

  function addContentListItem(section) {
    dispatch(addContentListItemAction({ section, template: contentTemplates[section] }));
  }

  function removeContentListItem(section, index) {
    dispatch(removeContentListItemAction({ section, index }));
  }

  function updateNestedContentField(section, key, value) {
    dispatch(updateNestedContentFieldAction({ section, key, value }));
  }

  function updateNestedContentList(section, listKey, index, key, value) {
    dispatch(updateNestedContentListAction({ section, listKey, index, key, value }));
  }

  function addNestedContentListItem(section, listKey) {
    dispatch(
      addNestedContentListItemAction({
        section,
        listKey,
        template: nestedContentObjectTemplates[section][listKey],
      })
    );
  }

  function removeNestedContentListItem(section, listKey, index) {
    dispatch(removeNestedContentListItemAction({ section, listKey, index }));
  }

  function updateNestedStringListItem(section, listKey, index, value) {
    dispatch(updateNestedStringListItemAction({ section, listKey, index, value }));
  }

  function addNestedStringListItem(section, listKey) {
    dispatch(addNestedStringListItemAction({ section, listKey }));
  }

  function removeNestedStringListItem(section, listKey, index) {
    dispatch(removeNestedStringListItemAction({ section, listKey, index }));
  }

  function handleLogout() {
    window.localStorage.removeItem(PORTAL_STORAGE_KEY);
    dispatch(clearSession());
    dispatch(resetPortalState());
    router.replace("/portal/admin-login");
  }

  async function saveContent() {
    await runAction("content", async () => {
      const nextContent = await requestJson("/api/cms/content", {
        method: "PUT",
        headers: authHeaders(session.token),
        body: JSON.stringify(content),
      });
      dispatch(setPortalContent(nextContent));
      pushNotice("Website content updated successfully.");
    });
  }

  async function runAction(key, callback) {
    dispatch(setBusyActionAction(key));
    try {
      await callback();
    } catch (nextError) {
      pushError(nextError.message);
    } finally {
      dispatch(setBusyActionAction(""));
    }
  }

  const actions = createPortalActions({
    session,
    categories,
    serviceForm,
    productForm,
    categoryForm,
    jobForm,
    clientForm,
    portfolioForm,
    userForm,
    taskForm,
    setServiceForm,
    setProductForm,
    setCategoryForm,
    setJobForm,
    setClientForm,
    setPortfolioForm,
    setUserForm,
    setTaskForm,
    setActiveTab,
    runAction,
    hydrate,
    pushNotice,
    pushError,
    resetForms,
  });

  if (!sessionReady || !session) {
    return (
      <main className={`${portalShellClass} flex min-h-screen items-center justify-center px-4`}>
        <div className={`${portalCardClass} max-w-lg text-center`}>
          <p className="text-sm uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Opening portal</p>
          <h1 className="mt-3 font-headline text-3xl font-black tracking-tighter text-[color:var(--text-primary)]">
            Preparing your dashboard
          </h1>
          <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
            Loading admin session, CMS content, live backend entities and hiring activity.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className={portalShellClass}>
      <div className={portalLayoutClass}>
        <aside className={portalSidebarClass}>
          <div className="space-y-6">
            <Link
              href="/"
              onDoubleClick={() => router.push("/")}
              className={`${portalCardClass} block p-4 transition hover:-translate-y-0.5 hover:border-[color:var(--border-strong)]`}
            >
              <BrandMark href="" variant="footer" tone="light" />
              <p className="mt-4 text-sm leading-7 text-[color:var(--text-secondary)]">
                Open the public website home page from here any time.
              </p>
            </Link>

            <div className={portalTabListClass}>
              {visibleTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    className={portalTabClass(activeTab === tab.id)}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <span className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-2xl border transition",
                      activeTab === tab.id
                        ? "border-[#77a2ff] bg-white/90 text-[color:var(--accent)]"
                        : "border-[color:var(--border)] bg-[rgba(255,255,255,0.04)] text-[color:var(--text-secondary)]"
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <span className="block text-sm font-semibold">{tab.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={`${portalCardClass} space-y-3`}>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                Quick state
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {quickStats.slice(0, 2).map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.2rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-3"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                      {item.label}
                    </p>
                    <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <div className={`${portalCardClass} flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between`}>
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
                  Signed in as
                </p>
                <p className="mt-2 break-all text-sm font-semibold text-[color:var(--text-primary)] sm:text-base">
                  {session.email}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <span className="inline-flex rounded-full border border-[color:var(--border-strong)] bg-[color:var(--accent-soft)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--accent)]">
                  {session.role}
                </span>
                <span className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-secondary)]">
                  {activeTabMeta?.label || "Overview"}
                </span>
                <button
                  type="button"
                  className={portalButtonSecondaryClass}
                  onClick={() => {
                    hydrate(session).catch(() => {});
                  }}
                >
                  <RefreshCcw className="h-4 w-4" />
                  Refresh
                </button>
                <button type="button" className={portalButtonSecondaryClass} onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            <div className={`${portalCardClass} overflow-hidden`}>
              <div className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr] xl:items-end">
                <div className="space-y-4">
                  <Eyebrow>{activeTabMeta?.label || "Overview"}</Eyebrow>
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.3rem] bg-[color:var(--accent-contrast)] text-[color:var(--accent)]">
                      <CurrentTabIcon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <h1 className="font-headline text-3xl font-black tracking-tighter text-[color:var(--text-primary)] lg:text-4xl">
                        {activeTabMeta?.label || "Overview"}
                      </h1>
                      <p className="mt-3 max-w-3xl text-sm leading-7 text-[color:var(--text-secondary)]">
                        {tabDescriptions[activeTab] || "Manage your portal workspace from here."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {quickStats.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-[1.3rem] border border-[color:var(--border)] bg-[color:var(--surface-muted)] px-4 py-4"
                      >
                        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--text-muted)]">
                          {item.label}
                        </p>
                        <p className="mt-2 font-headline text-2xl font-black tracking-tight text-[color:var(--text-primary)]">
                          {item.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {notice ? (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{notice}</div>
            ) : null}
            {error ? (
              <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">{error}</div>
            ) : null}
            {loading ? <div className={`${portalCardClass} text-center text-sm text-[color:var(--text-secondary)]`}>Loading dashboard data...</div> : null}

            {!loading && activeTab === "overview" ? <OverviewPanel metrics={metrics} leads={leads} visibleTasks={visibleTasks} /> : null}
            {!loading && activeTab === "content" ? (
              <ContentPanel
                content={content}
                busyAction={busyAction}
                updateContentField={updateContentField}
                updateContentList={updateContentList}
                addContentListItem={addContentListItem}
                removeContentListItem={removeContentListItem}
                updateNestedContentField={updateNestedContentField}
                updateNestedContentList={updateNestedContentList}
                addNestedContentListItem={addNestedContentListItem}
                removeNestedContentListItem={removeNestedContentListItem}
                updateNestedStringListItem={updateNestedStringListItem}
                addNestedStringListItem={addNestedStringListItem}
                removeNestedStringListItem={removeNestedStringListItem}
                saveContent={saveContent}
              />
            ) : null}
            {!loading && activeTab === "services" ? <ServicesPanel services={services} serviceForm={serviceForm} setServiceForm={setServiceForm} saveService={actions.saveService} beginServiceEdit={actions.beginServiceEdit} deleteService={actions.deleteService} busyAction={busyAction} /> : null}
            {!loading && activeTab === "products" ? <ProductsPanel products={products} categories={categories} productForm={productForm} setProductForm={setProductForm} saveProduct={actions.saveProduct} beginProductEdit={actions.beginProductEdit} toggleProductStatus={actions.toggleProductStatus} deleteProduct={actions.deleteProduct} busyAction={busyAction} /> : null}
            {!loading && activeTab === "categories" ? <CategoriesPanel categories={categories} categoryForm={categoryForm} setCategoryForm={setCategoryForm} saveCategory={actions.saveCategory} beginCategoryEdit={actions.beginCategoryEdit} deleteCategory={actions.deleteCategory} busyAction={busyAction} /> : null}
            {!loading && activeTab === "jobs" ? <JobsPanel jobs={jobs} jobForm={jobForm} setJobForm={setJobForm} saveJob={actions.saveJob} beginJobEdit={actions.beginJobEdit} deleteJob={actions.deleteJob} busyAction={busyAction} /> : null}
            {!loading && activeTab === "clients" ? <ClientsPanel clients={clients} clientForm={clientForm} setClientForm={setClientForm} saveClient={actions.saveClient} beginClientEdit={actions.beginClientEdit} deleteClient={actions.deleteClient} busyAction={busyAction} /> : null}
            {!loading && activeTab === "portfolio" ? <PortfolioPanel portfolio={portfolio} portfolioForm={portfolioForm} setPortfolioForm={setPortfolioForm} savePortfolio={actions.savePortfolio} beginPortfolioEdit={actions.beginPortfolioEdit} deletePortfolio={actions.deletePortfolio} busyAction={busyAction} /> : null}
            {!loading && activeTab === "leads" ? <LeadsPanel leads={leads} busyAction={busyAction} updateLeadStatus={actions.updateLeadStatus} /> : null}
            {!loading && activeTab === "applications" ? <ApplicationsPanel applications={applications} busyAction={busyAction} updateApplicationStatus={actions.updateApplicationStatus} /> : null}
            {!loading && activeTab === "tasks" ? <TasksPanel sessionRole={session.role} users={users} visibleTasks={visibleTasks} taskForm={taskForm} setTaskForm={setTaskForm} saveTask={actions.saveTask} beginTaskEdit={actions.beginTaskEdit} updateTaskStatus={actions.updateTaskStatus} deleteTaskEntry={actions.deleteTaskEntry} busyAction={busyAction} /> : null}
            {!loading && activeTab === "team" && session.role === "SADMIN" ? <TeamPanel users={users} userForm={userForm} setUserForm={setUserForm} saveUser={actions.saveUser} beginUserEdit={actions.beginUserEdit} toggleUserStatus={actions.toggleUserStatus} deleteUser={actions.deleteUser} busyAction={busyAction} /> : null}
          </div>
        </section>
      </div>
    </main>
  );
}

function createPortalActions(context) {
  const {
    session,
    categories,
    serviceForm,
    productForm,
    categoryForm,
    jobForm,
    clientForm,
    portfolioForm,
    userForm,
    taskForm,
    setServiceForm,
    setProductForm,
    setCategoryForm,
    setJobForm,
    setClientForm,
    setPortfolioForm,
    setUserForm,
    setTaskForm,
    setActiveTab,
    runAction,
    hydrate,
    pushNotice,
    pushError,
    resetForms,
  } = context;

  return {
    beginServiceEdit(item) {
      setServiceForm({
        id: item.id,
        title: item.title,
        description: item.description,
        featuresText: (item.features || []).map((feature) => feature.name).join(", "),
        file: null,
      });
      setActiveTab("services");
    },
    async saveService() {
      if (!serviceForm.title.trim() || !serviceForm.description.trim()) {
        pushError("Service title and description are required.");
        return;
      }
      if (!serviceForm.id && !serviceForm.file) {
        pushError("Add a service image before saving.");
        return;
      }
      await runAction("service", async () => {
        const features = serviceForm.featuresText.split(",").map((value) => value.trim()).filter(Boolean).map((name) => ({ name }));
        const payload = new FormData();
        payload.append("data", JSON.stringify({ title: serviceForm.title.trim(), description: serviceForm.description.trim(), features }));
        if (serviceForm.file) payload.append("file", serviceForm.file);
        await requestJson(serviceForm.id ? `${API_BASE_URL}/api/v1/admin/services/${serviceForm.id}` : `${API_BASE_URL}/api/v1/admin/services`, {
          method: serviceForm.id ? "PUT" : "POST",
          headers: authHeaders(session.token, false),
          body: payload,
        });
        setServiceForm(initialServiceForm);
        await hydrate(session);
        pushNotice("Service saved successfully.");
      });
    },
    async deleteService(id) {
      if (!window.confirm("Delete this service?")) return;
      await runAction(`service-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/services/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Service deleted.");
      });
    },
    beginProductEdit(item) {
      const category = categories.find((entry) => entry.name === item.categoryName);
      setProductForm({ id: item.id, title: item.title, description: item.description, categoryId: category ? String(category.id) : "", isActive: item.isActive !== false, file: null });
      setActiveTab("products");
    },
    async saveProduct() {
      if (!productForm.title.trim() || !productForm.description.trim() || !productForm.categoryId) {
        pushError("Product title, description and category are required.");
        return;
      }
      if (!productForm.id && !productForm.file) {
        pushError("Add a product image before saving.");
        return;
      }
      await runAction("product", async () => {
        const payload = new FormData();
        payload.append("request", JSON.stringify({ title: productForm.title.trim(), description: productForm.description.trim(), imageUrl: "", categoryId: Number(productForm.categoryId), isActive: productForm.isActive }));
        if (productForm.file) payload.append("file", productForm.file);
        await requestJson(productForm.id ? `${API_BASE_URL}/api/v1/admin/products/${productForm.id}` : `${API_BASE_URL}/api/v1/admin/products`, {
          method: productForm.id ? "PUT" : "POST",
          headers: authHeaders(session.token, false),
          body: payload,
        });
        setProductForm(initialProductForm);
        await hydrate(session);
        pushNotice("Product saved successfully.");
      });
    },
    async toggleProductStatus(item) {
      await runAction(`product-status-${item.id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/products/${item.id}/status`, {
          method: "PATCH",
          headers: authHeaders(session.token),
          body: JSON.stringify({ isActive: !item.isActive }),
        });
        await hydrate(session);
        pushNotice("Product status updated.");
      });
    },
    async deleteProduct(id) {
      if (!window.confirm("Delete this product?")) return;
      await runAction(`product-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/products/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Product deleted.");
      });
    },
    beginCategoryEdit(item) {
      setCategoryForm({ id: item.id, name: item.name, description: item.description });
      setActiveTab("categories");
    },
    async saveCategory() {
      if (!categoryForm.name.trim()) {
        pushError("Category name is required.");
        return;
      }
      await runAction("category", async () => {
        await requestJson(categoryForm.id ? `${API_BASE_URL}/api/v1/admin/categories/${categoryForm.id}` : `${API_BASE_URL}/api/v1/admin/categories`, {
          method: categoryForm.id ? "PUT" : "POST",
          headers: authHeaders(session.token),
          body: JSON.stringify({ name: categoryForm.name.trim(), description: categoryForm.description.trim() }),
        });
        setCategoryForm(initialCategoryForm);
        await hydrate(session);
        pushNotice("Category saved successfully.");
      });
    },
    async deleteCategory(id) {
      if (!window.confirm("Delete this category?")) return;
      await runAction(`category-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/categories/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Category deleted.");
      });
    },
    beginJobEdit(item) {
      setJobForm({ id: item.id, title: item.title, description: item.description, location: item.location, skills: item.skills });
      setActiveTab("jobs");
    },
    async saveJob() {
      if (!jobForm.title.trim() || !jobForm.description.trim()) {
        pushError("Job title and description are required.");
        return;
      }
      await runAction("job", async () => {
        await requestJson(jobForm.id ? `${API_BASE_URL}/api/v1/admin/jobs/${jobForm.id}` : `${API_BASE_URL}/api/v1/admin/jobs`, {
          method: jobForm.id ? "PUT" : "POST",
          headers: authHeaders(session.token),
          body: JSON.stringify({ title: jobForm.title.trim(), description: jobForm.description.trim(), location: jobForm.location.trim(), skills: jobForm.skills.trim() }),
        });
        setJobForm(initialJobForm);
        await hydrate(session);
        pushNotice("Job saved successfully.");
      });
    },
    async deleteJob(id) {
      if (!window.confirm("Delete this job?")) return;
      await runAction(`job-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/jobs/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Job deleted.");
      });
    },
    beginClientEdit(item) {
      setClientForm({
        id: item.id,
        name: item.name,
        websiteUrl: item.websiteUrl || "",
        description: item.description || "",
        displayOrder: "",
        file: null,
      });
      setActiveTab("clients");
    },
    async saveClient() {
      if (!clientForm.name.trim()) {
        pushError("Client name is required.");
        return;
      }
      if (!clientForm.id && !clientForm.file) {
        pushError("Add a client logo before saving.");
        return;
      }
      await runAction("client", async () => {
        const payload = new FormData();
        payload.append("name", clientForm.name.trim());
        payload.append("websiteUrl", clientForm.websiteUrl.trim());
        payload.append("description", clientForm.description.trim());
        if (clientForm.displayOrder) {
          payload.append("displayOrder", clientForm.displayOrder.trim());
        }
        if (clientForm.file) {
          payload.append("logo", clientForm.file);
        }
        await requestJson(
          clientForm.id
            ? `${API_BASE_URL}/api/v1/admin/clients/${clientForm.id}`
            : `${API_BASE_URL}/api/v1/admin/clients`,
          {
            method: clientForm.id ? "PUT" : "POST",
            headers: authHeaders(session.token, false),
            body: payload,
          }
        );
        setClientForm(initialClientForm);
        await hydrate(session);
        pushNotice("Client saved successfully.");
      });
    },
    async deleteClient(id) {
      if (!window.confirm("Delete this client?")) return;
      await runAction(`client-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/clients/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Client deleted.");
      });
    },
    beginPortfolioEdit(item) {
      setPortfolioForm({
        id: item.id,
        title: item.title,
        description: item.description || "",
        projectUrl: item.projectUrl || "",
        githubUrl: item.githubUrl || "",
        file: null,
      });
      setActiveTab("portfolio");
    },
    async savePortfolio() {
      if (!portfolioForm.title.trim()) {
        pushError("Portfolio title is required.");
        return;
      }
      if (!portfolioForm.id && !portfolioForm.file) {
        pushError("Add a project image before saving.");
        return;
      }
      await runAction("portfolio", async () => {
        const payload = new FormData();
        payload.append("title", portfolioForm.title.trim());
        payload.append("description", portfolioForm.description.trim());
        payload.append("projectUrl", portfolioForm.projectUrl.trim());
        payload.append("githubUrl", portfolioForm.githubUrl.trim());
        if (portfolioForm.file) {
          payload.append("image", portfolioForm.file);
        }
        await requestJson(
          portfolioForm.id
            ? `${API_BASE_URL}/api/v1/admin/portfolio/${portfolioForm.id}`
            : `${API_BASE_URL}/api/v1/admin/portfolio`,
          {
            method: portfolioForm.id ? "PUT" : "POST",
            headers: authHeaders(session.token, false),
            body: payload,
          }
        );
        setPortfolioForm(initialPortfolioForm);
        await hydrate(session);
        pushNotice("Portfolio project saved successfully.");
      });
    },
    async deletePortfolio(id) {
      if (!window.confirm("Delete this portfolio project?")) return;
      await runAction(`portfolio-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/portfolio/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Portfolio project deleted.");
      });
    },
    beginUserEdit(item) {
      setUserForm({ id: item.id, username: item.username, email: item.email, contact: item.contact, password: "", role: item.role });
      setActiveTab("team");
    },
    async saveUser() {
      if (!userForm.username.trim() || !userForm.email.trim() || !userForm.contact.trim()) {
        pushError("Username, email and contact are required.");
        return;
      }
      if (!userForm.id && !userForm.password.trim()) {
        pushError("Password is required while creating a user.");
        return;
      }
      await runAction("user", async () => {
        await requestJson(userForm.id ? `${API_BASE_URL}/api/v1/admin/users/${userForm.id}` : `${API_BASE_URL}/api/v1/admin/users`, {
          method: userForm.id ? "PUT" : "POST",
          headers: authHeaders(session.token),
          body: JSON.stringify({ username: userForm.username.trim(), email: userForm.email.trim(), contact: userForm.contact.trim(), password: userForm.password.trim(), role: userForm.role }),
        });
        setUserForm(initialUserForm);
        await hydrate(session);
        pushNotice("User saved successfully.");
      });
    },
    async toggleUserStatus(id) {
      await runAction(`user-status-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/users/${id}/status`, {
          method: "PATCH",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("User status updated.");
      });
    },
    async deleteUser(id) {
      if (!window.confirm("Delete this user?")) return;
      await runAction(`user-delete-${id}`, async () => {
        await requestJson(`${API_BASE_URL}/api/v1/admin/users/${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("User deleted.");
      });
    },
    beginTaskEdit(item) {
      setTaskForm({ id: item.id, title: item.title, section: item.section, priority: item.priority, assignedTo: item.assignedTo || "", summary: item.summary || "" });
      setActiveTab("tasks");
    },
    async saveTask() {
      if (!taskForm.title.trim()) {
        pushError("Task title is required.");
        return;
      }
      await runAction("task", async () => {
        await requestJson("/api/cms/tasks", {
          method: taskForm.id ? "PATCH" : "POST",
          headers: authHeaders(session.token),
          body: JSON.stringify(taskForm.id ? { id: taskForm.id, ...taskForm } : taskForm),
        });
        setTaskForm(initialTaskForm);
        await hydrate(session);
        pushNotice("Task allocation saved.");
      });
    },
    async updateTaskStatus(id, status) {
      await runAction(`task-status-${id}`, async () => {
        await requestJson("/api/cms/tasks", {
          method: "PATCH",
          headers: authHeaders(session.token),
          body: JSON.stringify({ id, status }),
        });
        await hydrate(session);
        pushNotice("Task status updated.");
      });
    },
    async deleteTaskEntry(id) {
      if (!window.confirm("Delete this task allocation?")) return;
      await runAction(`task-delete-${id}`, async () => {
        await requestJson(`/api/cms/tasks?id=${id}`, {
          method: "DELETE",
          headers: authHeaders(session.token, false),
        });
        await hydrate(session);
        pushNotice("Task deleted.");
      });
    },
    async updateLeadStatus(id, status) {
      await runAction(`lead-status-${id}`, async () => {
        await requestJson("/api/cms/leads", {
          method: "PATCH",
          headers: authHeaders(session.token),
          body: JSON.stringify({ id, status }),
        });
        await hydrate(session);
        pushNotice("Lead updated.");
      });
    },
    async updateApplicationStatus(id, status) {
      await runAction(`application-status-${id}`, async () => {
        await requestJson(
          `${API_BASE_URL}/api/v1/admin/applications/${id}/status?status=${encodeURIComponent(status)}`,
          {
            method: "PATCH",
            headers: authHeaders(session.token, false),
          }
        );
        await hydrate(session);
        pushNotice("Application status updated.");
      });
    },
    resetForms,
  };
}
