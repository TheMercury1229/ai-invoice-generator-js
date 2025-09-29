export const checkAuthStatus = async (
  setUser,
  setIsAuthenticated,
  setLoading
) => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      const userObj = JSON.parse(userStr);
      setUser(userObj);
      setIsAuthenticated(true);
      setLoading(false);
    }
  } catch (error) {
    console.error("Error checking auth status:", error);
    logout();
  } finally {
    setLoading(false);
  }
};

export const login = (userData, token, setUser, setIsAuthenticated) => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
  setIsAuthenticated(true);
};
export const logout = (setUser, setIsAuthenticated) => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
  setUser(null);
  setIsAuthenticated(false);
  window.location.href = "/";
};

export const updateUser = async (updatedUserData, user, setUser) => {
  const newUserData = { ...user, ...updatedUserData };
  localStorage.setItem("user", JSON.stringify(newUserData));
  setUser(newUserData);
};
