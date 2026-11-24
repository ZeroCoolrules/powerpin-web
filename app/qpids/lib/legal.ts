// Who runs Qpids Place, for the legal pages. The values below are the
// defaults; set any of these on the deployment to override one.
//   NEXT_PUBLIC_QPIDS_LEGAL_NAME       e.g. "Example Dating LLC"
//   NEXT_PUBLIC_QPIDS_LEGAL_ADDRESS    postal address, one line
//   NEXT_PUBLIC_QPIDS_CONTACT_EMAIL    where members write for help and privacy requests
//   NEXT_PUBLIC_QPIDS_GOVERNING_STATE  e.g. "Missouri"
const clean = (v: string | undefined, fallback: string) => (v || "").trim() || fallback;

export const OPERATOR = {
  name: clean(process.env.NEXT_PUBLIC_QPIDS_LEGAL_NAME, "Dreamcadian LLC"),
  address: clean(process.env.NEXT_PUBLIC_QPIDS_LEGAL_ADDRESS, "4124 Carrolton Court, Apt A, Bridgeton, MO 63044"),
  email: clean(process.env.NEXT_PUBLIC_QPIDS_CONTACT_EMAIL, "support@dreamcadian.com"),
  state: clean(process.env.NEXT_PUBLIC_QPIDS_GOVERNING_STATE, "Missouri"),
};

// Change this date whenever the wording of a legal page changes.
export const LEGAL_UPDATED = "November 24, 2026";
