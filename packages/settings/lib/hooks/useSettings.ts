import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";

export function useSettings() {
  const [settingsFilter, setSettingsFilter] = useState("");
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
  }, [response, settingsFilter]);

  const filterSettings = () => {
    if (searchIndex) {
      return searchIndex.search(settingsFilter);
    }

    return response.data;
  };

  const settings = useMemo(() => {
    if (!response.data) {
      return [];
    }

    return filterSettings();
  }, [response, filterSettings]);

  const addSettings = async (settings: any) => {
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
      settings: response.data,
      isLoading: response.isLoading,
      isError: response.isError,
      error: response.error,
      addSettings,
      settingsFilter,
      setSettingsFilter,
    };
  }, [response]);
}
