import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { getAllUsers, deleteUser, updateUser } from "../userService";

const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ fullName: "", email: "", role: "", bio: "", profilePictureUrl: "", category: "", hourlyFee: "", requirements: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [roleChangeConfirm, setRoleChangeConfirm] = useState(null);


  useEffect(() => {
    if (!user) return;

    if (user.role?.toString()?.toLowerCase() !== "admin") {
      return;
    }

    console.debug("AdminPage user", user);

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("getAllUsers failed", err);
        const msg = err?.response?.data?.message || err?.response?.data || err?.message || "Unable to load users. Make sure you are an admin.";
        setError(
          err?.response?.status === 401
            ? "Unauthorized. Please log in again."
            : err?.response?.status === 403
            ? "Forbidden. Your account does not have admin access."
            : `Unable to load users: ${msg}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user? This cannot be undone.")) return;

    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setActionMessage("User deleted successfully.");
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to delete user. Refresh and try again.");
    }
  };

  const openEditForm = (user) => {
    setEditingUser(user);
    setEditForm({
      fullName: user.fullName || "",
      email: user.email || "",
      role: user.role || "",
      bio: user.bio || "",
      profilePictureUrl: user.profilePictureUrl || "",
      category: user.category || "",
      hourlyFee: user.hourlyFee || "",
      requirements: user.requirements || "",
    });
    setRoleChangeConfirm(null);
    setActionMessage(null);
  };

  const closeEditForm = () => {
    setEditingUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    if (name === "role" && editingUser?.role !== value) {
      setRoleChangeConfirm(value);
    } else {
      setEditForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const confirmRoleChange = (newRole) => {
    setEditForm((prev) => ({ ...prev, role: newRole }));
    setRoleChangeConfirm(null);
  };

  const getRoleBadge = (role) => {
    const badges = {
      Admin: "bg-red-100 text-red-700",
      Expert: "bg-blue-100 text-blue-700",
      User: "bg-gray-100 text-gray-700",
    };
    return badges[role] || "bg-gray-100 text-gray-700";
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editForm.fullName?.trim()) {
      setActionMessage("Full name is required.");
      return;
    }
    if (!editForm.email?.trim()) {
      setActionMessage("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      setActionMessage("Please enter a valid email address.");
      return;
    }

    if (editForm.role === "Expert") {
      if (!editForm.category?.trim()) {
        setActionMessage("Category is required for experts.");
        return;
      }
      if (!editForm.hourlyFee || parseFloat(editForm.hourlyFee) <= 0) {
        setActionMessage("Hourly fee must be greater than 0.");
        return;
      }
    }

    setIsSaving(true);
    setActionMessage(null);

    try {
      const payload = {
        fullName: editForm.fullName,
        email: editForm.email,
        role: editForm.role,
        bio: editForm.bio,
        profilePictureUrl: editForm.profilePictureUrl,
      };

      if (editForm.role === "Expert") {
        payload.category = editForm.category;
        payload.hourlyFee = parseFloat(editForm.hourlyFee);
        payload.requirements = editForm.requirements;
      }

      await updateUser(editingUser.id, payload);

      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...editForm } : u)));
      setActionMessage("User updated successfully.");
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      setActionMessage("Failed to update user. Refresh and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Admin access required</h1>
          <p className="text-gray-600 mb-6">You need to sign in as an administrator to view this page.</p>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

if (user.role?.toString()?.toLowerCase() !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4 py-16">
        <div className="max-w-md rounded-2xl bg-white p-8 shadow-lg">
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Access denied</h1>
          <p className="text-gray-600 mb-6">You do not have administrative permissions.</p>
          <Link
            to="/profile"
            className="w-full inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            Go to Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-gray-600">Manage users and monitor the system.</p>

      {actionMessage && (
        <div className="mt-4 rounded-lg bg-green-100 px-4 py-2 text-sm text-green-700">{actionMessage}</div>
      )}

      {roleChangeConfirm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-lg">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Confirm Role Change</h2>
            <p className="mb-4 text-sm text-gray-600">
              You are about to change this user's role to <strong>{roleChangeConfirm}</strong>. Continue?
            </p>
            <div className="flex justify-between gap-2">
              <button
                type="button"
                onClick={() => setRoleChangeConfirm(null)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => confirmRoleChange(roleChangeConfirm)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            onSubmit={handleEditSubmit}
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg max-h-[90vh] overflow-y-auto"
          >
            <h2 className="mb-3 text-xl font-semibold text-gray-900">Edit User #{editingUser.id}</h2>
            <div className="space-y-3">
              <input
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                placeholder="Full Name"
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              />
              <input
                name="email"
                value={editForm.email}
                onChange={handleEditChange}
                placeholder="Email"
                type="email"
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              />
              <select
                name="role"
                value={editForm.role}
                onChange={handleEditChange}
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              >
                <option value="User">User</option>
                <option value="Expert">Expert</option>
                <option value="Admin">Admin</option>
              </select>
              <input
                name="bio"
                value={editForm.bio}
                onChange={handleEditChange}
                placeholder="Bio"
                className="w-full rounded-md border border-gray-200 px-3 py-2"
              />
            

              {editForm.role === "Expert" && (
                <>
                  <div className="border-t border-gray-200 pt-3 mt-3">
                    <p className="text-xs font-semibold text-gray-600 mb-2">Expert Details</p>
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      placeholder="Category (e.g., Plumbing, Electrical)"
                      className="w-full rounded-md border border-gray-200 px-3 py-2 mb-2"
                    />
                    <input
                      name="hourlyFee"
                      value={editForm.hourlyFee}
                      onChange={handleEditChange}
                      placeholder="Hourly Fee ($)"
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full rounded-md border border-gray-200 px-3 py-2 mb-2"
                    />
                   
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex justify-between gap-2">
              <button
                type="button"
                onClick={closeEditForm}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm text-red-700">{error}</div>
      )}

      <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">All Registered Users</h2>

        {loading ? (
          <p>Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 font-medium text-gray-600">ID</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Name</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Email</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Role</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Created</th>
                  <th className="px-3 py-2 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="px-3 py-2">{u.id}</td>
                    <td className="px-3 py-2">{u.fullName}</td>
                    <td className="px-3 py-2">{u.email}</td>
                    <td className="px-3 py-2">
                      <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getRoleBadge(u.role)}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-3 py-2">{new Date(u.createdAt).toLocaleString()}</td>
                    <td className="px-3 py-2 flex gap-2">
                      <button
                        onClick={() => openEditForm(u)}
                        className="rounded-md bg-yellow-500 px-2 py-1 text-xs font-semibold text-white hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="rounded-md bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-500"
                      >
                        Delete
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
  );
};

export default AdminPage;
