import MapComponent from "@/components/MapComponent";
import InputForm from "@/components/InputForm";
import dynamic from "next/dynamic";

const DynamicMapComponent = dynamic(
  () => import("../components/MapComponent"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function Dashboard() {
  return (
    <div className="min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#2C2C2C] font-inter overflow-hidden">
      <div className="display flex center center pt-[30px] w-4/5">
        <InputForm />
        <DynamicMapComponent />
      </div>
    </div>
  );
}
