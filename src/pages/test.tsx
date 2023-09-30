import InputForm from "@/components/InputForm";
import { Box } from "@mui/material";

function test() {
  return (
    // Center the form
    <div className="flex justify-center">
      <Box sx={{marginTop: '50px'}}>
        <InputForm />
      </Box>
    </div>
  );
}

export default test;
