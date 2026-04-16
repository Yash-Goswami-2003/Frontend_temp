import { useEffect, useState } from "react";
import { logoutUser, getConfigurationById, updateConfiguration, createConfiguration, getConfigurations } from "../../utils/api";
import ConfigTable from "../../components/ConfigTable";

// ─── Icons ────────────────────────────────────────────────────────────────────
const Icons = {
  Layout: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-12 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Settings: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  Bell: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
  ),
  LogOut: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
    </svg>
  ),
  X: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  BarChart: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Folder: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  AlertTriangle: () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Briefcase: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

// ─── Modal Wrapper ─────────────────────────────────────────────────────────────
function Modal({ open, onClose, children }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    if (open) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in">
        {children}
      </div>
    </div>
  );
}

// ─── Create Configuration Modal ───────────────────────────────────────────────
function CreateConfigModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", type: "SCREENS", description: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); setForm({ name: "", type: "SCREENS", description: "" }); }, 1200);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create Configuration</h2>
            <p className="text-xs text-slate-500 mt-0.5">Set up a new configuration entry</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Icons.X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Configuration Name</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Employee Form"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
            >
              <option value="SCREENS">SCREENS</option>
              <option value="FIELDS">FIELDS</option>
              <option value="LAYOUTS">LAYOUTS</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Optional description..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70"
            >
              {saved ? (
                <><Icons.Check /><span>Created!</span></>
              ) : saving ? (
                <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Creating...</span></>
              ) : (
                <span>Create</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ─── Edit Configuration Modal ─────────────────────────────────────────────────
function EditConfigModal({ open, onClose, configId, onSaved }) {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [json, setJson] = useState("");

  // Fetch config when modal opens
  useEffect(() => {
    if (open && configId) {
      const fetchConfig = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await getConfigurationById(configId);
          setConfig(response.document);
          setJson(JSON.stringify(response.document?.data || {}, null, 2));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchConfig();
    }
  }, [open, configId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      let dataToSave;
      try {
        dataToSave = JSON.parse(json);
      } catch (e) {
        setError("Invalid JSON: " + e.message);
        setSaving(false);
        return;
      }

      await updateConfiguration(configId, {
        config_type: config?.config_type || "SCREENS",
        data: dataToSave,
      });
      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatJson = () => {
    try {
      setJson(JSON.stringify(JSON.parse(json), null, 2));
    } catch (e) {
      setError("Cannot format invalid JSON");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col" style={{ maxHeight: "80vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Edit Configuration</h2>
            <p className="text-xs text-slate-500">
              {config ? `ID: #${configId} • ${config.config_type}` : `ID: #${configId}`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={formatJson}
              disabled={loading || !config}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              Format JSON
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Icons.X />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-12">
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-slate-500">Loading configuration...</span>
            </div>
          ) : error && !config ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
                <Icons.AlertTriangle />
              </div>
              <p className="text-sm text-slate-600">Failed to load configuration</p>
              <p className="text-xs text-slate-400 mt-1">{error}</p>
            </div>
          ) : (
            <textarea
              value={json}
              onChange={(e) => {
                setJson(e.target.value);
                setError(null);
              }}
              className="w-full h-64 font-mono text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
              spellCheck={false}
            />
          )}

          {error && config && (
            <div className="mt-3 flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading || !config}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70"
            >
              {saving ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Icons.Check />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ─── Create Project Modal ──────────────────────────────────────────────────────
function CreateProjectModal({ open, onClose, onCreated }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    scope: "internal",
    status: "Active",
    priority: "medium",
    startDate: "",
    endDate: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await createConfiguration({
        config_type: "PROJECTS",
        data: {
          name: form.name,
          description: form.description,
          scope: form.scope,
          status: form.status,
          priority: form.priority,
          startDate: form.startDate,
          endDate: form.endDate,
          createdAt: new Date().toISOString(),
        },
      });
      onCreated?.(result.id, form.name);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
        setForm({
          name: "",
          description: "",
          scope: "internal",
          status: "Active",
          priority: "medium",
          startDate: "",
          endDate: "",
        });
      }, 1200);
    } catch (err) {
      console.error("Failed to create project:", err);
      alert("Failed to create project: " + err.message);
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6" style={{ maxHeight: "85vh", overflow: "auto" }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Create Project</h2>
            <p className="text-xs text-slate-500 mt-0.5">Set up a new project</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Icons.X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Project Name */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Project Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Employee Portal Redesign"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Project details and objectives..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
            />
          </div>

          {/* Scope & Status - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Scope</label>
              <select
                value={form.scope}
                onChange={(e) => setForm({ ...form, scope: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
              >
                <option value="internal">Internal</option>
                <option value="client">Client</option>
                <option value="public">Public</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
              >
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Priority</label>
            <div className="flex gap-2">
              {["low", "medium", "high"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    form.priority === p
                      ? "bg-blue-50 border-blue-200 text-blue-700"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dates - 2 columns */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || saved}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70"
            >
              {saved ? (
                <><Icons.Check /><span>Created!</span></>
              ) : saving ? (
                <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Creating...</span></>
              ) : (
                <><Icons.Briefcase /><span>Create Project</span></>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

// ─── View/Edit Project Modal ────────────────────────────────────────────────────
function ViewEditProjectModal({ open, onClose, projectId, onSaved }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (open && projectId) {
      const fetchProject = async () => {
        setLoading(true);
        setError(null);
        setIsEditing(false);
        try {
          const response = await getConfigurationById(projectId);
          setProject(response.document);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchProject();
    }
  }, [open, projectId]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      await updateConfiguration(projectId, {
        config_type: "PROJECTS",
        data: project.data,
      });
      onSaved?.();
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setProject({
      ...project,
      data: { ...project.data, [field]: value },
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      Active: "text-emerald-600 bg-emerald-50",
      Draft: "text-amber-600 bg-amber-50",
      Archived: "text-slate-500 bg-slate-100",
    };
    return colors[status] || colors.Draft;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "text-slate-600 bg-slate-100",
      medium: "text-blue-600 bg-blue-50",
      high: "text-red-600 bg-red-50",
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="flex flex-col" style={{ maxHeight: "85vh" }}>
          {/* Header Skeleton */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse" />
              <div className="space-y-2">
                <div className="w-32 h-5 bg-slate-200 rounded animate-pulse" />
                <div className="w-20 h-3 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
            <div className="w-8 h-8 bg-slate-200 rounded-lg animate-pulse" />
          </div>

          {/* Content Skeleton */}
          <div className="p-6 space-y-5">
            {/* Status badges */}
            <div className="flex items-center gap-2">
              <div className="w-16 h-6 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-20 h-6 bg-slate-200 rounded-lg animate-pulse" />
              <div className="w-16 h-6 bg-slate-200 rounded-lg animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
              <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
              <div className="w-3/4 h-4 bg-slate-200 rounded animate-pulse" />
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
              </div>
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                <div className="w-16 h-3 bg-slate-200 rounded animate-pulse" />
                <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>

            {/* Metadata */}
            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="w-24 h-3 bg-slate-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
                <div className="w-full h-4 bg-slate-200 rounded animate-pulse" />
              </div>
            </div>
          </div>

          {/* Footer Skeleton */}
          <div className="px-6 py-4 border-t border-slate-100">
            <div className="w-full h-10 bg-slate-200 rounded-lg animate-pulse" />
          </div>
        </div>
      </Modal>
    );
  }

  if (error && !project) {
    return (
      <Modal open={open} onClose={onClose}>
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
            <Icons.AlertTriangle />
          </div>
          <p className="text-sm text-slate-600">Failed to load project</p>
          <p className="text-xs text-slate-400 mt-1">{error}</p>
        </div>
      </Modal>
    );
  }

  const data = project?.data || {};

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col" style={{ maxHeight: "85vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
              <Icons.Briefcase />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isEditing ? "Edit Project" : data.name || "Untitled Project"}
              </h2>
              <p className="text-xs text-slate-500">ID: #{projectId} • PROJECTS</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Icons.Edit />
                Edit
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <Icons.X />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-auto">
          {isEditing ? (
            <div className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                  <Icons.AlertTriangle />
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Project Name</label>
                <input
                  value={data.name || ""}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Description</label>
                <textarea
                  value={data.description || ""}
                  onChange={(e) => updateField("description", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Scope</label>
                  <select
                    value={data.scope || "internal"}
                    onChange={(e) => updateField("scope", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
                  >
                    <option value="internal">Internal</option>
                    <option value="client">Client</option>
                    <option value="public">Public</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
                  <select
                    value={data.status || "Active"}
                    onChange={(e) => updateField("status", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {["low", "medium", "high"].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => updateField("priority", p)}
                      className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                        data.priority === p
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">Start Date</label>
                  <input
                    type="date"
                    value={data.startDate || ""}
                    onChange={(e) => updateField("startDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">End Date</label>
                  <input
                    type="date"
                    value={data.endDate || ""}
                    onChange={(e) => updateField("endDate", e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Status badges */}
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(data.status)}`}>
                  {data.status || "Draft"}
                </span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${getPriorityColor(data.priority)}`}>
                  {data.priority ? data.priority.charAt(0).toUpperCase() + data.priority.slice(1) : "Medium"} Priority
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium text-indigo-600 bg-indigo-50">
                  {data.scope ? data.scope.charAt(0).toUpperCase() + data.scope.slice(1) : "Internal"} Scope
                </span>
              </div>

              {/* Description */}
              {data.description && (
                <div>
                  <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Description</h4>
                  <p className="text-sm text-slate-700 leading-relaxed">{data.description}</p>
                </div>
              )}

              {/* Timeline */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Icons.Clock />
                    Start Date
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {data.startDate ? new Date(data.startDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                    <Icons.Clock />
                    End Date
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    {data.endDate ? new Date(data.endDate).toLocaleDateString() : "Not set"}
                  </p>
                </div>
              </div>

              {/* Metadata */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">Project Details</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-slate-400">Created:</span>
                    <span className="ml-2 text-slate-700">{data.createdAt ? new Date(data.createdAt).toLocaleDateString() : "—"}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">ID:</span>
                    <span className="ml-2 text-slate-700 font-mono">#{projectId}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100">
          {isEditing ? (
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-70"
              >
                {saving ? (
                  <><div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" /><span>Saving...</span></>
                ) : (
                  <><Icons.Check /><span>Save Changes</span></>
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              className="w-full px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Profile Modal ─────────────────────────────────────────────────────────────
function ProfileModal({ open, onClose, user }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("User");
  const [email, setEmail] = useState("user@example.com");

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-3">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-xs text-slate-400 font-mono">ID: {user?.userId || "—"}</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Display Name</label>
            {editing ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            ) : (
              <p className="px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded-lg">{name}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
            {editing ? (
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
              />
            ) : (
              <p className="px-3 py-2 text-sm text-slate-800 bg-slate-50 rounded-lg">{email}</p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Session Token</label>
            <p className="px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg font-mono truncate">
              {user?.token ? `${user.token.slice(0, 32)}...` : "—"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          {editing ? (
            <>
              <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={() => setEditing(false)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Save
              </button>
            </>
          ) : (
            <>
              <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
                Close
              </button>
              <button onClick={() => setEditing(true)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                <Icons.Edit /><span>Edit</span>
              </button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}

// ─── Logout Confirm Modal ──────────────────────────────────────────────────────
function LogoutModal({ open, onClose, onConfirm }) {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-4">
            <Icons.AlertTriangle />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Log out?</h2>
          <p className="text-sm text-slate-500 mt-1">Are you sure you want to log out? Your session will end.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── Overview Page ─────────────────────────────────────────────────────────────
function OverviewPage({ onCreateConfig, onEditConfig }) {
  const stats = [
    { label: "Total Projects", value: "12", change: "+3", icon: Icons.Folder, color: "blue" },
    { label: "Team Members", value: "8", change: "+2", icon: Icons.Users, color: "emerald" },
    { label: "Active Tasks", value: "24", change: "+5", icon: Icons.Layout, color: "violet" },
  ];

  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", hover: "group-hover:bg-blue-50 group-hover:text-blue-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", hover: "group-hover:bg-emerald-50 group-hover:text-emerald-500" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", hover: "group-hover:bg-violet-50 group-hover:text-violet-500" },
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Overview</h1>
        <p className="text-sm text-slate-500 mt-1">Here&apos;s what&apos;s happening with your projects today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((stat) => {
          const c = colorMap[stat.color];
          return (
            <div key={stat.label} className="group bg-white rounded-xl p-4 border border-slate-200/60 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1">{stat.label}</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-semibold text-slate-900">{stat.value}</span>
                    <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{stat.change}</span>
                  </div>
                </div>
                <div className={`p-2 ${c.bg} rounded-lg ${c.text} ${c.hover} transition-colors`}>
                  <stat.icon />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCreateConfig}
                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all text-left group"
              >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                  <Icons.Plus />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">New Config</p>
                  <p className="text-xs text-slate-400">Create configuration</p>
                </div>
              </button>
              <button className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all text-left group">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                  <Icons.Settings />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Settings</p>
                  <p className="text-xs text-slate-400">Manage preferences</p>
                </div>
              </button>
            </div>
          </div>

          {/* Configurations Table */}
          <ConfigTable
            onRowClick={onEditConfig}
            pageSize={8}
          />
        </div>

        {/* System Status */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">System Status</span>
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-slate-900">Operational</p>
            <p className="text-xs text-slate-400 mt-1">All services running normally</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200/60 p-4">
            <h3 className="text-xs font-medium text-slate-500 mb-3">Uptime</h3>
            {[{ label: "API", pct: 99 }, { label: "DB", pct: 100 }, { label: "CDN", pct: 97 }].map((s) => (
              <div key={s.label} className="mb-3 last:mb-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600">{s.label}</span>
                  <span className="text-slate-500">{s.pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Page ────────────────────────────────────────────────────────────
function AnalyticsPage() {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const values = [40, 65, 50, 80, 70, 90];
  const max = Math.max(...values);

  const metrics = [
    { label: "Page Views", value: "48,291", change: "+12%", up: true },
    { label: "Unique Users", value: "3,842", change: "+8%", up: true },
    { label: "Avg. Session", value: "4m 32s", change: "-2%", up: false },
    { label: "Bounce Rate", value: "24%", change: "-5%", up: true },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track performance and usage metrics.</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200/60 p-4">
            <p className="text-xs font-medium text-slate-500 mb-1">{m.label}</p>
            <p className="text-xl font-semibold text-slate-900">{m.value}</p>
            <span className={`text-xs font-medium px-1.5 py-0.5 rounded mt-1 inline-block ${m.up ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"}`}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-800">Monthly Activity</h3>
          <span className="text-xs text-slate-400">Last 6 months</span>
        </div>
        <div className="flex items-end gap-3 h-36">
          {values.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-500 rounded-t-md hover:bg-blue-600 transition-colors cursor-pointer"
                style={{ height: `${(v / max) * 100}%` }}
                title={`${months[i]}: ${v}`}
              />
              <span className="text-xs text-slate-400">{months[i]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top Pages */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-4">
        <h3 className="text-sm font-semibold text-slate-800 mb-3">Top Pages</h3>
        <div className="space-y-2">
          {[
            { page: "/dashboard", views: "12,400", pct: 90 },
            { page: "/login", views: "8,200", pct: 60 },
            { page: "/signup", views: "5,100", pct: 37 },
            { page: "/visual-builder", views: "2,900", pct: 21 },
          ].map((p) => (
            <div key={p.page} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-36 truncate font-mono">{p.page}</span>
              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${p.pct}%` }} />
              </div>
              <span className="text-xs text-slate-400 w-14 text-right">{p.views}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Projects Page ─────────────────────────────────────────────────────────────
function ProjectsPage({ onCreateProject, onViewProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await getConfigurations("PROJECTS", true);
        setProjects(response.documents || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const getRelativeTime = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`;
    return `${Math.floor(diffDays / 30)}mo ago`;
  };

  const statusColor = {
    Active: "text-emerald-600 bg-emerald-50",
    Draft: "text-amber-600 bg-amber-50",
    Archived: "text-slate-500 bg-slate-100",
  };

  const priorityColor = {
    low: "text-slate-600 bg-slate-100",
    medium: "text-blue-600 bg-blue-50",
    high: "text-red-600 bg-red-50",
  };

  const typeColor = {
    PROJECTS: "text-indigo-600 bg-indigo-50",
    SCREENS: "text-blue-600 bg-blue-50",
    FIELDS: "text-violet-600 bg-violet-50",
    LAYOUTS: "text-teal-600 bg-teal-50",
  };

  if (loading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Projects</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your projects.</p>
          </div>
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Icons.Plus />
            <span>Create Project</span>
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-12">
          <div className="flex items-center justify-center gap-3">
            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-slate-500">Loading projects...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Projects</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your projects.</p>
          </div>
          <button
            onClick={onCreateProject}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            <Icons.Plus />
            <span>Create Project</span>
          </button>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-500 mx-auto mb-3">
            <Icons.AlertTriangle />
          </div>
          <p className="text-sm text-slate-600">Failed to load projects</p>
          <p className="text-xs text-slate-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your projects.</p>
        </div>
        <button
          onClick={onCreateProject}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          <Icons.Plus />
          <span>Create Project</span>
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200/60 p-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 mx-auto mb-4">
            <Icons.Briefcase />
          </div>
          <p className="text-lg font-medium text-slate-900">No projects yet</p>
          <p className="text-sm text-slate-400 mt-1">Create your first project to get started</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
          <div className="grid grid-cols-12 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
            <span className="col-span-4 text-xs font-medium text-slate-500">Name</span>
            <span className="col-span-2 text-xs font-medium text-slate-500">Priority</span>
            <span className="col-span-2 text-xs font-medium text-slate-500">Status</span>
            <span className="col-span-2 text-xs font-medium text-slate-500">Scope</span>
            <span className="col-span-2 text-xs font-medium text-slate-500">Updated</span>
          </div>
          {projects.map((p) => {
            const data = p.data || {};
            return (
              <div
                key={p.id}
                onClick={() => onViewProject(p)}
                className="grid grid-cols-12 px-4 py-3 border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors items-center cursor-pointer"
              >
                <div className="col-span-4 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Icons.Briefcase />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-slate-800 block">{data.name || "Untitled"}</span>
                    <span className="text-xs text-slate-400">ID: #{p.id}</span>
                  </div>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${priorityColor[data.priority] || priorityColor.medium}`}>
                    {data.priority ? data.priority.charAt(0).toUpperCase() + data.priority.slice(1) : "Medium"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor[data.status] || statusColor.Draft}`}>
                    {data.status || "Draft"}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-600 capitalize">{data.scope || "Internal"}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-xs text-slate-400">{getRelativeTime(p.updatedAt || p.updated_at)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Dashboard Shell ───────────────────────────────────────────────────────────
function Dashboard() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [modal, setModal] = useState(null); // "createConfig" | "profile" | "logout" | "editConfig" | "createProject" | "viewProject"
  const [editingConfigId, setEditingConfigId] = useState(null);
  const [viewingProjectId, setViewingProjectId] = useState(null);
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if (userId) setUser({ userId: userId.slice(-8), fullId: userId, token });
  }, []);

  const confirmLogout = () => {
    logoutUser();
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleEditConfig = (config) => {
    setEditingConfigId(config.id);
    setModal("editConfig");
  };

  const handleCreateProject = () => {
    setModal("createProject");
  };

  const handleViewProject = (project) => {
    setViewingProjectId(project.id);
    setModal("viewProject");
  };

  const handleProjectCreated = () => {
    setProjectsRefreshKey(k => k + 1);
  };

  const handleProjectSaved = () => {
    setProjectsRefreshKey(k => k + 1);
  };

  const tabs = ["Overview", "Analytics", "Projects"];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-semibold text-sm">D</span>
              </div>
              <span className="font-semibold text-slate-800 text-sm tracking-tight">Dashboard</span>
            </div>

            {/* Center Nav Tabs */}
            <div className="hidden sm:flex items-center gap-1 bg-slate-100/50 p-1 rounded-lg">
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                    activeTab === item.toLowerCase()
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setModal("createConfig")}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Icons.Plus />
                <span>Create configuration</span>
              </button>

              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <Icons.Bell />
              </button>

              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <button
                  onClick={() => setModal("profile")}
                  className="w-7 h-7 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center hover:ring-2 hover:ring-emerald-300 transition-all"
                  title="Profile"
                >
                  <Icons.User />
                </button>
                <button
                  onClick={() => setModal("logout")}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Icons.LogOut />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 py-6">
        {activeTab === "overview" && (
          <OverviewPage 
            onCreateConfig={() => setModal("createConfig")} 
            onEditConfig={handleEditConfig}
          />
        )}
        {activeTab === "analytics" && <AnalyticsPage />}
        {activeTab === "projects" && (
          <ProjectsPage 
            key={projectsRefreshKey}
            onCreateProject={handleCreateProject} 
            onViewProject={handleViewProject}
          />
        )}
      </main>

      {/* Modals */}
      <CreateConfigModal open={modal === "createConfig"} onClose={() => setModal(null)} />
      <ProfileModal open={modal === "profile"} onClose={() => setModal(null)} user={user} />
      <LogoutModal open={modal === "logout"} onClose={() => setModal(null)} onConfirm={confirmLogout} />
      <EditConfigModal 
        open={modal === "editConfig"} 
        onClose={() => { setModal(null); setEditingConfigId(null); }}
        configId={editingConfigId}
        onSaved={() => {
          // Refresh the ConfigTable - could trigger a reload here
          console.log("Configuration saved");
        }}
      />
      <CreateProjectModal
        open={modal === "createProject"}
        onClose={() => setModal(null)}
        onCreated={handleProjectCreated}
      />
      <ViewEditProjectModal
        open={modal === "viewProject"}
        onClose={() => { setModal(null); setViewingProjectId(null); }}
        projectId={viewingProjectId}
        onSaved={handleProjectSaved}
      />
    </div>
  );
}

export default Dashboard;
