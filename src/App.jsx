import { useState } from "react";
import "./App.css";
import axios from "axios";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from "@clerk/clerk-react";

function App() {
  const [query, setQuery] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    try {
      setChatList((prev) => [...prev, { source: "user", text: query }]);

      const systemPrompt = `You are BiteBuddy AI, the official virtual assistant of Urban Bites restaurant.

Restaurant Information:
- Name: Urban Bites
- Hours: 11:00 AM to 11:00 PM

Menu (PKR):
- 🍕 Chicken Tikka Pizza (Medium) — PKR 1,399
- 🍔 Zinger Burger — PKR 549
- 🍟 Chicken Loaded Fries — PKR 549
- 🥪 Club Sandwich — PKR 599
- 🌯 Chicken Paratha Roll — PKR 299
- 🫔 Chicken Wrap — PKR 449
- 🥤 Regular Soft Drink — PKR 120

IMPORTANT: Only respond to queries related to Urban Bites restaurant, its menu, prices, and timings. Politely decline any unrelated questions by saying "I can only help with Urban Bites restaurant menu and information."`;

      // make request through our local proxy server
      let apiRes;
      const maxRetries = 3;
      let attempt = 0;
      let backoff = 1000;

      while (attempt < maxRetries) {
        try {
          apiRes = await axios.post(
            "/api/generate",
            { systemPrompt, query },
            { headers: { "Content-Type": "application/json" } }
          );
          break;
        } catch (error) {
          const status = error?.response?.status;
          if (status === 429) {
            attempt += 1;
            if (attempt >= maxRetries) throw error;
            await new Promise((r) => setTimeout(r, backoff));
            backoff *= 2;
            continue;
          }
          throw error;
        }
      }

      const aiRes = apiRes.data.candidates[0].content.parts[0].text;
      setChatList((prev) => [...prev, { source: "ai", text: aiRes }]);
    } catch (err) {
      if (err?.response?.status === 429) {
        console.warn("rate-limited", err.message);
        setChatList((prev) => [
          ...prev,
          {
            source: "ai",
            text: "The service is busy right now; please try again in a moment.",
          },
        ]);
      } else {
        console.error(err);
        setChatList((prev) => [
          ...prev,
          {
            source: "ai",
            text: "An error occurred. Please check the console for details.",
          },
        ]);
      }
    }
  };

  return (
    <>
      <h1>ChatBot</h1>
      <br />
      <SignInButton />
      <SignedOut />
      <SignOutButton />
      <div className="pb-32">
        {chatList.map((ms, index) => (
          <div
            key={index}
            className={`w-full flex ${
              ms.source === "user"
                ? "justify-end bg-red-500"
                : ms.source === "ai"
                  ? "justify-start bg-green-500"
                  : ""
            }`}
          >
            <div>{ms.text}</div>
          </div>
        ))}
      </div>
      <SignedIn>
        <SignedOut />
        <form
          onSubmit={handleQuerySubmit}
          className="fixed bottom-0 left-0 w-full"
        >
          <div className="max-w-sm w-full space-y-3 ">
            <label htmlFor="query" className="sr-only">
              New Query
            </label>
            <input
              id="query"
              type="text"
              className="py-2.5 sm:py-3 px-4 rounded-lg block w-full bg-layer border-layer-line sm:text-sm text-foreground placeholder:text-muted-foreground-1 focus:border-primary-focus focus:ring-primary-focus disabled:opacity-50 disabled:pointer-events-none"
              placeholder="Enter your query..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <br />

          <div className="inline-flex flex-wrap gap-2">
            <button
              type="submit"
              className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg bg-primary border border-primary-line text-primary-foreground hover:bg-primary-hover focus:outline-hidden focus:bg-primary-focus disabled:opacity-50 disabled:pointer-events-none"
            >
              Submit
            </button>
          </div>
        </form>
      </SignedIn>
      <SignedOut />

      <img src="/image.png" alt="" className="w-24" />
    </>
  );
}

export default App;
