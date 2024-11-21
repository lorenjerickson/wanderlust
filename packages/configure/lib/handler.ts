import { ModuleHandler } from "@core/types";

const handler: ModuleHandler = {
  onInit: async (app) => {
    console.log("Module is initialized");
  },
  onDestroy: async (app) => {
    console.log("Module is destroyed");
  },
  onLoad: async (app) => {
    console.log("Module is loaded");
  },
  onSuspend: async (app: any) => {
    console.log("Module is suspended");
  },
};

export default handler;
