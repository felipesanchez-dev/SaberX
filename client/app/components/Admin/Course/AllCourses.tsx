import React, { useEffect, useState } from "react";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { DataGrid } from "@mui/x-data-grid";
import { FiEdit2 } from "react-icons/fi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { format } from "timeago.js";
import "../../utils/timeago-es";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});

  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  const columns = [
    { field: "id", headerName: "ID DEL CURSO", width: 215 },
    { field: "title", headerName: "NOMBRE DEL CURSO", width: 225 },
    { field: "ratings", headerName: "CALIFICACIONES", width: 180 },
    { field: "purchased", headerName: "ADQUIRIDO", width: 130 },
    { field: "created_at", headerName: "FECHA DE CREACION", width: 215 },
    {
      field: " ",
      headerName: "",
      width: 50,
      renderCell: (params: any) => {
        return (
          <>
            <Button href={`/admin/edit-course/${params.row.id}`}>
              <FiEdit2 className="dark:text-white text-white" size={20} />
            </Button>
          </>
        );
      },
    },
    {
      field: "  ",
      headerName: "",
      width: 50,
      renderCell: (params: any) => {
        return (
          <>
            <Button>
              <AiOutlineDelete
                className="dark:text-white text-white"
                size={20}
                onClick={() => {
                  setOpen(!open);
                  setCourseId(params.row.id);
                }}
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

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      toast.success("Curso eliminado con éxito");
      refetch();
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const handleDelete = async () => {
    const id = courseId;
    await deleteCourse(id);
  };

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
          {open && (
            <Modal
              open={open}
              onClose={() => setOpen(!open)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="bg-white p-6 rounded-lg shadow-2xl w-96 mx-auto text-center transform transition-all duration-300 scale-105">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">
                  ¿Estás seguro de eliminar este curso?
                </h1>
                <p className="text-gray-600 mb-6">
                  Esta acción no se puede deshacer.
                </p>
                <div className="flex justify-around gap-4 mt-4">
                  <div
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all duration-200 cursor-pointer w-28 text-center"
                    onClick={() => setOpen(!open)}
                  >
                    Cancelar
                  </div>
                  <div
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200 cursor-pointer w-28 text-center shadow-md hover:shadow-red-500/50"
                    onClick={handleDelete}
                  >
                    Eliminar
                  </div>
                </div>
              </Box>
            </Modal>
          )}
        </Box>
      )}
    </div>
  );
};

export default AllCourses;
