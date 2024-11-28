import React, { createContext, useReducer } from "react";

export const Shop = createContext();

export function ShopProvider(props) {
  const etatinitiale = {
    userInfo: localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null,
    mode: localStorage.getItem("mode")
      ? localStorage.getItem("mode")
      : window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light",
  };
  function reducer(etat, action) {
    switch (action.type) {
      case "USER_LOGIN":
        return { ...etat, userInfo: action.payload };
      case "USER_SIGNOUT":
        return {
          ...etat,
          userInfo: null,
        };
      case "SWITCH_MODE":
        const mode = etat.mode === "dark" ? "light" : "dark";
        localStorage.setItem("mode", mode);
        return { ...etat, mode };
      default:
        return etat;
    }
  }
  const [etat, dispatch] = useReducer(reducer, etatinitiale);
  const value = { etat, dispatch };
  return <Shop.Provider value={value}>{props.children}</Shop.Provider>; 
