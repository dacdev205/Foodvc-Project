import React from "react";
import { Modal, Box, Button } from "@mui/material";

// eslint-disable-next-line react/prop-types
const WarningModal = ({ open, onClose, onConfirm, message }) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   w-[400px] p-6 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-lg font-semibold mb-4 text-black">Cảnh báo!</h2>
        <p className="mb-4 text-black">{message}</p>
        <div className="flex justify-end gap-2">
          <Button onClick={onConfirm} variant="contained" color="success">
            Đã hiểu
          </Button>
        </div>
      </Box>
    </Modal>
  );
};

export default WarningModal;
