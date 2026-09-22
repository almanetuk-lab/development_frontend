import React from "react";
import { useUserProfile } from "../context/UseProfileContext";
import PlanRestrictionModal from "../comman/PlanRestrictionModal";
import MessagesSection from "./MessagesSection";

/**
 * Plan gate for the messages page.
 *
 * MessagesSection declares ~19 useEffects that fetch chats, messages and
 * reactions on mount. React runs those hooks no matter what the component
 * returns, so an early `return <PlanRestrictionModal />` inside it still let
 * every request fire before the modal painted. Gating one level up means the
 * component never mounts, so nothing is requested.
 */
export default function MessagesGate() {
  const { planLoading, isFeatureAllowed } = useUserProfile();

  // Treat "still loading" as not-allowed-yet, otherwise the first render
  // mounts the chat UI and the effects leak out during the plan fetch.
  if (planLoading) return <MessagesLoading />;

  if (!isFeatureAllowed("message")) {
    return <PlanRestrictionModal feature="messaging" />;
  }

  return <MessagesSection />;
}

function MessagesLoading() {
  return (
    <div className="md:bg-white md:rounded-3xl md:border md:border-slate-100 md:p-4 md:shadow-xs">
      <div className="hidden md:block h-8 w-40 bg-slate-100 rounded mb-4 animate-pulse"></div>

      <div className="flex gap-4">
        {/* Conversation list */}
        <div className="w-full md:w-80 space-y-3">
          <div className="h-11 bg-slate-100 rounded-2xl animate-pulse"></div>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex-shrink-0"></div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                <div className="h-3 bg-slate-100 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Thread pane */}
        <div className="hidden md:flex flex-1 flex-col border border-slate-100 rounded-2xl p-4 gap-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3 animate-pulse">
            <div className="w-10 h-10 bg-slate-100 rounded-full"></div>
            <div className="h-4 bg-slate-100 rounded w-40"></div>
          </div>
          <div className="flex-1 space-y-4">
            {[
              "w-1/2 mr-auto",
              "w-2/5 ml-auto",
              "w-3/5 mr-auto",
              "w-1/3 ml-auto",
            ].map((pos, i) => (
              <div key={i} className={`h-12 bg-slate-100 rounded-2xl animate-pulse ${pos}`}></div>
            ))}
          </div>
          <div className="h-12 bg-slate-100 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
