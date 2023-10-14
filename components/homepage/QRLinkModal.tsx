import { Dialog, Transition } from "@headlessui/react";
import { useSWRConfig } from "swr";
import { Fragment, useState } from "react";
import { QrCodeIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { QRCodeSVG } from "qrcode.react";
import React, { useRef } from "react";
import html2canvas from "html2canvas";

export function QRLinkModal({ link }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const svgRef = useRef(null);

  // const [linkData, setLinkData] = useState({
  //   id: link.id,
  //   shortname: link?.fields?.shortname,
  //   url: link?.fields?.url,
  // });
  const { mutate } = useSWRConfig();

  const shortlink = link?.fields?.shortname;

  const downloadQRAsPng = () => {
    const svgElement = svgRef.current;
    // const svgElement = document.getElementById(svgId);

    console.log(svgElement);

    if (svgElement) {
      html2canvas(svgElement, { useCORS: true }).then((canvas) => {
        const dataURL = canvas.toDataURL("image/png");
        const a = document.createElement("a");
        a.href = dataURL;
        a.download = `${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}-jalacc-qr.png`;
        a.click();
      });
    } else {
      console.error("SVG element not found");
    }
  };

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          type="button"
          onClick={openModal}
          className="rounded-full p-2 bg-slate-100 hover:bg-slate-200"
        >
          <QrCodeIcon className="w-4 h-4 text-slate-500" />
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
                    className="text-lg text-center font-medium leading-6 text-gray-900 py-2 border-b"
                  >
                    <div>Download QR Code</div>
                  </Dialog.Title>
                  <div className="py-6 flex flex-col gap-4">
                    <div
                      className="mx-auto p-4 rounded-md border-2 border-slate-200"
                      ref={svgRef}
                    >
                      <div>
                        <QRCodeSVG
                          value={`${process.env.NEXT_PUBLIC_HOSTNAME}/${shortlink}`}
                          id={`qr-${shortlink}`}
                          size={128}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          level={"L"}
                          includeMargin={false}
                          // imageSettings={{
                          //   src: "https://strapi.jala.tech/uploads/jala_logo_6298181eb0.png",
                          //   x: undefined,
                          //   y: undefined,
                          //   height: 32,
                          //   width: 32,
                          //   excavate: true,
                          // }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={downloadQRAsPng}
                      className={clsx(
                        "p-2 mx-auto w-1/2 bg-jala-insight hover:bg-white hover:text-jala-insight border border-jala-insight rounded-md  font-medium py-2 text-center text-white"
                      )}
                    >
                      Download QR
                    </button>
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
