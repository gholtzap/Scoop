// SymptomCard.tsx
import React from "react";
import { SymptomData } from "./MapComponent";
import { Card } from "@radix-ui/themes";
import { PersonIcon } from "@radix-ui/react-icons";
interface SymptomCardProps {
  data: SymptomData | null;
  analysis: string | null;
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

const SymptomCard: React.FC<SymptomCardProps> = ({ data, analysis }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className="grid grid-cols-1 gap-x-6 w-full justify-center h-[700px]">
      <div className="p-6 bg-[#2C2C2C] shadow-lg rounded-lg space-y-4 border-2 border-[#25D0AB]">
        <h3 className="text-2xl font-semibold text-[#25D0AB]">Symptoms</h3>

        <div className="border-t border-[#25D0AB] pt-4">
          <div className="grid grid-cols-2 gap-x-6">
            {data?.symptoms &&
              Object.entries(data.symptoms)
                .sort(([, countA], [, countB]) => countB - countA)
                .map(([symptom, count]) => {
                  return (
                    <Card style={{ height: "4rem" }}>
                      <div
                        key={symptom}
                        className="text-[#95F3D9] flex justify-between items-center mb-4 w-full"
                      >
                        <div className="flex flex-col w-3/4">
                          <span className="mb-1">{symptom}</span>
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: calculateBarWidth(
                                count,
                                data.population || 1
                              ),
                              backgroundColor: calculateColor(
                                count,
                                data.population || 1
                              ),
                            }}
                          ></div>
                        </div>
                        <div className="flex align-center justify-center">
                          <PersonIcon />
                          <span
                            className="ml-4"
                            style={{
                              color: calculateColor(
                                count,
                                data.population || 1
                              ),
                            }}
                          >
                            {count}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
          </div>

          {/* {data?.symptoms && Object.entries(data.symptoms).length > 5 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#95F3D9] mt-2"
            >
              {isExpanded ? "Show Less" : "Show All"}
            </button>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default SymptomCard;
