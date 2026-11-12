import {useEffect, useState} from "react";
export const routes = {Workspace:"/workspace", Explore:"/archive", Records:"/records", Analysis:"/analysis", Programmes:"/programmes", Sources:"/sources", "Research note":"/education-charity", Methodology:"/methodology", Admin:"/admin"};
const current = () => location.pathname === "/" ? "Explore" : Object.keys(routes).find(k => routes[k] === location.pathname) || "Not found";
export function useRoute() {
  const [page,setPage] = useState(current);
  useEffect(() => {const fn=()=>setPage(current()); addEventListener("popstate",fn); return ()=>removeEventListener("popstate",fn);},[]);
  function navigate(name) { history.pushState({},"",routes[name] || "/"); setPage(name); window.scrollTo(0,0); }
  return [page,navigate];
}
