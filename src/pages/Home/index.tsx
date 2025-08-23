import { Link } from "react-router-dom";
import Breadcrumb from "~/components/Breadcrumb";

const listBreadcrumb = [
  {
    title: "Tổng Quan",
    url: "/",
  },
];

function Home() {
  return (
    <>
      <Breadcrumb listBreadcrumb={listBreadcrumb} title="Tổng Quan" />
      <h1>home page</h1>
      <Link to="/detail"> go detail page</Link>
    </>
  );
}

export default Home;
