import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Save,
  AlertTriangle,
  CheckCircle,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import {
  useChangePasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} from "../store/services/profile.api";
import { getImageUrl } from "../shared/getImageUrl";
import { toast } from "sonner";

const SETTINGS_SECTIONS = [
  {
    key: "profile",
    label: "Admin Profile",
    icon: Users,
    color: "var(--primary)",
  },
  {
    key: "password",
    label: "Change Password",
    icon: AlertTriangle,
    color: "var(--red)",
  },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [adminAvatar, setAdminAvatar] = useState<string | null>(null);
  const fileInputRef = useRef(null);
  const [team, setTeam] = useState([
    { id: 1, name: "Main Admin", email: "admin@giftbox.cd", role: "Owner" },
    {
      name: "Tech Support",
      email: "support@giftbox.cd",
      role: "Support",
    },
  ]);

  // need to call my api to get data

  const { data: profile, isLoading, refetch } = useGetProfileQuery({});
  const [updateProfile] = useUpdateProfileMutation();
  const [changePassword] = useChangePasswordMutation();

  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    role: "Admin",
  });
  const [form, setForm] = useState({
    name: "",
    phone: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saved, setSaved] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  const handleAddAdmin = () => {
    if (!newAdmin.name || !newAdmin.email) return;
    setTeam((prev) => [...prev, { id: Date.now(), ...newAdmin }]);
    setShowAddAdmin(false);
    setNewAdmin({ name: "", email: "", role: "Admin" });
  };
  useEffect(() => {
    if (profile?.data) {
      setForm({
        name: profile.data.name || "",
        phone: profile.data.phone || "",
      });
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    const formData = new FormData();
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }
    const data = {
      name: form.name,
      phone: form.phone,
      profileImage: imageFile,
    };
    formData.append("data", JSON.stringify(data));

    await updateProfile(formData)
      .unwrap()
      .then(() => {
        toast.success("Profile updated successfully");
        refetch();
      });
  };
  interface ChangePasswordData {
    currentPassword: string;
    confirmPassword: string;
    newPassword: string;
  }
  const handleChangePassword = async (payload: ChangePasswordData) => {
    const { currentPassword, confirmPassword, newPassword } = payload;
    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("New passwords do not match");
      return;
    }
    await changePassword({ currentPassword, newPassword, confirmPassword })
      .unwrap()
      .then(() => {
        toast.success("Password changed successfully");
      });
    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  if (isLoading) {
    return <div className="loading">Loading profile...</div>;
  }
  const profileData = profile?.data || {};

  return (
    <div>
      <div className="section-header mb-6">
        <div>
          <div className="section-title">System Settings</div>
          <div className="section-sub">
            Configure lottery system defaults and preferences
          </div>
        </div>
        <button
          className={`btn ${saved ? "btn-success" : "btn-primary"}`}
          onClick={() => {
            handleSave();
            handleUpdateProfile();
          }}
        >
          {saved ? (
            <>
              <CheckCircle size={14} /> Saved!
            </>
          ) : (
            <>
              <Save size={14} /> Save All Settings
            </>
          )}
        </button>
      </div>

      {saved && (
        <div
          style={{
            background: "rgba(16,185,129,.1)",
            border: "1px solid rgba(16,185,129,.25)",
            borderRadius: 10,
            padding: "12px 18px",
            marginBottom: 22,
            fontSize: 13,
            color: "var(--green)",
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <CheckCircle size={15} /> Settings saved successfully.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "220px 1fr",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* Section Sidebar */}
        <div className="card" style={{ padding: "8px 0" }}>
          {SETTINGS_SECTIONS.map((s) => (
            <div
              key={s.key}
              className={`cms-nav-item ${activeSection === s.key ? "active" : ""}`}
              onClick={() => setActiveSection(s.key)}
              style={{ borderRadius: 0 }}
            >
              <s.icon
                size={16}
                style={{
                  color:
                    activeSection === s.key ? s.color : "var(--text-muted)",
                }}
              />
              {s.label}
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div style={{ paddingBottom: 40 }}>
          {activeSection === "profile" && (
            <div className="settings-block">
              <div className="settings-block-header">
                <Users size={16} style={{ color: "var(--primary)" }} />
                Admin Profile
              </div>

              {/* Profile Picture */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "30px 0 20px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div
                  className="admin-avatar"
                  style={{
                    width: 100,
                    height: 100,
                    fontSize: 32,
                    overflow: "hidden",
                    marginBottom: 16,
                  }}
                >
                  {adminAvatar ? (
                    <img
                      src={adminAvatar}
                      alt="Preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : profileData?.profileImage ? (
                    <img
                      src={getImageUrl(profileData.profileImage)}
                      alt="Admin"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div className="admin-avatar-placeholder">
                      {profileData?.name?.charAt(0) || "AD"}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() =>
                    // @ts-ignore
                    fileInputRef.current && fileInputRef.current.click()
                  }
                >
                  <Upload size={14} /> Upload New Photo
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setAdminAvatar(URL.createObjectURL(e.target.files[0]));
                      setImageFile(e.target.files[0]);
                    }
                  }}
                />
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginTop: 8,
                  }}
                >
                  JPG, GIF or PNG. Max size of 800K
                </div>
              </div>

              <div
                style={{
                  padding: "32px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 32,
                }}
              >
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label
                    className="form-label"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Full Name
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    defaultValue={profileData?.name || "SUPER_ADMIN"}
                    disabled
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label
                    className="form-label"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Contact Number
                  </label>
                  <input
                    className="form-input"
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                </div>
                <div
                  className="form-group"
                  style={{ gridColumn: "span 2", marginBottom: 0 }}
                >
                  <label
                    className="form-label"
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    Email Address{" "}
                    <span
                      style={{
                        color: "var(--red)",
                        textTransform: "none",
                        fontWeight: 500,
                      }}
                    >
                      (Contact support to change)
                    </span>
                  </label>
                  <input
                    className="form-input"
                    type="email"
                    defaultValue={profileData?.email || "admin@giftbox.cd"}
                    disabled
                    style={{
                      background: "var(--bg-elevated)",
                      opacity: 0.7,
                      cursor: "not-allowed",
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "team" && (
            <div className="settings-block">
              <div className="settings-block-header">
                <Users size={16} style={{ color: "var(--primary)" }} />
                Team Management
                <button
                  className="btn btn-primary btn-sm"
                  style={{ marginLeft: "auto" }}
                  onClick={() => setShowAddAdmin(true)}
                >
                  <Plus size={13} /> Add Admin
                </button>
              </div>
              <div style={{ padding: "4px 20px 20px 20px" }}>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginBottom: 16,
                  }}
                >
                  Manage dashboard access for your team. Owners have full
                  control over the system.
                </div>
                <div className="table-wrap">
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {team.map((member) => (
                        <tr key={member.id}>
                          <td style={{ fontWeight: 600 }}>{member.name}</td>
                          <td style={{ color: "var(--text-muted)" }}>
                            {member.email}
                          </td>
                          <td>
                            <span
                              className={`badge ${member.role === "Owner" ? "badge-active" : "badge-draft"}`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="btn btn-ghost btn-sm"
                              style={{
                                padding: 6,
                                opacity: member.role === "Owner" ? 0.3 : 1,
                              }}
                            >
                              <Trash2
                                size={14}
                                style={{ color: "var(--red)" }}
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeSection === "password" && (
            <div className="settings-block">
              <div className="settings-block-header">
                <AlertTriangle size={16} style={{ color: "var(--red)" }} />
                Change Password
              </div>
              <div style={{ padding: "32px" }}>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
                  Admin Password
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "var(--text-muted)",
                    marginBottom: 28,
                  }}
                >
                  Ensure your account uses a strong, secure password. Last
                  changed 30 days ago.
                </div>
                <div style={{ display: "grid", gap: 20, maxWidth: 400 }}>
                  <div className="form-group">
                    <label className="form-label">Current Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                    />
                    <div className="form-hint">
                      Must be at least 8 characters tracking letters and
                      numbers.
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm New Password</label>
                    <input
                      className="form-input"
                      type="password"
                      placeholder="••••••••"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button
                      className="btn btn-primary"
                      onClick={() => handleChangePassword(passwordForm)}
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version Info */}
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "var(--text-tiny)",
          marginTop: 8,
        }}
      >
        GiftBox Admin v1.0.0 · Build 2026.04.20 · Environment: Production
      </div>

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="modal-overlay" onClick={() => setShowAddAdmin(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Invite New Admin</span>
              <button
                className="modal-close"
                onClick={() => setShowAddAdmin(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div
                style={{
                  fontSize: 13,
                  color: "var(--text-muted)",
                  marginBottom: 16,
                }}
              >
                They will receive an email instruction with a temporary password
                to access the dashboard.
              </div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. John Doe"
                  value={profileData?.name}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  className="form-input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">System Role</label>
                <select
                  className="form-select"
                  value={newAdmin.role}
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, role: e.target.value })
                  }
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Support">
                    Support (Read Only / Approvals)
                  </option>
                  <option value="Finance">Finance (Revenue Access Only)</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowAddAdmin(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={handleAddAdmin}
                disabled={!newAdmin.name || !newAdmin.email}
              >
                Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
