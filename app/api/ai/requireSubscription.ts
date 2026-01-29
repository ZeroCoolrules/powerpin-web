export async function requireSubscription(isSubscribed: boolean) {
  if (!isSubscribed) {
    return { redirect: { destination: "/billing", permanent: false } }
  }
  return { props: {} }
}
