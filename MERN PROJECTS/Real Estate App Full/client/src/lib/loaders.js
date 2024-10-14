import React from "react";
import apiRequest from "../lib/apiRequest.js";
import { defer } from "react-router-dom";

export const singlePageLoader = async ({ params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};

export const listPageLoader = async ({ request, params }) => {
  const query = request.url.split("?")[1];
  const postPromise = apiRequest("/posts/?" + query);
  return defer({ postResponse: postPromise });
};
