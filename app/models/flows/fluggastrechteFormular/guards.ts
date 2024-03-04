import { yesNoGuards } from "../guards.server";

export const fluggastrechteGuards = {
  ...yesNoGuards("zwischenstopps"),
  ...yesNoGuards("ankunftWithSameFlight"),
};
