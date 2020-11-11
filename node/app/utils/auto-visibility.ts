import { IUserDoc } from "@/interfaces/IModelUser";
import { Optional } from "@/interfaces/Optional";
import { Visibility, VisibilityGeneric } from "@/models/Visibility";
import { sortedSet } from "./sorted-set";

export const autoVisibility = async (
  user: IUserDoc,
  payload: Optional<VisibilityGeneric>,
  { saveDocument = true }: { saveDocument?: boolean } = {},
) => {
  const { isPrivate = false, isIndexable = true } = payload;
  const publicBlockedUsers = sortedSet(payload.publicBlockedUsers || []);
  const privateAllowedUsers = sortedSet(payload.privateAllowedUsers || []);
  const dbVisibility = await Visibility.findOne({
    isPrivate,
    isIndexable,
    user: user._id,
    privateAllowedUsers: {
      ...(privateAllowedUsers.length
        ? { $all: privateAllowedUsers }
        : { $size: 0 }),
    },
    publicBlockedUsers: {
      ...(publicBlockedUsers.length
        ? { $all: publicBlockedUsers }
        : { $size: 0 }),
    },
  });
  if (dbVisibility) return dbVisibility;
  const visibility = new Visibility();
  visibility.user = user._id;
  visibility.set({ isPrivate, isIndexable });
  visibility.setPrivateAllowedUsers(privateAllowedUsers);
  visibility.setPublicBlockedUsers(publicBlockedUsers);
  saveDocument && (await visibility.save());
  return visibility;
};
