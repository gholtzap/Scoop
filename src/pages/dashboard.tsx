import MapComponent from "@/components/MapComponent";
import InputForm from "@/components/InputForm";
import dynamic from "next/dynamic";
import Header from '../components/Header';
import InfoCard from '../components/InfoCard';
import { useState } from "react";
import { SymptomData } from "@/components/MapComponent";

const DynamicMapComponent = dynamic(
  () => import("../components/MapComponent"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function Dashboard() {
  const [selectedZipData, setSelectedZipData] = useState<SymptomData | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  return (
    <div className="relative">
      <Header />
      <div className="pt-40 min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#2C2C2C] font-inter overflow-hidden">

        <div className="display flex center center pt-[30px] w-11/12">
          <InputForm />

          <div className="flex flex-row space-x-4 w-full items-start">
            <DynamicMapComponent
              className="flex-grow"
              onZipDataChange={setSelectedZipData}
              onAnalysisChange={setSelectedAnalysis}
            />
            {selectedZipData && selectedAnalysis && <InfoCard data={selectedZipData} analysis={selectedAnalysis} />}
          </div>


        </div>

      </div>
    </div>
  );
}

