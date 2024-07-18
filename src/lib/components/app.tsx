"use client";

import { getCookie } from "cookies-next";
import Link from "next/link";

const client_id = process.env.CLIENT_ID;
const scope = "tasks:write tasks:read";
const state = process.env.BASE_URL;
const redirect_uri = process.env.REDIRECT_URL;
const response_type = "code";

export const App = () => {
  const link = `https://ticktick.com/oauth/authorize?scope=${scope}&client_id=${client_id}&state=${state}&redirect_uri=${redirect_uri}&response_type=${response_type}`;
  const authorization = getCookie("authorization");
  
  return (
    <div>
      <Link href={link} target="_blank">
        TickTick Login
      </Link>
    </div>
  );
};
