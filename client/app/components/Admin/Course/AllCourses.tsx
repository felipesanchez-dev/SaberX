import React from "react";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { DataGrid } from "@mui/x-data-grid";
import { Field } from "formik";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();

  const columns = [
    { Field: "id", headerName: "ID", flex: 0.5 },
    { Field: "tile", headerName: "Course Title", flex: 1 },
    { Field: "ratings", headerName: "Ratings", flex: 0.5 },
    { Field: "purchased", headerName: "Purchased", flex: 0.5 },
    { Field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      Field: "",
      headerName: "Delete",
      flex: 0.2,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <AiOutlineDelete
                className="dark:text-white text-black"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];

  const rows = [
    {
      id: "1234",
      title: "React",
      purchased: "30",
      ratings: "5",
      created_at: "18/03/25",
    },
  ];

  return (
    <div className="mt-[120px]">
      <Box m="20px">
        <Box
          m="40px 0 0 0"
          height="80vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
              outline: "none",
            },
            "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
              color: theme === "dark" ? "#fff" : "#000",
            },
            "& .MuiDataGrid-sortIcon": {
              color: theme === "dark" ? "#fff" : "#000",
            },
          }}
        ></Box>
      </Box>
    </div>
  );
};

export default AllCourses;
