import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Filter,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import api from "../services/api";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [summary, setSummary] = useState({
    total: 0,
    students: 0,
    admins: 0,
    verified: 0,
    active: 0,
    inactive: 0,
  });

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [roleFilter, setRoleFilter] = useState("All");

  const [verificationFilter, setVerificationFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);

  const [showDetails, setShowDetails] = useState(false);

  const [updating, setUpdating] = useState(false);

  /* =========================================================
     LOAD USERS
  ========================================================= */

  const loadUsers = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const params = {};

      if (roleFilter !== "All") {
        params.role = roleFilter;
      }

      if (verificationFilter !== "All") {
        params.verification = verificationFilter;
      }

      if (statusFilter !== "All") {
        params.status = statusFilter;
      }

      if (search.trim()) {
        params.search = search.trim();
      }

      const response = await api.get("/admin/users", {
        params,
      });

      setUsers(response.data?.users || []);

      setSummary(
        response.data?.summary || {
          total: 0,
          students: 0,
          admins: 0,
          verified: 0,
          active: 0,
          inactive: 0,
        },
      );
    } catch (error) {
      console.error("Admin Users Error:", error);

      setError(error?.response?.data?.message || "Unable to load users.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL / FILTER LOAD
  ========================================================= */

  useEffect(() => {
    loadUsers();
  }, [roleFilter, verificationFilter, statusFilter]);

  /* =========================================================
     SEARCH DEBOUNCE
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      loadUsers();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  /* =========================================================
     USER DETAILS
  ========================================================= */

  const openUserDetails = async (user) => {
    try {
      setSelectedUser(user);
      setShowDetails(true);

      const response = await api.get(`/admin/users/${user._id}`);

      setSelectedUser(response.data?.user || user);
    } catch (error) {
      console.error("User Details Error:", error);
    }
  };

  /* =========================================================
     STATUS UPDATE
  ========================================================= */

  const toggleUserStatus = async () => {
    if (!selectedUser?._id) {
      return;
    }

    try {
      setUpdating(true);

      const newStatus = selectedUser.isActive === false;

      const response = await api.put(
        `/admin/users/${selectedUser._id}/status`,
        {
          isActive: newStatus,
        },
      );

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setSelectedUser(updatedUser);

        setUsers((previous) =>
          previous.map((user) =>
            user._id === updatedUser._id ?
              {
                ...user,
                ...updatedUser,
              }
            : user,
          ),
        );
      }

      await loadUsers();
    } catch (error) {
      console.error("User Status Error:", error);

      setError(
        error?.response?.data?.message || "Unable to update user status.",
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================================
     VERIFICATION UPDATE
  ========================================================= */

  const toggleVerification = async () => {
    if (!selectedUser?._id) {
      return;
    }

    try {
      setUpdating(true);

      const newVerification = !selectedUser.isVerified;

      const response = await api.put(
        `/admin/users/${selectedUser._id}/verification`,
        {
          isVerified: newVerification,
        },
      );

      const updatedUser = response.data?.user;

      if (updatedUser) {
        setSelectedUser(updatedUser);

        setUsers((previous) =>
          previous.map((user) =>
            user._id === updatedUser._id ?
              {
                ...user,
                ...updatedUser,
              }
            : user,
          ),
        );
      }

      await loadUsers();
    } catch (error) {
      console.error("User Verification Error:", error);

      setError(
        error?.response?.data?.message || "Unable to update verification.",
      );
    } finally {
      setUpdating(false);
    }
  };

  /* =========================================================
     FILTERED USERS
  ========================================================= */

  const displayedUsers = useMemo(() => users, [users]);

  /* =========================================================
     DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] text-slate-900 dark:bg-[#070d18] dark:text-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                <UserCheck size={24} />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  Administration
                </p>

                <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                  Users Management
                </h1>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
              Manage CampusMart student accounts, verification and account
              status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => loadUsers(true)}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <UserStat label="Total" value={summary.total} icon={UserCheck} />

          <UserStat
            label="Students"
            value={summary.students}
            icon={UserCheck}
          />

          <UserStat label="Admins" value={summary.admins} icon={ShieldCheck} />

          <UserStat
            label="Verified"
            value={summary.verified}
            icon={CheckCircle2}
          />

          <UserStat label="Active" value={summary.active} icon={CheckCircle2} />

          <UserStat label="Inactive" value={summary.inactive} icon={UserX} />
        </div>

        {/* =====================================================
            FILTER BAR
        ===================================================== */}

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_170px_170px_170px_auto]">
            {/* SEARCH */}

            <div className="relative">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, student ID..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
              />
            </div>

            {/* ROLE */}

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Roles</option>

              <option value="student">Students</option>

              <option value="admin">Admins</option>
            </select>

            {/* VERIFICATION */}

            <select
              value={verificationFilter}
              onChange={(event) => setVerificationFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Verification</option>

              <option value="Verified">Verified</option>

              <option value="Unverified">Unverified</option>
            </select>

            {/* STATUS */}

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Status</option>

              <option value="Active">Active</option>

              <option value="Inactive">Inactive</option>
            </select>

            {/* FILTER */}

            <div className="flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
              <Filter size={17} />
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-sm font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            <AlertTriangle size={18} className="mt-0.5 shrink-0" />

            {error}
          </div>
        )}

        {/* =====================================================
            USERS
        ===================================================== */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {/* TABLE HEADER */}

          <div className="hidden grid-cols-[minmax(0,1.4fr)_180px_140px_140px_100px] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-slate-800 dark:bg-slate-800/60 md:grid">
            <span>User</span>
            <span>Student ID</span>
            <span>Verification</span>
            <span>Status</span>
            <span>Action</span>
          </div>

          {loading ?
            <div className="space-y-3 p-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-xl bg-slate-100 dark:bg-slate-800"
                />
              ))}
            </div>
          : displayedUsers.length === 0 ?
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <UserCheck size={25} />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-950 dark:text-white">
                No users found
              </h2>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Try changing your search or filters.
              </p>
            </div>
          : <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedUsers.map((user) => (
                <div
                  key={user._id}
                  className="grid gap-4 px-5 py-5 md:grid-cols-[minmax(0,1.4fr)_180px_140px_140px_100px] md:items-center"
                >
                  {/* USER */}

                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-sm font-black text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                      {user.profileImage ?
                        <img
                          src={user.profileImage}
                          alt={user.name}
                          className="h-full w-full object-cover"
                        />
                      : user.name?.charAt(0).toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                          {user.name}
                        </p>

                        {user.role === "admin" && (
                          <span className="rounded-md bg-purple-50 px-1.5 py-0.5 text-[9px] font-bold text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                            ADMIN
                          </span>
                        )}
                      </div>

                      <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                        <Mail size={12} />

                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>

                  {/* STUDENT ID */}

                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {user.studentId || "-"}
                  </div>

                  {/* VERIFICATION */}

                  <div>
                    {user.isVerified ?
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <CheckCircle2 size={13} />
                        Verified
                      </span>
                    : <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1.5 text-[10px] font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                        Pending
                      </span>
                    }
                  </div>

                  {/* STATUS */}

                  <div>
                    {user.isActive !== false ?
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    : <span className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-bold text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                        Inactive
                      </span>
                    }
                  </div>

                  {/* ACTION */}

                  <button
                    type="button"
                    onClick={() => openUserDetails(user)}
                    className="inline-flex w-fit items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
              ))}
            </div>
          }
        </div>

        {/* =====================================================
            DETAILS MODAL
        ===================================================== */}

        {showDetails && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/65 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900">
              {/* HEADER */}

              <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                    {selectedUser.profileImage ?
                      <img
                        src={selectedUser.profileImage}
                        alt={selectedUser.name}
                        className="h-full w-full object-cover"
                      />
                    : selectedUser.name?.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <h2 className="text-lg font-black text-slate-950 dark:text-white">
                      User Details
                    </h2>

                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Review and manage this CampusMart account.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5 p-6">
                {/* USER PROFILE */}

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-blue-600 text-xl font-black text-white">
                      {selectedUser.profileImage ?
                        <img
                          src={selectedUser.profileImage}
                          alt={selectedUser.name}
                          className="h-full w-full object-cover"
                        />
                      : selectedUser.name?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate text-xl font-black text-slate-950 dark:text-white">
                        {selectedUser.name}
                      </h3>

                      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                        <Mail size={14} />
                        {selectedUser.email}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-lg bg-blue-100 px-2.5 py-1 text-[10px] font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                          {selectedUser.role}
                        </span>

                        {selectedUser.isVerified && (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                            <ShieldCheck size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* INFORMATION */}

                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoBox
                    label="Student ID"
                    value={selectedUser.studentId || "-"}
                  />

                  <InfoBox
                    label="College"
                    value={selectedUser.college || "-"}
                  />

                  <InfoBox
                    label="Location"
                    value={selectedUser.location || "-"}
                  />

                  <InfoBox
                    label="Joined"
                    value={formatDate(selectedUser.createdAt)}
                  />

                  <InfoBox
                    label="Products"
                    value={selectedUser.productCount ?? 0}
                  />

                  <InfoBox
                    label="Orders"
                    value={selectedUser.orderCount ?? 0}
                  />
                </div>

                {/* BIO */}

                {selectedUser.bio && (
                  <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Bio
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {selectedUser.bio}
                    </p>
                  </div>
                )}

                {/* ACTIONS */}

                {selectedUser.role !== "admin" && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
                    <h3 className="text-sm font-black text-slate-950 dark:text-white">
                      Account Controls
                    </h3>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={toggleVerification}
                        disabled={updating}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-50 ${
                          selectedUser.isVerified ?
                            "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-300"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        <ShieldCheck size={17} />

                        {selectedUser.isVerified ?
                          "Remove Verification"
                        : "Verify User"}
                      </button>

                      <button
                        type="button"
                        onClick={toggleUserStatus}
                        disabled={updating}
                        className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition disabled:opacity-50 ${
                          selectedUser.isActive !== false ?
                            "border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {selectedUser.isActive !== false ?
                          <>
                            <UserX size={17} />
                            Deactivate Account
                          </>
                        : <>
                            <UserCheck size={17} />
                            Activate Account
                          </>
                        }
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* FOOTER */}

              <div className="border-t border-slate-200 px-6 py-5 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDetails(false)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* =========================================================
   USER STAT
========================================================= */

function UserStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          <Icon size={17} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="text-xl font-black text-slate-950 dark:text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 truncate text-sm font-bold text-slate-800 dark:text-slate-200">
        {value}
      </p>
    </div>
  );
}

export default AdminUsers;
