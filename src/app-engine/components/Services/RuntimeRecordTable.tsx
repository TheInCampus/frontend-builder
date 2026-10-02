export function RuntimeRecordTable({
  title,
  records,
}: {
  title: string;
  records: Array<Record<string, string>>;
}) {
  const columns = records[0] ? Object.keys(records[0]) : [];

  return (
    <section className="runtime-records" aria-label={title}>
      <div className="runtime-section-heading">
        <div><span className="runtime-eyebrow">LIVE DATA</span><h2>{title}</h2></div>
        <span className="runtime-record-count">{records.length} records</span>
      </div>
      {records.length ? (
        <div className="runtime-table-scroll">
          <table>
            <thead><tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
            <tbody>
              {records.map((record, index) => (
                <tr key={`${index}:${record.id ?? index}`}>
                  {columns.map((column) => <td key={column}>{record[column]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="runtime-empty">No records to show yet.</p>}
    </section>
  );
}
