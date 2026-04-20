export default function MessageBanner({ message, type = "info" }) {
  if (!message) return null;
  return <div className={`message-banner ${type}`}>{message}</div>;
}