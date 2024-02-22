import { Input, Navbar } from "./components";

const App = () => {
  return (
    <div className="lg:py-[5%] lg:px-[7%] main-grad">
      <section className="flex flex-col p-9 md:border rounded-xl md:shadow-xl bg-white min-h-screen">
        <Navbar />
        <Input />
      </section>
    </div>
  );
};

export default App;
