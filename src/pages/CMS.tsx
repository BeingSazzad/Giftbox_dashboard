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
import {
  useCreateAdminMutation,
  useDeleteAdminFromDBMutation,
  useGetAllAdminFromDBQuery,
} from "../store/services/createAdmin.api";

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

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [showAddAdmin, setShowAddAdmin] = useState(false);

  // API
  const { data, isLoading } = useGetRolesQuery({});
  const { data: privacyData, isLoading: isPrivacyLoading } =
    useGetRolesPrivacyQuery({});
  const {
    data: aboutData,
    isLoading: isAboutLoading,
    refetch,
  } = useGetRolesAboutQuery({});

  const [createRoles] = useCreateRolesMutation();
  const [createAboutRoles] = useCreateAboutRolesMutation();
  const [createPrivacyRoles] = useCreatePrivacyRolesMutation();

  // create user
  const [createAdmin] = useCreateAdminMutation();
  const {
    data: allAdmins,
    isLoading: isAllAdminsLoading,
    refetch: refetchAllAdmins,
  } = useGetAllAdminFromDBQuery({});

  // delete user
  const [deleteAdmins] = useDeleteAdminFromDBMutation();

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

      toast.success("Content saved successfully");
    } catch (error: any) {
      toast.error(`${error.message}`);
    }
  };

  const handleCreateUser = async () => {
    const toastId = toast.loading("Creating admin...");
    await createAdmin({
      name: newAdmin.name,
      email: newAdmin.email,
      password: newAdmin.password,
      role: "ADMIN",
    })
      .unwrap()
      .then(() => {
        toast.success("Admin created successfully");
      })
      .catch((error: any) => {
        toast.error(`${error.data.message}`);
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
  };

  const deleteAdmin = async (id: number) => {
    const toastId = toast.loading("Deleting admin...");
    await deleteAdmins(id)
      .unwrap()
      .then(() => {
        toast.success("Admin deleted successfully");
        refetchAllAdmins();
      })
      .catch((error: any) => {
        console.error("Error deleting admin:", error);
        toast.error(`${error.data.message}`);
      })
      .finally(() => {
        toast.dismiss(toastId);
      });
  };

  if (isLoading || isPrivacyLoading || isAboutLoading || isAllAdminsLoading) {
    return <div className="loading">Loading...</div>;
  }

  const adminData = allAdmins?.data?.data || [];

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
                  {adminData?.map((admin: any) => (
                    <tr key={admin._id}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.role}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteAdmin(admin._id)}
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
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 420,
              borderRadius: 16,
              padding: 0,
              overflow: "hidden",
            }}
          >
            {/* HEADER */}
            <div
              style={{
                padding: "18px 22px",
                borderBottom: "1px solid var(--border)",
                fontWeight: 600,
                fontSize: 16,
              }}
            >
              Add Admin
            </div>

            {/* BODY */}
            <div
              style={{
                padding: 22,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <input
                placeholder="Full Name"
                value={newAdmin.name}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, name: e.target.value })
                }
                className="form-input"
              />

              <input
                placeholder="Email Address"
                value={newAdmin.email}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, email: e.target.value })
                }
                className="form-input"
              />
              <input
                placeholder="Password"
                type="password"
                value={newAdmin.password}
                onChange={(e) =>
                  setNewAdmin({ ...newAdmin, password: e.target.value })
                }
                className="form-input"
              />

              {/* FIXED ROLE */}
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                  }}
                >
                  Role
                </div>

                <div
                  style={{
                    padding: "10px 12px",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                    background: "var(--bg-elevated)",
                    fontWeight: 600,
                  }}
                >
                  ADMIN
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <div
              style={{
                padding: "16px 22px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                className="btn btn-ghost"
                onClick={() => setShowAddAdmin(false)}
              >
                Cancel
              </button>

              <button
                className="btn btn-primary"
                onClick={handleCreateUser}
                disabled={
                  !newAdmin.name || !newAdmin.email || !newAdmin.password
                }
              >
                Add Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
