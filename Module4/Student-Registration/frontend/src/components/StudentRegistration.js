import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

const StudentRegistration = () => {
  const [students, setStudents] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/students");
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const initialValues = {
    name: editingStudent ? editingStudent.name : "",
    age: editingStudent ? editingStudent.age : "",
    email: editingStudent ? editingStudent.email : "",
    course: editingStudent ? editingStudent.course : "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.number()
      .required("Age is required")
      .positive("Age must be positive")
      .integer("Age must be an integer")
      .min(18, "Minimum age is 18")
      .max(25, "Maximum age is 25"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    course: Yup.string().required("Course is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      if (editingStudent) {
        await axios.put(`http://localhost:5000/students/${editingStudent._id}`, values);
      } else {
        await axios.post("http://localhost:5000/register", values);
      }
      resetForm();
      setEditingStudent(null);
      setIsFormVisible(false);
      fetchStudents();
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsFormVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/students/${id}`);
      setConfirmDelete(null);
      fetchStudents();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };


  const handleClose = () => {
    setIsFormVisible(false);
    setEditingStudent(null);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10 border border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex-1 text-center">Student List</h2>
        <button
          onClick={() => {
            setEditingStudent(null);
            setIsFormVisible(true);
          }}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all"
        >
          Add Student
        </button>
      </div>
  
      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
              {editingStudent ? "Edit Student Details" : "Student Registration Form"}
            </h2>
  
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
              {({ values, setFieldValue }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Name</label>
                    <Field type="text" name="name" className="border border-gray-300 p-3 w-full rounded-lg focus:border-blue-500 focus:ring-blue-200" />
                    <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
  
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Age</label>
                    <Field type="number" name="age" className="border border-gray-300 p-3 w-full rounded-lg focus:border-blue-500 focus:ring-blue-200" />
                    <ErrorMessage name="age" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
  
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Email</label>
                    <Field type="email" name="email" className="border border-gray-300 p-3 w-full rounded-lg focus:border-blue-500 focus:ring-blue-200" />
                    <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
  
                  <div>
                    <label className="block font-medium text-gray-700 mb-1">Course</label>
                    <Field as="select" name="course" className="border border-gray-300 p-3 w-full rounded-lg focus:border-blue-500 focus:ring-blue-200">
                      <option value="">Select a course</option>
                      <option value="Python">Python</option>
                      <option value="Node.js">Node.js</option>
                      <option value="React">React</option>
                    </Field>
                    <ErrorMessage name="course" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
  
                  <button type="submit" className="bg-blue-600 text-white p-3 rounded-lg w-full hover:bg-blue-700">
                    {editingStudent ? "Update" : "Submit"}
                  </button>
                </Form>
              )}
            </Formik>
  
            <button onClick={handleClose} className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-lg w-full hover:bg-gray-600">
              Close
            </button>
          </div>
        </div>
      )}
  
      <table className="w-full max-w-5xl mx-auto mt-6 border border-gray-200 shadow-lg rounded-xl">
        <thead>
          <tr className="bg-gray-100 text-gray-800 font-semibold">
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Age</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Course</th>
            <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student._id} className="hover:bg-gray-50 transition-all">
              <td className="border border-gray-300 px-4 py-2">{student.name}</td>
              <td className="border border-gray-300 px-4 py-2">{student.age}</td>
              <td className="border border-gray-300 px-4 py-2">{student.email}</td>
              <td className="border border-gray-300 px-4 py-2">{student.course}</td>
              <td className="border border-gray-300 px-4 py-2 flex justify-center space-x-2">
                <button onClick={() => handleEdit(student)} className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg hover:bg-yellow-600">
                  Edit
                </button>
                <button onClick={() => setConfirmDelete(student._id)} className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
  
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
            <p className="text-gray-700 font-medium">Are you sure you want to delete this student?</p>
            <div className="flex justify-end mt-4 space-x-3">
              <button onClick={() => setConfirmDelete(null)} className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default StudentRegistration;
