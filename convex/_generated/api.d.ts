/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as elevenlabs from "../elevenlabs.js";
import type * as llm from "../llm.js";
import type * as mutations from "../mutations.js";
import type * as queries from "../queries.js";
import type * as whisper from "../whisper.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  elevenlabs: typeof elevenlabs;
  llm: typeof llm;
  mutations: typeof mutations;
  queries: typeof queries;
  whisper: typeof whisper;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
