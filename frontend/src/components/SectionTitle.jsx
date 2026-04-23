export default function SectionTitle({ title, subtitle }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '4px' }}>{title}</h3>
      <p style={{ color: 'var(--text-faint)', fontSize: '0.85rem', margin: 0 }}>{subtitle}</p>
    </div>
  );
}