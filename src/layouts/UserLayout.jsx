import DashboardLayout from "./DashboardLayout";
import { userNavigation } from "../constants/navigation";
import { TEMP_USER, tempLogout } from "../mock/tempSession";

// TEMPORARY: the user and logout come from tempSession until Step 6 / Phase 3.
function UserLayout() {
  return (
    <DashboardLayout
      user={TEMP_USER}
      navigation={userNavigation}
      onLogout={tempLogout}
    />
  );
}

export default UserLayout;
