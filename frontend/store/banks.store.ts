import { create } from "zustand";

type BankStore = {
  banks: string[];
  typePayment: string[];
};

export const useBank = create<BankStore>((set) => ({
  banks: [
    "Other",
    "Itaú",
    "Banco do Brasil",
    "Bradesco",
    "Santander",
    "Caixa Econômica",
    "Nubank",
    "Inter",
    "C6 Bank",
    "Neon",
    "PagBank",
    "Banco do Nordeste",
  ],
  typePayment: ["Credit", "Debit", "Pix", "Cash"],
}));
