import { SalesPanel } from "@/components/sales/sales-panel";
import type { OpportunityRecord } from "@/data/sales";

export function OpportunityContacts({ opportunity }: { opportunity: OpportunityRecord }) {
  return (
    <SalesPanel title="Contacts">
      {opportunity.contacts.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">No contacts on this opportunity.</p>
      ) : (
        <>
          <div className="hidden min-w-0 md:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b text-left text-xs text-muted-foreground">
                    <th className="px-4 py-2 font-medium">Name</th>
                    <th className="px-4 py-2 font-medium">Role</th>
                    <th className="px-4 py-2 font-medium">Email</th>
                    <th className="px-4 py-2 font-medium">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {opportunity.contacts.map((contact) => (
                    <tr key={contact.id} className="border-b last:border-b-0">
                      <td className="px-4 py-2.5 font-medium">{contact.name}</td>
                      <td className="px-4 py-2.5">{contact.role}</td>
                      <td className="px-4 py-2.5">{contact.email}</td>
                      <td className="px-4 py-2.5 whitespace-nowrap tabular-nums">{contact.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <ul className="flex flex-col md:hidden">
            {opportunity.contacts.map((contact) => (
              <li key={contact.id} className="border-b px-4 py-3 last:border-b-0">
                <p className="text-sm font-medium">{contact.name}</p>
                <p className="text-xs text-muted-foreground">{contact.role}</p>
                <p className="mt-2 text-sm break-all">{contact.email}</p>
                <p className="text-sm tabular-nums">{contact.phone}</p>
              </li>
            ))}
          </ul>
        </>
      )}
    </SalesPanel>
  );
}
