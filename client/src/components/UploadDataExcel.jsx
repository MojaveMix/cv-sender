import { faFileImport } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { PostData } from "../services/methodes";
import { example1 } from "./contentexample";
import Spinner from "../common/Spinner";
import { useNavigate } from "react-router-dom";
const DEFAULT_PREVIEW_ROWS = 50;

export default function UploadDataExcel() {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingpost, setLoadingPost] = useState(false);
  const [error, setError] = useState("");
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const filteredRows = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter((r) =>
      r.some((cell) => (cell ?? "").toString().toLowerCase().includes(q))
    );
  }, [rows, query]);

  const previewRows = useMemo(() => {
    return showAll ? filteredRows : filteredRows.slice(0, DEFAULT_PREVIEW_ROWS);
  }, [filteredRows, showAll]);

  const handleFiles = (file) => {
    if (!file) return;
    setError("");
    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonOptions = { header: 1, raw: false, defval: "" };
        const sheetData = XLSX.utils.sheet_to_json(worksheet, jsonOptions);

        if (!sheetData || sheetData.length === 0) {
          throw new Error("Sheet is empty or could not be parsed.");
        }

        const firstRow = sheetData[0].map((h, i) =>
          h === "" ? `Column ${i + 1}` : h
        );

        const restRows = sheetData
          .slice(1)
          .filter((row) =>
            row.some(
              (cell) =>
                cell !== null &&
                cell !== undefined &&
                cell.toString().trim() !== ""
            )
          );

        // Optionally clean empty columns
        const nonEmptyIndexes = firstRow
          .map((header, i) =>
            sheetData.some(
              (row, rIdx) =>
                rIdx > 0 && row[i] && row[i].toString().trim() !== ""
            )
              ? i
              : null
          )
          .filter((i) => i !== null);

        const cleanHeaders = nonEmptyIndexes.map((i) => firstRow[i]);

        if (
          !cleanHeaders.includes("company_name") ||
          !cleanHeaders.includes("subject") ||
          !cleanHeaders.includes("role") ||
          !cleanHeaders.includes("email")
        ) {
          alert("Make sure you're respect the format");
          return;
        }

        const cleanRows = restRows.map((r) => nonEmptyIndexes.map((i) => r[i]));
        setHeaders(cleanHeaders);
        setRows(cleanRows);
      } catch (err) {
        console.error(err);
        setError(
          "Failed to parse file. Make sure it's a valid Excel or CSV file."
        );
        setHeaders([]);
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    // Prefer readAsArrayBuffer for better compatibility with xlsx
    reader.readAsArrayBuffer(file);
  };

  const onInputChange = (e) => {
    const file = e.target.files?.[0];
    handleFiles(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    handleFiles(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
  };
  const handleInsertData = async () => {
    try {
      rows.forEach(async (_, index) => {
        setLoadingPost(true);
        const company_name = rows[index][0];
        const role = rows[index][1];
        const subject = rows[index][2];
        const email = rows[index][3];
        const content = example1(role, company_name);
        await PostData("/create/email", {
          email,
          subject,
          content,
        });
      });

      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingPost(false);
    }
  };

  const clear = () => {
    setFileName("");
    setHeaders([]);
    setRows([]);
    setQuery("");
    setShowAll(false);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  //   const downloadJSON = () => {
  //     const json = rows.map((r) =>
  //       headers.reduce((acc, h, i) => {
  //         acc[h || `Column ${i + 1}`] = r[i] ?? "";
  //         return acc;
  //       }, {})
  //     );
  //     const blob = new Blob([JSON.stringify(json, null, 2)], {
  //       type: "application/json",
  //     });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download =
  //       (fileName ? fileName.replace(/\.[^.]+$/, "") : "data") + ".json";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   };

  //   const downloadCSV = () => {
  //     const csvData = [headers, ...rows]
  //       .map((row) =>
  //         row
  //           .map((cell) => {
  //             const s = (cell ?? "").toString();
  //             // escape quotes
  //             if (s.includes(",") || s.includes('"') || s.includes("\n")) {
  //               return `"${s.replace(/"/g, '""')}"`;
  //             }
  //             return s;
  //           })
  //           .join(",")
  //       )
  //       .join("\n");
  //     const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
  //     const url = URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download =
  //       (fileName ? fileName.replace(/\.[^.]+$/, "") : "data") + ".csv";
  //     a.click();
  //     URL.revokeObjectURL(url);
  //   };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white rounded-xl p-6 shadow-lg mb-6">
        <h1 className="text-2xl font-semibold">Upload Excel / CSV</h1>
        <p className="text-indigo-100 mt-1">
          Drag & drop or click to select a file. Preview the data and export as
          CSV/JSON.
        </p>
      </div>

      <div className="mt-5 w-full mb-3">
        <div className="italic font-medium text-sm text-gray-700">
          <span className="text-red-600">*</span> Please make sure your{" "}
          <b>excel</b> file follows the required format{" "}
          <span className="text-red-600">*</span>
        </div>

        <table className="w-full border-2 border-gray-300 mt-3 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600  border">
                company_name
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600  border">
                role
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600  border">
                subject
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600  border">
                email
              </th>
            </tr>
          </thead>
        </table>
      </div>

      <div
        className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-4 text-center hover:border-blue-400 transition-colors bg-white shadow-sm"
        onDrop={onDrop}
        onDragOver={onDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={onInputChange}
          className="hidden"
          id="file-input"
        />
        <div className="w-full flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <label
              htmlFor="file-input"
              className="cursor-pointer inline-flex items-center gap-3 rounded-md px-4 py-3 bg-gradient-to-r from-white to-gray-50 border border-gray-200 hover:shadow-md transition"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
            >
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v12m0 0l-3-3m3 3 3-3M21 21H3"
                />
              </svg>
              <div className="text-left">
                <div className="font-medium text-gray-800">
                  Click to upload or drag & drop
                </div>
                <div className="text-sm text-gray-500">
                  XLSX, XLS, CSV — up to a few MB
                </div>
              </div>
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
            >
              Browse
            </button>
            <button
              type="button"
              onClick={clear}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-between mt-2">
          <div className="text-sm text-gray-600">
            {fileName || "No file selected"}
          </div>
          <div className="flex items-center gap-3">
            {loading && (
              <div className="flex items-center gap-2 text-gray-500">
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Parsing...
              </div>
            )}
            {error && <div className="text-red-500 text-sm">{error}</div>}
          </div>
        </div>
      </div>

      {loadingpost ? (
        <Spinner />
      ) : (
        rows.length > 0 && (
          <div className="mt-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search preview..."
                  className="px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
                <div className="text-sm text-gray-500">
                  Previewing {filteredRows.length} rows
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAll((s) => !s)}
                  className="px-3 py-2 rounded-md bg-white border hover:bg-gray-50 transition"
                >
                  {showAll
                    ? "Show top 50"
                    : `Show all (${filteredRows.length})`}
                </button>
                {/* <button
                onClick={downloadCSV}
                className="px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
              >
                Export CSV
              </button>
              <button
                onClick={downloadJSON}
                className="px-3 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Export JSON
              </button> */}

                <button
                  type="button"
                  onClick={handleInsertData}
                  className="px-3 py-2 rounded-md bg-green-600 text-white  hover:bg-blue-700 transition"
                >
                  <FontAwesomeIcon
                    icon={faFileImport}
                    className="w-4 h-4 mr-2"
                  />
                  Insert data
                </button>
              </div>
            </div>

            <div className="overflow-auto border rounded-lg shadow-sm">
              <table className="min-w-full divide-y table-fixed">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {headers.map((h, i) => (
                      <th
                        key={i}
                        className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                      >
                        {h?.replace("_", " ")}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y">
                  {previewRows.length === 0 && (
                    <tr>
                      <td
                        colSpan={headers.length}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No matching rows.
                      </td>
                    </tr>
                  )}
                  {previewRows.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={rIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      {headers.map((_, cIdx) => (
                        <td
                          key={cIdx}
                          className="px-3 py-2 text-sm text-gray-700 align-top whitespace-nowrap overflow-hidden text-ellipsis max-w-xs"
                        >
                          {row[cIdx] ?? ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!showAll && filteredRows.length > DEFAULT_PREVIEW_ROWS && (
              <div className="mt-3 text-sm text-gray-500">
                Showing {DEFAULT_PREVIEW_ROWS} of {filteredRows.length} rows.
                Use "Show all" to view the rest.
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
