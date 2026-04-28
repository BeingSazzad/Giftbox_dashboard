import { useEffect, useState } from "react";
import { Save, Plus, Trash2, FileText, Shield, Users } from "lucide-react";
import {
  useCreateRolesMutation,
  useCreateAboutRolesMutation,
  useCreatePrivacyRolesMutation,
  useGetRolesAboutQuery,
  useGetRolesPrivacyQuery,
  useGetRolesQuery,
} from "../store/services/role.api";
import { toast } from "sonner";

const CMS_SECTIONS = [
  { key: "terms", label: "Terms & Conditions", icon: FileText },
  { key: "privacy", label: "Privacy Policy", icon: Shield },
  { key: "about", label: "About Us", icon: FileText },
  { key: "team", label: "Team Management", icon: Users },
];

export default function CMS() {
  const [activeSection, setActiveSection] = useState("terms");

  const [content, setContent] = useState({
    terms: "",
    privacy: "",
    about: "",
  });

  const [saved, setSaved] = useState(false);

  // TEAM STATE (unchanged)
  const [team, setTeam] = useState([
    {
      id: 1,
      name: "Main Admin",
      email: "admin@giftbox.cd",
      role: "Owner",
    },
  ]);

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });

  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // API
  const { data, isLoading } = useGetRolesQuery({});
  const { data: privacyData, isLoading: isPrivacyLoading } =
    useGetRolesPrivacyQuery({});
  const { data: aboutData, isLoading: isAboutLoading } = useGetRolesAboutQuery(
    {},
  );

  const [createRoles] = useCreateRolesMutation();
  const [createAboutRoles] = useCreateAboutRolesMutation();
  const [createPrivacyRoles] = useCreatePrivacyRolesMutation();

  // TERMS
  useEffect(() => {
    if (data?.data?.content) {
      setContent((prev) => ({
        ...prev,
        terms: data.data.content,
      }));
    }
  }, [data]);

  // PRIVACY
  useEffect(() => {
    if (privacyData?.data?.content) {
      setContent((prev) => ({
        ...prev,
        privacy: privacyData.data.content,
      }));
    }
  }, [privacyData]);

  // ABOUT
  useEffect(() => {
    if (aboutData?.data?.content) {
      setContent((prev) => ({
        ...prev,
        about: aboutData.data.content,
      }));
    }
  }, [aboutData]);

  // SAVE (MAIN FIX)
  const handleSave = async () => {
    try {
      if (activeSection === "terms") {
        await createRoles({ content: content.terms, type: "TERMS" }).unwrap();
      }

      if (activeSection === "privacy") {
        await createPrivacyRoles({
          content: content.privacy,
          type: "PRIVACY",
        }).unwrap();
      }

      if (activeSection === "about") {
        await createAboutRoles({
          content: content.about,
          type: "ABOUT",
        }).unwrap();
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);

      toast.success("Content saved successfully");
    } catch (error) {
      toast.error("Failed to save content");
    }
  };

  // TEAM (unchanged)
  const addAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;

    setTeam((prev) => [...prev, { id: Date.now(), ...newAdmin }]);
    setNewAdmin({ name: "", email: "", role: "Admin" });
    setShowAddAdmin(false);
  };

  const deleteAdmin = (id: number) => {
    setTeam((prev) => prev.filter((t) => t.id !== id));
  };

  if (isLoading || isPrivacyLoading || isAboutLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="section-header mb-6">
        <div>
          <div className="section-title">Content Management</div>
          <div className="section-sub">Manage Terms, Privacy & Team</div>
        </div>

        <button
          className={`btn ${saved ? "btn-success" : "btn-primary"}`}
          onClick={handleSave}
        >
          <Save size={16} /> {saved ? "Saved!" : "Save & Publish"}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 22,
        }}
      >
        {/* SIDEBAR */}
        <div className="card" style={{ padding: "8px 0" }}>
          {CMS_SECTIONS.map((s) => (
            <div
              key={s.key}
              className={`cms-nav-item ${
                activeSection === s.key ? "active" : ""
              }`}
              onClick={() => setActiveSection(s.key)}
            >
              <s.icon size={16} />
              {s.label}
            </div>
          ))}
        </div>

        {/* CONTENT */}
        <div>
          {(activeSection === "terms" ||
            activeSection === "privacy" ||
            activeSection === "about") && (
            <div className="card" style={{ padding: 24 }}>
              <div style={{ fontWeight: 700, marginBottom: 10 }}>
                {activeSection === "terms"
                  ? "Terms & Conditions"
                  : activeSection === "privacy"
                    ? "Privacy Policy"
                    : "About Us"}
              </div>

              {/* EDITOR */}
              <textarea
                className="cms-editor form-textarea"
                value={content[activeSection]}
                onChange={(e) =>
                  setContent((c) => ({
                    ...c,
                    [activeSection]: e.target.value,
                  }))
                }
                rows={12}
                style={{
                  fontFamily: "monospace",
                  fontSize: 13,
                  lineHeight: 1.8,
                }}
              />
            </div>
          )}

          {/* TEAM */}
          {activeSection === "team" && (
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>Team Management</h3>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => setShowAddAdmin(true)}
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <table style={{ width: "100%", marginTop: 20 }}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {team.map((t) => (
                    <tr key={t.id}>
                      <td>{t.name}</td>
                      <td>{t.email}</td>
                      <td>{t.role}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteAdmin(t.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ADD ADMIN MODAL */}
      {showAddAdmin && (
        <div className="modal-overlay" onClick={() => setShowAddAdmin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">Add Admin</div>

            <div className="modal-body">
              <input
                placeholder="Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="form-input"
              />

              <input
                placeholder="Email"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="form-input"
              />

              <select
                value={newAdmin.role}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, role: e.target.value })
                }
                className="form-input"
              >
                <option>Admin</option>
                <option>Support</option>
                <option>Finance</option>
              </select>
            </div>

            <div className="modal-footer">
              <button className="btn" onClick={() => setShowAddAdmin(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={addAdmin}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
