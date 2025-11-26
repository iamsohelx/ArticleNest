import { Bird, ExternalLink, Loader, Search } from "lucide-react";
import { SparklesCore } from "./components/ui/sparkles";
import { useState, memo } from "react";
import { TextEffect } from "../components/motion-primitives/text-effect.jsx";
import { TextShimmer } from "../components/motion-primitives/text-shimmer.js"
import axios from "axios";
import toast from "react-hot-toast";

interface QueryState {
  query: string;
}

interface ResultItem {
  title: string;
  content: string;
  url: string;
}

interface ApiResponse {
  results: ResultItem[];
}


const MemoSparkles = memo(SparklesCore);

const Header = memo(() => (
  <div className="w-[95%] py-4 mt-5 flex justify-between fixed items-center">
    <h1 className="text-white font-poppins font-extrabold text-2xl">
     <TextShimmer duration={3}>
       ArticleNest
     </TextShimmer>
    </h1>
    <span className="text-white">
      <Bird />
    </span>
  </div>
));

const SearchBox = memo(function SearchBox({
  query,
  setQuery,
  handleSubmit,
}: {
  query: QueryState;
  setQuery: (value: QueryState) => void;
  handleSubmit: () => void;
}) {
  return (
    <div className="w-[80%] rounded-md flex gap-5 p-4 bg-white/15 text-white">
      <input
        className="border-none font-poppins w-full outline-none bg-transparent"
        type="text"
        placeholder="Enter your query"
        value={query.query}
        onChange={(e) => setQuery({ query: e.target.value })}
        onKeyDown={(e)=>{
         if(e.key === "Enter"){
          handleSubmit()
         }
        }}
      />

      <button className="cursor-pointer" onClick={handleSubmit}>
        <Search />
      </button>
    </div>
  );
});


function App() {
  const [query, setQuery] = useState<QueryState>({ query: "" });
  const [result, setResult] = useState<ResultItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const deleteContent = () => {
    setResult([]);
    setQuery({ query: "" });
    setLoading(false);
    setOpenDialog(false);
    toast.success("Resourses Deleted")
  };

  const handleSubmit = async (): Promise<void> => {
    if (!query.query.trim()) {
      toast.error("Please enter something");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post<ApiResponse>(
        "https://articlenest-xhxa.onrender.com",
        query
      );

      if (res.status === 200) {
        setResult(res.data.results);
        setOpenDialog(false);
      } else {
        toast.error("Sorry. Something went wrong");
      }
    } catch (error) {
      toast.error("Error while calling API");
      console.error(error);
    }
  };

  return (
    <>
      <div className="h-fit relative w-full bg-black overflow-scroll no-scrollbar">

        {/* Delete Confirmation */}
        {openDialog && (
          <div className="w-[90%] md:w-[400px] h-[150px] p-3 border border-gray-600 rounded-md shadow-2xl z-50 bg-white fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <h2 className="font-poppins font-bold">Are you sure?</h2>
            <p className="font-poppins mt-3 text-gray-600 text-[13px] md:text-[14px]">
              This action cannot be undone. This will permanently delete these curated resources.
            </p>
            <div className="absolute bottom-3 font-poppins text-xs flex gap-2">
              <button
                className="cursor-pointer px-6 py-2 bg-gray-800 text-white rounded-sm"
                onClick={() => setOpenDialog(false)}
              >
                cancel
              </button>
              <button
                className="cursor-pointer px-6 py-2 bg-red-400 text-white rounded-sm"
                onClick={deleteContent}
              >
                delete
              </button>
            </div>
          </div>
        )}

        {/* Background Sparkles */}
        <div className="w-full absolute inset-0 h-screen">
          <MemoSparkles
            id="tsparticlesfullpage"
            background="transparent"
            minSize={0.6}
            maxSize={1.4}
            particleDensity={100}
            className="w-full h-fit"
            particleColor="#FFFFFF"
          />
        </div>

        {/* Main Layout */}
        <div className="flex flex-col items-center w-screen">
          <Header />

          {/* Search Box */}
          <div className="w-[95%] z-10 h-fit py-4 mt-30 flex justify-center rounded-md">
            <SearchBox
              query={query}
              setQuery={setQuery}
              handleSubmit={handleSubmit}
            />
          </div>

          {/* Resources Header */}
          {result.length > 0 && (
            <div className="text-white z-20 font-poppins flex items-center justify-between w-[76%] mb-5">
              <h2 className="md:text-xl">Your Resources</h2>
              <button
                className="cursor-pointer text-xs md:text-xl py-2 px-4 md:px-6 bg-white/15 rounded-md"
                onClick={() => setOpenDialog(true)}
              >
                Delete Resources
              </button>
            </div>
          )}

          {/* Result Section */}
          <div className="w-[76%] h-fit min-h-screen rounded-md flex justify-center items-center flex-wrap gap-6 p-4 bg-white/15 text-white overflow-hidden no-scrollbar mb-5">
            {result.length > 0 ? (
              result.map((val, idx) => (
                <div
                  key={idx}
                  className="w-[550px] h-[400px] md:h-[250px] font-poppins flex flex-col text-black p-4 bg-white rounded-md z-20"
                >
                  <h1 className="font-bold text-xl">
                    <TextEffect per="char" preset="fade">
                      {val.title}
                    </TextEffect>
                  </h1>

                  <p className="mt-5 text-gray-600">
                    <TextEffect per="char" preset="blur" delay={1.5}>
                      {val.content.slice(0, 180)}
                    </TextEffect>
                  </p>

                  <a
                    className="mt-auto mx-auto cursor-pointer w-full flex justify-center items-center gap-2 rounded-sm py-3 text-white bg-gray-900"
                    href={val.url}
                    target="_blank"
                  >
                    Visit resource <ExternalLink />
                  </a>
                </div>
              ))
            ) : loading ? (
              <span>
                <Loader className="text-3xl animate-spin" />
              </span>
            ) : (
              <h1 className="text-center font-poppins text-gray-400 text-2xl">
                Type something to get results.
              </h1>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
