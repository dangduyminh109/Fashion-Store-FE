import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>home page</h1>
      <Link to="/detail"> go detail page</Link>
    </>
  );
}

export default Home;
