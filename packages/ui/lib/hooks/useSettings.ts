import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { SettingsGroup } from "@wanderlust/core";

export function useSettings() {
  const [filter, setFilter] = useState("");
  const [settingsChanged, setSettingsChanged] = useState(true);

  const response = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      setSettingsChanged(false);
      return fetch("http://localhost:3000/settings").then((res) => res.json());
    },
    enabled: settingsChanged,
    refetchOnWindowFocus: false,
    refetchInterval: false,
    refetchOnReconnect: false,
    refetchIntervalInBackground: false,
    refetchOnMount: true,
  });

  const searchIndex = useMemo(() => {
    if (response.data) {
      return new Fuse(response.data, {
        keys: ["name", "description", "helpText"],
      });
    }
    return null;
  }, [response]);

  const settings = useMemo(() => {
    if (!response.data) {
      return [];
    }

    if (searchIndex) {
      return searchIndex.search(filter);
    }

    return response.data;
  }, [response.data, searchIndex, filter]);

  const addSettings = async (settings: SettingsGroup) => {
    return fetch("http://localhost:3000/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(settings),
    }).then(() => setSettingsChanged(true));
  };

  return useMemo(() => {
    return {
      settings,
      isLoading: response.isLoading,
      isError: response.isError,
      error: response.error,
      addSettings,
      filter,
      setFilter,
    };
  }, [response.error, response.isError, response.isLoading, settings, filter]);
}
