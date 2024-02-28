"use client";
import { API_LINK } from "@/utils/base-api";
import axios from "axios";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface WishlistCard {
  userId: string | null;
  productUrl: string;
  image: string;
  title: string;
  discount_price: number;
  original_price: number;
  discount: number;
  id: string | null;
}

interface WishlistContextType {
  wishlist: WishlistCard[];
  AddToWishlist: (productUrl: WishlistCard) => void;
  RemoveFromWishlist: (productUrl: string, id: string) => void;
  SetWishlistHandler: (data: WishlistCard[]) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [wishlist, setWishlist] = useState<WishlistCard[]>([]);

  const AddToWishlist = async (data: WishlistCard) => {
    setWishlist([...wishlist, data]);
    await axios.post(`${API_LINK}/wishlist/addWishlistItem`, { data });
    const resp = await axios.get(`${API_LINK}/getWishlistItem/${data.userId}`);
    setWishlist(resp.data.wishlist);
  };

  const RemoveFromWishlist = async (productUrl: string, id: string) => {
    setWishlist(wishlist.filter((item) => item.productUrl === productUrl));
    await axios.delete(`${API_LINK}/wishlist/deleteWishlistItem/${id}`);
  };

  const SetWishlistHandler = (data: WishlistCard[]) => {
    setWishlist(data);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        AddToWishlist,
        RemoveFromWishlist,
        SetWishlistHandler,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
