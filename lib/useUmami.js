import { useEffect } from "react";

const useUmami = (shortUrl, umamiUrl, websiteId) => {
  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";
    script.src = umamiUrl;
    script.setAttribute("data-website-id", websiteId);
    document.head.appendChild(script);

    script.onload = () => {
      if (window.umami) {
        window.umami.trackEvent("ShortlinkVisit", { url: shortUrl });
      }
    };
    return () => {
      document.head.removeChild(script);
    };
  }, [shortUrl]);
};

export default useUmami;
