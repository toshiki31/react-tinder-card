import { Link } from "@tanstack/react-router";

const App = () => {
  return (
    <div className="min-h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Link to="/about" className="bg-blue-500 text-white p-4 mt-4">
          To About
        </Link>
      </div>
    </div>
  );
};

export default App;
