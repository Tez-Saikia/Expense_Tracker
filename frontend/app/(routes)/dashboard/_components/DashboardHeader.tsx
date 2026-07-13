import UserProfile from "@/app/_components/UserProfile";

function DashboardHeader() {
  return (
    <div className="shadow-sm p-5 border-b flex justify-end items-end">
      <UserProfile />
    </div>
  );
}

export default DashboardHeader;
