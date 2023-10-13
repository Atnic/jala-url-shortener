import { Dialog, Transition } from "@headlessui/react";
import { useSWRConfig } from "swr";
import { Fragment, useState, useEffect } from "react";
import clsx from "clsx";

export function EditLinkModal({ link }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFilled, setFormFilled] = useState(false);
  const [linkData, setLinkData] = useState({
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

      const response = await fetch(
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

      if (response.ok) {
        if (response.status == 200) {
          setIsOpen(false);
          setIsSubmitting(false);
          setIsOpen(false);
          mutate(`api/link?linkId=${link.id}`);
          //   router.reload();
        }
      } else {
        setIsOpen(false);
        setIsSubmitting(false);
        console.error("Edit Failed");
        setIsOpen(false);
      }
    } catch (error) {
      console.error("An error occurred", error);
    } finally {
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsSubmitting(true);
    await submitForm(linkData);
  };

  const handleInputChange = (event: any) => {
    // console.log(event);
    const { name, value } = event.target;
    setLinkData((prevSettings) => ({
      ...prevSettings,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (linkData.shortname && linkData.url) {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [linkData]);

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-md px-4 py-2 text-sm font-medium text-slate-500 shadow-sm "
        >
          Edit
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
                    className="text-lg font-medium leading-6 text-gray-900 py-2 border-b"
                  >
                    Edit /{shortlink}
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
                              value={linkData.url}
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
                                className="block w-full rounded-r-md text-slate-600 border-gray-300 shadow-sm focus:border-sky-300 focus:ring focus:ring-sky-200 focus:ring-opacity-50"
                                value={linkData.shortname}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-row gap-2">
                        <button
                          onClick={() => setIsOpen(false)}
                          className="bg-red-400 text-white py-2 rounded-md  w-full text-center font-medium disabled:bg-slate-300 disabled:text-slate-400"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting || !formFilled}
                          className={clsx(
                            isSubmitting
                              ? "bg-slate-300 "
                              : "bg-jala-insight text-white",
                            "py-2 rounded-md  w-full text-center font-medium disabled:bg-slate-300 disabled:text-slate-400"
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
    </>
  );
}
