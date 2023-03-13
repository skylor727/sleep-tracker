import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from 'react';

import { api } from "~/utils/api";

const Form = () => {
  const [message, setMessage] = useState("");
  const { data: session, status } = useSession();

  const postMessage = api.sleepbook.postMessage.useMutation();

  if (status !== "authenticated") return null;

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        postMessage.mutate({
          name: session.user?.name as string,
          message,
        });
        setMessage("");
      }}
    >
      <input
        type="text"
        className="rounded-md border-2 border-zinc-800 bg-neutral-900 px-4 py-2 focus:outline-none"
        placeholder="Your message..."
        minLength={2}
        maxLength={100}
        value={message}
        onChange={(event) => setMessage(event.target.value)}
      />
      <button
        type="submit"
        className="rounded-md border-2 border-zinc-800 p-2 focus:outline-none"
      >
        Submit
      </button>
    </form>
  );
};

const SleepBookEntries = () => {
  const { data: sleepbookEntries, isLoading } = api.sleepbook.getAll.useQuery();
  if (isLoading) return <div>Fetching Messages...</div>
  return (
    <div className="flex flex-col gap-4">
      {sleepbookEntries?.map((entry, index) => {
        return (
          <div key={index}>
            <p>{entry.message}</p>
            <span>- {entry.name}</span>
          </div>
        );
      })}
    </div>
  );
};

const Home = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <main className="flex flex-col items-center pt-4">Loading...</main>
  }
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-3xl pt-4">Sleep Tracker</h1>
      <div className="pt-10">
        <div>
          {session ? (
            <>
              <p className="mb-4 text-center">hi {session.user?.name}</p>
              <button className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 text-center hover:bg-neutral-700" onClick={() => {
                signOut();
              }}>
                logout
              </button>
              <div className="pt-6">
                <Form />
              </div>
            </>
          ) : (
            <button className="mx-auto block rounded-md bg-neutral-800 py-3 px-6 text-center hover:bg-neutral-700" onClick={() => {
              signIn("discord").catch(console.log)
            }}>Login with discord</button>
          )
          }
          <div className="pt-10">
            <SleepBookEntries />
          </div>
        </div>
      </div>
    </main>
  )
};

export default Home;

