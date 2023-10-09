import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  ShoppingCartIcon,
  UserCircleIcon,
  HomeIcon,
  ArchiveBoxIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";
import {
  ShoppingCartIcon as ShoppingCartIconSolid,
  UserCircleIcon as UserCircleIconSolid,
  HomeIcon as HomeIconSolid,
  ArchiveBoxIcon as ArchiveBoxIconSolid,
  BanknotesIcon as BankNotesIconSolid,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import posthog from "posthog-js";

export function FloatingMenu() {
  const router = useRouter();
  const { cartItems } = useCart();
  //   console.log(router);
  return (
    <div className="fixed bottom-0 mx-auto sm:max-w-lg inset-x-0 px-4 bg-white shadow-2xl top-shadow w-full font-semibold text-sm text-slate-600">
      <div className="flex flex-1 justify-between items-center">
        <Link
          href={{
            pathname: `/`,
            query: { cache_key: router.query.cache_key },
          }}
          className={clsx(
            router.pathname == "/" ? "text-jala-insight" : "font-light",
            "flex flex-col justify-center items-center space-y-1 p-2"
          )}
          onClick={() => posthog.capture("Home Clicked")}
        >
          {router.pathname == "/" ? (
            <HomeIconSolid className="w-6 h-6" />
          ) : (
            <HomeIcon className="w-6 h-6" />
          )}
          <div className=" text-xs ">Beranda</div>
        </Link>
        <Link
          href={{
            pathname: `/cart`,
            query: { cache_key: router.query.cache_key },
          }}
          className={clsx(
            router.pathname == "/cart" ? "text-jala-insight" : "font-light",
            "flex flex-col justify-center items-center space-y-1 p-2"
          )}
          onClick={() => posthog.capture("Cart Clicked")}
        >
          <div className="relative">
            {router.pathname == "/cart" ? (
              <ShoppingCartIconSolid className="w-6 h-6" />
            ) : (
              <ShoppingCartIcon className="w-6 h-6" />
            )}
            {cartItems.length > 0 && (
              <span className="absolute -top-1.5 -right-1 bg-red-500 py-0.5 px-1 text-xs rounded text-white font-semibold">
                {cartItems.length}
              </span>
            )}
          </div>
          <div className="text-xs">Keranjang</div>
        </Link>
        <Link
          href={{
            pathname: `/orders`,
            query: { cache_key: router.query.cache_key },
          }}
          className={clsx(
            router.pathname == "/orders" ? "text-jala-insight" : "font-light",
            "flex flex-col justify-center items-center space-y-1 p-2"
          )}
          onClick={() => posthog.capture("Order Clicked")}
        >
          {router.pathname == "/orders" ? (
            <ArchiveBoxIconSolid className="w-6 h-6" />
          ) : (
            <ArchiveBoxIcon className="w-6 h-6" />
          )}
          <div className="text-xs">Pesanan</div>
        </Link>
        {/* <Link
          href={{
            pathname: `/payments`,
            query: { cache_key: router.query.cache_key },
          }}
          className={clsx(
            router.pathname == "/payments" ? "text-jala-insight" : "font-light",
            "flex flex-col justify-center items-center space-y-1 p-2"
          )}
        >
          {router.pathname == "/payments" ? (
            <BankNotesIconSolid className="w-6 h-6" />
          ) : (
            <BanknotesIcon className="w-6 h-6" />
          )}
          <div className="text-xs">Pembayaran</div>
        </Link> */}
        <Link
          href={{
            pathname: `/account`,
            query: { cache_key: router.query.cache_key },
          }}
          className={clsx(
            router.pathname == "/account" ? "text-jala-insight" : "font-light",
            "flex flex-col justify-center items-center space-y-1 p-2"
          )}
          onClick={() => posthog.capture("Account Clicked")}
        >
          {router.pathname == "/account" ? (
            <UserCircleIconSolid className="w-6 h-6" />
          ) : (
            <UserCircleIcon className="w-6 h-6" />
          )}
          <div className="text-xs">Akun</div>
        </Link>
      </div>
    </div>
  );
}
