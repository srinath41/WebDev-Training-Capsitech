import { Link } from "react-router-dom";

function Home() {
    return (
        <div className="text-center p-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-800">Welcome to the Task Manager App</h1>
          <p className="text-xl text-gray-600 mb-8">Manage projects and tasks easily!</p>
          <div className="flex justify-center space-x-4">
            <Link to="/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Login
              </button>
            </Link>
            <Link to="/register">
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                Register
              </button>
            </Link>
          </div>
        </div>
      );
}

export default Home;
