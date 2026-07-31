import { useEffect, useState } from "react";
import { Plus, Search, Eye, User } from "lucide-react";
import { Card, EmptyState } from "./ui";
import { fmtINR } from "../utils";
import { membersApi, fileUrl } from "../api";
import MemberViewModal from "./MemberViewModal";

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
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [viewingMember, setViewingMember] = useState(null);

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
      const payload = { ...form };
      if (profilePhoto) payload.profilePhoto = profilePhoto;
      if (aadharImage) payload.aadharImage = aadharImage;
      await membersApi.create(payload);
      setForm(emptyForm);
      setProfilePhoto(null);
      setAadharImage(null);
      document.getElementById("profilePhotoInput").value = "";
      document.getElementById("aadharImageInput").value = "";
      await refreshMembers();
    } finally {
      setSaving(false);
    }
  };

  // Called by the modal after an edit or delete so the list stays in sync.
  const handleModalChanged = async (updatedMember, deletedId) => {
    await refreshMembers();
    if (deletedId) {
      setViewingMember(null);
    } else if (updatedMember) {
      setViewingMember(updatedMember);
    }
  };

  const field = (key, placeholder, type = "text") => (
    <input
      type={type}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      placeholder={placeholder}
      className="font-body text-sm px-3 py-2 rounded border border-border bg-white focus:outline-none focus:ring-2 focus:ring-rule/40"
    />
  );

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="font-display text-lg font-semibold mb-3 text-ink">Add a member</div>
        <form onSubmit={submit} className="space-y-3">
          <div className="grid sm:grid-cols-3 gap-2">
            {field("name", "Full name")}
            {field("phone", "Phone number")}
            {field("address", "Address")}
            {field("fatherName", "Father's name")}
            {field("fatherPhone", "Father's phone")}
            {field("rentAmount", "Rent amount ₹", "number")}
            {field("foodAmount", "Food amount ₹", "number")}
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <label className="block">
              <span className="text-xs text-muted font-body block mb-1">Student profile photo</span>
              <input
                id="profilePhotoInput"
                type="file"
                accept="image/*"
                onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                className="font-body text-xs text-ink w-full file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-hover file:text-ink file:text-xs"
              />
            </label>
            <label className="block">
              <span className="text-xs text-muted font-body block mb-1">Aadhaar card image</span>
              <input
                id="aadharImageInput"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setAadharImage(e.target.files?.[0] || null)}
                className="font-body text-xs text-ink w-full file:mr-2 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-hover file:text-ink file:text-xs"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2 rounded bg-ink text-paper text-sm font-medium font-body hover:bg-inkSoft disabled:opacity-60"
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
              <li key={m._id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-hover border border-border overflow-hidden flex items-center justify-center shrink-0">
                    {m.profilePhoto ? (
                      <img src={fileUrl(m.profilePhoto)} alt={m.name} className="w-full h-full object-cover" />
                    ) : (
                      <User size={16} className="text-muted" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-body text-sm font-medium text-ink truncate">{m.name}</div>
                    <div className="font-num text-xs text-muted">
                      Rent ₹{fmtINR(m.rentAmount)} · Food ₹{fmtINR(m.foodAmount)}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setViewingMember(m)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-border text-sm font-body text-ink hover:bg-hover shrink-0"
                >
                  <Eye size={14} /> View
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {viewingMember && (
        <MemberViewModal
          member={viewingMember}
          onClose={() => setViewingMember(null)}
          onChanged={handleModalChanged}
        />
      )}
    </div>
  );
}