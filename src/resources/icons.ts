import { IconType } from "react-icons";

import {
  HiOutlineRocketLaunch,
  HiOutlineStar,
  HiStar,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineClipboardDocument,
  HiOutlineTrophy,
  HiOutlineCheckCircle,
  HiOutlineArrowTopRightOnSquare,
} from "react-icons/hi2";


export const iconLibrary: Record<string, IconType> = {
  rocket: HiOutlineRocketLaunch,
  starOutline: HiOutlineStar,
  starFilled: HiStar,
  plus: HiOutlinePlusCircle,
  trash: HiOutlineTrash,
  clipboard: HiOutlineClipboardDocument,
  trophy: HiOutlineTrophy,
  check: HiOutlineCheckCircle,
  externalLink: HiOutlineArrowTopRightOnSquare,
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;