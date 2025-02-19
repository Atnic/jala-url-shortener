import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import clsx from "clsx";

export function DeleteLinkModal({ link }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  // const [linkData, setLinkData] = useState({
  //   id: link.id,
  //   shortname: link?.fields?.shortname,
  //   url: link?.fields?.url,
  // });

  // const shortlink = link?.fields?.shortname;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const handleDelete = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    const loadingToast = toast.loading("Deleting your link");
    const linkDeleted = await fetch(`api/delete-link?linkId=${link.id}`);

    console.log(linkDeleted);
    if (linkDeleted.ok) {
      setIsSubmitting(false);
      setIsOpen(false);
      // mutate(`api/links`);
      toast.success("Link deleted!", { id: loadingToast });
      router.reload();
    } else {
      setIsOpen(false);
      setIsSubmitting(false);
      console.error("Edit Failed");
      toast.error("Cannot delete Your link", { id: loadingToast });
    }

    // console.log(linkDeleted);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full p-2 bg-red-100 hover:bg-red-200"
        >
          <TrashIcon className="w-4 h-4 text-red-500" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-white bg-opacity-80 blur-sm" />
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
                <Dialog.Panel className="w-full  max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="py-4 flex flex-col gap-4">
                    <div className="text-slate-600 text-lg">
                      Are you sure want to delete the link?
                    </div>
                    <div className="flex flex-row gap-2 items-center justify-between">
                      <button
                        disabled={isSubmitting}
                        onClick={closeModal}
                        className={clsx(
                          isSubmitting
                            ? "bg-slate-300"
                            : "bg-blue-100 text-jala-insight",
                          "p-2 w-full hover:bg-blue-200 rounded-md  font-medium py-2 text-center disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
                        )}
                      >
                        Cancel
                      </button>
                      <button
                        disabled={isSubmitting}
                        onClick={handleDelete}
                        className={clsx(
                          isSubmitting
                            ? "bg-slate-300"
                            : "bg-red-100 text-red-600",
                          "p-2 w-full hover:bg-blue-200 rounded-md  font-medium py-2 text-center disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
                        )}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* <Toaster /> */}
    </>
  );
}
