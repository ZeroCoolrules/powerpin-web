// Who runs Qpids Place, for the legal pages. Set these on the deployment so
// the pages name the real business. Until they are set, the pages say
// "Qpids Place" and leave out the address and the governing-state line.
//   NEXT_PUBLIC_QPIDS_LEGAL_NAME       e.g. "Example Dating LLC"
//   NEXT_PUBLIC_QPIDS_LEGAL_ADDRESS    postal address, one line
//   NEXT_PUBLIC_QPIDS_CONTACT_EMAIL    where members write for help and privacy requests
//   NEXT_PUBLIC_QPIDS_GOVERNING_STATE  e.g. "Missouri"
const clean = (v: string | undefined) => (v || "").trim();

export const OPERATOR = {
  name: clean(process.env.NEXT_PUBLIC_QPIDS_LEGAL_NAME),
  address: clean(process.env.NEXT_PUBLIC_QPIDS_LEGAL_ADDRESS),
  email: clean(process.env.NEXT_PUBLIC_QPIDS_CONTACT_EMAIL),
  state: clean(process.env.NEXT_PUBLIC_QPIDS_GOVERNING_STATE),
};

// Change this date whenever the wording of a legal page changes.
export const LEGAL_UPDATED = "November 24, 2026";
