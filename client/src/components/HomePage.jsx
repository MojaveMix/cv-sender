import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileImport,
  faFilePdf,
  faPaperPlane,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import Modal from "../common/Modals";
const HomePage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const showAllEmails = useCallback(async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_URL_API}/all`);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    showAllEmails();
  }, [showAllEmails]);

  const handleDelete = async (id) => {
    try {
      if (!id) return;

      await axios.post(`${import.meta.env.VITE_URL_API}/delete`, {
        id,
      });

      showAllEmails();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMail = async () => {
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_URL_API}/send-email`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-[90%] mx-auto">
      <div className="flex w-full gap-3 mt-16 mb-8">
        <div className="text-center text-3xl font-semibold w-full ">
          All cover letter
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-red-600 text-white p-1 rounded text-sm w-24 flex items-center justify-center gap-1.5 "
        >
          <FontAwesomeIcon icon={faFilePdf} className="w-4 h-4" />
          Resume
        </button>
        <button
          type="button"
          onClick={() => navigate("/upload/cv")}
          className="bg-yellow-600 text-white p-1 rounded text-sm w-24 flex items-center justify-center gap-1.5 "
        >
          <FontAwesomeIcon icon={faFileImport} className="w-4 h-4" />
          Upload
        </button>
        <button
          type="button"
          onClick={handleSendMail}
          className="bg-green-600 text-white p-1 rounded text-sm w-24 flex items-center justify-center gap-1.5 "
        >
          <FontAwesomeIcon icon={faPaperPlane} className="w-4 h-4" />
          Send
        </button>
        <button
          type="button"
          onClick={() => navigate("/create")}
          className="bg-blue-600 text-white p-1 rounded text-sm w-24  flex items-center justify-center gap-1.5"
        >
          <FontAwesomeIcon icon={faPlus} className="w-4 h-4" />
          Create
        </button>
      </div>

      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        {!loading ? (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email Recipient
                </th>
                <th scope="col" className="px-6 py-3">
                  Subject
                </th>
                <th scope="col" className="px-6 py-3">
                  Content
                </th>

                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr
                  key={item.id}
                  className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {item.email}
                  </td>
                  <td className="px-6 py-4"> {item.subject}</td>
                  <td className="px-6 py-4">
                    {item.content.substring(0, 50)}...
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <a
                      href={`/update/${item.id}`}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                    <div
                      onClick={() => handleDelete(item.id)}
                      className="font-medium cursor-pointer text-red-600 dark:text-blue-500 hover:underline"
                    >
                      Delete
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          "Loading..."
        )}
      </div>

      <Modal isOpen={isOpen} setIsOpen={setIsOpen} title="My CV">
        <iframe
          src={`${import.meta.env.VITE_URL_API}/cv`}
          className="w-full h-screen"
          title="CV"
        />
      </Modal>
    </div>
  );
};

export default HomePage;
