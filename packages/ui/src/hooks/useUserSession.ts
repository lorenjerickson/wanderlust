import { useAtom, atom } from "jotai";
import { useEffect } from "react";

export interface UserSession {
  startedAt: string;
  touchedAt: string;
  username: string;
  sessionId: string;
}

const userSessionAtom = atom<UserSession | undefined>(undefined);

export function useUserSession() {
  const [session, setSession] = useAtom(userSessionAtom);

  useEffect(() => {
    localStorage.setItem("userSession", JSON.stringify(session));
  }, [session]);

  const isLoggedIn = () => {
    if (!session) {
      return false;
    }

    const started = new Date(session.startedAt);
    const touched = new Date(session.touchedAt);
    const now = new Date();
    const diff = now.getTime() - started.getTime();
    const exceedsMaxSessionDuration = diff > 1000 * 60 * 60 * 5; // five hours
    const activityDiff = now.getTime() - touched.getTime();
    const activityTimeout = 1000 * 60 * 10; // ten minutes
    const exceedsLastActivityTimeout = activityDiff > activityTimeout;
    const active = !(exceedsLastActivityTimeout && exceedsMaxSessionDuration);
    if (!active) {
      setSession(undefined);
    }
    return active;
  };

  const touchUserSession = (sessionId: string) => {
    if (!session) {
      return;
    }
    const updated = {
      ...session,
      touchedAt: new Date().toISOString(),
    };

    fetch(`http://localhost:3000/api/session/${session.sessionId}`, {
      method: "PUT",
      body: JSON.stringify(updated),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSession(data);
      })
      .catch((error) => {
        console.error("Failed to update session", error);
      });
  };

  const startUserSession = async (values: {
    username?: string;
    password?: string;
  }) => {
    return fetch("http://localhost:3000/api/session", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSession(data));
  };

  const endUserSession = () => {
    if (!session) {
      return;
    }

    fetch(`http://localhost:3000/api/session/${session.sessionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then(() => setSession(undefined))
      .catch((error) => console.error("Failed to end session", error));
  };

  return { isLoggedIn, touchUserSession, startUserSession, endUserSession, userSession: session };
}
