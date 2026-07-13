export type Certificate = {
  id: string;
  title: string;
  description: string;
  type: string;
  issuedOn: string;
  issuedBy: string;
  grade?: string;
  badgeColor: string;
  icon: string;
};

// Assuming it fetches from API in real world
export function useCertificates() {
  const certificates: Certificate[] = [];
  
  return {
    certificates,
    loading: false,
    error: null
  };
}
