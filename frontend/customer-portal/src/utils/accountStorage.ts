export type PrimaryAccount = { accountNumber: string; balance?: number };

const KEY = "primaryAccount";

export function getPrimaryAccount(): PrimaryAccount | null {
  const raw = localStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as PrimaryAccount) : null;
}

export function setPrimaryAccount(acc: PrimaryAccount) {
  localStorage.setItem(KEY, JSON.stringify(acc));
}

export function clearPrimaryAccount() {
  localStorage.removeItem(KEY);
}
