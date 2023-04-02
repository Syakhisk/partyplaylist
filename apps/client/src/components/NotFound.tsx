import brokenImage from "@/assets/broken-image.png";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex py-8 items-center justify-center h-screen">
      <div className="w-64">
        <h1 className="text-9xl font-mono font-extrabold drop-shadow italic">
          404
        </h1>
        <p className="text-lg">
          The resource you are looking can&apos;t be found
        </p>

        <Link to="/">
          <button className="mt-4 bg-red-500 text-white p-1 px-2 rounded flex items-center justify-center gap-2">
            <ArrowLeftIcon className="h-4 w-4" />
            <div>Go Back Home</div>
          </button>
        </Link>
      </div>
      <div className="h-64 w-64 opacity-50">
        <img className="drop-shadow" src={brokenImage} alt="broken image" />
      </div>
    </div>
  );
};

export default NotFound;

