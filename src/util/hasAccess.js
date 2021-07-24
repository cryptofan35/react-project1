import { allRoleNames } from "./roleNames";

export default function hasAccess(allowedRoles = allRoleNames, role) {
  if (allowedRoles.indexOf(role) < 0) {
    return false;
  }
  return true;
}
