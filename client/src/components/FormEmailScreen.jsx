import { useCallback, useEffect, useState } from "react";
import { example1, example2, example3 } from "./contentexample";
import { useNavigate } from "react-router-dom";
import { PostData } from "../services/methodes";
import { PromptService } from "../services/prompt.service";
import Spinner from "../common/Spinner";

const FormEmailScreen = () => {
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [selectexample, setSelctedExample] = useState(1);
  const navigate = useNavigate();
  const returnContentByExample = useCallback(() => {
    if (selectexample === 1) {
      setContent(example1(role, company));
    } else if (selectexample === 2) {
      setContent(example2(role, company));
    } else {
      setContent(example3(role, company));
    }
  }, [role, company, selectexample]);

  const handleCreateEmail = async (e) => {
    e.preventDefault();
    try {
      await PostData("/create/email", {
        email,
        subject,
        content,
      });
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    returnContentByExample();
  }, [returnContentByExample]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mt-16 text-2xl font-bold text-center mb-10">
        Create email cover letter :
      </div>
      <form
        className="w-full flex flex-col items-center"
        onSubmit={handleCreateEmail}
      >
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_name"
            id="floating_name"
            onChange={(e) => setCompany(e.target.value)}
            value={company}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_name"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Company name
          </label>
        </div>

        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_role"
            id="floating_role"
            onChange={(e) => setRole(e.target.value)}
            value={role}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_role"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Role / Position
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_email"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-5 group">
          <input
            type="text"
            name="floating_subject"
            id="floating_subject"
            onChange={(e) => setSubject(e.target.value)}
            value={subject}
            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            required
          />
          <label
            for="floating_subject"
            className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Subject
          </label>
        </div>

        <div className="w-full flex justify-center gap-7 items-center">
          <div className="flex gap-3 items-center">
            <label htmlFor="ex1">Example 1</label>
            <input
              onChange={(e) => setSelctedExample(1)}
              value={selectexample}
              type="radio"
              name="a"
              id="ex1"
              checked={selectexample === 1}
            />
          </div>
          <div className="flex gap-3 items-center">
            <label htmlFor="ex2">Example 2</label>
            <input
              onChange={(e) => setSelctedExample(2)}
              value={selectexample}
              type="radio"
              name="a"
              id="ex2"
              checked={selectexample === 2}
            />
          </div>
          <div className="flex gap-3 items-center">
            <label htmlFor="ex3">Example 3</label>
            <input
              onChange={(e) => setSelctedExample(3)}
              value={selectexample}
              type="radio"
              name="a"
              id="ex3"
              checked={selectexample === 3}
            />
          </div>
          <button
            type="button"
            onClick={() => PromptService(company, role, setContent, setLoading)}
            className="flex items-center gap-2 text-sm font-semibold text-[#017fe7]"
          >
            <img src="/img/ai.jpg" className="w-7 h-7" />
            AI
          </button>
        </div>

        {!loading ? (
          <>
            <div className="relative z-0 w-full mb-5 group mt-5 ">
              <textarea
                name="floating_first_name"
                id="floating_first_name"
                onChange={(e) => setContent(e.target.value)}
                value={content}
                className="block py-2.5 px-0 h-96 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
              />
              <label
                for="floating_first_name"
                className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >
                Content
              </label>
            </div>

            <button
              type="submit"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </>
        ) : (
          <Spinner />
        )}
      </form>
    </div>
  );
};

export default FormEmailScreen;
