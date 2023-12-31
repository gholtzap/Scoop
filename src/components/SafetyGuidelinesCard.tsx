// SymptomCard.tsx
import React from "react";
import { SymptomData } from "./MapComponent";
import { Card, Flex, Heading } from "@radix-ui/themes";
import { PersonIcon } from "@radix-ui/react-icons";

interface SymptomCardProps {
  data: SymptomData | null;
  analysis: string | null;
}

interface HealthData {
  possibleDiseases: string[];
  safetyGuidelines: {
    [disease: string]: string;
  };
  percentageReported: number;
  amountInfected: {
    [disease: string]: number;
  };
  populationDensity: string;
  symptomsCount: {
    [symptom: string]: number;
  };
  zipCode: string;
  population: number;
  ageDistribution: {
    "0-18": number;
    "19-35": number;
    "36-60": number;
    "61+": number;
  };
  vaccinationStatus: {
    fullyVaccinated: number;
    partiallyVaccinated: number;
    notVaccinated: number;
  };
  comorbidities: {
    diabetes: number;
    hypertension: number;
    respiratoryConditions: number;
  };
}

const MIN_BAR_WIDTH = 5;
const MAX_BAR_WIDTH = 100;

const calculateBarWidth = (count: number, population: number): string => {
  const ratio = count / population;
  const widthPercentage = Math.min(
    Math.max(ratio * 100, MIN_BAR_WIDTH),
    MAX_BAR_WIDTH
  );
  return `${widthPercentage}%`;
};

const calculateColor = (count: number, population: number): string => {
  const ratio = count / population;
  const percentage = Math.pow(Math.min(ratio / 0.1, 1), 0.5);

  const redAmount = Math.min(Math.floor(200 * percentage) + 55, 255);
  const greenAmount = Math.min(Math.floor(200 * (1 - percentage)) + 55, 255);

  return `rgb(${redAmount}, ${greenAmount}, 0)`;
};

const parseJsonString = (jsonString: string | null): JSON => {
  if (!jsonString) {
    return {} as JSON;
  }
  const jsonObject = JSON.parse(jsonString);
  return jsonObject;
};

const InfoCard: React.FC<SymptomCardProps> = ({ data, analysis }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const jsonData: HealthData = JSON.parse(analysis as string);
  const {
    possibleDiseases,
    safetyGuidelines,
    percentageReported,
    amountInfected,
    populationDensity,
    symptomsCount,
    zipCode,
    population,
    ageDistribution,
    vaccinationStatus,
    comorbidities,
  } = jsonData;
  console.log(analysis);
  return (
    <div className="grid grid-cols-1 gap-x-6 w-full justify-center">
      <div className="p-6 bg-[#2C2C2C] shadow-lg rounded-lg space-y-4 w-full border-2 border-[#25D0AB]">
        <div>
          <h3 className="text-2xl font-semibold text-[#25D0AB]">
            <div>
              <Flex direction="column">
                <Heading size="6">Health and Safety Guidelines</Heading>
              </Flex>
            </div>
          </h3>
        </div>
        {Object.keys(safetyGuidelines).map((guideline) => (
          <div className="border-t border-[#25D0AB] pt-4">
            <h4 className="text-lg font-semibold text-[#25D0AB] mb-2">
              {guideline}
            </h4>
            <p className="text-[#95F3D9]">{safetyGuidelines[guideline]}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InfoCard;
