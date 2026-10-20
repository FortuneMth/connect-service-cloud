import { CustomerPanel } from "@/components/customers/customer-panel";
import type { CustomerRecord } from "@/data/customers";

export function CustomerDocuments({ customer }: { customer: CustomerRecord }) {
  return (
    <CustomerPanel title="Documents">
      {customer.documents.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No documents on this account yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="px-4 py-2 font-medium">Document</th>
                <th className="px-4 py-2 font-medium">Category</th>
                <th className="px-4 py-2 font-medium">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {customer.documents.map((document) => (
                <tr key={document.id} className="border-b last:border-b-0">
                  <td className="px-4 py-2.5 font-medium">{document.name}</td>
                  <td className="px-4 py-2.5 text-muted-foreground">{document.category}</td>
                  <td className="px-4 py-2.5 whitespace-nowrap text-muted-foreground">{document.uploadedLabel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </CustomerPanel>
  );
}
