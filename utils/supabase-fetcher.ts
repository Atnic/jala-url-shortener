import { supabase } from "@/lib/supabaseClient";

export const fetcher = async ({
  table,
  column,
  value,
}: {
  table: string;
  column: string;
  value: string;
}) => {
  if (column && value) {
    const { data, error, status, statusText } = await supabase
      .from(table)
      .select("*")
      .eq(column, value);

    if (error) throw error;
    return data;
  } else {
    const { data, error, status, statusText } = await supabase
      .from(table)
      .select("*");
  }
};
