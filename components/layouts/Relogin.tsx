import React from "react";
import { PageContent } from "@/components/layouts/PageContent";
import { Container } from "@/components/layouts/Container";
import { Page } from "@/components/layouts/Page";
import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/outline";

export function Relogin() {
  return (
    <Page>
      <PageContent>
        <Container>
          <div className="flex flex-col p-4 gap-6">
            <div>Session expired, mohon login kembali</div>
            <a
              href={`https://app.jala.tech/jala_web_view?open=${process.env.NEXT_PUBLIC_HOSTNAME}`}
              className="flex flex-1 w-fit items-center px-3 py-2 shadow-sm rounded-xl bg-amber-100"
            >
              <ArrowLeftOnRectangleIcon className="h-6 w-6 text-slate-600 mr-2 font-bold" />
              Login
            </a>
          </div>
        </Container>
      </PageContent>
    </Page>
  );
}
