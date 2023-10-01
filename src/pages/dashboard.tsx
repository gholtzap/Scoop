import MapComponent from "@/components/MapComponent";
import InputForm from "@/components/InputForm";
import dynamic from "next/dynamic";
import Header from "../components/Header";
import InfoCard from "../components/InfoCard";
import { useState } from "react";
import { SymptomData } from "@/components/MapComponent";
import { Box, Card, Flex, Avatar, Text } from "@radix-ui/themes";
import { Grid } from "@mui/material";
import SymptomCard from "@/components/SymptomCard";
import SafetyGuidelinesCard from "@/components/SafetyGuidelinesCard";

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
      <div className="pt-40 max-h-[100vh] sm:min-h-screen relative bg-[#2C2C2C] font-inter overflow-hidden">
        <div className="w-11/12 mx-auto">
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Box>
                {/* <InputForm /> */}
                {selectedZipData && selectedAnalysis && (
                  <SymptomCard
                    data={selectedZipData}
                    analysis={selectedAnalysis}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={5}>
              <Box height="3">
                <DynamicMapComponent
                  className="flex-grow"
                  onZipDataChange={setSelectedZipData}
                  onAnalysisChange={setSelectedAnalysis}
                />
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box>
                {selectedZipData && selectedAnalysis && (
                  <InfoCard
                    data={selectedZipData}
                    analysis={selectedAnalysis}
                  />
                )}
              </Box>
            </Grid>
            <Grid item xs={2}>
              <Box>
                {selectedZipData && selectedAnalysis && (
                  <SafetyGuidelinesCard
                    data={selectedZipData}
                    analysis={selectedAnalysis}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}
