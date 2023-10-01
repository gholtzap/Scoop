import MapComponent from "@/components/MapComponent";
import InputForm from "@/components/InputForm";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import InfoCard from "../components/InfoCard";
import { useState } from "react";
import { SymptomData } from "@/components/MapComponent";
import { Grid, Box, Card, Flex, Avatar, Text } from "@radix-ui/themes";
import SymptomCard from "@/components/SymptomCard";
const DynamicMapComponent = dynamic(
  () => import("../components/MapComponent"),
  {
    ssr: false,
    loading: () => <p>Loading map...</p>,
  }
);

export default function Dashboard() {
  const [selectedZipData, setSelectedZipData] = useState<SymptomData | null>(
    null
  );
  const [selectedAnalysis, setSelectedAnalysis] = useState<string | null>(null);

  return (
    <div className="relative">
      <Header />
      <div className="pt-40 max-h-[100vh] w-full sm:min-h-screen relative bg-[#2C2C2C] font-inter overflow-hidden">
        <Grid columns="3" gap="3" width="auto">
          <Box>
            {/* <InputForm /> */}
            {selectedZipData && selectedAnalysis && (
              <SymptomCard data={selectedZipData} analysis={selectedAnalysis} />
            )}
          </Box>
          <Box height="3">
            <DynamicMapComponent
              className="flex-grow"
              onZipDataChange={setSelectedZipData}
              onAnalysisChange={setSelectedAnalysis}
            />
          </Box>
          <Box>
            {selectedZipData && selectedAnalysis && (
              <InfoCard data={selectedZipData} analysis={selectedAnalysis} />
            )}
          </Box>
        </Grid>
      </div>
    </div>
  );
}
