import DashboardLayout from "./DashboardLayout";
import { adminNavigation } from "../constants/navigation";
import { TEMP_ADMIN, tempLogout } from "../mock/tempSession";

// TEMPORARY: the user and logout come from tempSession until Step 6 / Phase 3.
function AdminLayout() {
  return (
    <DashboardLayout
      user={TEMP_ADMIN}
      navigation={adminNavigation}
      onLogout={tempLogout}
    />
  );
}

export default AdminLayout;
