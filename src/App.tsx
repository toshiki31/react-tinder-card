import { Stack } from "@mui/material";
import { Link } from "@tanstack/react-router";

const App = () => {
  return (
    <div className="min-h-screen w-screen flex justify-center items-center">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Stack spacing={2}>
          <Link to="/about" className="bg-blue-500 text-white p-4 mt-4">
            To About
          </Link>
          <Link to="/banner" className="bg-blue-500 text-white p-4 mt-4">
            To Banner
          </Link>
        </Stack>
      </div>
    </div>
  );
};

export default App;
