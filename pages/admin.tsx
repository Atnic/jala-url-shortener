import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { PageTypes } from "@/utils/types";

export default function Page() {
  const [links, setLinks] = useState<PageTypes[]>([]);

  useEffect(() => {
    fetchLinks();
  }, []);

  async function fetchLinks() {
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("id", { ascending: true });

    if (error) console.log("Error fetching links:", error);
    else setLinks(data || []);
  }

  console.log(links);
  return <div>P</div>;
}
