import { GlobalState } from "@model/state";

const authInfoSelector = (state: GlobalState) => state.auth;
const authEmailSelector = (state: GlobalState) => state.auth.email;

export { authInfoSelector, authEmailSelector };
