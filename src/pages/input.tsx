import Header from "@/components/Header";
import InputForm from "@/components/InputForm";
import { Box } from "@mui/material";

function input() {
  return (
    // Center the form
    <div>
      <Header />
      <div className="min-h-[100vh] sm:min-h-screen w-screen flex flex-col relative bg-[#2C2C2C] font-inter overflow-hidden">
        <div className='mx-auto mt-[150px]'>
          <InputForm />
        </div>
      </div>
    </div>
  );
}

export default input;
