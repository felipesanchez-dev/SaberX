import React from "react";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { DataGrid } from "@mui/x-data-grid";
import { FiEdit2 } from "react-icons/fi";
import { useGetAllCoursesQuery } from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import "../../utils/timeago-es";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();

  const { isLoading, data, error } = useGetAllCoursesQuery({});

  const columns = [
    { field: "id", headerName: "ID DEL CURSO", width: 215 },
    { field: "title", headerName: "NOMBRE DEL CURSO", width: 225 },
    { field: "ratings", headerName: "CALIDAD DEL CURSO", width: 200 },
    { field: "purchased", headerName: "ADQUIRIDO", width: 150 },
    { field: "created_at", headerName: "FECHA DE CREACION", width: 215 },
    {
      field: " ",
      headerName: "",
      width: 100,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <FiEdit2 className="dark:text-white text-white" size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      headerName: "",
      width: 100,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <AiOutlineDelete
                className="dark:text-white text-white"
                size={20}
              />
            </Button>
          </>
        );
      },
    },
  ];
  const rows: any = [];
  {
    data &&
      data.courses.forEach((item: any) => {
        rows.push({
          id: item._id,
          title: item.name,
          ratings: item.ratings,
          purchased: item.purchased,
          created_at: format(item.createdAt, "es-ES"),
        });
      });
  }

  return (
    <div className="w-full flex items-center justify-center min-h-screen mt-10 mx-auto py-1 mb-5 shadow-lg rounded-xl p-5 bg-gradient-to">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px" width="95%" maxWidth="1200px">
          <Box
            m="25px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": {
                border: "none",
                outline: "none",
              },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon": {
                color: theme === "dark" ? "#3a2c59" : "#333",
              },
              "& .MuiDataGrid-sortIcon": {
                color: theme === "dark" ? "#b0bec5" : "#333",
              },
              "& .MuitablePagination-root": {
                color: theme === "dark" ? "#b0bec5" : "#333",
              },
              "& .MuiDataGrid-cell": {
                color: theme === "dark" ? "#ecf3f5" : "#1e1e1e",
                fontWeight: 500,
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme === "dark" ? "#121607" : "#170f25",
                borderBottom: "none",
                color: theme === "dark" ? "dark" : "dark",
                fontWeight: "bold",
                textTransform: "uppercase",
                fontSize: "1rem",
              },

              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#002448" : "#3a2c59",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#e2e2e2" : "#000",
                border: "none",
                backgroundColor: theme === "dark" ? "#717976" : "#A4A9FC",
              },
              "& .MuiCheckBox-root": {
                color:
                  theme === "dark" ? "#e2e2e2 !important" : "#000 !important",
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                backgroundColor: theme === "dark" ? "#002448" : "#A4A9FC",
                borderBottom: "none",
                color: theme === "dark" ? "#002448" : "#000",
              },
            }}
          >
            <DataGrid checkboxSelection rows={rows} columns={columns} />
          </Box>
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
