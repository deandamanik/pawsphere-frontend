// Single source of truth for "where does each role go after login".
// Used by the auth flow (redirect after login/register) and by the
// route guards. Change a destination here and the whole app follows.

export const ROLE_HOME = {
  user: "/", // pet owner / volunteer -> the normal public app
  vet: "/dashboard/vet", // veterinarian -> vet workspace
  shelter: "/dashboard/shelter", // shelter manager -> shelter workspace
  admin: "/dashboard/admin", // platform admin -> admin console
};

// Roles a visitor is allowed to pick on the public Register page.
// Must mirror the backend's SELF_REGISTER_ROLES (admin is created via seed).
export const REGISTERABLE_ROLES = [
  { value: "user", label: "Pemilik Hewan / Relawan" },
  { value: "vet", label: "Dokter Hewan" },
  { value: "shelter", label: "Pengelola Shelter" },
];

export const homeForRole = (role) => ROLE_HOME[role] || "/";