import React, { useState } from "react";
import * as XLSX from "xlsx";

function Result({ studentData, vacancyData }) {
  const [resultData, setResultData] = useState([]);

  const handleGenerateResult = () => {
    if (studentData.length === 0 || vacancyData.length === 0) {
      alert("Please upload both student and vacancy data first.");
      return;
    }

    // Create a new Excel workbook
    const wb = XLSX.utils.book_new();

    // Calculate selection based on marks
    const studentsWithSelectionData = [...studentData];
    const marksIndex = studentData[0].indexOf("Marks_Per");
    studentsWithSelectionData[0].push("Selected");

    for (let i = 1; i < studentsWithSelectionData.length; i++) {
      const marks = parseFloat(studentsWithSelectionData[i][marksIndex]);
      studentsWithSelectionData[i].push(marks >= 60 ? "Selected" : "Not Selected");
    }

    // Append student data sheet
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(studentsWithSelectionData), "StudentsWithSelection");

    // Append vacancy data sheet
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(vacancyData), "Vacancy");

    // Generate a Blob containing the Excel file
    const blob = XLSX.write(wb, { bookType: "xlsx", type: "blob" });

    // Create a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "result.xlsx";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h1>Result Page</h1>
      <button onClick={handleGenerateResult}>Generate Result Excel</button>
    </div>
  );
}

export default Result;
