import { Dialog, Transition } from "@headlessui/react";
import { useSWRConfig } from "swr";
import { Fragment, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import {
  PencilSquareIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import { DeleteLinkModal } from "./DeleteLinkModal";

export function EditLinkModal({ link }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [linkData, setLinkData] = useState({
    id: link.id,
    shortname: link?.fields?.shortname,
    url: link?.fields?.url,
  });
  const [editedLinkData, setEditedLinkData] = useState({
    id: link.id,
    shortname: link?.fields?.shortname,
    url: link?.fields?.url,
  });
  const { mutate } = useSWRConfig();

  const shortlink = link?.fields?.shortname;

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  const submitForm = async (data: any) => {
    const loadingToast = toast.loading("Edit Your link");
    setFormError(false);
    let checkShortname;
    let submitForm;
    try {
      const airtableBody = {
        records: [
          {
            id: data.id,
            fields: {
              shortname: data.shortname,
              url: data.url,
            },
          },
        ],
      };

      if (editedLinkData.shortname != linkData.shortname) {
        checkShortname = await fetch(
          `api/links?filterByFormula=shortname='${data.shortname}'`
        ).then((res) => {
          return res.json();
        });
      } else {
        submitForm = await fetch(
          `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(airtableBody),
          }
        );
        if (submitForm?.ok) {
          if (submitForm?.status == 200) {
            setIsOpen(false);
            setIsSubmitting(false);
            mutate(`api/link?linkId=${link.id}`);
            toast.success("Link edited!", { id: loadingToast });
            //   router.reload();
          }
        } else {
          setIsOpen(false);
          setIsSubmitting(false);
          console.error("Edit Failed");
          toast.error("Cannot edit Your link", { id: loadingToast });
        }
      }

      // console.log(check);

      if (checkShortname?.records?.length > 0) {
        toast.error("The shortname is already taken", { id: loadingToast });
        setFormError(true);
        setIsSubmitting(false);
      } else if (checkShortname?.records?.length == 0) {
        submitForm = await fetch(
          `${process.env.NEXT_PUBLIC_AIRTABLE_URI}/links`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_AIRTABLE_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(airtableBody),
          }
        );
        if (submitForm?.ok) {
          if (submitForm?.status == 200) {
            setIsOpen(false);
            setIsSubmitting(false);
            mutate(`api/link?linkId=${link.id}`);
            toast.success("Link edited!", { id: loadingToast });
            //   router.reload();
          }
        } else {
          setIsOpen(false);
          setIsSubmitting(false);
          console.error("Edit Failed");
          toast.error("Cannot edit Your link", { id: loadingToast });
        }
      }
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitForm(editedLinkData);
  };

  const handleInputChange = (event: any) => {
    // console.log(event);
    const { name, value } = event.target;
    setEditedLinkData((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
    if (editedLinkData.shortname && editedLinkData.url) {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  };

  // useEffect(() => {
  //   // if (linkData.shortname && linkData.url) {
  //   //   setFormFilled(true);
  //   // } else {
  //   //   setFormFilled(false);
  //   // }
  // }, [linkData]);

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md p-2 text-sm font-medium text-slate-500 shadow-sm hover:bg-slate-100"
        >
          <PencilSquareIcon className="w-3 h-3 hidden md:block" />
          <EllipsisVerticalIcon className="w-4 h-4 block md:hidden" />
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
            <div className="fixed inset-0 bg-black bg-opacity-25 blur-sm" />
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
                  <Dialog.Title
                    as="h3"
                    className="flex flex-row items-center justify-between text-lg font-medium leading-6 text-gray-900 py-2 border-b"
                  >
                    <div>Edit /{shortlink}</div>
                    <div className="flex flex-row items-center gap-2">
                      <DeleteLinkModal link={link} />
                      <button
                        onClick={closeModal}
                        className="px-3 py-2 bg-slate-100 rounded-md text-xs text-slate-600"
                      >
                        Close
                      </button>
                    </div>
                  </Dialog.Title>
                  <div className="py-4">
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-6"
                      id="form"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="text-black text-sm font-medium">
                              Destination URL
                            </div>
                            <input
                              type="text"
                              name="url"
                              className="mt-1 block w-full rounded-md text-slate-600 border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                              value={editedLinkData.url}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="flex flex-1 flex-col gap-2">
                            <div className="text-black text-sm font-medium">
                              Shortlink
                            </div>
                            <div className="flex flex-row items-center ">
                              <span className="inline-flex p-2 px-3 text-slate-400 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
                                jala.cc
                              </span>
                              <input
                                type="text"
                                name="shortname"
                                className={clsx(
                                  formError
                                    ? "border-red-300 border-2"
                                    : "border-gray-300 ",
                                  "block w-full rounded-r-md text-slate-600 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                                )}
                                value={editedLinkData.shortname}
                                onChange={handleInputChange}
                              />
                            </div>
                            {formError && (
                              <div className="text-red-400 text-sm">
                                Shortname is already taken. Please use another
                                name.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting || !formFilled}
                          className={clsx(
                            isSubmitting
                              ? "bg-slate-300 "
                              : "bg-jala-insight text-white",
                            "py-2 rounded-md  w-full text-center font-medium disabled:bg-slate-300 disabled:text-slate-400 disabled:cursor-not-allowed"
                          )}
                        >
                          Edit link
                        </button>
                      </div>
                    </form>
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
