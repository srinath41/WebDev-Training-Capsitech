import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StudentRegistration = () => {
    const [isSubmitted, setIsSubmitted] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    age: "",
    email: "",
    course: "",
  });

  // Load saved values on mount
  useEffect(() => {
    setInitialValues({
      name: localStorage.getItem("name") || "",
      age: localStorage.getItem("age") || "",
      email: localStorage.getItem("email") || "",
      course: localStorage.getItem("course") || "",
    });
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    age: Yup.number()
      .required("Age is required")
      .positive("Age must be a positive number")
      .integer("Age must be an integer")
      .min(18, "Minimum age is 18 years")
      .max(25, "Maximum age is 25 years"),
    email: Yup.string()
      .email("Invalid email format")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        "Invalid email format"
      )
      .required("Email is required"),
    course: Yup.string().required("Course selection is required"),
  });

  const handleInputChange = (e, setFieldValue) => {
    const { name, value } = e.target;
    localStorage.setItem(name, value);
    setFieldValue(name, value);
  };

  const handleSubmit = (values, { resetForm }) => {
    console.log("Submitted Data:", values);
    localStorage.setItem("name", values.name);
    localStorage.setItem("age", values.age);
    localStorage.setItem("email", values.email);
    localStorage.setItem("course", values.course);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
    resetForm();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">Student Registration Form</h2>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-4">
            <div>
              <label className="block font-medium">Name</label>
              <Field
                type="text"
                name="name"
                className="border p-2 w-full rounded"
                value={values.name}
                onChange={(e) => handleInputChange(e, setFieldValue)}
              />
              <ErrorMessage name="name" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block font-medium">Age</label>
              <Field
                type="number"
                name="age"
                className="border p-2 w-full rounded"
                value={values.age}
                onChange={(e) => handleInputChange(e, setFieldValue)}
              />
              <ErrorMessage name="age" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block font-medium">Email</label>
              <Field
                type="email"
                name="email"
                className="border p-2 w-full rounded"
                value={values.email}
                onChange={(e) => handleInputChange(e, setFieldValue)}
              />
              <ErrorMessage name="email" component="div" className="text-red-500" />
            </div>
            <div>
              <label className="block font-medium">Course</label>
              <Field
                as="select"
                name="course"
                className="border p-2 w-full rounded"
                value={values.course}
                onChange={(e) => handleInputChange(e, setFieldValue)}
              >
                <option value="">Select a course</option>
                <option value="Python">Python</option>
                <option value="Node.js">Node.js</option>
                <option value="React">React</option>
              </Field>
              <ErrorMessage name="course" component="div" className="text-red-500" />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded w-full"
            >
              Submit
            </button>
          </Form>
        )}
      </Formik>
      {isSubmitted && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 border border-green-400 rounded">
          Form submitted successfully!
        </div>
      )}
    </div>
  );
};

export default StudentRegistration;
