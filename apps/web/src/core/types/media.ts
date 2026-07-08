import { Tag } from "./tag";
import { User } from "./user";

export interface Media {
  title: string;
  description: string;
  type: string;
  tags: Tag[];
  url: string;
  createdOn: Date;
  createdBy: User;
  updatedOn: Date;
  updatedBy: User;
}

// export interface Image {
//   alt: string;
//   size: { width: number; height: number };
// }

// export interface Audio {
//   duration: number;
// }

// export interface Video {
//   resolution: { width: number; height: number };
//   duration: number;
// }

