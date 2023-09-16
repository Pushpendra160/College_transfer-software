import React, { useState } from "react";
import "./vacancy.css";
import * as XLSX from "xlsx";

function Vacancy() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [filteredTableData, setFilteredTableData] = useState([]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    try {
      if (selectedFile) {
        const fileReader = new FileReader();
        fileReader.onload = async (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Set the table data
          setTableData(excelData);

          // Filter the columns based on desired headers
          const desiredHeaders = [
            "S.No.",
            "Course",
            "Code",
            "Branch",
            "College Name",
            "City",
            "Vacancy"
          ];
          const filteredData = excelData.map((row) =>
            row.filter((cell, cellIndex) =>
              desiredHeaders.includes(excelData[0][cellIndex])
            )
          );
          setFilteredTableData(filteredData);
        };

        // Read the selected file as an array buffer
        fileReader.readAsArrayBuffer(selectedFile);
      } else {
        console.log("No file selected.");
      }
    } catch (error) {
      console.error("Error processing Excel file:", error);
    }
  };

  return (
    <div className="file-upload-container">
      <h1>VACANCY</h1>
      <div className="file-upload">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload}>Upload Excel File</button>
      </div>

      {filteredTableData.length > 0 && (
        <div className="student-list">
          <h2>Table</h2>
          <table>
            <thead>
              <tr>
                {filteredTableData[0].map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredTableData.slice(1).map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Vacancy;
