export const getToken = () => {
  return localStorage.getItem("accessToken");
};

export const logout = () => {
  localStorage.clear();
  
};