import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
export default function Modal({
  heading,
  children,
  isOpen,
  setIsOpen,
  withExitButton = true,
  maxWidth = "600px",
}) {
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50 modal" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className={`w-full transform overflow-hidden rounded-lg  p-3 text-left align-middle shadow-xl transition-all`}
                style={{
                  maxWidth,
                  backgroundColor: "#fff",
                  color: "#1c4069",
                }}
              >
                {withExitButton && (
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                  >
                    <span className="mr-5">{heading}</span>
                    <button
                      onClick={closeModal}
                      style={{
                        backgroundColor: "#1c4069",
                        color: "#fff",
                      }}
                      className={`p-1 rounded-md flex flex-col items-center cursor-pointer`}
                    >
                      <FontAwesomeIcon
                        icon={faClose}
                        className="w-5 h-5 cursor-pointer "
                      />
                    </button>
                  </Dialog.Title>
                )}
                <div className="mt-2 w-full">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
