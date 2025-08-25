import Breadcrumb from "~/components/Breadcrumb";

const listBreadcrumb = [
  {
    title: "Tổng Quan",
    url: "/",
  },
];

function Dashboard() {
  return (
    <>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tổng Quan" />
      <h1>Dashboard page</h1>
    </>
  );
}

export default Dashboard;
