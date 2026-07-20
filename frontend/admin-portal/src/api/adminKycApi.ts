// src/api/adminKycApi.ts
import axiosClient from "./axiosClient";

export type KycStatus = "PENDING" | "APPROVED" | "REJECTED";

/**
 * Backend shape returned by GET /api/users/kyc/pending
 * (based on your Postman screenshot)
 */
type BackendPendingKycItem = {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  mobile?: string | null;
  kycStatus: KycStatus;
  kycSubmittedAt?: string | null;

  // optional extra fields if backend sends them
  kycDocType?: string | null;
  kycDocNumber?: string | null;
};

export interface KycRequest {
  userId: number;
  email: string;
  fullName: string;
  mobile?: string;
  kycStatus: KycStatus;
  submittedAt?: string;
}

export interface KycDecisionRequest {
  status: "APPROVED" | "REJECTED";
  remarks?: string;
}

/**
 * Some controllers return JSON, some return empty body on success.
 * Keep everything optional.
 */
export interface KycDecisionResponse {
  userId?: number;
  kycStatus?: KycStatus;
  reviewedAt?: string;
  reviewer?: string;
  message?: string;
}

function buildFullName(firstName?: string | null, lastName?: string | null) {
  const fn = (firstName ?? "").trim();
  const ln = (lastName ?? "").trim();
  const full = `${fn} ${ln}`.trim();
  return full.length ? full : "-";
}

function mapPendingItemToKycRequest(item: BackendPendingKycItem): KycRequest {
  return {
    userId: item.id,
    email: item.email,
    fullName: buildFullName(item.firstName, item.lastName),
    mobile: item.mobile ?? undefined,
    kycStatus: item.kycStatus,
    submittedAt: item.kycSubmittedAt ?? undefined,
  };
}

export const adminKycApi = {
  // GET pending KYC list
  getPending: async (): Promise<KycRequest[]> => {
    const res = await axiosClient.get("/api/users/kyc/pending");

    const raw = (res.data ?? []) as BackendPendingKycItem[];
    if (!Array.isArray(raw)) return [];

    return raw.map(mapPendingItemToKycRequest);
  },

  // POST decision (approve/reject)
  decide: async (userId: number, payload: KycDecisionRequest): Promise<KycDecisionResponse> => {
    const res = await axiosClient.post(`/api/users/kyc/${userId}/decision`, payload);

    // If backend returns empty body, res.data may be "" or null.
    const data = res.data;
    if (!data || typeof data !== "object") {
      return {
        userId,
        kycStatus: payload.status,
        message: "KYC updated successfully",
      };
    }

    return data as KycDecisionResponse;
  },
};
