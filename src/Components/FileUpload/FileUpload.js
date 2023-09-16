import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./FileUpload.css";

const FileUpload = () => {
  const [selectedStudentFile, setSelectedStudentFile] = useState(null);
  const [selectedVacancyFile, setSelectedVacancyFile] = useState(null);
  const [studentsByCollege, setStudentsByCollege] = useState({});

  const handleStudentFileChange = (event) => {
    setSelectedStudentFile(event.target.files[0]);
  };

  const handleVacancyFileChange = (event) => {
    setSelectedVacancyFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (selectedStudentFile && selectedVacancyFile) {
        const studentData = await processExcelFile(selectedStudentFile);
        const vacancyData = await processExcelFile(selectedVacancyFile);

        // Sort student data by college
        const sortedStudentData = sortDataByCollege(studentData);

        // Merge student and vacancy data based on the "College Name" column
        const mergedData = mergeDataByCollege(sortedStudentData, vacancyData);

        // Update the state with the merged data
        setStudentsByCollege(mergedData);
      } else {
        console.log("Please select both student and vacancy files.");
      }
    } catch (error) {
      console.error("Error processing Excel files:", error);
    }
  };

  const processExcelFile = async (file) => {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const excelData = XLSX.utils.sheet_to_json(worksheet);
        resolve(excelData);
      };

      // Read the file as an array buffer
      fileReader.readAsArrayBuffer(file);
    });
  };

  const sortDataByCollege = (data) => {
    const sortedData = {};
    data.forEach((student) => {
      const college = student["TransferCollege"];
      if (!sortedData[college]) {
        sortedData[college] = [];
      }
      sortedData[college].push(student);
    });
    return sortedData;
  };

  const mergeDataByCollege = (studentData, vacancyData) => {
    const mergedData = {};

    for (const college in studentData) {
      if (studentData.hasOwnProperty(college)) {
        const students = studentData[college];
        const matchingVacancy = vacancyData.find(
          (vacancy) => vacancy["College Name"] === college
        );

        if (matchingVacancy) {
          students.forEach((student) => {
            student["Vacancy"] = matchingVacancy["Vacancy"];
          });
        } else {
          students.forEach((student) => {
            student["Vacancy"] = null;
          });
        }

        mergedData[college] = students;
      }
    }

    return mergedData;
  };

  return (
    <div className="file-upload-container">
      <h1>College Transfer Software</h1>
      <div className="file-upload">
        <input type="file" onChange={handleStudentFileChange} />
        <input type="file" onChange={handleVacancyFileChange} />
        <button onClick={handleUpload}>Upload Excel Files</button>
      </div>

      {/* Render the student list within the component */}
      <div className="student-list">
        <h2>Student List</h2>

        {/* Iterate through each college */}
        {Object.keys(studentsByCollege).map((college, index) => (
          <div key={index}>
            <h3>{college}</h3>
            <table>
              <thead>
                <tr>
                  <th>Enrollment No</th>
                  <th>FirstName</th>
                  <th>Branch</th>
                  <th>Marks_Per</th>
                  <th>TransferCollege</th>
                  <th>Collegecode_transfer</th>
                  <th>Vacancy</th> {/* Display vacancy data */}
                  {/* Add more headings as needed */}
                </tr>
              </thead>
              <tbody>
                {/* Iterate through students in the current college */}
                {studentsByCollege[college].map((student, studentIndex) => (
  <tr key={studentIndex}>
    <td>{student["Enrollment No"]}</td>
    <td>{student["FirstName"]}</td>
    <td>{student["Branch"]}</td>
    <td>{student["Marks_Per"]}</td>
    <td>{student["TransferCollege"]}</td>
    <td>{student["Collegecode_transfer"]}</td>
    <td>{student["Vacancy"]}</td> {/* Display vacancy data */}
    {/* Add more data fields as needed */}
  </tr>
))}
{/* Make sure that the keys you use in your code match the column headers exactly as they appear in your Excel file, including spaces and capitalization. */}







              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
