import { useEffect, useState } from "react";
import { Pencil, Check, X, RotateCcw } from "lucide-react";
import { Card, EmptyState } from "./ui";
import { menuApi } from "../api";

export default function MenuTab() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editLunch, setEditLunch] = useState("");
  const [editDinner, setEditDinner] = useState("");

  const load = () => {
    setLoading(true);
    menuApi.list().then(setMenu).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditLunch(item.lunch);
    setEditDinner(item.dinner);
  };
  const saveEdit = async (id) => {
    await menuApi.update(id, { lunch: editLunch, dinner: editDinner });
    setEditingId(null);
    load();
  };
  const resetMenu = async () => {
    if (!confirm("Restore the original weekly menu from the mess board?")) return;
    await menuApi.reset();
    load();
  };

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="font-display text-lg font-semibold text-ink">Weekly menu</div>
          <div className="text-xs text-muted font-body">From the mess board — tap the pencil to edit any day.</div>
        </div>
        <button
          onClick={resetMenu}
          className="flex items-center gap-1.5 text-xs font-body text-muted hover:text-ink px-2 py-1.5 rounded hover:bg-hover"
        >
          <RotateCcw size={13} /> Restore original
        </button>
      </div>

      {loading ? (
        <div className="text-muted font-body text-sm py-6 text-center">Loading…</div>
      ) : menu.length === 0 ? (
        <EmptyState text="No menu found." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-ink">
                <th className="text-left py-2 pr-3 font-display text-sm font-semibold text-ink w-28">
                  বার <span className="text-xs text-muted font-body">(Day)</span>
                </th>
                <th className="text-left py-2 px-3 font-display text-sm font-semibold text-ink">
                  দিন <span className="text-xs text-muted font-body">(Lunch)</span>
                </th>
                <th className="text-left py-2 pl-3 font-display text-sm font-semibold text-ink">
                  রাত <span className="text-xs text-muted font-body">(Dinner)</span>
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item._id} className="border-b border-dashed border-divider">
                  <td className="py-3 pr-3 align-top">
                    <div className="font-bn text-sm text-ink">{item.dayBn}</div>
                    <div className="text-xs text-muted font-body">{item.day}</div>
                  </td>
                  {editingId === item._id ? (
                    <>
                      <td className="py-3 px-3 align-top">
                        <input
                          value={editLunch}
                          onChange={(e) => setEditLunch(e.target.value)}
                          className="font-bn text-sm px-2 py-1.5 rounded border border-border bg-white w-full"
                        />
                      </td>
                      <td className="py-3 pl-3 align-top">
                        <input
                          value={editDinner}
                          onChange={(e) => setEditDinner(e.target.value)}
                          className="font-bn text-sm px-2 py-1.5 rounded border border-border bg-white w-full"
                        />
                      </td>
                      <td className="py-3 align-top">
                        <div className="flex gap-1.5">
                          <button onClick={() => saveEdit(item._id)} className="p-1.5 rounded bg-good text-white"><Check size={13} /></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 rounded bg-hover"><X size={13} /></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-3 px-3 align-top font-bn text-sm text-ink">{item.lunch}</td>
                      <td className="py-3 pl-3 align-top font-bn text-sm text-ink">{item.dinner}</td>
                      <td className="py-3 align-top">
                        <button onClick={() => startEdit(item)} className="p-1.5 rounded hover:bg-hover">
                          <Pencil size={13} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
