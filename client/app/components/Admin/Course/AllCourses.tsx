import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Modal } from "@mui/material";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { BiPencil } from "react-icons/bi";
import {
  useDeleteCourseMutation,
  useGetAllCoursesQuery,
} from "@/redux/features/courses/coursesApi";
import Loader from "../../Loader/Loader";
import { styles } from "@/app/styles/style";
import toast from "react-hot-toast";
import Link from "next/link";

type Props = {};

interface CourseGrid {
  id: string;
  title: string;
  purchased: number;
  ratings: number;
  price: string;
  created_at: string;
  updated_at: string;
}

interface Course {
  _id: string;
  name: string;
  purchased: number;
  ratings: number;
  price: string;
  createdAt: string;
  updatedAt: string;
}

const AllCourses = (props: Props) => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [courseld, setCourseId] = useState("");
  const { isLoading, data, refetch } = useGetAllCoursesQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );
  const [deleteCourse, { isSuccess, error }] = useDeleteCourseMutation({});

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
    };
    return date.toLocaleString(undefined, options);
  };

  const columns = [
    { field: "title", headerName: "Titulo del Curso", flex: 1 },
    { field: "ratings", headerName: "Puntuación", flex: 0.5 },
    { field: "price", headerName: "Precio", flex: 0.5 },
    { field: "purchased", headerName: "Comprado", flex: 0.5 },
    { field: "created_at", headerName: "Created At", flex: 0.5 },
    {
      field: " ",
      headerName: "Edit",
      flex: 0.2,
      renderCell: (params: { row: { id: string } }) => {
        return (
          <>
            <Link href={`/admin/edit-course/${params.row.id}`}>
              <BiPencil className=" text-green-600" size={25} />
            </Link>
          </>
        );
      },
    },
    {
      field: "",
      headerName: "Eliminar",
      flex: 0.2,
      renderCell: (params: { row: { id: string } }) => {
        return (
          <>
            <Button
              onClick={() => {
                setOpen(!open);
                setCourseId(params.row.id);
              }}
            >
              <AiOutlineDelete className=" text-red-500" size={25} />
            </Button>
          </>
        );
      },
    },
  ];

  const rows: CourseGrid[] = [];

  {
    data &&
      data?.courses.forEach((item: Course) => {
        rows.push({
          id: item._id,
          title: item.name,
          purchased: item.purchased,
          ratings: item.ratings,
          price: "$ " + item.price,
          created_at: formatDate(item.createdAt),
          updated_at: formatDate(item.updatedAt),
        });
      });
  }

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Curso eliminado exitosamente");
      setOpen(!open);
    }

    if (error && "data" in error) {
      const errorData = error.data as { message: string };
      toast.error(errorData.message);
    }
  }, [isSuccess, error]);

  const handleDelete = async () => {
    const id = courseld;

    await deleteCourse(id);
  };

  return (
    <div className="mt-[120px] ml-5 ">
      {isLoading ? (
        <Loader />
      ) : (
        <Box m="20px">
          <Box
            m="40px 0 0 0"
            height="80vh"
            sx={{
              "& .MuiDataGrid-root": { border: "none", outline: "none" },
              "& .css-pqjvzy-MuiSvgIcon-root-MuiSelect-icon ": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-sortIcon ": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-row ": {
                color: theme === "dark" ? "#fff" : "#000",
                borderBottom:
                  theme === "dark"
                    ? "1px solid #ffffff30!important"
                    : "1px solid #ccc!important",
              },
              "& .MuiTablePagination-root ": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-cell ": {
                borderBottom: "none",
                padding: "20px",
              },
              "& .name-column--cell ": {
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-columnHeaders ": {
                backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
                borderBottom: "none",
                color: theme === "dark" ? "#fff" : "#000",
              },
              "& .MuiDataGrid-virtualScroller": {
                backgroundColor: theme === "dark" ? "#1f2a40" : "#f2f0f0",
              },
              "& .MuiDataGrid-footerContainer": {
                color: theme === "dark" ? "#fff" : "#000",
                borderTop: "none",
                backgroundColor: theme === "dark" ? "#3e4396" : "#a4a9fc",
              },
              "& .MuiCheckbox-root": {
                color:
                  theme === "dark" ? `#b7ebde!important` : `#000 !important`,
              },
              "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                color: `#fff !important`,
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
              <Box className="absolute top-[35%] left-[35%] translate-x-1/2 transform-x-1/2 p-5 dark:bg-[#090909] bg-[#ffffffeb] rounded-lg">
                <h1 className={`${styles.title}`}>
                  Estas seguro que deseas eliminar <br /> este Curso?
                </h1>
                <div className="w-full flex items-center justify-between mb-4 mt-12">
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#57c7a3]`}
                    onClick={() => setOpen(!open)}
                  >
                    Cancelar
                  </div>
                  <div
                    className={`${styles.button} !w-[120px] h-[30px] bg-[#d63f41]`}
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
