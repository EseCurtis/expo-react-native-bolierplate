import { apiClient } from "@/api/client";
import { AuthDataParams, LoginParams, SignupParams } from "@/types/auth-types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();

export function useAuth() {
  const queryClient = useQueryClient();

  // Initial states
  const [accessToken, setAccessToken] = useState(
    () => storage.getString("accessToken") || null
  );
  const [isFirstTime, setIsFirstTime] = useState(
    () => storage.getBoolean("isFirstTime") || false
  );
  const [user, setUser] = useState(() => {
    const userData = storage.getString("user");
    return userData ? JSON.parse(userData) : null;
  });

  // Helper to save auth data in MMKV
  const saveAuthData = ({ token, user, isFirstTime }: AuthDataParams) => {
    setAccessToken(token);
    setUser(user);
    setIsFirstTime(isFirstTime);

    storage.set("accessToken", token);
    storage.set("user", JSON.stringify(user));
    storage.set("isFirstTime", isFirstTime);
  };

  // LOGIN mutation
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginParams) => {
      const { data } = await apiClient.post(`/auth/login`, {
        email,
        password
      });
      return data; // { accessToken, user, isFirstTime }
    },
    onSuccess: (data) => {
      saveAuthData({
        token: data.accessToken,
        user: data.user,
        isFirstTime: data.isFirstTime
      });
    },
    onError: (error: any) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    }
  });

  // SIGNUP mutation
  const signupMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
      role
    }: SignupParams) => {
      const { data } = await apiClient.post(`/auth/signup`, {
        email,
        password,
        firstName,
        lastName,
        role
      });
      return data; // { accessToken, user, isFirstTime }
    },

    onSuccess: (data) => {
      saveAuthData({
        token: data.accessToken,
        user: data.user,
        isFirstTime: true
      }); // Mark as first time
    },
    onError: (error: any) => {
      console.error(
        "Signup failed:",
        error.response?.data?.message || error.message
      );
    }
  });

  // LOGOUT mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiClient.post(
        `/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    },

    onSuccess: () => {
      // Clear local storage and state
      setAccessToken(null);
      setUser(null);
      setIsFirstTime(false);

      storage.delete("accessToken");
      storage.delete("user");
      storage.delete("isFirstTime");

      queryClient.clear(); // Clear query cache
    },
    onError: (error: any) => {
      console.error(
        "Logout failed:",
        error.response?.data?.message || error.message
      );
    }
  });

  // QUERY to check session status
  const {
    data: sessionData,
    error: sessionError,
    refetch: refetchSession
  } = useQuery({
    queryKey: ["sessionStatus"],
    queryFn: async () => {
      const { data } = await apiClient.get(`/auth/session`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      return data; // { user, isFirstTime }
    },
    enabled: !!accessToken // Fetch only if accessToken exists
  });

  useEffect(() => {
    setUser(sessionData.user);
    setIsFirstTime(sessionData.isFirstTime);
    storage.set("user", JSON.stringify(sessionData.user));
    storage.set("isFirstTime", sessionData.isFirstTime);
  }, [sessionData]);

  useEffect(() => {
    if (sessionError) {
      // Clear accessToken if session check fails
      setAccessToken(null);
      setUser(null);

      storage.delete("accessToken");
      storage.delete("user");
    }
  }, [sessionError]);

  // Re-check token and session on mount
  useEffect(() => {
    if (accessToken) {
      refetchSession();
    }
  }, [accessToken, refetchSession]);

  return {
    login: loginMutation.mutateAsync, // Usage: login({ email, password })
    logout: logoutMutation.mutateAsync, // Usage: logout()
    signup: signupMutation.mutateAsync, // Usage: signup({ email, password, name })
    isFirstTime,
    accessToken,
    user,
    isLoading:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending
  };
}
