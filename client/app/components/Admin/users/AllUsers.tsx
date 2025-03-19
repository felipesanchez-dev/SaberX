import React, { FC, useState } from "react";
import { Box, Button } from "@mui/material";
import { AiOutlineDelete, AiOutlineMail } from "react-icons/ai";
import { useTheme } from "next-themes";
import { DataGrid } from "@mui/x-data-grid";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import "../../utils/timeago-es";
import { useGetAllUsersQuery } from "../../../../redux/features/user/userApi";
import { FiEdit2 } from "react-icons/fi";

type Props = {
  isTeam: boolean;
};

const AllUsers: FC<Props> = ({ isTeam }) => {
  const { theme, setTheme } = useTheme();
  const [active, setActive] = useState(false);

  const { isLoading, data } = useGetAllUsersQuery({});

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "NOMBRE DEL USUARIO", width: 230 },
    { field: "email", headerName: "EMAIL", width: 200 },
    { field: "role", headerName: "ROL", width: 100 },
    { field: "courses", headerName: "CURSOS", width: 100 },
    { field: "created_at", headerName: "FECHA DE CREACION", width: 210 },
    {
      field: "",
      headerName: "Eliminar",
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
    {
      field: "  ",
      headerName: "EMAIL",
      width: 100,
      renderCell: (params: any) => {
        return (
          <Button
            href={`mailto:${params.row.email}`}
            style={{ minWidth: "0", padding: "5px" }}
          >
            <AiOutlineMail
              className={`${theme === "dark" ? "text-white" : "text-black"}`}
              size={20}
            />
          </Button>
        );
      },
    },
  ];
  const rows: any = [];

  if (isTeam) {
    const newData =
      data &&
      data.users.filter(
        (item: any) =>
          item.role === "admin" ||
          item.role === "Docente" ||
          item.role === "Moderador"
      );

    newData &&
      newData.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
          created_at: format(item.createdAt, "es-ES"),
        });
      });
  } else {
    data &&
      data.users.forEach((item: any) => {
        rows.push({
          id: item._id,
          name: item.name,
          email: item.email,
          role: item.role,
          courses: item.courses.length,
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
          <div className="w-full flex justify-end p-2">
            <Button
              variant="contained"
              color="secondary"
              className="!w-auto bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:scale-105"
              startIcon={<FiEdit2 />}
              style={{ borderRadius: "25px" }}
              onClick={() => setActive(!active)}
            >
              Agregar mas usuarios con roles elevados
            </Button>
          </div>

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

export default AllUsers;
