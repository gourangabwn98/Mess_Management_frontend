import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, Check, X, Search } from "lucide-react";
import { Card, EmptyState } from "./ui";
import { fmtINR } from "../utils";
import { membersApi } from "../api";

const emptyForm = {
  name: "",
  phone: "",
  address: "",
  fatherName: "",
  fatherPhone: "",
  rentAmount: "",
  foodAmount: "",
};

export default function MembersTab({ members, refreshMembers }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState(members);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);

  useEffect(() => setResults(members), [members]);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (!search.trim()) {
        setResults(members);
        return;
      }
      membersApi.list(search).then(setResults).catch(() => {});
    }, 250);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await membersApi.create(form);
      setForm(emptyForm);
      await refreshMembers();
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (m) => {
    setEditingId(m._id);
    setEditForm({
      name: m.name || "",
      phone: m.phone || "",
      address: m.address || "",
      fatherName: m.fatherName || "",
      fatherPhone: m.fatherPhone || "",
      rentAmount: m.rentAmount ?? "",
      foodAmount: m.foodAmount ?? "",
    });
  };

  const saveEdit = async () => {
    await membersApi.update(editingId, editForm);
    setEditingId(null);
    await refreshMembers();
  };

  const remove = async (id) => {
    await membersApi.remove(id);
    await refreshMembers();
  };

  const field = (obj, setObj, key, placeholder, type = "text") => (
    <input
      type={type}
      value={obj[key]}
      onChange={(e) => setObj({ ...obj, [key]: e.target.value })}
      placeholder={placeholder}
      className="font-body text-sm px-3 py-2 rounded border border-border bg-white focus:outline-none focus:ring-2 focus:ring-rule/40"
    />
  );

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="font-display text-lg font-semibold mb-3 text-ink">Add a member</div>
        <form onSubmit={submit} className="grid sm:grid-cols-3 gap-2">
          {field(form, setForm, "name", "Full name")}
          {field(form, setForm, "phone", "Phone number")}
          {field(form, setForm, "address", "Address")}
          {field(form, setForm, "fatherName", "Father's name")}
          {field(form, setForm, "fatherPhone", "Father's phone")}
          {field(form, setForm, "rentAmount", "Rent amount ₹", "number")}
          {field(form, setForm, "foodAmount", "Food amount ₹", "number")}
          <button
            type="submit"
            disabled={saving}
            className="sm:col-span-3 flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-ink text-paper text-sm font-medium font-body hover:bg-inkSoft disabled:opacity-60"
          >
            <Plus size={16} /> {saving ? "Adding…" : "Add member"}
          </button>
        </form>
      </Card>

      <Card className="p-5">
        <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
          <div className="font-display text-lg font-semibold text-ink">
            All members ({results.length})
          </div>
          <div className="relative">
            <Search size={15} className="absolute left-2.5 top-2.5 text-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, phone, address…"
              className="font-body text-sm pl-8 pr-3 py-2 rounded border border-border bg-white w-64 focus:outline-none focus:ring-2 focus:ring-rule/40"
            />
          </div>
        </div>

        {results.length === 0 ? (
          <EmptyState text={search ? "No members match your search." : "No members yet. Add your first mess member above."} />
        ) : (
          <ul className="divide-y divide-dashed divide-divider">
            {results.map((m) => (
              <li key={m._id} className="py-3">
                {editingId === m._id ? (
                  <div className="space-y-2">
                    <div className="grid sm:grid-cols-3 gap-2">
                      {field(editForm, setEditForm, "name", "Full name")}
                      {field(editForm, setEditForm, "phone", "Phone number")}
                      {field(editForm, setEditForm, "address", "Address")}
                      {field(editForm, setEditForm, "fatherName", "Father's name")}
                      {field(editForm, setEditForm, "fatherPhone", "Father's phone")}
                      {field(editForm, setEditForm, "rentAmount", "Rent amount ₹", "number")}
                      {field(editForm, setEditForm, "foodAmount", "Food amount ₹", "number")}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={saveEdit} className="p-1.5 rounded bg-good text-white"><Check size={15} /></button>
                      <button onClick={() => setEditingId(null)} className="p-1.5 rounded bg-hover"><X size={15} /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="font-body text-sm">
                      <div className="font-medium text-ink">{m.name}</div>
                      <div className="text-xs text-muted mt-0.5 space-y-0.5">
                        {m.phone && <div>Phone: {m.phone}</div>}
                        {m.address && <div>Address: {m.address}</div>}
                        {(m.fatherName || m.fatherPhone) && (
                          <div>
                            Father: {m.fatherName || "—"}
                            {m.fatherPhone ? ` (${m.fatherPhone})` : ""}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-4 mt-1.5 font-num text-xs">
                        <span className="text-ink">Rent: ₹{fmtINR(m.rentAmount)}</span>
                        <span className="text-ink">Food: ₹{fmtINR(m.foodAmount)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => startEdit(m)} className="p-1.5 rounded hover:bg-hover"><Pencil size={14} /></button>
                      <button onClick={() => remove(m._id)} className="p-1.5 rounded hover:bg-red-100 text-rule"><Trash2 size={14} /></button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
