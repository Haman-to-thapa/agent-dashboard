import Footer from "./Footer";
import Header from "./Header";



export default function Home() {
  return (
    <div>
      <Header />
      <main className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Knowledge Hub</h1>
        <p className="text-lg">Please login or register to access dashboards.</p>
      </main>
      <Footer />
    </div>
  );
}
