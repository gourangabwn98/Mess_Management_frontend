import { useState } from "react";
import { X, Pencil, Trash2, Check, User, FileImage } from "lucide-react";
import { fmtINR } from "../utils";
import { membersApi, fileUrl } from "../api";

export default function MemberViewModal({ member, onClose, onChanged }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: member.name || "",
    phone: member.phone || "",
    address: member.address || "",
    fatherName: member.fatherName || "",
    fatherPhone: member.fatherPhone || "",
    rentAmount: member.rentAmount ?? "",
    foodAmount: member.foodAmount ?? "",
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [saving, setSaving] = useState(false);

  const field = (key, placeholder, type = "text") => (
    <input
      type={type}
      value={form[key]}
      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      placeholder={placeholder}
      className="font-body text-sm px-3 py-2 rounded border border-border bg-white w-full focus:outline-none focus:ring-2 focus:ring-rule/40"
    />
  );

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      if (profilePhoto) payload.profilePhoto = profilePhoto;
      if (aadharImage) payload.aadharImage = aadharImage;
      const updated = await membersApi.update(member._id, payload);
      setEditing(false);
      setProfilePhoto(null);
      setAadharImage(null);
      onChanged(updated);
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!confirm(`Delete ${member.name}? This also removes their payment history.`)) return;
    await membersApi.remove(member._id);
    onChanged(null, member._id); // signal deletion
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className="bg-card max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-sm shadow-xl margin-rule"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-divider">
          <div className="font-display text-lg font-semibold text-ink">
            {editing ? "Edit member" : "Member details"}
          </div>
          <button onClick={onClose} className="p-1.5 rounded hover:bg-hover"><X size={16} /></button>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex gap-4">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-hover border border-border overflow-hidden flex items-center justify-center">
                {member.profilePhoto ? (
                  <img src={fileUrl(member.profilePhoto)} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <User size={28} className="text-muted" />
                )}
              </div>
              <div className="text-[10px] text-muted font-body mt-1">Profile photo</div>
              {editing && (
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)}
                  className="text-[10px] mt-1 w-20"
                />
              )}
            </div>

            <div className="text-center">
              <div className="w-20 h-20 rounded bg-hover border border-border overflow-hidden flex items-center justify-center">
                {member.aadharImage ? (
                  <img src={fileUrl(member.aadharImage)} alt="Aadhaar" className="w-full h-full object-cover" />
                ) : (
                  <FileImage size={28} className="text-muted" />
                )}
              </div>
              <div className="text-[10px] text-muted font-body mt-1">Aadhaar card</div>
              {editing && (
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setAadharImage(e.target.files?.[0] || null)}
                  className="text-[10px] mt-1 w-20"
                />
              )}
              {!editing && member.aadharImage && (
                <a
                  href={fileUrl(member.aadharImage)}
                  target="_blank"
                  rel="noreferrer"
                  className="block text-[10px] text-rule underline mt-0.5"
                >
                  View full
                </a>
              )}
            </div>
          </div>

          {editing ? (
            <div className="grid grid-cols-2 gap-2">
              {field("name", "Full name")}
              {field("phone", "Phone number")}
              <div className="col-span-2">{field("address", "Address")}</div>
              {field("fatherName", "Father's name")}
              {field("fatherPhone", "Father's phone")}
              {field("rentAmount", "Rent amount ₹", "number")}
              {field("foodAmount", "Food amount ₹", "number")}
            </div>
          ) : (
            <dl className="font-body text-sm space-y-1.5">
              <Row label="Name" value={member.name} />
              <Row label="Phone" value={member.phone} />
              <Row label="Address" value={member.address} />
              <Row label="Father's name" value={member.fatherName} />
              <Row label="Father's phone" value={member.fatherPhone} />
              <Row label="Rent amount" value={`₹${fmtINR(member.rentAmount)}`} num />
              <Row label="Food amount" value={`₹${fmtINR(member.foodAmount)}`} num />
            </dl>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-divider">
          <button
            onClick={remove}
            className="flex items-center gap-1.5 px-3 py-2 rounded text-rule hover:bg-red-50 text-sm font-body"
          >
            <Trash2 size={15} /> Delete member
          </button>

          {editing ? (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-2 rounded bg-hover text-sm font-body text-ink"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex items-center gap-1.5 px-3 py-2 rounded bg-good text-white text-sm font-body disabled:opacity-60"
              >
                <Check size={15} /> {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded bg-ink text-paper text-sm font-body hover:bg-inkSoft"
            >
              <Pencil size={15} /> Edit member
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, num }) {
  return (
    <div className="flex justify-between border-b border-dashed border-divider py-1">
      <dt className="text-muted">{label}</dt>
      <dd className={`text-ink ${num ? "font-num" : ""}`}>{value || "—"}</dd>
    </div>
  );
}