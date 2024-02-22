import { Input, Navbar } from "./components";

const App = () => {
  return (
    <div className="sm:py-[5%] sm:px-[7%] main-grad">
      <section className="flex flex-col p-9 border rounded-xl shadow-xl bg-white h-screen">
        <Navbar />
        <Input />
      </section>
    </div>
  );
};

export default App;
