import React from "react";
import apiRequest from "../lib/apiRequest.js";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
};