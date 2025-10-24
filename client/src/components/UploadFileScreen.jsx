import { useState, useRef, useCallback } from "react";
import { PostData } from "../services/methodes";

export default function UploadFileScreen() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const inputRef = useRef(null);

  const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

  const reset = () => {
    setFile(null);
    setError("");
    setUploading(false);
    setProgress(0);
    setSuccess(false);
  };

  const validateAndSet = (f) => {
    setError("");
    setSuccess(false);
    if (!f) return;
    if (
      f.type !== "application/pdf" &&
      !f.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Only PDF files are allowed.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("File is too large. Max size is 10 MB.");
      return;
    }
    setFile(f);
  };

  const onFiles = useCallback(
    (files) => {
      if (!files || files.length === 0) return;
      validateAndSet(files[0]);
    },
    [setFile]
  );

  const handleInputChange = (e) => {
    onFiles(e.target.files);
    // reset input value so same file can be selected again if needed
    e.target.value = null;
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFiles(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const startUpload = async () => {
    if (!file) {
      setError("Please select a PDF to upload.");
      return;
    }
    setError("");
    setUploading(true);
    setProgress(0);
    setSuccess(false);

    // Simulate upload progress. Replace with real upload logic below.
    const simulate = () =>
      new Promise((res) => {
        let p = 0;
        const id = setInterval(() => {
          p += Math.floor(Math.random() * 15) + 5;

          if (p >= 100) {
            p = 100;
            setProgress(p); // make sure final 100% is rendered
            clearInterval(id);
            setTimeout(res, 300);
          } else {
            setProgress(p);
          }
        }, 300);
      });

    try {
      // Example: real upload using fetch with FormData

      await simulate();

      const form = new FormData();
      console.log(file);
      form.append("file", file);

      const data = await PostData("/upload", form, {
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (!data) throw new Error("Upload failed");

      setSuccess(true);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const humanFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return (bytes / Math.pow(1024, i)).toFixed(1) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Upload PDF
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Upload a single PDF file. Max size 10 MB. Drag & drop or click to
          select.
        </p>

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`border-2 transition-all rounded-xl p-6 cursor-pointer flex items-center gap-6 ${
            dragActive
              ? "border-dashed border-indigo-400 bg-indigo-50"
              : "border-dashed border-gray-200 hover:border-indigo-300"
          }`}
          onClick={() => inputRef.current && inputRef.current.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              inputRef.current && inputRef.current.click();
            }
          }}
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-indigo-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-indigo-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 2v6m8 8v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m14-6l-2 2m0 0l-4-4m4 4V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8"
              />
            </svg>
          </div>

          <div className="flex-1">
            <input
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={handleInputChange}
            />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-800">
                  {file ? file.name : "Drop PDF here or click to browse"}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {file ? humanFileSize(file.size) : "Supported: PDF (.pdf)"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {file && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      reset();
                    }}
                    className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current && inputRef.current.click();
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 p-3 rounded">
            {error}
          </div>
        )}

        {file && (
          <div className="mt-6 bg-gray-50 p-4 rounded flex items-center gap-4">
            <div className="w-12 h-12 bg-white border rounded flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gray-700"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M12 2v6m8 8v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2m14-6l-2 2m0 0l-4-4m4 4V6a2 2 0 00-2-2H8a2 2 0 00-2 2v8"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-800">{file.name}</div>
                  <div className="text-xs text-gray-500">
                    {humanFileSize(file.size)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-700">
                    {uploading
                      ? "Uploading..."
                      : success
                      ? "Ready"
                      : "Ready to upload"}
                  </div>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {progress}% {success && "• Uploaded"}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={startUpload}
            disabled={uploading || !file}
            className={`px-5 py-2 rounded-md text-white font-medium shadow-sm transition disabled:opacity-50 ${
              file
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {uploading ? "Uploading..." : "Upload PDF"}
          </button>

          <button
            onClick={reset}
            className="px-4 py-2 rounded-md text-sm bg-white border text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>

          {success && (
            <div className="ml-auto text-sm text-green-600 bg-green-50 px-3 py-1 rounded">
              File uploaded successfully
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
