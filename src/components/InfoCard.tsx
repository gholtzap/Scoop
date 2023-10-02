import React from "react";
import 'chart.js';
import { SymptomData } from "./MapComponent";
import { Card, Flex, Heading } from "@radix-ui/themes";
import { PersonIcon } from "@radix-ui/react-icons";
import { Chart, BarController, DoughnutController, BarElement, ArcElement, CategoryScale, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';

Chart.register(ArcElement, DoughnutController, BarController, BarElement, CategoryScale, LinearScale);
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
  comorbidities: [string];
}

const MIN_BAR_WIDTH = 5;
const MAX_BAR_WIDTH = 100;

const parseJsonString = (jsonString: string | null): JSON => {
  if (!jsonString) {
    return {} as JSON;
  }
  const jsonObject = JSON.parse(jsonString);
  return jsonObject;
};

const InfoCard: React.FC<SymptomCardProps> = ({ data, analysis }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  if (analysis && analysis.includes("'None'")) {
    analysis = "None";
  }

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

  const defaultAgeDistribution = {
    "0-18": 0,
    "19-35": 0,
    "36-60": 0,
    "61+": 0
  };

  const effectiveAgeDistribution = ageDistribution || defaultAgeDistribution;

  const ageDistributionDataForPie = {
    labels: ['0-18', '19-35', '36-60', '61+'],
    datasets: [{
      data: [
        effectiveAgeDistribution["0-18"],
        effectiveAgeDistribution["19-35"],
        effectiveAgeDistribution["36-60"],
        effectiveAgeDistribution["61+"]
      ],
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#25D0AB'],
      hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#25D0AB']
    }]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        display: true,
        labels: {
          boxWidth: 10,
          padding: 15
        }
      },
      title: {
        display: true,
        text: 'Age Distribution'
      },

      tooltip: {
        enabled: true,
        callbacks: {
          label: function (context: { label: string; parsed: any; }) {
            const label = context.label || '';
            const value = context.parsed;
            return `${label}: ${value}`;
          }
        }
      }
    }
  };

  return (
    <div className="grid grid-cols-1 gap-x-6 w-full justify-center">
      <div className="p-6 bg-[#2C2C2C] shadow-lg rounded-lg space-y-4 w-full border-2 border-[#25D0AB]">
        <div>
          <h3 className="text-2xl font-semibold text-[#25D0AB]">
            <div>
              <Flex direction="column">
                <Heading size="1">ZipCode</Heading>
                <Heading size="8">{data?.zip}</Heading>
              </Flex>
            </div>
          </h3>
          <div>
            {possibleDiseases.map((disease) => (
              <Card>
                <div
                  className="flex align-center justify-between"
                  key={disease}
                >
                  <span>{disease}</span>
                  <div className="flex align-center justify-center gap-1">
                    {amountInfected[disease]}
                    <PersonIcon />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        <div className="border-t border-[#25D0AB] pt-4">
          <h4 className="text-lg font-semibold text-[#25D0AB] mb-2">
            Population
          </h4>
          <p className="text-[#95F3D9]">{data?.population}</p>
        </div>

        <div className="border-t border-[#25D0AB] pt-4">
          <h4 className="text-lg font-semibold text-[#25D0AB] mb-2">
            % of Population Reported
          </h4>
          <p className="text-[#95F3D9]">{percentageReported}%</p>
          <div className="relative rounded-full overflow-hidden h-4 w-full bg-gray-300">
            <div style={{ width: `${percentageReported}%` }} className="absolute h-4 bg-[#25D0AB]"></div>
          </div>
        </div>
        <div className="border-t border-[#25D0AB] pt-4">
          <h4 className="text-lg font-semibold text-[#25D0AB] mb-2">
            Age Distribution
          </h4>
          <div className="flex gap-7">
            <div>
              <p className="text-[#95F3D9]">0-18: {ageDistribution["0-18"]}</p>
              <p className="text-[#95F3D9]">19-35: {ageDistribution["19-35"]}</p>
            </div>
            <div>
              <p className="text-[#95F3D9]">36-60: {ageDistribution["36-60"]}</p>
              <p className="text-[#95F3D9]">61+: {ageDistribution["61+"]}</p>
            </div>
          </div>
          <div style={{ width: '200px', height: '200px' }}>
            <Pie data={ageDistributionDataForPie} options={pieOptions} />
          </div>
          {comorbidities.length > 0 && (
            <div className="border-t border-[#25D0AB] pt-4">
              <h4 className="text-lg font-semibold text-[#25D0AB] mb-2">
                Possible Comorbidities
              </h4>
              {comorbidities.map((morbidity) => (
                <Card key={morbidity}>{morbidity}</Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoCard;
